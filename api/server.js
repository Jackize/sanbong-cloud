import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || '/data';
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

const MAIL_TO = process.env.MAIL_TO || 'dichvu@sanbong.cloud';
const MAIL_FROM = process.env.MAIL_FROM || 'SanBong Cloud <onboarding@resend.dev>';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

const SPORT_LABELS = {
  'bong-da': 'Sân bóng đá',
  pickleball: 'Pickleball',
  'bong-ro': 'Bóng rổ',
  'quan-vot': 'Quần vợt',
  'cau-long': 'Cầu lông',
  khac: 'Khác',
};

const NEED_LABELS = {
  website: 'Website thương mại',
  app: 'App quản lý sân',
  both: 'Cả website & app',
};

const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

function wantsJson(req) {
  const accept = req.get('accept') || '';
  return accept.includes('application/json') || req.is('application/json');
}

function respondContactResult(req, res, payload, statusCode = 200) {
  if (wantsJson(req)) {
    return res.status(statusCode).json(payload);
  }
  if (payload.ok) {
    return res.redirect(303, '/?sent=1#lien-he');
  }
  return res.redirect(303, '/?error=1#lien-he');
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(SUBMISSIONS_FILE);
  } catch {
    await fs.writeFile(SUBMISSIONS_FILE, '[]', 'utf8');
  }
}

async function saveSubmission(entry) {
  await ensureDataDir();
  const raw = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
  const list = JSON.parse(raw);
  list.push(entry);
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function buildTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function formatMailContent({ name, phone, sport, need, message }) {
  const sportLabel = SPORT_LABELS[sport] || sport;
  const needLabel = NEED_LABELS[need] || need;
  const text = [
    'Yêu cầu tư vấn mới từ sanbong.cloud',
    '',
    `Họ tên: ${name}`,
    `SĐT/Zalo: ${phone}`,
    `Loại sân: ${sportLabel}`,
    `Nhu cầu: ${needLabel}`,
    message ? `Ghi chú: ${message}` : '',
    '',
    `Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
  ].filter(Boolean).join('\n');

  const html = `
    <h2>Yêu cầu tư vấn mới</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Họ tên</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>SĐT/Zalo</strong></td><td>${escapeHtml(phone)}</td></tr>
      <tr><td><strong>Loại sân</strong></td><td>${escapeHtml(sportLabel)}</td></tr>
      <tr><td><strong>Nhu cầu</strong></td><td>${escapeHtml(needLabel)}</td></tr>
      ${message ? `<tr><td><strong>Ghi chú</strong></td><td>${escapeHtml(message)}</td></tr>` : ''}
    </table>
    <p style="color:#666;font-size:12px">Gửi từ form liên hệ sanbong.cloud</p>
  `;

  return {
    sportLabel,
    subject: `[SanBong Cloud] Tư vấn — ${name} (${sportLabel})`,
    text,
    html,
  };
}

async function sendViaResend(payload) {
  if (!RESEND_API_KEY) return false;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [MAIL_TO],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend ${res.status}: ${err}`);
  }
  return true;
}

async function sendViaSmtp(payload) {
  const transporter = buildTransporter();
  if (!transporter) return false;

  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
  return true;
}

async function sendMail(entry) {
  const payload = formatMailContent(entry);

  if (RESEND_API_KEY) {
    await sendViaResend(payload);
    return true;
  }

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    await sendViaSmtp(payload);
    return true;
  }

  console.warn('[contact] Chưa cấu hình RESEND_API_KEY hoặc SMTP — chỉ lưu file');
  return false;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    emailConfigured: Boolean(RESEND_API_KEY || (SMTP_HOST && SMTP_USER && SMTP_PASS)),
    mailTo: MAIL_TO,
  });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, sport, need, message, _gotcha } = req.body || {};

    if (_gotcha) {
      return respondContactResult(req, res, { ok: true, emailed: false });
    }

    if (!name?.trim() || !phone?.trim() || !sport || !need) {
      return respondContactResult(
        req,
        res,
        { ok: false, error: 'Thiếu thông tin bắt buộc' },
        400,
      );
    }

    const entry = {
      id: Date.now().toString(36),
      name: name.trim(),
      phone: phone.trim(),
      sport,
      need,
      message: message?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    await saveSubmission(entry);
    const emailed = await sendMail(entry);

    console.log(`[contact] Lưu OK id=${entry.id} email=${emailed ? 'sent' : 'skipped'}`);

    respondContactResult(req, res, { ok: true, emailed });
  } catch (err) {
    console.error('[contact] Lỗi:', err.message);
    respondContactResult(req, res, { ok: false, error: 'Không gửi được yêu cầu' }, 500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const mode = RESEND_API_KEY ? 'resend' : (SMTP_PASS ? 'smtp' : 'file-only');
  console.log(`SanBong contact API :${PORT} → ${MAIL_TO} (mode=${mode})`);
});
