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
  const loopListEl = document.getElementById('loop-list');
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

            }
          }
        ],
        layout: { name: 'cose' }
      });

      addDataToGraph(cy, causalData);
      // log the edge count right after adding data
      console.log('Edges after addDataToGraph:', cy.edges().length);

      labelLoops(cy, loopListEl);

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

function labelLoops(cy, listEl) {
  if (!cy) return;
  if (listEl) listEl.innerHTML = '';

  var loops = findLoops(cy);
  var r = 0, b = 0;

  loops.forEach(function(loop) {
    var neg = loop.filter(function(e){ return e.data('type') === 'negative'; }).length;
    var isRe = neg % 2 === 0;
    var label = (isRe ? 'R' : 'B') + (isRe ? ++r : ++b);
    var firstEdge = loop[0];
    firstEdge.data('loopLabel', label);

    if (listEl) {
      var li = document.createElement('li');
      li.textContent = label;
      listEl.appendChild(li);
    }
  });

  // simple tooltip on hover
  cy.on('mouseover', 'edge[loopLabel]', function(evt){
    var t = document.createElement('div');
    t.className = 'loop-tooltip';
    t.textContent = evt.target.data('loopLabel');
    document.body.appendChild(t);

    var update = function(){
      var pos = evt.target.midpoint();
      var pan = cy.pan();
      var zoom = cy.zoom();
      t.style.left = (pos.x * zoom + pan.x) + 'px';
      t.style.top = (pos.y * zoom + pan.y - 20) + 'px';
    };
    update();
    evt.target.on('mousemove', update);
    evt.target.one('mouseout', function(){
      evt.target.removeListener('mousemove', update);
      t.remove();
    });
  });
}

function findLoops(cy){
  var cycles = [];
  var seen = new Set();

  function dfs(start, node, path, visited){
    visited.add(node.id());
    node.outgoers('edge').forEach(function(edge){
      var target = edge.target();
      if(target.id() === start.id()){
        var cycle = path.concat([edge]);
        var key = cycle.map(function(e){ return e.id(); }).sort().join('-');
        if(!seen.has(key)){
          seen.add(key);
          cycles.push(cycle);
        }
      } else if(!visited.has(target.id())) {
        dfs(start, target, path.concat([edge]), visited);
      }
    });
    visited.delete(node.id());
  }

  cy.nodes().forEach(function(n){
    dfs(n, n, [], new Set());
  });

  return cycles;
}
