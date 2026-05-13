const https = require('https');
const http  = require('http');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { sigunguCd, bjdongCd, bun, ji } = req.query;
  if (!sigunguCd || !bjdongCd || !bun || !ji) {
    return res.status(400).json({ error: '파라미터 누락' });
  }

  const KEY = process.env.BUILDING_API_KEY;
  if (!KEY) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다 (BUILDING_API_KEY)' });
  }

  const apiUrl =
    'https://apis.data.go.kr/1613000/BldRgstHubService/getBrBasisOulnInfo' +
    '?serviceKey='  + KEY +
    '&sigunguCd='   + encodeURIComponent(sigunguCd) +
    '&bjdongCd='    + encodeURIComponent(bjdongCd) +
    '&bun='         + encodeURIComponent(bun) +
    '&ji='          + encodeURIComponent(ji) +
    '&_type=json&numOfRows=20&pageNo=1';

  function doRequest(url, redirectCount) {
    if (redirectCount > 3) {
      return res.status(500).json({ error: '리다이렉트 횟수 초과' });
    }

    const lib = url.startsWith('https') ? https : http;
    const apiReq = lib.get(url, { headers: { 'Accept': 'application/json' } }, (apiRes) => {

      if ((apiRes.statusCode === 301 || apiRes.statusCode === 302) && apiRes.headers.location) {
        apiRes.resume();
        return doRequest(apiRes.headers.location, redirectCount + 1);
      }

      let body = '';
      apiRes.on('data', chunk => { body += chunk; });
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(body);
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.status(200).json(json);
        } catch (e) {
          return res.status(500).json({
            error: 'API 응답이 JSON 형식이 아닙니다',
            statusCode: apiRes.statusCode,
            preview: body.slice(0, 300)
          });
        }
      });
    });

    apiReq.on('error', e => {
      res.status(500).json({ error: e.message });
    });

    apiReq.setTimeout(9000, () => {
      apiReq.destroy();
      res.status(504).json({ error: '요청 시간 초과 (9초)' });
    });
  }

  doRequest(apiUrl, 0);
};
