function initCausalGraph(dataPath) {
  const container = document.getElementById('cy');
  if (!container) {
    console.error('Container element with id "cy" not found');
    return;
  }

  const sidebar = document.getElementById('node-info-sidebar');
  const titleEl = document.getElementById('node-info-title');
  const descEl = document.getElementById('node-info-desc');
  const resEl = document.getElementById('node-info-resources');
  const closeBtn = document.getElementById('node-info-close');
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', function() {
      sidebar.classList.add('translate-x-full');
    });
  }

  const loadingEl = document.createElement('div');
  let cy;
  loadingEl.textContent = 'در حال بارگذاری...';
  loadingEl.className = 'text-center my-4';
  container.appendChild(loadingEl);

  fetch(dataPath)
    .then(function(res) { return res.json(); })
    .then(function(causalData) {
      console.log(causalData); // log loaded data
      const cy = cytoscape({
        container: container,
        elements: [].concat(causalData.nodes || [], causalData.edges || []),
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'background-color': '#007bff',
              width: 50,
              height: 50
            }
          },
          {
            selector: 'edge',
            style: {
              width: 4,
              'line-color': "mapData(type, 'positive', 'green', 'negative', 'red', 'neutral', 'gray')",
              'target-arrow-color': "mapData(type, 'positive', 'green', 'negative', 'red', 'neutral', 'gray')",
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier'
            }
          }
        ],
        layout: { name: 'cose' }
      });

      cy.on('tap', 'node', function(evt) {
        if (!sidebar) return;
        var d = evt.target.data();
        if (titleEl) titleEl.textContent = d.label || '';
        if (descEl) descEl.textContent = d.description || '';
        if (resEl) {
          resEl.innerHTML = '';
          if (d.resources && Array.isArray(d.resources)) {
            d.resources.forEach(function(url) {
              var li = document.createElement('li');
              var a = document.createElement('a');
              a.href = url;
              a.textContent = url;
              a.target = '_blank';
              a.className = 'text-teal-700 hover:underline';
              li.appendChild(a);
              resEl.appendChild(li);
            });
          }
        }
        sidebar.classList.remove('translate-x-full');
      });
    })
    .catch(function(err) {
      console.error('Error loading graph data', err);
      container.innerHTML = '<div class="text-red-600">خطا در بارگذاری داده‌های نمودار</div>';
    })
    .finally(function() {
      loadingEl.remove();
    });

  return cy;
}

window.initCausalGraph = initCausalGraph;
