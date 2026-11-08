// عرض محتوى البروفايل من ملف البيانات
const ICONS = {
  phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/>',
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.6 14.2c-.2.6-1.4 1.2-1.9 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6 0l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.1.1.6-.1 1.2z" fill="currentColor"/>',
  mail: '<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
  pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/>',
  clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>',
  tiktok: '<path d="M16 3c.4 2.4 1.9 4 4.5 4.2v3.2a8 8 0 0 1-4.4-1.4v6.6A6.4 6.4 0 1 1 9.7 9.3v3.3a3.2 3.2 0 1 0 3.1 3.2V3z" fill="currentColor"/>',
  snapchat: '<path d="M12 2.5c3 0 5.3 2.3 5.3 5.4v2.3l1.6-.5c.6 0 1 .4.8.9-.3.7-1.9 1-2.3 1.3.4 1.5 2 3.4 3.7 3.8.4.1.5.6.1.9-.7.5-1.8.6-2.4.8l-.4 1.2c-.9 0-1.9-.3-3 .2-1 .5-1.8 1.7-3.4 1.7s-2.4-1.2-3.4-1.7c-1.1-.5-2.1-.2-3-.2l-.4-1.2c-.6-.2-1.7-.3-2.4-.8-.4-.3-.3-.8.1-.9 1.7-.4 3.3-2.3 3.7-3.8-.4-.3-2-.6-2.3-1.3-.2-.5.2-.9.8-.9l1.6.5V7.9c0-3.1 2.3-5.4 5.3-5.4z" fill="currentColor"/>',
  youtube: '<path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15V9l5.2 3z" fill="currentColor"/>',
  facebook: '<path d="M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V2h-2.6C11.3 2 10.5 3.900 10.5 6v2H8v3h2.5v11H14V11h2.6l.4-3z" fill="currentColor"/>',
  pinterest: '<path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.7-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2z" fill="currentColor"/>',
  x: '<path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z" fill="currentColor"/>',
};
const svg = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const digits = (s) => String(s || '').replace(/\D/g, '');
const intl = (s) => { let d = digits(s); if (d.startsWith('00')) d = d.slice(2); if (d.startsWith('0')) d = '966' + d.slice(1); return d; };
const $ = (id) => document.getElementById(id);

const SOCIAL = {
  instagram: h => `https://instagram.com/${h}`, tiktok: h => `https://www.tiktok.com/@${h}`,
  snapchat: h => `https://www.snapchat.com/add/${h}`, youtube: h => `https://www.youtube.com/@${h}`,
  facebook: h => `https://facebook.com/${h}`, pinterest: h => `https://pinterest.com/${h}`, x: h => `https://x.com/${h}`,
};
const socialUrl = (k, v) => /^https?:\/\//.test(v) ? v : SOCIAL[k](String(v).replace(/^@/, ''));

let gallery = [], gIndex = 0;
function openGallery(items, i = 0) {
  if (!items.length) return;
  gallery = items; gIndex = i; showG(); $('lb').hidden = false; document.body.style.overflow = 'hidden';
}
function showG() {
  const it = gallery[gIndex];
  $('lbImg').src = it.src; $('lbCap').textContent = it.cap || '';
  $('lbPrev').hidden = $('lbNext').hidden = gallery.length < 2;
}
function closeG() { $('lb').hidden = true; document.body.style.overflow = ''; }

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
ICONS.grid = '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor"/>';

