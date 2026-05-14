// Google Gemini API 연동 — 무료 티어 사용
// API 키 발급: https://aistudio.google.com/app/apikey (무료, 신용카드 불필요)
// Vercel 환경변수: GEMINI_API_KEY

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'POST만 허용' }); return; }

  const KEY = process.env.GEMINI_API_KEY;
  if (!KEY) return res.status(500).json({
    error: 'GEMINI_API_KEY 미설정',
    guide: 'aistudio.google.com에서 무료 API 키 발급 후 Vercel 환경변수에 추가하세요'
  });

  const { address, zoning, usage, platArea, totalArea, floors, useAprDay, price } = req.body || {};

  const prompt = `당신은 서울·수도권 고급 부동산 전문 중개인입니다.
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

  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + KEY;

    const aiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return res.status(500).json({ error: 'Gemini API 오류', detail: errText.slice(0, 300) });
    }

    const data   = await aiRes.json();
    const text   = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match  = text.match(/\{[\s\S]*\}/);

    if (!match) return res.status(500).json({ error: 'AI 응답 파싱 실패', raw: text.slice(0, 300) });

    const result = JSON.parse(match[0]);
    return res.status(200).json(result);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
