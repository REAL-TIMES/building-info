// api/db.js  — Supabase CRUD 프록시
// Vercel 환경변수: SUPABASE_URL, SUPABASE_ANON_KEY
// 지원 액션: list | get | upsert | delete | config-get | config-set

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY;
const TABLE    = 'building_records';

async function supaFetch(path, method, body) {
  return supaFetch2(TABLE, path, method, body);
}

async function supaFetch2(table, path, method, body) {
  const res = await fetch(SUPA_URL + '/rest/v1/' + table + path, {
    method: method || 'GET',
    headers: {
      'apikey':        SUPA_KEY,
      'Authorization': 'Bearer ' + SUPA_KEY,
      'Content-Type':  'application/json',
      'Prefer':        'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error((data && data.message) || ('Supabase error ' + res.status));
  return data;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!SUPA_URL || !SUPA_KEY) {
    return res.status(500).json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const action = req.query.action;

    // ── 목록 조회 ──
    if (action === 'list') {
      const rows = await supaFetch(
        '?select=id,alias,plat_plc,new_plat_plc,bld_nm,price,updated_at,memo&order=updated_at.desc',
        'GET'
      );
      return res.status(200).json({ rows: rows || [] });
    }

    // ── 단건 조회 ──
    if (action === 'get') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id 필요' });
      const rows = await supaFetch('?id=eq.' + id + '&select=*', 'GET');
      if (!rows || rows.length === 0) return res.status(404).json({ error: '없음' });
      return res.status(200).json({ row: rows[0] });
    }

    // ── 저장 (신규 or 업데이트) ──
    if (action === 'upsert') {
      const body = req.body;
      if (!body) return res.status(400).json({ error: 'body 필요' });

      // photos는 base64가 매우 크므로 별도 필드로 보관
      // Supabase 행 크기 제한(1MB) 주의 → 필요 시 Storage 전환 가능
      const row = {
        alias:        body.alias        || null,
        plat_plc:     body.plat_plc     || null,
        new_plat_plc: body.new_plat_plc || null,
        bld_nm:       body.bld_nm       || null,
        api_data:     body.api_data     || null,
        manual:       body.manual       || {},
        price:        body.price        || null,
        photos:       body.photos       || [],
        analysis:     body.analysis     || {},
        income:       body.income       || {},
        notes:        body.notes        || null,
        memo:         body.memo         || null,
      };

      let saved;
      if (body.id) {
        // 업데이트
        saved = await supaFetch('?id=eq.' + body.id, 'PATCH', row);
      } else {
        // 신규 삽입
        saved = await supaFetch('', 'POST', row);
      }
      const result = Array.isArray(saved) ? saved[0] : saved;
      return res.status(200).json({ row: result });
    }

    // ── 삭제 ──
    if (action === 'delete') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id 필요' });
      await supaFetch('?id=eq.' + id, 'DELETE');
      return res.status(200).json({ ok: true });
    }

    // ── 설정 불러오기 (app_config) ──
    if (action === 'config-get') {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: 'key 필요' });
      const rows = await supaFetch2('app_config', '?id=eq.' + encodeURIComponent(key) + '&select=*', 'GET');
      if (!rows || rows.length === 0) return res.status(200).json({ data: null });
      return res.status(200).json({ data: rows[0].data });
    }

    // ── 설정 저장 (app_config upsert) ──
    if (action === 'config-set') {
      const body = req.body;
      if (!body || !body.key) return res.status(400).json({ error: 'key 필요' });
      const row = { id: body.key, data: body.data, updated_at: new Date().toISOString() };
      await supaFetch2('app_config', '?id=eq.' + encodeURIComponent(body.key), 'DELETE');
      await supaFetch2('app_config', '', 'POST', row);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: '알 수 없는 action: ' + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
