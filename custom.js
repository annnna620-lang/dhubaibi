// ===================== تفصيل حسب الطلب =====================
// يعتمد على دوال app.js العامة: $, esc, svg, intl, digits, D, coordsOf, km, savedLoc, imgTag, sized, markImgs, motion

const CC = {
  bedroom: { t: 'غرف النوم', d: 'أسرّة وكومودينات ودواليب وتسريحات بمقاساتك', find: ['مراتب', 'سرير'], pieces: [
    { k: 'bed', t: 'سرير', kind: 'bed', dims: [180, 200, 120], shapes: ['rect'] },
    { k: 'nightstand', t: 'كومودينو', kind: 'cabinet', dims: [50, 40, 55], shapes: ['rect', 'capsule', 'round'] },
    { k: 'wardrobe', t: 'دولاب ملابس', kind: 'cabinet', dims: [200, 60, 240], shapes: ['rect'] },
    { k: 'dresser', t: 'تسريحة', kind: 'cabinet', dims: [120, 45, 80], shapes: ['rect', 'capsule'] },
    { k: 'fullroom', t: 'غرفة نوم كاملة', kind: 'bed', dims: [180, 200, 120], shapes: ['rect'], note: 'سرير + 2 كومودينو + دولاب + تسريحة' },
  ] },
  service: { t: 'طاولات الخدمة', d: 'طاولات وسط وجانبية وطاولات تقديم بأي شكل ومقاس', find: ['ترافرتين', 'طاولات وسط'], pieces: [
    { k: 'coffee', t: 'طاولة وسط', kind: 'table', dims: [120, 60, 45], shapes: ['rect', 'square', 'round', 'oval', 'capsule'] },
    { k: 'side', t: 'طاولة جانبية', kind: 'table', dims: [50, 50, 55], shapes: ['round', 'square', 'rect', 'oval'] },
    { k: 'tiered', t: 'طاولة خدمة بطبقات', kind: 'tiered', dims: [45, 45, 70], shapes: ['round', 'square'] },
    { k: 'nesting', t: 'طقم طاولات متداخلة', kind: 'nesting', dims: [90, 90, 45], shapes: ['round', 'oval', 'capsule', 'square'] },
  ] },
  dining: { t: 'طاولات الطعام', d: 'طاولات طعام بالشكل والمقاس وعدد الكراسي اللي تناسب عائلتك', find: ['طاولة طعام'], pieces: [
    { k: 'dining', t: 'طاولة طعام', kind: 'table', dims: [180, 90, 76], shapes: ['rect', 'oval', 'capsule', 'round', 'square'] },
    { k: 'diningset', t: 'طاولة طعام مع كراسي', kind: 'table', dims: [200, 100, 76], shapes: ['rect', 'oval', 'capsule', 'round'], seats: true },
    { k: 'buffet', t: 'بوفيه / سيرفنج', kind: 'cabinet', dims: [180, 45, 85], shapes: ['rect', 'capsule'] },
  ] },
  coffee: { t: 'ركن القهوة', d: 'ركن قهوة وضيافة متكامل يناسب مساحتك', find: ['طاولات خدمة', 'خدمة'], pieces: [
    { k: 'corner', t: 'ركن قهوة كامل', kind: 'corner', dims: [180, 50, 220], shapes: ['rect', 'lshape'] },
    { k: 'counter', t: 'كاونتر قهوة', kind: 'cabinet', dims: [150, 50, 95], shapes: ['rect', 'lshape', 'capsule'] },
    { k: 'cart', t: 'عربة ضيافة', kind: 'cart', dims: [80, 45, 85], shapes: ['rect', 'capsule'] },
  ] },
  entry: { t: 'المداخل', d: 'جزامات وكونسولات ووحدات مدخل بلمسة فخامة', find: ['جزامة'], pieces: [
    { k: 'shoe', t: 'جزامة', kind: 'cabinet', dims: [120, 35, 90], shapes: ['rect'] },
    { k: 'console', t: 'كونسول مدخل', kind: 'table', dims: [120, 35, 80], shapes: ['rect', 'capsule', 'oval'] },
    { k: 'unit', t: 'وحدة مدخل (جزامة + مرآة + علاقات)', kind: 'unit', dims: [150, 40, 200], shapes: ['rect'] },
  ] },
};
const SHAPES = { rect: 'مستطيل', square: 'مربع', round: 'دائري', oval: 'بيضاوي', capsule: 'كبسولة (أطراف مدورة)', lshape: 'حرف L' };
const OPT = {
  mat: { t: 'الخامة الأساسية', o: { mdf: 'خشب MDF مطلي', veneer: 'قشرة خشب طبيعي', solid: 'خشب طبيعي صلب', metal: 'معدن', fabric: 'تنجيد قماش / مخمل' } },
  top: { t: 'خامة السطح', o: { same: 'نفس خامة الجسم', marble: 'رخام طبيعي', sintered: 'سنتر ستون', travertine: 'ترافرتين', glass: 'زجاج مقسّى', padded: 'مبطّن / جلد' } },
  edge: { t: 'شكل الحواف', o: { straight: 'مستقيمة', rounded: 'مدوّرة', beveled: 'مشطوفة' } },
  legs: { t: 'الأرجل / القاعدة', o: { wood: 'أرجل خشبية', gold: 'معدن ذهبي', black: 'معدن أسود', hidden: 'قاعدة مخفية', pedestal: 'قاعدة وسطية' } },
  door: { t: 'شكل الأبواب', o: { flat: 'سادة', grooved: 'بشرائح طولية', pattern: 'بنقشة هندسية', glass: 'زجاج', open: 'أرفف مفتوحة' } },
  handle: { t: 'المقابض', o: { hidden: 'بدون (فتح بالضغط)', gold: 'ذهبية', black: 'سوداء' } },
};
const PALETTE = [['أبيض', '#f4f2ec'], ['أوف وايت', '#ebe3d3'], ['بيج', '#d8c5a1'], ['سنديان', '#c9a57a'], ['بني فاتح', '#a57c55'], ['جوزي', '#6b4a33'],
  ['رمادي فاتح', '#c4c2bd'], ['رمادي داكن', '#5e5e5e'], ['أسود مطفي', '#1f1f1f'], ['كحلي', '#253247'], ['ذهبي', '#c9a54a']];
const TOP_PALETTE = [['أبيض كرارا', '#eeece7'], ['كريمي', '#e6d9c0'], ['ترافرتين', '#d9c7a6'], ['رمادي', '#9a9893'], ['أسود ماركينا', '#1e1e1e'], ['ذهبي', '#c9a54a']];
const METAL = { gold: '#c9a54a', black: '#1c1c1c' };

let CS = null; // حالة النموذج
const pieceOf = () => CC[CS.cat].pieces.find(p => p.k === CS.piece);
function newState(cat = 'service') {
  const p = CC[cat].pieces[0];
  return { cat, piece: p.k, shape: p.shapes[0], w: p.dims[0], d: p.dims[1], h: p.dims[2], mat: 'mdf', top: 'same', edge: 'rounded', legs: 'gold',
    door: 'grooved', handle: 'hidden', seats: 6, color: PALETTE[0], topColor: TOP_PALETTE[0], qty: 1, notes: '', ref: '', ai: '', name: '', phone: '', city: '', branch: 0 };
}
const hasTopFor = (p) => ['table', 'tiered', 'nesting', 'cart'].includes(p.kind) || ['counter', 'dresser', 'nightstand', 'corner', 'buffet'].includes(p.k);
const hasTop = () => ['table', 'tiered', 'nesting', 'cart'].includes(pieceOf().kind) || ['counter', 'dresser', 'nightstand', 'corner', 'buffet'].includes(CS.piece);
const hasDoors = () => ['cabinet', 'corner', 'unit'].includes(pieceOf().kind);
const hasLegs = () => pieceOf().kind !== 'unit' && CS.piece !== 'wardrobe';

