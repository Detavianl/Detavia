/* ============================================================
   DetaVia - vacature-zoeksysteem (joinuz-stijl, sociaal domein)
   Voorbeelddata: vervang door echte vacatures of koppel later
   aan jullie flexportaal/CMS. De velden:
     titel, vakgebied(sleutel), plaats, uren[min,max], schaal,
     type, top(bool), datum, omschrijving
   ============================================================ */
const VAKGEBIEDEN = {
  wmo:          'Wmo',
  jeugd:        'Jeugd',
  participatie: 'Participatie',
  schuld:       'Schuldhulpverlening',
  inkomen:      'Inkomen',
  beleid:       'Beleid & Advies'
};

const VACATURES = [
  {titel:'Wmo-consulent',                 vakgebied:'wmo',          plaats:'Almere',     uren:[32,36], schaal:'Schaal 9',  type:'Detachering', top:true,  datum:'2026-06-12', omschrijving:'Je voert keukentafelgesprekken en organiseert passende ondersteuning, zodat inwoners zo zelfstandig mogelijk blijven.'},
  {titel:'Wmo-consulent complexe casuïstiek', vakgebied:'wmo',      plaats:'Utrecht',    uren:[36,40], schaal:'Schaal 10', type:'Detachering', top:false, datum:'2026-06-08', omschrijving:'Voor de zwaardere casuïstiek zoek je samen met inwoner en netwerk naar een duurzame oplossing.'},
  {titel:'Jeugdconsulent',                vakgebied:'jeugd',        plaats:'Amsterdam',  uren:[28,36], schaal:'Schaal 9',  type:'Detachering', top:true,  datum:'2026-06-11', omschrijving:'Je begeleidt gezinnen naar passende jeugdhulp en houdt regie op het ondersteuningsplan.'},
  {titel:'Gezinscoach',                   vakgebied:'jeugd',        plaats:'Rotterdam',  uren:[24,32], schaal:'Schaal 8',  type:'Detachering', top:false, datum:'2026-06-03', omschrijving:'Als gezinscoach werk je outreachend en versterk je de eigen kracht van het gezin.'},
  {titel:'Klantmanager Participatie',     vakgebied:'participatie', plaats:'Den Haag',   uren:[32,40], schaal:'Schaal 9',  type:'Detachering', top:true,  datum:'2026-06-10', omschrijving:'Je begeleidt inwoners naar werk en meedoen, met aandacht voor wat iemand wél kan.'},
  {titel:'Klantmanager Werk & Inkomen',   vakgebied:'participatie', plaats:'Eindhoven',  uren:[36,40], schaal:'Schaal 9',  type:'ZZP',        top:false, datum:'2026-05-28', omschrijving:'Een brede caseload op het snijvlak van werk, inkomen en participatie.'},
  {titel:'Schuldhulpverlener',            vakgebied:'schuld',       plaats:'Groningen',  uren:[24,36], schaal:'Schaal 8',  type:'Detachering', top:false, datum:'2026-06-06', omschrijving:'Je brengt financiële rust en grip terug en stelt samen een haalbaar plan op.'},
  {titel:'Budgetcoach',                   vakgebied:'schuld',       plaats:'Tilburg',    uren:[16,24], schaal:'Schaal 7',  type:'Detachering', top:false, datum:'2026-05-30', omschrijving:'Je coacht inwoners naar financiële zelfredzaamheid en voorkomt nieuwe schulden.'},
  {titel:'Inkomensconsulent',             vakgebied:'inkomen',      plaats:'Zwolle',     uren:[32,36], schaal:'Schaal 8',  type:'Detachering', top:true,  datum:'2026-06-09', omschrijving:'Je beoordeelt aanvragen rechtmatig en menselijk, met oog voor de mens achter de aanvraag.'},
  {titel:'Medewerker Terugvordering',     vakgebied:'inkomen',      plaats:'Breda',      uren:[32,40], schaal:'Schaal 8',  type:'Detachering', top:false, datum:'2026-05-26', omschrijving:'Je handelt terugvorderingen en verhaal zorgvuldig en oplossingsgericht af.'},
  {titel:'Adviseur Sociaal Domein',       vakgebied:'beleid',       plaats:'Amersfoort', uren:[32,40], schaal:'Schaal 11', type:'Detachering', top:true,  datum:'2026-06-07', omschrijving:'Je vertaalt ontwikkelingen naar beleid en adviseert het management van uitvoering tot strategie.'},
  {titel:'Beleidsmedewerker Wmo & Jeugd', vakgebied:'beleid',       plaats:'Nijmegen',   uren:[28,36], schaal:'Schaal 10', type:'Detachering', top:false, datum:'2026-05-22', omschrijving:'Je ontwikkelt en evalueert beleid op het brede sociaal domein.'}
];

/* ---------- helpers ---------- */
const $  = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const fmtUren = u => `${u[0]}-${u[1]} uur`;
const state = { tekst:'', plaats:'', vak:new Set(), uren:new Set(), sort:'nieuwste' };

