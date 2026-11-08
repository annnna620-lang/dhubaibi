// لوحة تحكم بروفايل الضبيبي — تُبنى النماذج تلقائياً من التعريفات أدناه
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const imgUrl = (s) => !s ? '' : (window.GH_BLOBS && window.GH_BLOBS[s]) || (/^(https?:|data:|\/)/.test(s) ? s : '../' + s);
const uid = () => Math.random().toString(36).slice(2, 9);
const getP = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const setP = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => (a[k] ??= {}), o)[last] = v; };

// ---------- تعريف الصفحات والحقول ----------
// أنواع الحقول: text | textarea | image | gallery | color | list | ltr
const TABS = [
  { key: 'company', icon: '🏢', title: 'معلومات الشركة', hint: 'الاسم والشعار وواجهة الموقع الرئيسية', panels: [
    { title: 'الهوية', fields: [
      { p: 'company.nameAr', label: 'اسم الشركة (عربي)' },
      { p: 'company.nameEn', label: 'اسم الشركة (إنجليزي)', t: 'ltr' },
      { p: 'company.logo', label: 'الشعار', t: 'image', hint: 'يفضّل PNG بخلفية شفافة' },
      { p: 'company.tagline', label: 'المجالات', hint: 'افصل بينها بشرطة -  مثال: سجاد - موكيت - أثاث' },
      { p: 'company.slogan', label: 'الشعار النصي (السلوجان)' },
    ]},
    { title: 'الواجهة الرئيسية', hint: 'أول ما يراه الزائر عند فتح الموقع', fields: [
      { p: 'company.heroTitle', label: 'العنوان الكبير' },
      { p: 'company.heroSubtitle', label: 'النص التعريفي', t: 'textarea' },
      { p: 'company.heroButton', label: 'نص زر التواصل' },
      { p: 'company.heroImage', label: 'صورة خلفية الواجهة', t: 'image', aspect: 16 / 9, hint: 'اختياري — بدونها تظهر خلفية الرخام الأسود' },
    ]},
    { title: 'الألوان', fields: [
      { p: 'theme.gold', label: 'اللون الذهبي الرئيسي', t: 'color' },
    ]},
  ]},
  { key: 'about', icon: '📖', title: 'من نحن', hint: 'نبذة الشركة والرؤية والرسالة والقيم والأرقام', panels: [
    { title: 'النبذة', fields: [
      { p: 'about.title', label: 'عنوان القسم' },
      { p: 'about.text', label: 'نص النبذة', t: 'textarea', rows: 7 },
      { p: 'about.image', label: 'صورة بجانب النبذة', t: 'image', aspect: 4 / 3, hint: 'اختياري — بدونها يظهر الشعار' },
    ]},
    { title: 'الرؤية والرسالة', fields: [
      { p: 'about.vision', label: 'رؤيتنا', t: 'textarea' },
      { p: 'about.mission', label: 'رسالتنا', t: 'textarea' },
    ]},
    { title: 'قيمنا', fields: [
      { p: 'about.values', t: 'list', itemName: 'قيمة', titleKey: 'title', fields: [
        { k: 'title', label: 'اسم القيمة' }, { k: 'text', label: 'الوصف', t: 'textarea' } ] },
    ]},
    { title: 'أرقام وإنجازات', hint: 'تظهر في شريط داكن تحت قسم من نحن', fields: [
      { p: 'about.stats', t: 'list', itemName: 'رقم', titleKey: 'label', fields: [
        { k: 'number', label: 'الرقم', hint: 'مثال: +500' }, { k: 'label', label: 'الوصف', hint: 'مثال: مشروع منفّذ' } ] },
    ]},
  ]},
  { key: 'categories', icon: '🛋️', title: 'الأقسام والمنتجات', hint: 'افتح القسم ثم أضف منتجاته — كل منتج له صور وألوان وتفاصيل', panels: [
    { fields: [
      { p: 'categories', t: 'list', itemName: 'قسم', titleKey: 'title', thumb: (it) => it.cover || it.products?.[0]?.images?.[0]?.src || it.images?.[0]?.src,
        count: (it) => it.products?.length ? `${it.products.length} منتج` : '', fields: [
        { k: 'title', label: 'اسم القسم' },
        { k: 'description', label: 'الوصف', t: 'textarea', rows: 3 },
        { k: 'cover', label: 'صورة الغلاف', t: 'image', aspect: 4 / 3, hint: 'اختياري — بدونها تُستخدم صورة أول منتج' },
        { k: 'branchDept', label: 'يُباع في فروع', hint: 'يحدد أي فروع تظهر للعميل في صفحة المنتج — مثال: السجاد أو: الإنارة، الأثاث' },
        { k: 'products', label: 'منتجات القسم', t: 'list', itemName: 'منتج', titleKey: 'name', thumb: (it) => it.images?.[0]?.src,
          count: (it) => [it.price, it.available === false ? 'غير متوفر' : ''].filter(Boolean).join(' • '), fields: [
          { k: 'name', label: 'اسم المنتج' },
          { k: 'images', label: 'صور المنتج', t: 'gallery', aspect: 1, hint: 'أول صورة هي الصورة الرئيسية' },
          { k: 'price', label: 'السعر', hint: 'اختياري — مثال: 450 ريال أو «حسب المقاس»' },
          { k: 'oldPrice', label: 'السعر قبل الخصم', hint: 'اختياري — يظهر مشطوباً' },
          { k: 'description', label: 'الوصف والتفاصيل', t: 'textarea', rows: 5, ai: true },
          { k: 'colors', label: 'الألوان المتوفرة', t: 'list', itemName: 'لون', titleKey: 'name', thumb: (it) => it.image, fields: [
            { k: 'name', label: 'اسم اللون', hint: 'مثال: بيج، رمادي فاتح' },
            { k: 'hex', label: 'اللون', t: 'color', def: '#c8b28a' },
            { k: 'image', label: 'صورة المنتج بهذا اللون', t: 'image', aspect: 1, hint: 'اختياري — تظهر لما العميل يختار اللون' },
          ]},
          { k: 'sizes', label: 'المقاسات', hint: 'افصل بينها بفاصلة — مثال: 200×300 ، 250×350 ، 300×400' },
          { k: 'arItems', label: '🏠 «شوفها في بيتك» — صورة السجادة مفرودة (3D والكاميرا)', t: 'list', itemName: 'صورة', titleKey: 'name', thumb: (it) => it.src,
            hint: 'للسجاد فقط: صورة لكل لون مقصوصة بالضبط على أطراف السجادة (بدون الاستاند والأرضية) — العميل يشوفها 3D ويفرشها على أرضيته بالكاميرا', fields: [
            { k: 'name', label: 'اسم اللون' },
            { k: 'src', label: 'صورة السجادة مفرودة', t: 'image', hint: 'صوّرها من فوق أو وهي معلّقة بشكل مستقيم، وقصّها على حدودها بالضبط' },
          ]},
          { k: 'arRound', label: 'سجادة دائرية (للعرض 3D)', t: 'toggle', def: false },
          { k: 'arSizes', label: 'مقاسات العرض بالكاميرا (سم)', hint: 'مثال: 160×230، 200×300 — للدائري: 150، 200 — فاضي = مقاسات افتراضية' },
          { k: 'specs', label: 'المواصفات', t: 'list', itemName: 'مواصفة', titleKey: 'label', fields: [
            { k: 'label', label: 'البند', hint: 'مثال: الخامة، بلد الصنع، السماكة' }, { k: 'value', label: 'القيمة' },
          ]},
          { k: 'available', label: 'متوفر حالياً', t: 'toggle', def: true },
          { k: 'featured', label: 'منتج مميز', t: 'toggle', def: false, hint: 'يظهر بعلامة «مميز»' },
        ]},
        { k: 'images', label: 'صور إضافية للقسم', t: 'gallery', hint: 'اختياري — معرض عام للقسم' },
      ]},
    ]},
  ]},
  { key: 'reels', icon: '🎬', title: 'الريلز', hint: 'فيديوهات قصيرة تظهر في الموقع بشكل عمودي مثل الريلز', panels: [
    { hint: 'لكل ريل: الصق رابط فيديو تيك توك (يشتغل داخل الموقع)، أو ارفع فيديو MP4 حتى 300 ميجا', fields: [
      { p: 'reels', t: 'list', itemName: 'ريل', titleKey: 'title', thumb: (it) => it.poster, count: (it) => it.tiktokId ? 'تيك توك' : it.video ? 'فيديو مرفوع' : '', fields: [
        { k: 'tiktok', label: 'رابط فيديو تيك توك', t: 'tiktok', hint: 'من تيك توك: مشاركة ← نسخ الرابط' },
        { k: 'video', label: 'أو ارفع فيديو', t: 'video' },
        { k: 'tiktokButton', label: 'إظهار زر «فتح في تيك توك»', t: 'toggle', def: true, hint: 'اختياري للعميل' },
        { k: 'title', label: 'العنوان', hint: 'مثال: جولة في معرض السجاد' },
        { k: 'caption', label: 'الوصف', t: 'textarea', rows: 2, hint: 'اختياري' },
        { k: 'poster', label: 'صورة الغلاف', t: 'image', aspect: 9 / 16 },
        { k: 'link', label: 'رابط زر «شاهد المنتج»', t: 'ltr', hint: 'اختياري — انسخ رابط المنتج من الموقع، مثل: #p/c1/abcd' },
      ]},
    ]},
  ]},
  { key: 'customReqs', icon: '📐', title: 'طلبات التفصيل', hint: 'طلبات «تفصيل حسب الطلب» من العملاء — تابع حالتها من هنا', custom: renderCustomReqs },
  { key: 'installments', icon: '💳', title: 'التقسيط', hint: 'قسم «تابي وتمارا» في الصفحة الرئيسية وشريط «قسّطها مع» في صفحات المنتجات', panels: [
    { title: 'الظهور', fields: [
      { p: 'installments.enabled', label: 'إظهار خدمة التقسيط في الموقع', t: 'toggle', def: true },
      { p: 'installments.showOnProducts', label: 'إظهار «قسّطها مع» تحت سعر كل منتج', t: 'toggle', def: true },
    ]},
    { title: 'الشركات المتوفرة', fields: [
      { p: 'installments.tabby', label: 'تابي (tabby)', t: 'toggle', def: true },
      { p: 'installments.tamara', label: 'تمارا (tamara)', t: 'toggle', def: true },
    ]},
    { title: 'النص', fields: [
      { p: 'installments.title', label: 'العنوان' },
      { p: 'installments.subtitle', label: 'السطر الثاني' },
    ]},
  ]},
  { key: 'reviews', icon: '⭐', title: 'آراء العملاء', hint: 'تقييمات العملاء تظهر في قسم «ماذا يقول عملاؤنا»', panels: [
    { fields: [
      { p: 'reviews', t: 'list', itemName: 'تقييم', titleKey: 'name', count: (it) => '★'.repeat(+it.stars || 5), fields: [
        { k: 'name', label: 'اسم العميل' },
        { k: 'text', label: 'نص التقييم', t: 'textarea', rows: 3 },
        { k: 'stars', label: 'عدد النجوم', hint: 'من 1 إلى 5', def: '5' },
        { k: 'branch', label: 'الفرع', hint: 'اختياري — مثال: فرع السجاد — أسواق الدواس' },
      ]},
    ]},
  ]},
  { key: 'projects', icon: '🏗️', title: 'المشاريع', hint: 'أعمال منفّذة مع صورها', panels: [
    { title: 'تواصل قسم المشاريع', hint: 'يظهر تحت المشاريع زر اتصال وواتساب لقسم المشاريع — اتركه فاضي لإخفائه', fields: [
      { p: 'projectsDept.phone', label: 'رقم قسم المشاريع (اتصال وواتساب)', t: 'ltr', hint: 'مثال: 0555123456' },
      { p: 'projectsDept.title', label: 'العنوان', hint: 'مثال: عندك مشروع فندق أو فيلا أو مكتب؟' },
      { p: 'projectsDept.text', label: 'النص', t: 'textarea' },
    ]},
    { fields: [
      { p: 'projects', t: 'list', itemName: 'مشروع', titleKey: 'title', thumb: (it) => it.images?.[0]?.src, fields: [
        { k: 'title', label: 'اسم المشروع' },
        { k: 'client', label: 'اسم العميل / الجهة' },
        { k: 'description', label: 'الوصف', t: 'textarea' },
        { k: 'images', label: 'صور المشروع', t: 'gallery' },
      ]},
    ]},
  ]},
  { key: 'clients', icon: '🤝', title: 'العملاء', hint: 'شعارات أو أسماء العملاء', panels: [
    { fields: [
      { p: 'clients', t: 'list', itemName: 'عميل', titleKey: 'name', thumb: (it) => it.logo, fields: [
        { k: 'name', label: 'اسم العميل' },
        { k: 'logo', label: 'شعار العميل', t: 'image', hint: 'اختياري — بدونه يظهر الاسم' },
      ]},
    ]},
  ]},
  { key: 'branches', icon: '📍', title: 'الفروع', hint: 'كل فرع بقسمه ورقمه — يظهر للعميل أقرب فرع يبيع المنتج', panels: [
    { title: 'أوقات الدوام (لكل الفروع)', hint: 'تظهر مع كل فرع مع حالة «مفتوح الآن / مغلق» حسب توقيت السعودية. اكتب الوقت بنظام 24 ساعة', grid: true, fields: [
      { p: 'hours.s1', label: 'الفترة الصباحية', t: 'ltr', hint: 'مثال: 09:00-11:30' },
      { p: 'hours.s2', label: 'الفترة المسائية', t: 'ltr', hint: 'مثال: 16:00-23:30' },
      { p: 'hours.days', label: 'الأيام', hint: 'مثال: يومياً' },
      { p: 'hours.show', label: 'إظهار أوقات الدوام وحالة الفتح', t: 'toggle', def: true },
    ]},
    { hint: 'لدقة «أقرب فرع»: الصق رابط قوقل ماب لكل فرع وسيُستخرج موقعه تلقائياً', fields: [
      { p: 'branches', t: 'list', itemName: 'فرع', titleKey: 'name', thumb: (it) => it.photo,
        count: (it) => [it.area, it.coordsApprox !== false && !it.mapUrl ? '⚠ الموقع تقريبي' : ''].filter(Boolean).join(' • '), fields: [
        { k: 'name', label: 'اسم الفرع', hint: 'مثال: فرع السجاد' },
        { k: 'area', label: 'المنطقة / الحي', hint: 'مثال: أسواق العمرة' },
        { k: 'city', label: 'المدينة' },
        { k: 'departments', label: 'الأقسام المتوفرة في الفرع', hint: 'افصل بفاصلة — السجاد، الأثاث، الإنارة، المفروشات' },
        { k: 'whatsapp', label: 'رقم الفرع (اتصال وواتساب)', t: 'ltr' },
        { k: 'phone', label: 'رقم إضافي', t: 'ltr', hint: 'اختياري' },
        { k: 'photo', label: 'صورة واجهة الفرع', t: 'image', aspect: 4 / 3 },
        { k: 'shifts', label: 'دوام خاص بهذا الفرع', t: 'ltr', hint: 'اختياري — اتركه فاضي لاستخدام الدوام العام. مثال: 09:00-12:00, 16:30-23:00' },
        { k: 'mapUrl', label: 'رابط قوقل ماب', t: 'map', hint: 'افتح الفرع في قوقل ماب ← مشاركة ← نسخ الرابط' },
      ]},
    ]},
  ]},
  { key: 'contact', icon: '📞', title: 'التواصل والسوشال', hint: 'أرقام التواصل وحسابات التواصل الاجتماعي', panels: [
    { title: 'أرقام التواصل', fields: [
      { p: 'contact.phone', label: 'رقم الاتصال', t: 'ltr' },
      { p: 'contact.whatsapp', label: 'رقم الواتساب', t: 'ltr', hint: 'يظهر زر واتساب عائم في الموقع' },
      { p: 'contact.email', label: 'البريد الإلكتروني', t: 'ltr' },
    ]},
    { title: 'حسابات التواصل الاجتماعي', hint: 'اكتب اسم الحساب فقط (مثل dh_trd) أو الرابط كامل. اتركه فارغاً لإخفائه', grid: true, fields: [
      { p: 'contact.instagram', label: 'انستقرام', t: 'ltr' },
      { p: 'contact.tiktok', label: 'تيك توك', t: 'ltr' },
      { p: 'contact.snapchat', label: 'سناب شات', t: 'ltr' },
      { p: 'contact.x', label: 'إكس (تويتر)', t: 'ltr' },
      { p: 'contact.youtube', label: 'يوتيوب', t: 'ltr' },
      { p: 'contact.facebook', label: 'فيسبوك', t: 'ltr' },
      { p: 'contact.pinterest', label: 'بنترست', t: 'ltr' },
    ]},
  ]},
  { key: 'link', icon: '🔗', title: 'الرابط و QR', hint: 'رابط البروفايل وكود QR لإرساله أو طباعته للعملاء', custom: renderLink },
  { key: 'users', icon: '👥', title: 'المستخدمون', hint: 'إضافة وحذف المستخدمين وتحديد صلاحياتهم', custom: renderUsers, adminOnly: true },
  { key: 'settings', icon: '⚙️', title: 'الإعدادات', hint: 'إظهار وإخفاء الأقسام وكلمة المرور', custom: renderSettings },
];

