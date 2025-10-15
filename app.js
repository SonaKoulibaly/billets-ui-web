// assets/app.js
const API = window.API_BASE || 'https://billets-api-1.onrender.com';

function showOneResult(txt) { document.getElementById('one-out').innerHTML = txt; }
function kpiCard(title, val){ return `<div class="p-3 rounded-xl border"><div class="text-slate-500 text-xs">${title}</div><div class="text-xl font-extrabold">${val}</div></div>`; }

document.getElementById('btn-one').onclick = async () => {
  const payload = {
    length: +document.getElementById('length').value,
    height_left: +document.getElementById('height_left').value,
    height_right: +document.getElementById('height_right').value,
    margin_low: +document.getElementById('margin_low').value,
    margin_up: +document.getElementById('margin_up').value,
    diagonal: +document.getElementById('diagonal').value
  };
  showOneResult('Envoi...');
  try {
    const r = await fetch(`${API}/predict_one`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const data = await r.json();
    const label = (data.prediction?.majority_vote ?? data.prediction) || '—';
    const proba = (data.avg_positive_probability?.rf ?? data.avg_positive_probability?.rf) || null;
    showOneResult(`<div>Résultat: <strong>${label}</strong>${proba!=null?` — proba RF: ${(proba*100).toFixed(1)}%`:''}</div>`);
  } catch(e) {
    showOneResult(`<span class="text-red-600">Erreur: ${e.message}</span>`);
  }
};

document.getElementById('btn-one-demo').onclick = () => {
  showOneResult('<strong>Simulé</strong> — Vrai (démo)');
};

// CSV upload
document.getElementById('btn-csv').onclick = async () => {
  const f = document.getElementById('csv').files[0];
  if(!f){ alert('Sélectionne un CSV'); return; }
  const form = new FormData();
  form.append('file', f, f.name);
  document.getElementById('kpis').innerHTML = 'Analyse en cours...';
  try {
    const r = await fetch(`${API}/predict_csv`, { method:'POST', body: form });
    if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const data = await r.json();
    // KPIs
    const rows_received = data.rows_received ?? '—';
    const used = data.rows_used_for_prediction ?? '—';
    const dropped = data.rows_dropped_after_cleaning ?? '—';
    document.getElementById('kpis').innerHTML = kpiCard('Lignes reçues', rows_received) + kpiCard('Lignes utilisées', used) + kpiCard('Lignes écartées', dropped);

    const sample = data.sample_predictions_head_labels || data.sample_predictions_head || [];
    if(sample.length){
      // Build HTML table
      const cols = Object.keys(sample[0]);
      let html = '<table class="min-w-full border"><thead><tr>';
      cols.forEach(c=> html += `<th class="border px-2 py-1 text-left text-xs">${c}</th>`);
      html += '</tr></thead><tbody>';
      sample.forEach(row=>{
        html += '<tr>';
        cols.forEach(c=> html += `<td class="border px-2 py-1 text-xs">${row[c] ?? ''}</td>`);
        html += '</tr>';
      });
      html += '</tbody></table>';
      document.getElementById('table').innerHTML = html;
      // compute % if possible
      const predCol = cols.find(c=> c.toLowerCase().startsWith('pred_')) || 'prediction';
      let n=0, pv=0;
      sample.forEach(r => {
        const v = String(r[predCol] ?? '').toLowerCase();
        if(v==='vrai' || v==='1' || v==='true'){ pv++; n++; } else if(v==='faux' || v==='0' || v==='false'){ n++; }
      });
      const pctV = n? Math.round(pv/n*100) : 0;
      const pctF = n? 100-pctV : 0;
      // draw Chart
      const ctx = document.getElementById('pie').getContext('2d');
      if(window._pieChart) window._pieChart.destroy();
      window._pieChart = new Chart(ctx, {
        type:'doughnut',
        data:{ labels:['Vrai','Faux'], datasets:[{ data:[pctV, pctF], backgroundColor:['#22c55e','#ef4444'] }] },
      });

      // save to localStorage history
      const snap = { date: new Date().toISOString(), total: n, vrai: Math.round(pctV*n/100), faux: Math.round(pctF*n/100) };
      const hist = JSON.parse(localStorage.getItem('history')||'[]'); hist.push(snap); localStorage.setItem('history', JSON.stringify(hist));
    } else {
      document.getElementById('table').textContent = 'Aucun aperçu retourné par l’API.';
    }
  } catch(e) {
    document.getElementById('kpis').innerHTML = `<div class="text-red-600">Erreur: ${e.message}</div>`;
  }
};

document.getElementById('btn-csv-demo').onclick = () => {
  document.getElementById('kpis').innerHTML = kpiCard('Lignes reçues', 10)+kpiCard('Lignes utilisées', 8)+kpiCard('Lignes écartées',2);
  document.getElementById('table').innerHTML = '<div class="text-sm">Exemple simulé — Voir CSV réel pour données vraies.</div>';
};
// app.js
console.log("App.js chargé ✅");

// Ton API Render
const API_BASE = "https://billets-api-1.onrender.com";

// Exemple de fonction pour tester l'API
async function testApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    console.log("✅ API OK :", data);
  } catch (error) {
    console.error("❌ Erreur API :", error);
  }
}

// Appel de test au chargement
testApiHealth();

