/* ════════════════════════════════════════════════════
   타임즈부동산중개 — 건축물대장 비교 조회
   @babel/standalone 컴파일 | React 18 UMD 전역 사용
   주의: import/export 사용 금지 (Babel standalone 제약)
   ════════════════════════════════════════════════════ */

const { useState } = React;

// ── 법정동코드 룩업 (c=sigunguCd, d={동명:bjdongCd}) ──
const R = {
  "서울특별시": {
    "강남구":  { c:"11680", d:{"개포동":"10700","논현동":"10200","대치동":"10400","도곡동":"10600","삼성동":"10300","세곡동":"11300","수서동":"11000","신사동":"11400","압구정동":"10100","역삼동":"10800","일원동":"10900","자곡동":"11100","청담동":"10500","율현동":"11200"} },
    "서초구":  { c:"11650", d:{"내곡동":"10800","반포동":"10200","방배동":"10300","서초동":"10400","신원동":"11000","양재동":"10600","염곡동":"10900","우면동":"10500","원지동":"10700","잠원동":"10100"} },
    "송파구":  { c:"11710", d:{"가락동":"10700","거여동":"10200","개롱동":"10600","마천동":"10300","문정동":"10800","방이동":"10400","삼전동":"11300","석촌동":"11400","성내동":"11600","신천동":"11200","오금동":"10500","위례동":"11000","잠실동":"11100","장지동":"10900","풍납동":"10100","송파동":"11500"} },
    "강동구":  { c:"11740", d:{"강일동":"10900","고덕동":"10200","길동":"10400","둔촌동":"10500","명일동":"10100","상일동":"10300","성내동":"10700","암사동":"10600","천호동":"10800","풍산동":"11000"} },
    "용산구":  { c:"11170", d:{"도원동":"11400","동빙고동":"12300","보광동":"13100","서빙고동":"12400","이촌동":"12000","이태원동":"12100","한남동":"12200","효창동":"11300"} },
    "마포구":  { c:"11440", d:{"공덕동":"10200","노고산동":"11000","도화동":"10400","동교동":"12000","망원동":"11700","마포동":"10700","상수동":"11500","서교동":"11900","아현동":"10100","연남동":"12100","합정동":"11800"} },
    "성동구":  { c:"11200", d:{"금호동1가":"10400","마장동":"11100","사근동":"11200","성수동1가":"11500","성수동2가":"11600","옥수동":"10800","왕십리동":"10100","응봉동":"10300","행당동":"10200"} },
    "광진구":  { c:"11215", d:{"광장동":"10600","구의동":"10500","군자동":"10200","능동":"10400","자양동":"10700","중곡동":"10300","화양동":"10100"} },
    "영등포구":{ c:"11560", d:{"당산동":"11700","대림동":"13200","도림동":"11800","문래동1가":"11900","신길동":"13100","양평동1가":"12500","여의도동":"11000","영등포동":"10100"} },
    "강서구":  { c:"11500", d:{"가양동":"10400","내발산동":"10600","등촌동":"10200","마곡동":"10500","방화동":"10900","염창동":"10100","화곡동":"10300"} },
    "동작구":  { c:"11590", d:{"노량진동":"10100","대방동":"10200","동작동":"10300","본동":"10400","사당동":"10500","상도동":"10600","신대방동":"10700","흑석동":"10800"} },
    "관악구":  { c:"11620", d:{"남현동":"10100","봉천동":"10300","신림동":"10200"} },
    "종로구":  { c:"11110", d:{"가회동":"14400","계동":"14600","낙원동":"13500","부암동":"18100","사직동":"11500","삼청동":"13800","인사동":"13400","창신동":"17100","청운동":"10100","평창동":"18000","효자동":"10400"} },
    "중구":    { c:"11140", d:{"다산동":"12500","신당동":"12400","약수동":"12600","장충동1가":"12200","장충동2가":"12300","청구동":"12700","황학동":"13200"} },
    "성북구":  { c:"11290", d:{"길음동":"11000","돈암동":"11700","보문동1가":"11600","성북동":"10100","월곡동":"11400","장위동":"11200","정릉동":"11100","종암동":"11500","하월곡동":"11300"} },
    "노원구":  { c:"11350", d:{"공릉동":"10100","상계동":"10400","월계동":"10200","중계동":"10500","하계동":"10300"} },
    "은평구":  { c:"11380", d:{"갈현동":"10200","구산동":"10300","대조동":"10400","불광동":"10100","수색동":"10900","신사동":"10700","역촌동":"10600","응암동":"10500","증산동":"10800","진관동":"11000"} },
    "서대문구":{ c:"11410", d:{"남가좌동":"11100","냉천동":"10600","대신동":"11000","대현동":"10900","북가좌동":"11200","북아현동":"10200","신촌동":"10700","연희동":"10500","창천동":"10800","천연동":"10400","홍은동":"10300","홍제동":"10100"} },
    "강북구":  { c:"11305", d:{"미아동":"10300","번동":"10100","수유동":"10200","우이동":"10400"} },
    "도봉구":  { c:"11320", d:{"도봉동":"10100","방학동":"10300","쌍문동":"10200","창동":"10400"} },
    "중랑구":  { c:"11260", d:{"망우동":"10500","면목동":"10100","묵동":"10400","상봉동":"10200","신내동":"10600","중화동":"10300"} },
    "동대문구":{ c:"11230", d:{"답십리동":"10400","신설동":"10900","용신동":"10100","이문동":"10700","전농동":"10300","제기동":"10200","장안동":"10500","청량리동":"10600","휘경동":"10800"} },
    "양천구":  { c:"11470", d:{"목동":"10100","신월동":"10300","신정동":"10200"} },
    "구로구":  { c:"11530", d:{"가리봉동":"10200","개봉동":"10400","고척동":"10300","구로동":"10100","궁동":"10600","신도림동":"10900","오류동":"10500","온수동":"10700","항동":"10800"} },
    "금천구":  { c:"11545", d:{"가산동":"10200","독산동":"10300","시흥동":"10100"} }
  },
  "경기도": {
    "과천시":        { c:"41290", d:{"갈현동":"10500","관문동":"10900","과천동":"10800","막계동":"10700","문원동":"10400","별양동":"10200","부림동":"10300","주암동":"10600","중앙동":"10100"} },
    "고양시 덕양구": { c:"41281", d:{"강매동":"10100","고양동":"10200","관산동":"10300","능곡동":"10500","대장동":"10600","원당동":"11300","원흥동":"11400","행신동":"11600","화정동":"11800"} },
    "고양시 일산동구":{ c:"41285", d:{"마두동":"10400","백석동":"10500","식사동":"10100","장항동":"10700","정발산동":"10300","중산동":"10200","풍동":"10600"} },
    "고양시 일산서구":{ c:"41287", d:{"가좌동":"10500","구산동":"10800","대화동":"10200","덕이동":"10600","일산동":"10400","주엽동":"10100","탄현동":"10300"} },
    "광명시":        { c:"41210", d:{"광명동":"10100","소하동":"10200","철산동":"10300","하안동":"10400","일직동":"10500"} },
    "구리시":        { c:"41310", d:{"갈매동":"10100","교문동":"10200","수택동":"10400","인창동":"10300","토평동":"10500"} },
    "남양주시":      { c:"41360", d:{"금곡동":"10400","도농동":"10700","별내동":"10100","양정동":"10500","지금동":"10600","평내동":"10300","호평동":"10200"} },
    "부천시":        { c:"41190", d:{"도당동":"10500","상동":"10900","소사동":"11000","심곡동":"11100","역곡동":"11200","오정동":"10200","원미동":"11300","원종동":"10400","중동":"10800","춘의동":"10600"} },
    "성남시 분당구": { c:"41135", d:{"대장동":"11200","백현동":"11000","분당동":"10100","삼평동":"10900","서현동":"10500","석운동":"11300","수내동":"10200","야탑동":"10700","운중동":"11100","이매동":"10600","정자동":"10300","판교동":"10800","율동":"10400"} },
    "성남시 수정구": { c:"41131", d:{"고등동":"11000","단대동":"10500","복정동":"10800","산성동":"10600","성남동":"10400","수진동":"10100","신흥동":"10200","양지동":"10700","창곡동":"10900","태평동":"10300"} },
    "성남시 중원구": { c:"41133", d:{"금광동":"10300","도촌동":"10700","상대원동":"10500","성남동":"10200","은행동":"10400","중앙동":"10100","하대원동":"10600"} },
    "수원시 영통구": { c:"41117", d:{"망포동":"10200","매탄동":"10300","영통동":"10100","원천동":"10400","이의동":"10500","하동":"10600"} },
    "수원시 장안구": { c:"41111", d:{"송죽동":"10300","영화동":"10200","율전동":"10600","이목동":"10500","정자동":"10400","조원동":"10100","천천동":"10800","파장동":"10700"} },
    "수원시 팔달구": { c:"41115", d:{"교동":"10500","우만동":"10700","인계동":"10600","장안동":"10400"} },
    "안양시 동안구": { c:"41173", d:{"관양동":"10100","귀인동":"10500","비산동":"10200","평촌동":"10400","호계동":"10300"} },
    "안양시 만안구": { c:"41171", d:{"박달동":"10200","석수동":"10300","안양동":"10100"} },
    "용인시 기흥구": { c:"41463", d:{"구갈동":"10200","기흥동":"10100","동백동":"11200","상갈동":"10300","신갈동":"10400","영덕동":"10500","청덕동":"10600"} },
    "용인시 수지구": { c:"41465", d:{"고기동":"10400","동천동":"10300","상현동":"10500","성복동":"10600","신봉동":"10200","죽전동":"10700","풍덕천동":"10100"} },
    "하남시":        { c:"41450", d:{"감일동":"10500","덕풍동":"11200","망월동":"11400","미사동":"11500","신장동":"11300","위례동":"12000","풍산동":"11100"} },
    "화성시":        { c:"41590", d:{"동탄동":"10100","반월동":"10200","병점동":"10300"} },
    "파주시":        { c:"41480", d:{"교하동":"10900","금촌동":"10400","운정동":"10200","야당동":"10100"} },
    "김포시":        { c:"41570", d:{"걸포동":"10700","구래동":"10500","마산동":"10600","북변동":"10900","사우동":"10200","운양동":"10400","장기동":"10300","풍무동":"10100"} }
  }
};