// ---------- الحالة ----------
let data = null, current = 'company', dirty = false, me = null, contentVersion = '';
const ROLE = { admin: 'مدير', editor: 'محرر' };
const api = async (url, method = 'GET', body) => {
  const r = await fetch('../api/' + url, { method, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) { toast('انتهت الجلسة — سجّل الدخول مرة أخرى', 'bad'); setTimeout(() => location.reload(), 1500); }
  if (!r.ok) throw new Error(j.error || 'حدث خطأ');
  return j;
};
function modal(title, inner, onOk, okText = 'حفظ') {
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<form class="modal-box"><h3>${esc(title)}</h3>${inner}
    <div class="modal-acts"><button class="btn gold" type="submit">${esc(okText)}</button><button class="btn light" type="button">إلغاء</button></div></form>`;
  const close = () => m.remove();
  m.querySelector('.btn.light').onclick = close;
  m.onclick = (e) => { if (e.target === m) close(); };
  m.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    try { await onOk(m); close(); } catch (err) { toast(err.message, 'bad'); }
  };
  document.body.append(m); m.querySelector('input,select')?.focus();
  return m;
}

// ---------- طلبات التفصيل ----------
const REQ_STATUS = { new: ['جديد', '#c47f00'], contacted: ['تم التواصل', '#2563a8'], quoted: ['تم التسعير', '#6b4fb3'], progress: ['قيد التنفيذ', '#a8871a'], done: ['مكتمل', '#1f7a4a'], cancelled: ['ملغي', '#888'] };
async function renderCustomReqs(root) {
  const p = document.createElement('div'); p.className = 'panel';
  p.innerHTML = '<h3>طلبات التفصيل حسب الطلب</h3><p class="hint">كل طلب له رابط فيه المخطط والمقاسات والخامات والصورة المرجعية — نفس الرابط اللي وصل للفرع على الواتساب</p><div class="reqs" id="reqList">جاري التحميل…</div>';
  root.append(p);
  const box = p.querySelector('#reqList');
  const load = async () => {
    const list = await api('custom/list');
    if (!list.length) { box.innerHTML = '<p class="hint" style="margin:0">لا توجد طلبات بعد — الطلبات تظهر هنا أول ما يرسلها العملاء من صفحة «تفصيل حسب الطلب».</p>'; return; }
    box.innerHTML = list.map(q => `<div class="req" data-id="${q.id}">
      ${q.sheet ? `<a href="../${esc(q.sheet)}" target="_blank" rel="noopener"><img src="../${esc(q.sheet)}?w=320" alt=""></a>` : '<span class="req-ph">📐</span>'}
      <div class="req-b"><b>${esc(q.pieceTitle)} <small>${esc(q.categoryTitle)}</small></b>
        <span>${q.dims.w} × ${q.dims.d} × ${q.dims.h} سم • الكمية ${q.qty}</span>
        <span>👤 ${esc(q.customer.name)} — <a href="tel:${esc(q.customer.phone)}" dir="ltr">${esc(q.customer.phone)}</a> • ${esc(q.branch.name)} ${esc(q.branch.area)}</span>
        <small>${esc(q.no)} • ${new Date(q.created).toLocaleString('ar-SA-u-nu-latn')}</small></div>
      <div class="req-a"><select>${Object.entries(REQ_STATUS).map(([k, [t]]) => `<option value="${k}" ${k === q.status ? 'selected' : ''}>${t}</option>`).join('')}</select>
        <a class="btn light sm" href="../#r/${q.id}" target="_blank" rel="noopener">عرض الطلب</a>
        ${me.role === 'admin' ? '<button class="btn danger sm" type="button">حذف</button>' : ''}</div></div>`).join('');
    box.querySelectorAll('.req').forEach(el => {
      const id = el.dataset.id, sel = el.querySelector('select');
      const paint = () => { sel.style.color = REQ_STATUS[sel.value][1]; sel.style.borderColor = REQ_STATUS[sel.value][1]; };
      paint();
      sel.onchange = async () => { try { await api('custom/admin/' + id, 'PUT', { status: sel.value }); paint(); toast('تم تحديث الحالة ✓', 'ok'); } catch (e) { toast(e.message, 'bad'); } };
      const del = el.querySelector('.btn.danger');
      if (del) del.onclick = async () => { if (!confirm('حذف هذا الطلب نهائياً؟')) return; try { await api('custom/admin/' + id, 'DELETE'); el.remove(); toast('تم الحذف', 'ok'); } catch (e) { toast(e.message, 'bad'); } };
    });
  };
  try { await load(); } catch (e) { box.textContent = e.message; }
}

// ---------- المستخدمون ----------
async function renderUsers(root) {
  const p = document.createElement('div'); p.className = 'panel';
  p.innerHTML = `<h3>المستخدمون</h3><p class="hint"><b>المدير</b>: كل الصلاحيات وإدارة المستخدمين — <b>المحرر</b>: تعديل محتوى الموقع فقط</p>
    <table class="utable"><thead><tr><th>الاسم</th><th class="hide-m">اسم الدخول</th><th>الصلاحية</th><th></th></tr></thead><tbody></tbody></table>
    <div style="height:16px"></div><button class="btn gold" type="button" id="addUser">＋ إضافة مستخدم</button>`;
  root.append(p);
  const tbody = p.querySelector('tbody');
  const roleSel = (v) => `<select name="role"><option value="editor" ${v !== 'admin' ? 'selected' : ''}>محرر — تعديل المحتوى فقط</option><option value="admin" ${v === 'admin' ? 'selected' : ''}>مدير — كل الصلاحيات</option></select>`;
  const load = async () => {
    const users = await api('users');
    tbody.innerHTML = '';
    for (const u of users) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><b>${esc(u.name)}</b>${u.username === me.username ? ' <small style="color:#a8871a">(أنت)</small>' : ''}<div class="un" style="display:block">@${esc(u.username)}</div></td>
        <td class="hide-m"><span class="un">${esc(u.username)}</span></td>
        <td><span class="badge ${u.role}">${ROLE[u.role]}</span></td>
        <td><div class="acts"><button class="btn light sm" data-a="edit">تعديل</button><button class="btn light sm" data-a="pw">كلمة المرور</button>
        ${u.username !== me.username ? '<button class="btn danger sm" data-a="del">حذف</button>' : ''}</div></td>`;
      tr.querySelector('[data-a=edit]').onclick = () => modal('تعديل ' + u.name,
        `<div class="field"><label>الاسم</label><input type="text" name="name" value="${esc(u.name)}" required></div>
         <div class="field"><label>الصلاحية</label>${roleSel(u.role)}</div>`,
        async (m) => { await api('users/' + encodeURIComponent(u.username), 'PUT', { name: m.querySelector('[name=name]').value, role: m.querySelector('[name=role]').value }); toast('تم التعديل ✓', 'ok'); load(); });
      tr.querySelector('[data-a=pw]').onclick = () => modal('كلمة مرور جديدة لـ ' + u.name,
        `<div class="field"><label>كلمة المرور الجديدة <small>— 4 أحرف على الأقل</small></label><input type="text" name="pw" dir="ltr" minlength="4" required></div>`,
        async (m) => { await api('users/' + encodeURIComponent(u.username), 'PUT', { password: m.querySelector('[name=pw]').value }); toast('تم تغيير كلمة المرور ✓', 'ok'); });
      const del = tr.querySelector('[data-a=del]');
      if (del) del.onclick = async () => {
        if (!confirm(`حذف المستخدم «${u.name}»؟ لن يستطيع الدخول بعدها.`)) return;
        try { await api('users/' + encodeURIComponent(u.username), 'DELETE'); toast('تم الحذف', 'ok'); load(); } catch (e) { toast(e.message, 'bad'); }
      };
      tbody.append(tr);
    }
  };
  p.querySelector('#addUser').onclick = () => modal('إضافة مستخدم جديد',
    `<div class="field"><label>الاسم <small>— مثل: محمد أحمد</small></label><input type="text" name="name" required></div>
     <div class="field"><label>اسم الدخول <small>— عربي أو إنجليزي بدون مسافات، مثل: محمد</small></label><input type="text" name="username" dir="auto" required></div>
     <div class="field"><label>كلمة المرور <small>— 4 أحرف على الأقل</small></label><input type="text" name="pw" dir="ltr" minlength="4" required></div>
     <div class="field"><label>الصلاحية</label>${roleSel('editor')}</div>`,
    async (m) => {
      const v = (n) => m.querySelector(`[name=${n}]`).value;
      await api('users', 'POST', { name: v('name'), username: v('username'), password: v('pw'), role: v('role') });
      toast('تمت إضافة المستخدم ✓', 'ok'); load();
    }, 'إضافة');
  try { await load(); } catch (e) { toast(e.message, 'bad'); }
}

