function initCausalGraph(dataPath) {
  return new Promise(function(resolve, reject) {
    const container = document.getElementById('cy');
    if (!container) {
      console.error('Container element with id "cy" not found');
      reject(new Error('Container element with id "cy" not found'));
      return;
    }
  const sliderContainer = document.getElementById('time-slider-container');
  const slider = document.getElementById('time-slider');
  const sliderLabel = document.getElementById('time-label');

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
      if (cy) cy.edges().removeClass('highlight faded');
      activeNode = null;
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
  let activeNode = null;
  loadingEl.textContent = 'در حال بارگذاری...';
  loadingEl.className = 'text-center my-4';
  container.appendChild(loadingEl);

  fetch(dataPath)
    .then(function(res) { return res.json(); })
    .then(function(causalData) {
      // Map relation type to color while preserving the original sign
      (causalData.edges || []).forEach(function(e) {
        var sign = e.data.type; // 'positive' or 'negative'
        e.data.sign = sign;
        e.data.type = sign === 'positive' ? 'green' : 'red';
      });
      cy = cytoscape({
        container: container,
        elements: [],
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'background-color': '#007bff',
              width: 50,
              height: 50,
              opacity: 1,
              'transition-property': 'opacity',
              'transition-duration': '300ms'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': 'data(type)',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': 'data(type)',
              width: 3
            }
          },
          {
            selector: 'edge.highlight',
            style: {
              'line-color': '#f59e0b',
              'target-arrow-color': '#f59e0b',
              width: 6
            }
          },
          {
            selector: 'edge.faded',
            style: {
              'opacity': 0.3
            }
          }
        ],
        layout: { name: 'cose' }
      });

      console.log('Nodes:', (causalData.nodes || []).length,
                  'Edges:', (causalData.edges || []).length);
      cy.add([...(causalData.nodes || []), ...(causalData.edges || [])]);
      cy.layout({ name: 'cose' }).run();
      cy.resize();
      cy.fit();
      console.log('مرحله ۴ OK: resize و fit انجام شد');
      console.log('Cytoscape elements:', cy.elements().length);

      const toggleR = document.getElementById('toggle-reinforcing');
      const toggleB = document.getElementById('toggle-balancing');
      const zoomInBtn = document.getElementById('zoom-in');
      const zoomOutBtn = document.getElementById('zoom-out');
      const zoomResetBtn = document.getElementById('zoom-reset');

      function updateEdgeVisibility() {
        var edges = cy.edges();
        edges.hide();
        if (toggleR && toggleR.checked) {
          edges.filter(function(edge){
            var loop = edge.data('loop') || (edge.data('sign') === 'negative' ? 'B' : 'R');
            return loop === 'R';
          }).show();
        }
        if (toggleB && toggleB.checked) {
          edges.filter(function(edge){
            var loop = edge.data('loop') || (edge.data('sign') === 'negative' ? 'B' : 'R');
            return loop === 'B';
          }).show();
        }
      }

      if (toggleR) toggleR.addEventListener('change', updateEdgeVisibility);
      if (toggleB) toggleB.addEventListener('change', updateEdgeVisibility);

      if (zoomInBtn)
        zoomInBtn.addEventListener('click', function () {
          cy.zoom(cy.zoom() * 1.2);
        });

      if (zoomOutBtn)
        zoomOutBtn.addEventListener('click', function () {
          cy.zoom(cy.zoom() * 0.8);
        });

      if (zoomResetBtn)
        zoomResetBtn.addEventListener('click', function () {
          cy.fit();
        });

      updateEdgeVisibility();

      cy.on('tap', 'node', function(evt) {
        if (!sidebar) return;
        var node = evt.target;
        var d = node.data();
        if (activeNode && activeNode.id() === node.id()) {
          cy.edges().removeClass('highlight faded');
          activeNode = null;
          return;
        }
        activeNode = node;
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
              var l = data.loop || (data.sign === 'negative' ? 'B' : 'R');
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

        // highlight connected edges and fade others
        var id = d.id;
        var connectedEdges = cy.edges('[source = "' + id + '"]').union(cy.edges('[target = "' + id + '"]'));
        cy.edges().removeClass('highlight faded');
        connectedEdges.addClass('highlight');
        cy.edges().not(connectedEdges).addClass('faded');
      });

      // clear highlights when tapping on empty space
      cy.on('tap', function(evt) {
        if (evt.target === cy) {
          cy.edges().removeClass('highlight faded');
          activeNode = null;
        }
      });

      resolve(cy);
    })
    .catch(function(err) {
      console.error('Error loading graph data', err);
      container.innerHTML = '<div class="text-red-600">خطا در بارگذاری داده‌های نمودار</div>';
      reject(err);
    })
    .finally(function() {
      loadingEl.remove();
    });
  });

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
    cy.resize();
    cy.fit();
    console.log('مرحله ۴ OK: resize و fit انجام شد');
    if (cy.forceRender) cy.forceRender();
  }
}

window.addDataToGraph = addDataToGraph;



document.addEventListener("DOMContentLoaded", () => {
  const cyContainer = document.getElementById("cy");
  if (!cyContainer) {
    console.warn("Container #cy not found—skipping graph init");
  } else {
    initCausalGraph("data/causal-power-imbalance.json").then(cy => {
      window.cyInstance = cy;
    });
  }
});