// ── 유틸리티 ──
const PY = 3.3058;
const py  = v => v ? (parseFloat(v) / PY).toFixed(1) : null;
const m2  = v => (v != null && v !== '' && parseFloat(v) > 0)
  ? parseFloat(v).toFixed(1) + '㎡ (약 ' + py(v) + '평)' : '—';
const pct = v => (v != null && v !== '') ? parseFloat(v).toFixed(1) + '%' : '—';
const dt  = v => {
  if (!v) return '—';
  const s = String(v).replace(/-/g, '');
  return s.length >= 8 ? s.slice(0,4) + '.' + s.slice(4,6) + '.' + s.slice(6,8) : String(v);
};
const p4  = n => String(parseInt(n) || 0).padStart(4, '0');
const parseBJ = str => {
  const m = str.trim().replace(/\s/g, '').match(/^(\d+)(?:-(\d+))?$/);
  return m ? { bun: p4(m[1]), ji: p4(m[2] || 0) } : null;
};

// ── 비교 항목 ──
const COLS = [
  { l:'대지위치',        f: i => i.platPlc || '—' },
  { l:'주용도',          f: i => [i.mainPurpsCdNm, i.etcPurps].filter(Boolean).join(' / ') || '—' },
  { l:'주구조',          f: i => i.mainStrctCdNm || '—' },
  { l:'대지면적',        f: i => m2(i.platArea) },
  { l:'건축면적',        f: i => m2(i.archArea) },
  { l:'연면적',          f: i => m2(i.totArea) },
  { l:'용적률산정연면적',f: i => m2(i.vlRatEstmTotArea) },
  { l:'건폐율',          f: i => pct(i.bcRat) },
  { l:'용적률',          f: i => pct(i.vlRat) },
  { l:'층수',            f: i => '지상 ' + (i.grndFlrCnt||0) + '층 / 지하 ' + (i.ugrndFlrCnt||0) + '층' },
  { l:'높이',            f: i => i.heit ? i.heit + 'm' : '—' },
  { l:'세대수',          f: i => i.hhldCnt ? parseInt(i.hhldCnt).toLocaleString() + '세대' : '—' },
  { l:'승강기',          f: i => {
    const r = parseInt(i.rideUseElvtCnt) || 0, e = parseInt(i.emgenUseElvtCnt) || 0;
    return (r || e) ? '승용 ' + r + '대 / 비상 ' + e + '대' : '—';
  }},
  { l:'사용승인일',      f: i => dt(i.useAprDay) },
];

