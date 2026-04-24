exports.buildHierarchies = (edges) => {
  // Let's set up basic adj lists. 
  // keeping track of children for tree building, and parents to enforce the "first-parent-wins" rule.
  const children = {}; 
  const parents = {}; 
  const allNodes = new Set();

  // 1. Parse edges and handle the multi-parent conflict
  for (const edge of edges) {
    const [p, c] = edge.split("->");
    allNodes.add(p);
    allNodes.add(c);

    if (!children[p]) children[p] = [];

    // The requirements say if a node gets multiple parents (like A->D and B->D),
    // we strictly keep the first one and silently drop the rest.
    if (parents[c] === undefined) {
      parents[c] = p;
      children[p].push(c);
    }
  }

  // 2. Group nodes into connected components. 
  // I'm using Union-Find here because it's much cleaner than doing BFS/DFS on an undirected graph just to find isolated clusters.
  const uf = {};
  function find(x) {
    if (uf[x] === undefined) uf[x] = x;
    if (uf[x] !== x) uf[x] = find(uf[x]);
    return uf[x];
  }
  function union(a, b) {
    uf[find(a)] = find(b);
  }

  // Connect everything based on our accepted (filtered) edges
  for (const node of allNodes) {
    const p = parents[node];
    if (p) {
      union(p, node);
    }
  }

  // Bucket them by their component representative
  const components = {};
  for (const n of allNodes) {
    const rep = find(n);
    if (!components[rep]) components[rep] = [];
    components[rep].push(n);
  }

  const hierarchies = [];

  // 3. Process each isolated graph component
  for (const [, nodes] of Object.entries(components)) {
    // Find candidate roots (nodes that literally have nobody pointing to them)
    const compRoots = nodes.filter((n) => parents[n] === undefined);
    
    let root;
    if (compRoots.length > 0) {
      // Tie-breaker: just pick the lexically smallest root if there are multiple somehow
      root = compRoots.sort()[0];
    } else {
      // Pure cycle scenario! No node is parent-less. 
      // Spec says: pick lexicographically smallest node as the root.
      root = nodes.sort()[0];
    }

    // 4. Cycle detection via standard DFS
    // Keeping a recursion stack to catch back-edges.
    let hasCycle = false;
    const visited = new Set();
    const stack = new Set();

    function dfs(node) {
      if (stack.has(node)) {
        hasCycle = true;
        return;
      }
      if (visited.has(node)) return;
      
      visited.add(node);
      stack.add(node);
      
      for (const child of (children[node] || [])) {
        dfs(child);
        if (hasCycle) return; // bail early if we hit a cycle
      }
      stack.delete(node); // pop from recursion stack
    }

    // Start DFS from our chosen root
    dfs(root);
    
    // Edge case check: if we have weird disconnected cycles hanging out in the same component
    // (should be rare with our strict parent rules, but better safe than sorry)
    for (const n of nodes) {
      if (!visited.has(n)) {
         dfs(n);
      }
    }

    // 5. Final Assembly
    if (hasCycle) {
      // It's a cycle, so we return an empty tree object and don't calculate depth.
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      // Recursively build the actual nested tree JSON structure
      function buildTree(node) {
        const obj = {};
        for (const child of (children[node] || [])) {
          obj[child] = buildTree(child);
        }
        return obj;
      }

      const tree = { [root]: buildTree(root) };

      // Calculate depth (longest path from root to a leaf)
      function maxDepth(node) {
        const kids = children[node] || [];
        if (kids.length === 0) return 1; // leaf node counts as 1
        return 1 + Math.max(...kids.map(maxDepth));
      }

      const depth = maxDepth(root);
      hierarchies.push({ root, tree, depth });
    }
  }

  return hierarchies;
};

exports.computeSummary = (hierarchies) => {
  // Separate the healthy trees from the cycles for stats
  const nonCyclic = hierarchies.filter((h) => !h.has_cycle);
  const cyclic = hierarchies.filter((h) => h.has_cycle);

  let largest_tree_root = "";
  if (nonCyclic.length > 0) {
    // Sort descending by depth. If there's a tie, fallback to alphabetical sorting of the root letter.
    nonCyclic.sort((a, b) => {
      if (b.depth !== a.depth) return b.depth - a.depth;
      return a.root.localeCompare(b.root);
    });
    largest_tree_root = nonCyclic[0].root;
  }

  return {
    total_trees: nonCyclic.length,
    total_cycles: cyclic.length,
    largest_tree_root,
  };
};
