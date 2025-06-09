function initCausalGraph(dataPath) {
  const container = document.getElementById('cy');
  if (!container) {
    console.error('Container element with id "cy" not found');
    return;
  }

  const loadingEl = document.createElement('div');
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
        var d = evt.target.data();
        alert(d.label + '\n' + d.description + '\n' + (d.resources ? d.resources.join(', ') : ''));
      });
    })
    .catch(function(err) {
      console.error('Error loading graph data', err);
      container.innerHTML = '<div class="text-red-600">خطا در بارگذاری داده‌های نمودار</div>';
    })
    .finally(function() {
      loadingEl.remove();
    });
}

window.initCausalGraph = initCausalGraph;