// ===================== نظام الحركة =====================
// يظهر العناصر عند وصولها للشاشة، مع تتابع للعناصر داخل [data-stagger]
let revealIO = null;
function motion(root = document) {
  root.querySelectorAll('[data-stagger]').forEach(g => [...g.children].forEach((el, i) => {
    if (!el.hasAttribute('data-r')) el.setAttribute('data-r', g.dataset.stagger || '');
    el.style.setProperty('--i', i % 8);
  }));
  const els = root.querySelectorAll('[data-r]:not(.in)');
  if (REDUCED || !('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
  revealIO ??= new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => revealIO.observe(el));
  markImgs(root);
}
// تلاشي الصور عند التحميل
function markImgs(root = document) { root.querySelectorAll('img.fi').forEach(i => { if (i.complete && i.naturalWidth) i.classList.add('ld'); }); }
addEventListener('load', e => { if (e.target.tagName === 'IMG') e.target.classList.add('ld'); }, true);

// عدّاد الأرقام
function countUp(el) {
  const raw = el.dataset.count, m = /^(\D*)([\d.,]+)(.*)$/.exec(raw);
  if (!m || REDUCED) { el.textContent = raw; return; }
  const target = parseFloat(m[2].replace(/,/g, '')), t0 = performance.now(), dur = 1600;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = m[1] + Math.round(target * e).toLocaleString('en') + m[3];
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const sized = (src, w) => (w && /^uploads\/[^?]+\.(webp|jpe?g|png)$/i.test(src || '')) ? `uploads/t/${src.slice(8).replace(/\.\w+$/, '')}-${[320, 480, 640, 960, 1280].find(x => x >= w) || 1280}.webp` : src;
const imgTag = (src, alt = '', cls = '', w = 640) => `<img class="fi ${cls}" src="${esc(sized(src, w))}" alt="${esc(alt)}" loading="lazy" decoding="async">`;

function cardHTML(title, sub, desc, img, count) {
  return `<article class="card">
    <div class="card-img">${img ? imgTag(img, title) : `<div class="ph" style="position:absolute;inset:0"><span>${esc(title)}</span></div>`}
      ${count ? `<span class="card-count">${count} صورة</span>` : ''}</div>
    <div class="card-body">${sub ? `<div class="sub">${esc(sub)}</div>` : ''}<h3>${esc(title)}</h3>${desc ? `<p>${esc(desc)}</p>` : ''}</div>
  </article>`;
}

// ===================== التقسيط (تابي وتمارا) =====================
const PAY = { tabby: ['assets/tabby.png', 'تابي'], tamara: ['assets/tamara.png', 'تمارا'] };
const payOn = () => { const i = D?.installments || {}; return i.enabled !== false && (D?.sections?.installments !== false) ? Object.keys(PAY).filter(k => i[k] !== false) : []; };
const payLogos = (list) => list.map(k => `<img src="${PAY[k][0]}" alt="${PAY[k][1]}" loading="lazy">`).join('');
function payBadge() {
  const list = payOn(); if (!list.length || D.installments?.showOnProducts === false) return '';
  return `<div class="pay-badge"><span>قسّطها مع</span>${payLogos(list)}</div>`;
}

// ===================== أوقات الدوام (بتوقيت السعودية) =====================
const toMin = (t) => { const m = /(\d{1,2}):(\d{2})/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
function shiftsOf(b) {
  const src = (b && b.shifts && b.shifts.trim()) ? b.shifts.split(/[,،\n]+/) : [D?.hours?.s1, D?.hours?.s2];
  return src.map(x => String(x || '').split(/\s*[-–]\s*/)).map(([a, z]) => [toMin(a), toMin(z)]).filter(([a, z]) => a != null && z != null);
}
const fmtT = (m) => { let h = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, '0'); const pm = h >= 12; h = h % 12 || 12; return `${h}:${mm} ${pm ? 'م' : 'ص'}`; };
function riyadhNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return +p.hour * 60 + +p.minute;
}
function openStatus(b) {
  const sh = shiftsOf(b).sort((x, y) => x[0] - y[0]); if (!sh.length) return null;
  const now = riyadhNow();
  const cur = sh.find(([a, z]) => now >= a && now < (z <= a ? z + 1440 : z));
  if (cur) { const left = cur[1] - now; return { open: true, text: left <= 30 ? `مفتوح • يغلق بعد ${left} دقيقة` : `مفتوح الآن • يغلق ${fmtT(cur[1])}` }; }
  const next = sh.find(([a]) => a > now);
  return { open: false, text: next ? `مغلق الآن • يفتح ${fmtT(next[0])}` : `مغلق الآن • يفتح غداً ${fmtT(sh[0][0])}` };
}
const hoursText = (b) => shiftsOf(b).map(([a, z]) => `${fmtT(a)} – ${fmtT(z)}`);
const statusPill = (b) => { const st = openStatus(b); return st ? `<span class="open-pill ${st.open ? 'on' : 'off'}" data-branch-status>${esc(st.text)}</span>` : ''; };
function refreshStatuses() {
  document.querySelectorAll('[data-bid]').forEach(el => {
    const b = (D.branches || []).find(x => x.id === el.dataset.bid); const pill = el.querySelector('[data-branch-status]'); if (!b || !pill) return;
    const st = openStatus(b); if (!st) return; pill.textContent = st.text; pill.className = 'open-pill ' + (st.open ? 'on' : 'off');
  });
}
setInterval(() => D && refreshStatuses(), 60000);

// ===================== الواجهة الرئيسية =====================
let heroTimer = null;
function render(d) {
  document.title = d.company.nameAr || document.title;
  if (d.theme?.gold) document.documentElement.style.setProperty('--gold', d.theme.gold);
  document.querySelectorAll('[data-bind]').forEach(el => { el.textContent = get(d, el.dataset.bind) ?? ''; });
  document.querySelectorAll('[data-bind-src]').forEach(el => { const v = get(d, el.dataset.bindSrc); if (v) el.src = v; });
  const c = d.contact || {};
  const waAll = c.whatsapp ? `https://wa.me/${intl(c.whatsapp)}` : '';
  const cats = d.categories || [];
  const allProducts = cats.flatMap(cat => (cat.products || []).map(p => ({ cat, p })));

  // ---- العنوان: كلمة كلمة، وآخر كلمتين بالذهبي ----
  const words = String(d.company.heroTitle || '').trim().split(/\s+/).filter(Boolean);
  $('heroTitle').innerHTML = words.map((w, i) =>
    `<span class="w ${words.length > 3 && i >= words.length - 2 ? 'g' : ''}"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
  if (d.company.heroImage) $('heroBg').style.backgroundImage = `linear-gradient(100deg,rgba(11,12,15,.95) 25%,rgba(11,12,15,.55)),url("${d.company.heroImage}")`;
  $('heroWa').innerHTML = `${svg('whatsapp')} ${esc(d.company.heroButton || 'تواصل واتساب')}`;
  $('heroWa').href = waAll || '#contact';
  $('navCta').innerHTML = `${svg('whatsapp')} تواصل واتساب`; $('navCta').href = waAll || '#contact';
  $('heroStats').innerHTML = (d.about.stats || []).slice(0, 3).map(s =>
    `<div><strong data-count="${esc(s.number)}">${esc(s.number)}</strong><span>${esc(s.label)}</span></div>`).join('');

  // ---- معرض الواجهة: المنتجات المميزة ----
  const showcase = (allProducts.filter(x => x.p.featured).length >= 3 ? allProducts.filter(x => x.p.featured) : allProducts)
    .filter(x => x.p.images?.[0]?.src).slice(0, 6);
  if (d.company.heroImage && !showcase.length) showcase.push({ p: { name: d.company.nameAr, images: [{ src: d.company.heroImage }] }, cat: null });
  $('hsSlides').innerHTML = showcase.map((x, i) =>
    `<div class="hs-slide ${i === 0 ? 'on' : ''}"><img src="${esc(sized(x.p.images[0].src, 1280))}" alt="${esc(x.p.name)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"></div>`).join('');
  $('hsDots').innerHTML = showcase.length > 1 ? showcase.map((_, i) => `<button class="${i === 0 ? 'on' : ''}" aria-label="شريحة ${i + 1}"></button>`).join('') : '';
  $('heroShow').hidden = !showcase.length;
  let hs = 0;
  const showSlide = (n) => {
    hs = (n + showcase.length) % showcase.length;
    [...$('hsSlides').children].forEach((s, i) => s.classList.toggle('on', i === hs));
    [...$('hsDots').children].forEach((b, i) => { b.classList.remove('on'); if (i === hs) { void b.offsetWidth; b.classList.add('on'); } });
    const x = showcase[hs], card = $('hsCard');
    card.href = x.cat ? `#p/${x.cat.id}/${x.p.id}` : '#categories';
    card.innerHTML = `<img src="${esc(sized(x.p.images[0].src, 320))}" alt=""><span><small>${esc(x.cat?.title || '')}</small><b>${esc(x.p.name)}</b></span><span class="go">←</span>`;
    card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
  };
  $('hsDots').onclick = (e) => { const b = e.target.closest('button'); if (b) { showSlide([...$('hsDots').children].indexOf(b)); restart(); } };
  const restart = () => { clearInterval(heroTimer); if (showcase.length > 1 && !REDUCED) heroTimer = setInterval(() => { if (!document.hidden && heroVisible) showSlide(hs + 1); }, 5500); };
  let heroVisible = true;
  new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }).observe($('top'));
  if (showcase.length) { showSlide(0); restart(); }

  // ---- الشريط المتحرك ----
  const mq = [...String(d.company.tagline || '').split(/\s*[-–،,]\s*/).filter(Boolean), 'تفصيل حسب الطلب', d.company.slogan].filter(Boolean);
  const mqHTML = mq.map(t => `<span>${esc(t)}</span>`).join('');
  $('mq').innerHTML = mqHTML.repeat(4);

  // ---- من نحن ----
  $('aboutMedia').innerHTML = d.about.image ? imgTag(d.about.image, '', '', 960) : `<img class="mark" src="${esc(d.company.logo)}" alt="">`;
  $('values').innerHTML = (d.about.values || []).map((v, i) =>
    `<div class="value"><span class="num">0${i + 1}</span><b>${esc(v.title)}</b><p>${esc(v.text)}</p></div>`).join('');

  // ---- الأقسام (بنتو) ----
  $('catGrid').innerHTML = cats.map(cat => {
    const n = cat.products?.length, img = cat.cover || cat.products?.[0]?.images?.[0]?.src || cat.images?.[0]?.src;
    return `<a class="tile" href="#c/${esc(cat.id)}" data-id="${esc(cat.id)}">${img ? imgTag(img, cat.title, '', cats.indexOf(cat) === 0 ? 1280 : 640) : `<div class="ph"><span>${esc(cat.title)}</span></div>`}
      <div class="tile-body"><div>${n ? `<small>${n} منتج</small>` : ''}<h3>${esc(cat.title)}</h3>${cat.description ? `<p>${esc(cat.description)}</p>` : ''}</div><span class="go">←</span></div></a>`;
  }).join('') || '<p class="empty-note">لا توجد أقسام بعد</p>';
  $('catGrid').onclick = (e) => {
    const t = e.target.closest('.tile'); if (!t) return;
    const cat = cats.find(x => x.id === t.dataset.id);
    if (cat && !cat.products?.length && cat.images?.length) { e.preventDefault(); openGallery(cat.images.map(m => ({ src: m.src, cap: m.caption || cat.title }))); }
  };

  // ---- منتجات مختارة ----
  const feat = (allProducts.filter(x => x.p.featured).length >= 4 ? allProducts.filter(x => x.p.featured)
    : cats.map(cat => cat.products?.[0] && { cat, p: cat.products[0] }).filter(Boolean).concat(allProducts.filter(x => x.p.featured))).slice(0, 12);
  const seen = new Set();
  $('featRow').innerHTML = feat.filter(x => !seen.has(x.p) && seen.add(x.p)).map(x => productCard(x.cat, x.p, true)).join('');
  $('featured').hidden = !feat.length;

  // ---- التقسيط ----
  const inst = d.installments || {}, payList = Object.keys(PAY).filter(k => inst[k] !== false);
  $('payTitle').textContent = inst.title || 'اشتري ولا تشيل هم الدفع';
  $('paySub').textContent = inst.subtitle || 'التقسيط متوفر عبر';
  $('payLogos').innerHTML = payLogos(payList);

  // ---- الريلز ----
  const reels = (d.reels || []).filter(r => r.video || r.tiktokId);
  $('reelRow').innerHTML = reels.map((r, i) => `<div class="reel" data-i="${i}">
    ${r.poster ? imgTag(r.poster, '', '', 480) : `<div class="ph" style="position:absolute;inset:0"><span>${r.tiktokId ? svg('tiktok') : ''}</span></div>${/^\d+$/.test(r.tiktokId || '') ? `<img src="${sized('uploads/tt-' + r.tiktokId + '.webp', 480)}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="this.remove()">` : ''}`}
    ${r.video && !r.tiktokId ? `<video muted loop playsinline preload="none" data-src="${esc(r.video)}"></video>` : ''}
    ${r.tiktokId ? `<span class="tt-badge">${svg('tiktok')}</span>` : ''}<span class="play">▶</span>${r.title ? `<span class="rt">${esc(r.title)}</span>` : ''}</div>`).join('');
  [...$('reelRow').children].forEach(el => {
    const v = el.querySelector('video');
    const start = () => { if (!v) return; if (!v.src) v.src = v.dataset.src; v.play().then(() => el.classList.add('playing')).catch(() => {}); };
    const stop = () => { if (!v) return; v.pause(); el.classList.remove('playing'); };
    if (matchMedia('(hover:hover)').matches) { el.onmouseenter = start; el.onmouseleave = stop; }
    el.onclick = () => openReels(reels, +el.dataset.i);
  });

  // ---- المشاريع والعملاء (تُخفى تلقائياً إذا لم تُعبّأ بعد) ----
  const projs = (d.projects || []).filter(p => p.images?.length);
  $('projGrid').innerHTML = projs.map(p => cardHTML(p.title, p.client, p.description, p.images[0].src, p.images.length)).join('');
  [...$('projGrid').children].forEach((el, i) => el.onclick = () => openGallery(projs[i].images.map(m => ({ src: m.src, cap: m.caption || projs[i].title }))));
  const clients = (d.clients || []).filter(x => x.logo || (x.name && x.name !== 'اسم العميل'));
  $('clientGrid').innerHTML = clients.map(x =>
    `<div class="client" title="${esc(x.name)}">${x.logo ? imgTag(x.logo, x.name) : esc(x.name)}</div>`).join('');

  // ---- آراء العملاء ----
  const reviews = (d.reviews || []).filter(r => r.text);
  $('reviewRow').innerHTML = reviews.map(r => `<figure class="review" data-r="zoom">
    <span class="q">”</span><p>${esc(r.text)}</p>
    <div class="stars" aria-label="${+r.stars || 5} نجوم">${'★'.repeat(Math.max(1, Math.min(5, +r.stars || 5)))}</div>
    <figcaption class="who"><span class="av">${esc((r.name || '؟').trim()[0])}</span><span><b>${esc(r.name || 'عميل')}</b><small>${esc(r.branch || '')}</small></span></figcaption>
  </figure>`).join('');

  // ---- الفروع + فلتر المدن ----
  const branches = d.branches || [];
  $('branchGrid').innerHTML = branches.map(b => `<article class="branch" data-city="${esc(b.city || '')}" data-bid="${esc(b.id)}" data-r>
    <div class="branch-img">${b.photo ? imgTag(b.photo, b.name) : '<div class="ph" style="position:absolute;inset:0"></div>'}${b.city ? `<span class="city">${esc(b.city)}</span>` : ''}</div>
    <div class="branch-body">
      <div class="branch-top"><h3>${esc(b.name)}</h3>${d.hours?.show !== false ? statusPill(b) : ''}</div>
      ${b.area || b.address ? `<div class="row">${svg('pin')}<span>${esc(b.area || b.address)}</span></div>` : ''}
      ${b.departments ? `<div class="row">${svg('grid')}<span>${esc(b.departments)}</span></div>` : ''}
      ${d.hours?.show !== false && shiftsOf(b).length ? `<div class="hours">${svg('clock')}<div><small>أوقات الدوام${d.hours?.days ? ' — ' + esc(d.hours.days) : ''}</small>${hoursText(b).map((t, i) => `<span><b>${i ? 'مساءً' : 'صباحاً'}</b><em dir="rtl">${esc(t)}</em></span>`).join('')}</div></div>` : (b.hours ? `<div class="row">${svg('clock')}<span>${esc(b.hours)}</span></div>` : '')}
      ${b.phone ? `<div class="row">${svg('phone')}<a href="tel:${digits(b.phone)}" dir="ltr">${esc(b.phone)}</a></div>` : ''}
      <div class="branch-btns">
        ${b.whatsapp ? `<a class="bb wa" href="https://wa.me/${intl(b.whatsapp)}" target="_blank" rel="noopener">${svg('whatsapp')} واتساب</a>
        <a class="bb" href="tel:${digits(b.whatsapp)}">${svg('phone')} اتصال</a>` : '<span></span><span></span>'}
        <a class="bb map-btn" href="${esc(mapHref(b))}" target="_blank" rel="noopener" aria-label="الموقع على خرائط جوجل" title="الموقع على خرائط جوجل">${svg('pin')}</a>
      </div>
    </div></article>`).join('');
  const cities = [...new Set(branches.map(b => b.city).filter(Boolean))];
  $('cityChips').innerHTML = cities.length > 1 ? [['', 'الكل', branches.length], ...cities.map(x => [x, x, branches.filter(b => b.city === x).length])]
    .map(([v, t, n], i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-v="${esc(v)}">${esc(t)}<small>${n}</small></button>`).join('') : '';
  $('cityChips').onclick = (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $('cityChips').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
    $('branchGrid').querySelectorAll('.branch').forEach(card => {
      const show = !b.dataset.v || card.dataset.city === b.dataset.v;
      card.classList.toggle('hide', !show);
      if (show) { card.classList.remove('in'); void card.offsetWidth; card.classList.add('in'); }
    });
  };

  // ---- التواصل ----
  const btns = [];
  if (c.whatsapp) btns.push(`<a class="cbtn" href="${waAll}" target="_blank" rel="noopener">${svg('whatsapp')}<span><small>واتساب</small><b>${esc(c.whatsapp)}</b></span></a>`);
  if (c.phone) btns.push(`<a class="cbtn" href="tel:${digits(c.phone)}">${svg('phone')}<span><small>اتصل بنا</small><b>${esc(c.phone)}</b></span></a>`);
  if (c.email) btns.push(`<a class="cbtn" href="mailto:${esc(c.email)}">${svg('mail')}<span><small>البريد الإلكتروني</small><b>${esc(c.email)}</b></span></a>`);
  btns.push(`<a class="cbtn" href="#branches">${svg('pin')}<span><small>${branches.length} فرعاً في ${esc(cities.join(' و') || 'المملكة')}</small><b style="direction:rtl">اعرض الفروع</b></span></a>`);
  $('contactBtns').innerHTML = btns.join('');
  const socialHTML = Object.keys(SOCIAL).filter(k => c[k]).map(k =>
    `<a href="${esc(socialUrl(k, c[k]))}" target="_blank" rel="noopener" aria-label="${k}">${svg(k)}</a>`).join('');
  $('social').innerHTML = socialHTML; $('footSocial').innerHTML = socialHTML;

  // ---- الفوتر ----
  $('footCats').innerHTML = cats.map(cat => `<a href="#c/${esc(cat.id)}">${esc(cat.title)}</a>`).join('');
  $('footContact').innerHTML = [
    c.whatsapp && `<a href="${waAll}" target="_blank" rel="noopener">واتساب: <span dir="ltr">${esc(c.whatsapp)}</span></a>`,
    c.phone && `<a href="tel:${digits(c.phone)}">هاتف: <span dir="ltr">${esc(c.phone)}</span></a>`,
    c.email && `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`,
    cities.length && `<span>${esc(cities.join(' • '))}</span>`].filter(Boolean).join('');

  // ---- الأزرار العائمة وشريط الجوال ----
  const wa = $('waFloat');
  if (c.whatsapp) { wa.href = waAll; wa.innerHTML = svg('whatsapp'); wa.hidden = false; } else wa.hidden = true;
  $('mbWa').href = waAll || '#contact'; $('mbWa').innerHTML = `${svg('whatsapp')}واتساب`;
  $('mbCall').href = 'tel:' + digits(c.phone || c.whatsapp); $('mbCall').innerHTML = `${svg('phone')}اتصال`;
  $('mbShop').innerHTML = `${svg('grid')}المنتجات`; $('mbBr').innerHTML = `${svg('pin')}الفروع`;

  // ---- إظهار/إخفاء الأقسام ----
  const s = d.sections || {};
  const has = { reels: reels.length, projects: projs.length, clients: clients.length, reviews: reviews.length, installments: inst.enabled === false ? 0 : payList.length };
  for (const k of ['about', 'categories', 'custom-intro', 'installments', 'reels', 'projects', 'clients', 'reviews', 'branches', 'contact']) {
    const on = s[k] !== false && (has[k] === undefined || has[k] > 0);
    $(k).hidden = !on;
    document.querySelectorAll(`[data-sec="${k}"]`).forEach(a => a.hidden = !on);
  }
  [...$('links').children].forEach((a, i) => a.style.setProperty('--i', i));

  motion();
  // عدادات الأرقام في الواجهة
  setTimeout(() => document.querySelectorAll('[data-count]').forEach(countUp), REDUCED ? 0 : 900);
}

// ===================== أحداث عامة =====================
$('year').textContent = new Date().getFullYear();
const burger = $('burger');
burger.onclick = () => { const o = $('links').classList.toggle('open'); burger.classList.toggle('x', o); document.body.style.overflow = o ? 'hidden' : ''; };
$('links').onclick = (e) => { if (e.target.tagName === 'A') { $('links').classList.remove('open'); burger.classList.remove('x'); document.body.style.overflow = ''; } };
document.addEventListener('click', (e) => { // أزرار التمرير الأفقي
  const b = e.target.closest('.scroller-nav button'); if (!b) return;
  const row = b.closest('.sec, .recs').querySelector('.scroller');
  row.scrollBy({ left: -b.dataset.dir * row.clientWidth * .8, behavior: 'smooth' });
});
$('toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

// شريط التقدم + زر الأعلى + شريط الجوال (مرة واحدة لكل إطار)
let ticking = false;
function onScroll() {
  ticking = false;
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight, k = max > 0 ? y / max : 0;
  $('prog').style.transform = `scaleX(${k})`;
  $('topRing').style.strokeDashoffset = 100.5 * (1 - k);
  $('toTop').classList.toggle('show', y > 700);
  $('nav').classList.toggle('solid', y > 30 || !$('page').hidden);
  $('mbar').classList.toggle('show', y > 160 || !$('page').hidden);
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

// تمييز رابط القسم الظاهر في الشريط العلوي
function scrollSpy() {
  const map = new Map([...document.querySelectorAll('.links a')].map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { map.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => $(id) && io.observe($(id)));
}

$('lbX').onclick = closeG;
$('lb').onclick = (e) => { if (e.target.id === 'lb') closeG(); };
$('lbNext').onclick = () => { gIndex = (gIndex + 1) % gallery.length; showG(); };
$('lbPrev').onclick = () => { gIndex = (gIndex - 1 + gallery.length) % gallery.length; showG(); };
addEventListener('keydown', (e) => {
  if ($('lb').hidden) return;
  if (e.key === 'Escape') closeG();
  if (e.key === 'ArrowLeft') $('lbNext').click();
  if (e.key === 'ArrowRight') $('lbPrev').click();
});

// ===================== مشغّل الريلز (ملء الشاشة، سحب للأعلى والأسفل) =====================
let rpObs = null, rpMuted = false;
function openReels(list, start) {
  const track = $('rpTrack');
  const TT = (id) => `https://www.tiktok.com/player/v1/${id}?autoplay=1&loop=1&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0`;
  track.innerHTML = list.map(r => `<div class="rp-item ${r.tiktokId ? 'tt' : ''}">
    ${r.tiktokId ? `<iframe data-src="${TT(esc(r.tiktokId))}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen title="${esc(r.title || 'TikTok')}"></iframe>`
      : `<video src="${esc(r.video)}" ${r.poster ? `poster="${esc(r.poster)}"` : ''} loop playsinline preload="metadata"></video>
    <button class="rp-sound" type="button">🔊</button>`}
    ${(r.title || r.caption || r.link) ? `<div class="rp-info">${r.title ? `<b>${esc(r.title)}</b>` : ''}${r.caption ? `<p>${esc(r.caption)}</p>` : ''}
      ${r.link ? `<a class="btn gold" href="${esc(r.link)}">شاهد المنتج</a>` : ''}${r.tiktokId && r.tiktok && r.tiktokButton !== false ? ` <a class="btn ghost tt-open" href="${esc(r.tiktok)}" target="_blank" rel="noopener">${svg('tiktok')} فتح في تيك توك</a>` : ''}</div>` : (r.tiktokId && r.tiktok && r.tiktokButton !== false ? `<div class="rp-info"><a class="btn ghost tt-open" href="${esc(r.tiktok)}" target="_blank" rel="noopener">${svg('tiktok')} فتح في تيك توك</a></div>` : '')}</div>`).join('');
  $('rp').hidden = false; document.body.style.overflow = 'hidden';
  const vids = [...track.querySelectorAll('video')];
  vids.forEach(v => { v.muted = rpMuted; v.onclick = () => v.paused ? v.play() : v.pause(); });
  track.querySelectorAll('.rp-sound').forEach(b => b.onclick = () => {
    rpMuted = !rpMuted; vids.forEach(v => v.muted = rpMuted);
    track.querySelectorAll('.rp-sound').forEach(x => x.textContent = rpMuted ? '🔇' : '🔊');
  });
  track.querySelectorAll('.rp-info a:not(.tt-open)').forEach(a => a.onclick = closeReels);
  rpObs?.disconnect();
  rpObs = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target.querySelector('video'), f = e.target.querySelector('iframe');
    const on = e.isIntersecting && e.intersectionRatio > .6;
    if (f) { if (on && !f.src) f.src = f.dataset.src; if (!on && f.src) f.removeAttribute('src'); return; }
    if (on) { v.currentTime = 0; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); }
    else v.pause();
  }), { root: track, threshold: [0, .6, 1] });
  track.querySelectorAll('.rp-item').forEach(it => rpObs.observe(it));
  track.children[start]?.scrollIntoView({ block: 'start' });
  const firstEl = track.children[start], ff = firstEl?.querySelector('iframe');
  if (ff) ff.src = ff.dataset.src;
  const first = firstEl?.querySelector('video'); // تشغيل مباشر للريل المختار (الضغطة تسمح بالصوت)
  first?.play().catch(() => { first.muted = true; first.play().catch(() => {}); });
}
function closeReels() {
  rpObs?.disconnect();
  $('rpTrack').querySelectorAll('video').forEach(v => v.pause());
  $('rpTrack').querySelectorAll('iframe').forEach(f => f.removeAttribute('src'));
  $('rpTrack').innerHTML = ''; $('rp').hidden = true; document.body.style.overflow = '';
}
$('rpX').onclick = closeReels;
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('rp').hidden) closeReels(); });

// ===================== صفحات القسم والمنتج =====================
let D = null;
const findCat = (id) => (D.categories || []).find(c => c.id === id);
const priceHTML = (p) => p.price ? `<div class="price"><b>${esc(p.price)}</b>${p.oldPrice ? `<s>${esc(p.oldPrice)}</s>` : ''}</div>` : '';
const sizesOf = (p) => String(p.sizes || '').split(/[,،\n]+/).map(s => s.trim()).filter(Boolean);
const productImages = (p) => (p.images || []).map(m => m.src).filter(Boolean);
const waNumber = () => intl(D.contact?.whatsapp || D.contact?.phone || '');

// ----- أقرب فرع -----
const splitWords = (s) => String(s || '').split(/[,،\s]+/).map(w => w.trim()).filter(w => w.length > 1);
const normAr = (w) => w.replace(/^ال/, '').replace(/[ةه]$/, '').replace(/[أإآ]/g, 'ا');
function branchesFor(c) {
  const want = splitWords(c.branchDept || c.title).map(normAr);
  const all = (D.branches || []).filter(b => b.whatsapp || b.phone);
  if (!want.length) return all;
  const hit = all.filter(b => splitWords(b.departments).map(normAr).some(w => want.includes(w)));
  return hit.length ? hit : all;
}
const coordsOf = (b) => { const m = /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/.exec(b.coords || ''); return m && [+m[1], +m[2]]; };
function km(a, b) {
  const R = 6371, r = Math.PI / 180, dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
// رابط خرائط جوجل للفرع: الرابط المحفوظ ← الاتجاهات بالإحداثيات الدقيقة ← بحث باسم الفرع ومنطقته
function mapHref(b) {
  if (b.mapUrl && /^https?:\/\//.test(b.mapUrl)) return b.mapUrl;
  const ll = coordsOf(b);
  if (ll && b.coordsApprox === false) return `https://www.google.com/maps/dir/?api=1&destination=${ll[0]},${ll[1]}`;
  const dept = String(b.name || '').replace(/^فرع\s*/, '');
  const q = ['الضبيبي', dept ? 'لل' + dept.replace(/^ال/, '') : '', b.area, b.city].filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
const savedLoc = () => { try { return JSON.parse(sessionStorage.getItem('dh_loc')); } catch { return null; } };

function productCard(c, p, showCat = false) {
  const imgs = productImages(p);
  const colors = (p.colors || []).filter(x => x.hex);
  return `<a class="pcard" href="#p/${esc(c.id)}/${esc(p.id)}">
    <div class="pimg">
      <div class="badges">${p.featured ? '<span class="badge">مميز</span>' : ''}${p.oldPrice ? '<span class="badge sale">خصم</span>' : ''}${p.available === false ? '<span class="badge out">غير متوفر</span>' : ''}</div>
      ${imgs[0] ? imgTag(imgs[0], p.name) : `<div class="ph" style="position:absolute;inset:0"><span>${esc(p.name)}</span></div>`}
      ${imgs[1] ? imgTag(imgs[1], '', 'alt') : ''}
      <span class="view">عرض التفاصيل ←</span>
    </div>
    <div class="pbody">${showCat ? `<span class="pcat">${esc(c.title)}</span>` : ''}<h3>${esc(p.name || 'منتج')}</h3>${priceHTML(p)}
      ${colors.length ? `<div class="dots">${colors.slice(0, 6).map(x => `<i style="background:${esc(x.hex)}" title="${esc(x.name)}"></i>`).join('')}${colors.length > 6 ? `<small>+${colors.length - 6}</small>` : ''}</div>` : ''}
    </div></a>`;
}

function crumbs(items) {
  return `<nav class="crumbs"><a href="#top">الرئيسية</a>${items.map(([t, h]) =>
    `<span class="sep">‹</span>${h ? `<a href="${h}">${esc(t)}</a>` : `<span>${esc(t)}</span>`}`).join('')}</nav>`;
}

function renderCategory(c) {
  const ps = c.products || [];
  return `<div class="wrap">
    ${crumbs([['منتجاتنا', '#categories'], [c.title]])}
    <div class="cat-tabs">${(D.categories || []).map(x => `<a href="#c/${esc(x.id)}" class="${x.id === c.id ? 'on' : ''}">${esc(x.title)}</a>`).join('')}</div>
    <div class="cat-hero" style="--bgimg:url('${esc(c.cover || ps[0]?.images?.[0]?.src || 'assets/marble.jpg')}')">
      <span class="eyebrow">قسم</span><h2>${esc(c.title)}</h2>${c.description ? `<p>${esc(c.description)}</p>` : ''}
      ${ps.length ? `<span class="count">${ps.length} منتج</span>` : ''}</div>
    ${ps.length ? `<div class="pgrid">${ps.map(p => productCard(c, p)).join('')}</div>`
      : `<p class="empty-note">سيتم إضافة منتجات هذا القسم قريباً — تواصل معنا للاستفسار</p>`}
    ${c.images?.length ? `<div class="related"><h2>معرض ${esc(c.title)}</h2><div class="pgrid" id="catGal">${c.images.map((m, i) =>
      `<div class="pcard" style="cursor:zoom-in" data-i="${i}"><div class="pimg">${imgTag(m.src)}</div></div>`).join('')}</div></div>` : ''}
  </div>`;
}

function renderProduct(c, p) {
  const sizes = sizesOf(p), colors = (p.colors || []).filter(x => x.name || x.hex);
  return `<div class="wrap">
    ${crumbs([['منتجاتنا', '#categories'], [c.title, '#c/' + c.id], [p.name]])}
    <div class="pd">
      <div class="pd-gal">
        <div class="pd-main" id="pdMain"></div>
        <div class="pd-thumbs" id="pdThumbs"></div>
      </div>
      <div class="pd-info">
        <h1>${esc(p.name)}</h1>
        ${priceHTML(p)}
        ${payBadge()}
        <div class="stock ${p.available === false ? 'out' : ''}">${p.available === false ? 'غير متوفر حالياً' : 'متوفر'}</div>
        ${colors.length ? `<div class="opt"><h4>اللون: <span id="pdColor">اختر اللون</span></h4><div class="swatches">${colors.map((x, i) =>
          `<button class="sw" data-i="${i}" title="${esc(x.name)}" style="background:${esc(x.hex || '#ccc')}" aria-label="${esc(x.name)}"></button>`).join('')}</div></div>` : ''}
        ${sizes.length ? `<div class="opt"><h4>المقاس: <span id="pdSize">اختر المقاس</span></h4><div class="sizes">${sizes.map(s =>
          `<button type="button">${esc(s)}</button>`).join('')}</div></div>` : ''}
        ${p.description ? `<div class="pd-desc">${esc(p.description)}</div>` : ''}
        ${(p.specs || []).filter(s => s.label || s.value).length ? `<div class="opt"><h4>المواصفات</h4><table class="specs">${p.specs.filter(s => s.label || s.value).map(s =>
          `<tr><td>${esc(s.label)}</td><td>${esc(s.value)}</td></tr>`).join('')}</table></div>` : ''}
        <div class="pd-actions">
          ${waNumber() ? `<a class="btn wa" id="pdOrder" target="_blank" rel="noopener">${svg('whatsapp')} اطلب عبر واتساب</a>` : ''}
          <a class="btn line" id="pdCall" href="tel:${digits(D.contact?.phone || '')}">${svg('phone')} اتصل</a>
          <button class="btn line" id="pdShare" type="button">مشاركة</button>
        </div>
        ${branchesFor(c).length ? `<div class="near" id="near">
          <div class="near-head"><b>${svg('pin')} الفروع اللي فيها هذا المنتج</b>
            <button class="near-loc" id="nearLoc" type="button">📍 رتّب حسب الأقرب لي</button></div>
          <div class="near-list" id="nearList"></div>
        </div>` : ''}
      </div>
    </div>
    <section class="recs" id="recSimilar" hidden></section>
    <section class="recs look" id="recLook" hidden></section>
  </div>`;
}

function wireProduct(c, p) {
  let imgs = productImages(p);
  const colors = (p.colors || []).filter(x => x.name || x.hex);
  let idx = 0, color = null, size = null;
  const main = $('pdMain'), thumbs = $('pdThumbs');
  const draw = () => {
    if (!imgs.length) { main.innerHTML = `<div class="ph" style="position:absolute;inset:0;display:grid;place-items:center;background:#151515"><span style="font-family:'El Messiri';color:var(--gold);font-size:30px">${esc(p.name)}</span></div>`; thumbs.innerHTML = ''; return; }
    main.innerHTML = `<img src="${esc(sized(imgs[idx], 1280))}" alt="${esc(p.name)}">${imgs.length > 1 ? '<button class="pd-arrow prev" aria-label="السابق">›</button><button class="pd-arrow next" aria-label="التالي">‹</button>' : ''}`;
    thumbs.innerHTML = imgs.length > 1 ? imgs.map((s, i) => `<button class="${i === idx ? 'on' : ''}" data-i="${i}"><img src="${esc(sized(s, 320))}" alt="" loading="lazy"></button>`).join('') : '';
  };
  main.onclick = (e) => {
    if (e.target.closest('.prev')) { idx = (idx - 1 + imgs.length) % imgs.length; return draw(); }
    if (e.target.closest('.next')) { idx = (idx + 1) % imgs.length; return draw(); }
    if (imgs.length) openGallery(imgs.map(s => ({ src: s, cap: p.name })), idx);
  };
  thumbs.onclick = (e) => { const b = e.target.closest('button'); if (b) { idx = +b.dataset.i; draw(); } };
  // سحب بالإصبع على الجوال
  let x0 = null;
  main.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  main.addEventListener('touchend', e => {
    if (x0 === null || imgs.length < 2) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { idx = (idx + (dx > 0 ? 1 : -1) + imgs.length) % imgs.length; draw(); }
  });
  document.querySelectorAll('.sw').forEach(b => b.onclick = () => {
    document.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b));
    color = colors[+b.dataset.i]; $('pdColor').textContent = color.name || ''; renderRecs(c, p, color);
    if (color.image) { const at = imgs.indexOf(color.image); if (at < 0) { imgs = [color.image, ...productImages(p)]; idx = 0; } else idx = at; draw(); }
    order();
  });
  document.querySelectorAll('.sizes button').forEach(b => b.onclick = () => {
    document.querySelectorAll('.sizes button').forEach(x => x.classList.toggle('on', x === b));
    size = b.textContent; $('pdSize').textContent = size; order();
  });
  const link = () => location.href.split('#')[0] + '#p/' + c.id + '/' + p.id;
  // الفروع المناسبة لهذا المنتج، مرتبة حسب قربها من العميل إن سمح بالموقع
  let me = savedLoc();
  const branches = () => {
    const list = branchesFor(c).map(b => ({ b, d: me && coordsOf(b) ? km(me, coordsOf(b)) : null }));
    if (me) list.sort((x, y) => (x.d ?? 1e9) - (y.d ?? 1e9));
    return list;
  };
  const msg = (b) => [`السلام عليكم، أبي أستفسر عن هذا المنتج:`, `▪ ${p.name}`, color?.name && `▪ اللون: ${color.name}`, size && `▪ المقاس: ${size}`,
    p.price && `▪ السعر: ${p.price}`, b && `▪ الفرع: ${b.name} — ${b.area || ''}`, link()].filter(Boolean).join('\n');
  const waLink = (num, b) => `https://wa.me/${intl(num)}?text=${encodeURIComponent(msg(b))}`;
  const fmtKm = (d) => d == null ? '' : d < 1 ? 'أقل من 1 كم' : `${Math.round(d)} كم`;
  const order = () => {
    const list = branches(), best = me ? list[0]?.b : null;
    const o = $('pdOrder');
    if (o) {
      o.href = best ? waLink(best.whatsapp || best.phone, best) : waLink(D.contact?.whatsapp || D.contact?.phone, null);
      o.innerHTML = `${svg('whatsapp')} ${best ? 'واتساب أقرب فرع' : 'اطلب عبر واتساب'}`;
    }
    const call = $('pdCall'), callNum = best ? (best.whatsapp || best.phone) : D.contact?.phone;
    if (call) { call.href = 'tel:' + digits(callNum); call.hidden = !callNum; call.innerHTML = `${svg('phone')} ${best ? 'اتصل بأقرب فرع' : 'اتصل'}`; }
    const box = $('nearList'); if (!box) return;
    box.innerHTML = list.map(({ b, d }, i) => `<div class="near-row ${me && i === 0 ? 'best' : ''}" data-bid="${esc(b.id)}">
      ${b.photo ? `<img src="${esc(sized(b.photo, 320))}" alt="" loading="lazy">` : ''}
      <div class="nr-info"><b>${esc(b.name)}</b><small>${esc([b.area, b.city].filter(Boolean).join(' — '))}${d != null ? ` • ${fmtKm(d)}` : ''}</small>
        ${me && i === 0 ? '<span class="nr-badge">الأقرب لك</span>' : ''}${D.hours?.show !== false ? statusPill(b) : ''}</div>
      <div class="nr-btns">
        <a class="nb wa" href="${waLink(b.whatsapp || b.phone, b)}" target="_blank" rel="noopener" aria-label="واتساب ${esc(b.name)}">${svg('whatsapp')}</a>
        <a class="nb" href="tel:${digits(b.whatsapp || b.phone)}" aria-label="اتصال ${esc(b.name)}">${svg('phone')}</a>
        <a class="nb map" href="${esc(mapHref(b))}" target="_blank" rel="noopener" aria-label="موقع ${esc(b.name)} على خرائط جوجل">${svg('pin')}</a>
      </div></div>`).join('');
  };
  $('nearLoc')?.addEventListener('click', () => {
    const btn = $('nearLoc');
    if (!navigator.geolocation) { btn.textContent = 'المتصفح لا يدعم تحديد الموقع'; return; }
    btn.textContent = '… جاري تحديد موقعك';
    navigator.geolocation.getCurrentPosition(pos => {
      me = [pos.coords.latitude, pos.coords.longitude];
      try { sessionStorage.setItem('dh_loc', JSON.stringify(me)); } catch {}
      btn.textContent = '✓ مرتبة حسب الأقرب لك'; order();
    }, () => { btn.textContent = 'ما قدرنا نحدد موقعك — اختر الفرع من القائمة'; }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 });
  });
  if (me && $('nearLoc')) $('nearLoc').textContent = '✓ مرتبة حسب الأقرب لك';
  $('pdShare').onclick = async () => {
    try { if (navigator.share) await navigator.share({ title: p.name, url: link() }); else { await navigator.clipboard.writeText(link()); $('pdShare').textContent = 'تم نسخ الرابط ✓'; } } catch {}
  };
  draw(); order(); renderRecs(c, p, null);
}

