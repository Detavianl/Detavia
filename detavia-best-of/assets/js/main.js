// Demoformulier: in de live versie koppelen aan jullie systeem.
function demoForm(f){
  alert('Bedankt! In de live versie wordt dit verstuurd naar jullie systeem.');
  f.reset();
  return false;
}

// Mobiel menu
document.addEventListener('click', function(e){
  if(!e.target.closest('.burger')) return;
  var ul = document.querySelector('.nav ul');
  if(!ul) return;
  var open = ul.classList.toggle('open');
  Object.assign(ul.style, open ? {
    display:'flex', position:'absolute', flexDirection:'column',
    background:'#fff', top:'78px', left:'0', right:'0',
    padding:'20px var(--pad)', borderBottom:'1px solid #eee', gap:'16px'
  } : { display:'' });
});

// Vacature-filter (chips) op de vacaturepagina
document.addEventListener('click', function(e){
  var chip = e.target.closest('.chip');
  if(!chip) return;
  var group = chip.closest('.filters');
  group.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));
  chip.classList.add('on');
  var f = chip.dataset.filter;
  document.querySelectorAll('.vac').forEach(function(v){
    v.style.display = (f==='all' || v.dataset.cat===f) ? '' : 'none';
  });
});
