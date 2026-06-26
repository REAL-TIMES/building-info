/* ════════════════════════════════════════════════════
   타임즈부동산중개 — 건축물대장 비교 조회
   @babel/standalone 컴파일 | React 18 UMD 전역 사용
   주의: import/export 사용 금지 (Babel standalone 제약)
   ════════════════════════════════════════════════════ */

const VERSION = 'v1.8.8';
// v1.8.8: 출력 전체선택/해제/선택삭제 추가·리포트도 선택 매물만 인쇄·카드/비교표/리포트 출력선택 일관화
// v1.8.7: 대지면적 검색 평 단위·행정동 다중선택 필터·카드 직접배치(드래그) 모드
// v1.8.6: 검색을 저장목록→카드 화면으로 이동·카드 기본 정렬 최근 등록순·저장목록 검색 제거
// v1.8.5: 저장목록 검색창 상시 표시·기본 정렬을 최근 등록순으로·목록 영역 확대
// v1.8.4: 저장 목록 정렬·검색 추가(키워드·매매가/대지면적 범위)·화면 카드 정렬·카드에 작성일 표시
// v1.8.3: 법정동코드 전면 정비 — 행정안전부 공식 코드(2024.8.1)로 R 전수 교체
//          누락 동 462개 추가·기존 오류코드 다수 수정·부천시 일반구(원미/소사/오정구) 반영
// v1.8.2: 첫 접속 세션복원 병렬화(순차→Promise.all)로 로딩 속도 개선·복원중 안내 표시
// v1.8.1: 출력정보 자동저장
// v1.8.0: Building Info·버튼개선·파일재선택 버그수정·비교표 로고 넘침

const { useState } = React;

const R = {
  "서울특별시": {
    "강남구":  { c:"11680", d:{"역삼동":"10100","개포동":"10300","청담동":"10400","삼성동":"10500","대치동":"10600","신사동":"10700","논현동":"10800","압구정동":"11000","세곡동":"11100","자곡동":"11200","율현동":"11300","일원동":"11400","수서동":"11500","도곡동":"11800"} },
    "서초구":  { c:"11650", d:{"방배동":"10100","양재동":"10200","우면동":"10300","원지동":"10400","잠원동":"10600","반포동":"10700","서초동":"10800","내곡동":"10900","염곡동":"11000","신원동":"11100"} },
    "송파구":  { c:"11710", d:{"잠실동":"10100","신천동":"10200","풍납동":"10300","송파동":"10400","석촌동":"10500","삼전동":"10600","가락동":"10700","문정동":"10800","장지동":"10900","방이동":"11100","오금동":"11200","거여동":"11300","마천동":"11400"} },
    "강동구":  { c:"11740", d:{"명일동":"10100","고덕동":"10200","상일동":"10300","길동":"10500","둔촌동":"10600","암사동":"10700","성내동":"10800","천호동":"10900","강일동":"11000"} },
    "용산구":  { c:"11170", d:{"후암동":"10100","용산동2가":"10200","용산동4가":"10300","갈월동":"10400","남영동":"10500","용산동1가":"10600","동자동":"10700","서계동":"10800","청파동1가":"10900","청파동2가":"11000","청파동3가":"11100","원효로1가":"11200","원효로2가":"11300","신창동":"11400","산천동":"11500","청암동":"11600","원효로3가":"11700","원효로4가":"11800","효창동":"11900","도원동":"12000","용문동":"12100","문배동":"12200","신계동":"12300","한강로1가":"12400","한강로2가":"12500","용산동3가":"12600","용산동5가":"12700","한강로3가":"12800","이촌동":"12900","이태원동":"13000","한남동":"13100","동빙고동":"13200","서빙고동":"13300","주성동":"13400","용산동6가":"13500","보광동":"13600"} },
    "마포구":  { c:"11440", d:{"아현동":"10100","공덕동":"10200","신공덕동":"10300","도화동":"10400","용강동":"10500","토정동":"10600","마포동":"10700","대흥동":"10800","염리동":"10900","노고산동":"11000","신수동":"11100","현석동":"11200","구수동":"11300","창전동":"11400","상수동":"11500","하중동":"11600","신정동":"11700","당인동":"11800","서교동":"12000","동교동":"12100","합정동":"12200","망원동":"12300","연남동":"12400","성산동":"12500","중동":"12600","상암동":"12700"} },
    "성동구":  { c:"11200", d:{"상왕십리동":"10100","하왕십리동":"10200","홍익동":"10300","도선동":"10400","마장동":"10500","사근동":"10600","행당동":"10700","응봉동":"10800","금호동1가":"10900","금호동2가":"11000","금호동3가":"11100","금호동4가":"11200","옥수동":"11300","성수동1가":"11400","성수동2가":"11500","송정동":"11800","용답동":"12200"} },
    "광진구":  { c:"11215", d:{"중곡동":"10100","능동":"10200","구의동":"10300","광장동":"10400","자양동":"10500","화양동":"10700","군자동":"10900"} },
    "영등포구": { c:"11560", d:{"영등포동":"10100","영등포동1가":"10200","영등포동2가":"10300","영등포동3가":"10400","영등포동4가":"10500","영등포동5가":"10600","영등포동6가":"10700","영등포동7가":"10800","영등포동8가":"10900","여의도동":"11000","당산동1가":"11100","당산동2가":"11200","당산동3가":"11300","당산동4가":"11400","당산동5가":"11500","당산동6가":"11600","당산동":"11700","도림동":"11800","문래동1가":"11900","문래동2가":"12000","문래동3가":"12100","문래동4가":"12200","문래동5가":"12300","문래동6가":"12400","양평동1가":"12500","양평동2가":"12600","양평동3가":"12700","양평동4가":"12800","양평동5가":"12900","양평동6가":"13000","양화동":"13100","신길동":"13200","대림동":"13300","양평동":"13400"} },
    "강서구":  { c:"11500", d:{"염창동":"10100","등촌동":"10200","화곡동":"10300","가양동":"10400","마곡동":"10500","내발산동":"10600","외발산동":"10700","공항동":"10800","방화동":"10900","개화동":"11000","과해동":"11100","오곡동":"11200","오쇠동":"11300"} },
    "동작구":  { c:"11590", d:{"노량진동":"10100","상도동":"10200","상도1동":"10300","본동":"10400","흑석동":"10500","동작동":"10600","사당동":"10700","대방동":"10800","신대방동":"10900"} },
    "관악구":  { c:"11620", d:{"봉천동":"10100","신림동":"10200","남현동":"10300"} },
    "종로구":  { c:"11110", d:{"청운동":"10100","신교동":"10200","궁정동":"10300","효자동":"10400","창성동":"10500","통의동":"10600","적선동":"10700","통인동":"10800","누상동":"10900","누하동":"11000","옥인동":"11100","체부동":"11200","필운동":"11300","내자동":"11400","사직동":"11500","도렴동":"11600","당주동":"11700","내수동":"11800","세종로":"11900","신문로1가":"12000","신문로2가":"12100","청진동":"12200","서린동":"12300","수송동":"12400","중학동":"12500","종로1가":"12600","공평동":"12700","관훈동":"12800","견지동":"12900","와룡동":"13000","권농동":"13100","운니동":"13200","익선동":"13300","경운동":"13400","관철동":"13500","인사동":"13600","낙원동":"13700","종로2가":"13800","팔판동":"13900","삼청동":"14000","안국동":"14100","소격동":"14200","화동":"14300","사간동":"14400","송현동":"14500","가회동":"14600","재동":"14700","계동":"14800","원서동":"14900","훈정동":"15000","묘동":"15100","봉익동":"15200","돈의동":"15300","장사동":"15400","관수동":"15500","종로3가":"15600","인의동":"15700","예지동":"15800","원남동":"15900","연지동":"16000","종로4가":"16100","효제동":"16200","종로5가":"16300","종로6가":"16400","이화동":"16500","연건동":"16600","충신동":"16700","동숭동":"16800","혜화동":"16900","명륜1가":"17000","명륜2가":"17100","명륜4가":"17200","명륜3가":"17300","창신동":"17400","숭인동":"17500","교남동":"17600","평동":"17700","송월동":"17800","홍파동":"17900","교북동":"18000","행촌동":"18100","구기동":"18200","평창동":"18300","부암동":"18400","홍지동":"18500","신영동":"18600","무악동":"18700"} },
    "중구":   { c:"11140", d:{"무교동":"10100","다동":"10200","태평로1가":"10300","을지로1가":"10400","을지로2가":"10500","남대문로1가":"10600","삼각동":"10700","수하동":"10800","장교동":"10900","수표동":"11000","소공동":"11100","남창동":"11200","북창동":"11300","태평로2가":"11400","남대문로2가":"11500","남대문로3가":"11600","남대문로4가":"11700","남대문로5가":"11800","봉래동1가":"11900","봉래동2가":"12000","회현동1가":"12100","회현동2가":"12200","회현동3가":"12300","충무로1가":"12400","충무로2가":"12500","명동1가":"12600","명동2가":"12700","남산동1가":"12800","남산동2가":"12900","남산동3가":"13000","저동1가":"13100","충무로4가":"13200","충무로5가":"13300","인현동2가":"13400","예관동":"13500","묵정동":"13600","필동1가":"13700","필동2가":"13800","필동3가":"13900","남학동":"14000","주자동":"14100","예장동":"14200","장충동1가":"14300","장충동2가":"14400","광희동1가":"14500","광희동2가":"14600","쌍림동":"14700","을지로6가":"14800","을지로7가":"14900","을지로4가":"15000","을지로5가":"15100","주교동":"15200","방산동":"15300","오장동":"15400","을지로3가":"15500","입정동":"15600","산림동":"15700","충무로3가":"15800","초동":"15900","인현동1가":"16000","저동2가":"16100","신당동":"16200","흥인동":"16300","무학동":"16400","황학동":"16500","서소문동":"16600","정동":"16700","순화동":"16800","의주로1가":"16900","충정로1가":"17000","중림동":"17100","의주로2가":"17200","만리동1가":"17300","만리동2가":"17400"} },
    "성북구":  { c:"11290", d:{"성북동":"10100","성북동1가":"10200","돈암동":"10300","동소문동1가":"10400","동소문동2가":"10500","동소문동3가":"10600","동소문동4가":"10700","동소문동5가":"10800","동소문동6가":"10900","동소문동7가":"11000","삼선동1가":"11100","삼선동2가":"11200","삼선동3가":"11300","삼선동4가":"11400","삼선동5가":"11500","동선동1가":"11600","동선동2가":"11700","동선동3가":"11800","동선동4가":"11900","동선동5가":"12000","안암동1가":"12100","안암동2가":"12200","안암동3가":"12300","안암동4가":"12400","안암동5가":"12500","보문동4가":"12600","보문동5가":"12700","보문동6가":"12800","보문동7가":"12900","보문동1가":"13000","보문동2가":"13100","보문동3가":"13200","정릉동":"13300","길음동":"13400","종암동":"13500","하월곡동":"13600","상월곡동":"13700","장위동":"13800","석관동":"13900"} },
    "노원구":  { c:"11350", d:{"월계동":"10200","공릉동":"10300","하계동":"10400","상계동":"10500","중계동":"10600"} },
    "은평구":  { c:"11380", d:{"수색동":"10100","녹번동":"10200","불광동":"10300","갈현동":"10400","구산동":"10500","대조동":"10600","응암동":"10700","역촌동":"10800","신사동":"10900","증산동":"11000","진관동":"11400"} },
    "서대문구": { c:"11410", d:{"충정로2가":"10100","충정로3가":"10200","합동":"10300","미근동":"10400","냉천동":"10500","천연동":"10600","옥천동":"10700","영천동":"10800","현저동":"10900","북아현동":"11000","홍제동":"11100","대현동":"11200","대신동":"11300","신촌동":"11400","봉원동":"11500","창천동":"11600","연희동":"11700","홍은동":"11800","북가좌동":"11900","남가좌동":"12000"} },
    "강북구":  { c:"11305", d:{"미아동":"10100","번동":"10200","수유동":"10300","우이동":"10400"} },
    "도봉구":  { c:"11320", d:{"쌍문동":"10500","방학동":"10600","창동":"10700","도봉동":"10800"} },
    "중랑구":  { c:"11260", d:{"면목동":"10100","상봉동":"10200","중화동":"10300","묵동":"10400","망우동":"10500","신내동":"10600"} },
    "동대문구": { c:"11230", d:{"신설동":"10100","용두동":"10200","제기동":"10300","전농동":"10400","답십리동":"10500","장안동":"10600","청량리동":"10700","회기동":"10800","휘경동":"10900","이문동":"11000"} },
    "양천구":  { c:"11470", d:{"신정동":"10100","목동":"10200","신월동":"10300"} },
    "구로구":  { c:"11530", d:{"신도림동":"10100","구로동":"10200","가리봉동":"10300","고척동":"10600","개봉동":"10700","오류동":"10800","궁동":"10900","온수동":"11000","천왕동":"11100","항동":"11200"} },
    "금천구":  { c:"11545", d:{"가산동":"10100","독산동":"10200","시흥동":"10300"} }
  },
  "경기도": {
    "과천시":      { c:"41290", d:{"관문동":"10100","문원동":"10200","갈현동":"10300","막계동":"10400","과천동":"10500","주암동":"10600","중앙동":"10700","원문동":"10800","별양동":"10900","부림동":"11000"} },
    "고양시 덕양구":  { c:"41281", d:{"주교동":"10100","원당동":"10200","신원동":"10300","원흥동":"10400","도내동":"10500","성사동":"10600","북한동":"10700","효자동":"10800","지축동":"10900","오금동":"11000","삼송동":"11100","동산동":"11200","용두동":"11300","벽제동":"11400","선유동":"11500","고양동":"11600","대자동":"11700","관산동":"11800","내유동":"11900","토당동":"12000","내곡동":"12100","대장동":"12200","화정동":"12300","강매동":"12400","행주내동":"12500","행주외동":"12600","신평동":"12700","행신동":"12800","화전동":"12900","현천동":"13000","덕은동":"13100","향동동":"13200"} },
    "고양시 일산동구": { c:"41285", d:{"식사동":"10100","중산동":"10200","정발산동":"10300","장항동":"10400","마두동":"10500","백석동":"10600","풍동":"10700","산황동":"10800","사리현동":"10900","지영동":"11000","설문동":"11100","문봉동":"11200","성석동":"11300"} },
    "고양시 일산서구": { c:"41287", d:{"일산동":"10100","주엽동":"10200","탄현동":"10300","대화동":"10400","덕이동":"10500","가좌동":"10600","구산동":"10700","법곳동":"10800"} },
    "광명시":      { c:"41210", d:{"광명동":"10100","철산동":"10200","하안동":"10300","소하동":"10400","노온사동":"10500","일직동":"10600","가학동":"10700","옥길동":"10800"} },
    "구리시":      { c:"41310", d:{"갈매동":"10100","사노동":"10200","인창동":"10300","교문동":"10400","수택동":"10500","아천동":"10600","토평동":"10700"} },
    "남양주시":     { c:"41360", d:{"호평동":"10100","평내동":"10200","금곡동":"10300","일패동":"10400","이패동":"10500","삼패동":"10600","수석동":"10800","지금동":"10900","도농동":"11000","별내동":"11100","다산동":"11200","와부읍":"25000","진접읍":"25300","화도읍":"25600","진건읍":"25900","오남읍":"26200","퇴계원읍":"26500","별내면":"31000","수동면":"34000","조안면":"36000"} },
    "부천시 원미구":  { c:"41192", d:{"원미동":"10100","심곡동":"10200","춘의동":"10300","도당동":"10400","약대동":"10500","소사동":"10600","역곡동":"10700","중동":"10800","상동":"10900"} },
    "부천시 소사구":  { c:"41194", d:{"소사본동":"10100","심곡본동":"10200","범박동":"10300","괴안동":"10400","송내동":"10500","옥길동":"10600","계수동":"10700"} },
    "부천시 오정구":  { c:"41196", d:{"오정동":"10100","여월동":"10200","작동":"10300","원종동":"10400","고강동":"10500","대장동":"10600","삼정동":"10700","내동":"10800"} },
    "성남시 분당구":  { c:"41135", d:{"분당동":"10100","수내동":"10200","정자동":"10300","율동":"10400","서현동":"10500","이매동":"10600","야탑동":"10700","판교동":"10800","삼평동":"10900","백현동":"11000","금곡동":"11100","궁내동":"11200","동원동":"11300","구미동":"11400","운중동":"11500","대장동":"11600","석운동":"11700","하산운동":"11800"} },
    "성남시 수정구":  { c:"41131", d:{"신흥동":"10100","태평동":"10200","수진동":"10300","단대동":"10400","산성동":"10500","양지동":"10600","복정동":"10700","창곡동":"10800","신촌동":"10900","오야동":"11000","심곡동":"11100","고등동":"11200","상적동":"11300","둔전동":"11400","시흥동":"11500","금토동":"11600","사송동":"11700"} },
    "성남시 중원구":  { c:"41133", d:{"성남동":"10100","금광동":"10300","은행동":"10400","상대원동":"10500","여수동":"10600","도촌동":"10700","갈현동":"10800","하대원동":"10900","중앙동":"13200"} },
    "수원시 영통구":  { c:"41117", d:{"매탄동":"10100","원천동":"10200","이의동":"10300","하동":"10400","영통동":"10500","신동":"10600","망포동":"10700"} },
    "수원시 장안구":  { c:"41111", d:{"파장동":"12900","정자동":"13000","이목동":"13100","율전동":"13200","천천동":"13300","영화동":"13400","송죽동":"13500","조원동":"13600","연무동":"13700","상광교동":"13800","하광교동":"13900"} },
    "수원시 팔달구":  { c:"41115", d:{"팔달로1가":"12000","팔달로2가":"12100","팔달로3가":"12200","남창동":"12300","영동":"12400","중동":"12500","구천동":"12600","남수동":"12700","매향동":"12800","북수동":"12900","신풍동":"13000","장안동":"13100","교동":"13200","매교동":"13300","매산로1가":"13400","매산로2가":"13500","매산로3가":"13600","고등동":"13700","화서동":"13800","지동":"13900","우만동":"14000","인계동":"14100"} },
    "안양시 동안구":  { c:"41173", d:{"비산동":"10100","관양동":"10200","평촌동":"10300","호계동":"10400"} },
    "안양시 만안구":  { c:"41171", d:{"안양동":"10100","석수동":"10200","박달동":"10300"} },
    "용인시 기흥구":  { c:"41463", d:{"신갈동":"10100","구갈동":"10200","상갈동":"10300","하갈동":"10400","보라동":"10500","지곡동":"10600","공세동":"10700","고매동":"10800","농서동":"10900","서천동":"11000","영덕동":"11100","언남동":"11200","마북동":"11300","청덕동":"11400","동백동":"11500","중동":"11600","상하동":"11700","보정동":"11800"} },
    "용인시 수지구":  { c:"41465", d:{"풍덕천동":"10100","죽전동":"10200","동천동":"10300","고기동":"10400","신봉동":"10500","성복동":"10600","상현동":"10700"} },
    "하남시":      { c:"41450", d:{"천현동":"10100","하산곡동":"10200","창우동":"10300","배알미동":"10400","상산곡동":"10500","신장동":"10600","당정동":"10700","덕풍동":"10800","망월동":"10900","풍산동":"11000","미사동":"11100","선동":"11200","감북동":"11300","감일동":"11400","감이동":"11500","학암동":"11600","교산동":"11700","춘궁동":"11800","하사창동":"11900","상사창동":"12000","항동":"12100","초일동":"12200","초이동":"12300","광암동":"12400"} },
    "화성시":      { c:"41590", d:{"진안동":"11600","병점동":"11700","능동":"11800","기산동":"11900","반월동":"12000","반정동":"12100","황계동":"12200","배양동":"12300","기안동":"12400","송산동":"12500","안녕동":"12600","반송동":"12700","석우동":"12800","오산동":"12900","청계동":"13000","영천동":"13100","중동":"13200","신동":"13300","목동":"13400","산척동":"13500","장지동":"13600","송동":"13700","방교동":"13800","금곡동":"13900","새솔동":"14000","봉담읍":"25300","우정읍":"25600","향남읍":"25900","남양읍":"26200","매송면":"31000","비봉면":"32000","마도면":"33000","송산면":"34000","서신면":"35000","팔탄면":"36000","장안면":"37000","양감면":"40000","정남면":"41000"} },
    "파주시":      { c:"41480", d:{"금촌동":"10100","아동동":"10200","야동동":"10400","검산동":"10500","맥금동":"10600","교하동":"10700","야당동":"10800","다율동":"10900","오도동":"11000","상지석동":"11100","산남동":"11200","동패동":"11300","당하동":"11400","문발동":"11500","송촌동":"11600","목동동":"11700","하지석동":"11800","서패동":"11900","신촌동":"12000","연다산동":"12100","와동동":"12200","금릉동":"12300","문산읍":"25000","파주읍":"25300","법원읍":"25600","조리읍":"26200","월롱면":"31000","탄현면":"32000","광탄면":"35000","파평면":"36000","적성면":"37000","군내면":"38000","장단면":"39000","진동면":"40000","진서면":"41000"} },
    "김포시":      { c:"41570", d:{"북변동":"10100","걸포동":"10200","운양동":"10300","장기동":"10400","감정동":"10500","사우동":"10600","풍무동":"10700","마산동":"10800","구래동":"10900","통진읍":"25000","고촌읍":"25300","양촌읍":"25600","대곶면":"34000","월곶면":"35000","하성면":"36000"} }
  }
};

