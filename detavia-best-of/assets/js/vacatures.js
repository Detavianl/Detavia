/* ============================================================
   DetaVia - vacature-zoeksysteem (filterstructuur joinuz-stijl)
   Volgorde: Locatie -> Afstand -> Vakgebied -> Branches ->
   Uren per week (min/max) -> Zoeken.
   Voorbeelddata: vervang door echte vacatures of koppel later
   aan het flexportaal/CMS. Velden:
     titel, vakgebied(branche-sleutel), plaats, uren[min,max],
     schaal, type, top(bool), datum, omschrijving
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
  {titel:'Wmo-consulent',                 vakgebied:'wmo',          plaats:'Almere',     uren:[32,36], salaris:[3300,4600], type:'Detachering', top:true,  datum:'2026-06-12', omschrijving:'Je voert keukentafelgesprekken en organiseert passende ondersteuning, zodat inwoners zo zelfstandig mogelijk blijven.'},
  {titel:'Wmo-consulent complexe casuïstiek', vakgebied:'wmo',      plaats:'Utrecht',    uren:[36,40], salaris:[3700,5300], type:'Detachering', top:false, datum:'2026-06-08', omschrijving:'Voor de zwaardere casuïstiek zoek je samen met inwoner en netwerk naar een duurzame oplossing.'},
  {titel:'Jeugdconsulent',                vakgebied:'jeugd',        plaats:'Amsterdam',  uren:[28,36], salaris:[3300,4600], type:'Detachering', top:true,  datum:'2026-06-11', omschrijving:'Je begeleidt gezinnen naar passende jeugdhulp en houdt regie op het ondersteuningsplan.'},
  {titel:'Gezinscoach',                   vakgebied:'jeugd',        plaats:'Rotterdam',  uren:[24,32], salaris:[3000,4000], type:'Detachering', top:false, datum:'2026-06-03', omschrijving:'Als gezinscoach werk je outreachend en versterk je de eigen kracht van het gezin.'},
  {titel:'Klantmanager Participatie',     vakgebied:'participatie', plaats:'Den Haag',   uren:[32,40], salaris:[3300,4600], type:'Detachering', top:true,  datum:'2026-06-10', omschrijving:'Je begeleidt inwoners naar werk en meedoen, met aandacht voor wat iemand wél kan.'},
  {titel:'Klantmanager Werk & Inkomen',   vakgebied:'participatie', plaats:'Eindhoven',  uren:[36,40], salaris:[3300,4600], type:'ZZP',        top:false, datum:'2026-05-28', omschrijving:'Een brede caseload op het snijvlak van werk, inkomen en participatie.'},
  {titel:'Schuldhulpverlener',            vakgebied:'schuld',       plaats:'Groningen',  uren:[24,36], salaris:[3000,4000], type:'Detachering', top:false, datum:'2026-06-06', omschrijving:'Je brengt financiële rust en grip terug en stelt samen een haalbaar plan op.'},
  {titel:'Budgetcoach',                   vakgebied:'schuld',       plaats:'Tilburg',    uren:[16,24], salaris:[2700,3700], type:'Detachering', top:false, datum:'2026-05-30', omschrijving:'Je coacht inwoners naar financiële zelfredzaamheid en voorkomt nieuwe schulden.'},
  {titel:'Inkomensconsulent',             vakgebied:'inkomen',      plaats:'Zwolle',     uren:[32,36], salaris:[3000,4000], type:'Detachering', top:true,  datum:'2026-06-09', omschrijving:'Je beoordeelt aanvragen rechtmatig en menselijk, met oog voor de mens achter de aanvraag.'},
  {titel:'Medewerker Terugvordering',     vakgebied:'inkomen',      plaats:'Breda',      uren:[32,40], salaris:[3000,4000], type:'Detachering', top:false, datum:'2026-05-26', omschrijving:'Je handelt terugvorderingen en verhaal zorgvuldig en oplossingsgericht af.'},
  {titel:'Adviseur Sociaal Domein',       vakgebied:'beleid',       plaats:'Amersfoort', uren:[32,40], salaris:[4000,5800], type:'Detachering', top:true,  datum:'2026-06-07', omschrijving:'Je vertaalt ontwikkelingen naar beleid en adviseert het management van uitvoering tot strategie.'},
  {titel:'Beleidsmedewerker Wmo & Jeugd', vakgebied:'beleid',       plaats:'Nijmegen',   uren:[28,36], salaris:[3700,5300], type:'Detachering', top:false, datum:'2026-05-22', omschrijving:'Je ontwikkelt en evalueert beleid op het brede sociaal domein.'}
];

/* ---------- helpers ---------- */
const $  = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const fmtUren = u => `${u[0]}-${u[1]} uur`;
const euro = n => '€ ' + n.toLocaleString('nl-NL');
const fmtSalaris = s => `${euro(s[0])} - ${euro(s[1])} p/m`;
const state = { tekst:'', plaats:'', vak:new Set(), urenMin:null, urenMax:null, sort:'nieuwste' };