/* ---------- render facetten met aantallen ---------- */
function buildFacets(){
  const vakBox = $('#facet-vak');
  vakBox.innerHTML = Object.entries(VAKGEBIEDEN).map(([k,label])=>`
    <label class="facet" data-vak="${k}">
      <input type="checkbox" value="${k}">
      <span>${label}</span><span class="fc" data-count="${k}">0</span>
    </label>`).join('');

  const urenOpties = [[16,24],[24,32],[32,36],[36,40]];
  $('#facet-uren').innerHTML = urenOpties.map(u=>`
    <label class="facet" data-uren="${u[0]}-${u[1]}">
      <input type="checkbox" value="${u[0]}-${u[1]}">
      <span>${u[0]} tot ${u[1]} uur</span><span class="fc" data-ucount="${u[0]}-${u[1]}">0</span>
    </label>`).join('');
}

/* ---------- filter-logica ---------- */
function matchUren(v){
  if(state.uren.size===0) return true;
  for(const r of state.uren){
    const [a,b]=r.split('-').map(Number);
    if(v.uren[0] < b && v.uren[1] > a) return true; // overlap
  }
  return false;
}
function passes(v, ignore){
  if(state.tekst){
    const q=state.tekst.toLowerCase();
    if(!(v.titel.toLowerCase().includes(q) || v.omschrijving.toLowerCase().includes(q) || VAKGEBIEDEN[v.vakgebied].toLowerCase().includes(q))) return false;
  }
  if(state.plaats && !v.plaats.toLowerCase().includes(state.plaats.toLowerCase())) return false;
  if(ignore!=='vak'  && state.vak.size  && !state.vak.has(v.vakgebied)) return false;
  if(ignore!=='uren' && !matchUren(v)) return false;
  return true;
}

function counts(){
  // tel per vakgebied (met overige filters toegepast behalve vak zelf)
  Object.keys(VAKGEBIEDEN).forEach(k=>{
    const n = VACATURES.filter(v=>v.vakgebied===k && passes(v,'vak')).length;
    const el=$(`[data-count="${k}"]`); el.textContent=n;
    el.closest('.facet').classList.toggle('off', n===0 && !state.vak.has(k));
  });
  ['16-24','24-32','32-36','36-40'].forEach(r=>{
    const [a,b]=r.split('-').map(Number);
    const n = VACATURES.filter(v=> v.uren[0]<b && v.uren[1]>a && passes(v,'uren')).length;
    $(`[data-ucount="${r}"]`).textContent=n;
  });
}

function render(){
  let list = VACATURES.filter(v=>passes(v));
  if(state.sort==='nieuwste') list.sort((a,b)=>b.datum.localeCompare(a.datum));
  if(state.sort==='uren')     list.sort((a,b)=>b.uren[1]-a.uren[1]);

  const box=$('#results');
  $('#result-count').innerHTML = `<b>${list.length}</b> ${list.length===1?'vacature':'vacatures'} gevonden`;

  box.innerHTML = list.length ? list.map(v=>`
    <article class="vcard">
      <div>
        <div class="vtop">
          ${v.top?'<span class="badge">Topvacature</span>':''}
          <span class="vakgebied">${VAKGEBIEDEN[v.vakgebied]}</span>
        </div>
        <h3>${v.titel}</h3>
        <div class="vmeta">
          <span>📍 ${v.plaats}</span><span>🕒 ${fmtUren(v.uren)}</span>
          <span>💶 ${v.schaal}</span><span>📄 ${v.type}</span>
        </div>
        <p class="desc">${v.omschrijving}</p>
      </div>
      <div class="vcta"><a class="btn btn-primary" href="contact.html">Bekijk vacature</a></div>
    </article>`).join('')
    : `<div class="no-results"><strong>Geen vacatures gevonden.</strong><br>Pas je filters aan of zet een vacaturemelding aan.</div>`;

  counts();
}

/* ---------- events ---------- */
function init(){
  buildFacets();
  $('#zoek-tekst').addEventListener('input', e=>{ state.tekst=e.target.value; render(); });
  $('#zoek-plaats').addEventListener('input', e=>{ state.plaats=e.target.value; render(); });
  $('#sorteer').addEventListener('change', e=>{ state.sort=e.target.value; render(); });

  $('#facet-vak').addEventListener('change', e=>{
    const k=e.target.value; e.target.checked?state.vak.add(k):state.vak.delete(k); render();
  });
  $('#facet-uren').addEventListener('change', e=>{
    const k=e.target.value; e.target.checked?state.uren.add(k):state.uren.delete(k); render();
  });
  $('#reset').addEventListener('click', ()=>{
    state.tekst=state.plaats=''; state.vak.clear(); state.uren.clear(); state.sort='nieuwste';
    $('#zoek-tekst').value=''; $('#zoek-plaats').value=''; $('#sorteer').value='nieuwste';
    $$('#filters input[type=checkbox]').forEach(c=>c.checked=false);
    render();
  });
  // weergave lijst/grid
  $$('.viewtoggle button').forEach(b=>b.addEventListener('click',()=>{
    $$('.viewtoggle button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    $('#results').classList.toggle('grid', b.dataset.view==='grid');
  }));
  // mobiel filterpaneel
  $('#filter-toggle')?.addEventListener('click',()=> $('#filters').classList.toggle('collapsed'));

  render();
}
document.addEventListener('DOMContentLoaded', init);