// ===================== منتجات مشابهة + «نسّق مساحتك» =====================
// نوع المنتج يُستنتج من اسمه واسم قسمه
const TYPES = [
  ['mat', ['دواس', 'ممرات']], ['rug', ['سجاد']], ['carpet', ['موكيت']], ['barstool', ['كرسي بار']],
  ['tv', ['بلازما', 'تلفزيون']], ['shoe', ['جزام']], ['dining', ['طاولة طعام']],
  ['table', ['طاولات', 'طاولة', 'طقم طاولات']], ['light', ['ثريا', 'نجف', 'إنارة', 'اناره']],
  ['wall', ['لوحة', 'لوحات']], ['bed', ['مراتب', 'مرتبة', 'سرير']], ['plant', ['نبات']], ['chair', ['كرسي', 'كراسي']],
];
const TYPE_LABEL = { rug: 'سجاد', mat: 'دواسات', carpet: 'موكيت', barstool: 'كراسي بار', tv: 'طاولات بلازما', shoe: 'جزامات',
  dining: 'طاولات طعام', table: 'طاولات', light: 'إنارة', wall: 'لوحات جدارية', bed: 'مراتب', plant: 'نباتات', chair: 'كراسي' };
// ما الذي يُنسَّق مع كل نوع (بالترتيب)
const PAIRS = {
  rug: ['table', 'light', 'tv', 'wall', 'plant'], carpet: ['table', 'light', 'tv', 'bed'],
  mat: ['shoe', 'wall', 'plant'], barstool: ['dining', 'light', 'table', 'wall'],
  tv: ['rug', 'table', 'light', 'wall', 'plant'], shoe: ['wall', 'mat', 'plant', 'light'],
  dining: ['light', 'rug', 'chair', 'wall'], table: ['rug', 'light', 'tv', 'plant', 'wall'],
  light: ['rug', 'table', 'tv', 'dining'], wall: ['shoe', 'mat', 'plant', 'table'],
  bed: ['rug', 'light', 'wall', 'carpet'], plant: ['wall', 'table', 'rug'], chair: ['table', 'rug', 'light'], other: ['rug', 'light', 'table'],
};
const typeOf = (c, p) => {
  const t = (p.name || '') + ' ' + (c?.title || '');
  return (TYPES.find(([, words]) => words.some(w => (p.name || '').includes(w))) || TYPES.find(([, words]) => words.some(w => t.includes(w))) || ['other'])[0];
};
const rgbOf = (hex) => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
// مدى تقارب ألوان منتجين (0 إلى 1)
function colorMatch(hexes, p) {
  const a = hexes.map(rgbOf).filter(Boolean), b = (p.colors || []).map(x => rgbOf(x.hex)).filter(Boolean);
  if (!a.length || !b.length) return .35;
  let best = 1e9;
  for (const x of a) for (const y of b) best = Math.min(best, Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]));
  return Math.max(0, 1 - best / 260);
}
function recommend(c, p, color) {
  const all = (D.categories || []).flatMap(cat => (cat.products || []).map(x => ({ cat, p: x, t: typeOf(cat, x) })));
  const me = typeOf(c, p), hexes = color?.hex ? [color.hex] : (p.colors || []).map(x => x.hex);
  // مشابهة: نفس النوع أولاً ثم بقية القسم
  const similar = all.filter(x => x.p !== p && (x.t === me || x.cat === c))
    .map(x => ({ ...x, s: (x.t === me ? 5 : 0) + (x.cat === c ? 1 : 0) + colorMatch(hexes, x.p) * 2 + (x.p.featured ? .3 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, 10);
  // نسّق مساحتك: من أنواع مكمّلة في أقسام أخرى، بالتناوب بين الأنواع
  const order = PAIRS[me] || PAIRS.other, buckets = order.map(t => all.filter(x => x.t === t && x.t !== me && x.p !== p)
    .map(x => ({ ...x, s: colorMatch(hexes, x.p) * 3 + (x.p.featured ? .6 : 0) + (x.cat !== c ? .4 : 0) }))
    .sort((a, b) => b.s - a.s));
  const look = [];
  for (let round = 0; round < 3 && look.length < 10; round++)
    buckets.forEach(bk => { if (bk[round] && look.length < 10) look.push(bk[round]); });
  return { similar, look, me };
}
function recCard(x, tag) {
  return productCard(x.cat, x.p, true).replace('<div class="badges">', `<div class="badges">${tag ? `<span class="badge tag">${esc(tag)}</span>` : ''}`);
}
function renderRecs(c, p, color) {
  const { similar, look, me } = recommend(c, p, color);
  const nav = '<div class="scroller-nav"><button type="button" data-dir="1" aria-label="السابق">→</button><button type="button" data-dir="-1" aria-label="التالي">←</button></div>';
  const sim = $('recSimilar'), lk = $('recLook');
  if (sim) {
    sim.hidden = !similar.length;
    sim.innerHTML = `<div class="recs-head"><div><span class="eyebrow">خيارات أكثر</span><h2>أشكال وتصاميم مشابهة</h2></div>${nav}</div>
      <div class="scroller">${similar.map(x => recCard(x, x.t === me ? '' : x.cat.title)).join('')}</div>`;
  }
  if (lk) {
    const wa = intl(D.contact?.whatsapp || D.contact?.phone || '');
    const set = [p.name + (color?.name ? ` (${color.name})` : ''), ...look.slice(0, 4).map(x => x.p.name)];
    const msg = `السلام عليكم، أبي أستفسر عن تنسيق كامل:\n${set.map(s => '▪ ' + s).join('\n')}\n${location.href}`;
    lk.hidden = !look.length;
    lk.innerHTML = `<div class="recs-head"><div><span class="eyebrow">نسّق مساحتك</span>
        <h2>يكمّل مع ${esc(p.name)}</h2>
        <p>${color?.name ? `اقتراحات مختارة لتتناسق مع اللون <b>${esc(color.name)}</b>` : 'اقتراحات من أقسامنا تكمّل الشكل — اختر لوناً أعلاه لتتغير الاقتراحات حسبه'}</p></div>
        <div class="recs-actions">${wa ? `<a class="btn gold sm" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}">${svg('whatsapp')} اسأل عن التنسيق كامل</a>` : ''}${nav}</div></div>
      <div class="chips look-types">${[...new Set(look.map(x => x.t))].map(t => `<span class="chip">${esc(TYPE_LABEL[t] || t)}</span>`).join('')}</div>
      <div class="scroller">${look.map(x => recCard(x, TYPE_LABEL[x.t])).join('')}</div>`;
    if (color) { lk.classList.remove('flash'); void lk.offsetWidth; lk.classList.add('flash'); }
  }
  markImgs($('page'));
}

function route() {
  if (!D) return;
  const h = decodeURIComponent(location.hash.slice(1));
  const m = /^(c|p)\/([^/]+)(?:\/([^/]+))?$/.exec(h);
  const page = $('page'), home = $('home');
  const c = m && findCat(m[2]);
  const p = m && m[1] === 'p' && c && (c.products || []).find(x => x.id === m[3]);
  const cm = /^custom(?:\/(\w+))?$/.exec(h), rq = /^r\/([a-f0-9]{12})$/.exec(h);
  if (cm || rq) {
    page.hidden = false; home.hidden = true;
    if (cm) { page.innerHTML = renderCustomPage(cm[1]); wireCustom(); document.title = 'تفصيل حسب الطلب — ' + (D.company.nameAr || ''); }
    else { renderRequestPage(rq[1]); document.title = 'طلب تفصيل — ' + (D.company.nameAr || ''); }
    page.classList.remove('enter'); void page.offsetWidth; page.classList.add('enter');
    scrollTo({ top: 0, behavior: 'instant' }); onScroll(); return;
  }
  if (c && (m[1] === 'c' || p)) {
    page.innerHTML = p ? renderProduct(c, p) : renderCategory(c);
    page.hidden = false; home.hidden = true;
    page.querySelectorAll('.pgrid .pcard').forEach((el, i) => el.style.setProperty('--i', i % 12));
    page.classList.remove('enter'); void page.offsetWidth; page.classList.add('enter');
    document.title = (p ? p.name + ' — ' : c.title + ' — ') + (D.company.nameAr || '');
    if (p) wireProduct(c, p);
    $('catGal')?.addEventListener('click', e => { const el = e.target.closest('[data-i]'); if (el) openGallery(c.images.map(x => ({ src: x.src, cap: x.caption || c.title })), +el.dataset.i); });
    markImgs(page);
    scrollTo({ top: 0, behavior: 'instant' });
  } else {
    const wasPage = !page.hidden;
    page.hidden = true; page.innerHTML = ''; home.hidden = false;
    document.title = D.company.nameAr || document.title;
    const target = h && document.getElementById(h);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: wasPage ? 'instant' : 'smooth' }), wasPage ? 30 : 0);
    else if (wasPage) scrollTo({ top: 0, behavior: 'instant' });
  }
  onScroll();
}
addEventListener('hashchange', route);

fetch('api/content', { cache: 'no-store' }).then(r => r.json()).then(d => {
  D = d; render(d); if (window.renderCustomHome) { $('czTiles').innerHTML = renderCustomHome(); motion($('custom-intro')); } route(); scrollSpy(); onScroll();
  requestAnimationFrame(() => $('splash').classList.add('done'));
}).catch(() => {
  $('splash').classList.add('done');
  document.body.insertAdjacentHTML('afterbegin', '<p style="padding:120px 20px;text-align:center">تعذّر تحميل المحتوى — تأكد من تشغيل الخادم (ملف تشغيل الموقع.bat)</p>');
});
