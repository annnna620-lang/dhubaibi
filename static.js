// نسخة العرض الثابتة (GitHub Pages)
window.STATIC_SITE = true;
(function () {
  const realFetch = window.fetch.bind(window);
  const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
  let lastNo = '';
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    const m = /(?:^|\/)api\/(.+?)(?:\?.*)?$/.exec(url);
    if (!m) return realFetch(input, init);
    const ep = m[1];
    if (ep === 'content') return realFetch('content.json', { cache: 'no-store' });
    if (ep === 'custom/upload') return json({ url: URL.createObjectURL(init.body) });
    if (ep === 'custom/analyze') return json({ error: 'off', message: 'تحديد نوع القطعة والمقاسات من الصورة يتفعّل في النسخة الكاملة — حدد المقاسات من الخطوة 3.' }, 400);
    if (ep === 'custom/request') { lastNo = 'DH-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(16).slice(2, 6).toUpperCase(); return json({ id: 'local', no: lastNo }); }
    if (ep.startsWith('custom/sheet/')) {
      const a = document.createElement('a'); a.href = URL.createObjectURL(init.body); a.download = 'مخطط-' + lastNo + '.png'; document.body.append(a); a.click(); a.remove();
      return json({ ok: true });
    }
    return json({ error: 'غير متاح في نسخة العرض' }, 404);
  };
})();
