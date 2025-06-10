function initCausalGraph(dataPath) {
  const container = document.getElementById('cy');
  if (!container) {
    console.error('Container element with id "cy" not found');
    return;
  }
  const sliderContainer = document.getElementById('time-slider-container');
  const slider = document.getElementById('time-slider');
  const sliderLabel = document.getElementById('time-label');

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
              width: 4,
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              opacity: 1,
              'transition-property': 'opacity',
              'transition-duration': '300ms'
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

      var timestamps = [];
      (causalData.nodes || []).forEach(function(n){
        var t = n.data && n.data.timestamp;
        if (typeof t === 'number') timestamps.push(t);
      });
      (causalData.edges || []).forEach(function(e){
        var t = e.data && e.data.timestamp;
        if (typeof t === 'number') timestamps.push(t);
      });

      if (timestamps.length && slider && sliderContainer && sliderLabel) {
        timestamps.sort(function(a,b){return a-b;});
        slider.min = timestamps[0];
        slider.max = timestamps[timestamps.length - 1];
        slider.value = slider.max;
        sliderContainer.classList.remove('hidden');
        sliderLabel.textContent = formatFaDate(parseInt(slider.value, 10));

        function updateTime() {
          var val = parseInt(slider.value, 10);
          sliderLabel.textContent = formatFaDate(val);
          cy.batch(function(){
            cy.nodes().forEach(function(n){
              var ts = n.data('timestamp');
              n.style('opacity', ts == null || ts <= val ? 1 : 0);
            });
            cy.edges().forEach(function(e){
              var ts = e.data('timestamp');
              e.style('opacity', ts == null || ts <= val ? 1 : 0);
            });
          });
        }
        slider.addEventListener('input', updateTime);
        // initial filter
        updateTime();
      }

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
        }
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


}
