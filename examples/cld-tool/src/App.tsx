
      <Graph
        ref={graphRef}
        search={search}
        onNodeClick={(data, pos) => {
          setSidebarNode(data);
          setSidebarPos(pos);
        }}

    </div>
  );
}

export default App;
