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

  // ---------- ملف GLB للسجادة بالمقاس الحقيقي والصورة مدموجة ----------
  function rugGLB(jpg, W, L, round) {
    const T = 0.012, P = [], N = [], U = [], I = [];
    const quad = (pts, n, uv) => { const o = P.length / 3; pts.forEach((p, k) => { P.push(...p); N.push(...n); U.push(...uv[k]); }); I.push(o, o + 1, o + 2, o, o + 2, o + 3); };
    if (!round) {
      const x0 = -W / 2, x1 = W / 2, z0 = -L / 2, z1 = L / 2;
      quad([[x0, T, z1], [x1, T, z1], [x1, T, z0], [x0, T, z0]], [0, 1, 0], [[0, 1], [1, 1], [1, 0], [0, 0]]);
      quad([[x0, 0, z1], [x1, 0, z1], [x1, T, z1], [x0, T, z1]], [0, 0, 1], [[0, 1], [1, 1], [1, .995], [0, .995]]);
      quad([[x1, 0, z0], [x0, 0, z0], [x0, T, z0], [x1, T, z0]], [0, 0, -1], [[1, 0], [0, 0], [0, .005], [1, .005]]);
      quad([[x1, 0, z1], [x1, 0, z0], [x1, T, z0], [x1, T, z1]], [1, 0, 0], [[1, 1], [1, 0], [.995, 0], [.995, 1]]);
      quad([[x0, 0, z0], [x0, 0, z1], [x0, T, z1], [x0, T, z0]], [-1, 0, 0], [[0, 0], [0, 1], [.005, 1], [.005, 0]]);
    } else {
      const R = W / 2, seg = 96; P.push(0, T, 0); N.push(0, 1, 0); U.push(.5, .5);
      for (let k = 0; k <= seg; k++) { const a = k / seg * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); P.push(c * R, T, s * R); N.push(0, 1, 0); U.push(.5 + c * .5, .5 + s * .5); }
      for (let k = 1; k <= seg; k++) I.push(0, k + 1, k);
      const o = P.length / 3;
      for (let k = 0; k <= seg; k++) { const a = k / seg * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), u = .5 + c * .497, v = .5 + s * .497; P.push(c * R, 0, s * R, c * R, T, s * R); N.push(c, 0, s, c, 0, s); U.push(u, v, u, v); }
      for (let k = 0; k < seg; k++) { const a = o + k * 2; I.push(a, a + 1, a + 3, a, a + 3, a + 2); }
    }
    const f32 = (a) => new Uint8Array(new Float32Array(a).buffer), idx = new Uint8Array(new Uint32Array(I).buffer);
    const parts = [f32(P), f32(N), f32(U), idx, jpg], views = [], chunks = []; let off = 0;
    parts.forEach((b, i) => { views.push({ buffer: 0, byteOffset: off, byteLength: b.length, ...(i < 3 ? { target: 34962 } : i === 3 ? { target: 34963 } : {}) }); const pad = (4 - b.length % 4) % 4; chunks.push(b); if (pad) chunks.push(new Uint8Array(pad)); off += b.length + pad; });
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let k = 0; k < P.length; k += 3) for (let a = 0; a < 3; a++) { min[a] = Math.min(min[a], P[k + a]); max[a] = Math.max(max[a], P[k + a]); }
    const json = { asset: { version: '2.0', generator: 'dhubaibi-rug' }, scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: 'rug' }],
      meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 }, indices: 3, material: 0 }] }],
      materials: [{ name: 'rug', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: .95 } }],
      textures: [{ source: 0, sampler: 0 }], samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }], images: [{ bufferView: 4, mimeType: 'image/jpeg' }],
      accessors: [{ bufferView: 0, componentType: 5126, count: P.length / 3, type: 'VEC3', min, max }, { bufferView: 1, componentType: 5126, count: N.length / 3, type: 'VEC3' },
        { bufferView: 2, componentType: 5126, count: U.length / 2, type: 'VEC2' }, { bufferView: 3, componentType: 5125, count: I.length, type: 'SCALAR' }],
      bufferViews: views, buffers: [{ byteLength: off }] };
    let js = new TextEncoder().encode(JSON.stringify(json)); const jp = (4 - js.length % 4) % 4; if (jp) { const t = new Uint8Array(js.length + jp).fill(32); t.set(js); js = t; }
    return new Blob([new Uint32Array([0x46546c67, 2, 28 + js.length + off]), new Uint32Array([js.length, 0x4e4f534a]), js, new Uint32Array([off, 0x004e4942]), ...chunks], { type: 'model/gltf-binary' });
  }


  // ---------- الأثاث: صورة المنتج الحقيقية مقصوصة وواقفة بمقاسها الحقيقي ----------
  window.hasModel3D = (p) => !!(p && (p.arPhoto || []).length);
  window.openModelAR = async function (p, startHex) {
    const items = p.arPhoto;
    let ci = Math.max(0, items.findIndex(x => x.hex && x.hex === startHex));
    const ov = document.createElement('div'); ov.className = 'arv';
    ov.innerHTML = `<div class="arv-box" role="dialog" aria-label="شوفها في بيتك">
      <div class="arv-top"><b>${e(p.name)}</b><button class="arv-x" aria-label="إغلاق">✕</button></div>
      <div class="arv-stage"><div class="arv-load">جاري التجهيز...</div></div>
      <div class="arv-hint">المقاس الحقيقي: <b dir="ltr" class="arv-size"></b></div>
      ${items.length > 1 ? `<div class="arv-row"><span>اللون</span><div class="arv-cols">${items.map((x, i) => `<button class="${i === ci ? 'on' : ''}" data-c="${i}" title="${e(x.name)}"><img src="${e(x.img)}" alt="" style="object-fit:contain;background:#f6f3ec"></button>`).join('')}</div></div>` : ''}
      <button class="arv-go" type="button"><span>📱</span> شوفها في بيتك بالكاميرا</button>
      <div class="arv-note"></div>
      <p class="arv-disc">بالكاميرا تنحط صورة المنتج الحقيقية بمقاسه في مكانك — قف قدامها عشان تشوفها بأفضل شكل.</p>
    </div>`;
    document.body.append(ov); document.body.style.overflow = 'hidden';
    const close = () => { ov.remove(); document.body.style.overflow = ''; };
    ov.querySelector('.arv-x').onclick = close;
    ov.addEventListener('click', (ev) => { if (ev.target === ov) close(); });
    try { await loadMV(); } catch { ov.querySelector('.arv-load').textContent = 'تعذّر تحميل العارض — تأكد من الإنترنت'; return; }
    const mv = document.createElement('model-viewer');
    for (const [k, v] of Object.entries({ 'camera-controls': '', 'touch-action': 'pan-y', 'shadow-intensity': '0', exposure: '1', 'environment-image': 'neutral', 'tone-mapping': 'neutral',
      'camera-orbit': '0deg 80deg auto', 'min-camera-orbit': '-35deg 60deg auto', 'max-camera-orbit': '35deg 92deg auto', 'disable-zoom': '',
      ar: '', 'ar-modes': 'webxr scene-viewer quick-look', 'ar-scale': 'fixed', 'ar-placement': 'floor', 'interaction-prompt': 'none', alt: 'صورة المنتج بمقاسها الحقيقي' })) mv.setAttribute(k, v);
    mv.innerHTML = '<button slot="ar-button" hidden></button>';
    const stage = ov.querySelector('.arv-stage'); stage.classList.add('photo'); stage.append(mv);
    mv.addEventListener('load', () => stage.querySelector('.arv-load')?.remove());
    const show = () => { const it = items[ci]; mv.src = new URL(it.glb, location.href).href; ov.querySelector('.arv-size').textContent = it.size || ''; };
    show();
    ov.querySelector('.arv-cols')?.addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b) return; ci = +b.dataset.c;
      ov.querySelectorAll('.arv-cols button').forEach(x => x.classList.toggle('on', x === b)); show();
    });
    const note = ov.querySelector('.arv-note');
    ov.querySelector('.arv-go').onclick = async () => {
      await mv.updateComplete;
      if (mv.canActivateAR) return mv.activateAR();
      note.textContent = isPhone() ? 'جوالك ما يدعم الكاميرا ثلاثية الأبعاد في هذا المتصفح — جرّب Chrome على أندرويد أو Safari على الآيفون.' : 'افتح صفحة المنتج من جوالك واضغط هذا الزر — الكاميرا تشتغل على الجوال.';
    };
  };

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
      <div class="arv-row arv-room"><span>غرفتك</span><div class="arv-roomin"><input inputmode="decimal" placeholder="العرض م" aria-label="عرض الغرفة بالمتر"><i>×</i><input inputmode="decimal" placeholder="الطول م" aria-label="طول الغرفة بالمتر"></div></div>
      <div class="arv-fit"></div>
      <div class="arv-row"><span>المقاس</span><div class="arv-sizes">${sizes.map((s, i) => `<button class="${i === si ? 'on' : ''}" data-s="${i}">${e(s.label)}</button>`).join('')}</div></div>
      <button class="arv-go" type="button"><span>📱</span> شوفها في بيتك بالكاميرا</button>
      <div class="arv-note"></div>
    </div>`;
    document.body.append(ov); document.body.style.overflow = 'hidden';
    const glbCacheRef = {};
    const close = () => { ov.remove(); document.body.style.overflow = ''; Object.values(glbCacheRef).forEach(u => URL.revokeObjectURL(u)); };
    ov.querySelector('.arv-x').onclick = close;
    ov.addEventListener('click', (ev) => { if (ev.target === ov) close(); });

    try { await loadMV(); } catch { ov.querySelector('.arv-load').textContent = 'تعذّر تحميل العارض — تأكد من الإنترنت'; return; }
    const mv = document.createElement('model-viewer');
    for (const [k, v] of Object.entries({
      'camera-controls': '', 'touch-action': 'pan-y', 'auto-rotate': '', 'auto-rotate-delay': '800', 'rotation-per-second': '18deg',
      'shadow-intensity': '1', 'shadow-softness': '0.9', 'exposure': '1.05', 'environment-image': 'neutral',
      'camera-orbit': '25deg 58deg auto', 'min-camera-orbit': 'auto 0deg auto', 'max-camera-orbit': 'auto 88deg auto',
      'ar': '', 'ar-modes': 'webxr quick-look', 'ar-scale': 'fixed', 'ar-placement': 'floor', 'interaction-prompt': 'none',
      'alt': 'مجسم ثلاثي الأبعاد للسجادة'
    })) mv.setAttribute(k, v);
    mv.innerHTML = '<button slot="ar-button" hidden></button>';
    const stage = ov.querySelector('.arv-stage'); stage.append(mv);

    // كل لون ومقاس = ملف 3D مستقل والصورة مدموجة فيه بالمقاس الحقيقي بالمتر — عشان تظهر صح في كاميرا الآيفون والأندرويد
    const jpgCache = {}, glbCache = glbCacheRef;
    const texBytes = (src) => jpgCache[src] || (jpgCache[src] = (async () => {
      const img = await new Promise((ok, no) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => ok(i); i.onerror = no; i.src = new URL(src, location.href).href; });
      const k = Math.min(1, 2048 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const b = await new Promise(r => c.toBlob(r, 'image/jpeg', .88)); return new Uint8Array(await b.arrayBuffer());
    })());
    const show = async () => {
      const key = ci + ':' + si;
      try {
        if (!glbCache[key]) { const s = sizes[si]; glbCache[key] = URL.createObjectURL(rugGLB(await texBytes(items[ci].src), s.w / 100, s.l / 100, round)); }
        mv.src = glbCache[key];
      } catch { const l = ov.querySelector('.arv-load'); if (l) l.textContent = 'تعذّر تحميل صورة السجادة'; }
    };
    mv.addEventListener('load', () => stage.querySelector('.arv-load')?.remove());
    show();

    ov.querySelector('.arv-cols')?.addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b) return; ci = +b.dataset.c;
      ov.querySelectorAll('.arv-cols button').forEach(x => x.classList.toggle('on', x === b)); show();
    });
    const pickSize = (i) => { si = i; ov.querySelectorAll('.arv-sizes button').forEach((x, k) => x.classList.toggle('on', k === i)); show(); };
    ov.querySelector('.arv-sizes').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) pickSize(+b.dataset.s); });
    // مقاس الغرفة ← أنسب مقاس سجادة (يترك أرضية مكشوفة حول السجادة)
    const room = ov.querySelector('.arv-room'), fit = ov.querySelector('.arv-fit');
    room?.addEventListener('input', () => {
      const [a, b] = [...room.querySelectorAll('input')].map(i => parseFloat(String(i.value).replace(',', '.')) || 0).sort((x, y) => x - y);
      if (!a || !b) { fit.textContent = ''; return; }
      const W = a * 100, L = b * 100, margin = Math.min(W, L) < 300 ? 60 : 100;
      let best = -1; sizes.forEach((s, i) => { if (s.w <= W - margin && s.l <= L - margin) best = i; });
      if (best < 0) { fit.textContent = 'الغرفة صغيرة على المقاسات المتوفرة — كلمنا ونفصّل لك مقاس خاص'; return; }
      pickSize(best); fit.innerHTML = `المقاس الأنسب لغرفتك: <b>${e(sizes[best].label)}</b> — اخترناه لك وتقدر تشوفه الحين بالكاميرا`;
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