// ── 엔트리 팩토리 ──
let _id = 2;
const mk = id => ({
  id, sido:'서울특별시', sg:'강남구', dong:'', bj:'', alias:'',
  man:false, mSg:'', mD:'', res:null, ld:false, err:null
});

// ════════════════════════════════════════════════════
// 메인 컴포넌트
// ════════════════════════════════════════════════════
function App() {
  const [ents, setE] = useState([mk(1)]);
  const [vw, setV]   = useState('cards');

  const up  = (id, d) => setE(p => p.map(e => e.id === id ? {...e, ...d} : e));
  const add = ()      => setE(p => [...p, mk(_id++)]);
  const rm  = id      => setE(p => p.filter(e => e.id !== id));

  const go = async ent => {
    up(ent.id, { ld:true, err:null });
    try {
      let sC, bC;
      if (ent.man) {
        if (!ent.mSg || !ent.mD) throw new Error('시군구코드·법정동코드를 입력하세요');
        sC = ent.mSg.trim(); bC = ent.mD.trim();
      } else {
        const g = R[ent.sido] && R[ent.sido][ent.sg];
        if (!g) throw new Error('시군구를 선택하세요');
        sC = g.c; bC = g.d[ent.dong];
        if (!bC) throw new Error(ent.dong ? "'" + ent.dong + "' 코드 미등록" : '동을 선택하세요');
      }
      const p = parseBJ(ent.bj);
      if (!p) throw new Error('번지 형식 오류 (예: 1-1, 100)');

      const res = await fetch(
        '/api/building?sigunguCd=' + sC +
        '&bjdongCd=' + bC +
        '&bun=' + p.bun +
        '&ji='  + p.ji +
        '&_t='  + Date.now() 
      );
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const d = await res.json();

      if (d.response && d.response.header && d.response.header.resultCode !== '00')
        throw new Error(d.response.header.resultMsg || '조회 실패');

      const raw = d.response && d.response.body && d.response.body.items && d.response.body.items.item;
      if (!raw) throw new Error('결과 없음 — 주소·번지를 재확인하세요');

      const items = Array.isArray(raw) ? raw : [raw];
      if (items.length === 0) throw new Error('결과 없음 — 법정동코드 또는 번지를 확인하세요'); 
      const main  = items.find(i => i.mainAtchGbCd === '0') || items[0];
      up(ent.id, { ld:false, res:main });
    } catch(e) {
      up(ent.id, { ld:false, err: e.message });
    }
  };

  const sgs   = s     => Object.keys(R[s] || {}).sort();
  const ds    = (s,g) => Object.keys((R[s] && R[s][g] && R[s][g].d) || {}).sort();
  const sidos = Object.keys(R);
  const rE    = ents.filter(e => e.res);
  const hasR  = rE.length > 0;

  return (
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:'#f7f4ef',minHeight:'100vh',color:'#1a1a2e'}}>

      {/* 헤더 */}
      <header style={{background:'#0d1b2a',padding:'18px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:'10px',letterSpacing:'0.15em',color:'#c9a84c',marginBottom:'3px'}}>TIMES REAL ESTATE · 타임즈부동산중개</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'22px',color:'#f7f4ef',fontWeight:400}}>건축물대장 비교 조회</div>
        </div>
        <div style={{fontSize:'11px',color:'#c9a84c',border:'1px solid #c9a84c',padding:'6px 12px'}}>건축물대장정보 서비스</div>
      </header>

      {/* 입력 패널 */}
      <section style={{background:'#ede9e1',padding:'18px 28px 20px',borderBottom:'1px solid #d8d4cc'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <span style={{fontSize:'11px',color:'#888'}}>조회 건물 목록 · {ents.length}건</span>
            <div style={{display:'flex',gap:'8px'}}>
              <button className="blt" style={{fontSize:'11px',padding:'6px 14px'}} onClick={add}>+ 건물 추가</button>
              <button className="bdk" onClick={() => ents.forEach(e => go(e))}>
                {ents.some(e => e.ld) ? '조회 중…' : '전체 조회 ▶'}
              </button>
            </div>
          </div>
          {ents.map((e, i) => <ERow key={e.id} e={e} i={i} n={ents.length} sidos={sidos} sgs={sgs} ds={ds} up={up} rm={rm} go={go} />)}
          <p style={{fontSize:'11px',color:'#aaa',marginTop:'8px',lineHeight:1.7}}>
            ※ 동 코드가 없으면 "코드 직접입력"으로 시군구코드(5자리)·법정동코드(5자리)를 직접 입력하세요.
          </p>
        </div>
      </section>

      {/* 뷰 전환 */}
      {hasR && (
        <div style={{padding:'12px 28px',display:'flex',gap:'8px',justifyContent:'space-between',maxWidth:'1280px',margin:'0 auto'}}>
          <div style={{display:'flex',gap:'6px'}}>
            <button className={vw==='cards' ? 'bdk' : 'blt'} style={{fontSize:'12px',padding:'7px 14px'}} onClick={() => setV('cards')}>▣ 카드</button>
            <button className={vw==='table' ? 'bdk' : 'blt'} style={{fontSize:'12px',padding:'7px 14px'}} onClick={() => setV('table')}>≡ 비교표</button>
          </div>
          <button className="blt" style={{fontSize:'12px'}} onClick={() => window.print()}>🖨 인쇄 / PDF</button>
        </div>
      )}

      {/* 인쇄 헤더 */}
      <div className="ph" style={{display:'none',padding:'24px 28px 0'}}>
        <div style={{borderBottom:'2px solid #0d1b2a',paddingBottom:'14px',marginBottom:'20px',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:'9px',letterSpacing:'0.15em',color:'#c9a84c'}}>TIMES REAL ESTATE · 타임즈부동산중개</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'26px',fontWeight:500}}>건축물대장 비교 보고서</div>
          </div>
          <div style={{textAlign:'right',fontSize:'11px',color:'#888'}}>{new Date().toLocaleDateString('ko-KR')} · 총 {rE.length}건</div>
        </div>
      </div>

      {/* 결과 */}
      <main style={{padding:'10px 28px 48px',maxWidth:'1280px',margin:'0 auto'}}>
        {!hasR && (
          <div style={{textAlign:'center',padding:'80px 0',color:'#ccc'}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'28px',marginBottom:'10px'}}>건물을 조회하면 결과가 표시됩니다</div>
            <div style={{fontSize:'12px',color:'#bbb'}}>번지를 입력하고 조회 버튼을 누르세요</div>
          </div>
        )}
        {hasR && vw==='cards' && (
          <div className="cg" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'18px',paddingTop:'8px'}}>
            {rE.map((e, i) => <RCard key={e.id} e={e} i={i} />)}
          </div>
        )}
        {hasR && vw==='table' && <CmpT entries={rE} />}
      </main>
    </div>
  );
}