// ---------- المخطط (منظر علوي + أمامي) ----------
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const f = (c) => Math.max(0, Math.min(255, Math.round(c * k))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(c => f(c).toString(16).padStart(2, '0')).join(''); }
function diagram(st, opts = {}) {
  const p = CC[st.cat].pieces.find(x => x.k === st.piece), kind = p.kind;
  const body = st.color[1], topHex = st.top === 'same' ? body : (st.top === 'glass' ? '#cfe3ea' : st.topColor[1]);
  const legHex = METAL[st.legs] || shade(body, .7);
  const W = 900, H = 440, pad = 46, font = "Tajawal, Tahoma, 'Segoe UI', Arial";
  const round = ['round'].includes(st.shape), sq = st.shape === 'square';
  const w = +st.w || 1, d = round || sq ? (+st.w || 1) : (+st.d || 1), h = +st.h || 1;
  // نصف للمنظر العلوي ونصف للأمامي
  const boxW = (W - pad * 3) / 2, boxH = H - pad * 2 - 30;
  const ret = st.shape === 'lshape' ? Math.min(w * .6, 160) : 0;
  const cm = p.seats ? 62 : 0, dimPad = 60;
  const s1 = Math.min((boxW - dimPad) / (w + cm * 2), (boxH - 20) / (Math.max(d, ret || 0) + cm * 2)), s2 = Math.min((boxW - dimPad - 20) / w, (boxH - 10) / h);
  const tx = pad, ty = pad + 26, fx = pad * 2 + boxW, fy = pad + 26;
  const tw = w * s1, td = d * s1, fw = w * s2, fh = h * s2;
  const ox = tx + (boxW - dimPad - tw) / 2, oy = ty + (boxH - Math.max(td, ret * s1)) / 2;
  const bodyFill = `url(#b${{ mdf: 'Mdf', veneer: 'Veneer', solid: 'Wood', metal: 'Metal', fabric: 'Fabric' }[st.mat] || 'Mdf'})`;
  const pat = { marble: 'pMarble', sintered: 'pSint', travertine: 'pTrav', padded: 'pTuft', glass: 'pGlass' }[st.top] || '';
  const edgeR = st.edge === 'rounded' ? 10 : st.edge === 'beveled' ? 2 : 0;
  let topShape;
  if (st.shape === 'round') topShape = `<circle cx="${ox + tw / 2}" cy="${oy + td / 2}" r="${tw / 2}"/>`;
  else if (st.shape === 'oval') topShape = `<ellipse cx="${ox + tw / 2}" cy="${oy + td / 2}" rx="${tw / 2}" ry="${td / 2}"/>`;
  else if (st.shape === 'capsule') topShape = `<rect x="${ox}" y="${oy}" width="${tw}" height="${td}" rx="${Math.min(td, tw) / 2}"/>`;
  else if (st.shape === 'lshape') { const r = ret * s1; topShape = `<path d="M${ox} ${oy}H${ox + tw}V${oy + td}H${ox + td}V${oy + r}H${ox}Z" stroke-linejoin="round"/>`; }
  else topShape = `<rect x="${ox}" y="${oy}" width="${tw}" height="${td}" rx="${edgeR}"/>`;
  const fillTop = pat && hasTopFor(p) ? `url(#${pat})` : bodyFill;
  let chairs = '';
  if (p.seats) {
    const n = +st.seats || 6, cw = Math.max(10, 45 * s1), cd = Math.max(8, 40 * s1), cs = shade(body, .8);
    const seat = (x, y, rot) => `<rect x="${-cw / 2}" y="${-cd / 2}" width="${cw}" height="${cd}" rx="${cd * .3}" fill="${cs}" stroke="#444" transform="translate(${x} ${y}) rotate(${rot})"/>`;
    if (st.shape === 'round') { const R = tw / 2 + cd * .7; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; chairs += seat(ox + tw / 2 + Math.cos(a) * R, oy + td / 2 + Math.sin(a) * R, a * 180 / Math.PI + 90); } }
    else { const ends = n >= 8 ? 2 : 0, side = (n - ends) / 2;
      for (let i = 0; i < side; i++) { const x = ox + tw * (i + .5) / side; chairs += seat(x, oy - cd * .7, 0) + seat(x, oy + td + cd * .7, 180); }
      if (ends) chairs += seat(ox - cd * .7, oy + td / 2, 90) + seat(ox + tw + cd * .7, oy + td / 2, -90); }
  }
  // خطوط الأبعاد
  const dimH = (x1, x2, y, label) => `<g class="dim"><path d="M${x1} ${y}H${x2}M${x1} ${y - 6}V${y + 6}M${x2} ${y - 6}V${y + 6}"/><rect x="${(x1 + x2) / 2 - 34}" y="${y - 12}" width="68" height="24" rx="12"/><text x="${(x1 + x2) / 2}" y="${y + 5}">${label}</text></g>`;
  const dimV = (x, y1, y2, label) => `<g class="dim"><path d="M${x} ${y1}V${y2}M${x - 6} ${y1}H${x + 6}M${x - 6} ${y2}H${x + 6}"/><rect x="${x - 34}" y="${(y1 + y2) / 2 - 12}" width="68" height="24" rx="12"/><text x="${x}" y="${(y1 + y2) / 2 + 5}">${label}</text></g>`;
  // المنظر الأمامي
  const gx = fx + (boxW - 50 - fw) / 2, base = fy + (boxH + fh) / 2, top = base - fh;
  const slab = Math.max(5, 4 * s2), leg = Math.max(4, 4.5 * s2);
  const legs = (y0, y1, x0, x1) => {
    if (st.legs === 'hidden') return `<rect x="${x0 + (x1 - x0) * .08}" y="${y1 - Math.max(6, (y1 - y0) * .12)}" width="${(x1 - x0) * .84}" height="${Math.max(6, (y1 - y0) * .12)}" fill="${shade(body, .55)}"/>`;
    if (st.legs === 'pedestal') { const cx = (x0 + x1) / 2; return `<rect x="${cx - leg * 1.5}" y="${y0}" width="${leg * 3}" height="${y1 - y0}" fill="${legHex}"/><rect x="${cx - (x1 - x0) * .22}" y="${y1 - leg}" width="${(x1 - x0) * .44}" height="${leg}" rx="${leg / 2}" fill="${legHex}"/>`; }
    const inset = (x1 - x0) * .06, sl = st.legs === 'wood' ? (x1 - x0) * .025 : 0;
    return `<path d="M${x0 + inset} ${y0}L${x0 + inset - sl} ${y1}" stroke="${legHex}" stroke-width="${leg}" stroke-linecap="round"/><path d="M${x1 - inset} ${y0}L${x1 - inset + sl} ${y1}" stroke="${legHex}" stroke-width="${leg}" stroke-linecap="round"/>`;
  };
  let front = '';
  if (kind === 'table') front = `<rect x="${gx}" y="${top}" width="${fw}" height="${slab}" rx="${edgeR ? 3 : 0}" fill="${fillTop}" stroke="#222"/>${legs(top + slab, base, gx, gx + fw)}`;
  else if (kind === 'tiered') { const mid = top + fh * .5; front = `<rect x="${gx + fw / 2 - leg}" y="${top}" width="${leg * 2}" height="${fh}" fill="${legHex}"/><rect x="${gx}" y="${top}" width="${fw}" height="${slab}" rx="3" fill="${fillTop}" stroke="#222"/><rect x="${gx - fw * .08}" y="${mid}" width="${fw * 1.16}" height="${slab}" rx="3" fill="${fillTop}" stroke="#222"/><rect x="${gx + fw * .2}" y="${base - leg}" width="${fw * .6}" height="${leg}" rx="${leg / 2}" fill="${legHex}"/>`; }
  else if (kind === 'nesting') { const w2 = fw * .62, h2 = fh * .82; front = `<rect x="${gx + fw - w2 + fw * .1}" y="${base - h2}" width="${w2}" height="${slab}" fill="${shade(topHex, .9)}" stroke="#222"/>${legs(base - h2 + slab, base, gx + fw - w2 + fw * .1, gx + fw + fw * .1)}<rect x="${gx}" y="${top}" width="${fw * .85}" height="${slab}" fill="${fillTop}" stroke="#222"/>${legs(top + slab, base, gx, gx + fw * .85)}`; }
  else if (kind === 'cart') { front = `<rect x="${gx}" y="${top}" width="${fw}" height="${slab}" fill="${fillTop}" stroke="#222"/><rect x="${gx}" y="${top + fh * .55}" width="${fw}" height="${slab}" fill="${fillTop}" stroke="#222"/><rect x="${gx}" y="${top}" width="${leg}" height="${fh - 10}" fill="${legHex}"/><rect x="${gx + fw - leg}" y="${top}" width="${leg}" height="${fh - 10}" fill="${legHex}"/><circle cx="${gx + leg}" cy="${base - 6}" r="6" fill="#333"/><circle cx="${gx + fw - leg}" cy="${base - 6}" r="6" fill="#333"/>`; }
  else if (kind === 'bed') { const bh = Math.min(fh * .38, 45 * s2), hb = top; front = `<rect x="${gx}" y="${hb}" width="${fw}" height="${fh}" rx="${edgeR + 4}" fill="${st.mat === 'fabric' ? 'url(#pTuftB)' : bodyFill}" stroke="#222"/><rect x="${gx - fw * .02}" y="${base - bh}" width="${fw * 1.04}" height="${bh * .72}" rx="6" fill="${bodyFill}" stroke="#222"/><rect x="${gx + fw * .03}" y="${base - bh - 10}" width="${fw * .94}" height="12" rx="6" fill="#f4f1ea" stroke="#999"/>${legs(base - bh * .28, base, gx, gx + fw)}`; }
  else {
    // خزائن ووحدات: جسم + أبواب
    const plinth = hasLegs() && st.legs !== 'hidden' ? Math.max(8, fh * .1) : 0;
    let cy = top, ch = fh - plinth, extra = '';
    if (kind === 'corner') { const low = Math.min(ch, 95 * s2); extra = `<rect x="${gx}" y="${top}" width="${fw}" height="${ch - low - 6}" fill="none" stroke="#222"/>` + [1, 2, 3].map(i => `<path d="M${gx} ${top + (ch - low - 6) * i / 4}H${gx + fw}" stroke="${shade(body, .6)}" stroke-width="4"/>`).join(''); cy = base - plinth - low; ch = low; }
    if (kind === 'unit') { const mw = fw * .34; extra = `<rect x="${gx + (fw - mw) / 2}" y="${top}" width="${mw}" height="${fh * .42}" rx="${mw / 2}" fill="#dfe8ea" stroke="#9a8a5a" stroke-width="3"/>` + [0, 1, 2, 3].map(i => `<circle cx="${gx + fw * .1 + i * fw * .06}" cy="${top + fh * .12}" r="4" fill="${METAL.gold}"/>`).join(''); cy = top + fh * .55; ch = fh * .45 - plinth; }
    const n = Math.max(1, Math.min(6, Math.round(w / (CS.piece === 'wardrobe' ? 55 : 45)))), dw = fw / n;
    let doors = '';
    for (let i = 0; i < n; i++) {
      const x = gx + i * dw;
      doors += `<rect x="${x + 2}" y="${cy + 2}" width="${dw - 4}" height="${ch - 4}" fill="${st.door === 'glass' ? 'url(#pGlass)' : bodyFill}" stroke="#222" stroke-width="1"/>`;
      if (st.door === 'grooved') for (let g = 1; g < 6; g++) doors += `<path d="M${x + dw * g / 6} ${cy + 6}V${cy + ch - 6}" stroke="${shade(body, .7)}" stroke-width="2"/>`;
      if (st.door === 'pattern') doors += `<path d="M${x + 6} ${cy + 6}L${x + dw - 6} ${cy + ch - 6}M${x + dw - 6} ${cy + 6}L${x + 6} ${cy + ch - 6}" stroke="${METAL.gold}" stroke-width="2"/>`;
      if (st.door === 'open') doors += [1, 2].map(k => `<path d="M${x} ${cy + ch * k / 3}H${x + dw}" stroke="${shade(body, .6)}" stroke-width="3"/>`).join('');
      if (st.handle !== 'hidden' && st.door !== 'open') doors += `<rect x="${i % 2 ? x + 8 : x + dw - 12}" y="${cy + ch * .42}" width="4" height="${Math.min(40, ch * .16)}" rx="2" fill="${METAL[st.handle]}"/>`;
    }
    front = extra + doors + (hasTop() ? `<rect x="${gx - 3}" y="${cy - slab}" width="${fw + 6}" height="${slab}" fill="${fillTop}" stroke="#222"/>` : '') + (plinth ? legs(base - plinth, base, gx, gx + fw) : '');
  }
  const uidS = Math.random().toString(36).slice(2, 7);
  return (`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${opts.w || W}" height="${opts.h || H}" font-family="${font}" direction="rtl">
  <defs>
    <pattern id="pMarble" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="${topHex}"/><path d="M-10 30C30 10 50 60 90 40S130 70 140 60M-10 95C20 80 60 110 100 90" stroke="${shade(topHex, .72)}" stroke-width="1.4" fill="none" opacity=".7"/><path d="M20 -5C40 30 30 60 60 80" stroke="${shade(topHex, .85)}" stroke-width=".8" fill="none"/></pattern>
    <pattern id="pTrav" width="60" height="18" patternUnits="userSpaceOnUse"><rect width="60" height="18" fill="${topHex}"/><path d="M0 6H22M30 12H58M8 16H20" stroke="${shade(topHex, .8)}" stroke-width="1.5"/></pattern>
    <pattern id="pWood" width="80" height="14" patternUnits="userSpaceOnUse"><rect width="80" height="14" fill="${topHex}"/><path d="M0 4C20 2 40 7 80 4M0 10C30 12 50 8 80 11" stroke="${shade(topHex, .82)}" stroke-width="1" fill="none"/></pattern>
    <pattern id="pTuft" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="${topHex}"/><path d="M0 0H22V22" stroke="${shade(topHex, .78)}" fill="none"/><circle cx="0" cy="0" r="1.6" fill="${shade(topHex, .6)}"/></pattern>
    <linearGradient id="bMdf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(body, 1.12)}"/><stop offset=".55" stop-color="${body}"/><stop offset="1" stop-color="${shade(body, .9)}"/></linearGradient>
    <pattern id="bWood" width="90" height="16" patternUnits="userSpaceOnUse"><rect width="90" height="16" fill="${body}"/><path d="M0 5C25 2 45 9 90 5M0 12C30 15 60 9 90 12" stroke="${shade(body, .78)}" stroke-width="1.3" fill="none"/><ellipse cx="60" cy="8" rx="7" ry="2.2" fill="none" stroke="${shade(body, .72)}"/></pattern>
    <pattern id="bVeneer" width="140" height="9" patternUnits="userSpaceOnUse"><rect width="140" height="9" fill="${body}"/><path d="M0 3C40 2 80 5 140 3M0 7C50 8 90 6 140 7" stroke="${shade(body, .86)}" stroke-width=".8" fill="none"/></pattern>
    <linearGradient id="bMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(body, .7)}"/><stop offset=".35" stop-color="${shade(body, 1.35)}"/><stop offset=".5" stop-color="${shade(body, 1.05)}"/><stop offset=".75" stop-color="${shade(body, 1.3)}"/><stop offset="1" stop-color="${shade(body, .75)}"/></linearGradient>
    <pattern id="bFabric" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${body}"/><path d="M0 0L8 8M8 0L0 8" stroke="${shade(body, .88)}" stroke-width=".7"/></pattern>
    <pattern id="pSint" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="${topHex}"/>${[[5, 8], [22, 4], [33, 17], [12, 26], [28, 33], [36, 37], [17, 14]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".9" fill="${shade(topHex, .7)}"/>`).join('')}<path d="M0 30C15 25 25 34 40 28" stroke="${shade(topHex, .85)}" stroke-width=".6" fill="none"/></pattern>
    <linearGradient id="pGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f4f7" stop-opacity=".55"/><stop offset=".45" stop-color="#cfe3ea" stop-opacity=".35"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".8"/><stop offset=".56" stop-color="#cfe3ea" stop-opacity=".35"/><stop offset="1" stop-color="#b9d3dc" stop-opacity=".55"/></linearGradient>
    <pattern id="pTuftB" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="26" height="26" fill="${body}"/><path d="M0 0H26V26" stroke="${shade(body, .78)}" fill="none"/></pattern>
  </defs>
  <style>.dim path{stroke:#a8871a;stroke-width:1.6;fill:none}.dim rect{fill:#111}.dim text{fill:#f1d77a;font-size:14px;font-weight:700;text-anchor:middle;direction:ltr}.ttl{font-size:16px;font-weight:700;fill:#555;text-anchor:middle}</style>
  <rect width="${W}" height="${H}" fill="#fff"/>
  <text class="ttl" x="${tx + boxW / 2}" y="${pad}">منظر علوي — ${esc(SHAPES[st.shape] || '')}</text>
  <text class="ttl" x="${fx + boxW / 2}" y="${pad}">منظر أمامي — ${esc(OPT.mat.o[st.mat] || '')}${st.top !== 'same' && hasTopFor(p) ? ' • سطح ' + esc(OPT.top.o[st.top]) : ''}</text>
  <path d="M${pad * 1.5 + boxW} ${pad + 10}V${H - pad}" stroke="#eee" stroke-width="2"/>
  ${chairs}
  ${st.top === 'glass' && ['table', 'nesting', 'tiered'].includes(kind) ? (st.legs === 'pedestal' || kind === 'tiered' ? `<circle cx="${ox + tw / 2}" cy="${oy + td / 2}" r="${Math.max(6, tw * .08)}" fill="${legHex}"/>` : [[.1, .15], [.9, .15], [.1, .85], [.9, .85]].map(([a, b]) => `<circle cx="${ox + tw * a}" cy="${oy + td * b}" r="${Math.max(3, leg * .7)}" fill="${legHex}"/>`).join('')) : ''}
  <g fill="${fillTop}" stroke="#222" stroke-width="1.5">${topShape}</g>
  ${st.edge === 'beveled' && !['round', 'oval'].includes(st.shape) ? `<g fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1" transform="translate(${ox + tw / 2} ${oy + td / 2}) scale(.94) translate(${-(ox + tw / 2)} ${-(oy + td / 2)})">${topShape}</g>` : ''}
  ${st.edge === 'beveled' && ['round', 'oval'].includes(st.shape) ? `<g fill="none" stroke="rgba(0,0,0,.28)" transform="translate(${ox + tw / 2} ${oy + td / 2}) scale(.93) translate(${-(ox + tw / 2)} ${-(oy + td / 2)})">${topShape}</g>` : ''}
  ${dimH(ox, ox + tw, oy - 18 - (p.seats ? cm * s1 * 1.5 : 0), `${w} سم`)}
  ${round ? '' : dimV(ox + tw + (p.seats ? cm * s1 * 1.6 : 0) + 26, oy, oy + td, `${d} سم`)}
  ${front}
  ${dimH(gx, gx + fw, base + 22, `${w} سم`)}
  ${dimV(gx + fw + 30, top, base, `${h} سم`)}
  <path d="M${fx - 6} ${base}H${fx + boxW + 6}" stroke="#ccc" stroke-width="2"/>
</svg>`).replace(/id="(\w+)"/g, `id="$1_${uidS}"`).replace(/url\(#(\w+)\)/g, `url(#$1_${uidS})`);
}

// ---------- الصفحة ----------
function chips(name, map, cur, allow) {
  return `<div class="cz-chips" data-name="${name}">${Object.entries(map).filter(([k]) => !allow || allow.includes(k))
    .map(([k, t]) => `<button type="button" class="cz-chip ${k === cur ? 'on' : ''}" data-v="${k}">${esc(t)}</button>`).join('')}</div>`;
}
function swatches(name, list, cur) {
  return `<div class="cz-sw" data-name="${name}">${list.map(([n, hex]) => `<button type="button" class="${cur[1] === hex ? 'on' : ''}" data-n="${esc(n)}" data-hex="${hex}" title="${esc(n)}"><i style="background:${hex}"></i><span>${esc(n)}</span></button>`).join('')}
    <label class="cz-custom" title="لون مخصص"><input type="color" value="${cur[1]}"><span>لون مخصص</span></label></div>`;
}
function furnitureBranches() {
  const list = (D.branches || []).filter(b => /أثاث|اثاث/.test(b.departments || '') && (b.whatsapp || b.phone));
  const me = savedLoc();
  if (me) list.sort((a, b) => (coordsOf(a) ? km(me, coordsOf(a)) : 1e9) - (coordsOf(b) ? km(me, coordsOf(b)) : 1e9));
  return list.length ? list : (D.branches || []);
}
function catImage(key) {
  const words = CC[key].find, all = (D.categories || []).flatMap(c => c.products || []);
  const p = all.find(x => words.some(w => (x.name || '').includes(w)) && x.images?.[0]?.src);
  return p?.images[0].src || '';
}

function renderCustomHome() { // قسم مختصر في الصفحة الرئيسية
  return Object.entries(CC).map(([k, c]) => { const img = catImage(k); return `<a class="cz-tile" href="#custom/${k}">
    ${img ? imgTag(img, c.t, '', 640) : '<div class="ph" style="position:absolute;inset:0"></div>'}
    <div class="cz-tile-b"><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p><span class="go">←</span></div></a>`; }).join('');
}

function renderCustomPage(cat) {
  if (!CS || (cat && CC[cat] && CS.cat !== cat)) CS = newState(CC[cat] ? cat : 'service');
  return `<div class="wrap cz">
    <nav class="crumbs"><a href="#top">الرئيسية</a><span class="sep">‹</span><span>تفصيل حسب الطلب</span></nav>
    <div class="cz-hero"><div><span class="eyebrow">خدمة التفصيل</span><h1>صمّم قطعتك <span class="gold-text">بمقاساتك</span></h1>
      <p>ارفع صورة لقطعة أعجبتك (اختياري) وحدد المقاسات والخامات والألوان — نجهّز لك مخططاً واضحاً ونرسله لأقرب فرع.</p></div>
      <ol class="cz-steps"><li><b>1</b>اختر القطعة</li><li><b>2</b>حدد المقاسات والخامات</li><li><b>3</b>أرسل للفرع</li></ol></div>
    <div class="cz-grid">
      <aside class="cz-preview"><div class="cz-card">
        <div class="cz-prev-head"><b id="czTitle"></b><span id="czDims"></span></div>
        <div class="cz-svg" id="czSvg"></div>
        <div class="cz-sum" id="czSum"></div>
        <p class="cz-hint">المخطط توضيحي لمساعدة الفرع على فهم التصميم — يتم تأكيد التفاصيل النهائية معك قبل التنفيذ.</p>
      </div></aside>
      <div class="cz-form" id="czForm"></div>
    </div>
  </div>`;
}

function formHTML() {
  const p = pieceOf();
  const sec = (n, t, body, sub = '') => `<section class="cz-sec"><h3><span>${n}</span>${t}${sub ? `<small>${sub}</small>` : ''}</h3>${body}</section>`;
  return [
    sec(1, 'القسم والقطعة', `<div class="cz-cats">${Object.entries(CC).map(([k, c]) => `<button type="button" class="cz-cat ${k === CS.cat ? 'on' : ''}" data-cat="${k}">${esc(c.t)}</button>`).join('')}</div>
      ${chips('piece', Object.fromEntries(CC[CS.cat].pieces.map(x => [x.k, x.t])), CS.piece)}${p.note ? `<p class="cz-note">يشمل: ${esc(p.note)}</p>` : ''}`),
    sec(2, 'صورة مرجعية', `<div class="cz-ref" id="czRef">${CS.ref ? `<img src="${esc(CS.ref)}" alt=""><div class="cz-ref-actions"><button type="button" class="btn line sm" id="czAnalyze">✨ حلّل الصورة</button><button type="button" class="btn line sm" id="czRefDel">إزالة</button></div>`
      : `<label class="cz-drop"><input type="file" accept="image/*" id="czFile" hidden><b>＋ ارفع صورة</b><span>صورة لقطعة تعجبك — نحللها ونقترح المقاسات والشكل والخامة</span></label>`}</div>
      <div class="cz-ai" id="czAi" ${CS.ai ? '' : 'hidden'}>${CS.ai ? `<b>✨ تحليل الصورة:</b> ${esc(CS.ai)}<small>المقاسات المقترحة تقديرية — عدّلها حسب مساحتك.</small>` : ''}</div>`, 'اختياري'),
    sec(3, 'الشكل والمقاسات', `${chips('shape', SHAPES, CS.shape, p.shapes)}
      <div class="cz-dims">${[['w', CS.shape === 'round' ? 'القطر' : 'العرض'], ['d', 'العمق'], ['h', 'الارتفاع']].filter(([k]) => !(k === 'd' && ['round', 'square'].includes(CS.shape)))
        .map(([k, t]) => `<label><span>${t}</span><div class="cz-num"><button type="button" data-step="-5" data-k="${k}">−</button><input type="number" inputmode="numeric" min="10" max="600" value="${CS[k]}" data-k="${k}"><button type="button" data-step="5" data-k="${k}">+</button></div><small>سم</small></label>`).join('')}</div>
      ${p.seats ? `<h4>عدد الكراسي</h4>${chips('seats', { 4: '4 كراسي', 6: '6 كراسي', 8: '8 كراسي', 10: '10 كراسي', 12: '12 كرسي' }, String(CS.seats))}` : ''}`),
    sec(4, 'الخامات والتفاصيل', `<h4>${OPT.mat.t}</h4>${chips('mat', OPT.mat.o, CS.mat)}
      ${hasTop() ? `<h4>${OPT.top.t}</h4>${chips('top', OPT.top.o, CS.top)}<h4>${OPT.edge.t}</h4>${chips('edge', OPT.edge.o, CS.edge)}` : ''}
      ${hasDoors() ? `<h4>${OPT.door.t}</h4>${chips('door', OPT.door.o, CS.door)}<h4>${OPT.handle.t}</h4>${chips('handle', OPT.handle.o, CS.handle)}` : ''}
      ${hasLegs() ? `<h4>${OPT.legs.t}</h4>${chips('legs', OPT.legs.o, CS.legs)}` : ''}`),
    sec(5, 'الألوان', `<h4>اللون الأساسي: <b>${esc(CS.color[0])}</b></h4>${swatches('color', PALETTE, CS.color)}
      ${hasTop() && !['same', 'glass'].includes(CS.top) ? `<h4>لون السطح: <b>${esc(CS.topColor[0])}</b></h4>${swatches('topColor', TOP_PALETTE, CS.topColor)}` : ''}`),
    sec(6, 'بياناتك والإرسال', `<div class="cz-fields">
        <label><span>الكمية</span><input type="number" min="1" max="99" value="${CS.qty}" data-f="qty"></label>
        <label><span>الاسم</span><input type="text" value="${esc(CS.name)}" data-f="name" autocomplete="name"></label>
        <label><span>رقم الجوال</span><input type="tel" dir="ltr" value="${esc(CS.phone)}" data-f="phone" placeholder="05xxxxxxxx" autocomplete="tel"></label>
        <label><span>الفرع</span><select data-f="branch">${furnitureBranches().map((b, i) => `<option value="${i}" ${i === +CS.branch ? 'selected' : ''}>${esc(b.name)} — ${esc(b.area || '')}${b.city ? ' (' + esc(b.city) + ')' : ''}</option>`).join('')}</select></label>
        <label class="wide"><span>ملاحظات إضافية</span><textarea rows="3" data-f="notes" placeholder="مثال: أبي درجين بدل الأبواب، أو المساحة بجانب نافذة…">${esc(CS.notes)}</textarea></label>
      </div>
      <button type="button" class="btn gold cz-send" id="czSend">${svg('whatsapp')} إرسال الطلب للفرع</button>
      <p class="cz-hint">سيتم تجهيز مخطط الطلب وفتح واتساب الفرع برسالة جاهزة فيها كل التفاصيل — اضغط إرسال فقط.</p>
      <div id="czDone"></div>`),
  ].join('');
}

function specRows() {
  const p = pieceOf(), rows = [
    ['القسم', CC[CS.cat].t], ['القطعة', p.t + (p.note ? ` (${p.note})` : '')], ['الشكل', SHAPES[CS.shape]],
    ['المقاسات', `${CS.w} × ${['round', 'square'].includes(CS.shape) ? CS.w : CS.d} × ${CS.h} سم (عرض × عمق × ارتفاع)`],
    ['الخامة', OPT.mat.o[CS.mat]],
  ];
  if (hasTop()) rows.push(['السطح', OPT.top.o[CS.top]], ['الحواف', OPT.edge.o[CS.edge]]);
  if (hasDoors()) rows.push(['الأبواب', OPT.door.o[CS.door]], ['المقابض', OPT.handle.o[CS.handle]]);
  if (hasLegs()) rows.push(['الأرجل', OPT.legs.o[CS.legs]]);
  rows.push(['اللون الأساسي', CS.color[0], CS.color[1]]);
  if (hasTop() && !['same', 'glass'].includes(CS.top)) rows.push(['لون السطح', CS.topColor[0], CS.topColor[1]]);
  if (p.seats) rows.push(['عدد الكراسي', `${CS.seats} كراسي`]);
  rows.push(['الكمية', String(CS.qty)]);
  return rows;
}
function drawPreview() {
  $('czSvg').innerHTML = diagram(CS);
  $('czTitle').textContent = pieceOf().t;
  $('czDims').textContent = `${CS.w} × ${['round', 'square'].includes(CS.shape) ? CS.w : CS.d} × ${CS.h} سم`;
  $('czSum').innerHTML = specRows().slice(2).map(([l, v, hex]) => `<span>${hex ? `<i style="background:${hex}"></i>` : ''}<b>${esc(l)}:</b> ${esc(v)}</span>`).join('');
}
function drawForm() { $('czForm').innerHTML = formHTML(); drawPreview(); }

function wireCustom() {
  drawForm();
  const form = $('czForm');
  form.addEventListener('click', async (e) => {
    const cat = e.target.closest('[data-cat]');
    if (cat) { const keep = { name: CS.name, phone: CS.phone }; CS = Object.assign(newState(cat.dataset.cat), keep); history.replaceState(null, '', '#custom/' + cat.dataset.cat); return drawForm(); }
    const chip = e.target.closest('.cz-chip');
    if (chip) {
      const name = chip.parentElement.dataset.name, v = chip.dataset.v;
      if (name === 'piece') { const p = CC[CS.cat].pieces.find(x => x.k === v); Object.assign(CS, { piece: v, shape: p.shapes[0], w: p.dims[0], d: p.dims[1], h: p.dims[2] }); }
      else CS[name] = name === 'seats' ? +v : v;
      if (name === 'seats' && pieceOf().seats) { const need = Math.max(80, Math.ceil(+v / 2) * 60); if (CS.shape !== 'round' && CS.w < need) CS.w = need; if (CS.shape === 'round') CS.w = Math.max(CS.w, Math.round(+v * 60 / Math.PI)); }
      if (name === 'shape' && v === 'lshape' && CS.w < 150) CS.w = 180;
      return drawForm();
    }
    const sw = e.target.closest('.cz-sw button');
    if (sw) { CS[sw.parentElement.dataset.name] = [sw.dataset.n, sw.dataset.hex]; return drawForm(); }
    const step = e.target.closest('[data-step]');
    if (step) { const k = step.dataset.k; CS[k] = Math.max(10, Math.min(600, (+CS[k] || 0) + +step.dataset.step)); if (CS.shape === 'square' && k === 'w') CS.d = CS.w; return drawForm(); }
    if (e.target.id === 'czRefDel') { CS.ref = ''; CS.ai = ''; return drawForm(); }
    if (e.target.id === 'czAnalyze') return analyze();
    if (e.target.closest('#czSend')) return sendRequest();
  });
  form.addEventListener('input', (e) => {
    const k = e.target.dataset.k, f = e.target.dataset.f;
    if (k) { CS[k] = Math.max(0, Math.min(600, +e.target.value || 0)); drawPreview(); }
    if (f) { CS[f] = f === 'qty' || f === 'branch' ? +e.target.value : e.target.value; if (f === 'qty') drawPreview(); }
    if (e.target.type === 'color') { CS[e.target.closest('.cz-sw').dataset.name] = ['لون مخصص ' + e.target.value, e.target.value]; drawPreview(); }
  });
  form.addEventListener('change', async (e) => {
    if (e.target.type === 'color') drawForm();
    if (e.target.id === 'czFile' && e.target.files[0]) {
      const ref = $('czRef'); ref.innerHTML = '<div class="cz-loading"><i></i> جاري رفع الصورة…</div>';
      try {
        const r = await fetch('api/custom/upload', { method: 'POST', body: e.target.files[0] });
        const j = await r.json(); if (!r.ok) throw new Error(j.error);
        CS.ref = j.url; drawForm(); analyze(true);
      } catch (err) { alert(err.message || 'تعذّر رفع الصورة'); drawForm(); }
    }
  });
}

// استخراج الألوان الغالبة من الصورة محلياً (بدون خدمة خارجية)
async function extractColors(url) {
  const im = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
  const c = document.createElement('canvas'), N = 80; c.width = N; c.height = N;
  const g = c.getContext('2d'); g.drawImage(im, im.width * .15, im.height * .15, im.width * .7, im.height * .7, 0, 0, N, N);
  const px = g.getImageData(0, 0, N, N).data, bins = new Map();
  for (let i = 0; i < px.length; i += 4) {
    const [r, gg, b] = [px[i], px[i + 1], px[i + 2]], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    if (mn > 238 || mx < 14) continue; // تجاهل الخلفية البيضاء والسواد التام
    const k = (r >> 5) + ',' + (gg >> 5) + ',' + (b >> 5), e = bins.get(k) || [0, 0, 0, 0];
    e[0] += r; e[1] += gg; e[2] += b; e[3]++; bins.set(k, e);
  }
  const hex = (v) => '#' + v.map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
  const top = [...bins.values()].sort((a, b) => b[3] - a[3]).map(e => [e[0] / e[3], e[1] / e[3], e[2] / e[3]]);
  const out = [];
  for (const c1 of top) { if (out.every(c2 => Math.hypot(c1[0] - c2[0], c1[1] - c2[1], c1[2] - c2[2]) > 48)) out.push(c1); if (out.length === 4) break; }
  return out.map(hex);
}
function nearestName(hex) {
  const rgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), a = rgb(hex);
  return [...PALETTE, ...TOP_PALETTE].reduce((b, c) => { const d = Math.hypot(...rgb(c[1]).map((v, i) => v - a[i])); return d < b[0] ? [d, c[0]] : b; }, [1e9, ''])[1];
}
async function localColors(box, msg) {
  try {
    const cols = await extractColors(CS.ref);
    if (!cols.length) throw 0;
    CS.color = [nearestName(cols[0]) + ' (من الصورة)', cols[0]];
    CS.ai = '';
    drawPreview();
    box.hidden = false;
    box.innerHTML = `<b>🎨 ألوان القطعة من صورتك:</b>
      <div class="cz-sw" data-name="color" style="margin-top:8px">${cols.map(h => `<button type="button" data-n="${esc(nearestName(h))} (من الصورة)" data-hex="${h}"><i style="background:${h}"></i><span>${esc(nearestName(h))}</span></button>`).join('')}</div>
      <small>طبّقنا اللون الأساسي تلقائياً — اختر لون آخر من الصورة إذا تبي. ${esc(msg || '')}</small>`;
  } catch { box.innerHTML = `<small>${esc(msg || 'تعذّر قراءة الصورة')}</small>`; }
}

