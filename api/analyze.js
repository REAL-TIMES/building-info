module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'POST만 허용' }); return; }

  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY 미설정 — Vercel 환경변수를 확인하세요' });

  const { address, zoning, usage, platArea, totalArea, floors, useAprDay, price } = req.body || {};

  const prompt = `당신은 서울·수도권 고급 부동산 전문 중개인입니다.
아래 건물 정보를 바탕으로 투자자에게 제시할 입지 분석 보고서를 작성해주세요.

【건물 정보】
- 주소: ${address || '미확인'}
- 용도지역: ${zoning || '미확인'}
- 주용도: ${usage || '미확인'}
- 대지면적: ${platArea ? platArea+'㎡' : '미확인'}
- 연면적: ${totalArea ? totalArea+'㎡' : '미확인'}
- 층수: ${floors || '미확인'}
- 사용승인: ${useAprDay || '미확인'}
- 매매가: ${price ? price+'억원' : '미확인'}

각 항목을 전문 중개인 시각으로 구체적이고 실용적으로 2~3문장 작성하세요.
반드시 아래 JSON 형식만 반환하고 다른 텍스트는 포함하지 마세요:
{"traffic":"교통 분석 내용","commercial":"상권 분석 내용","population":"유동인구 분석 내용","development":"개발호재 분석 내용"}`;

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return res.status(500).json({ error: 'Claude API 오류', detail: errText.slice(0, 300) });
    }

    const data = await aiRes.json();
    const text = (data.content?.[0]?.text || '').trim();

    // JSON 추출
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'AI 응답 파싱 실패', raw: text.slice(0, 300) });

    const result = JSON.parse(match[0]);
    return res.status(200).json(result);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