/* ---------- branches (checkboxes met aantallen) ---------- */
function buildFacets(){
  $('#facet-vak').innerHTML = Object.entries(VAKGEBIEDEN).map(([k,label])=>`
    <label class="facet" data-vak="${k}">
      <input type="checkbox" value="${k}">
      <span>${label}</span><span class="fc" data-count="${k}">0</span>
    </label>`).join('');
}

/* ---------- filter-logica ---------- */
function matchUren(v){
  const min = state.urenMin, max = state.urenMax;
  if(min==null && max==null) return true;
  const lo = min==null ? 0  : min;
  const hi = max==null ? 99 : max;
  return v.uren[0] <= hi && v.uren[1] >= lo; // overlap met [lo,hi]
}
function passes(v, ignore){
  if(state.tekst){
    const q=state.tekst.toLowerCase();
    if(!(v.titel.toLowerCase().includes(q) || v.omschrijving.toLowerCase().includes(q) || VAKGEBIEDEN[v.vakgebied].toLowerCase().includes(q))) return false;
  }
  if(state.plaats && !v.plaats.toLowerCase().includes(state.plaats.toLowerCase())) return false;
  if(ignore!=='vak' && state.vak.size && !state.vak.has(v.vakgebied)) return false;
  if(!matchUren(v)) return false;
  return true;
}

function counts(){
  Object.keys(VAKGEBIEDEN).forEach(k=>{
    const n = VACATURES.filter(v=>v.vakgebied===k && passes(v,'vak')).length;
    const el=$(`[data-count="${k}"]`); el.textContent=n;
    el.closest('.facet').classList.toggle('off', n===0 && !state.vak.has(k));
  });
}

function render(){
  let list = VACATURES.filter(v=>passes(v));
  if(state.sort==='nieuwste') list.sort((a,b)=>b.datum.localeCompare(a.datum));
  if(state.sort==='uren')     list.sort((a,b)=>b.uren[1]-a.uren[1]);

  $('#result-count').innerHTML = `<b>${list.length}</b> ${list.length===1?'vacature':'vacatures'} gevonden`;
  $('#results').innerHTML = list.length ? list.map(v=>`
    <article class="vcard">
      <div>
        <div class="vtop">
          ${v.top?'<span class="badge">Topvacature</span>':''}
          <span class="vakgebied">${VAKGEBIEDEN[v.vakgebied]}</span>
        </div>
        <h3>${v.titel}</h3>
        <div class="vmeta">
          <span>📍 ${v.plaats}</span><span>🕒 ${fmtUren(v.uren)}</span>
          <span>💶 ${fmtSalaris(v.salaris)}</span><span>📄 ${v.type}</span>
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

  // Afstand-slider: toont de waarde (geo-filtering volgt bij koppeling met echte locaties)
  const afstand=$('#afstand');
  if(afstand) afstand.addEventListener('input', e=>{ $('#afstand-val').textContent = e.target.value+' km'; });

  // Branches
  $('#facet-vak').addEventListener('change', e=>{
    const k=e.target.value; e.target.checked?state.vak.add(k):state.vak.delete(k); render();
  });

  // Uren per week (min/max)
  $('#uren-min').addEventListener('input', e=>{ state.urenMin = e.target.value===''?null:Number(e.target.value); render(); });
  $('#uren-max').addEventListener('input', e=>{ state.urenMax = e.target.value===''?null:Number(e.target.value); render(); });

  // Zoeken-knop (filtert al live; knop scrollt naar de resultaten)
  $('#zoek-knop').addEventListener('click', ()=>{
    render();
    $('#results').scrollIntoView({behavior:'smooth', block:'start'});
  });

  // Verwijder filters
  $('#reset').addEventListener('click', ()=>{
    state.tekst=state.plaats=''; state.vak.clear(); state.urenMin=state.urenMax=null; state.sort='nieuwste';
    $('#zoek-tekst').value=''; $('#zoek-plaats').value=''; $('#sorteer').value='nieuwste';
    $('#uren-min').value=''; $('#uren-max').value='';
    if(afstand){ afstand.value=50; $('#afstand-val').textContent='50 km'; }
    $$('#facet-vak input[type=checkbox]').forEach(c=>c.checked=false);
    render();
  });

  // Weergave lijst/raster
  $$('.viewtoggle button').forEach(b=>b.addEventListener('click',()=>{
    $$('.viewtoggle button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    $('#results').classList.toggle('grid', b.dataset.view==='grid');
  }));
  // Mobiel filterpaneel
  $('#filter-toggle')?.addEventListener('click',()=> $('#filters').classList.toggle('collapsed'));

  render();
}
document.addEventListener('DOMContentLoaded', init);