async function analyze(auto) {
  const box = $('czAi'); box.hidden = false; box.innerHTML = '<div class="cz-loading"><i></i> جاري تحليل الصورة واقتراح المقاسات…</div>';
  try {
    const r = await fetch('api/custom/analyze', { method: 'POST', body: JSON.stringify({ image: CS.ref }) });
    const j = await r.json();
    if (!r.ok) return localColors(box, j.error === 'off' ? 'تحديد نوع القطعة والمقاسات من الصورة يتفعّل من الإدارة — حدد المقاسات من الخطوة 3.' : (j.message || j.error));
    const cat = CC[j.category] ? j.category : CS.cat, piece = CC[cat].pieces.find(p => p.k === j.piece) || CC[cat].pieces[0];
    const nearest = (hex, list) => { const rgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); try { const a = rgb(hex); return list.reduce((b, c) => { const d = Math.hypot(...rgb(c[1]).map((v, i) => v - a[i])); return d < b[0] ? [d, c] : b; }, [1e9, list[0]])[1]; } catch { return list[0]; } };
    Object.assign(CS, {
      cat, piece: piece.k, shape: piece.shapes.includes(j.shape) ? j.shape : piece.shapes[0],
      w: j.width_cm || piece.dims[0], d: j.depth_cm || piece.dims[1], h: j.height_cm || piece.dims[2],
      mat: OPT.mat.o[j.material] ? j.material : CS.mat, top: OPT.top.o[j.top] ? j.top : CS.top, edge: OPT.edge.o[j.edge] ? j.edge : CS.edge,
      legs: OPT.legs.o[j.legs] ? j.legs : CS.legs,
      color: /^#[0-9a-f]{6}$/i.test(j.color_hex) ? [j.color_name || 'حسب الصورة', j.color_hex] : CS.color,
      ai: [j.style, j.summary].filter(Boolean).join(' — '),
    });
    if (!/^#[0-9a-f]{6}$/i.test(j.color_hex)) CS.color = nearest(CS.color[1], PALETTE);
    drawForm();
  } catch { localColors(box, 'أكمل المقاسات والخامات يدوياً.'); }
}

