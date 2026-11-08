// «شوفها في بيتك» — عرض السجادة ثلاثي الأبعاد + الواقع المعزز بالكاميرا
(function () {
  const MV = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
  let mvReady = null;
  const loadMV = () => mvReady || (mvReady = import(MV));
  const e = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isPhone = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

  // المقاسات: "160×230, 200×300" أو للدائري "150, 200"
  function parseSizes(str, round) {
    const out = [];
    for (const part of String(str || '').split(/[,،\n]+/)) {
      const n = (part.match(/\d+(\.\d+)?/g) || []).map(Number);
      if (round && n[0]) out.push({ w: n[0], l: n[0], label: `${n[0]} سم` });
      else if (n.length >= 2) { const [a, b] = n[0] <= n[1] ? [n[0], n[1]] : [n[1], n[0]]; out.push({ w: a, l: b, label: `${a}×${b}` }); }
    }
    if (out.length) return out;
    return round ? [150, 200, 250].map(d => ({ w: d, l: d, label: `${d} سم` }))
      : [[160, 230], [200, 300], [250, 350], [300, 400]].map(([w, l]) => ({ w, l, label: `${w}×${l}` }));
  }

  window.hasRugAR = (p) => !!(p && (p.arItems || []).some(x => x.src));

  window.openRugAR = async function (p, start = 0, srcOf = (s) => s) {
    const round = !!p.arRound;
    const items = (p.arItems || []).filter(x => x.src);
    const sizes = parseSizes(p.arSizes, round);
    let ci = Math.min(start, items.length - 1), si = Math.min(1, sizes.length - 1);
    const ov = document.createElement('div'); ov.className = 'arv';
    ov.innerHTML = `<div class="arv-box" role="dialog" aria-label="شوفها في بيتك">
      <div class="arv-top"><b>${e(p.name)}</b><button class="arv-x" aria-label="إغلاق">✕</button></div>
      <div class="arv-stage"><div class="arv-load">جاري تجهيز المجسم...</div></div>
      <div class="arv-hint">↻ اسحب بإصبعك عشان تدوّرها وتشوفها من كل جهة</div>
      ${items.length > 1 ? `<div class="arv-row"><span>اللون</span><div class="arv-cols">${items.map((x, i) => `<button class="${i === ci ? 'on' : ''}" data-c="${i}" title="${e(x.name)}"><img src="${e(srcOf(x.src, 320))}" alt=""></button>`).join('')}</div></div>` : ''}
      <div class="arv-row"><span>المقاس</span><div class="arv-sizes">${sizes.map((s, i) => `<button class="${i === si ? 'on' : ''}" data-s="${i}">${e(s.label)}</button>`).join('')}</div></div>
      <button class="arv-go" type="button"><span>📱</span> شوفها في بيتك بالكاميرا</button>
      <div class="arv-note"></div>
    </div>`;
    document.body.append(ov); document.body.style.overflow = 'hidden';
    const close = () => { ov.remove(); document.body.style.overflow = ''; };
    ov.querySelector('.arv-x').onclick = close;
    ov.addEventListener('click', (ev) => { if (ev.target === ov) close(); });

    try { await loadMV(); } catch { ov.querySelector('.arv-load').textContent = 'تعذّر تحميل العارض — تأكد من الإنترنت'; return; }
    const mv = document.createElement('model-viewer');
    const base = document.querySelector('script[src$="ar.js"]')?.src.replace(/ar\.js.*$/, '') || '';
    Object.assign(mv, { src: base + (round ? 'assets/rug-round.glb' : 'assets/rug-rect.glb') });
    for (const [k, v] of Object.entries({
      'camera-controls': '', 'touch-action': 'pan-y', 'auto-rotate': '', 'auto-rotate-delay': '800', 'rotation-per-second': '18deg',
      'shadow-intensity': '1', 'shadow-softness': '0.9', 'exposure': '1.05', 'environment-image': 'neutral',
      'camera-orbit': '25deg 58deg auto', 'min-camera-orbit': 'auto 0deg auto', 'max-camera-orbit': 'auto 88deg auto',
      'ar': '', 'ar-modes': 'webxr quick-look', 'ar-scale': 'fixed', 'ar-placement': 'floor', 'interaction-prompt': 'none',
      'alt': 'مجسم ثلاثي الأبعاد للسجادة'
    })) mv.setAttribute(k, v);
    mv.innerHTML = '<button slot="ar-button" hidden></button>';
    const stage = ov.querySelector('.arv-stage'); stage.append(mv);

    const texCache = {};
    const applyTex = async () => {
      if (!mv.model) return;
      const url = new URL(items[ci].src, location.href).href;
      const tex = texCache[url] || (texCache[url] = await mv.createTexture(url));
      mv.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(tex);
    };
    const applySize = () => { const s = sizes[si]; mv.scale = `${s.w / 100} 1 ${s.l / 100}`; mv.updateFraming?.(); };
    mv.addEventListener('load', async () => { applySize(); await applyTex(); stage.querySelector('.arv-load')?.remove(); }, { once: true });

    ov.querySelector('.arv-cols')?.addEventListener('click', async (ev) => {
      const b = ev.target.closest('button'); if (!b) return; ci = +b.dataset.c;
      ov.querySelectorAll('.arv-cols button').forEach(x => x.classList.toggle('on', x === b)); await applyTex();
    });
    ov.querySelector('.arv-sizes').addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b) return; si = +b.dataset.s;
      ov.querySelectorAll('.arv-sizes button').forEach(x => x.classList.toggle('on', x === b)); applySize();
    });

    const note = ov.querySelector('.arv-note');
    ov.querySelector('.arv-go').onclick = async () => {
      await mv.updateComplete;
      if (mv.canActivateAR) { mv.activateAR(); return; }
      if (!isPhone()) {
        if (!window.qrcode) await new Promise(ok => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'; s.onload = s.onerror = ok; document.head.append(s); });
        note.innerHTML = `افتح صفحة السجادة من جوالك واضغط هذا الزر — الكاميرا تشتغل على الجوال.<canvas class="arv-qr"></canvas>`;
        if (window.qrcode) { const q = qrcode(0, 'M'); q.addData(location.href); q.make(); const c = note.querySelector('canvas'), n = q.getModuleCount(), k = 4; c.width = c.height = (n + 4) * k; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#111'; for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) if (q.isDark(r, cc)) g.fillRect((cc + 2) * k, (r + 2) * k, k, k); }
        else note.querySelector('canvas').remove();
      } else note.textContent = 'جوالك ما يدعم الكاميرا ثلاثية الأبعاد في هذا المتصفح — جرّب Chrome على أندرويد أو Safari على الآيفون، وتقدر تدوّر المجسم فوق.';
    };
    mv.addEventListener('ar-status', (ev) => { if (ev.detail.status === 'failed') note.textContent = 'ما قدرت أفتح الكاميرا — تأكد إنك سمحت للموقع يستخدمها، ووجّه الجوال على الأرض.'; });
  };
})();
