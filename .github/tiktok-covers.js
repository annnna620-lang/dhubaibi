// يشتغل على GitHub Actions بعد كل حفظ: يجيب غلاف كل فيديو تيك توك ما له غلاف، ويجهّز نسخه المصغّرة
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const W = [320, 480, 640, 960, 1280];
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36' };

async function cover(id) {
  for (let k = 0; k < 3; k++) {
    try {
      const html = await (await fetch('https://www.tiktok.com/embed/v2/' + id, { headers: UA })).text();
      let m = /"(?:originCover|cover)":"(https:[^"]+)"/.exec(html) || /"covers":\["(https:[^"]+)"/.exec(html);
      if (m) return JSON.parse('"' + m[1] + '"');
      m = /<video[^>]+poster="(https:[^"]+)"/.exec(html);
      if (m) return m[1].replace(/&amp;/g, '&');
    } catch {}
  }
  return '';
}

(async () => {
  const data = JSON.parse(fs.readFileSync('content.json', 'utf8'));
  fs.mkdirSync('uploads/t', { recursive: true });
  let made = 0;
  for (const r of data.reels || []) {
    const id = String(r.tiktokId || '');
    if (!/^\d+$/.test(id) || r.poster) continue;
    const file = path.join('uploads', `tt-${id}.webp`);
    if (fs.existsSync(file)) continue;
    const u = await cover(id);
    if (!u || !/tiktokcdn|tiktok|ibytedtos|byteimg/i.test(new URL(u).hostname)) { console.log('no cover', id); continue; }
    const buf = Buffer.from(await (await fetch(u, { headers: UA })).arrayBuffer());
    await sharp(buf).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 82 }).toFile(file);
    for (const w of W) await sharp(file).resize({ width: w, height: w, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join('uploads', 't', `tt-${id}-${w}.webp`));
    console.log('cover', id); made++;
  }
  console.log('done', made);
})();
