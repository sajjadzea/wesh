
      <Graph
        elements={elements}
        onNodeClick={(id, pos) => {
          setSidebarNode(id);
          setSidebarPos(pos);
        }}

    </div>
  );
}

export default App