// ---------- الرابط و QR ----------
let lanUrl = '';
const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
function siteUrl() { return (data.siteUrl || '').trim() || (isLocal() && lanUrl) || location.origin + '/'; }
function drawQR(canvas, url, { card = false } = {}) {
  const qr = qrcode(0, 'H'); qr.addData(unescape(encodeURIComponent(url))); qr.make();
  const n = qr.getModuleCount(), size = 1024, pad = 64, cell = (size - pad * 2) / n;
  const capH = card ? 230 : 0;
  canvas.width = size; canvas.height = size + capH;
  const g = canvas.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, canvas.width, canvas.height);
  if (card) { g.fillStyle = '#111'; g.fillRect(0, size, size, capH); }
  g.fillStyle = '#111';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
    if (qr.isDark(r, c)) g.fillRect(pad + c * cell, pad + r * cell, Math.ceil(cell), Math.ceil(cell));
  // عيون الكود بالذهبي
  const gold = data.theme?.gold || '#DBB83C';
  for (const [r0, c0] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
    g.fillStyle = gold; g.fillRect(pad + (c0 + 2) * cell, pad + (r0 + 2) * cell, cell * 3, cell * 3);
  }
  return new Promise(res => {
    const logo = new Image(); logo.src = imgUrl(data.company.logo) || '../assets/logo-mark.png';
    const finish = () => {
      if (card) {
        g.fillStyle = gold; g.textAlign = 'center'; g.direction = 'rtl';
        g.font = '800 64px Tajawal, sans-serif'; g.fillText(data.company.nameAr || '', size / 2, size + 95);
        g.fillStyle = '#ddd'; g.font = '500 40px Tajawal, sans-serif'; g.fillText('امسح الكود وتعرّف علينا', size / 2, size + 170);
      }
      res();
    };
    logo.onload = () => {
      const box = size * 0.22, x = (size - box) / 2, y = (size - box) / 2;
      g.fillStyle = '#fff'; g.beginPath(); g.roundRect(x - 14, y - 14, box + 28, box + 28, 24); g.fill();
      const k = Math.min(box / logo.width, box / logo.height), w = logo.width * k, h = logo.height * k;
      g.drawImage(logo, (size - w) / 2, (size - h) / 2, w, h); finish();
    };
    logo.onerror = finish;
  });
}
function renderLink(root) {
  const p = document.createElement('div'); p.className = 'panel';
  p.innerHTML = `<h3>رابط البروفايل</h3><p class="hint">أرسل هذا الرابط لعملائك أو اطبع كود QR في المحل والكروت والفواتير</p>
    <div class="qr-wrap">
      <div class="qr-card"><canvas id="qrC"></canvas></div>
      <div>
        <div class="link-row"><div class="link-box" id="linkBox"></div></div>
        <div class="link-row">
          <button class="btn light" id="copyL" type="button">📋 نسخ الرابط</button>
          <a class="btn light" id="waL" target="_blank" rel="noopener">💬 مشاركة واتساب</a>
          <a class="btn light" id="openL" target="_blank" rel="noopener">↗ فتح</a>
        </div>
        <div class="link-row">
          <button class="btn gold" id="dlQR" type="button">⬇ تنزيل QR</button>
          <button class="btn light" id="dlCard" type="button">⬇ تنزيل بطاقة QR مع اسم الشركة</button>
        </div>
        <div class="field" style="margin-top:18px"><label>رابط الموقع على الإنترنت <small>— بعد النشر اكتب الرابط هنا ثم اضغط حفظ</small></label>
          <input type="text" class="ltr" id="urlIn" placeholder="https://example.com"></div>
        <div class="note" id="localNote" hidden>⚠ هذا <b>رابط الواي فاي</b> للتجربة: يفتح فقط من جوال متصل بنفس شبكة الواي فاي حقت الكمبيوتر، والكمبيوتر لازم يكون شغّال والموقع مفتوح.
          إذا ما فتح من الجوال: جدار الحماية في ويندوز يمنعه — اسمح لـ Node.js من «جدار حماية Windows ← السماح لتطبيق» على الشبكات الخاصة، وخلّ شبكة الواي فاي «خاصة».
          للعملاء: بعد نشر الموقع على الإنترنت ضع الرابط الجديد هنا وحمّل QR جديد.</div>
      </div>
    </div>`;
  root.append(p);
  const refresh = () => {
    const u = siteUrl();
    p.querySelector('#linkBox').textContent = u;
    p.querySelector('#openL').href = u;
    p.querySelector('#waL').href = 'https://wa.me/?text=' + encodeURIComponent(`${data.company.nameAr}\n${data.company.tagline || ''}\nتعرّف علينا: ${u}`);
    p.querySelector('#localNote').hidden = !/localhost|127\.0\.0\.1|\/\/(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))\./.test(u);
    if (window.qrcode) drawQR(p.querySelector('#qrC'), u);
    else p.querySelector('.qr-card').textContent = 'تعذّر تحميل مولّد QR — تأكد من اتصال الإنترنت';
  };
  const urlIn = p.querySelector('#urlIn'); urlIn.value = data.siteUrl || '';
  // على جهاز الكمبيوتر: نستخدم عنوان الواي فاي بدل localhost حتى يفتح من الجوال
  if (isLocal() && !lanUrl) api('lan').then(r => { if (r.ips?.[0]) { lanUrl = `http://${r.ips[0]}:${location.port || r.port}/`; refresh(); } }).catch(() => {});
  urlIn.oninput = () => { data.siteUrl = urlIn.value.trim(); markDirty(); refresh(); };
  p.querySelector('#copyL').onclick = async () => { try { await navigator.clipboard.writeText(siteUrl()); toast('تم نسخ الرابط ✓', 'ok'); } catch { toast('انسخ الرابط يدوياً', 'bad'); } };
  const dl = async (card) => {
    const c = document.createElement('canvas'); await document.fonts?.ready; await drawQR(c, siteUrl(), { card });
    const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = card ? 'بطاقة-QR-الضبيبي.png' : 'QR-الضبيبي.png'; a.click();
  };
  p.querySelector('#dlQR').onclick = () => dl(false);
  p.querySelector('#dlCard').onclick = () => dl(true);
  refresh();
}
const markDirty = () => { dirty = true; $('dirty').hidden = false; };
function toast(msg, kind = '') {
  const t = $('toast'); t.textContent = msg; t.className = 'toast show ' + kind;
  clearTimeout(t._h); t._h = setTimeout(() => t.className = 'toast', 2600);
}