// ── 유틸리티 ──
const PY = 3.3058;
const py  = v => v ? (parseFloat(v) / PY).toFixed(1) : null;
const m2  = v => (v != null && v !== '' && parseFloat(v) > 0)
  ? py(v) + '평 (' + parseFloat(v).toFixed(0) + '㎡)' : '—';
const pct = v => (v != null && v !== '' && parseFloat(v) > 0) ? parseFloat(v).toFixed(1) + '%' : '—';
// 억/만원 혼합 포맷: 23,000만원 → 2억 3,000만원
const fmtAmt = (manwon) => {
  const n = Math.round(parseFloat(manwon) || 0);
  if (n <= 0) return '—';
  if (n >= 10000) {
    const uk  = Math.floor(n / 10000);
    const man = n % 10000;
    return man > 0 ? uk + '억 ' + man.toLocaleString() + '만원' : uk + '억원';
  }
  return n.toLocaleString() + '만원';
};
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

// ── 정렬·검색 공통 헬퍼 ──
// dbList의 row(스네이크 케이스)와 화면 ent(res/manual) 양쪽 모두에서 값 추출
const srcApi  = (s) => s.api_data || s.res || {};
const srcAddr = (s) => s.plat_plc || (s.res && s.res.platPlc) || '';
const srcName = (s) => s.alias || s.bld_nm || (s.res && s.res.bldNm) || '';
const valPlatArea = (s) => {
  const it = srcApi(s), m = s.manual || {};
  const v = (m.platArea && parseFloat(m.platArea) > 0) ? m.platArea : it.platArea;
  return parseFloat(v) || 0;            // ㎡
};
const valPrice = (s) => parseFloat(s.price) || 0;   // 억
const valPpyo  = (s) => {              // 만원/평
  const p = valPrice(s), a = valPlatArea(s);
  return (p > 0 && a > 0) ? Math.round(p * 10000 / (a / PY)) : 0;
};
const valUseApr = (s) => parseInt(String(srcApi(s).useAprDay || '').replace(/-/g, '')) || 0;
const valCreated = (s) => new Date(s.created_at || s.createdAt || s.updated_at || s.updatedAt || 0).getTime() || s._t || 0;
const valUpdated = (s) => new Date(s.updated_at || s.updatedAt || s.created_at || s.createdAt || 0).getTime() || 0;
// 행정동 정렬 키: 주소에서 번지 부분 제거 → "서울특별시 서초구 반포동"
const valAddrKey = (s) => {
  const plc = srcAddr(s);
  return plc.replace(/\s*\S*\d+(-\d+)?번지.*$/, '').trim() || plc;
};
// 행정동 키: "시군구 동" (예: "서초구 방배동") — 같은 동명의 다른 구 구분
const valDong = (s) => {
  const key = valAddrKey(s);          // "서울특별시 서초구 방배동"
  const parts = key.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2] + ' ' + parts[parts.length - 1];
  return parts[parts.length - 1] || '';
};

// 정렬 옵션 정의 (k=키, l=라벨, t='num'|'text', 값없음 뒤로)
const SORT_DEFS = {
  updated:  { l:'마지막 수정일', t:'num',  v:valUpdated },
  created:  { l:'작성일',        t:'num',  v:valCreated },
  price:    { l:'매매가',        t:'num',  v:valPrice },
  ppyo:     { l:'평단가',        t:'num',  v:valPpyo },
  platArea: { l:'대지면적',      t:'num',  v:valPlatArea },
  useApr:   { l:'사용승인일',    t:'num',  v:valUseApr },
  addr:     { l:'행정동',        t:'text', v:valAddrKey },
  name:     { l:'건물명',        t:'text', v:srcName },
};

const sortItems = (arr, key, asc) => {
  if (!key || key === 'none') return arr;       // 추가순 유지
  const def = SORT_DEFS[key];
  if (!def) return arr;
  const dir = asc ? 1 : -1;
  return [...arr].sort((a, b) => {
    if (def.t === 'text') {
      const ta = def.v(a) || '', tb = def.v(b) || '';
      if (!ta && !tb) return 0;
      if (!ta) return 1;                          // 값없음 항상 뒤로
      if (!tb) return -1;
      return ta.localeCompare(tb, 'ko') * dir;
    }
    const va = def.v(a), vb = def.v(b);
    if (!va && !vb) return 0;
    if (!va) return 1;                            // 값없음(0) 항상 뒤로
    if (!vb) return -1;
    return (va - vb) * dir;
  });
};

// 필터 (키워드 + 행정동 다중선택 + 매매가 범위 + 대지면적 범위[평])
const filterRows = (rows, f) => rows.filter(r => {
  if (f.kw) {
    const newAddr = r.new_plat_plc || (r.res && r.res.newPlatPlc) || '';
    const hay = (srcName(r) + ' ' + srcAddr(r) + ' ' + newAddr).toLowerCase();
    if (!hay.includes(f.kw.trim().toLowerCase())) return false;
  }
  if (f.dongs && f.dongs.length && !f.dongs.includes(valDong(r))) return false;
  const price = valPrice(r);
  if (f.priceMin !== '' && f.priceMin != null && price < parseFloat(f.priceMin)) return false;
  if (f.priceMax !== '' && f.priceMax != null && price > parseFloat(f.priceMax)) return false;
  const areaPy = valPlatArea(r) / PY;   // 평으로 변환해 비교
  if (f.areaMin !== '' && f.areaMin != null && areaPy < parseFloat(f.areaMin)) return false;
  if (f.areaMax !== '' && f.areaMax != null && areaPy > parseFloat(f.areaMax)) return false;
  return true;
});

// ── 비교표 항목 (높이 제거, 용도지역 추가) ──
const COLS = [
  { l:'주용도',          f: i => [i.mainPurpsCdNm, i.etcPurps].filter(Boolean).join(' / ') || '—' },
  { l:'용도지역',        f: i => i.jiyukCdNm || '—' },
  { l:'주구조',          f: i => i.strctCdNm || i.mainStrctCdNm || '—' },
  { l:'대지면적',        f: i => m2(i.platArea) },
  { l:'연면적',          f: i => m2(i.totArea) },
  { l:'건축면적',        f: i => m2(i.archArea) },
  { l:'용적률산정연면적',f: i => m2(i.vlRatEstmTotArea) },
  { l:'건폐율',          f: i => pct(i.bcRat) },
  { l:'용적률',          f: i => pct(i.vlRat) },
  { l:'층수',            f: i => '지상 ' + (i.grndFlrCnt||0) + '층 / 지하 ' + (i.ugrndFlrCnt||0) + '층' },
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
  id, _t: Date.now(), sido:'서울특별시', sg:'강남구', dong:'', bj:'', alias:'',
  man:false, mSg:'', mD:'', res:null, ld:false, err:null,
  price:'',
  printSel:true,
  manual:{},
  photos:[],
  mapPhoto:null,    // 지도 스크린샷 (base64)
  mapCoords:null,   // {lat, lon} 자동 지오코딩 결과
  analysis:{ traffic:'', commercial:'', population:'', development:'' },
  income:{ deposit:'', monthlyRent:'', mgmtFee:'', loanAmt:'', loanRate:'5.0', acquiTax:'4.6', targetYield:'' },
  notes:''   // 추가 설명 (각 줄 앞에 • 자동 처리)
});