// ---------- ورقة المواصفات (صورة) ----------
function loadImg(src) { return new Promise((ok, no) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => ok(i); i.onerror = no; i.src = src; }); }
async function buildSheet(no) {
  const W = 1240, c = document.createElement('canvas'); let H = 3000; c.width = W; c.height = H;
  const g = c.getContext('2d'); g.direction = 'rtl'; g.textAlign = 'right';
  await document.fonts?.ready;
  const F = (s, w = 700) => `${w} ${s}px Tajawal, Tahoma, sans-serif`;
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  // الترويسة
  g.fillStyle = '#0b0c0f'; g.fillRect(0, 0, W, 190);
  g.fillStyle = '#DBB83C'; g.fillRect(0, 186, W, 4);
  try { const logo = await loadImg('assets/logo-mark.png'); g.drawImage(logo, W - 60 - 150, 30, 150, 150 * logo.height / logo.width); } catch {}
  g.fillStyle = '#fff'; g.font = F(46); g.fillText('طلب تفصيل حسب الطلب', W - 240, 88);
  g.fillStyle = '#f1d77a'; g.font = F(26, 500); g.fillText((D.company?.nameAr || '') + '  •  ' + new Date().toLocaleDateString('ar-SA-u-nu-latn'), W - 240, 138);
  g.textAlign = 'left'; g.fillStyle = '#f1d77a'; g.font = F(30); g.fillText(no, 60, 88);
  g.fillStyle = '#9d978a'; g.font = F(20, 500); g.fillText('رقم الطلب', 60, 124); g.textAlign = 'right';
  // العنوان
  const p = pieceOf();
  g.fillStyle = '#16140f'; g.font = F(40); g.fillText(p.t, W - 60, 262);
  g.fillStyle = '#a8871a'; g.font = F(26, 500); g.fillText(CC[CS.cat].t + '  •  ' + `${CS.w} × ${['round', 'square'].includes(CS.shape) ? CS.w : CS.d} × ${CS.h} سم`, W - 60, 304);
  // المخطط
  const svgStr = diagram(CS, { w: 1120, h: 547 });
  const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
  try { const im = await loadImg(url); g.strokeStyle = '#e9e1cf'; g.lineWidth = 2; g.strokeRect(59, 329, 1122, 549); g.drawImage(im, 60, 330, 1120, 547); } catch {}
  URL.revokeObjectURL(url);
  // جدول المواصفات
  let y = 940; const rows = specRows(), refW = CS.ref ? 380 : 0, tableR = W - 60, tableL = 60 + (refW ? refW + 40 : 0);
  g.font = F(30); g.fillStyle = '#16140f'; g.fillText('المواصفات', tableR, y - 20);
  rows.forEach(([l, v, hex], i) => {
    const ry = y + i * 50;
    g.fillStyle = i % 2 ? '#fff' : '#faf7ef'; g.fillRect(tableL, ry, tableR - tableL, 50);
    g.fillStyle = '#7a7468'; g.font = F(22, 500); g.fillText(l, tableR - 18, ry + 33);
    g.fillStyle = '#16140f'; g.font = F(23); let vx = tableR - 230;
    if (hex) { g.fillStyle = hex; g.beginPath(); g.arc(vx - 12, ry + 25, 13, 0, 7); g.fill(); g.strokeStyle = '#ccc'; g.stroke(); vx -= 36; g.fillStyle = '#16140f'; }
    g.fillText(v, vx, ry + 33, tableR - 230 - tableL - 20);
  });
  g.strokeStyle = '#e9e1cf'; g.strokeRect(tableL, y, tableR - tableL, rows.length * 50);
  // الصورة المرجعية
  if (CS.ref) {
    try {
      const im = await loadImg(CS.ref); const bw = refW, bh = Math.min(520, bw * im.height / im.width);
      g.font = F(26); g.fillStyle = '#16140f'; g.fillText('الصورة المرجعية', 60 + refW, y - 20);
      g.drawImage(im, 60, y, bw, bh); g.strokeStyle = '#e9e1cf'; g.strokeRect(60, y, bw, bh);
    } catch {}
  }
  y = Math.max(y + rows.length * 50, CS.ref ? y + 540 : 0) + 60;
  // الملاحظات وتحليل الصورة
  const wrap = (text, x, yy, maxW, lh) => { const words = String(text).split(/\s+/); let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { g.fillText(line, x, yy); yy += lh; line = w; } else line = t; } if (line) g.fillText(line, x, yy); return yy + lh; };
  if (CS.notes) { g.font = F(26); g.fillStyle = '#16140f'; g.fillText('ملاحظات العميل', W - 60, y); g.font = F(23, 500); g.fillStyle = '#4a463d'; y = wrap(CS.notes, W - 60, y + 40, W - 120, 36) + 10; }
  if (CS.ai) { g.font = F(26); g.fillStyle = '#16140f'; g.fillText('وصف التصميم من الصورة', W - 60, y); g.font = F(23, 500); g.fillStyle = '#4a463d'; y = wrap(CS.ai, W - 60, y + 40, W - 120, 36) + 10; }
  // العميل والفرع (الطول النهائي حسب المحتوى)
  H = Math.max(1754, y + 200);
  const b = furnitureBranches()[+CS.branch] || {};
  g.fillStyle = '#0b0c0f'; g.fillRect(0, H - 170, W, 170); g.fillStyle = '#DBB83C'; g.fillRect(0, H - 170, W, 3);
  g.fillStyle = '#fff'; g.font = F(28); g.fillText('العميل: ' + CS.name, W - 60, H - 112);
  g.fillStyle = '#f1d77a'; g.font = F(26, 500); g.fillText('الجوال: ' + CS.phone, W - 60, H - 66);
  g.textAlign = 'left'; g.fillStyle = '#fff'; g.font = F(26); g.fillText('الفرع: ' + (b.name || '') + ' — ' + (b.area || ''), 60, H - 112);
  g.fillStyle = '#9d978a'; g.font = F(22, 500); g.fillText('المخطط توضيحي — تُؤكد التفاصيل مع العميل قبل التنفيذ', 60, H - 66);
  const out = document.createElement('canvas'); out.width = W; out.height = H; out.getContext('2d').drawImage(c, 0, 0);
  return new Promise(ok => out.toBlob(ok, 'image/png'));
}

