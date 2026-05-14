// Google Gemini API — https 모듈 사용 (Node.js fetch 의존성 없음)
// API 키: aistudio.google.com (무료)
// Vercel 환경변수: GEMINI_API_KEY

const https = require('https');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u    = new URL(url);
    const opts = {
      hostname: u.hostname,
      path:     u.pathname + u.search,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = https.request(opts, res => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: buf }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(data);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'POST만 허용' }); return; }

  const KEY = process.env.GEMINI_API_KEY;
  if (!KEY) return res.status(500).json({
    error: 'GEMINI_API_KEY 미설정',
    guide: 'Vercel → Settings → Environment Variables 에서 GEMINI_API_KEY 추가'
  });

  const { address, zoning, usage, platArea, totalArea, floors, useAprDay, price } = req.body || {};

  const prompt =
`당신은 서울·수도권 고급 부동산 전문 중개인입니다.
아래 건물 정보를 바탕으로 투자자에게 제시할 입지 분석 보고서를 작성해주세요.

【건물 정보】
- 주소: ${address || '미확인'}
- 용도지역: ${zoning || '미확인'}
- 주용도: ${usage || '미확인'}
- 대지면적: ${platArea ? platArea + '㎡' : '미확인'}
- 연면적: ${totalArea ? totalArea + '㎡' : '미확인'}
- 층수: ${floors || '미확인'}
- 사용승인: ${useAprDay || '미확인'}
- 매매가: ${price ? price + '억원' : '미확인'}

각 항목을 전문 중개인 시각으로 구체적이고 실용적으로 2~3문장 작성하세요.
반드시 아래 JSON 형식만 반환하고 다른 텍스트는 절대 포함하지 마세요:
{"traffic":"교통 분석","commercial":"상권 분석","population":"유동인구 분석","development":"개발호재 분석"}`;

  const url  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + KEY;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
  };

  try {
    const r = await post(url, body);
    if (r.status !== 200) {
      return res.status(500).json({ error: 'Gemini API 오류 (HTTP ' + r.status + ')', detail: r.body.slice(0, 300) });
    }
    const data  = JSON.parse(r.body);
    const text  = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'AI 응답 파싱 실패', raw: text.slice(0, 300) });
    return res.status(200).json(JSON.parse(match[0]));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