// ── 입력 행 ──
function ERow({ e, i, n, sidos, sgs, ds, up, rm, go }) {
  return (
    <div style={{background:'white',border:'1px solid #e0dcd4',padding:'12px 14px',marginBottom:'8px'}}>
      <div style={{display:'flex',gap:'8px',alignItems:'flex-start',flexWrap:'wrap'}}>
        <div style={{width:'26px',height:'26px',background:'#0d1b2a',color:'#c9a84c',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,flexShrink:0,marginTop:'2px'}}>
          {i+1}
        </div>

        {!e.man ? (
          <>
            <select value={e.sido} style={{width:'130px',flexShrink:0}}
              onChange={v => { const s = v.target.value; up(e.id, {sido:s, sg:sgs(s)[0]||'', dong:''}); }}>
              {sidos.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={e.sg} style={{width:'130px',flexShrink:0}}
              onChange={v => up(e.id, {sg:v.target.value, dong:''})}>
              <option value="">구/군 선택</option>
              {sgs(e.sido).map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={e.dong} style={{width:'110px',flexShrink:0}}
              onChange={v => up(e.id, {dong:v.target.value})}>
              <option value="">동 선택</option>
              {ds(e.sido, e.sg).map(d => <option key={d}>{d}</option>)}
            </select>
          </>
        ) : (
          <>
            <input type="text" placeholder="시군구코드 5자리" value={e.mSg}
              onChange={v => up(e.id, {mSg:v.target.value})} style={{width:'160px',flexShrink:0}} />
            <input type="text" placeholder="법정동코드 5자리" value={e.mD}
              onChange={v => up(e.id, {mD:v.target.value})} style={{width:'160px',flexShrink:0}} />
          </>
        )}

        <input type="text" placeholder="번지 (예: 1-1)" value={e.bj}
          onChange={v => up(e.id, {bj:v.target.value})}
          onKeyDown={k => k.key === 'Enter' && go(e)}
          style={{width:'100px',flexShrink:0}} />
        <input type="text" placeholder="별칭 (선택)" value={e.alias}
          onChange={v => up(e.id, {alias:v.target.value})} style={{width:'120px',flexShrink:0}} />

        <label style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',color:'#999',cursor:'pointer',whiteSpace:'nowrap',paddingTop:'8px',userSelect:'none',flexShrink:0}}>
          <input type="checkbox" checked={e.man} onChange={v => up(e.id, {man:v.target.checked})} />
          코드 직접입력
        </label>

        <button className="bdk" style={{fontSize:'12px',padding:'7px 14px',flexShrink:0,minWidth:'72px'}}
          onClick={() => go(e)} disabled={e.ld}>
          {e.ld ? '조회 중…' : '조회'}
        </button>

        {n > 1 && (
          <button onClick={() => rm(e.id)}
            style={{background:'transparent',border:'none',color:'#ccc',fontSize:'18px',cursor:'pointer',lineHeight:1,padding:'4px 6px',marginLeft:'auto',flexShrink:0}}>×</button>
        )}
      </div>
      {e.err && <div style={{marginTop:'8px',marginLeft:'34px',fontSize:'12px',color:'#c0392b',background:'#fff5f4',padding:'6px 10px'}}>⚠ {e.err}</div>}
      {e.res && <div style={{marginTop:'8px',marginLeft:'34px',fontSize:'12px',color:'#2e7d32',background:'#f1f8e9',padding:'6px 10px'}}>
        ✓ {e.res.platPlc} — {[e.res.mainPurpsCdNm, e.res.etcPurps].filter(Boolean).join(' / ')}
      </div>}
    </div>
  );
}

// ── 결과 카드 ──
function RCard({ e, i }) {
  const it = e.res;
  const title = e.alias || it.bldNm || it.platPlc;
  const s3 = [
    { l:'건폐율', v: pct(it.bcRat) },
    { l:'용적률', v: pct(it.vlRat) },
    { l:'세대수', v: it.hhldCnt ? parseInt(it.hhldCnt).toLocaleString() + '세대' : '—' },
  ];
  const rows = [
    { l:'주구조',   v: it.mainStrctCdNm },
    { l:'대지면적', v: m2(it.platArea) },
    { l:'건축면적', v: m2(it.archArea) },
    { l:'층수',     v: '지상 ' + (it.grndFlrCnt||0) + '층 / 지하 ' + (it.ugrndFlrCnt||0) + '층' },
    { l:'높이',     v: it.heit ? it.heit + 'm' : null },
    { l:'승강기',   v: (parseInt(it.rideUseElvtCnt) || parseInt(it.emgenUseElvtCnt))
      ? '승용 ' + (it.rideUseElvtCnt||0) + '대 / 비상 ' + (it.emgenUseElvtCnt||0) + '대' : null },
    { l:'사용승인', v: dt(it.useAprDay) },
  ].filter(r => r.v && r.v !== '—');

  return (
    <div style={{background:'white',border:'1px solid #e0dcd4',padding:'24px',position:'relative'}}>
      <div style={{position:'absolute',top:0,right:0,background:'#0d1b2a',color:'#c9a84c',width:'32px',height:'32px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700}}>{i+1}</div>
      <div style={{paddingRight:'40px',marginBottom:'16px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.1em',color:'#c9a84c',marginBottom:'4px'}}>
          {[it.mainPurpsCdNm, it.etcPurps].filter(Boolean).join(' · ')}
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'20px',fontWeight:600,lineHeight:1.2,marginBottom:'4px',color:'#0d1b2a'}}>{title}</div>
        <div style={{fontSize:'11px',color:'#999'}}>{it.platPlc}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'#e0dcd4',marginBottom:'12px'}}>
        {s3.map(s => (
          <div key={s.l} style={{background:'#faf9f5',padding:'10px 6px',textAlign:'center'}}>
            <div style={{fontSize:'10px',color:'#aaa',marginBottom:'3px'}}>{s.l}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'18px',fontWeight:600,color:'#0d1b2a'}}>{s.v}</div>
          </div>
        ))}
      </div>
      {it.totArea && parseFloat(it.totArea) > 0 && (
        <div style={{background:'#f5f2eb',padding:'9px 12px',marginBottom:'14px',display:'flex',justifyContent:'space-between',alignItems:'center',borderLeft:'3px solid #c9a84c'}}>
          <span style={{fontSize:'11px',color:'#888'}}>연면적</span>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'16px',fontWeight:600,color:'#0d1b2a'}}>
            {parseFloat(it.totArea).toFixed(1)}㎡
            <span style={{fontSize:'13px',fontWeight:400,color:'#888',marginLeft:'6px'}}>({py(it.totArea)}평)</span>
          </span>
        </div>
      )}
      <div>
        {rows.map(r => (
          <div key={r.l} style={{display:'flex',gap:'12px',fontSize:'12px',padding:'5px 0',borderBottom:'1px solid #f0ece4'}}>
            <div style={{width:'58px',color:'#999',flexShrink:0}}>{r.l}</div>
            <div style={{color:'#1a1a2e'}}>{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 비교 테이블 ──
function CmpT({ entries }) {
  return (
    <div style={{overflowX:'auto',marginTop:'8px'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
        <thead>
          <tr>
            <th className="plc" style={{background:'#f7f4ef',color:'#666',padding:'10px 14px',textAlign:'left',border:'1px solid #e0dcd4',minWidth:'110px',fontWeight:500,whiteSpace:'nowrap'}}>항목</th>
            {entries.map((e, i) => (
              <th key={e.id} className="ptk" style={{background:'#0d1b2a',color:'#f7f4ef',padding:'10px 14px',textAlign:'left',border:'1px solid #0d1b2a',minWidth:'190px',fontWeight:500}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{background:'#c9a84c',color:'white',minWidth:'20px',height:'20px',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{i+1}</span>
                  <span>{e.alias || (e.res && e.res.bldNm) || ('건물 ' + (i+1))}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COLS.map(col => (
            <tr key={col.l}>
              <td className="plc" style={{background:'#f7f4ef',padding:'9px 14px',color:'#666',fontWeight:500,border:'1px solid #e0dcd4',whiteSpace:'nowrap',verticalAlign:'top'}}>{col.l}</td>
              {entries.map(e => (
                <td key={e.id} style={{padding:'9px 14px',border:'1px solid #e0dcd4',verticalAlign:'top',lineHeight:1.6}}>
                  {e.res ? col.f(e.res) : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── 마운트 ──
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
