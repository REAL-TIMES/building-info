const https = require('https');
const http  = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    function doReq(u, redirects) {
      if (redirects > 3) return reject(new Error('Too many redirects'));
      const req = lib.get(u, { headers: { Accept: 'application/json' } }, res => {
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
          res.resume(); return doReq(res.headers.location, redirects + 1);
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

function parseItems(raw) {
  if (!raw) return [];
  const items = Array.isArray(raw) ? raw : [raw];
  return items;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { sigunguCd, bjdongCd, bun, ji } = req.query;
  if (!sigunguCd || !bjdongCd || !bun || !ji)
    return res.status(400).json({ error: '파라미터 누락' });

  const KEY = process.env.BUILDING_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'BUILDING_API_KEY 미설정' });

  const BASE = 'https://apis.data.go.kr/1613000/BldRgstHubService/';
  const QS   = '?serviceKey=' + KEY +
    '&sigunguCd=' + encodeURIComponent(sigunguCd) +
    '&bjdongCd='  + encodeURIComponent(bjdongCd) +
    '&bun='       + encodeURIComponent(bun) +
    '&ji='        + encodeURIComponent(ji) +
    '&_type=json&numOfRows=20&pageNo=1';

  try {
    // ① 표제부 ② 지역지구 ③ 기본개요(대지면적 보완용) — 3개 병렬 호출
    const [titleRes, jijiguRes, basisRes] = await Promise.allSettled([
      fetchUrl(BASE + 'getBrTitleInfo'    + QS),
      fetchUrl(BASE + 'getBrJijiguInfo'   + QS),
      fetchUrl(BASE + 'getBrBasisOulnInfo'+ QS),
    ]);

    // 표제부 파싱
    if (titleRes.status !== 'fulfilled' || !titleRes.value)
      return res.status(500).json({ error: '건축물대장 조회 실패' });

    let titleData;
    try { titleData = JSON.parse(titleRes.value); }
    catch (e) { return res.status(500).json({ error: 'JSON 파싱 오류', preview: (titleRes.value||'').slice(0,300) }); }

    const body = titleData?.response?.body;
    if (!body) return res.status(500).json({ error: '응답 구조 오류' });

    const titleItems = parseItems(body?.items?.item);

    // ── 용도지역 추출 ──
    let jiyukCdNm = null;
    if (jijiguRes.status === 'fulfilled' && jijiguRes.value) {
      try {
        const jd = JSON.parse(jijiguRes.value);
        const raw = jd?.response?.body?.items?.item;
        if (raw) {
          const yg = parseItems(raw).find(it => it.jiyukCdNm?.trim());
          if (yg) jiyukCdNm = yg.jiyukCdNm.trim();
        }
      } catch (e) { /* 무시 */ }
    }

    // ── 기본개요에서 보완 필드 추출 ──
    // getBrBasisOulnInfo는 getBrTitleInfo보다 오래된 건물도 platArea, bcRat, vlRat 포함
    let basisSupp = {};  // 보완 데이터
    if (basisRes.status === 'fulfilled' && basisRes.value) {
      try {
        const bd = JSON.parse(basisRes.value);
        const raw = bd?.response?.body?.items?.item;
        if (raw) {
          const bItems = parseItems(raw);
          const main = bItems.find(i => i.mainAtchGbCd === '0') || bItems[0];
          if (main) {
            // 없는 필드만 보완
            const FILL = ['platArea','bcRat','vlRat','hhldCnt','grndFlrCnt','ugrndFlrCnt','useAprDay'];
            FILL.forEach(f => {
              if (main[f] && parseFloat(main[f]) > 0) basisSupp[f] = main[f];
            });
          }
        }
      } catch (e) { /* 무시 */ }
    }

    // ── 표제부 아이템에 보완 데이터 + 용도지역 주입 ──
    if (titleItems.length > 0) {
      titleItems.forEach(it => {
        // 기본개요에서 보완 (표제부에 값이 없을 때만)
        Object.entries(basisSupp).forEach(([k, v]) => {
          if (!it[k] || parseFloat(it[k]) <= 0) it[k] = v;
        });
        // 용도지역
        if (jiyukCdNm) it.jiyukCdNm = jiyukCdNm;
      });
      body.items.item = titleItems.length === 1 ? titleItems[0] : titleItems;
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(titleData);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
