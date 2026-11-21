import numpy as np
from PIL import Image, ImageFilter
from pathlib import Path

SRC = Path(__file__).resolve().parent
OUT = Path(__file__).resolve().parents[4] / "assets/hero"
LAB = Path(__file__).resolve().parents[1] / "lab/hero-src"
OUT.mkdir(parents=True, exist_ok=True)
LAB.mkdir(parents=True, exist_ok=True)


def key(img, lo, hi, delta_r, delta_b):
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    h, w, _ = a.shape
    corners = np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    magenta = np.minimum(r, b) - g
    bg_m = min(bg[0], bg[2]) - bg[1]
    alpha = np.clip((bg_m - lo - magenta) / (hi - lo), 0, 1)
    a[..., 0] = np.minimum(r, g + delta_r)
    a[..., 2] = np.minimum(b, g + delta_b)
    return a, alpha, bg


def to_img(rgb, alpha):
    out = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha * 255, 0, 255)]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def checker_preview(im, name, colour):
    bg = Image.new("RGBA", im.size, colour)
    bg.alpha_composite(im)
    bg.convert("RGB").save(LAB / name, quality=88)


# ---------- ball ----------
ball_src = Image.open(SRC / "ball-key.jpg")
rgb, alpha, bg = key(ball_src, 25, 95, 14, 26)
print("ball bg", bg)
m = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
alpha = np.asarray(m).astype(np.float32) / 255
ys, xs = np.where(alpha > 0.5)
y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
pad = 6
rgb = rgb[y0 - pad:y1 + pad, x0 - pad:x1 + pad]
alpha = alpha[y0 - pad:y1 + pad, x0 - pad:x1 + pad]
h, w = alpha.shape
yy, xx = np.mgrid[0:h, 0:w]
cy, cx, rad = h / 2, w / 2, min(h, w) / 2
# floodlights from behind/upper-left: darker underside, slight rim on top-right
vert = 1.0 - 0.5 * np.clip((yy - h * 0.25) / (h * 0.75), 0, 1) ** 1.3
side = 1.0 - 0.18 * np.clip((cx - xx) / rad, 0, 1)
d = np.sqrt((yy - cy) ** 2 + (xx - cx) ** 2) / rad
rim = 1.0 + 0.22 * np.clip((d - 0.86) / 0.14, 0, 1) * np.clip((cy - yy) / rad + 0.3, 0, 1)
shade = (vert * side * rim * 0.8)[..., None]
grade = np.array([0.9, 0.97, 1.06])
rgb = rgb * shade * grade
ball = to_img(rgb, alpha)
ball = ball.resize((900, round(900 * h / w)), Image.LANCZOS)
ball.save(OUT / "ball.webp", quality=88, method=6)
checker_preview(ball, "ball-on-red.jpg", (220, 40, 40, 255))
checker_preview(ball, "ball-on-navy.jpg", (6, 13, 24, 255))
print("ball", ball.size)

# ---------- grass ----------
grass_src = Image.open(SRC / "grass-key.jpg")
rgb, alpha, bg = key(grass_src, 25, 120, 4, 10)
print("grass bg", bg)
h, w = alpha.shape
solid = alpha > 0.92
first = np.where(solid.any(axis=0), solid.argmax(axis=0), h)
rows = np.arange(h)[:, None]
alpha = np.where(rows >= first[None, :], 1.0, alpha)
g = rgb[..., 1]
rgb[..., 0] = np.minimum(rgb[..., 0], g * 0.62)
rgb[..., 2] = np.minimum(rgb[..., 2], g * 0.78)
tip = (1 - alpha)[..., None]
rgb = rgb * (np.array([0.78, 0.86, 0.9]) * (1 - 0.45 * tip))
grass = to_img(rgb, alpha).resize((2400, round(2400 * h / w)), Image.LANCZOS)
ga = np.asarray(grass)
top = np.where((ga[..., 3] > 8).any(axis=1))[0].min()
grass = grass.crop((0, max(0, top - 4), grass.width, grass.height))
grass.save(OUT / "grass.webp", quality=84, method=6)
checker_preview(grass, "grass-on-red.jpg", (220, 40, 40, 255))
print("grass", grass.size)

# ---------- plates ----------
for name, size, out in [
    ("hero-plate-v2.jpg", (2400, 1350), "plate.webp"),
    ("hero-plate-m-v2.jpg", (1080, 1920), "plate-m.webp"),
]:
    p = Image.open(SRC / name).convert("RGB").resize(size, Image.LANCZOS)
    p = p.filter(ImageFilter.UnsharpMask(radius=1.4, percent=60, threshold=2))
    p.save(OUT / out, quality=82, method=6)
    print(out, p.size, (OUT / out).stat().st_size // 1024, "KB")

for f in ["ball.webp", "grass.webp"]:
    print(f, (OUT / f).stat().st_size // 1024, "KB")