async function sendRequest() {
  const done = $('czDone'), btn = $('czSend');
  if (!CS.name.trim() || !/^[\d\s+]{8,16}$/.test(CS.phone)) { done.innerHTML = '<p class="cz-err">اكتب اسمك ورقم جوالك عشان يتواصل معك الفرع.</p>'; return; }
  const b = furnitureBranches()[+CS.branch] || {};
  btn.disabled = true; btn.innerHTML = '<span class="spin"></span> جاري تجهيز المخطط…';
  try {
    const rows = specRows(), p = pieceOf();
    const r = await fetch('api/custom/request', { method: 'POST', body: JSON.stringify({
      category: CS.cat, categoryTitle: CC[CS.cat].t, piece: CS.piece, pieceTitle: p.t, shape: CS.shape, shapeTitle: SHAPES[CS.shape],
      dims: { w: CS.w, d: ['round', 'square'].includes(CS.shape) ? CS.w : CS.d, h: CS.h },
      specs: rows.map(([label, value, hex]) => ({ label, value, hex })), qty: CS.qty, notes: CS.notes, refImage: CS.ref, ai: CS.ai,
      customer: { name: CS.name, phone: CS.phone, city: b.city || '' }, branch: { name: b.name, area: b.area, whatsapp: b.whatsapp || b.phone } }) });
    const j = await r.json(); if (!r.ok) throw new Error(j.error);
    const blob = await buildSheet(j.no);
    await fetch('api/custom/sheet/' + j.id, { method: 'POST', body: blob }).catch(() => {});
    const link = location.href.split('#')[0] + '#r/' + j.id;
    const msg = [`*طلب تفصيل حسب الطلب* — ${j.no}`, '━━━━━━━━━━', ...rows.map(([l, v]) => `▪ ${l}: ${v}`),
      CS.notes && `▪ ملاحظات: ${CS.notes}`, '━━━━━━━━━━', `👤 ${CS.name} — ${CS.phone}`, window.STATIC_SITE ? '📎 ملف المخطط نزل على جهازك — أرفقه في هذه المحادثة' : `📐 المخطط والتفاصيل${CS.ref ? ' والصورة المرجعية' : ''}:`, window.STATIC_SITE ? '' : link].filter(Boolean).join('\n');
    const wa = `https://wa.me/${intl(b.whatsapp || b.phone || D.contact?.whatsapp)}?text=${encodeURIComponent(msg)}`;
    done.innerHTML = `<div class="cz-ok"><b>✓ تم تجهيز طلبك رقم ${esc(j.no)}</b><p>اضغط الزر لفتح واتساب ${esc(b.name || 'الفرع')} — الرسالة جاهزة، اضغط إرسال فقط.</p>
      <a class="btn wa" href="${wa}" target="_blank" rel="noopener">${svg('whatsapp')} فتح واتساب وإرسال الطلب</a>${window.STATIC_SITE ? '<p style="margin-top:8px">📎 تم تنزيل صورة المخطط على جهازك — أرفقها في محادثة الواتساب.</p>' : ` <a class="btn line" href="#r/${j.id}">عرض الطلب</a>`}</div>`;
    window.open(wa, '_blank', 'noopener');
  } catch (e) { done.innerHTML = `<p class="cz-err">${esc(e.message || 'تعذّر الإرسال')}</p>`; }
  finally { btn.disabled = false; btn.innerHTML = `${svg('whatsapp')} إرسال الطلب للفرع`; }
}

