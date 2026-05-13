const https = require('https');
const http  = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;

    function doReq(u, redirects) {
      if (redirects > 3) return reject(new Error('Too many redirects'));
      const req = lib.get(u, { headers: { Accept: 'application/json' } }, res => {
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
          res.resume();
          return doReq(res.headers.location, redirects + 1);
        }
        let body = '';
        res.on('data', c => { body += c; });
        res.on('end', () => resolve(body));
        res.on('error', reject);
      });
      req.on('error', reject);
      req.setTimeout(9000, () => { req.destroy(); reject(new Error('timeout')); });
    }

    doReq(url, 0);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { sigunguCd, bjdongCd, bun, ji } = req.query;
  if (!sigunguCd || !bjdongCd || !bun || !ji) {
    return res.status(400).json({ error: '파라미터 누락' });
  }

  const KEY = process.env.BUILDING_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'BUILDING_API_KEY 미설정' });

  const BASE = 'https://apis.data.go.kr/1613000/BldRgstHubService/';
  const QS   = '?serviceKey=' + KEY +
    '&sigunguCd='  + encodeURIComponent(sigunguCd) +
    '&bjdongCd='   + encodeURIComponent(bjdongCd) +
    '&bun='        + encodeURIComponent(bun) +
    '&ji='         + encodeURIComponent(ji) +
    '&_type=json&numOfRows=20&pageNo=1';

  try {
    const [titleResult, jijiguResult] = await Promise.allSettled([
      fetchUrl(BASE + 'getBrTitleInfo' + QS),
      fetchUrl(BASE + 'getBrJijiguInfo' + QS)
    ]);

    if (titleResult.status !== 'fulfilled' || !titleResult.value) {
      return res.status(500).json({ error: '건축물대장 조회 실패' });
    }

    let titleData;
    try {
      titleData = JSON.parse(titleResult.value);
    } catch (e) {
      return res.status(500).json({ error: 'JSON 파싱 오류', preview: (titleResult.value || '').slice(0, 300) });
    }

    let jiyukCdNm = null;
    if (jijiguResult.status === 'fulfilled' && jijiguResult.value) {
      try {
        const jd = JSON.parse(jijiguResult.value);
        const raw = jd && jd.response && jd.response.body && jd.response.body.items && jd.response.body.items.item;
        if (raw) {
          const items = Array.isArray(raw) ? raw : [raw];
          const yg = items.find(it => it.jiyukCdNm && it.jiyukCdNm.trim()) || null;
          if (yg) jiyukCdNm = yg.jiyukCdNm.trim();
        }
      } catch (e) { /* 무시 */ }
    }

    if (jiyukCdNm) {
      const body = titleData && titleData.response && titleData.response.body;
      if (body && body.items && body.items.item) {
        const items = Array.isArray(body.items.item) ? body.items.item : [body.items.item];
        items.forEach(it => { it.jiyukCdNm = jiyukCdNm; });
        body.items.item = items.length === 1 ? items[0] : items;
      }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(titleData);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
