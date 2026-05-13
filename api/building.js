/**
 * Vercel Serverless Function — 건축물대장 API 프록시
 * 브라우저 CORS를 우회: Vercel 서버 → apis.data.go.kr (서버 간 통신)
 * API 키는 Vercel 대시보드 > Settings > Environment Variables 에 등록:
 *   BUILDING_API_KEY = (공공데이터포털 디코딩 키)
 */
const https = require('https');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const { sigunguCd, bjdongCd, bun, ji } = req.query;
  if (!sigunguCd || !bjdongCd || !bun || !ji) {
    res.status(400).json({ error: '파라미터 누락 (sigunguCd, bjdongCd, bun, ji 필요)' });
    return;
  }

  const KEY = process.env.BUILDING_API_KEY;
  if (!KEY) {
    res.status(500).json({ error: 'BUILDING_API_KEY 환경변수가 설정되지 않았습니다.' });
    return;
  }

  const apiUrl =
    'https://apis.data.go.kr/1613000/BldRgstHubService/getBrBasisOulnInfo' +
    '?serviceKey='  + KEY +
    '&sigunguCd='   + encodeURIComponent(sigunguCd) +
    '&bjdongCd='    + encodeURIComponent(bjdongCd) +
    '&bun='         + encodeURIComponent(bun) +
    '&ji='          + encodeURIComponent(ji) +
    '&_type=json&numOfRows=20&pageNo=1';

  const apiReq = https.get(apiUrl, (apiRes) => {
    let body = '';
    apiRes.on('data', chunk => { body += chunk; });
    apiRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(200).send(body);
    });
  });

  apiReq.on('error', (e) => {
    res.status(500).json({ error: e.message });
  });
};