// ---------- صفحة الطلب للفرع ----------
const STATUS = { new: 'جديد', contacted: 'تم التواصل', quoted: 'تم التسعير', progress: 'قيد التنفيذ', done: 'مكتمل', cancelled: 'ملغي' };
function renderRequestPage(id) {
  const page = $('page');
  page.innerHTML = '<div class="wrap"><p class="empty-note">جاري تحميل الطلب…</p></div>';
  fetch('api/custom/r/' + id).then(r => r.json()).then(q => {
    if (q.error) { page.innerHTML = `<div class="wrap"><p class="empty-note">${esc(q.error)}</p></div>`; return; }
    page.innerHTML = `<div class="wrap czr">
      <div class="czr-head"><div><span class="eyebrow">طلب تفصيل حسب الطلب</span><h1>${esc(q.pieceTitle)} <small>${esc(q.categoryTitle)}</small></h1>
        <p>رقم الطلب <b dir="ltr">${esc(q.no)}</b> • ${new Date(q.created).toLocaleString('ar-SA-u-nu-latn')} • <span class="badge">${STATUS[q.status] || q.status}</span></p></div>
        <div class="czr-actions"><a class="btn wa" href="https://wa.me/${intl(q.customer.phone)}" target="_blank" rel="noopener">${svg('whatsapp')} واتساب العميل</a>
          <a class="btn line" href="tel:${digits(q.customer.phone)}">${svg('phone')} اتصال</a><button class="btn line" onclick="print()">طباعة</button></div></div>
      ${q.sheet ? `<a class="czr-sheet" href="${esc(q.sheet)}" target="_blank" rel="noopener"><img src="${esc(q.sheet)}" alt="مخطط الطلب"></a>` : ''}
      <div class="czr-grid">
        <div><h3>المواصفات</h3><table class="specs">${q.specs.map(s => `<tr><td>${esc(s.label)}</td><td>${s.hex ? `<i class="czr-dot" style="background:${esc(s.hex)}"></i>` : ''}${esc(s.value)}</td></tr>`).join('')}
          ${q.notes ? `<tr><td>ملاحظات العميل</td><td>${esc(q.notes)}</td></tr>` : ''}${q.ai ? `<tr><td>وصف من الصورة</td><td>${esc(q.ai)}</td></tr>` : ''}</table></div>
        <div><h3>العميل والفرع</h3><table class="specs"><tr><td>الاسم</td><td>${esc(q.customer.name)}</td></tr><tr><td>الجوال</td><td dir="ltr" style="text-align:right">${esc(q.customer.phone)}</td></tr>
          <tr><td>الفرع</td><td>${esc(q.branch.name)} — ${esc(q.branch.area)}</td></tr></table>
          ${q.refImage ? `<h3 style="margin-top:20px">الصورة المرجعية</h3><a href="${esc(q.refImage)}" target="_blank" rel="noopener"><img class="czr-ref" src="${esc(q.refImage)}" alt=""></a>` : ''}</div>
      </div></div>`;
  }).catch(() => { page.innerHTML = '<div class="wrap"><p class="empty-note">تعذّر تحميل الطلب</p></div>'; });
}