// ---------- رفع الصور (مع ضغط تلقائي) ----------
async function compress(file) {
  if (/svg|gif/.test(file.type)) return { blob: file, name: file.name };
  const bmp = await createImageBitmap(file);
  const max = 1920, k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.86));
  return { blob, name: 'image.webp' };
}
// ---------- أداة القص والمقاس ----------
const RATIOS = [['حر', NaN], ['مربع 1:1', 1], ['4:3', 4 / 3], ['3:4', 3 / 4], ['16:9', 16 / 9], ['9:16', 9 / 16], ['3:2', 3 / 2]];
const SIZES = [['صغير — 800px', 800], ['متوسط — 1280px', 1280], ['كبير — 1920px (مستحسن)', 1920], ['كبير جداً — 2560px', 2560], ['المقاس الأصلي', 0], ['مقاس مخصص…', -1]];
// يرجع: { blob, name } أو 'skip' (رفع بدون قص) أو 'skipAll' أو null (إلغاء)
function cropDialog(src, { aspect = NaN, title = 'قص الصورة', index = 0, total = 1 } = {}) {
  return new Promise((resolve) => {
    const d = document.createElement('div'); d.className = 'crop';
    d.innerHTML = `
      <div class="crop-head"><h3>✂ ${esc(title)} ${total > 1 ? `<small>— صورة ${index + 1} من ${total}</small>` : ''}</h3>
        <button class="btn light sm" data-x="cancel" type="button">✕ إلغاء</button></div>
      <div class="crop-body">
        <div class="crop-stage"><img alt=""></div>
        <div class="crop-side">
          <h4>نسبة القص</h4><div class="chips" data-g="ratio">${RATIOS.map(([n, v], i) => `<button type="button" class="chip" data-i="${i}">${n}</button>`).join('')}</div>
          <h4>تدوير وقلب</h4><div class="chips">
            <button type="button" class="chip" data-x="rl">↺ يسار</button><button type="button" class="chip" data-x="rr">↻ يمين</button>
            <button type="button" class="chip" data-x="fh">⇆ قلب أفقي</button><button type="button" class="chip" data-x="fv">⇅ قلب رأسي</button></div>
          <h4>تكبير / تصغير</h4><div class="chips">
            <button type="button" class="chip" data-x="zi">＋ تكبير</button><button type="button" class="chip" data-x="zo">－ تصغير</button>
            <button type="button" class="chip" data-x="reset">↺ إعادة ضبط</button></div>
          <h4>الألوان والإضاءة</h4>
          <div class="chips" data-g="presets">
            <button type="button" class="chip on" data-p="normal">طبيعي</button><button type="button" class="chip" data-p="auto">✨ تحسين تلقائي</button>
            <button type="button" class="chip" data-p="bright">مشرق</button><button type="button" class="chip" data-p="warm">دافئ</button>
            <button type="button" class="chip" data-p="cool">بارد</button><button type="button" class="chip" data-p="lux">فخم</button>
            <button type="button" class="chip" data-p="bw">أبيض وأسود</button></div>
          <div class="adj">
            <label>☀ الإضاءة <b data-v="b">0</b><input type="range" min="-60" max="60" value="0" data-a="b"></label>
            <label>◐ التباين <b data-v="c">0</b><input type="range" min="-50" max="60" value="0" data-a="c"></label>
            <label>🎨 تشبّع الألوان <b data-v="s">0</b><input type="range" min="-100" max="80" value="0" data-a="s"></label>
            <label>🔥 الدفء <b data-v="w">0</b><input type="range" min="-50" max="50" value="0" data-a="w"></label>
          </div>
          <h4>مقاس الصورة النهائي</h4><select data-g="size">${SIZES.map(([n, v]) => `<option value="${v}" ${v === 1920 ? 'selected' : ''}>${n}</option>`).join('')}</select>
          <div data-g="custom" hidden style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px">
            <input type="number" min="50" max="6000" placeholder="العرض" data-g="cw"><input type="number" min="50" max="6000" placeholder="الارتفاع" data-g="ch"></div>
          <h4>الجودة: <b data-g="qv">85</b>%</h4><input type="range" min="50" max="100" value="85" data-g="q">
          <div class="crop-info">المقاس الناتج: <b data-g="out">—</b><br>المقاس الأصلي: <b data-g="orig">—</b></div>
        </div>
      </div>
      <div class="crop-foot">
        <button class="btn gold" data-x="ok" type="button">✓ قص ورفع</button>
        <button class="btn light" data-x="skip" type="button">رفع الصورة كما هي</button>
        ${total - index > 1 ? '<button class="btn light" data-x="skipAll" type="button">رفع الباقي كما هي</button>' : ''}
        <span class="sp"></span>
      </div>`;
    document.body.append(d);
    const q = (s) => d.querySelector(s), img = q('.crop-stage img');
    let cropper, sx = 1, sy = 1;
    // ----- الألوان والإضاءة -----
    const adj = { b: 0, c: 0, s: 0, w: 0, gray: 0 };
    const PRESETS = { normal: { b: 0, c: 0, s: 0, w: 0, gray: 0 }, auto: { b: 6, c: 12, s: 15, w: 3, gray: 0 },
      bright: { b: 22, c: 5, s: 8, w: 0, gray: 0 }, warm: { b: 4, c: 6, s: 10, w: 25, gray: 0 },
      cool: { b: 4, c: 6, s: 0, w: -25, gray: 0 }, lux: { b: -6, c: 22, s: -10, w: 12, gray: 0 }, bw: { b: 4, c: 15, s: 0, w: 0, gray: 1 } };
    const filterStr = () => {
      const f = [`brightness(${1 + adj.b / 100})`, `contrast(${1 + adj.c / 100})`, `saturate(${1 + adj.s / 100})`];
      if (adj.w > 0) f.push(`sepia(${adj.w / 140})`);
      if (adj.w < 0) f.push(`hue-rotate(${adj.w / 3}deg)`, `saturate(${1 + adj.w / 250})`);
      if (adj.gray) f.push('grayscale(1)');
      return f.join(' ');
    };
    const isPlain = () => !adj.b && !adj.c && !adj.s && !adj.w && !adj.gray;
    const applyFilter = () => {
      const f = isPlain() ? '' : filterStr();
      d.querySelectorAll('.cropper-container img').forEach(i => i.style.filter = f);
      d.querySelectorAll('[data-a]').forEach(r => { r.value = adj[r.dataset.a]; d.querySelector(`[data-v=${r.dataset.a}]`).textContent = (adj[r.dataset.a] > 0 ? '+' : '') + adj[r.dataset.a]; });
    };
    d.querySelectorAll('[data-a]').forEach(r => r.oninput = () => {
      adj[r.dataset.a] = +r.value; d.querySelectorAll('[data-g=presets] .chip').forEach(c => c.classList.remove('on')); applyFilter();
    });
    q('[data-g=presets]').onclick = (e) => {
      const c = e.target.closest('[data-p]'); if (!c) return;
      Object.assign(adj, PRESETS[c.dataset.p]);
      d.querySelectorAll('[data-g=presets] .chip').forEach(x => x.classList.toggle('on', x === c)); applyFilter();
    };
    const done = (v) => { cropper?.destroy(); d.remove(); removeEventListener('keydown', onKey); resolve(v); };
    const onKey = (e) => { if (e.key === 'Escape') done(null); if (e.key === 'Enter') q('[data-x=ok]').click(); };
    addEventListener('keydown', onKey);

    const target = () => {
      const s = +q('[data-g=size]').value, data2 = cropper.getData(true);
      let w = data2.width, h = data2.height;
      if (s === -1) {
        const cw = +q('[data-g=cw]').value, ch = +q('[data-g=ch]').value;
        if (cw && ch) return { w: cw, h: ch, exact: true };
        if (cw) return { w: cw, h: Math.round(h * cw / w) };
        if (ch) return { w: Math.round(w * ch / h), h: ch };
        return { w, h };
      }
      if (s > 0 && Math.max(w, h) > s) { const k = s / Math.max(w, h); w = Math.round(w * k); h = Math.round(h * k); }
      return { w, h };
    };
    const info = () => { if (!cropper) return; const t = target(); q('[data-g=out]').textContent = `${t.w} × ${t.h}`; };
    const setRatio = (i) => {
      d.querySelectorAll('[data-g=ratio] .chip').forEach((c, j) => c.classList.toggle('on', j === i));
      cropper.setAspectRatio(RATIOS[i][1]);
    };

    img.onload = () => {
      q('[data-g=orig]').textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
      // القص الحر هو الافتراضي، والنسبة المقترحة لهذه الخانة عليها نجمة
      const sug = RATIOS.findIndex(r => !isNaN(aspect) && Math.abs(r[1] - aspect) < 0.01);
      if (sug > 0) { const ch = d.querySelector(`[data-g=ratio] .chip[data-i="${sug}"]`); ch.textContent += ' ★'; ch.title = 'النسبة المقترحة لهذا المكان'; }
      cropper = new Cropper(img, {
        viewMode: 1, autoCropArea: 1, background: true, responsive: true, crop: info,
        ready() { setRatio(0); info(); applyFilter(); },
      });
    };
    img.onerror = () => { toast('تعذّر فتح الصورة', 'bad'); done('skip'); };
    img.src = src;

    d.querySelector('[data-g=ratio]').onclick = (e) => { const c = e.target.closest('.chip'); if (c && cropper) setRatio(+c.dataset.i); };
    q('[data-g=size]').onchange = () => { q('[data-g=custom]').hidden = q('[data-g=size]').value !== '-1'; info(); };
    q('[data-g=cw]').oninput = q('[data-g=ch]').oninput = info;
    q('[data-g=q]').oninput = () => q('[data-g=qv]').textContent = q('[data-g=q]').value;
    d.onclick = async (e) => {
      const x = e.target.closest('[data-x]')?.dataset.x; if (!x) return;
      if (x === 'cancel') return done(null);
      if (x === 'skip' || x === 'skipAll') return done(x);
      if (!cropper) return;
      if (x === 'rl') cropper.rotate(-90);
      if (x === 'rr') cropper.rotate(90);
      if (x === 'fh') cropper.scaleX(sx = -sx);
      if (x === 'fv') cropper.scaleY(sy = -sy);
      if (x === 'zi') cropper.zoom(0.1);
      if (x === 'zo') cropper.zoom(-0.1);
      if (x === 'reset') { cropper.reset(); sx = sy = 1; }
      if (x === 'ok') {
        const t = target();
        let canvas = cropper.getCroppedCanvas({ width: t.w, height: t.h, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' });
        if (!isPlain()) { // تطبيق الألوان والإضاءة على الصورة النهائية
          const c2 = document.createElement('canvas'); c2.width = canvas.width; c2.height = canvas.height;
          const g2 = c2.getContext('2d'); g2.filter = filterStr(); g2.drawImage(canvas, 0, 0); canvas = c2;
        }
        const blob = await new Promise(r => canvas.toBlob(r, 'image/webp', +q('[data-g=q]').value / 100));
        done({ blob, name: 'image.webp' });
      }
      info();
    };
  });
}

async function sendFile(blob, name) {
  const r = await fetch('../api/upload', { method: 'POST', body: blob, headers: { 'X-Filename': encodeURIComponent(name) } });
  if (r.status === 401) { location.reload(); throw new Error('انتهت الجلسة'); }
  return (await r.json()).url;
}
// opts: { aspect, title }
async function upload(files, opts = {}) {
  files = files.filter(f => f.type.startsWith('image/'));
  const urls = []; let skipAll = false;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    let out = 'skip';
    if (!skipAll && window.Cropper && !/svg|gif/.test(f.type)) {
      const u = URL.createObjectURL(f);
      out = await cropDialog(u, { ...opts, index: i, total: files.length });
      URL.revokeObjectURL(u);
      if (out === null) continue; // ألغى هذه الصورة
      if (out === 'skipAll') { skipAll = true; out = 'skip'; }
    }
    const ov = document.createElement('div'); ov.className = 'uploading';
    ov.textContent = files.length > 1 ? `جاري رفع الصور ${i + 1} / ${files.length} ...` : 'جاري رفع الصورة ...';
    document.body.append(ov);
    try {
      const { blob, name } = out === 'skip' ? await compress(f) : out;
      urls.push(await sendFile(blob, name));
    } catch (e) { toast('تعذّر رفع الصورة: ' + e.message, 'bad'); }
    finally { ov.remove(); }
  }
  return urls;
}
// ---------- رفع الفيديو مع شريط تقدّم ----------
function pickVideo() {
  return new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/mp4,video/webm,video/quicktime,video/*'; i.onchange = () => res([...i.files]); i.click(); });
}
function uploadVideo(file) {
  if (window.GH_ADMIN) return window.GH.uploadVideo(file);
  return new Promise((resolve) => {
    const ov = document.createElement('div'); ov.className = 'uploading';
    ov.innerHTML = `<div style="text-align:center;width:min(360px,90vw)">جاري رفع الفيديو...<div class="bar"><i></i></div><small>0%</small></div>`;
    document.body.append(ov);
    const ext = (file.name.match(/\.[^.]+$/) || ['.mp4'])[0];
    const x = new XMLHttpRequest(); x.open('POST', '../api/upload'); x.setRequestHeader('X-Filename', encodeURIComponent('video' + ext));
    x.upload.onprogress = (e) => { if (e.lengthComputable) { const pc = Math.round(e.loaded / e.total * 100); ov.querySelector('i').style.width = pc + '%'; ov.querySelector('small').textContent = pc + '%'; } };
    x.onload = () => { ov.remove(); try { const j = JSON.parse(x.responseText); if (x.status === 200) return resolve(j.url); toast(j.error || 'تعذّر الرفع', 'bad'); } catch { toast('تعذّر الرفع', 'bad'); } resolve(null); };
    x.onerror = () => { ov.remove(); toast('انقطع الاتصال أثناء الرفع', 'bad'); resolve(null); };
    x.send(file);
  });
}
async function uploadFrame(video) {
  if (!video || !video.videoWidth) { toast('شغّل الفيديو أو انتظر تحميله أولاً', 'bad'); return null; }
  const c = document.createElement('canvas'); const k = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
  c.width = Math.round(video.videoWidth * k); c.height = Math.round(video.videoHeight * k);
  c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.85));
  try { return await sendFile(blob, 'poster.webp'); } catch (e) { toast(e.message, 'bad'); return null; }
}

// إعادة قص صورة مرفوعة سابقاً — يرجع الرابط الجديد أو null
async function recrop(src, opts = {}) {
  if (!window.Cropper) { toast('أداة القص تحتاج اتصال إنترنت', 'bad'); return null; }
  const out = await cropDialog(imgUrl(src), { ...opts, title: 'إعادة قص الصورة' });
  if (!out || typeof out === 'string') return null;
  const ov = document.createElement('div'); ov.className = 'uploading'; ov.textContent = 'جاري الحفظ ...'; document.body.append(ov);
  try { return await sendFile(out.blob, out.name); } catch (e) { toast(e.message, 'bad'); return null; } finally { ov.remove(); }
}
function pickFiles(multiple) {
  return new Promise(res => {
    const inp = $('filePick'); inp.value = ''; inp.multiple = multiple;
    inp.onchange = () => res([...inp.files]); inp.click();
  });
}
function dropZone(el, cb) {
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('drag'); });
  el.addEventListener('dragleave', () => el.classList.remove('drag'));
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('drag'); cb([...e.dataTransfer.files]); });
}

// ---------- بناء الحقول ----------
// obj: الكائن الذي يحمل القيمة، key: اسم الخاصية فيه
function fieldEl(f, obj, key, onChange) {
  const wrap = document.createElement('div'); wrap.className = 'field';
  const t = f.t || 'text';
  if (f.label) wrap.innerHTML = `<label>${esc(f.label)} ${f.hint && t !== 'list' ? `<small>— ${esc(f.hint)}</small>` : ''}</label>`;
  const val = obj[key];

  if (t === 'text' || t === 'ltr') {
    const i = document.createElement('input'); i.type = 'text'; i.value = val ?? '';
    if (t === 'ltr') i.className = 'ltr';
    i.oninput = () => { obj[key] = i.value; markDirty(); onChange?.(); };
    wrap.append(i);
  } else if (t === 'textarea') {
    const i = document.createElement('textarea'); i.value = val ?? ''; if (f.rows) i.rows = f.rows;
    i.oninput = () => { obj[key] = i.value; markDirty(); onChange?.(); };
    if (f.ai) wrap.append(aiButton(obj, i, wrap));
    wrap.append(i);
  } else if (t === 'color') {
    const def = f.def || '#DBB83C';
    const row = document.createElement('div'); row.className = 'color-row';
    row.innerHTML = `<input type="color" value="${esc(val || def)}"><span dir="ltr">${esc(val || def)}</span>
      <button class="btn light sm" type="button">الافتراضي</button>`;
    const [ci, sp, rb] = row.children;
    ci.oninput = () => { obj[key] = ci.value; sp.textContent = ci.value; markDirty(); onChange?.(); };
    rb.onclick = () => { ci.value = def; ci.oninput(); };
    if (!val) obj[key] = def;
    wrap.append(row);
  } else if (t === 'toggle') {
    wrap.innerHTML = '';
    const row = document.createElement('label'); row.className = 'toggle';
    row.innerHTML = `<span><b>${esc(f.label)}</b>${f.hint ? ` <small style="color:var(--muted)">— ${esc(f.hint)}</small>` : ''}</span>
      <span class="switch"><input type="checkbox"><span></span></span>`;
    const cb = row.querySelector('input'); cb.checked = val === undefined || val === '' ? !!f.def : !!val;
    cb.onchange = () => { obj[key] = cb.checked; markDirty(); onChange?.(); };
    wrap.append(row);
  } else if (t === 'image') {
    const row = document.createElement('div'); row.className = 'img-field';
    const draw = () => {
      row.innerHTML = `<div class="img-box">${obj[key] ? `<img src="${esc(imgUrl(obj[key]))}" alt="">` : 'اضغط أو اسحب<br>صورة هنا'}</div>
        <div class="img-actions"><button class="btn light sm" type="button">${obj[key] ? 'تغيير الصورة' : 'رفع صورة'}</button>
        ${obj[key] && !/\.(svg|gif)$/i.test(obj[key]) ? '<button class="btn light sm" type="button" data-cr>✂ قص وتعديل المقاس</button>' : ''}
        ${obj[key] ? '<button class="btn danger sm" type="button" data-del>حذف الصورة</button>' : ''}</div>`;
      const box = row.querySelector('.img-box'), up = row.querySelector('button'), del = row.querySelector('[data-del]'), cr = row.querySelector('[data-cr]');
      const opts = { aspect: f.aspect ?? NaN, title: f.label };
      const set = async (files) => { const [u] = await upload(files.slice(0, 1), opts); if (u) { obj[key] = u; markDirty(); draw(); onChange?.(); } };
      box.onclick = up.onclick = async () => set(await pickFiles(false));
      dropZone(box, set);
      if (cr) cr.onclick = async () => { const u = await recrop(obj[key], opts); if (u) { obj[key] = u; markDirty(); draw(); onChange?.(); } };
      if (del) del.onclick = () => { obj[key] = ''; markDirty(); draw(); onChange?.(); };
    };
    draw(); wrap.append(row);
  } else if (t === 'tiktok') {
    // رابط تيك توك ← رقم الفيديو + الغلاف + العنوان تلقائياً
    const i = document.createElement('input'); i.type = 'text'; i.className = 'ltr'; i.value = val ?? ''; i.placeholder = 'https://www.tiktok.com/@dh_trd/video/...';
    const st = document.createElement('div'); st.className = 'map-state';
    const show = () => st.innerHTML = obj.tiktokId ? `✓ فيديو تيك توك جاهز — يشتغل داخل الموقع (<span dir="ltr">${esc(obj.tiktokId)}</span>)` : 'الصق الرابط وسيتم جلب الغلاف والعنوان تلقائياً';
    let timer;
    i.oninput = () => {
      obj[key] = i.value.trim(); markDirty();
      clearTimeout(timer); if (!obj[key]) { obj.tiktokId = ''; return show(); }
      timer = setTimeout(async () => {
        st.textContent = '… جاري قراءة الفيديو من تيك توك';
        try {
          const r = await api('tiktok', 'POST', { url: obj[key] });
          obj.tiktokId = r.id; obj[key] = r.url || obj[key];
          if (r.poster && !obj.poster) obj.poster = r.poster;
          if (r.title && !obj.title) obj.title = r.title.slice(0, 80);
          markDirty(); show(); wrap.dispatchEvent(new CustomEvent('redraw-item', { bubbles: true }));
        } catch (e) { st.textContent = '✕ ' + e.message; }
      }, 600);
    };
    show(); wrap.append(i, st);
  } else if (t === 'map') {
    // رابط قوقل ماب + استخراج الإحداثيات تلقائياً
    const i = document.createElement('input'); i.type = 'text'; i.className = 'ltr'; i.value = val ?? ''; i.placeholder = 'https://maps.app.goo.gl/...';
    const st = document.createElement('div'); st.className = 'map-state';
    const show = () => st.innerHTML = obj.coords
      ? `${obj.coordsApprox !== false && !obj.mapUrl ? '⚠ موقع تقريبي (مستوى المدينة)' : '✓ الموقع محدد'}: <b dir="ltr">${esc(obj.coords)}</b>`
      : 'لم يُحدد الموقع بعد';
    let timer;
    i.oninput = () => {
      obj[key] = i.value.trim(); markDirty(); onChange?.();
      clearTimeout(timer); if (!obj[key]) return show();
      timer = setTimeout(async () => {
        st.textContent = '… جاري تحديد الموقع';
        try { const r = await api('resolve-map', 'POST', { url: obj[key] }); obj.coords = `${r.lat}, ${r.lng}`; obj.coordsApprox = false; markDirty(); show(); onChange?.(); }
        catch (e) { st.textContent = '✕ ' + e.message; }
      }, 600);
    };
    show(); wrap.append(i, st);
  } else if (t === 'video') {
    const row = document.createElement('div'); row.className = 'vid-field';
    const draw = () => {
      row.innerHTML = obj[key]
        ? `<video src="${esc(imgUrl(obj[key]))}" controls playsinline preload="metadata"></video>
           <div class="img-actions"><button class="btn light sm" type="button" data-up>تغيير الفيديو</button>
           <button class="btn light sm" type="button" data-shot>📸 اجعل اللقطة الحالية غلافاً</button>
           <button class="btn danger sm" type="button" data-del>حذف الفيديو</button></div>`
        : `<div class="img-box vid-drop" data-up>🎬 اضغط أو اسحب<br>فيديو هنا</div>`;
      row.querySelectorAll('[data-up]').forEach(b => b.onclick = async () => set(await pickVideo()));
      const drop = row.querySelector('.vid-drop'); if (drop) dropZone(drop, set);
      const del = row.querySelector('[data-del]');
      if (del) del.onclick = () => { if (confirm('حذف الفيديو؟')) { obj[key] = ''; markDirty(); draw(); onChange?.(); } };
      const shot = row.querySelector('[data-shot]');
      if (shot) shot.onclick = async () => {
        const u = await uploadFrame(row.querySelector('video')); if (u) { obj.poster = u; markDirty(); wrap.dispatchEvent(new CustomEvent('redraw-item', { bubbles: true })); toast('تم تعيين الغلاف ✓', 'ok'); }
      };
    };
    const set = async (files) => {
      const f0 = files.find(x => x.type.startsWith('video/')); if (!f0) return toast('اختر ملف فيديو', 'bad');
      if (f0.size > 300 * 1024 * 1024) return toast('الفيديو أكبر من 300 ميجا', 'bad');
      const u = await uploadVideo(f0); if (!u) return;
      obj[key] = u; markDirty();
      if (!obj.poster) { // غلاف تلقائي من الثانية الأولى
        const v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = imgUrl(u);
        try { await new Promise((ok, no) => { v.onloadeddata = ok; v.onerror = no; }); v.currentTime = Math.min(1, (v.duration || 2) / 3);
          await new Promise(ok => v.onseeked = ok); const p = await uploadFrame(v); if (p) obj.poster = p; } catch {}
      }
      if (!obj.title) obj.title = f0.name.replace(/\.[^.]+$/, '');
      onChange?.(); wrap.dispatchEvent(new CustomEvent('redraw-item', { bubbles: true }));
    };
    draw(); wrap.append(row);
  } else if (t === 'gallery') {
    if (!Array.isArray(obj[key])) obj[key] = [];
    const arr = obj[key];
    const g = document.createElement('div'); g.className = 'gallery';
    const draw = () => {
      g.innerHTML = '';
      arr.forEach((im, i) => {
        const it = document.createElement('div'); it.className = 'g-item';
        it.innerHTML = `<div class="thumb"><img src="${esc(imgUrl(im.src))}" alt="" loading="lazy">
          <div class="g-tools"><button type="button" title="تقديم">→</button><button type="button" title="تأخير">←</button><button type="button" class="cr" title="قص وتعديل المقاس">✂</button><button type="button" class="del" title="حذف">✕</button></div></div>
          <input type="text" placeholder="وصف الصورة (اختياري)" value="${esc(im.caption || '')}">`;
        const [prev, next, cr, del] = it.querySelectorAll('button');
        cr.onclick = async () => { const u = await recrop(im.src, { aspect: f.aspect ?? NaN }); if (u) { im.src = u; markDirty(); draw(); onChange?.(); } };
        prev.onclick = () => { if (i > 0) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; markDirty(); draw(); onChange?.(); } };
        next.onclick = () => { if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; markDirty(); draw(); onChange?.(); } };
        del.onclick = () => { if (confirm('حذف هذه الصورة؟')) { arr.splice(i, 1); markDirty(); draw(); onChange?.(); } };
        it.querySelector('input').oninput = (e) => { im.caption = e.target.value; markDirty(); };
        g.append(it);
      });
      const add = document.createElement('div'); add.className = 'g-add';
      add.innerHTML = '＋ إضافة صور<br><small style="font-weight:400;color:#7a7468">يمكنك اختيار عدة صور أو سحبها هنا</small>';
      const addFiles = async (files) => { const us = await upload(files, { aspect: f.aspect ?? NaN, title: f.label }); us.forEach(u => arr.push({ src: u, caption: '' })); if (us.length) { markDirty(); draw(); onChange?.(); } };
      add.onclick = async () => addFiles(await pickFiles(true));
      dropZone(add, addFiles);
      g.append(add);
    };
    draw(); wrap.append(g);
  } else if (t === 'list') {
    if (!Array.isArray(obj[key])) obj[key] = [];
    if (f.hint) wrap.querySelector('label')?.insertAdjacentHTML('beforeend', ` <small>— ${esc(f.hint)}</small>`);
    wrap.append(listEl(f, obj[key], onChange, obj));
  }
  return wrap;
}

// ---------- زر الوصف التلقائي ----------
const parentOf = new WeakMap(); // المنتج ← القسم الذي يحتويه
function aiButton(item, textarea, wrap) {
  const box = document.createElement('div'); box.className = 'ai-row';
  box.innerHTML = `<button type="button" class="btn ai sm">✨ وصف تلقائي</button>
    <span class="ai-hint">يتعرّف على المنتج من صوره ويكتب الوصف والمواصفات</span>`;
  const btn = box.querySelector('button');
  btn.onclick = async () => {
    const imgs = (item.images || []).map(m => m.src).filter(Boolean);
    if (!imgs.length) return toast('أضف صور المنتج أولاً', 'bad');
    if (textarea.value.trim() && !confirm('سيتم استبدال الوصف الحالي بوصف جديد. متابعة؟')) return;
    btn.disabled = true; btn.innerHTML = '<span class="spin"></span> جاري التعرف على المنتج...';
    try {
      const r = await api('ai/describe', 'POST', { images: imgs, name: item.name || '', category: parentOf.get(item)?.title || '' });
      item.description = r.description || ''; textarea.value = item.description;
      const filled = ['الوصف'];
      if (!item.name && r.name) { item.name = r.name; filled.push('الاسم'); }
      if (!(item.specs || []).length && r.specs?.length) { item.specs = r.specs.map(s => ({ id: uid(), ...s })); filled.push('المواصفات'); }
      if (!(item.colors || []).length && r.colors?.length > 1) { item.colors = r.colors.map(c => ({ id: uid(), name: c.name, hex: /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : '#c8b28a', image: '' })); filled.push('الألوان'); }
      markDirty();
      wrap.dispatchEvent(new CustomEvent('redraw-item', { bubbles: true }));
      toast(`✓ تمت كتابة: ${filled.join('، ')} — راجعها ثم اضغط حفظ`, 'ok');
    } catch (e) {
      toast(e.message, 'bad');
    } finally { btn.disabled = false; btn.innerHTML = '✨ وصف تلقائي'; }
  };
  return box;
}

function listEl(f, arr, onChange, parent) {
  const box = document.createElement('div');
  const openSet = new Set();
  // إعادة رسم العنصر بعد التعبئة التلقائية (يبقى مفتوحاً)
  box.addEventListener('redraw-item', (e) => { if (e.target.closest('.list-item')?.parentElement === box) { e.stopPropagation(); draw(); onChange?.(); } });
  const draw = () => {
    box.innerHTML = '';
    arr.forEach((item, i) => {
      if (parent) parentOf.set(item, parent);
      const li = document.createElement('div'); li.className = 'list-item' + (openSet.has(item) ? ' open' : '');
      const th = f.thumb?.(item);
      li.innerHTML = `<div class="li-head"><span class="li-num">${i + 1}</span>
        ${f.thumb ? (th ? `<img class="li-thumb" src="${esc(imgUrl(th))}" alt="">` : '<span class="li-thumb"></span>') : ''}
        <span class="li-title"></span><span class="li-count"></span>
        <div class="li-tools"><button type="button" title="تحريك للأعلى">▲</button><button type="button" title="تحريك للأسفل">▼</button><button type="button" class="del" title="حذف">🗑</button></div>
        <span class="li-arrow">▾</span></div><div class="li-body"></div>`;
      const title = li.querySelector('.li-title');
      const setTitle = () => {
        title.textContent = item[f.titleKey] || `${f.itemName} بدون اسم`;
        if (f.count) li.querySelector('.li-count').textContent = f.count(item) || '';
      };
      setTitle();
      const changed = () => { markDirty(); draw(); onChange?.(); };
      const [up, down, del] = li.querySelectorAll('.li-tools button');
      up.onclick = (e) => { e.stopPropagation(); if (i > 0) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; changed(); } };
      down.onclick = (e) => { e.stopPropagation(); if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; changed(); } };
      del.onclick = (e) => { e.stopPropagation(); if (confirm(`حذف «${item[f.titleKey] || f.itemName}»؟`)) { arr.splice(i, 1); changed(); } };
      li.querySelector('.li-head').onclick = (e) => { if (e.target.closest('.li-head') !== e.currentTarget) return; li.classList.toggle('open'); openSet.has(item) ? openSet.delete(item) : openSet.add(item); };
      const body = li.querySelector('.li-body');
      for (const sf of f.fields) body.append(fieldEl(sf, item, sf.k, () => {
        setTitle();
        if (f.thumb) { const t2 = f.thumb(item); const old = li.querySelector(':scope > .li-head > .li-thumb'); if (t2 && old) { const im = document.createElement('img'); im.className = 'li-thumb'; im.src = imgUrl(t2); old.replaceWith(im); } }
        onChange?.();
      }));
      box.append(li);
    });
    const add = document.createElement('button'); add.type = 'button'; add.className = 'btn add-btn';
    add.textContent = `＋ إضافة ${f.itemName}`;
    add.onclick = () => {
      const it = { id: uid() };
      f.fields.forEach(sf => it[sf.k] = ['gallery', 'list'].includes(sf.t) ? [] : sf.t === 'toggle' ? !!sf.def : (sf.def ?? ''));
      arr.push(it); openSet.add(it); markDirty(); draw(); onChange?.();
      const last = [...box.children].filter(c => c.classList.contains('list-item')).pop();
      last?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      last?.querySelector('input[type=text]')?.focus();
    };
    box.append(add);
  };
  draw();
  return box;
}

// ---------- الإعدادات ----------
function renderSettings(root) {
  data.sections ??= {};
  const p1 = document.createElement('div'); p1.className = 'panel';
  p1.innerHTML = '<h3>الأقسام الظاهرة في الموقع</h3><p class="hint">أخفِ أي قسم مؤقتاً بدون حذف محتواه</p>';
  const names = { about: 'من نحن', categories: 'الأقسام والمنتجات', 'custom-intro': 'تفصيل حسب الطلب', installments: 'التقسيط (تابي وتمارا)', reels: 'الريلز', reviews: 'آراء العملاء', projects: 'المشاريع', clients: 'العملاء', branches: 'الفروع', contact: 'التواصل' };
  for (const [k, n] of Object.entries(names)) {
    const row = document.createElement('label'); row.className = 'toggle';
    row.innerHTML = `<span>${n}</span><span class="switch"><input type="checkbox" ${data.sections[k] !== false ? 'checked' : ''}><span></span></span>`;
    row.querySelector('input').onchange = (e) => { data.sections[k] = e.target.checked; markDirty(); };
    p1.append(row);
  }
  const p2 = document.createElement('div'); p2.className = 'panel';
  p2.innerHTML = `<h3>تغيير كلمة المرور الخاصة بك</h3><p class="hint">أنت داخل باسم <b dir="ltr">${esc(me.username)}</b></p>
    <div class="grid2"><div class="field"><label>كلمة المرور الحالية</label><input type="password" id="pwCur"></div>
    <div class="field"><label>كلمة المرور الجديدة <small>— 4 أحرف على الأقل</small></label><input type="password" id="pwNew"></div></div>
    <button class="btn gold" id="pwBtn" type="button">تغيير كلمة المرور</button>`;
  p2.querySelector('#pwBtn').onclick = async () => {
    const r = await fetch('../api/password', { method: 'POST', body: JSON.stringify({ current: $('pwCur').value, next: $('pwNew').value }) });
    const j = await r.json();
    if (r.ok) { toast('تم تغيير كلمة المرور ✓', 'ok'); $('pwCur').value = $('pwNew').value = ''; } else toast(j.error, 'bad');
  };
  if (me.role === 'admin') {
    const pa = document.createElement('div'); pa.className = 'panel';
    pa.innerHTML = `<h3>✨ الوصف التلقائي بالذكاء الاصطناعي</h3>
      <p class="hint">زر «وصف تلقائي» في المنتجات يستخدم Claude للتعرف على المنتج من صوره. يحتاج مفتاح Claude API من
      <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noopener">platform.claude.com</a> (الاستخدام مدفوع حسب عدد الطلبات).</p>
      <div class="field"><label>الحالة: <b id="aiState">…</b></label></div>
      <div class="field"><label>مفتاح Claude API <small>— يُحفظ في الخادم فقط ولا يظهر مرة أخرى</small></label>
        <input type="password" id="aiKey" class="ltr" placeholder="sk-ant-..." autocomplete="off"></div>
      <button class="btn gold" id="aiSave" type="button">حفظ المفتاح</button>
      <button class="btn danger" id="aiDel" type="button">حذف المفتاح</button>`;
    const state = async () => { try { const s = await api('ai/status'); pa.querySelector('#aiState').textContent = s.configured ? '✓ مفعّل' : 'غير مفعّل'; } catch {} };
    pa.querySelector('#aiSave').onclick = async () => {
      try { await api('ai/key', 'POST', { apiKey: pa.querySelector('#aiKey').value.trim() }); pa.querySelector('#aiKey').value = ''; toast('تم حفظ المفتاح ✓', 'ok'); state(); } catch (e) { toast(e.message, 'bad'); }
    };
    pa.querySelector('#aiDel').onclick = async () => {
      if (!confirm('حذف مفتاح Claude API؟ سيتوقف زر الوصف التلقائي.')) return;
      try { await api('ai/key', 'POST', { apiKey: '' }); toast('تم حذف المفتاح', 'ok'); state(); } catch (e) { toast(e.message, 'bad'); }
    };
    state(); root.append(pa);
  }
  const p3 = document.createElement('div'); p3.className = 'panel';
  p3.innerHTML = `<h3>نسخة احتياطية</h3><p class="hint">نزّل نسخة من كل النصوص، أو استرجع نسخة سابقة. (الصور محفوظة في مجلد uploads)</p>
    <button class="btn light" id="bkDown" type="button">⬇ تنزيل نسخة احتياطية</button>
    <button class="btn light" id="bkUp" type="button">⬆ استرجاع نسخة</button>`;
  p3.querySelector('#bkDown').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `profile-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  p3.querySelector('#bkUp').onclick = () => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = '.json';
    i.onchange = async () => {
      try { const d = JSON.parse(await i.files[0].text()); if (!d.company) throw 0; data = d; markDirty(); toast('تم الاسترجاع — اضغط حفظ لتثبيته', 'ok'); showTab(current); }
      catch { toast('الملف غير صالح', 'bad'); }
    };
    i.click();
  };
  if (window.GH_ADMIN) p2.innerHTML = `<h3>الدخول للوحة الأونلاين</h3><p class="hint">أنت داخل بحساب GitHub <b dir="ltr">${esc(me.username)}</b>. المفتاح محفوظ في هذا الجهاز فقط — «تسجيل الخروج» يمسحه منه.</p>`;
  root.append(p1, p2, p3);
}

// ---------- عرض الصفحات ----------
function showTab(key) {
  current = key;
  const tab = TABS.find(t => t.key === key);
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.k === key));
  $('tabTitle').textContent = tab.title; $('tabHint').textContent = tab.hint || '';
  const root = $('content'); root.innerHTML = '';
  if (tab.custom) tab.custom(root);
  else for (const p of tab.panels) {
    const panel = document.createElement('div'); panel.className = 'panel';
    if (p.title) panel.innerHTML = `<h3>${esc(p.title)}</h3>${p.hint ? `<p class="hint">${esc(p.hint)}</p>` : '<div style="height:14px"></div>'}`;
    const holder = p.grid ? Object.assign(document.createElement('div'), { className: 'grid2' }) : panel;
    for (const f of p.fields) {
      const parts = f.p.split('.'); const k = parts.pop();
      const parent = parts.length ? (getP(data, parts.join('.')) ?? (setP(data, parts.join('.'), {}), getP(data, parts.join('.')))) : data;
      holder.append(fieldEl(f, parent, k));
    }
    if (p.grid) panel.append(holder);
    root.append(panel);
  }
  $('side').classList.remove('open');
  scrollTo({ top: 0 });
  try { localStorage.setItem('dh_tab', key); } catch {}
}

async function save() {
  const b = $('saveBtn'); b.disabled = true; b.textContent = 'جاري الحفظ...';
  try {
    const r = await fetch('../api/content', { method: 'PUT', body: JSON.stringify(data), headers: contentVersion ? { 'X-Base-Version': contentVersion } : {} });
    if (r.status === 409) { const j = await r.json(); b.disabled = false; b.textContent = 'حفظ التغييرات'; alert(j.error); return; }
    if (r.status === 401) { toast('انتهت الجلسة — سجّل الدخول مرة أخرى', 'bad'); setTimeout(() => location.reload(), 1500); return; }
    if (!r.ok) throw new Error((await r.json()).error);
    try { const j = await r.clone().json(); if (j.version) contentVersion = j.version; } catch {}
    dirty = false; $('dirty').hidden = true; toast(window.GH_ADMIN ? 'تم الحفظ ✓ — يظهر للعملاء خلال دقيقة إلى دقيقتين' : 'تم الحفظ ✓ — اضغط «نشر على الموقع» عشان تظهر للعملاء', 'ok');
  } catch (e) { toast('تعذّر الحفظ: ' + e.message, 'bad'); }
  finally { b.disabled = false; b.textContent = 'حفظ التغييرات'; }
}

async function start(user) {
  me = user;
  const resp = await fetch('../api/content', { cache: 'no-store' }); contentVersion = resp.headers.get('X-Version') || '';
  data = await resp.json();
  $('meBox').innerHTML = `<span class="av">${esc((me.name || me.username).trim()[0] || '?')}</span><div><b>${esc(me.name)}</b><small>${ROLE[me.role]}</small></div>`;
  const tabs = TABS.filter(t => (!t.adminOnly || me.role === 'admin') && !(window.GH_ADMIN && t.key === 'customReqs'));
  TABS.splice(0, TABS.length, ...tabs);
  $('tabs').innerHTML = TABS.map(t => `<button class="tab" data-k="${t.key}"><span class="ic">${t.icon}</span>${t.title}</button>`).join('');
  $('tabs').onclick = (e) => { const b = e.target.closest('.tab'); if (b) showTab(b.dataset.k); };
  let last = 'company'; try { last = localStorage.getItem('dh_tab') || last; } catch {}
  showTab(TABS.some(t => t.key === last) ? last : 'company');
  $('login').hidden = true; $('app').hidden = false;
}

// ---------- النشر على الموقع العام ----------
async function publish() {
  const b = $('pubBtn');
  if (dirty) { if (!confirm('عندك تغييرات غير محفوظة — أحفظها وأنشر؟')) return; await save(); if (dirty) return; }
  b.disabled = true; b.textContent = '⏳ جاري النشر...';
  try {
    let r = await fetch('../api/publish', { method: 'POST' });
    let j = await r.json();
    if (!r.ok && r.status !== 409) throw new Error(j.error);
    while (true) {
      await new Promise(ok => setTimeout(ok, 2500));
      j = await (await fetch('../api/publish', { cache: 'no-store' })).json();
      if (!j.running) break;
      b.textContent = '⏳ ' + (j.step || 'جاري النشر') + '...';
    }
    toast((j.ok ? '✓ ' : '') + j.message, j.ok ? 'ok' : 'bad');
  } catch (e) { toast('تعذّر النشر: ' + e.message, 'bad'); }
  finally { b.disabled = false; b.textContent = '🌐 نشر على الموقع'; }
}

// ---------- الأحداث ----------
$('saveBtn').onclick = save;
$('pubBtn').onclick = publish;
if (window.GH_ADMIN) $('pubBtn').hidden = true;
$('menuBtn').onclick = () => $('side').classList.toggle('open');
addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); } });
addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
$('logout').onclick = async () => {
  if (dirty && !confirm('عندك تغييرات غير محفوظة، تبي تطلع؟')) return;
  dirty = false; await fetch('../api/logout', { method: 'POST' }); location.reload();
};
$('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const r = await fetch('../api/login', { method: 'POST', body: JSON.stringify({ username: $('un').value, password: $('pw').value }) });
  const j = await r.json().catch(() => ({}));
  if (r.ok) start(j.user); else $('loginErr').textContent = j.error || 'تعذّر الدخول';
};

fetch('../api/me').then(r => r.json()).then(j => j.authed ? start(j.user) : ($('login').hidden = false));
