/* SanBong Cloud — Scroll Clock signature + chrome + contact form */
(function () {
  var DEMO = {
    pitches: ["Sân 1", "Sân 2", "Sân 3"],
    hours: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    // hourIndex, pitchIndex, name, kind: book | conflict | resolve
    events: [
      { at: 0.08, hour: 0, pitch: 0, name: "Team FC 5", kind: "book" },
      { at: 0.16, hour: 0, pitch: 1, name: "Nhóm A", kind: "book" },
      { at: 0.24, hour: 1, pitch: 0, name: "Công ty X", kind: "book" },
      { at: 0.32, hour: 1, pitch: 2, name: "Sinh viên K", kind: "book" },
      { at: 0.40, hour: 2, pitch: 1, name: "Pickle Club", kind: "book" },
      { at: 0.48, hour: 2, pitch: 0, name: "Gia đình B", kind: "book" },
      { at: 0.56, hour: 3, pitch: 0, name: "Yêu cầu A", kind: "conflict" },
      { at: 0.62, hour: 3, pitch: 0, name: "Yêu cầu B", kind: "conflict" },
      { at: 0.72, hour: 3, pitch: 0, name: "Yêu cầu A", kind: "resolve" },
      { at: 0.80, hour: 3, pitch: 1, name: "VIP 7", kind: "book" },
      { at: 0.88, hour: 4, pitch: 2, name: "Đối kháng", kind: "book" },
      { at: 0.94, hour: 5, pitch: 1, name: "Ca đêm", kind: "book" }
    ]
  };

  var rush = document.getElementById("act-rush");
  var clockEl = document.getElementById("scroll-clock");
  var clockSub = document.getElementById("scroll-clock-sub");
  var toastEl = document.getElementById("rush-toast");
  var pillEl = document.getElementById("rush-pill");
  var rushSlots = [];

  function buildBoard(root, collect) {
    if (!root) return;
    var grid = root.querySelector("[data-board]");
    if (!grid) return;
    var prefix = root.id || "board";
    grid.innerHTML = "";
    grid.insertAdjacentHTML("beforeend", '<div class="board__corner" aria-hidden="true"></div>');
    DEMO.pitches.forEach(function (p) {
      grid.insertAdjacentHTML("beforeend", '<div class="board__col">' + p + "</div>");
    });
    DEMO.hours.forEach(function (h, hi) {
      grid.insertAdjacentHTML(
        "beforeend",
        '<div class="board__hour"><span>' + h + "</span></div>"
      );
      DEMO.pitches.forEach(function (_p, pi) {
        var id = prefix + "-slot-" + hi + "-" + pi;
        grid.insertAdjacentHTML(
          "beforeend",
          '<div class="board__slot" id="' +
            id +
            '" data-hour="' +
            hi +
            '" data-pitch="' +
            pi +
            '" role="gridcell">' +
            '<div class="board__chip"><strong></strong><span></span><em></em></div>' +
            "</div>"
        );
        if (collect) {
          collect.push({
            el: grid.querySelector("#" + id),
            hour: hi,
            pitch: pi
          });
        }
      });
    });
  }

  function clearBoard() {
    rushSlots.forEach(function (s) {
      s.el.classList.remove("is-free", "is-busy", "is-mine", "is-conflict");
      var chip = s.el.querySelector(".board__chip");
      chip.querySelector("strong").textContent = "";
      chip.querySelector("span").textContent = "";
      chip.querySelector("em").textContent = "";
    });
  }

  function slotEl(hour, pitch) {
    return document.getElementById("act-rush-slot-" + hour + "-" + pitch);
  }

  function applyEvent(ev) {
    var el = slotEl(ev.hour, ev.pitch);
    if (!el) return;
    var chip = el.querySelector(".board__chip");
    var strong = chip.querySelector("strong");
    var span = chip.querySelector("span");
    var em = chip.querySelector("em");

    if (ev.kind === "book") {
      el.classList.remove("is-free", "is-conflict");
      el.classList.add("is-busy");
      strong.textContent = ev.name;
      span.textContent = DEMO.hours[ev.hour] + " · " + DEMO.pitches[ev.pitch];
      em.textContent = "Đã đặt";
    } else if (ev.kind === "conflict") {
      el.classList.add("is-busy", "is-conflict");
      strong.textContent = "Trùng lịch";
      span.textContent = ev.name;
      em.textContent = "Xử lý…";
      if (toastEl) {
        toastEl.innerHTML =
          "<strong>Trùng khung " +
          DEMO.hours[ev.hour] +
          "</strong> — hệ thống giữ một suất, báo suất còn lại.";
      }
    } else if (ev.kind === "resolve") {
      el.classList.remove("is-conflict", "is-busy");
      el.classList.add("is-mine");
      strong.textContent = ev.name;
      span.textContent = DEMO.hours[ev.hour] + " · tự xác nhận";
      em.textContent = "Đã xác nhận";
      if (toastEl) {
        toastEl.innerHTML =
          "<strong>Xung đột đã xử lý</strong> — khách nhận SMS, suất trống mở lại cho Sân 2.";
      }
      var free = slotEl(ev.hour, 1);
      if (free && !free.classList.contains("is-busy") && !free.classList.contains("is-mine")) {
        free.classList.add("is-free");
      }
    }
  }

  function hourLabel(p) {
    // Map progress to 17:00 → 22:45
    var start = 17 * 60;
    var end = 22 * 60 + 45;
    var mins = Math.round(start + (end - start) * p);
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }

  var lastApplied = -1;

  function syncRush(p) {
    if (!rush) return;
    if (clockEl) clockEl.textContent = hourLabel(p);
    if (clockSub) {
      clockSub.textContent =
        p < 0.08 ? "Chưa có đặt" : p < 0.56 ? "Đang nhận đặt" : p < 0.72 ? "Giờ cao điểm" : "Ổn định";
    }
    if (pillEl) {
      pillEl.dataset.state = p < 0.08 ? "wait" : "live";
      pillEl.textContent = p < 0.08 ? "Chờ khách gọi" : "Tự vận hành";
    }

    var maxIdx = -1;
    for (var i = 0; i < DEMO.events.length; i++) {
      if (p >= DEMO.events[i].at) maxIdx = i;
    }
    if (maxIdx === lastApplied) return;

    clearBoard();
    if (p >= 0.04) {
      rushSlots.forEach(function (s) {
        s.el.classList.add("is-free");
      });
    }
    for (var j = 0; j <= maxIdx; j++) applyEvent(DEMO.events[j]);
    lastApplied = maxIdx;

    if (maxIdx < 0 && toastEl) {
      toastEl.innerHTML =
        "<strong>Demo kịch bản</strong> — cuộn để đồng hồ đêm chạy và lịch tự lấp đầy.";
    }
  }

  buildBoard(document.getElementById("act-empty"), null);
  buildBoard(document.getElementById("act-rush"), rushSlots);
  var emptyPill = document.getElementById("empty-pill");
  if (emptyPill) {
    emptyPill.dataset.state = "wait";
    emptyPill.textContent = "Chờ khách gọi";
  }

  function readRushProgress() {
    if (!rush) return 0;
    var raw = getComputedStyle(rush).getPropertyValue("--sc-p").trim();
    var p = parseFloat(raw);
    return Number.isFinite(p) ? p : 0;
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    // Show final boarded state without scrubbing the night
    syncRush(1);
  } else {
    var raf = 0;
    function tick() {
      syncRush(readRushProgress());
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    document.addEventListener(
      "visibilitychange",
      function () {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(tick);
      },
      { passive: true }
    );
  }

  // Chrome tab current section
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".app-chrome__tabs a"));
  var sections = tabs
    .map(function (a) {
      var id = (a.getAttribute("href") || "").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateTabs() {
    var y = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= y) current = sec;
    });
    tabs.forEach(function (a) {
      var on = current && a.getAttribute("href") === "#" + current.id;
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", updateTabs, { passive: true });
  updateTabs();

  // Contact form (preserve existing API)
  var form = document.querySelector(".close-form");
  if (form) {
    var statusEl = form.querySelector(".form-note");
    var btn = form.querySelector('button[type="submit"]');
    var originalLabel = btn ? btn.textContent : "Tư vấn miễn phí";

    function showStatus(message, isError) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.toggle("is-error", Boolean(isError));
    }

    form.addEventListener("submit", function (e) {
      var data = {
        name: (form.querySelector('[name="name"]')?.value || "").trim(),
        phone: (form.querySelector('[name="phone"]')?.value || "").trim(),
        sport: form.querySelector('[name="sport"]')?.value || "",
        need: form.querySelector('[name="need"]')?.value || "",
        message: (form.querySelector('[name="message"]')?.value || "").trim(),
        _gotcha: form.querySelector('[name="_gotcha"]')?.value || ""
      };

      if (!data.name) {
        e.preventDefault();
        showStatus("Vui lòng nhập họ và tên.", true);
        return;
      }
      if (!data.phone) {
        e.preventDefault();
        showStatus("Vui lòng nhập số điện thoại / Zalo.", true);
        return;
      }
      if (!data.sport) {
        e.preventDefault();
        showStatus("Vui lòng chọn loại hình sân.", true);
        return;
      }
      if (!data.need) {
        e.preventDefault();
        showStatus("Vui lòng chọn nhu cầu.", true);
        return;
      }
      if (!window.fetch) return;

      e.preventDefault();
      btn.disabled = true;
      btn.textContent = "Đang gửi…";
      showStatus("", false);

      fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { ok: res.ok, body: body };
          });
        })
        .then(function (result) {
          if (result.ok) {
            showStatus(result.body.message || "Đã gửi. Chúng tôi sẽ liên hệ trong 24 giờ.", false);
            form.reset();
          } else {
            showStatus(
              (result.body && result.body.error) || "Gửi thất bại. Thử lại hoặc email dichvu@sanbong.cloud.",
              true
            );
          }
        })
        .catch(function () {
          showStatus("Không kết nối được máy chủ. Thử lại sau.", true);
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = originalLabel;
        });
    });
  }
})();
