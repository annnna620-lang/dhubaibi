// ===================== التفصيل ثلاثي الأبعاد =====================
// يبني مجسم القطعة (GLB) مباشرة من اختيارات العميل: المقاس والشكل والخامة واللون والسطح والأرجل والأبواب
// ويعرضه بـ model-viewer: دوران 360° + الواقع المعزز بالكاميرا. يعتمد على CC / CS / OPT / METAL / pieceOf من custom.js
(function () {
  const MV = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
  let mvReady = null;
  const loadMV = () => mvReady || (mvReady = import(MV));

  // ---------- ألوان ----------
  const rgb = (hex) => { const n = parseInt(String(hex).slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  const lin = (c) => c.map(v => Math.pow(v, 2.2));
  const mix = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = c => Math.max(0, Math.min(255, Math.round(c * k))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(c => f(c).toString(16).padStart(2, '0')).join(''); };

  // ---------- ملمس الخامات (رسم بالـ canvas) ----------
  const texCache = {};
  function tex(kind, hex) {
    const key = kind + hex; if (texCache[key]) return texCache[key];
    const S = 512, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    g.fillStyle = hex; g.fillRect(0, 0, S, S);
    if (kind === 'wood' || kind === 'veneer') {
      const n = kind === 'wood' ? 26 : 60;
      for (let i = 0; i < n; i++) {
        const y0 = rnd() * S, a = 2 + rnd() * (kind === 'wood' ? 9 : 3), f = .004 + rnd() * .01;
        g.strokeStyle = rnd() > .5 ? mix(hex, .78 + rnd() * .12) : mix(hex, 1.06 + rnd() * .08); g.lineWidth = kind === 'wood' ? 1 + rnd() * 3 : .6 + rnd();
        g.globalAlpha = .55; g.beginPath();
        for (let x = 0; x <= S; x += 8) { const y = y0 + Math.sin(x * f + i) * a; x ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke();
      }
      if (kind === 'wood') for (let k = 0; k < 3; k++) { g.globalAlpha = .35; g.strokeStyle = mix(hex, .7); g.lineWidth = 1.5; g.beginPath(); g.ellipse(rnd() * S, rnd() * S, 18 + rnd() * 20, 5 + rnd() * 5, 0, 0, Math.PI * 2); g.stroke(); }
    } else if (kind === 'marble') {
      g.filter = 'blur(1.2px)';
      for (let i = 0; i < 9; i++) {
        g.globalAlpha = .25 + rnd() * .4; g.strokeStyle = mix(hex, .55 + rnd() * .25); g.lineWidth = .8 + rnd() * 2.5;
        g.beginPath(); let x = rnd() * S, y = -20; g.moveTo(x, y);
        while (y < S + 20) { const nx = x + (rnd() - .5) * 90, ny = y + 30 + rnd() * 60; g.quadraticCurveTo(x + (rnd() - .5) * 120, (y + ny) / 2, nx, ny); x = nx; y = ny; }
        g.stroke();
      }
      g.filter = 'none';
    } else if (kind === 'travertine') {
      for (let i = 0; i < 70; i++) { g.globalAlpha = .25 + rnd() * .35; g.fillStyle = mix(hex, .78 + rnd() * .2); const y = rnd() * S; g.fillRect(0, y, S, 1 + rnd() * 3); }
      for (let i = 0; i < 120; i++) { g.globalAlpha = .45; g.fillStyle = mix(hex, .7); g.beginPath(); g.ellipse(rnd() * S, rnd() * S, 1 + rnd() * 5, .6 + rnd() * 1.4, 0, 0, Math.PI * 2); g.fill(); }
    } else if (kind === 'sintered') {
      for (let i = 0; i < 1600; i++) { g.globalAlpha = .5; g.fillStyle = mix(hex, .65 + rnd() * .5); g.fillRect(rnd() * S, rnd() * S, 1.4, 1.4); }
      g.globalAlpha = .25; g.strokeStyle = mix(hex, .8); g.lineWidth = 1; g.beginPath(); g.moveTo(0, S * .3); g.bezierCurveTo(S * .3, S * .2, S * .6, S * .5, S, S * .4); g.stroke();
    } else if (kind === 'fabric') {
      g.globalAlpha = .18; g.strokeStyle = mix(hex, .7); g.lineWidth = 1;
      for (let i = -S; i < S * 2; i += 6) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + S, S); g.stroke(); g.beginPath(); g.moveTo(i + S, 0); g.lineTo(i, S); g.stroke(); }
    } else if (kind === 'tufted') {
      const st = 64; g.globalAlpha = .55; g.strokeStyle = mix(hex, .72); g.lineWidth = 3;
      for (let i = -S; i < S * 2; i += st) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + S, S); g.stroke(); g.beginPath(); g.moveTo(i + S, 0); g.lineTo(i, S); g.stroke(); }
      g.globalAlpha = .9; g.fillStyle = mix(hex, .5);
      for (let x = 0; x <= S; x += st) for (let y = 0; y <= S; y += st) { g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(x + st / 2, y + st / 2, 4, 0, Math.PI * 2); g.fill(); }
    } else if (kind === 'grooved') {
      for (let x = 0; x < S; x += 32) { g.globalAlpha = .5; g.fillStyle = mix(hex, .62); g.fillRect(x, 0, 5, S); g.globalAlpha = .25; g.fillStyle = mix(hex, 1.15); g.fillRect(x + 5, 0, 2, S); }
    }
    g.globalAlpha = 1;
    const b64 = c.toDataURL('image/jpeg', .86).split(',')[1];
    return (texCache[key] = Uint8Array.from(atob(b64), ch => ch.charCodeAt(0)));
  }

  // ---------- باني المجسم ----------
  function Builder() {
    const mats = [], groups = [];
    const matIndex = (m) => { const key = JSON.stringify(m); let i = mats.findIndex(x => x.key === key); if (i < 0) { mats.push({ key, ...m }); groups.push({ P: [], N: [], U: [], I: [] }); i = mats.length - 1; } return i; };
    const T = 0.8; // متر لكل تكرار للملمس
    const face = (gi, pts, n, uvOf) => {
      const G = groups[gi], o = G.P.length / 3;
      for (const p of pts) { G.P.push(...p); G.N.push(...n); G.U.push(...uvOf(p)); }
      for (let k = 1; k < pts.length - 1; k++) G.I.push(o, o + k, o + k + 1);
    };
    // منشور من شكل مغلق (محدّب) بين ارتفاعين
    function prism(outline, y0, y1, m, cx = 0, cz = 0) {
      const gi = matIndex(m);
      const pts = outline.map(([x, z]) => [x + cx, z + cz]);
      const top = pts.map(([x, z]) => [x, y1, z]), bot = pts.map(([x, z]) => [x, y0, z]).reverse();
      face(gi, top, [0, 1, 0], ([x, , z]) => [x / T, z / T]);
      face(gi, bot, [0, -1, 0], ([x, , z]) => [x / T, z / T]);
      let run = 0;
      for (let k = 0; k < pts.length; k++) {
        const a = pts[k], b = pts[(k + 1) % pts.length], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1e-6;
        const n = [-dz / L, 0, dx / L];
        const u0 = run / T, u1 = (run + L) / T; run += L;
        const G = groups[gi], o = G.P.length / 3;
        for (const [p, uv] of [[[a[0], y0, a[1]], [u0, y0 / T]], [[b[0], y0, b[1]], [u1, y0 / T]], [[b[0], y1, b[1]], [u1, y1 / T]], [[a[0], y1, a[1]], [u0, y1 / T]]]) { G.P.push(...p); G.N.push(...n); G.U.push(...uv); }
        G.I.push(o, o + 1, o + 2, o, o + 2, o + 3);
      }
    }
    const box = (cx, cy, cz, sx, sy, sz, m) => prism(rectO(sx, sz), cy - sy / 2, cy + sy / 2, m, cx, cz);
    const cyl = (cx, y0, y1, cz, r, m, seg = 20) => prism(ellO(r * 2, r * 2, seg), y0, y1, m, cx, cz);
    return { prism, box, cyl, mats, groups };
  }
  // أشكال ثنائية الأبعاد (عكس عقارب الساعة من فوق)
  function rectO(w, d, r = 0) {
    if (r <= 0.001) return [[-w / 2, d / 2], [w / 2, d / 2], [w / 2, -d / 2], [-w / 2, -d / 2]];
    r = Math.min(r, w / 2, d / 2); const out = [], seg = 6;
    const corners = [[w / 2 - r, d / 2 - r, 0], [w / 2 - r, -d / 2 + r, -90], [-w / 2 + r, -d / 2 + r, -180], [-w / 2 + r, d / 2 - r, -270]];
    for (const [cx, cz, a0] of corners) for (let k = 0; k <= seg; k++) { const a = (a0 + 90 - k * 90 / seg) * Math.PI / 180; out.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]); }
    return out;
  }
  function ellO(w, d, seg = 48) { const out = []; for (let k = 0; k < seg; k++) { const a = -k / seg * Math.PI * 2; out.push([Math.cos(a) * w / 2, Math.sin(a) * d / 2]); } return out; }
  const shapeO = (shape, w, d, edge) => shape === 'round' ? ellO(w, w) : shape === 'oval' ? ellO(w, d) : shape === 'capsule' ? rectO(w, d, Math.min(w, d) / 2) : rectO(w, shape === 'square' ? w : d, edge === 'rounded' ? 0.025 : edge === 'beveled' ? 0.008 : 0);

  // ---------- المواد حسب اختيار العميل ----------
  function materials(st) {
    const body = st.color[1];
    const matTex = { mdf: null, veneer: 'veneer', solid: 'wood', metal: null, fabric: 'fabric' }[st.mat];
    const B = { c: body, tex: matTex, rough: st.mat === 'metal' ? .3 : st.mat === 'fabric' ? .95 : st.mat === 'mdf' ? .45 : .6, metal: st.mat === 'metal' ? .85 : 0 };
    const topC = st.top === 'same' ? body : st.top === 'glass' ? '#cfe3ea' : st.topColor[1];
    const topTex = { marble: 'marble', sintered: 'sintered', travertine: 'travertine', padded: 'tufted', same: matTex }[st.top] || null;
    const TOP = st.top === 'glass' ? { c: '#d6ebf0', alpha: .38, rough: .05, metal: 0 } : { c: topC, tex: topTex, rough: st.top === 'marble' || st.top === 'sintered' ? .2 : st.top === 'padded' ? .9 : B.rough, metal: st.top === 'same' ? B.metal : 0 };
    const LEG = st.legs === 'gold' ? { c: METAL.gold, rough: .25, metal: 1 } : st.legs === 'black' ? { c: METAL.black, rough: .35, metal: .8 } : { c: mix(body, .72), tex: 'wood', rough: .6, metal: 0 };
    const HANDLE = st.handle === 'black' ? { c: METAL.black, rough: .3, metal: .8 } : { c: METAL.gold, rough: .25, metal: 1 };
    return { B, TOP, LEG, HANDLE, DARK: { c: mix(body, .45), rough: .7, metal: 0 }, GROOVE: { c: body, tex: 'grooved', rough: B.rough, metal: B.metal },
      GLASS: { c: '#d6ebf0', alpha: .4, rough: .05, metal: 0 }, MIRROR: { c: '#e9eef0', rough: .02, metal: 1 }, WHITE: { c: '#f6f3ec', tex: 'fabric', rough: .95, metal: 0 },
      TUFT: { c: body, tex: 'tufted', rough: .95, metal: 0 }, GOLD: { c: METAL.gold, rough: .25, metal: 1 } };
  }

  // ---------- بناء القطعة ----------
  function build(st) {
    const p = CC[st.cat].pieces.find(x => x.k === st.piece), kind = p.kind, M = materials(st), b = Builder();
    const w = (+st.w || 60) / 100, d = (['round', 'square'].includes(st.shape) ? +st.w : +st.d || 40) / 100, h = (+st.h || 50) / 100;
    const hasTopP = ['table', 'tiered', 'nesting', 'cart'].includes(kind) || ['counter', 'dresser', 'nightstand', 'corner', 'buffet'].includes(p.k);
    const legsOK = kind !== 'unit' && st.piece !== 'wardrobe';
    const slab = st.top === 'glass' ? 0.012 : st.top === 'marble' || st.top === 'sintered' || st.top === 'travertine' ? 0.025 : 0.035;

    // أرجل تحت سطح بشكل معيّن
    function legsUnder(y0, y1, ow, od, shape, cx = 0, cz = 0) {
      if (st.legs === 'hidden') { b.prism(shapeO(shape === 'lshape' ? 'rect' : shape, ow * .78, od * .78, 'straight'), y0, y1, M.B, cx, cz); return; }
      if (st.legs === 'pedestal') { b.cyl(cx, y0 + .02, y1, cz, Math.max(.04, Math.min(ow, od) * .09), M.LEG); b.prism(shapeO(shape === 'round' ? 'round' : 'oval', Math.min(ow * .5, .6), Math.min(od * .5, .6)), y0, y0 + .025, M.LEG, cx, cz); return; }
      const r = st.legs === 'wood' ? .022 : .014;
      let pts;
      if (['round', 'oval', 'capsule'].includes(shape)) pts = [45, 135, 225, 315].map(a => [Math.cos(a * Math.PI / 180) * ow * .34, Math.sin(a * Math.PI / 180) * od * .34]);
      else { const ix = Math.min(.06, ow * .12), iz = Math.min(.06, od * .12); pts = [[-ow / 2 + ix, -od / 2 + iz], [ow / 2 - ix, -od / 2 + iz], [ow / 2 - ix, od / 2 - iz], [-ow / 2 + ix, od / 2 - iz]]; }
      for (const [x, z] of pts) b.cyl(cx + x, y0, y1, cz + z, r, M.LEG, 14);
      if (st.legs !== 'wood' && !['round', 'oval', 'capsule'].includes(shape) && ow > .5) { // حلقة معدنية سفلية
        b.box(cx, y0 + .01, cz + pts[0][1], ow - .12, .015, .015, M.LEG); b.box(cx, y0 + .01, cz + pts[2][1], ow - .12, .015, .015, M.LEG);
      }
    }
    function tableTop(y, ow, od, shape, cx = 0, cz = 0) {
      if (shape === 'lshape') { b.box(cx, y + slab / 2, cz, ow, slab, od, M.TOP); return; }
      b.prism(shapeO(shape, ow, od, st.edge), y, y + slab, M.TOP, cx, cz);
      if (st.edge === 'beveled') b.prism(shapeO(shape, ow * .985, od * .985, st.edge), y + slab, y + slab + .003, M.TOP, cx, cz);
    }
    function chair(x, z, rot) {
      const s = .45, sh = .46, c = Math.cos(rot), sn = Math.sin(rot), at = (dx, dz) => [x + dx * c - dz * sn, z + dx * sn + dz * c];
      const ctr = at(0, 0); b.prism(rectO(s, s, .03).map(([u, v]) => { const [X, Z] = [u * c - v * sn, u * sn + v * c]; return [X, Z]; }), sh - .06, sh, { c: st.color[1], tex: 'fabric', rough: .95, metal: 0 }, ctr[0], ctr[1]);
      for (const [dx, dz] of [[-.19, -.19], [.19, -.19], [.19, .19], [-.19, .19]]) { const q = at(dx, dz); b.cyl(q[0], 0, sh - .06, q[1], .014, M.LEG, 10); }
      const bk = at(0, -s / 2 + .02); b.prism(rectO(s, .04, .015).map(([u, v]) => [u * c - v * sn, u * sn + v * c]), sh, sh + .45, { c: st.color[1], tex: 'fabric', rough: .95, metal: 0 }, bk[0], bk[1]);
    }
    function cabinet(cx, cz, cw, cd, ch, y0 = 0, opts = {}) {
      const plinth = opts.noLegs ? 0 : legsOK && st.legs !== 'hidden' ? Math.min(.12, ch * .12) : .04;
      const yb = y0 + plinth, H = ch - plinth - (opts.topSlab ? slab : 0);
      if (plinth) { if (legsOK && st.legs !== 'hidden' && !opts.noLegs) legsUnder(y0, yb, cw, cd, 'rect', cx, cz); else b.box(cx, y0 + plinth / 2, cz, cw * .94, plinth, cd * .9, M.DARK); }
      b.box(cx, yb + H / 2, cz, cw, H, cd, M.B);
      // الأبواب
      const n = Math.max(1, Math.min(6, Math.round(cw * 100 / (st.piece === 'wardrobe' ? 55 : 45)))), dw = cw / n, fz = cz + cd / 2;
      if (st.door === 'open') {
        b.box(cx, yb + H / 2, fz - .005, cw - .03, H - .03, .01, M.DARK);
        for (let k = 1; k < 3; k++) b.box(cx, yb + H * k / 3, fz - cd * .3, cw - .04, .02, cd * .6, M.B);
      } else for (let i = 0; i < n; i++) {
        const x = cx - cw / 2 + dw * (i + .5);
        b.box(x, yb + H / 2, fz + .009, dw - .006, H - .012, .018, st.door === 'glass' ? M.GLASS : st.door === 'grooved' ? M.GROOVE : M.B);
        if (st.door === 'pattern') { b.box(x, yb + H / 2, fz + .02, dw * .7, .01, .004, M.GOLD); b.box(x, yb + H / 2, fz + .02, .01, H * .7, .004, M.GOLD); b.box(x, yb + H * .15, fz + .02, dw * .7, .008, .004, M.GOLD); b.box(x, yb + H * .85, fz + .02, dw * .7, .008, .004, M.GOLD); }
        if (st.handle !== 'hidden') b.box(x + (i % 2 ? -1 : 1) * (dw / 2 - .035), yb + H * .55, fz + .03, .012, Math.min(.18, H * .2), .012, M.HANDLE);
      }
      if (opts.topSlab) tableTop(yb + H, cw + .02, cd + .02, 'rect', cx, cz);
    }

    if (kind === 'table') {
      if (st.shape === 'lshape') { tableTop(h - slab, w, d, 'lshape'); legsUnder(0, h - slab, w, d, 'rect'); }
      else { tableTop(h - slab, w, d, st.shape); legsUnder(0, h - slab, w, d, st.shape); }
      if (p.seats) {
        const n = +st.seats || 6;
        if (st.shape === 'round') { const R = w / 2 + .18; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; chair(Math.cos(a) * R, Math.sin(a) * R, a + Math.PI / 2); } }
        else { const ends = n >= 8 ? 2 : 0, side = (n - ends) / 2; for (let i = 0; i < side; i++) { const x = -w / 2 + w * (i + .5) / side; chair(x, -d / 2 - .2, 0); chair(x, d / 2 + .2, Math.PI); }
          if (ends) { chair(-w / 2 - .2, 0, -Math.PI / 2); chair(w / 2 + .2, 0, Math.PI / 2); } }
      }
    } else if (kind === 'tiered') {
      b.cyl(0, 0, h, 0, .02, M.LEG); b.prism(shapeO(st.shape, w * .6, d * .6), 0, .02, M.LEG);
      tableTop(h - slab, w, d, st.shape); tableTop(h * .48, w * 1.12, d * 1.12, st.shape);
    } else if (kind === 'nesting') {
      tableTop(h - slab, w * .85, d * .85, st.shape, -w * .08, -d * .06); legsUnder(0, h - slab, w * .85, d * .85, st.shape, -w * .08, -d * .06);
      const w2 = w * .55, d2 = d * .55; tableTop(h * .8 - slab, w2, d2, st.shape, w * .3, d * .28); legsUnder(0, h * .8 - slab, w2, d2, st.shape, w * .3, d * .28);
    } else if (kind === 'cart') {
      for (const y of [h - slab, h * .38]) tableTop(y, w, d, st.shape === 'capsule' ? 'capsule' : 'rect');
      for (const [x, z] of [[-w / 2 + .02, -d / 2 + .02], [w / 2 - .02, -d / 2 + .02], [w / 2 - .02, d / 2 - .02], [-w / 2 + .02, d / 2 - .02]]) { b.cyl(x, .06, h, z, .012, M.LEG, 12); b.cyl(x, 0, .06, z, .03, M.DARK, 16); }
      b.box(w / 2 + .03, h - .05, 0, .015, .015, d * .7, M.LEG);
    } else if (kind === 'bed') {
      const bh = .28, leg = st.legs === 'hidden' ? 0 : .1, mh = .24;
      if (leg) legsUnder(0, leg, w, d, 'rect'); else b.box(0, .03, .02, w * .9, .06, d * .9, M.DARK);
      b.prism(rectO(w, d, st.edge === 'rounded' ? .04 : 0), leg || .06, (leg || .06) + bh, st.mat === 'fabric' ? M.B : M.B);
      b.prism(rectO(w - .04, d - .06, .05), (leg || .06) + bh, (leg || .06) + bh + mh, M.WHITE, 0, .02);
      const hbH = Math.max(h, .9); b.prism(rectO(w + .06, .1, st.edge === 'rounded' ? .04 : 0), 0, hbH, st.mat === 'fabric' ? M.TUFT : M.B, 0, -d / 2 - .05);
      const top = (leg || .06) + bh + mh; for (const s of [-1, 1]) b.prism(rectO(w * .4, .32, .06), top, top + .14, M.WHITE, s * w * .23, -d / 2 + .25);
      b.prism(rectO(w + .02, d * .35, .02), top - .02, top + .015, { c: st.color[1], tex: 'fabric', rough: .95, metal: 0 }, 0, d * .28);
      if (st.piece === 'fullroom') { for (const s of [-1, 1]) cabinet(s * (w / 2 + .32), -d / 2 + .25, .5, .4, .55, 0, { topSlab: true }); }
    } else if (kind === 'cabinet') {
      if (st.shape === 'lshape') { cabinet(0, 0, w, d, h, 0, { topSlab: hasTopP }); cabinet(-w / 2 + d / 2, d / 2 + w * .25, d, w * .5, h, 0, { topSlab: hasTopP }); }
      else if (['round', 'capsule'].includes(st.shape)) {
        const plinth = legsOK && st.legs !== 'hidden' ? .1 : .03; legsUnder(0, plinth, w, d, st.shape);
        b.prism(shapeO(st.shape, w, d), plinth, h - (hasTopP ? slab : 0), M.B); if (hasTopP) tableTop(h - slab, w + .02, d + .02, st.shape);
        b.box(0, (plinth + h) / 2, d / 2 - .002, .004, (h - plinth) * .8, .01, M.DARK);
        if (st.handle !== 'hidden') b.box(0, h * .6, d / 2 + .015, .1, .012, .012, M.HANDLE);
      } else cabinet(0, 0, w, d, h, 0, { topSlab: hasTopP });
      if (st.piece === 'dresser') { const mw = Math.min(w * .7, .9), mh = Math.min(.9, mw * 1.2); b.prism(rectO(mw, .03, .02), h + .05, h + .05 + mh, M.B, 0, -d / 2 + .03); b.box(0, h + .05 + mh / 2, -d / 2 + .05, mw - .06, mh - .06, .005, M.MIRROR); }
    } else if (kind === 'corner') {
      const low = Math.min(h, .95);
      if (st.shape === 'lshape') { cabinet(0, 0, w, d, low, 0, { topSlab: true }); cabinet(-w / 2 + d / 2, d / 2 + w * .22, d, w * .44, low, 0, { topSlab: true }); }
      else cabinet(0, 0, w, d, low, 0, { topSlab: true });
      const up = h - low - .08; if (up > .2) {
        b.box(0, low + .08 + up / 2, -d / 2 + .01, w, up, .02, st.door === 'grooved' ? M.GROOVE : M.B);
        for (let k = 1; k <= 3; k++) b.box(0, low + .08 + up * k / 4, -d / 2 + .13, w * .9, .025, .24, M.B);
      }
    } else if (kind === 'unit') {
      const low = h * .45; cabinet(0, 0, w, d, low, 0, { noLegs: false });
      const mw = Math.min(w * .34, .6), mh = h * .38; b.prism(rectO(mw, .03, mw / 2), low + .12, low + .12 + mh, M.GOLD, 0, -d / 2 + .02); b.prism(rectO(mw - .04, .01, mw / 2 - .02), low + .14, low + .1 + mh, M.MIRROR, 0, -d / 2 + .04);
      for (let i = 0; i < 4; i++) b.cyl(-w / 2 + .1 + i * .08, h * .88, h * .88 + .06, -d / 2 + .04, .01, M.GOLD, 10);
      b.box(0, h * .86, -d / 2 + .015, w * .4, .08, .02, M.B);
    }
    return glb(b);
  }

  // ---------- كتابة ملف GLB ----------
  function glb(b) {
    const chunks = [], views = [], accessors = [], images = [], textures = [], materialsOut = [], prims = [];
    let off = 0; const push = (arr, target) => { const pad = (4 - (arr.byteLength % 4)) % 4; chunks.push(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength)); if (pad) chunks.push(new Uint8Array(pad)); views.push({ buffer: 0, byteOffset: off, byteLength: arr.byteLength, ...(target ? { target } : {}) }); off += arr.byteLength + pad; return views.length - 1; };
    const texIdx = {};
    b.mats.forEach((m, i) => {
      const G = b.groups[i]; if (!G.I.length) return;
      const P = new Float32Array(G.P), N = new Float32Array(G.N), U = new Float32Array(G.U), I = new Uint32Array(G.I);
      const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
      for (let k = 0; k < P.length; k += 3) for (let a = 0; a < 3; a++) { min[a] = Math.min(min[a], P[k + a]); max[a] = Math.max(max[a], P[k + a]); }
      const a0 = accessors.push({ bufferView: push(P, 34962), componentType: 5126, count: P.length / 3, type: 'VEC3', min, max }) - 1;
      const a1 = accessors.push({ bufferView: push(N, 34962), componentType: 5126, count: N.length / 3, type: 'VEC3' }) - 1;
      const a2 = accessors.push({ bufferView: push(U, 34962), componentType: 5126, count: U.length / 2, type: 'VEC2' }) - 1;
      const a3 = accessors.push({ bufferView: push(I, 34963), componentType: 5125, count: I.length, type: 'SCALAR' }) - 1;
      const col = lin(rgb(m.c)); const pbr = { baseColorFactor: [...(m.tex ? [1, 1, 1] : col), m.alpha ?? 1], metallicFactor: m.metal ?? 0, roughnessFactor: m.rough ?? .6 };
      if (m.tex) { const k = m.tex + m.c; if (texIdx[k] == null) { images.push({ bufferView: push(tex(m.tex, m.c)), mimeType: 'image/jpeg' }); textures.push({ source: images.length - 1, sampler: 0 }); texIdx[k] = textures.length - 1; } pbr.baseColorTexture = { index: texIdx[k] }; }
      materialsOut.push({ pbrMetallicRoughness: pbr, doubleSided: !!m.alpha, ...(m.alpha ? { alphaMode: 'BLEND' } : {}) });
      prims.push({ attributes: { POSITION: a0, NORMAL: a1, TEXCOORD_0: a2 }, indices: a3, material: materialsOut.length - 1 });
    });
    const json = { asset: { version: '2.0', generator: 'dhubaibi-custom' }, scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }], meshes: [{ primitives: prims }],
      materials: materialsOut, accessors, bufferViews: views, buffers: [{ byteLength: off }],
      ...(images.length ? { images, textures, samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }] } : {}) };
    let js = new TextEncoder().encode(JSON.stringify(json)); const jpad = (4 - (js.length % 4)) % 4; if (jpad) { const t = new Uint8Array(js.length + jpad).fill(0x20); t.set(js); js = t; }
    const head = new Uint32Array([0x46546c67, 2, 12 + 8 + js.length + 8 + off]);
    return new Blob([head, new Uint32Array([js.length, 0x4e4f534a]), js, new Uint32Array([off, 0x004e4942]), ...chunks], { type: 'model/gltf-binary' });
  }

  // ---------- العارض ----------
  let mv = null, url = '', timer = 0, lastKey = '';
  window.cz3dMount = async function (host) {
    host.innerHTML = '<div class="cz3d-load">جاري تجهيز المجسم ثلاثي الأبعاد…</div>';
    try { await loadMV(); } catch { host.innerHTML = '<div class="cz3d-load">تعذّر تحميل العارض — تأكد من الإنترنت</div>'; return; }
    mv = document.createElement('model-viewer');
    for (const [k, v] of Object.entries({ 'camera-controls': '', 'touch-action': 'pan-y', 'auto-rotate': '', 'auto-rotate-delay': '1500', 'rotation-per-second': '20deg',
      'shadow-intensity': '1', 'shadow-softness': '.8', exposure: '1.05', 'environment-image': 'neutral', 'camera-orbit': '30deg 70deg auto',
      'max-camera-orbit': 'auto 95deg auto', ar: '', 'ar-modes': 'webxr quick-look', 'ar-scale': 'fixed', 'ar-placement': 'floor', 'interaction-prompt': 'none', alt: 'مجسم القطعة' })) mv.setAttribute(k, v);
    mv.innerHTML = '<button slot="ar-button" hidden></button>';
    host.innerHTML = ''; host.append(mv);
    window.cz3dUpdate(true);
  };
  window.cz3dUpdate = function (now) {
    if (!mv || !mv.isConnected) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const key = JSON.stringify([CS.cat, CS.piece, CS.shape, CS.w, CS.d, CS.h, CS.mat, CS.top, CS.edge, CS.legs, CS.door, CS.handle, CS.seats, CS.color[1], CS.topColor[1]]);
      if (key === lastKey) return; lastKey = key;
      let orbit = null; try { orbit = mv.loaded ? mv.getCameraOrbit().toString() : null; } catch {}
      const blob = build(CS), old = url; url = URL.createObjectURL(blob); mv.src = url;
      mv.addEventListener('load', () => { if (orbit) mv.cameraOrbit = orbit; if (old) URL.revokeObjectURL(old); }, { once: true });
    }, now ? 0 : 220);
  };
  window.cz3dAR = async function (note) {
    if (!mv) return;
    await mv.updateComplete;
    if (mv.canActivateAR) return mv.activateAR();
    note.textContent = /Android|iPhone|iPad/i.test(navigator.userAgent)
      ? 'جوالك ما يدعم الكاميرا ثلاثية الأبعاد في هذا المتصفح — جرّب Chrome على أندرويد أو Safari على الآيفون.'
      : 'الكاميرا تشتغل من الجوال: افتح نفس الصفحة من جوالك وصمّم قطعتك، واضغط هذا الزر عشان تشوفها في مكانك.';
  };
  window.cz3dSnapshot = async function () { try { if (!mv?.loaded) return null; return await mv.toBlob({ mimeType: 'image/png', idealAspect: true }); } catch { return null; } };
  window.cz3dBuild = build;
})();
