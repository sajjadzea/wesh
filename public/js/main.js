
async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

async function initGraph() {
  const [nodes, edges] = await Promise.all([
    fetchJSON('/data/graph/nodes.json'),
    fetchJSON('/data/graph/edges.json')
  ]);
  cytoscape({
    container: document.getElementById('graph-container'),
    elements: [...nodes, ...edges],
    style: [
      { selector: 'node', style: { label: 'data(label)', 'background-color': '#0d9488', color: '#fff' } },
      { selector: 'edge', style: { 'line-color': '#94a3b8', width: 2, 'target-arrow-shape': 'triangle', 'target-arrow-color': '#94a3b8' } }
    ],
    layout: { name: 'grid' }
  });
}

function initDashboard() {
  const filter = document.getElementById('categoryFilter');
  const cardsContainer = document.getElementById('dashboard-cards');
  const categories = ['همه', 'مدیریت', 'عملیات'];
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filter.appendChild(opt);
  });

  const cards = [
    { id: 1, title: 'KPI 1', value: 42, category: 'مدیریت' },
    { id: 2, title: 'KPI 2', value: 17, category: 'عملیات' }
  ];

  function renderCards(cat) {
    cardsContainer.innerHTML = '';
    cards.filter(c => cat === 'همه' || c.category === cat).forEach(c => {
      const div = document.createElement('div');
      div.className = 'dashboard-card';
      div.innerHTML = `<h4>${c.title}</h4><p>${c.value}</p>`;
      cardsContainer.appendChild(div);
    });
  }
  filter.addEventListener('change', e => renderCards(e.target.value));
  renderCards('همه');

  new Chart(document.getElementById('chart1').getContext('2d'), {
    type: 'line',
    data: { labels: ['A','B','C'], datasets: [{ label: 'نمونه', data: [10,20,30], borderColor: '#0d9488'}]},
    options: { responsive: true }
  });

  new Chart(document.getElementById('chart2').getContext('2d'), {
    type: 'bar',
    data: { labels: ['X','Y','Z'], datasets: [{ label: 'نمونه', data: [5,8,3], backgroundColor: '#3b82f6'}]},
    options: { responsive: true }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGraph().catch(console.error);
  initDashboard();
});
