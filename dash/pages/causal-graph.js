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
  const loopsEl = document.getElementById('node-info-loops');
  const tabButtons = document.querySelectorAll('#node-info-tabs .tab-button');
  const tabContents = document.querySelectorAll('#node-info-sidebar .tab-content');
  const closeBtn = document.getElementById('node-info-close');
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', function() {
      sidebar.classList.add('translate-x-full');
    });
  }

  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabButtons.forEach(function(b) { b.classList.replace('active-tab', 'inactive-tab'); });
      tabContents.forEach(function(c) { c.classList.add('hidden'); });
      btn.classList.replace('inactive-tab', 'active-tab');
      var tabId = 'tab-' + btn.getAttribute('data-tab');
      var content = document.getElementById(tabId);
      if (content) content.classList.remove('hidden');
    });
  });

  const loadingEl = document.createElement('div');
  let cy;
  loadingEl.textContent = 'در حال بارگذاری...';
  loadingEl.className = 'text-center my-4';
  container.appendChild(loadingEl);

  fetch(dataPath)
    .then(function(res) { return res.json(); })
    .then(function(causalData) {
      // Log the raw data to verify it loaded correctly
      console.log('Fetched graph data:', causalData);
      console.log('Edges array from fetch:', causalData.edges);
      const cy = cytoscape({
        container: container,
        elements: [],
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
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier'
            }
          },
          {
            selector: 'edge[type="positive"]',
            style: {
              'line-color': '#16a34a',
              'target-arrow-color': '#16a34a'
            }
          },
          {
            selector: 'edge[type="negative"]',
            style: {
              'line-color': '#dc2626',
              'target-arrow-color': '#dc2626'
            }
          }
        ],
        layout: { name: 'cose' }
      });

      addDataToGraph(cy, causalData);
      // log the edge count right after adding data
      console.log('Edges after addDataToGraph:', cy.edges().length);

      // log element counts to check against the JSON file
      console.log('Graph now has', cy.nodes().length, 'nodes and', cy.edges().length, 'edges');

      const toggleR = document.getElementById('toggle-reinforcing');
      const toggleB = document.getElementById('toggle-balancing');

      function updateEdgeVisibility() {
        cy.edges().forEach(function(edge) {
          var loop = edge.data('loop') || (edge.data('type') === 'negative' ? 'B' : 'R');
          if ((loop === 'R' && toggleR && !toggleR.checked) || (loop === 'B' && toggleB && !toggleB.checked)) {
            edge.hide();
          } else {
            edge.show();
          }
        });
      }

      if (toggleR) toggleR.addEventListener('change', updateEdgeVisibility);
      if (toggleB) toggleB.addEventListener('change', updateEdgeVisibility);

      updateEdgeVisibility();

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
        if (loopsEl && cy) {
          loopsEl.innerHTML = '';
          var loopsSet = new Set();
          cy.edges().forEach(function(edge) {
            var data = edge.data();
            if (data.source === d.id || data.target === d.id) {
              var l = data.loop || (data.type === 'negative' ? 'B' : 'R');
              loopsSet.add(l);
            }
          });
          if (loopsSet.size) {
            loopsSet.forEach(function(l) {
              var li = document.createElement('li');
              li.textContent = l === 'R' ? 'حلقه تقویتی' : 'حلقه متعادل‌کننده';
              loopsEl.appendChild(li);
            });
          } else {
            var li = document.createElement('li');
            li.textContent = 'حلقه مرتبطی یافت نشد';
            loopsEl.appendChild(li);
          }
        }
        // reset tabs to description on each open
        tabButtons.forEach(function(b) { b.classList.replace('active-tab', 'inactive-tab'); });
        tabContents.forEach(function(c) { c.classList.add('hidden'); });
        var firstTab = document.querySelector('#node-info-tabs [data-tab="desc"]');
        if (firstTab) firstTab.classList.replace('inactive-tab', 'active-tab');
        var firstContent = document.getElementById('tab-desc');
        if (firstContent) firstContent.classList.remove('hidden');
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

function addDataToGraph(cy, data) {
  if (!cy || !data) return;

  var newElements = [];

  (data.nodes || []).forEach(function(n) {
    var id = n && n.data && n.data.id;
    if (id && cy.getElementById(id).empty()) {
      newElements.push(n);
    }
  });

  (data.edges || []).forEach(function(e) {
    var d = e && e.data;
    if (!d || !d.id) return;
    if (!cy.getElementById(d.id).empty()) return;
    if (!cy.getElementById(d.source).empty() && !cy.getElementById(d.target).empty()) {
      newElements.push(e);
    }
  });

  if (newElements.length) {
    cy.add(newElements);
    console.log('Edges count after add:', cy.edges().length);
    cy.layout({ name: 'cose' }).run();
  }
}

window.addDataToGraph = addDataToGraph;