// ════════════════════════════════════════════════════
// 메인 컴포넌트
// ════════════════════════════════════════════════════
function App() {
  const [ents, setE]         = useState([mk(1)]);
  const [vw, setV]           = useState('cards');
  const [reportTitle, setRT] = useState('');
  const [reportDate,  setRD] = useState(() => {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth()+1).padStart(2,'0') + '-' +
      String(d.getDate()).padStart(2,'0');
  });
  const [printMode,   setPM] = useState('landscape');
  const [showBiz,     setSB] = useState(false);

  // ── DB 관련 state ──
  const [dbList,      setDbList]   = useState([]);      // 저장된 건물 목록
  const [dbLoading,   setDbLoading] = useState(false);  // 목록 로딩
  const [dbSaving,    setDbSaving]  = useState({});     // {id: true} 저장 중
  const [dbMsg,       setDbMsg]     = useState('');     // 피드백 메시지
  const [showDbPanel, setShowDb]    = useState(false);  // 저장 목록 패널
  // 저장 목록 정렬·검색
  const [dbSort,   setDbSort]   = useState({ key:'created', asc:false });  // 저장목록 기본: 최근 등록 위로
  // 화면 카드 정렬·검색
  const [cardSort,   setCardSort]   = useState({ key:'created', asc:false });  // 카드 기본: 최근 등록 위로
  const [cardFilter, setCardFilter] = useState({ kw:'', dongs:[], priceMin:'', priceMax:'', areaMin:'', areaMax:'' });
  const [draggingId, setDraggingId] = useState(null);  // 카드 직접 배치(드래그)용
  const [bizName,     setBN] = useState('');
  const [bizAddr,     setBA] = useState('');
  const [agentName,   setAN] = useState('');
  const [agentPhone,  setAP] = useState('');
  const [logoSrc,     setLG] = useState('');
  const [configLoaded, setCL] = useState(false);  // DB에서 불러왔는지 여부

  const up          = (id, d) => setE(p => p.map(e => e.id === id ? {...e, ...d} : e));
  const upManual    = (id, field, val) => setE(p => p.map(e => e.id === id ? {...e, manual:{...(e.manual||{}), [field]:val}} : e));
  const upAnalysis  = (id, field, val) => setE(p => p.map(e => e.id === id ? {...e, analysis:{...(e.analysis||{}), [field]:val}} : e));
  const upIncome    = (id, field, val) => setE(p => p.map(e => e.id === id ? {...e, income:{...(e.income||{}), [field]:val}} : e));
  const addPhoto    = (id, src) => setE(p => p.map(e => e.id === id ? {...e, photos:[...(e.photos||[]),src].slice(0,3)} : e));
  const rmPhoto     = (id, idx) => setE(p => p.map(e => e.id === id ? {...e, photos:(e.photos||[]).filter((_,i)=>i!==idx)} : e));
  const setMapPhoto = (id, src) => setE(p => p.map(e => e.id === id ? {...e, mapPhoto:src} : e));
  const upNotes     = (id, val) => setE(p => p.map(e => e.id === id ? {...e, notes:val} : e));
  const add         = ()      => setE(p => [...p, mk(_id++)]);
  const rm          = id      => setE(p => p.filter(e => e.id !== id));
  const togglePrint = id      => setE(p => p.map(e => e.id === id ? {...e, printSel:!e.printSel} : e));
  // 출력 선택 일괄 제어 (조회 완료된 카드 대상)
  const selectAllCards  = () => setE(p => p.map(e => e.res ? {...e, printSel:true}  : e));
  const selectNoneCards = () => setE(p => p.map(e => e.res ? {...e, printSel:false} : e));
  const deleteSelectedCards = () => {
    const n = ents.filter(e => e.res && e.printSel).length;
    if (n === 0) { setDbMsg('선택된 건물이 없습니다'); return; }
    if (!window.confirm(n + '개 건물을 화면에서 제거할까요?\n(DB 저장 목록에는 그대로 남아있습니다)')) return;
    setE(p => {
      const kept = p.filter(e => !(e.res && e.printSel));
      return kept.length ? kept : [mk(_id++)];
    });
  };

  // ── DB API 호출 헬퍼 ──
  const dbFetch = async (action, params, body) => {
    const qs = Object.keys(params||{}).map(k => k+'='+encodeURIComponent(params[k])).join('&');
    const res = await fetch('/api/db?action=' + action + (qs ? '&'+qs : ''), {
      method: body ? 'POST' : 'GET',
      headers: body ? {'Content-Type':'application/json'} : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const d = await res.json();
    if (d.error) throw new Error(d.error);
    return d;
  };

  // 목록 불러오기
  const dbLoadList = async () => {
    setDbLoading(true); setDbMsg('');
    try {
      const d = await dbFetch('list');
      setDbList(d.rows || []);
    } catch(e) {
      setDbMsg('❌ ' + e.message);
    } finally {
      setDbLoading(false);
    }
  };
  // ── 조용한 자동 저장 (메시지 없이 백그라운드 저장) ──
  // ent를 직접 받지 않고 id로 최신 상태를 읽어 저장 (디바운스 클로저 문제 방지)
  const autoSaveById = (entId) => {
    setE(prev => {
      const ent = prev.find(x => x.id === entId);
      if (!ent || !ent.res) return prev;
      // 비동기 저장 (state 변경 없이 백그라운드 실행)
      const body = {
        id:           ent.dbId || undefined,
        alias:        ent.alias        || null,
        plat_plc:     ent.res.platPlc  || null,
        new_plat_plc: ent.res.newPlatPlc || null,
        bld_nm:       ent.res.bldNm    || null,
        api_data:     ent.res,
        manual:       ent.manual       || {},
        price:        ent.price        || null,
        photos:       ent.photos       || [],
        analysis:     ent.analysis     || {},
        income:       ent.income       || {},
        notes:        ent.notes        || null,
        memo:         ent.memo         || null,
      };
      dbFetch('upsert', {}, body).then(d => {
        const savedId = d.row && d.row.id;
        const cAt = d.row && d.row.created_at;
        const uAt = d.row && d.row.updated_at;
        if (savedId && !ent.dbId) {
          // 신규 저장이면 dbId 기록
          setE(p2 => p2.map(x => x.id === entId ? {...x, dbId: savedId, autoSaved: true, created_at: cAt||x.created_at, updated_at: uAt||x.updated_at} : x));
        } else {
          setE(p2 => p2.map(x => x.id === entId ? {...x, autoSaved: true, created_at: cAt||x.created_at, updated_at: uAt||x.updated_at} : x));
        }
      }).catch(() => {/* 자동저장 실패는 조용히 무시 */});
      return prev;  // state는 그대로
    });
  };

  // 단건 저장 (현재 조회된 건물 → DB 저장) — 수동 버튼용
  const dbSave = async (ent) => {
    if (!ent.res) return;
    setDbSaving(p => ({...p, [ent.id]: true}));
    setDbMsg('');
    try {
      const body = {
        id:           ent.dbId || undefined,   // 기존 row 업데이트 or 신규
        alias:        ent.alias        || null,
        plat_plc:     ent.res.platPlc  || null,
        new_plat_plc: ent.res.newPlatPlc || null,
        bld_nm:       ent.res.bldNm    || null,
        api_data:     ent.res,
        manual:       ent.manual       || {},
        price:        ent.price        || null,
        photos:       ent.photos       || [],
        analysis:     ent.analysis     || {},
        income:       ent.income       || {},
        notes:        ent.notes        || null,
        memo:         ent.memo         || null,
      };
      const d = await dbFetch('upsert', {}, body);
      // 저장 후 dbId 기억 (다음 저장 시 업데이트)
      const savedId = d.row && d.row.id;
      const patch = {};
      if (savedId) patch.dbId = savedId;
      if (d.row && d.row.created_at) patch.created_at = d.row.created_at;
      if (d.row && d.row.updated_at) patch.updated_at = d.row.updated_at;
      if (Object.keys(patch).length) up(ent.id, patch);
      setDbMsg('✅ 저장 완료 — ' + (ent.alias || ent.res.platPlc));
      // 목록 갱신
      if (showDbPanel) dbLoadList();
    } catch(e) {
      setDbMsg('❌ 저장 실패: ' + e.message);
    } finally {
      setDbSaving(p => ({...p, [ent.id]: false}));
    }
  };

  // DB에서 단건 불러와 현재 목록에 추가
  const dbLoad = async (rowId) => {
    setDbLoading(true); setDbMsg('');
    try {
      const d = await dbFetch('get', {id: rowId});
      const row = d.row;
      if (!row || !row.api_data) { setDbMsg('❌ 데이터 없음'); return; }
      const newEnt = mk(_id++);
      newEnt.res      = row.api_data;
      newEnt.alias    = row.alias    || '';
      newEnt.price    = row.price    || '';
      newEnt.manual   = row.manual   || {};
      newEnt.photos   = row.photos   || [];
      newEnt.analysis = row.analysis || {};
      newEnt.income   = row.income   || {};
      newEnt.notes    = row.notes    || '';
      newEnt.memo     = row.memo     || '';
      newEnt.dbId     = row.id;
      newEnt.created_at = row.created_at || null;
      newEnt.updated_at = row.updated_at || null;
      // sido/sg/dong은 복원 불필요 (이미 res 있음)
      setE(p => [...p, newEnt]);
      setShowDb(false);
      setDbMsg('✅ 불러오기 완료 — ' + (row.alias || row.plat_plc));
    } catch(e) {
      setDbMsg('❌ 불러오기 실패: ' + e.message);
    } finally {
      setDbLoading(false);
    }
  };

  // DB에서 단건 삭제
  const dbDelete = async (rowId, label) => {
    if (!window.confirm('삭제하시겠습니까?\n' + label)) return;
    setDbLoading(true);
    try {
      await dbFetch('delete', {id: rowId});
      setDbList(p => p.filter(r => r.id !== rowId));
      setDbMsg('🗑 삭제 완료 — ' + label);
    } catch(e) {
      setDbMsg('❌ 삭제 실패: ' + e.message);
    } finally {
      setDbLoading(false);
    }
  };

  // 피드백 메시지 자동 제거
  React.useEffect(() => {
    if (!dbMsg) return;
    const t = setTimeout(() => setDbMsg(''), 4000);
    return () => clearTimeout(t);
  }, [dbMsg]);

  // ── 출력 정보 DB 불러오기 ──
  const configLoad = async () => {
    try {
      const res = await fetch('/api/db?action=config-get&key=building-info');
      const d = await res.json();
      if (d.data) {
        if (d.data.bizName   !== undefined) setBN(d.data.bizName);
        if (d.data.bizAddr   !== undefined) setBA(d.data.bizAddr);
        if (d.data.agentName !== undefined) setAN(d.data.agentName);
        if (d.data.agentPhone!== undefined) setAP(d.data.agentPhone);
        if (d.data.logoSrc   !== undefined) setLG(d.data.logoSrc);
      } else {
        // DB에 없으면 기본값 세팅
        setBN('타임즈부동산중개');
        setBA('서울특별시 서초구 반포동 반포프라자');
        setAN('성재윤');
        setAP('010-6655-5445');
      }
      setCL(true);
    } catch(e) {
      // 네트워크 오류 시 기본값
      setBN('타임즈부동산중개');
      setBA('서울특별시 서초구 반포동 반포프라자');
      setAN('성재윤');
      setAP('010-6655-5445');
      setCL(true);
    }
  };

  // ── 출력 정보 DB 저장 (조용한 자동저장) ──
  const configSaveSilent = async () => {
    try {
      await fetch('/api/db?action=config-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'building-info',
          data: { bizName, bizAddr, agentName, agentPhone, logoSrc }
        })
      });
    } catch(e) { /* 자동저장 실패는 조용히 무시 */ }
  };

  // ── 앱 시작 시 자동으로 출력 정보 불러오기 ──
  React.useEffect(() => {
    configLoad();
  }, []);

  // ── 출력 정보 자동 저장 (디바운스) ──
  // configLoaded(초기 로드 완료) 이후에만, 변경 시 1.2초 뒤 저장
  const configTimer = React.useRef(null);
  React.useEffect(() => {
    if (!configLoaded) return;  // 초기 로드 전엔 저장 안 함 (덮어쓰기 방지)
    if (configTimer.current) clearTimeout(configTimer.current);
    configTimer.current = setTimeout(() => { configSaveSilent(); }, 1200);
  }, [bizName, bizAddr, agentName, agentPhone, logoSrc, configLoaded]);

  // ── 자동 저장 (디바운스) ──
  // 저장 대상 필드만 추려 직렬화 → 변경 시에만 1.2초 후 저장
  const saveTimers = React.useRef({});
  const lastSaved  = React.useRef({});
  React.useEffect(() => {
    ents.forEach(ent => {
      if (!ent.res) return;
      const snapshot = JSON.stringify({
        alias: ent.alias, price: ent.price, manual: ent.manual,
        photos: ent.photos, analysis: ent.analysis, income: ent.income,
        notes: ent.notes, memo: ent.memo,
        plat: ent.res.platPlc,
      });
      // 직전 저장본과 동일하면 스킵
      if (lastSaved.current[ent.id] === snapshot) return;
      // 기존 타이머 취소 후 재설정 (디바운스)
      if (saveTimers.current[ent.id]) clearTimeout(saveTimers.current[ent.id]);
      saveTimers.current[ent.id] = setTimeout(() => {
        lastSaved.current[ent.id] = snapshot;
        autoSaveById(ent.id);
      }, 1200);
    });
  }, [ents]);

  // ── 세션 자동 복원 ──
  // 현재 화면에 떠 있던 건물들의 dbId 목록을 app_config에 기록 →
  // 새로고침/다른PC 접속 시 그 목록을 자동으로 다시 불러옴
  const [sessionRestored, setSR] = React.useState(false);

  // 화면 건물 dbId 목록을 세션으로 저장 (디바운스)
  const sessionTimer = React.useRef(null);
  React.useEffect(() => {
    if (!sessionRestored) return;  // 복원 완료 전엔 저장 안 함 (덮어쓰기 방지)
    const ids = ents.filter(e => e.dbId).map(e => e.dbId);
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    sessionTimer.current = setTimeout(() => {
      fetch('/api/db?action=config-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'building-session', data: { ids } })
      }).catch(() => {});
    }, 1500);
  }, [ents, sessionRestored]);

  // 앱 시작 시 마지막 세션 건물들 자동 복원
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/db?action=config-get&key=building-session');
        const d = await res.json();
        const ids = (d.data && d.data.ids) || [];
        if (ids.length === 0) { setSR(true); return; }
        // 병렬로 동시에 불러오기 (순차 대비 훨씬 빠름)
        const results = await Promise.all(ids.map(rid =>
          fetch('/api/db?action=get&id=' + encodeURIComponent(rid))
            .then(r => r.json())
            .catch(() => null)
        ));
        const loaded = [];
        results.forEach(gd => {
          const row = gd && gd.row;
          if (row && row.api_data) {
            const ne = mk(_id++);
            ne.res      = row.api_data;
            ne.alias    = row.alias    || '';
            ne.price    = row.price    || '';
            ne.manual   = row.manual   || {};
            ne.photos   = row.photos   || [];
            ne.analysis = row.analysis || {};
            ne.income   = row.income   || {};
            ne.notes    = row.notes    || '';
            ne.memo     = row.memo     || '';
            ne.dbId     = row.id;
            ne.created_at = row.created_at || null;
            ne.updated_at = row.updated_at || null;
            ne.autoSaved = true;
            loaded.push(ne);
            lastSaved.current[ne.id] = JSON.stringify({
              alias: ne.alias, price: ne.price, manual: ne.manual,
              photos: ne.photos, analysis: ne.analysis, income: ne.income,
              notes: ne.notes, memo: ne.memo, plat: ne.res.platPlc,
            });
          }
        });
        if (loaded.length > 0) {
          setE(loaded);  // 빈 초기 엔트리 대신 복원된 건물로 교체
        }
      } catch(e) {/* 세션 복원 실패 무시 */}
      finally { setSR(true); }
    })();
  }, []);

  // ── 주소 → 좌표 자동 지오코딩 (Nominatim) ──
  const geocode = async (id, addr) => {
    if (!addr) return;
    try {
      const res = await fetch(
        'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(addr) +
        '&format=json&limit=1&countrycodes=kr',
        { headers: { 'Accept': 'application/json', 'Accept-Language': 'ko' } }
      );
      const data = await res.json();
      if (data && data[0]) {
        up(id, { mapCoords: { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } });
      }
    } catch(e) { /* 지오코딩 실패 — 사용자가 수동 설정 */ }
  };

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
      const itemArr = !raw ? [] : (Array.isArray(raw) ? raw : [raw]);
      if (itemArr.length === 0) throw new Error('결과 없음 — 네이버 지도에서 지번을 확인하세요');

      const main = itemArr.find(i => i.mainAtchGbCd === '0') || itemArr[0];
      up(ent.id, { ld:false, res:main });
      // 지오코딩 — 비동기로 좌표 자동 획득
      geocode(ent.id, main.newPlatPlc || main.platPlc);
    } catch(e) {
      up(ent.id, { ld:false, err: e.message });
    }
  };

  const sgs   = s     => Object.keys(R[s] || {}).sort();
  const ds    = (s,g) => Object.keys((R[s] && R[s][g] && R[s][g].d) || {}).sort();

  // ── 카드 → 입력폼으로 되돌려 수정 ──
  // res를 비우면 입력폼에 다시 나타남. 별칭·매매가·수기·사진 등은 그대로 보존.
  const edit = (id) => {
    setE(p => p.map(e => {
      if (e.id !== id) return e;
      // 입력값(sido/sg/dong/bj)이 비어있으면(세션 복원분) 주소에서 역추적은 어려우므로
      // 코드 직접입력 모드로 전환해 기존 res의 코드를 채워준다
      const patch = { res: null, err: null };
      if (!e.bj && e.res) {
        // 세션 복원 등으로 입력값이 없는 경우: 코드 직접입력으로 복원
        patch.man = true;
        patch.mSg = e.res.sigunguCd || '';
        patch.mD  = e.res.bjdongCd  || '';
        patch.bj  = (parseInt(e.res.bun)||0) + (parseInt(e.res.ji)>0 ? '-'+parseInt(e.res.ji) : '');
      }
      return {...e, ...patch};
    }));
    window.scrollTo({top:0, behavior:'smooth'});
  };
  const sidos = Object.keys(R);
  const rE    = ents.filter(e => e.res);          // 조회 완료 (카드 표시용)
  const pendingE = ents.filter(e => !e.res);      // 미조회 (입력폼 표시용)
  const hasR  = rE.length > 0;

  // 화면 카드: 검색(필터) → 정렬
  const rEFiltered = filterRows(rE, cardFilter);
  const isManualOrder = cardSort.key === 'none';   // 직접 배치 모드
  const rESorted   = sortItems(rEFiltered, cardSort.key, cardSort.asc);
  const cardHasFilter = cardFilter.kw || (cardFilter.dongs && cardFilter.dongs.length) || cardFilter.priceMin || cardFilter.priceMax || cardFilter.areaMin || cardFilter.areaMax;
  // 화면 카드에 존재하는 행정동 목록 (다중선택 칩용)
  const availableDongs = Array.from(new Set(rE.map(valDong).filter(Boolean))).sort((a,b) => a.localeCompare(b,'ko'));
  const selCount = rE.filter(e => e.printSel).length;   // 출력 선택된 건수
  // 저장 목록: 정렬만 (검색은 카드 화면으로 이동)
  const dbShown  = sortItems(dbList, dbSort.key, dbSort.asc);

  // 카드 직접 배치 — fromId 카드를 toId 위치로 이동 (ents 전체 기준, id로 정확히)
  const moveCard = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    setE(prev => {
      const arr = [...prev];
      const fi = arr.findIndex(e => e.id === fromId);
      const ti = arr.findIndex(e => e.id === toId);
      if (fi < 0 || ti < 0) return prev;
      const [moved] = arr.splice(fi, 1);
      arr.splice(ti, 0, moved);
      return arr;
    });
  };
  // 행정동 칩 토글
  const toggleDong = (dong) => setCardFilter(f => {
    const cur = f.dongs || [];
    return { ...f, dongs: cur.includes(dong) ? cur.filter(d => d !== dong) : [...cur, dong] };
  });

  // 입력폼에 빈 행이 항상 1개는 있도록 보장
  React.useEffect(() => {
    if (pendingE.length === 0) {
      setE(p => [...p, mk(_id++)]);
    }
  }, [pendingE.length]);

  // 정렬 드롭다운 (공용) — where: 'db' | 'card'
  const SortControl = ({ sort, setSort, includeNone }) => (
    <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
      <select value={sort.key} onChange={v => setSort(s => ({...s, key:v.target.value}))}
        style={{fontSize:'11px',padding:'4px 6px'}}>
        {includeNone && <option value="none">직접 배치(드래그)</option>}
        {Object.keys(SORT_DEFS).map(k => <option key={k} value={k}>{SORT_DEFS[k].l}</option>)}
      </select>
      <button onClick={() => setSort(s => ({...s, asc:!s.asc}))}
        disabled={sort.key === 'none'}
        title={sort.asc ? '오름차순' : '내림차순'}
        style={{fontSize:'11px',padding:'4px 8px',cursor: sort.key==='none' ? 'default' : 'pointer',
                background: sort.key==='none' ? '#eee' : '#fff', border:'1px solid #ccc', color:'#555', minWidth:'34px'}}>
        {sort.asc ? '↑' : '↓'}
      </button>
    </div>
  );

  return (
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:'#f7f4ef',minHeight:'100vh',color:'#1a1a2e'}}>

      {/* 헤더 — 화면 전용 */}
      <header className="no-print" style={{background:'#0d1b2a',padding:'18px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:'10px',letterSpacing:'0.15em',color:'#c9a84c',marginBottom:'3px'}}>TIMES REAL ESTATE · 타임즈부동산중개</div>
          <div style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'22px',color:'#f7f4ef',fontWeight:400}}>Building Info</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          {/* DB 패널 토글 버튼 */}
          <button
            onClick={() => { setShowDb(p => !p); if(!showDbPanel) dbLoadList(); }}
            style={{background: showDbPanel ? '#c9a84c' : 'transparent', border:'1px solid #c9a84c', color: showDbPanel ? '#0d1b2a' : '#c9a84c', padding:'7px 14px', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}>
            🗄 저장 목록
            {dbList.length > 0 && <span style={{background:'#c9a84c',color:'#0d1b2a',borderRadius:'10px',padding:'0px 6px',fontSize:'10px',fontWeight:700,marginLeft:'2px'}}>{dbList.length}</span>}
          </button>
          <div style={{fontSize:'11px',color:'#c9a84c',border:'1px solid #c9a84c',padding:'6px 12px',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'2px'}}>
            <span>건축물대장정보 서비스</span>
            <span style={{fontSize:'9px',opacity:0.7,letterSpacing:'0.05em'}}>{VERSION}</span>
          </div>
        </div>
      </header>

      {/* ── DB 저장 목록 패널 ── */}
      {showDbPanel && (
        <div className="no-print" style={{background:'#0d1b2a',borderBottom:'2px solid #c9a84c',padding:'14px 28px'}}>
          <div style={{maxWidth:'1280px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',flexWrap:'wrap',gap:'8px'}}>
              <span style={{color:'#c9a84c',fontSize:'12px',fontWeight:600,letterSpacing:'0.1em'}}>
                🗄 저장된 건물 목록
                {dbList.length > 0 && (
                  <span style={{color:'#888',fontWeight:400,marginLeft:'8px'}}>전체 {dbList.length}건</span>
                )}
              </span>
              <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                {dbMsg && (
                  <span style={{fontSize:'12px',color: dbMsg.startsWith('✅') ? '#7fdc8a' : dbMsg.startsWith('🗑') ? '#f0c060' : '#f08080', background:'rgba(255,255,255,0.08)', padding:'4px 10px'}}>
                    {dbMsg}
                  </span>
                )}
                <span style={{fontSize:'11px',color:'#888'}}>정렬</span>
                <SortControl sort={dbSort} setSort={setDbSort} includeNone={false} />
                <button onClick={dbLoadList} disabled={dbLoading}
                  style={{background:'transparent',border:'1px solid #555',color:'#aaa',padding:'5px 10px',fontSize:'11px',cursor:'pointer'}}>
                  {dbLoading ? '로딩…' : '🔄 새로고침'}
                </button>
                <button onClick={() => setShowDb(false)}
                  style={{background:'transparent',border:'none',color:'#666',fontSize:'18px',cursor:'pointer',lineHeight:1,padding:'4px'}}>×</button>
              </div>
            </div>

            {dbList.length === 0 && !dbLoading && (
              <div style={{color:'#555',fontSize:'12px',padding:'16px 0',textAlign:'center'}}>저장된 건물이 없습니다. 건물 조회 후 💾 저장 버튼을 누르세요.</div>
            )}
            {dbLoading && (
              <div style={{color:'#888',fontSize:'12px',padding:'16px 0',textAlign:'center'}}>불러오는 중…</div>
            )}
            {!dbLoading && dbShown.length > 0 && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'8px',maxHeight:'min(55vh, 460px)',overflowY:'auto'}}>
                {dbShown.map(row => {
                  const ppy = valPpyo(row);
                  const ar  = valPlatArea(row);
                  return (
                  <div key={row.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid #2a3a4a',padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'12px',color:'#f7f4ef',fontWeight:600,marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {row.alias || row.bld_nm || row.plat_plc || '이름 없음'}
                      </div>
                      <div style={{fontSize:'10px',color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {row.plat_plc || '—'}
                      </div>
                      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'3px'}}>
                        {row.price && <span style={{fontSize:'10px',color:'#c9a84c'}}>{row.price}억원</span>}
                        {ppy > 0 && <span style={{fontSize:'10px',color:'#8aa'}}>평당 {ppy.toLocaleString()}만</span>}
                        {ar > 0 && <span style={{fontSize:'10px',color:'#8aa'}}>대지 {(ar/PY).toFixed(0)}평</span>}
                      </div>
                      <div style={{fontSize:'9px',color:'#555',marginTop:'3px'}}>
                        {row.updated_at ? '수정 ' + new Date(row.updated_at).toLocaleDateString('ko-KR') : ''}
                        {row.created_at && row.created_at !== row.updated_at ? '  ·  등록 ' + new Date(row.created_at).toLocaleDateString('ko-KR') : ''}
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'4px',flexShrink:0}}>
                      <button onClick={() => dbLoad(row.id)}
                        style={{background:'#1a3a5a',border:'1px solid #3a6fa0',color:'#7fb8f0',padding:'4px 8px',fontSize:'11px',cursor:'pointer',whiteSpace:'nowrap'}}>
                        📂 불러오기
                      </button>
                      <button onClick={() => dbDelete(row.id, row.alias || row.plat_plc || 'ID:'+row.id.slice(0,8))}
                        style={{background:'transparent',border:'1px solid #4a2a2a',color:'#c08080',padding:'4px 8px',fontSize:'11px',cursor:'pointer'}}>
                        🗑 삭제
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 입력 패널 — 화면 전용 */}
      <section className="no-print" style={{background:'#ede9e1',padding:'18px 28px 20px',borderBottom:'1px solid #d8d4cc'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <span style={{fontSize:'11px',color:'#888'}}>
              건물 조회 · 입력 후 조회하면 아래 카드에 추가됩니다
              {!sessionRestored && <span style={{marginLeft:'8px',color:'#c9a84c'}}>⏳ 저장된 건물 불러오는 중…</span>}
              {sessionRestored && rE.length > 0 && <span style={{marginLeft:'8px',color:'#c9a84c'}}>(저장된 건물 {rE.length}건)</span>}
            </span>
            <div style={{display:'flex',gap:'8px'}}>
              {pendingE.length > 1 && (
                <button className="bdk" onClick={() => pendingE.forEach(e => go(e))}>
                  {pendingE.some(e => e.ld) ? '조회 중…' : '전체 조회 ▶'}
                </button>
              )}
            </div>
          </div>
          {pendingE.map((e, i) => <ERow key={e.id} e={e} i={i} n={pendingE.length} sidos={sidos} sgs={sgs} ds={ds} up={up} rm={rm} go={go} />)}

          {/* 건물 추가 — 마지막 행 바로 아래 */}
          <button className="blt" style={{fontSize:'12px',padding:'8px 18px',marginTop:'4px',display:'flex',alignItems:'center',gap:'6px'}}
            onClick={add}>
            <span style={{fontSize:'16px',lineHeight:1}}>+</span> 입력란 추가
          </button>
          <p style={{fontSize:'11px',color:'#aaa',marginTop:'8px',lineHeight:1.7}}>
            ※ 동 코드가 없으면 "코드 직접입력"으로 시군구코드(5자리)·법정동코드(5자리)를 직접 입력하세요.
          </p>
        </div>
      </section>

      {/* 뷰 전환 + 인쇄 — 화면 전용 (스크롤해도 상단 고정) */}
      {hasR && (
        <div className="no-print" style={{position:'sticky',top:0,zIndex:90,background:'#f7f4ef',borderBottom:'1px solid #e0dcd4',boxShadow:'0 2px 6px rgba(0,0,0,0.06)'}}>
          <div style={{padding:'12px 28px',display:'flex',gap:'8px',justifyContent:'space-between',maxWidth:'1280px',margin:'0 auto',flexWrap:'wrap',alignItems:'center'}}>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
              <button className={vw==='cards'  ? 'bdk' : 'blt'} style={{fontSize:'12px',padding:'7px 14px'}} onClick={() => setV('cards')}>▣ 카드</button>
              <button className={vw==='table'  ? 'bdk' : 'blt'} style={{fontSize:'12px',padding:'7px 14px'}} onClick={() => setV('table')}>≡ 비교표</button>
              <button className={vw==='report' ? 'bdk' : 'blt'} style={{fontSize:'12px',padding:'7px 14px'}} onClick={() => setV('report')}>📄 리포트</button>
              <span style={{width:'1px',height:'20px',background:'#d8d4cc',margin:'0 4px'}} />
              <span style={{fontSize:'11px',color:'#aaa'}}>정렬</span>
              <SortControl sort={cardSort} setSort={setCardSort} includeNone={true} />
            </div>
            <div style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
              {vw === 'cards' && <>
                <span style={{fontSize:'11px',color:'#aaa'}}>인쇄 방향:</span>
                <button className={printMode==='landscape' ? 'bdk' : 'blt'} style={{fontSize:'11px',padding:'5px 10px'}} onClick={() => setPM('landscape')}>가로 3칸</button>
                <button className={printMode==='portrait'  ? 'bdk' : 'blt'} style={{fontSize:'11px',padding:'5px 10px'}} onClick={() => setPM('portrait')}>세로 4칸</button>
              </>}
              <input type="text" placeholder="보고서 제목" value={reportTitle}
                onChange={v => setRT(v.target.value)}
                style={{width:'180px',fontSize:'12px'}} />
              <input type="date" value={reportDate}
                onChange={v => setRD(v.target.value)}
                style={{fontSize:'12px',width:'140px'}} />
              <button className="bdk" style={{fontSize:'12px'}} onClick={() => { if (selCount === 0) { setDbMsg('출력할 건물을 선택하세요'); return; } window.print(); }}>🖨 인쇄 / PDF</button>
            </div>
          </div>
          {/* 출력 선택 컨트롤 줄 — 모든 뷰 공통 */}
          <div style={{borderTop:'1px solid #ece8e0',background:'#f2efe8'}}>
            <div style={{padding:'8px 28px',maxWidth:'1280px',margin:'0 auto',display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
              <span style={{fontSize:'11px',color:'#555',whiteSpace:'nowrap'}}>
                출력 선택 <b style={{color:'#0d1b2a',fontSize:'13px'}}>{selCount}</b>
                <span style={{color:'#999'}}> / {rE.length}건</span>
              </span>
              <button className="blt" style={{fontSize:'11px',padding:'5px 12px'}} onClick={selectAllCards}>☑ 전체 선택</button>
              <button className="blt" style={{fontSize:'11px',padding:'5px 12px'}} onClick={selectNoneCards}>☐ 선택 해제</button>
              <button className="blt" style={{fontSize:'11px',padding:'5px 12px',color:'#c0392b',borderColor:'#e8b4b0'}} onClick={deleteSelectedCards}>🗑 선택 삭제</button>
              <span style={{fontSize:'11px',color:'#999',marginLeft:'auto',whiteSpace:'nowrap'}}>🖨 인쇄·PDF는 선택된 건물만 출력됩니다</span>
            </div>
          </div>
          {/* 카드 검색 줄 */}
          <div style={{borderTop:'1px solid #ece8e0',background:'#fbf9f5'}}>
            <div style={{padding:'9px 28px',maxWidth:'1280px',margin:'0 auto',display:'flex',gap:'12px',flexWrap:'wrap',alignItems:'center'}}>
              <span style={{fontSize:'11px',color:'#c9a84c',fontWeight:600,whiteSpace:'nowrap'}}>🔍 검색</span>
              <input type="text" value={cardFilter.kw} placeholder="건물명·별칭·주소"
                onChange={v => setCardFilter(f => ({...f, kw:v.target.value}))}
                style={{width:'190px',fontSize:'12px',padding:'5px 8px'}} />
              <span style={{fontSize:'11px',color:'#999',whiteSpace:'nowrap'}}>매매가(억)</span>
              <div style={{display:'flex',alignItems:'center',gap:'3px'}}>
                <input type="text" inputMode="decimal" value={cardFilter.priceMin} placeholder="최소"
                  onChange={v => setCardFilter(f => ({...f, priceMin:v.target.value}))}
                  style={{width:'60px',fontSize:'12px',padding:'5px 6px'}} />
                <span style={{color:'#aaa',fontSize:'11px'}}>~</span>
                <input type="text" inputMode="decimal" value={cardFilter.priceMax} placeholder="최대"
                  onChange={v => setCardFilter(f => ({...f, priceMax:v.target.value}))}
                  style={{width:'60px',fontSize:'12px',padding:'5px 6px'}} />
              </div>
              <span style={{fontSize:'11px',color:'#999',whiteSpace:'nowrap'}}>대지(평)</span>
              <div style={{display:'flex',alignItems:'center',gap:'3px'}}>
                <input type="text" inputMode="decimal" value={cardFilter.areaMin} placeholder="최소"
                  onChange={v => setCardFilter(f => ({...f, areaMin:v.target.value}))}
                  style={{width:'60px',fontSize:'12px',padding:'5px 6px'}} />
                <span style={{color:'#aaa',fontSize:'11px'}}>~</span>
                <input type="text" inputMode="decimal" value={cardFilter.areaMax} placeholder="최대"
                  onChange={v => setCardFilter(f => ({...f, areaMax:v.target.value}))}
                  style={{width:'60px',fontSize:'12px',padding:'5px 6px'}} />
              </div>
              {cardHasFilter && (
                <>
                  <button onClick={() => setCardFilter({ kw:'', dongs:[], priceMin:'', priceMax:'', areaMin:'', areaMax:'' })}
                    className="blt" style={{fontSize:'11px',padding:'5px 12px'}}>초기화</button>
                  <span style={{fontSize:'11px',color:'#888'}}>{rE.length}건 중 <b style={{color:'#0d1b2a'}}>{rEFiltered.length}건</b> 표시</span>
                </>
              )}
            </div>
            {/* 행정동 다중선택 칩 */}
            {availableDongs.length > 1 && (
              <div style={{padding:'0 28px 9px',maxWidth:'1280px',margin:'0 auto',display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
                <span style={{fontSize:'11px',color:'#999',whiteSpace:'nowrap',marginRight:'2px'}}>행정동</span>
                {availableDongs.map(d => {
                  const on = (cardFilter.dongs || []).includes(d);
                  return (
                    <button key={d} onClick={() => toggleDong(d)}
                      style={{fontSize:'11px',padding:'3px 10px',cursor:'pointer',borderRadius:'12px',
                        border:'1px solid ' + (on ? '#0d1b2a' : '#d8d4cc'),
                        background: on ? '#0d1b2a' : '#fff', color: on ? '#fff' : '#666'}}>
                      {d}{on ? ' ✓' : ''}
                    </button>
                  );
                })}
                {cardFilter.dongs && cardFilter.dongs.length > 0 && (
                  <button onClick={() => setCardFilter(f => ({...f, dongs:[]}))}
                    style={{fontSize:'10px',padding:'3px 8px',cursor:'pointer',border:'none',background:'none',color:'#aaa',textDecoration:'underline'}}>
                    동 선택 해제
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 인쇄 방향 동적 스타일 */}
      <style dangerouslySetInnerHTML={{__html:
        vw === 'report'
          ? ('@media print { @page { size: A4 portrait !important; margin: 10mm 12mm 12mm; }'
            + ' html, body { background: #ffffff !important; }'
            + ' .print-main { padding: 0 !important; max-width: 100% !important; margin: 0 !important; background: #ffffff !important; }'
            + ' .report-card { page-break-after: always; break-after: page; margin-bottom: 0 !important;'
            + '   display: flex !important; flex-direction: column !important; min-height: 271mm; box-sizing: border-box; }'
            + ' .report-card.print-hide { display: none !important; }'
            + ' .report-card.report-card-lastsel { page-break-after: auto !important; break-after: auto !important; }'
            + ' .report-card:last-child { page-break-after: auto; break-after: auto; }'
            + ' .report-body { flex: 1 1 auto !important; }'              /* 본문이 남는 공간 차지 */
            + ' .report-footer { margin-top: auto !important; }'          /* 푸터 페이지 하단 고정 */
            + ' }')
          : vw === 'table'
            ? ('@media print { @page { size: A4 landscape !important; margin: 10mm 10mm 14mm; } }')
            : printMode === 'landscape'
              ? ('@media print { @page { size: A4 landscape !important; margin: 16mm 10mm 14mm;'
                + ' @top-left { content: "' + (reportTitle||'건축물대장 비교') + '"; font-size: 15pt; font-weight: bold; color: #0d1b2a; font-family: sans-serif; vertical-align: bottom; }'
                + ' @top-right { content: "' + (bizName||'타임즈부동산중개') + '   ·   ' + reportDate + '"; font-size: 8pt; color: #888; font-family: sans-serif; vertical-align: bottom; }'
                + ' @bottom-left { content: "' + (bizName||'') + (bizAddr ? '  |  ' + bizAddr : '') + '"; font-size: 8pt; color: #555; font-family: sans-serif; }'
                + ' @bottom-right { content: "' + (agentName||'') + (agentPhone ? '   ' + agentPhone : '') + '"; font-size: 8pt; color: #555; font-family: sans-serif; }'
                + ' } html, body { background: #ffffff !important; }'
                + ' .print-main { padding: 0 !important; max-width: 100% !important; margin: 0 !important; background: #ffffff !important; }'
                + ' .ph { display: none !important; } .cg { grid-template-columns: 1fr 1fr 1fr !important; padding-top: 0 !important; gap: 10px !important; background: #ffffff !important; }'
                + ' .pci { break-inside: avoid !important; page-break-inside: avoid !important; background: #ffffff !important; } }')
              : ('@media print { @page { size: A4 portrait !important; margin: 16mm 10mm 14mm;'
                + ' @top-left { content: "' + (reportTitle||'건축물대장 비교') + '"; font-size: 15pt; font-weight: bold; color: #0d1b2a; font-family: sans-serif; vertical-align: bottom; }'
                + ' @top-right { content: "' + (bizName||'타임즈부동산중개') + '   ·   ' + reportDate + '"; font-size: 8pt; color: #888; font-family: sans-serif; vertical-align: bottom; }'
                + ' @bottom-left { content: "' + (bizName||'') + (bizAddr ? '  |  ' + bizAddr : '') + '"; font-size: 9pt; font-weight: bold; color: #0d1b2a; font-family: sans-serif; }'
                + ' @bottom-right { content: "' + (agentName||'') + (agentPhone ? '   ' + agentPhone : '') + '"; font-size: 9pt; font-weight: bold; color: #0d1b2a; font-family: sans-serif; }'
                + ' } html, body { background: #ffffff !important; }'
                + ' .print-main { padding: 0 !important; max-width: 100% !important; margin: 0 !important; background: #ffffff !important; }'
                + ' .ph { display: none !important; } .cg { grid-template-columns: 1fr 1fr !important; padding-top: 0 !important; gap: 10px !important; background: #ffffff !important; }'
                + ' .pci { font-size: 9pt !important; break-inside: avoid !important; page-break-inside: avoid !important; background: #ffffff !important; } .pci table td, .pci table th { padding: 3pt 4pt !important; font-size: 8pt !important; } }')
      }} />

      {/* 인쇄 헤더 — 카드 뷰에서만 표시 */}
      {/* 카드 인쇄 헤더는 CSS @top-left/@top-center/@top-right 마진박스로 처리 (DOM 제거) */}

      {/* 결과 영역 */}
      <main style={{padding:'10px 28px 48px',maxWidth:'1280px',margin:'0 auto'}} className="print-main">
        {!hasR && (
          <div style={{textAlign:'center',padding:'80px 0',color:'#ccc'}}>
            <div style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'28px',marginBottom:'10px'}}>건물을 조회하면 결과가 표시됩니다</div>
            <div style={{fontSize:'12px',color:'#bbb'}}>번지를 입력하고 조회 버튼을 누르세요</div>
          </div>
        )}
        {hasR && vw==='cards' && (
          <>
            {cardHasFilter && rESorted.length === 0 && (
              <div className="no-print" style={{textAlign:'center',padding:'40px 0',color:'#aaa',fontSize:'13px'}}>
                검색 조건에 맞는 건물이 없습니다.
                <button onClick={() => setCardFilter({ kw:'', dongs:[], priceMin:'', priceMax:'', areaMin:'', areaMax:'' })}
                  className="blt" style={{fontSize:'11px',padding:'4px 12px',marginLeft:'10px'}}>검색 초기화</button>
              </div>
            )}
            {isManualOrder && rESorted.length > 1 && (
              <div className="no-print" style={{fontSize:'11px',color:'#c9a84c',background:'#fbf6e9',border:'1px solid #ece0c0',padding:'6px 12px',marginBottom:'10px',display:'inline-block'}}>
                ✋ 직접 배치 모드 — 카드를 끌어다 놓아 순서를 바꿀 수 있습니다{cardHasFilter ? ' (검색 필터를 해제하면 더 편합니다)' : ''}
              </div>
            )}
            <div className="cg" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'18px',paddingTop:'8px',paddingBottom:'0'}}>
              {rESorted.map((e, i) => (
                <div key={e.id}
                  draggable={isManualOrder}
                  onDragStart={isManualOrder ? (() => setDraggingId(e.id)) : undefined}
                  onDragOver={isManualOrder ? (ev => ev.preventDefault()) : undefined}
                  onDrop={isManualOrder ? (() => { moveCard(draggingId, e.id); setDraggingId(null); }) : undefined}
                  onDragEnd={isManualOrder ? (() => setDraggingId(null)) : undefined}
                  style={{
                    opacity: draggingId === e.id ? 0.4 : 1,
                    cursor: isManualOrder ? 'grab' : 'default',
                    outline: (isManualOrder && draggingId && draggingId !== e.id) ? '2px dashed #c9a84c' : 'none',
                    outlineOffset: '2px',
                    transition: 'opacity 0.15s',
                  }}>
                  <RCard e={e} i={i} onTogglePrint={togglePrint} onDelete={() => rm(e.id)} onManual={upManual} onSave={() => dbSave(e)} isSaving={dbSaving[e.id]} dbMsg={dbMsg} onEdit={() => edit(e.id)} dragHandle={isManualOrder} />
                </div>
              ))}
            </div>

            {/* 카드 하단 건물추가 + 전체삭제 */}
            <div className="no-print" style={{display:'flex',justifyContent:'center',gap:'10px',marginTop:'24px',paddingBottom:'8px',flexDirection:'column',alignItems:'center'}}>
              {dbMsg && (
                <div style={{fontSize:'12px',padding:'6px 16px',background: dbMsg.startsWith('✅') ? '#f0fff4' : '#fff5f4', color: dbMsg.startsWith('✅') ? '#2e7d32' : '#c0392b', border:'1px solid ' + (dbMsg.startsWith('✅') ? '#a8d5b0' : '#e8b4b0')}}>
                  {dbMsg}
                </div>
              )}
              <div style={{display:'flex',gap:'10px'}}>
                <button className="blt" style={{fontSize:'12px',padding:'9px 22px'}}
                  onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); }}>
                  ↑ 새 건물 입력하기
                </button>
                {rE.length > 0 && (
                  <button className="blt" style={{fontSize:'12px',padding:'9px 22px',color:'#c0392b',borderColor:'#e8b4b0'}}
                    onClick={() => { if(window.confirm('화면의 모든 건물을 닫으시겠습니까?\n(DB 저장 목록에는 그대로 남아있습니다)')) setE([mk(_id++)]); }}>
                    화면 비우기
                  </button>
                )}
              </div>
            </div>

            {/* 카드 인쇄 푸터 — @bottom-center CSS로 대체됨 */}
          </>
        )}
        {hasR && vw==='table'  && <CmpT entries={rESorted} togglePrint={togglePrint} printMode={printMode} reportTitle={reportTitle} reportDate={reportDate} totalSel={rE.filter(e=>e.printSel).length} bizName={bizName} bizAddr={bizAddr} agentName={agentName} agentPhone={agentPhone} logoSrc={logoSrc} />}
        {hasR && vw==='report' && <ReportView entries={rESorted} reportTitle={reportTitle} reportDate={reportDate} bizName={bizName} bizAddr={bizAddr} agentName={agentName} agentPhone={agentPhone} logoSrc={logoSrc} upAnalysis={upAnalysis} upIncome={upIncome} addPhoto={addPhoto} rmPhoto={rmPhoto} setMapPhoto={setMapPhoto} upNotes={upNotes} onSave={dbSave} dbSaving={dbSaving} onEdit={edit} togglePrint={togglePrint} />}
      </main>

      {/* ── 출력 정보 설정 패널 (화면 전용) ── */}
      <div className="no-print" style={{position:'fixed',bottom:0,left:0,right:0,background:'#ede9e1',borderTop:'1px solid #d8d4cc',zIndex:100}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 28px'}}>
          <button onClick={() => setSB(p => !p)}
            style={{background:'none',border:'none',cursor:'pointer',padding:'8px 0',fontSize:'11px',color:'#888',width:'100%',textAlign:'left',display:'flex',alignItems:'center',gap:'6px'}}>
            <span style={{fontSize:'14px'}}>▲</span>
            출력 정보 설정 (로고·상호·담당자·연락처)
            {!configLoaded
              ? <span style={{fontSize:'10px',color:'#c9a84c',marginLeft:'6px'}}>불러오는 중…</span>
              : <span style={{fontSize:'10px',color:'#999',marginLeft:'6px'}}>· 입력 시 자동 저장됩니다</span>}
            <span style={{marginLeft:'auto',fontSize:'10px',color:'#c9a84c'}}>
              {showBiz ? '접기 ▼' : '펼치기 ▲'}
            </span>
          </button>
          {showBiz && (
            <div style={{paddingBottom:'14px',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'flex-end'}}>
              {/* 로고 */}
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <span style={{fontSize:'10px',color:'#888'}}>로고 이미지</span>
                <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                  <label style={{background:'#0d1b2a',color:'#c9a84c',padding:'5px 10px',fontSize:'11px',cursor:'pointer',border:'none'}}>
                    파일 선택
                    <input type="file" accept="image/*" style={{display:'none'}}
                      onClick={ev => { ev.target.value = ''; }}
                      onChange={ev => {
                        const file = ev.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = e => setLG(e.target.result);
                        reader.readAsDataURL(file);
                      }} />
                  </label>
                  {logoSrc && <img src={logoSrc} style={{height:'32px',objectFit:'contain',border:'1px solid #e0dcd4'}} />}
                  {logoSrc && <button onClick={() => setLG('')} style={{background:'none',border:'none',color:'#ccc',cursor:'pointer',fontSize:'16px'}}>×</button>}
                </div>
              </div>
              {/* 상호 */}
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <span style={{fontSize:'10px',color:'#888'}}>상호</span>
                <input type="text" value={bizName} onChange={v => setBN(v.target.value)} style={{width:'160px',fontSize:'12px'}} />
              </div>
              {/* 주소 */}
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <span style={{fontSize:'10px',color:'#888'}}>주소</span>
                <input type="text" value={bizAddr} onChange={v => setBA(v.target.value)} style={{width:'260px',fontSize:'12px'}} />
              </div>
              {/* 담당자 */}
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <span style={{fontSize:'10px',color:'#888'}}>담당자</span>
                <input type="text" placeholder="이름" value={agentName} onChange={v => setAN(v.target.value)} style={{width:'100px',fontSize:'12px'}} />
              </div>
              {/* 연락처 */}
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <span style={{fontSize:'10px',color:'#888'}}>연락처</span>
                <input type="text" placeholder="010-0000-0000" value={agentPhone} onChange={v => setAP(v.target.value)} style={{width:'130px',fontSize:'12px'}} />
              </div>
              {/* 자동 저장 안내 */}
              <div style={{display:'flex',flexDirection:'column',gap:'4px',justifyContent:'flex-end'}}>
                <span style={{fontSize:'11px',color:'#2e7d32',background:'#f0fff4',border:'1px solid #a8d5b0',padding:'7px 14px',whiteSpace:'nowrap',height:'32px',display:'flex',alignItems:'center',gap:'5px',boxSizing:'border-box'}}>
                  ✅ 자동 저장됨
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 고정 패널 높이만큼 여백 */}
      <div className="no-print" style={{height: showBiz ? '120px' : '40px'}} />
    </div>
  );
}

// ── 인쇄 푸터 ──
function PrintFooter({ bizName, bizAddr, agentName, agentPhone, logoSrc }) {
  if (!bizName && !bizAddr && !agentName && !agentPhone && !logoSrc) return null;
  return (
    <div style={{marginTop:'10pt',paddingTop:'6pt',borderTop:'0.8pt solid #c9a84c',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'8pt',color:'#555',lineHeight:1.4}}>
      <div style={{display:'flex',alignItems:'center',gap:'8pt'}}>
        {logoSrc && <img src={logoSrc} style={{height:'22pt',objectFit:'contain',marginRight:'4pt'}} />}
        <div>
          {bizName && <div style={{fontWeight:700,fontSize:'9pt',color:'#0d1b2a',letterSpacing:'0.03em'}}>{bizName}</div>}
          {bizAddr && <div style={{color:'#666'}}>{bizAddr}</div>}
        </div>
      </div>
      {(agentName || agentPhone) && (
        <div style={{textAlign:'right'}}>
          {agentName && <div style={{fontWeight:600,color:'#0d1b2a'}}>{agentName}</div>}
          {agentPhone && <div style={{color:'#666'}}>{agentPhone}</div>}
        </div>
      )}
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
              onChange={v => up(e.id, {mSg:v.target.value})} style={{width:'140px',flexShrink:0}} />
            <input type="text" placeholder="법정동코드 5자리" value={e.mD}
              onChange={v => up(e.id, {mD:v.target.value})} style={{width:'140px',flexShrink:0}} />
          </>
        )}

        <input type="text" placeholder="번지 (예: 1-1)" value={e.bj}
          onChange={v => up(e.id, {bj:v.target.value})}
          onKeyDown={k => k.key === 'Enter' && go(e)}
          style={{width:'100px',flexShrink:0}} />

        <input type="text" placeholder="건물명 (선택)" value={e.alias}
          onChange={v => up(e.id, {alias:v.target.value})} style={{width:'100px',flexShrink:0}} />

        <input type="text" inputMode="decimal" placeholder="매매가(억)" value={e.price}
          onChange={v => up(e.id, {price:v.target.value})}
          onKeyDown={k => (k.key === 'Enter' || k.keyCode === 13) && go(e)}
          style={{width:'88px',flexShrink:0}} />

        <label style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',color:'#999',cursor:'pointer',whiteSpace:'nowrap',paddingTop:'8px',userSelect:'none',flexShrink:0}}>
          <input type="checkbox" checked={e.man} onChange={v => up(e.id, {man:v.target.checked})} />
          코드 직접입력
        </label>

        <button className="bdk" style={{fontSize:'12px',padding:'7px 14px',flexShrink:0,minWidth:'72px'}}
          onClick={() => go(e)} disabled={e.ld}>
          {e.ld ? (e.dbId ? '저장 중…' : '조회 중…') : (e.dbId ? '저장' : '조회')}
        </button>

        {n > 1 && (
          <button onClick={() => rm(e.id)}
            style={{background:'transparent',border:'none',color:'#ccc',fontSize:'18px',cursor:'pointer',lineHeight:1,padding:'4px 6px',marginLeft:'auto',flexShrink:0}}>×</button>
        )}
      </div>
      {e.err && <div style={{marginTop:'8px',marginLeft:'34px',fontSize:'12px',color:'#c0392b',background:'#fff5f4',padding:'6px 10px'}}>⚠ {e.err}</div>}
    </div>
  );
}

// ── 결과 카드 ──
function RCard({ e, i, onTogglePrint, onDelete, onManual, onSave, isSaving, onEdit, dragHandle }) {
  const it = e.res;
  const m  = e.manual || {};
  const [showManual, setShowManual] = React.useState(false);

  // 값 해석: manual 우선, 없으면 API 데이터
  const val = (field) => {
    if (m[field] && parseFloat(m[field]) > 0) return m[field];
    return it[field];
  };

  // 수기 대지면적으로 건폐율·용적률 자동 계산
  const manualPlat = m.platArea && parseFloat(m.platArea) > 0 ? parseFloat(m.platArea) : null;
  const autoBcRat = (manualPlat && it.archArea && parseFloat(it.archArea) > 0)
    ? (parseFloat(it.archArea) / manualPlat * 100).toFixed(1) : null;
  const autoVlRat = (manualPlat && parseFloat(it.vlRatEstmTotArea || it.totArea || '0') > 0)
    ? (parseFloat(it.vlRatEstmTotArea || it.totArea) / manualPlat * 100).toFixed(1) : null;

  const platArea = val('platArea');
  const bcRat    = m.bcRat || autoBcRat || it.bcRat;   // 수기 > 자동계산 > API
  const vlRat    = m.vlRat || autoVlRat || it.vlRat;
  const hhldCnt  = val('hhldCnt');

  // 누락된 핵심 필드 확인
  const missingPlatArea = !platArea || parseFloat(platArea) <= 0;
  const hasMissing = missingPlatArea ||
    !bcRat || parseFloat(bcRat) <= 0 ||
    !vlRat || parseFloat(vlRat) <= 0;

  // 토지이음 PNU: sigunguCd(5) + bjdongCd(5) + 산여부(1: 대지=1,산=2) + bun(4) + ji(4)
  // 건축물대장 platGbCd: 0=대지, 1=산 → PNU: 1=대지, 2=산
  const pnuGbn = it.platGbCd === '1' ? '2' : '1';
  const pnu = (it.sigunguCd && it.bjdongCd && it.bun)
    ? it.sigunguCd + it.bjdongCd + pnuGbn + it.bun + (it.ji || '0000')
    : null;
  const eumUrl  = pnu
    ? 'https://www.eum.go.kr/web/ar/lu/luLandUseInfo.do?pnu=' + pnu
    : 'https://www.eum.go.kr';
  // 서울 부동산정보광장 — 지번 검색
  const landUrl = 'https://land.seoul.go.kr/land/central/LandCentralSearch.do?searchKeyword='
    + encodeURIComponent((it.platPlc||'').replace('번지','').trim());
  // 네이버 지도 검색 (항상 작동하는 대안)
  const naverUrl = 'https://map.naver.com/v5/search/' + encodeURIComponent(it.platPlc||'');

  const title = e.alias || it.bldNm || it.platPlc;

  // 매매가 & 대지 평단가
  const priceNum = e.price && parseFloat(e.price) > 0 ? parseFloat(e.price) : null;
  const platPy   = platArea && parseFloat(platArea) > 0 ? parseFloat(platArea) / PY : null;
  const ppPy     = (priceNum && platPy) ? Math.round(priceNum * 10000 / platPy).toLocaleString() : null;

  // 상단 3칸
  const s3 = [
    { l:'건폐율', v: pct(bcRat) },
    { l:'용적률', v: pct(vlRat) },
    { l:'세대수', v: hhldCnt ? parseInt(hhldCnt).toLocaleString() + '세대' : '—' },
  ];

  // 하단 rows
  const elvt = (parseInt(it.rideUseElvtCnt) || parseInt(it.emgenUseElvtCnt))
    ? '승용 ' + (parseInt(it.rideUseElvtCnt)||0) + '대 / 비상 ' + (parseInt(it.emgenUseElvtCnt)||0) + '대' : '—';
  const rows = [
    { l:'연면적',   v: m2(it.totArea) },
    { l:'건축면적', v: m2(it.archArea) },
    { l:'층수',     v: '지상 ' + (it.grndFlrCnt||0) + '층 / 지하 ' + (it.ugrndFlrCnt||0) + '층' },
    { l:'승강기',   v: elvt },
    { l:'사용승인', v: dt(it.useAprDay) },
  ];

  return (
    <div className={'pci' + (e.printSel ? '' : ' print-hide')}
         style={{background:'white',border:'1px solid #e0dcd4',padding:'24px',position:'relative'}}>

      {/* 인쇄 선택 체크박스 — 화면 전용 */}
      <label className="screen-only" style={{position:'absolute',top:'7px',left:'7px',display:'flex',alignItems:'center',gap:'3px',fontSize:'10px',color:'#aaa',cursor:'pointer',zIndex:1}}>
        <input type="checkbox" checked={e.printSel} onChange={() => onTogglePrint(e.id)} />
        출력
      </label>

      {/* 직접 배치 모드 드래그 힌트 */}
      {dragHandle && (
        <div className="screen-only" title="끌어서 순서 변경"
          style={{position:'absolute',top:'6px',left:'50px',fontSize:'10px',color:'#c9a84c',cursor:'grab',zIndex:1,userSelect:'none',fontWeight:600}}>⠿ 이동</div>
      )}

      {/* 번호 + 수정 + 삭제 버튼 */}
      <div style={{position:'absolute',top:0,right:0,display:'flex',alignItems:'center',gap:'2px'}}>
        <button className="screen-only" onClick={onEdit}
          title="입력폼으로 불러와 수정"
          style={{background:'transparent',border:'none',color:'#999',fontSize:'19px',cursor:'pointer',padding:'7px 9px',lineHeight:1,transition:'color 0.15s'}}
          onMouseEnter={ev => ev.target.style.color='#c9a84c'}
          onMouseLeave={ev => ev.target.style.color='#999'}>✎</button>
        <button className="screen-only" onClick={onDelete}
          title="삭제"
          style={{background:'transparent',border:'none',color:'#bbb',fontSize:'22px',cursor:'pointer',padding:'5px 9px',lineHeight:1,transition:'color 0.15s'}}
          onMouseEnter={ev => ev.target.style.color='#c0392b'}
          onMouseLeave={ev => ev.target.style.color='#bbb'}>×</button>
        <div style={{background:'#0d1b2a',color:'#c9a84c',width:'32px',height:'32px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700}}>{i+1}</div>
      </div>

      {/* 제목 영역 */}
      <div style={{paddingRight:'40px',paddingLeft:'22px',marginBottom:'8px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.1em',color:'#c9a84c',marginBottom:'2px'}}>
          {[it.mainPurpsCdNm, it.etcPurps].filter(Boolean).join(' · ')}
        </div>
        {(it.jiyukCdNm || m.jiyukCdNm) && (
          <div style={{fontSize:'10px',color:'#888',marginBottom:'4px'}}>
            {m.jiyukCdNm || it.jiyukCdNm}
            {m.jiyukCdNm && <span className="no-print" style={{color:'#c9a84c',marginLeft:'4px',fontSize:'9px'}}>✓수기</span>}
          </div>
        )}
        <div style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'20px',fontWeight:600,lineHeight:1.2,marginBottom:'4px',color:'#0d1b2a'}}>{title}</div>
        <div style={{fontSize:'11px',color:'#999'}}>{it.platPlc}</div>
        {it.newPlatPlc && <div style={{fontSize:'10px',color:'#bbb',marginTop:'2px'}}>{it.newPlatPlc}</div>}
        {(e.updated_at || e.created_at) && (
          <div className="no-print" style={{fontSize:'9px',color:'#c5c0b6',marginTop:'4px'}}>
            {e.created_at && <span>등록 {new Date(e.created_at).toLocaleDateString('ko-KR')}</span>}
            {e.updated_at && e.updated_at !== e.created_at && <span>{e.created_at ? '  ·  ' : ''}수정 {new Date(e.updated_at).toLocaleDateString('ko-KR')}</span>}
          </div>
        )}
      </div>

      {/* 매매가 — 블랙박스 (리포트와 동일 스타일) */}
      {priceNum && (
        <div style={{marginBottom:'8px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
          <div style={{background:'#0d1b2a',borderLeft:'3px solid #c9a84c',padding:'7px 12px 8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'7px',color:'#c9a84c',letterSpacing:'0.2em',fontWeight:600}}>ASKING PRICE</span>
            <span style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',Arial,sans-serif",fontSize:'24px',fontWeight:700,color:'white',letterSpacing:'-0.02em',lineHeight:1}}>
              {priceNum.toLocaleString()}
              <span style={{fontSize:'12px',fontWeight:400,marginLeft:'4px',color:'#c9a84c'}}>억원</span>
            </span>
          </div>
          {ppPy && <div style={{textAlign:'right',fontSize:'9px',color:'#888',marginTop:'2px'}}>평당 {ppPy}만원</div>}
        </div>
      )}

      {/* 상단 3칸 */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'#e0dcd4',marginBottom:'12px'}}>
        {s3.map(s => (
          <div key={s.l} style={{background:'#faf9f5',padding:'10px 6px',textAlign:'center'}}>
            <div style={{fontSize:'10px',color:'#aaa',marginBottom:'3px'}}>{s.l}</div>
            <div style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'18px',fontWeight:600,color:'#0d1b2a'}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* 대지면적 강조 박스 */}
      <div style={{background: missingPlatArea && !m.platArea ? '#fff5f4' : '#f5f2eb', padding:'9px 12px',marginBottom:'4px',display:'flex',justifyContent:'space-between',alignItems:'center',borderLeft:'3px solid ' + (missingPlatArea && !m.platArea ? '#e74c3c' : '#c9a84c')}}>
        <span style={{fontSize:'11px',color:'#888'}}>대지면적
          {missingPlatArea && !m.platArea && <span style={{color:'#e74c3c',marginLeft:'4px',fontSize:'10px'}}>미확인</span>}
          {m.platArea && <span className="no-print" style={{color:'#2e7d32',marginLeft:'4px',fontSize:'10px'}}>✓수기</span>}
        </span>
        <span style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'18px',fontWeight:600,color:'#0d1b2a'}}>
          {platArea && parseFloat(platArea) > 0 ? (
            <>{py(platArea)}<span style={{fontSize:'12px',fontWeight:400,marginLeft:'2px'}}>평</span>
              <span style={{fontSize:'12px',fontWeight:400,color:'#aaa',marginLeft:'6px'}}>({parseFloat(platArea).toFixed(0)}㎡)</span>
            </>
          ) : '—'}
        </span>
      </div>

      <div style={{height:'8px'}} />

      {/* 하단 rows */}
      <div>
        {rows.map(r => (
          <div key={r.l} style={{display:'flex',gap:'12px',fontSize:'12px',padding:'5px 0',borderBottom:'1px solid #f0ece4'}}>
            <div style={{width:'58px',color:'#999',flexShrink:0}}>{r.l}</div>
            <div style={{color:'#1a1a2e'}}>{r.v}</div>
          </div>
        ))}
      </div>

      {/* 외부 링크 + 수기 입력 섹션 (화면 전용) */}
      <div className="screen-only" style={{marginTop:'10px',borderTop:'1px solid #f0ece4',paddingTop:'8px'}}>
        {/* 외부 링크 버튼 */}
        <div style={{display:'flex',gap:'5px',marginBottom:'7px',flexWrap:'wrap'}}>
          {/* 네이버지도 — 항상 작동 */}
          <a href={naverUrl} target="_blank" rel="noreferrer"
            style={{fontSize:'10px',padding:'3px 8px',background:'#f5f5f5',color:'#555',border:'1px solid #ddd',textDecoration:'none'}}>
            🗺 네이버지도
          </a>
          {/* 카카오맵 */}
          <a href={'https://map.kakao.com/?q=' + encodeURIComponent(it.platPlc||'')}
            target="_blank" rel="noreferrer"
            style={{fontSize:'10px',padding:'3px 8px',background:'#fff9e6',color:'#7a5c00',border:'1px solid #f0d060',textDecoration:'none'}}>
            🗺 카카오맵
          </a>
          {/* 토지이음 메인 (세션 필요로 직접 접근 불가 — 메인 이동 후 주소로 검색) */}
          <a href="https://www.eum.go.kr/" target="_blank" rel="noreferrer"
            title={'토지이음에서 아래 주소로 검색하세요:\n' + (it.platPlc||'').replace('번지','')}
            style={{fontSize:'10px',padding:'3px 8px',background:'#f0f4ff',color:'#3a6fd8',border:'1px solid #b8ccff',textDecoration:'none'}}>
            📋 토지이음
          </a>
          {/* 서울부동산정보광장 */}
          {it.platPlc && it.platPlc.includes('서울') && (
            <a href="https://land.seoul.go.kr/land/" target="_blank" rel="noreferrer"
              title={'서울부동산정보광장에서 아래 주소로 검색하세요:\n' + (it.platPlc||'')}
              style={{fontSize:'10px',padding:'3px 8px',background:'#f0fff4',color:'#2e7d32',border:'1px solid #a8d5b0',textDecoration:'none'}}>
              🏙 서울부동산정보광장
            </a>
          )}
          {/* 주소 복사 */}
          <button
            onClick={() => { navigator.clipboard.writeText((it.platPlc||'').replace('번지','')); }}
            title="검색용 주소를 클립보드에 복사합니다"
            style={{fontSize:'10px',padding:'3px 8px',background:'#f7f4ef',color:'#888',border:'1px solid #e0dcd4',cursor:'pointer'}}>
            📋 주소 복사
          </button>
          {/* 자동 저장 상태 표시 (수동 즉시저장도 가능) */}
          <button onClick={onSave} disabled={isSaving}
            title="자동 저장됩니다. 클릭 시 즉시 저장"
            style={{fontSize:'10px',padding:'3px 10px',background: e.dbId ? '#e8f5e9' : '#f7f4ef',color: e.dbId ? '#2e7d32' : '#aaa',border:'1px solid ' + (e.dbId ? '#a8d5b0' : '#e0dcd4'),cursor:'pointer',fontWeight:600,marginLeft:'auto'}}>
            {isSaving ? '저장 중…' : (e.dbId ? '✅ 자동저장됨' : '⏳ 저장 대기…')}
          </button>
        </div>

        {/* 수기 입력 토글 버튼 */}
        <button onClick={() => setShowManual(p => !p)}
          style={{fontSize:'11px',background:'none',border:'1px dashed ' + (Object.keys(m).some(k=>m[k]) ? '#c9a84c' : '#e0dcd4'),color: Object.keys(m).some(k=>m[k]) ? '#c9a84c' : '#aaa',padding:'4px 10px',cursor:'pointer',width:'100%',textAlign:'left'}}>
          ✏ 누락 정보 수기 입력 {showManual ? '▲' : '▼'}
          {Object.keys(m).some(k=>m[k]) && <span style={{marginLeft:'6px',fontSize:'10px',background:'#c9a84c',color:'white',padding:'1px 5px'}}>입력됨</span>}
        </button>

        {showManual && (
          <div style={{marginTop:'6px',background:'#fafaf8',border:'1px solid #e8e4dc',padding:'10px'}}>
            <div style={{fontSize:'10px',color:'#aaa',marginBottom:'8px'}}>
              API에 없는 항목을 입력하세요. 대지면적 입력 시 건폐율·용적률이 자동 계산됩니다.
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {/* 대지면적 */}
              <div>
                <div style={{fontSize:'10px',color:'#888',marginBottom:'2px'}}>대지면적 (㎡)</div>
                <input type="text" value={m.platArea||''} placeholder="직접 입력"
                  onChange={ev => onManual(e.id, 'platArea', ev.target.value)}
                  style={{width:'100%',fontSize:'12px',padding:'4px 6px',border:'1px solid ' + (m.platArea ? '#c9a84c' : '#e0dcd4'),boxSizing:'border-box'}} />
              </div>
              {/* 건폐율 — 자동계산 표시 */}
              <div>
                <div style={{fontSize:'10px',color:'#888',marginBottom:'2px'}}>
                  건폐율 (%)
                  {autoBcRat && !m.bcRat && <span style={{color:'#2e7d32',marginLeft:'4px'}}>자동: {autoBcRat}%</span>}
                  {m.bcRat && <span className="no-print" style={{color:'#c9a84c',marginLeft:'4px'}}>수기입력</span>}
                </div>
                <input type="text" value={m.bcRat||''}
                  placeholder={autoBcRat ? '자동계산: ' + autoBcRat + '%' : '직접 입력'}
                  onChange={ev => onManual(e.id, 'bcRat', ev.target.value)}
                  style={{width:'100%',fontSize:'12px',padding:'4px 6px',border:'1px solid ' + (m.bcRat ? '#c9a84c' : autoBcRat ? '#a8d5b0' : '#e0dcd4'),boxSizing:'border-box',background: autoBcRat && !m.bcRat ? '#f0fff4' : 'white'}} />
              </div>
              {/* 용적률 — 자동계산 표시 */}
              <div>
                <div style={{fontSize:'10px',color:'#888',marginBottom:'2px'}}>
                  용적률 (%)
                  {autoVlRat && !m.vlRat && <span style={{color:'#2e7d32',marginLeft:'4px'}}>자동: {autoVlRat}%</span>}
                  {m.vlRat && <span className="no-print" style={{color:'#c9a84c',marginLeft:'4px'}}>수기입력</span>}
                </div>
                <input type="text" value={m.vlRat||''}
                  placeholder={autoVlRat ? '자동계산: ' + autoVlRat + '%' : '직접 입력'}
                  onChange={ev => onManual(e.id, 'vlRat', ev.target.value)}
                  style={{width:'100%',fontSize:'12px',padding:'4px 6px',border:'1px solid ' + (m.vlRat ? '#c9a84c' : autoVlRat ? '#a8d5b0' : '#e0dcd4'),boxSizing:'border-box',background: autoVlRat && !m.vlRat ? '#f0fff4' : 'white'}} />
              </div>
              {/* 세대수 */}
              <div>
                <div style={{fontSize:'10px',color:'#888',marginBottom:'2px'}}>세대수</div>
                <input type="text" value={m.hhldCnt||''} placeholder="직접 입력"
                  onChange={ev => onManual(e.id, 'hhldCnt', ev.target.value)}
                  style={{width:'100%',fontSize:'12px',padding:'4px 6px',border:'1px solid ' + (m.hhldCnt ? '#c9a84c' : '#e0dcd4'),boxSizing:'border-box'}} />
              </div>
              {/* 용도지역 — 드롭다운 선택 */}
              <div style={{gridColumn:'1 / -1'}}>
                <div style={{fontSize:'10px',color:'#888',marginBottom:'2px'}}>
                  용도지역
                  {it.jiyukCdNm && !m.jiyukCdNm && <span style={{color:'#ccc',marginLeft:'4px'}}>(API: {it.jiyukCdNm})</span>}
                  {m.jiyukCdNm && <span style={{color:'#c9a84c',marginLeft:'4px'}}>선택됨</span>}
                </div>
                <select value={m.jiyukCdNm||''}
                  onChange={ev => onManual(e.id, 'jiyukCdNm', ev.target.value)}
                  style={{width:'100%',fontSize:'12px',padding:'5px 6px',border:'1px solid '+(m.jiyukCdNm?'#c9a84c':'#e0dcd4'),boxSizing:'border-box',background:'white'}}>
                  <option value=''>-- 선택 (API값 사용) --</option>
                  <optgroup label="주거지역">
                    {['제1종전용주거지역','제2종전용주거지역','제1종일반주거지역','제2종일반주거지역','제3종일반주거지역','준주거지역'].map(z=>(
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </optgroup>
                  <optgroup label="상업지역">
                    {['중심상업지역','일반상업지역','근린상업지역','유통상업지역'].map(z=>(
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </optgroup>
                  <optgroup label="공업지역">
                    {['전용공업지역','일반공업지역','준공업지역'].map(z=>(
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </optgroup>
                  <optgroup label="녹지지역">
                    {['보전녹지지역','생산녹지지역','자연녹지지역'].map(z=>(
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              {/* 법정 최대 용적률 — 리포트 신축여력 계산에 사용 */}
              <div style={{gridColumn:'1 / -1'}}>
                <div style={{fontSize:'10px',color:'#888',marginBottom:'2px'}}>
                  법정 최대 용적률 (%)
                  <span style={{color:'#aaa',marginLeft:'4px',fontSize:'9px'}}>리포트 신축여력 계산에 사용</span>
                  {m.maxVlRat && <span style={{color:'#c9a84c',marginLeft:'4px'}}>수기입력</span>}
                </div>
                <input type="text" value={m.maxVlRat||''}
                  placeholder='예: 250 (용도지역이 자동매칭 안될 때 입력)'
                  onChange={ev => onManual(e.id, 'maxVlRat', ev.target.value)}
                  style={{width:'100%',fontSize:'12px',padding:'4px 6px',border:'1px solid ' + (m.maxVlRat ? '#c9a84c' : '#e0dcd4'),boxSizing:'border-box'}} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 수기 입력 + 자동 계산 병합 (RCard·CmpT 공통 사용) ──
const mergeEntry = (e) => {
  const it = e.res;
  const m  = e.manual || {};
  const manualPlat = m.platArea && parseFloat(m.platArea) > 0 ? parseFloat(m.platArea) : null;
  const autoBcRat  = (manualPlat && it.archArea && parseFloat(it.archArea) > 0)
    ? (parseFloat(it.archArea) / manualPlat * 100).toFixed(1) : null;
  const autoVlRat  = (manualPlat && parseFloat(it.vlRatEstmTotArea || it.totArea || '0') > 0)
    ? (parseFloat(it.vlRatEstmTotArea || it.totArea) / manualPlat * 100).toFixed(1) : null;
  return {
    ...it,
    platArea:  m.platArea  || it.platArea,
    bcRat:     m.bcRat     || autoBcRat || it.bcRat,
    vlRat:     m.vlRat     || autoVlRat || it.vlRat,
    hhldCnt:   m.hhldCnt   || it.hhldCnt,
    jiyukCdNm: m.jiyukCdNm || it.jiyukCdNm,
    maxVlRat:  m.maxVlRat  || null,   // 법정 최대 용적률 수기 입력
  };
};

// ── 비교 테이블 ──
function CmpT({ entries, togglePrint, printMode, reportTitle, reportDate, totalSel, bizName, bizAddr, agentName, agentPhone, logoSrc }) {
  const printEntries = entries.filter(e => e.printSel);
  const splitSize    = 5;
  const chunks       = [];
  for (let i = 0; i < printEntries.length; i += splitSize) {
    chunks.push({ items: printEntries.slice(i, i + splitSize), startIdx: i });
  }

  // ── 화면용 스타일 ──
  const sThBase  = { background:'#0d1b2a',color:'#f7f4ef',padding:'10px 12px',border:'1px solid #0d1b2a',fontWeight:500,fontSize:'12px',verticalAlign:'middle' };
  const sPlcBase = { background:'#f0ede6',padding:'8px 10px',color:'#555',fontWeight:600,border:'1px solid #ddd8d0',whiteSpace:'nowrap',verticalAlign:'middle',fontSize:'11px',textAlign:'center' };
  const sGolBase = { background:'#fff3dc',padding:'8px 10px',color:'#b86c00',fontWeight:700,border:'1px solid #ddd8d0',whiteSpace:'nowrap',verticalAlign:'middle',fontSize:'11px',textAlign:'center' };
  const sTd = (stripe) => ({
    padding:'8px 10px', border:'1px solid #ddd8d0', verticalAlign:'middle',
    fontSize:'12px', lineHeight:1.5, textAlign:'center',
    background: stripe ? '#f3efe7' : '#ffffff',
    whiteSpace:'normal', wordBreak:'keep-all',
  });

  // ── 인쇄용 스타일 (더 컴팩트) ──
  const pThBase  = { background:'#0d1b2a',color:'#f7f4ef',padding:'7pt 6pt',border:'1px solid #0d1b2a',fontWeight:600,fontSize:'8.5pt',verticalAlign:'middle' };
  const pPlcBase = { background:'#ede9e1',padding:'6.5pt 6pt',color:'#444',fontWeight:700,border:'1px solid #ccc8c0',whiteSpace:'nowrap',verticalAlign:'middle',fontSize:'8pt',textAlign:'center' };
  const pGolBase = { background:'#fff0cc',padding:'6.5pt 6pt',color:'#a05800',fontWeight:700,border:'1px solid #ccc8c0',whiteSpace:'nowrap',verticalAlign:'middle',fontSize:'8pt',textAlign:'center' };
  const pTd = (stripe) => ({
    padding:'6.5pt 6pt', border:'1px solid #ccc8c0', verticalAlign:'middle',
    fontSize:'8.5pt', lineHeight:1.4, textAlign:'center',
    background: stripe ? '#f3efe7' : '#ffffff',
    whiteSpace:'normal', wordBreak:'keep-all',
    overflow:'hidden',
    WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
  });

  const buildRows = (cols, isP) => {
    const pl = isP ? pPlcBase : sPlcBase;
    const gl = isP ? pGolBase : sGolBase;
    const tdFn = isP ? pTd : sTd;
    // 데이터 행(COLS) 줄무늬: 첫 행 흰색부터 시작 → 흰/베이지 균등
    let ri = 0;
    const s = () => ri++ % 2 === 1;
    return (
      <tbody>
        <tr>
          <td style={{...pl, background: '#e0dcd4'}}>주소</td>
          {cols.map(e => {
            // "서울특별시 서초구 방배동 839-34번지" → ["...방배동", "839-34번지"]
            const full = (e.res && e.res.platPlc) ? e.res.platPlc : '';
            let line1 = full, line2 = '';
            if (full) {
              const m = full.match(/^(.*?[동리가])\s+(.+)$/);
              if (m) { line1 = m[1]; line2 = m[2]; }
            }
            return (
              <td key={e.id} style={tdFn(false)}>
                {full ? (
                  <span>
                    {line1}
                    {line2 && <><br/><span style={{fontWeight:600}}>{line2}</span></>}
                  </span>
                ) : '—'}
              </td>
            );
          })}
        </tr>
        <tr>
          <td style={{...gl, background: '#f5dfa0'}}>매매가</td>
          {cols.map(e => <td key={e.id} style={{...tdFn(false),fontWeight:600,color:'#1a1a2e'}}>
            {e.price && parseFloat(e.price)>0 ? parseFloat(e.price)+'억원' : '—'}
          </td>)}
        </tr>
        <tr>
          <td style={{...gl, background: '#f5dfa0'}}>평단가</td>
          {cols.map(e => {
            const merged = e.res ? mergeEntry(e) : {};
            const pPy = merged.platArea && parseFloat(merged.platArea)>0 ? parseFloat(merged.platArea)/PY : null;
            const pN  = e.price && parseFloat(e.price)>0 ? parseFloat(e.price) : null;
            const pp  = (pN && pPy) ? Math.round(pN*10000/pPy).toLocaleString() : null;
            return <td key={e.id} style={{...tdFn(false),fontWeight:600,color:'#1a1a2e'}}>{pp ? pp+'만원/평' : '—'}</td>;
          })}
        </tr>
        {COLS.slice(1).map(col => {
          const sv = s();
          return (
            <tr key={col.l}>
              <td style={{...pl, background: sv ? pl.background : '#e0dcd4'}}>{col.l}</td>
              {cols.map(e => <td key={e.id} style={tdFn(sv)}>{e.res ? col.f(mergeEntry(e)) : '—'}</td>)}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const buildHead = (cols, showCheck, startIdx, isP) => {
    const th = isP ? pThBase : sThBase;
    const pl = isP ? pPlcBase : sPlcBase;
    return (
      <thead>
        <tr>
          <th style={{...pl, minWidth: isP ? '0' : '80px', background:'#0d1b2a', color:'#c9a84c'}}>항목</th>
          {cols.map((e, i) => (
            <th key={e.id} className="ptk" style={{...th, textAlign:'left'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'5px'}}>
                {showCheck && (
                  <label className="screen-only" style={{cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'10px',color:'#c9a84c',flexShrink:0,paddingTop:'2px'}}>
                    <input type="checkbox" checked={e.printSel} onChange={() => togglePrint(e.id)} />출력
                  </label>
                )}
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                    <span style={{background:'#c9a84c',color:'white',minWidth:'16px',height:'16px',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,flexShrink:0}}>{startIdx+i+1}</span>
                    <span style={{fontWeight:600,fontSize: isP ? '8.5pt' : '12px'}}>{e.alias||(e.res&&e.res.bldNm)||('건물'+(startIdx+i+1))}</span>
                  </div>
                </div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  return (
    <>
      {/* 화면: 전체 테이블 가로 스크롤 */}
      <div className="screen-only" style={{overflowX:'auto',marginTop:'8px',borderRadius:'2px',boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'auto'}}>
          {buildHead(entries, true, 0, false)}
          {buildRows(entries, false)}
        </table>
      </div>

      {/* 인쇄: 선택 항목 페이지 분할 */}
      {chunks.map((chunk, ci) => (
        <div key={ci} className="print-only"
          style={{pageBreakBefore: ci>0 ? 'always' : 'auto', breakBefore: ci>0 ? 'page' : 'auto',
                  paddingTop: ci>0 ? '0' : '0'}}>

          {/* 각 페이지 자체 헤더 — 제목 위 여백 확보 */}
          <div style={{paddingTop:'4pt'}} />
          <div style={{borderBottom:'1.5pt solid #0d1b2a',paddingBottom:'6pt',marginBottom:'8pt',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
            <div>
              <div style={{fontSize:'7pt',letterSpacing:'0.12em',color:'#c9a84c',marginBottom:'2pt'}}>TIMES REAL ESTATE · 타임즈부동산중개</div>
              <div style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'22pt',fontWeight:700,lineHeight:1.1,color:'#0d1b2a'}}>{reportTitle||'건축물대장 비교 보고서'}</div>
            </div>
            <div style={{textAlign:'right',fontSize:'8pt',color:'#888'}}>
              {reportDate}&nbsp;·&nbsp;총 {totalSel}건
              {chunks.length > 1 && <span>&nbsp;·&nbsp;{ci+1}/{chunks.length} 페이지</span>}
            </div>
          </div>

          {/* 칸 폭 고정: 항목열 65pt + 건물열 140pt씩 (페이지에 관계없이 동일) */}
          <table style={{borderCollapse:'collapse', tableLayout:'fixed'}}>
            <colgroup>
              <col style={{width:'65pt'}} />
              {chunk.items.map(e => <col key={e.id} style={{width:'140pt'}} />)}
            </colgroup>
            {buildHead(chunk.items, false, chunk.startIdx, true)}
            {buildRows(chunk.items, true)}
          </table>

          {/* 인쇄 바닥글 — 로고 + 상호·주소·담당자·연락처 (DOM) */}
          {(bizName || bizAddr || agentName || agentPhone || logoSrc) && (
            <div style={{marginTop:'6pt',borderTop:'1pt solid #c9a84c',paddingTop:'5pt',breakInside:'avoid',pageBreakInside:'avoid'}}>
              <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
                <tbody>
                  <tr style={{verticalAlign:'middle'}}>
                    {/* 좌: 로고 + 상호 + 주소 */}
                    <td style={{verticalAlign:'middle',paddingRight:'8pt'}}>
                      <span style={{display:'inline-flex',alignItems:'center',gap:'6pt'}}>
                        {logoSrc && <img src={logoSrc} style={{height:'15pt',objectFit:'contain',verticalAlign:'middle'}} />}
                        {bizName && <strong style={{color:'#0d1b2a',fontSize:'10.5pt',fontWeight:700}}>{bizName}</strong>}
                        {bizName && bizAddr && <span style={{color:'#bbb',margin:'0 5pt'}}>|</span>}
                        {bizAddr && <span style={{color:'#333',fontSize:'9pt',fontWeight:500}}>{bizAddr}</span>}
                      </span>
                    </td>
                    {/* 우: 담당자 + 연락처 */}
                    {(agentName||agentPhone) && (
                      <td style={{textAlign:'right',whiteSpace:'nowrap',verticalAlign:'middle',width:'160pt'}}>
                        {agentName  && <strong style={{color:'#0d1b2a',fontSize:'10.5pt',fontWeight:700}}>{agentName}</strong>}
                        {agentName && agentPhone && <span style={{color:'#bbb',margin:'0 5pt'}}>|</span>}
                        {agentPhone && <strong style={{color:'#0d1b2a',fontSize:'10pt',fontWeight:600}}>{agentPhone}</strong>}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// ── 용도지역별 법정 최대 용적률 ──
const LEGAL_VL = {
  '제1종전용주거지역':100,'제2종전용주거지역':150,
  '제1종일반주거지역':200,'제2종일반주거지역':250,'제3종일반주거지역':300,
  '준주거지역':500,
  '중심상업지역':1500,'일반상업지역':1300,'근린상업지역':900,'유통상업지역':1100,
  '전용공업지역':300,'일반공업지역':350,'준공업지역':400,
  '보전녹지지역':80,'생산녹지지역':100,'자연녹지지역':100,
};

// ── 리포트 뷰 ──
function ReportView({ entries, reportTitle, reportDate, bizName, bizAddr, agentName, agentPhone, logoSrc, upAnalysis, upIncome, addPhoto, rmPhoto, setMapPhoto, upNotes, onSave, dbSaving, onEdit, togglePrint }) {
  const printIds = entries.filter(e => e.printSel).map(e => e.id);
  const lastPrintId = printIds[printIds.length - 1];
  return (
    <div>
      {entries.map((e, i) => (
        <ReportCard key={e.id} e={e} i={i}
          reportTitle={reportTitle} reportDate={reportDate}
          bizName={bizName} bizAddr={bizAddr} agentName={agentName} agentPhone={agentPhone} logoSrc={logoSrc}
          upAnalysis={upAnalysis} upIncome={upIncome} addPhoto={addPhoto} rmPhoto={rmPhoto} setMapPhoto={setMapPhoto} upNotes={upNotes}
          onSave={() => onSave(e)} isSaving={dbSaving[e.id]} onEdit={() => onEdit(e.id)} onTogglePrint={() => togglePrint(e.id)} isLastPrint={e.id === lastPrintId} />
      ))}
    </div>
  );
}

// ── 개별 건물 리포트 카드 ──
function ReportCard({ e, i, reportTitle, reportDate, bizName, bizAddr, agentName, agentPhone, logoSrc, upAnalysis, upIncome, addPhoto, rmPhoto, setMapPhoto, upNotes, onSave, isSaving, onEdit, onTogglePrint, isLastPrint }) {
  const it      = e.res;
  const mg      = mergeEntry(e);
  const an      = e.analysis  || {};
  const ic      = e.income    || {};
  const photos  = e.photos    || [];
  const coords  = e.mapCoords;   // {lat, lon}
  const title   = e.alias || it.bldNm || it.platPlc;

  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError,   setAiError]   = React.useState('');

  const runAI = async () => {
    setAiLoading(true); setAiError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address:   it.platPlc,
          zoning:    mg.jiyukCdNm,
          usage:     [mg.mainPurpsCdNm, mg.etcPurps].filter(Boolean).join('/'),
          platArea:  mg.platArea,
          totalArea: mg.totArea,
          floors:    '지상'+(mg.grndFlrCnt||0)+'층/지하'+(mg.ugrndFlrCnt||0)+'층',
          useAprDay: dt(mg.useAprDay),
          price:     e.price,
        })
      });
      const data = await res.json();
      if (data.error) { setAiError(data.error); return; }
      ['traffic','commercial','population','development'].forEach(k => {
        if (data[k]) upAnalysis(e.id, k, data[k]);
      });
    } catch(err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // ── 수익률 계산 ──
  const prM  = parseFloat(e.price  || 0) * 10000;
  const dep  = parseFloat(ic.deposit     || 0);
  const mRnt = parseFloat(ic.monthlyRent || 0);
  const mFee = parseFloat(ic.mgmtFee     || 0);
  const lnM  = parseFloat(ic.loanAmt     || 0);  // 만원 단위 직접 입력
  const lnR  = parseFloat(ic.loanRate    || 0);
  const acR  = parseFloat(ic.acquiTax    || 0);
  const tyR  = parseFloat(ic.targetYield || 0);
  const annInc  = (mRnt + mFee) * 12;
  const annInt  = lnM * lnR / 100;
  const annNet  = annInc - annInt;
  const acqAmt  = prM * acR / 100;
  const realInv = prM - dep - lnM + acqAmt;
  const yldRate = realInv > 0 ? (annNet / realInv * 100) : 0;
  const neededMon = tyR > 0 ? (realInv * tyR / 100 + annInt) / 12 : 0;

  // ── 신축여력 계산 ──
  const platA   = mg.platArea ? parseFloat(mg.platArea) : 0;
  const zoning  = mg.jiyukCdNm || '';
  // 용도지역 문자열 정규화 (공백·띄어쓰기 제거 후 매칭)
  const zoningKey = zoning.replace(/\s/g, '');
  const found = Object.entries(LEGAL_VL).find(([k]) => k.replace(/\s/g,'') === zoningKey);
  const legalVlFromTable = found ? found[1] : 0;
  // 수기 입력 maxVlRat 우선 적용
  const legalVl = mg.maxVlRat ? parseFloat(mg.maxVlRat) : legalVlFromTable;
  const currVl  = mg.vlRat ? parseFloat(mg.vlRat) : 0;
  const maxArea = platA && legalVl ? +(platA * legalVl / 100).toFixed(1) : null;
  const currArea = mg.totArea ? +parseFloat(mg.totArea).toFixed(1) : null;
  const extraArea = (maxArea && currArea) ? +(maxArea - currArea).toFixed(1) : null;
  // 건물 노후도
  const useDay = mg.useAprDay ? String(mg.useAprDay).slice(0,4) : null;
  const bldAge = useDay ? (new Date().getFullYear() - parseInt(useDay)) : null;
  const ageLabel = bldAge
    ? bldAge >= 40 ? '🔴 고령 건물 ('+bldAge+'년) — 신축 적극 검토'
    : bldAge >= 30 ? '🟡 노후 건물 ('+bldAge+'년) — 신축 검토 가능'
    : '🟢 준공 '+bldAge+'년 — 양호' : null;

  // 지도 URL
  const naverMapUrl = 'https://map.naver.com/v5/search/' + encodeURIComponent(it.platPlc||'');
  const kakaoMapUrl = 'https://map.kakao.com/?q=' + encodeURIComponent(it.platPlc||'');

  const iSt  = { fontSize:'12px', padding:'6px 8px', border:'1px solid #e0dcd4', width:'100%', boxSizing:'border-box', resize:'vertical', fontFamily:"'Noto Sans KR',sans-serif", lineHeight:1.6 };
  const numSt = { fontSize:'12px', padding:'5px 8px', border:'1px solid #e0dcd4', width:'100%', boxSizing:'border-box', textAlign:'right' };
  const fmt  = v => v > 0 ? Math.round(v).toLocaleString() : '—';
  const hd   = (label, badge) => (
    <div style={{fontSize:'11px',fontWeight:600,color:'#0d1b2a',marginBottom:'6px',letterSpacing:'0.05em',borderBottom:'1px solid #e0dcd4',paddingBottom:'4px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span>{label}</span>
      {badge && <span style={{fontSize:'9px',fontWeight:400,color:'#2471a3',background:'#eaf4fb',padding:'1px 7px',letterSpacing:'0',border:'0.5px solid #aad4ed'}}>{badge}</span>}
    </div>
  );

  return (
    <div className={'report-card' + (e.printSel ? '' : ' print-hide') + (isLastPrint ? ' report-card-lastsel' : '')} style={{background:'white',marginBottom:'28px'}}>

      {/* ── 리포트 헤더 ── */}
      <div style={{background:'#0d1b2a',height:'6px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}} />
      <div style={{background:'white',padding:'12px 20px',borderBottom:'2.5px solid #0d1b2a'}}>
        {/* 상단 라인: 출력선택+회사명(좌) · 작성일(우) */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <label className="no-print" style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',color: e.printSel ? '#0d1b2a' : '#bbb',cursor:'pointer',fontWeight:600,whiteSpace:'nowrap'}}>
              <input type="checkbox" checked={e.printSel} onChange={onTogglePrint} />출력
            </label>
            <div style={{fontSize:'8px',letterSpacing:'0.25em',color:'#c9a84c',fontWeight:600}}>TIMES REAL ESTATE · 건물 분석 리포트</div>
          </div>
          <div style={{fontSize:'10px',color:'#888'}}>작성일 {reportDate}</div>
        </div>
        {/* 본문 라인: 보고서 제목(좌) · 별칭+주소(우) */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:'16px'}}>
          {/* 좌: 보고서 제목 */}
          <div style={{minWidth:0}}>
            <div style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'30px',fontWeight:700,color:'#0d1b2a',lineHeight:1.05,letterSpacing:'0.01em'}}>
              {reportTitle || '건물 분석 리포트'}
            </div>
          </div>
          {/* 우: 별칭(건물명) + 주소 */}
          <div style={{textAlign:'right',flexShrink:0,minWidth:0}}>
            <div style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",fontSize:'17px',fontWeight:600,color:'#0d1b2a',lineHeight:1.2}}>{title}</div>
            <div style={{fontSize:'11px',color:'#666',marginTop:'3px'}}>{it.platPlc}</div>
            {it.newPlatPlc && <div style={{fontSize:'10px',color:'#aaa',marginTop:'1px'}}>{it.newPlatPlc}</div>}
            {/* 수정 + 자동저장 상태 — 화면 전용 */}
            <div className="no-print" style={{display:'flex',gap:'6px',justifyContent:'flex-end',marginTop:'8px'}}>
              <button onClick={onEdit}
                title="입력폼으로 불러와 수정"
                style={{background:'#fff', color:'#888', border:'1px solid #e0dcd4', padding:'6px 12px', fontSize:'11px', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap'}}>
                ✏ 수정
              </button>
              <button onClick={onSave} disabled={isSaving}
                title="자동 저장됩니다. 클릭 시 즉시 저장"
                style={{background: e.dbId ? '#e8f5e9' : '#f7f4ef', color: e.dbId ? '#2e7d32' : '#aaa', border:'1px solid ' + (e.dbId ? '#a8d5b0' : '#e0dcd4'), padding:'6px 12px', fontSize:'11px', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap'}}>
                {isSaving ? '저장 중…' : (e.dbId ? '✅ 자동저장됨' : '⏳ 저장 대기…')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="report-body" style={{padding:'22px 20px'}}>

        {/* ── 2열: 좌(건물사진) / 우(건물기본정보) ── */}
        <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:'24px',marginBottom:'14px',overflow:'hidden'}}>

          {/* 좌: 사진 + 매매가 — flex 컬럼으로 매매가를 사용승인 라인에 맞춤 */}
          <div style={{overflow:'hidden',minWidth:0,display:'flex',flexDirection:'column'}}>

            {/* 건물기본정보 헤더(hd)와 동일 높이 투명 스페이서 → 사진이 주용도 라인에 정렬 */}
            <div aria-hidden="true" style={{visibility:'hidden',fontSize:'11px',fontWeight:600,paddingBottom:'4px',marginBottom:'6px',borderBottom:'1px solid transparent',letterSpacing:'0.05em',flexShrink:0}}>X</div>

            {/* 사진 컨테이너 — 175px 고정 */}
            <div style={{width:'100%',height:'175px',overflow:'hidden',background:'#f0ede6',border:'1px solid #e0dcd4',position:'relative',flexShrink:0}}>
              {photos.length === 0 && (
                <div className="print-only" style={{height:'175px',display:'flex',alignItems:'center',justifyContent:'center',color:'#ccc',fontSize:'11px'}}>사진 없음</div>
              )}
              {photos.length === 1 && (
                <img src={photos[0]} style={{width:'100%',height:'175px',objectFit:'cover',display:'block'}} />
              )}
              {photos.length === 2 && (
                <div style={{display:'flex',height:'175px',gap:'2px',overflow:'hidden'}}>
                  {photos.map((src,idx) => (
                    <img key={idx} src={src} style={{flex:1,minWidth:0,height:'175px',objectFit:'cover',display:'block'}} />
                  ))}
                </div>
              )}
              {photos.length >= 3 && (
                <div style={{display:'flex',height:'175px',gap:'2px',overflow:'hidden'}}>
                  <img src={photos[0]} style={{width:'50%',flexShrink:0,height:'175px',objectFit:'cover',display:'block'}} />
                  <div style={{width:'50%',flexShrink:0,display:'flex',flexDirection:'column',gap:'2px',height:'175px',overflow:'hidden'}}>
                    <img src={photos[1]} style={{width:'100%',height:'87px',objectFit:'cover',display:'block'}} />
                    <img src={photos[2]} style={{width:'100%',height:'87px',objectFit:'cover',display:'block'}} />
                  </div>
                </div>
              )}
              {/* 삭제 버튼 */}
              {photos.map((_, idx) => (
                <button key={idx} className="no-print" onClick={() => rmPhoto(e.id, idx)}
                  style={{position:'absolute',top:'4px',right:idx===0?(photos.length>=2?'calc(50% + 4px)':'4px'):'4px',
                    background:'rgba(0,0,0,0.55)',color:'white',border:'none',cursor:'pointer',fontSize:'11px',padding:'1px 6px',lineHeight:1.4,zIndex:10}}>
                  {photos.length > 1 ? (idx+1)+'×' : '×'}
                </button>
              ))}
            </div>

            {/* 사진 업로드 버튼 (화면 전용) */}
            {photos.length < 3 && (
              <label className="no-print" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',cursor:'pointer',padding:'5px',border:'1px dashed #e0dcd4',background:'#fafaf8',fontSize:'10px',color:'#888',marginTop:'4px',flexShrink:0}}>
                📷 {photos.length===0 ? '사진 업로드 (최대 3장)' : '사진 추가 ('+photos.length+'/3)'}
                <input type="file" accept="image/*" multiple style={{display:'none'}}
                  onClick={ev => { ev.target.value = ''; }}
                  onChange={ev => {
                    Array.from(ev.target.files).slice(0,3-photos.length).forEach(f=>{const r=new FileReader();r.onload=ev2=>addPhoto(e.id,ev2.target.result);r.readAsDataURL(f);});
                  }} />
              </label>
            )}

            {/* 매매가 — marginTop:auto로 사용승인 라인 높이에 자동 정렬 */}
            {e.price && parseFloat(e.price) > 0 && (
              <div style={{marginTop:'auto',paddingTop:'8px',flexShrink:0,WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
                <div style={{padding:'7px 12px 8px',background:'#0d1b2a',borderLeft:'3px solid #c9a84c'}}>
                  <div style={{fontSize:'7px',color:'#c9a84c',letterSpacing:'0.25em',fontWeight:600,marginBottom:'3px'}}>ASKING PRICE</div>
                  <div style={{textAlign:'right',lineHeight:1}}>
                    <span style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',Arial,sans-serif",fontSize:'24px',fontWeight:700,color:'white',letterSpacing:'-0.02em'}}>
                      {parseFloat(e.price).toLocaleString()}
                    </span>
                    <span style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:'12px',fontWeight:400,color:'#c9a84c',marginLeft:'4px'}}>억원</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 우: 건물 기본 정보 */}
          <div style={{overflow:'hidden',minWidth:0}}>
            {hd('🏢 건물 기본 정보')}
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
              <tbody>
                {[
                  ['주용도',   [mg.mainPurpsCdNm,mg.etcPurps].filter(Boolean).join('/')||'—'],
                  ['주구조',   mg.strctCdNm||mg.mainStrctCdNm||'—'],
                  ['대지면적', platA>0 ? py(mg.platArea)+'평 ('+parseFloat(mg.platArea).toFixed(0)+'㎡)' : '—'],
                  ['연면적',   mg.totArea&&parseFloat(mg.totArea)>0 ? py(mg.totArea)+'평 ('+parseFloat(mg.totArea).toFixed(0)+'㎡)' : '—'],
                  ['건폐율',   pct(mg.bcRat)],
                  ['용적률',   pct(mg.vlRat)],
                  ['층수',     '지상'+(mg.grndFlrCnt||0)+'층/지하'+(mg.ugrndFlrCnt||0)+'층'],
                  ['세대수',   mg.hhldCnt ? parseInt(mg.hhldCnt).toLocaleString()+'세대' : '—'],
                  ['사용승인', dt(mg.useAprDay) + (bldAge ? ' ('+bldAge+'년차)' : '')],
                ].map(([k,v,big], ri) => (
                  <tr key={k}>
                    <td style={{padding:'4px 6px',background:big?'#fff3dc':'#ede9e1',color:big?'#a05800':'#555',fontWeight:600,width:'62px',borderBottom:'1px solid #e4e0d8',whiteSpace:'nowrap',fontSize:'10px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>{k}</td>
                    <td style={{padding:'4px 8px',borderBottom:'1px solid #e4e0d8',color:'#1a1a2e',fontSize:big?'15px':'12px',fontWeight:big?700:400,background: ri%2===1 ? '#faf8f4' : '#ffffff',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* ── 수익률 분석 ── */}
        <div style={{marginBottom:'14px'}}>
          {hd('💰 수익률 분석')}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
            <div>
              <div style={{fontSize:'10px',color:'#888',marginBottom:'5px'}}>입력 조건</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                <tbody>
                  {[
                    {label:'보증금 (만원)',field:'deposit'},
                    {label:'월세 (만원)',  field:'monthlyRent'},
                    {label:'관리비 (만원)',field:'mgmtFee'},
                    {label:'대출금액 (만원)',field:'loanAmt'},
                    {label:'대출금리 (%)', field:'loanRate'},
                    {label:'취득세율 (%)', field:'acquiTax'},
                  ].map(({label, field}, ri) => (
                    <tr key={label}>
                      <td style={{padding:'3px 6px',background:'#ede9e1',color:'#555',fontWeight:600,width:'100px',borderBottom:'1px solid #e4e0d8',fontSize:'10px',whiteSpace:'nowrap',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>{label}</td>
                      <td style={{padding:'3px 8px',borderBottom:'1px solid #e4e0d8',textAlign:'right',background: ri%2===1 ? '#faf8f4' : '#ffffff',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
                        <input type="text" className="screen-only" value={ic[field]||''} placeholder="0"
                          onChange={ev => upIncome(e.id, field, ev.target.value)} style={{...numSt,background:'white',textAlign:'right'}} />
                        <span className="print-only" style={{fontSize:'12px',display:'block',textAlign:'right'}}>
                          {ic[field]
                            ? label.includes('%')
                              ? parseFloat(ic[field]) + '%'
                              : fmtAmt(ic[field])
                            : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div style={{fontSize:'10px',color:'#888',marginBottom:'5px'}}>분석 결과</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px',marginBottom:'10px'}}>
                <tbody>
                  {[
                    {label:'연간 임대수입', val:fmtAmt(annInc), hi:false},
                    {label:'연간 이자비용', val:fmtAmt(annInt), hi:false},
                    {label:'연간 순수익',   val:fmtAmt(annNet), hi:true},
                    {label:'취득세',        val:fmtAmt(acqAmt), hi:false},
                    {label:'실 투자금',     val:fmtAmt(realInv), hi:false},
                    {label:'연간 수익률',   val:realInv>0?yldRate.toFixed(2)+'%':'—', hi:true},
                  ].map(({label, val, hi}, ri) => (
                    <tr key={label}>
                      <td style={{padding:'3px 6px',background:hi?'#fff3dc':'#ede9e1',color:hi?'#a05800':'#555',width:'100px',borderBottom:'1px solid #e4e0d8',fontSize:'10px',fontWeight:hi?700:600,whiteSpace:'nowrap',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>{label}</td>
                      <td style={{padding:'3px 8px',borderBottom:'1px solid #e4e0d8',fontWeight:hi?700:400,color:hi?'#0d1b2a':'#333',textAlign:'right',fontSize:'12px',background: hi ? '#fffaf0' : (ri%2===1 ? '#faf8f4' : '#ffffff'),WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="no-print" style={{background:'#f0f4ff',padding:'8px 10px',border:'1px solid #c0cff8'}}>
                <div style={{fontSize:'10px',color:'#3a6fd8',fontWeight:600,marginBottom:'5px'}}>🔄 역산 — 목표수익률 → 필요 임대료</div>
                <div style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'11px',flexWrap:'wrap'}}>
                  <span style={{color:'#666'}}>목표</span>
                  <input type="text" className="screen-only" value={ic.targetYield||''} placeholder="예: 5"
                    onChange={ev => upIncome(e.id,'targetYield',ev.target.value)}
                    style={{width:'50px',fontSize:'12px',padding:'3px 5px',border:'1px solid #b8ccff',textAlign:'right'}} />
                  <span className="print-only" style={{fontSize:'12px',fontWeight:600}}>{ic.targetYield||'—'}</span>
                  <span style={{color:'#666'}}>%</span>
                  {tyR > 0 && realInv > 0 && (
                    <span style={{color:'#0d1b2a',fontWeight:700,marginLeft:'4px'}}>
                      → 월 {Math.round(neededMon).toLocaleString()}만원 필요
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 신축·증축 여력 분석 ── */}
        <div style={{marginBottom:'10px'}}>
          {hd('🏗 신축·증축 여력 분석',
            extraArea === null ? null :
            extraArea > 0
              ? '증축 여력 ' + (extraArea/PY).toFixed(1) + '평 · ' + (currArea ? ((extraArea/parseFloat(currArea))*100).toFixed(0)+'% 추가 가능' : '')
              : '현재 연면적 법정 최대 근접'
          )}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'8px',fontSize:'11px'}}>
            {/* 행1 */}
            <div style={{background:'#f5f2eb',padding:'7px 10px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
              <div style={{fontSize:'9px',color:'#aaa',marginBottom:'2px'}}>용도지역</div>
              <div style={{fontWeight:600,color:'#0d1b2a',fontSize:'12px'}}>{zoning||'—'}</div>
            </div>
            <div style={{background:'#f5f2eb',padding:'7px 10px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
              <div style={{fontSize:'9px',color:'#aaa',marginBottom:'2px'}}>법정 최대 용적률</div>
              <div style={{fontWeight:600,color:'#0d1b2a',fontSize:'12px'}}>{legalVl ? legalVl+'%' : '확인 필요'}</div>
            </div>
            <div style={{background:'#f5f2eb',padding:'7px 10px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
              <div style={{fontSize:'9px',color:'#aaa',marginBottom:'2px'}}>현재 용적률</div>
              <div style={{fontWeight:700,fontSize:'13px',
                color: currVl>0&&legalVl>0 ? (currVl>legalVl ? '#e74c3c' : '#2471a3') : '#0d1b2a',
                display:'flex',alignItems:'center',gap:'4px'}}>
                {pct(mg.vlRat)}
                {currVl>0 && legalVl>0 && (
                  <span style={{fontSize:'9px',fontWeight:500,
                    background: currVl>legalVl ? '#fdecea' : '#eaf4fb',
                    color: currVl>legalVl ? '#e74c3c' : '#2471a3',
                    padding:'1px 4px',borderRadius:'2px',border:'0.5px solid currentColor'}}>
                    {currVl>legalVl ? '초과' : '여유'}
                  </span>
                )}
              </div>
            </div>
            {/* 행2 */}
            <div style={{background:'#f5f2eb',padding:'7px 10px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
              <div style={{fontSize:'9px',color:'#aaa',marginBottom:'2px'}}>대지면적</div>
              <div style={{fontWeight:600,color:'#0d1b2a',fontSize:'12px'}}>{platA>0 ? py(mg.platArea)+'평' : '—'}</div>
            </div>
            <div style={{background:'#f5f2eb',padding:'7px 10px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
              <div style={{fontSize:'9px',color:'#aaa',marginBottom:'2px'}}>최대 건축 가능 연면적</div>
              <div style={{fontWeight:600,color:'#0d1b2a',fontSize:'12px'}}>{maxArea ? (parseFloat(maxArea)/PY).toFixed(1)+'평' : '—'}</div>
            </div>
            <div style={{background:'#f5f2eb',padding:'7px 10px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
              <div style={{fontSize:'9px',color:'#aaa',marginBottom:'2px'}}>현재 연면적</div>
              <div style={{fontWeight:700,fontSize:'13px',
                color: currArea&&maxArea ? (parseFloat(currArea)>parseFloat(maxArea) ? '#e74c3c' : '#2471a3') : '#0d1b2a',
                display:'flex',alignItems:'center',gap:'4px'}}>
                {currArea ? (parseFloat(currArea)/PY).toFixed(1)+'평' : '—'}
                {currArea && maxArea && (
                  <span style={{fontSize:'9px',fontWeight:500,
                    background: parseFloat(currArea)>parseFloat(maxArea) ? '#fdecea' : '#eaf4fb',
                    color: parseFloat(currArea)>parseFloat(maxArea) ? '#e74c3c' : '#2471a3',
                    padding:'1px 4px',borderRadius:'2px',border:'0.5px solid currentColor'}}>
                    {parseFloat(currArea)>parseFloat(maxArea) ? '초과' : '여유'}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* 건물 노후도 — 사용승인 옆에 표시, 여기선 제거 */}
        </div>

        {/* ── 추가 설명 ── */}
        <div style={{marginTop:'10px'}}>
          {hd('📝 추가 설명')}
          {/* 화면: 입력창 */}
          <textarea className="no-print" rows={4}
            placeholder={'한 줄씩 입력 → 인쇄 시 • 자동 추가, 2열로 배치됩니다.\n예) 주차 10대 가능\n예) 1층 상가 임대 중\n예) 엘리베이터 1대'}
            value={e.notes||''}
            onChange={ev => upNotes(e.id, ev.target.value)}
            style={{width:'100%',fontSize:'12px',padding:'8px 10px',border:'1px solid #e0dcd4',resize:'vertical',lineHeight:1.7,fontFamily:"'Noto Sans KR',sans-serif",boxSizing:'border-box'}} />
          {e.notes && e.notes.split('\n').filter(l=>l.trim()).length > 6 && (
            <div className="no-print" style={{fontSize:'10px',color:'#e67e22',marginTop:'3px'}}>
              ⚠ 인쇄 시 6줄(2열)까지만 표시됩니다. 현재 입력 초과.
            </div>
          )}
          {/* 인쇄: 2열 레이아웃, break-inside:avoid */}
          {e.notes && (
            <div className="print-only" style={{columnCount:2,columnGap:'16px',fontSize:'11px',color:'#1a1a2e',lineHeight:1.8,padding:'4px 0',breakInside:'avoid',maxHeight:'80px',overflow:'hidden'}}>
              {e.notes.split('\n').filter(l => l.trim()).map((line, idx) => (
                <div key={idx} style={{display:'flex',gap:'5px',marginBottom:'1px',breakInside:'avoid',pageBreakInside:'avoid'}}>
                  <span style={{color:'#c9a84c',fontWeight:700,flexShrink:0}}>•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 리포트 푸터 — CSS table (인쇄 안정) */}
      <div className="print-only report-footer" style={{margin:'8px 20px 14px',borderTop:'1pt solid #c9a84c',paddingTop:'6pt',fontSize:'9.5pt',color:'#333'}}>
        <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
          <tbody>
            <tr style={{verticalAlign:'middle'}}>
              {/* 좌: 로고 + 상호 + 주소 */}
              <td style={{verticalAlign:'middle',paddingRight:'8pt'}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:'7pt'}}>
                  {logoSrc && <img src={logoSrc} style={{height:'22pt',objectFit:'contain',verticalAlign:'middle'}} />}
                  {bizName && <strong style={{color:'#0d1b2a',fontSize:'11pt',fontWeight:700}}>{bizName}</strong>}
                  {bizName && bizAddr && <span style={{color:'#bbb',margin:'0 5pt'}}>|</span>}
                  {bizAddr && <span style={{color:'#333',fontSize:'9.5pt',fontWeight:500}}>{bizAddr}</span>}
                </span>
              </td>
              {/* 우: 담당자 + 연락처 (같은 셀, 우측 정렬) */}
              {(agentName||agentPhone) && (
                <td style={{textAlign:'right',whiteSpace:'nowrap',verticalAlign:'middle',width:'160pt'}}>
                  {agentName  && <strong style={{color:'#0d1b2a',fontSize:'11pt',fontWeight:700}}>{agentName}</strong>}
                  {agentName && agentPhone && <span style={{color:'#bbb',margin:'0 5pt'}}>|</span>}
                  {agentPhone && <strong style={{color:'#0d1b2a',fontSize:'10.5pt',fontWeight:600}}>{agentPhone}</strong>}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
// ── 마운트 ──
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
