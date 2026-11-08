// لوحة التحكم الأونلاين على GitHub Pages: كل حفظ ورفع يصير «تعديل» مباشر في مستودع الموقع عبر GitHub API
// يُحمَّل قبل admin.js ويعترض طلبات ../api/* فيحوّلها إلى GitHub — بدون أي سيرفر
window.GH_ADMIN = true;
window.GH_BLOBS = {};
(function () {
  const CFG = window.GH_CONFIG || {};
  const OWNER = CFG.owner, REPO = CFG.repo, BR = CFG.branch || 'main';
  const API = CFG.api || 'https://api.github.com';
  const TK = 'dh_gh_token';
  const W = [320, 480, 640, 960, 1280];
  const realFetch = window.fetch.bind(window);
  let token = ''; try { token = localStorage.getItem(TK) || ''; } catch {}
  let who = null;

  const json = (o, s = 200, h = {}) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json', ...h } });
  const fail = (msg, s = 400) => json({ error: msg }, s);

  async function gh(path, opt = {}) {
    const r = await realFetch(API + path, {
      ...opt, cache: 'no-store',
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(opt.body ? { 'Content-Type': 'application/json' } : {}) }
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      const e = new Error(r.status === 401 ? 'المفتاح غير صحيح أو انتهت صلاحيته' : r.status === 403 || r.status === 404 ? 'المفتاح ما عنده صلاحية تعديل الموقع' : (j.message || 'خطأ من GitHub ' + r.status));
      e.status = r.status; throw e;
    }
    return r.status === 204 ? null : r.json();
  }
  const repo = (p) => `/repos/${OWNER}/${REPO}${p}`;

  // ---------- تحويلات Base64 ----------
  const blobB64 = (blob) => new Promise((ok, no) => { const f = new FileReader(); f.onload = () => ok(String(f.result).split(',')[1] || ''); f.onerror = no; f.readAsDataURL(blob); });
  const textB64 = (s) => blobB64(new Blob([s], { type: 'text/plain' }));
  const b64Text = (b) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, '')), c => c.charCodeAt(0)));

  // ---------- تعديل عدة ملفات في «حفظ» واحد (commit) — بالترتيب حتى ما تتصادم ----------
  let chain = Promise.resolve();
  function commitFiles(files, message) {
    const run = async () => {
      const blobs = [];
      for (const f of files) {
        const content = f.text != null ? await textB64(f.text) : await blobB64(f.blob);
        const b = await gh(repo('/git/blobs'), { method: 'POST', body: JSON.stringify({ content, encoding: 'base64' }) });
        blobs.push({ path: f.path, mode: '100644', type: 'blob', sha: b.sha });
      }
      for (let attempt = 0; ; attempt++) {
        const ref = await gh(repo(`/git/ref/heads/${BR}`));
        const head = await gh(repo(`/git/commits/${ref.object.sha}`));
        const tree = await gh(repo('/git/trees'), { method: 'POST', body: JSON.stringify({ base_tree: head.tree.sha, tree: blobs }) });
        const c = await gh(repo('/git/commits'), { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [ref.object.sha] }) });
        try { await gh(repo(`/git/refs/heads/${BR}`), { method: 'PATCH', body: JSON.stringify({ sha: c.sha }) }); }
        catch (e) { if (e.status === 422 && attempt < 3) continue; throw e; }   // تعديل ثاني سبقنا — نعيد على آخر نسخة
        return Object.fromEntries(blobs.map(b => [b.path, b.sha]));
      }
    };
    const p = chain.then(run, run); chain = p.catch(() => {}); return p;
  }

  // ---------- المحتوى ----------
  async function readContent() {
    const f = await gh(repo(`/contents/content.json?ref=${BR}`));
    let text = f.content ? b64Text(f.content) : '';
    if (!text) { const b = await gh(repo(`/git/blobs/${f.sha}`)); text = b64Text(b.content); }   // الملف أكبر من 1 ميجا
    return { text, sha: f.sha };
  }

  // ---------- الصور: نسخ مصغّرة جاهزة مثل نسخة العرض ----------
  async function thumbs(blob, base) {
    let bmp; try { bmp = await createImageBitmap(blob); } catch { return []; }
    const out = [];
    for (const w of W) {
      const k = Math.min(1, w / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(bmp, 0, 0, c.width, c.height);
      const tb = await new Promise(r => c.toBlob(r, 'image/webp', 0.78));
      if (tb) out.push({ path: `uploads/t/${base}-${w}.webp`, blob: tb });
    }
    bmp.close?.(); return out;
  }
  const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => b.toString(16).padStart(2, '0')).join('');
  async function uploadBlob(blob, origName) {
    const ext = ((/\.([a-z0-9]{2,5})$/i.exec(origName || '') || [])[1] || (blob.type.split('/')[1] || 'bin')).toLowerCase().replace('jpeg', 'jpg').replace('quicktime', 'mov');
    const isImg = /^(webp|jpg|png|gif)$/.test(ext), isVid = /^(mp4|webm|mov)$/.test(ext);
    if (!isImg && !isVid) throw new Error('نوع الملف غير مدعوم');
    if (blob.size > (isVid ? 45 : 12) * 1048576) throw new Error(isVid ? 'الفيديو أكبر من 45 ميجا — ارفعه على تيك توك وحط الرابط بدله' : 'الصورة كبيرة جداً');
    const base = (isVid ? 'reel-' : '') + newId(), path = `uploads/${base}.${ext}`;
    const files = [{ path, blob }];
    if (/^(webp|jpg|png)$/.test(ext)) files.push(...await thumbs(blob, base));
    await commitFiles(files, `رفع ${isVid ? 'فيديو' : 'صورة'} من اللوحة الأونلاين (${who?.login || ''})`);
    window.GH_BLOBS[path] = URL.createObjectURL(blob);   // تظهر في اللوحة فوراً قبل ما ينتهي النشر
    return path;
  }

  // ---------- الدخول ----------
  async function checkToken() {
    const r = await gh(repo(''));
    if (!r.permissions || !r.permissions.push) { const e = new Error('المفتاح ما عنده صلاحية تعديل الموقع'); e.status = 403; throw e; }
    try { who = await gh('/user'); } catch { who = { login: 'github' }; }
    return { username: who.login, name: who.name || who.login, role: 'editor' };
  }

  // ---------- قراءة الإحداثيات من رابط قوقل ماب (بدون سيرفر) ----------
  function coordsOf(s) {
    try { s = decodeURIComponent(s); } catch {}
    const m = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/.exec(s)
      || /[?&](?:q|ll|query|destination|center)=(-?\d+\.\d+),\s*\+?(-?\d+\.\d+)/.exec(s)
      || /@(-?\d+\.\d+),(-?\d+\.\d+)/.exec(s)
      || /^\s*(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)\s*$/.exec(s);
    return m && { lat: +(+m[1]).toFixed(6), lng: +(+m[2]).toFixed(6) };
  }

  // ---------- اعتراض طلبات اللوحة ----------
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    const m = /(?:^|\/)api\/(.+?)(?:\?.*)?$/.exec(url);
    if (!m || /^https?:/i.test(url)) return realFetch(input, init);   // روابط خارجية تمر عادي
    const ep = m[1], method = (init.method || 'GET').toUpperCase();
    const body = () => { try { return JSON.parse(init.body || '{}'); } catch { return {}; } };
    try {
      if (ep === 'me') {
        if (!token) return json({ authed: false });
        try { return json({ authed: true, user: await checkToken() }); }
        catch (e) { if (e.status === 401) { try { localStorage.removeItem(TK); } catch {} token = ''; } return json({ authed: false }); }
      }
      if (ep === 'login') {
        const t = String(body().password || '').trim();
        if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(t)) return fail('الصق مفتاح GitHub كامل — يبدأ بـ github_pat_', 401);
        token = t;
        try { const user = await checkToken(); try { localStorage.setItem(TK, t); } catch {} return json({ ok: true, user }); }
        catch (e) { token = ''; return fail(e.message, 401); }
      }
      if (ep === 'logout') { token = ''; try { localStorage.removeItem(TK); } catch {} return json({ ok: true }); }
      if (!token) return fail('يجب تسجيل الدخول', 401);

      if (ep === 'content' && method === 'GET') { const c = await readContent(); return new Response(c.text, { status: 200, headers: { 'Content-Type': 'application/json', 'X-Version': c.sha } }); }
      if (ep === 'content' && method === 'PUT') {
        const baseV = (init.headers && (init.headers['X-Base-Version'] || init.headers['x-base-version'])) || '';
        const now = await gh(repo(`/contents/content.json?ref=${BR}`));
        if (baseV && now.sha !== baseV) return fail('فيه تعديل أحدث انحفظ من جهاز ثاني — حدّث الصفحة (وانسخ تعديلك قبل) ثم احفظ من جديد', 409);
        const text = JSON.stringify(JSON.parse(init.body), null, 2);
        const shas = await commitFiles([{ path: 'content.json', text }], `تحديث المحتوى من اللوحة الأونلاين (${who?.login || ''})`);
        return json({ ok: true, version: shas['content.json'] });
      }
      if (ep === 'upload') {
        const h = init.headers || {};
        const name = decodeURIComponent(h['X-Filename'] || h['x-filename'] || 'image.webp');
        return json({ url: await uploadBlob(init.body, name) });
      }
      if (ep === 'tiktok') {
        const u = String(body().url || '').trim();
        const id = (/tiktok\.com\/.*\/video\/(\d{8,})/.exec(u) || [])[1];
        if (!id) return fail('انسخ رابط الفيديو الكامل من تيك توك (يكون فيه /video/ وبعده رقم). الروابط المختصرة vm.tiktok ما تنقرأ هنا — افتحها في المتصفح وانسخ الرابط الكامل');
        return json({ id, url: u.split('?')[0], title: '', author: '', poster: '' });   // الغلاف يجيبه GitHub تلقائياً بعد الحفظ
      }
      if (ep === 'resolve-map') {
        const c = coordsOf(String(body().url || ''));
        return c ? json(c) : fail('الرابط المختصر ما ينقرأ في اللوحة الأونلاين — افتح الموقع في قوقل ماب، اضغط مطولاً على الدبوس وانسخ الإحداثيات والصقها هنا');
      }
      if (ep === 'ai/status') return json({ configured: false });
      if (ep === 'ai/describe') return fail('الوصف التلقائي يشتغل في النسخة الكاملة (Hostinger) — اكتب الوصف يدوياً هنا');
      if (ep === 'publish') return json({ running: false, ok: true, message: 'اللوحة الأونلاين تنشر تلقائياً مع كل حفظ' });
      return fail('هذي الميزة غير متاحة في اللوحة الأونلاين', 404);
    } catch (e) { return fail(e.message || 'تعذّر الاتصال بـ GitHub', e.status === 401 ? 401 : 400); }
  };

  // ---------- رفع الفيديو مع شريط ----------
  window.GH = {
    async uploadVideo(file) {
      const ov = document.createElement('div'); ov.className = 'uploading';
      ov.innerHTML = '<div style="text-align:center;width:min(360px,90vw)">جاري رفع الفيديو إلى GitHub...<div class="bar"><i style="width:35%"></i></div><small>لا تقفل الصفحة</small></div>';
      document.body.append(ov);
      try { return await uploadBlob(file, file.name); }
      catch (e) { window.toast ? toast(e.message, 'bad') : alert(e.message); return null; }
      finally { ov.remove(); }
    }
  };

  // ---------- شاشة الدخول بالمفتاح ----------
  document.addEventListener('DOMContentLoaded', () => {
    const un = document.getElementById('un'), pw = document.getElementById('pw');
    if (!un || !pw) return;
    un.required = false; un.hidden = true;
    pw.placeholder = 'مفتاح GitHub (github_pat_...)'; pw.autocomplete = 'off'; pw.dir = 'ltr';
    const p = document.querySelector('#loginForm p');
    if (p) p.innerHTML = 'لوحة التحكم الأونلاين — الصق مفتاح GitHub مرة وحدة على هذا الجهاز';
  });
})();
