const fs = require('fs');
const cytoscape = require('cytoscape');

const cy = cytoscape({
  headless: true,
  elements: [],
  layout: { name: 'preset' }
});

function loadData(path) {
  const raw = fs.readFileSync(path, 'utf-8');
  return JSON.parse(raw);
}

function addDataToCy(data) {
  (data.nodes || []).forEach(n => {
    if (!cy.getElementById(n.data.id).length) {
      cy.add(n);
    }
  });
  (data.edges || []).forEach(e => {
    if (!cy.getElementById(e.data.id).length) {
      cy.add(e);
    }
  });
}

const data = loadData('data/simple-graph.json');
addDataToCy(data);

console.log('initial edges length:', cy.edges().length);
console.log('nodeA exists:', cy.getElementById('a').length);
console.log('nodeB exists:', cy.getElementById('b').length);

cy.add({ data: { id: 'testEdge', source: 'a', target: 'b', type: 'positive' } });
console.log('after manual add:', cy.edges().length);

console.log('final edges length:', cy.edges().length);
