import React, { useMemo } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import './VisualGraph.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 60;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export const VisualGraph = ({ hierarchies }) => {
  // Memoizing this so we don't recalculate the entire graph layout 
  // on every single React re-render. Dagre can be heavy for huge graphs!
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const initialNodes = [];
    const initialEdges = [];

    hierarchies.forEach((h, hIdx) => {
      // Adding a prefix so if "A" exists in multiple disconnected components,
      // React Flow doesn't freak out about duplicate IDs.
      const prefix = `h${hIdx}-`; 

      if (h.has_cycle) {
        // It's a cycle, we don't have the full tree object to traverse.
        // Let's just drop a standalone node to visually indicate it.
        initialNodes.push({
          id: `${prefix}${h.root}`,
          data: { label: `${h.root} (Cycle)` },
          className: 'custom-node cycle-node',
        });
        return;
      }

      // Standard BFS to flatten our nested tree object into 
      // an array of nodes and edges for React Flow.
      const queue = [{ node: h.root, parent: null, subTree: h.tree[h.root] }];
      
      while (queue.length > 0) {
        const { node, parent, subTree } = queue.shift();
        const nodeId = `${prefix}${node}`;

        if (!initialNodes.find(n => n.id === nodeId)) {
          const isRoot = node === h.root;
          const isLeaf = !subTree || Object.keys(subTree).length === 0;

          // Assigning some CSS classes based on where the node sits in the hierarchy
          let cls = 'custom-node node-standard';
          if (isRoot && !isLeaf) cls = 'custom-node node-root';
          else if (isLeaf && !isRoot) cls = 'custom-node node-leaf';
          else if (isRoot && isLeaf) cls = 'custom-node node-isolated';

          initialNodes.push({
            id: nodeId,
            data: { label: node },
            className: cls,
          });
        }

        if (parent) {
          // Draw a line connecting the parent to this child
          initialEdges.push({
            id: `e-${prefix}${parent}-${node}`,
            source: `${prefix}${parent}`,
            target: nodeId,
            animated: true,
            style: { stroke: 'var(--accent)', strokeWidth: 2, opacity: 0.7 }
          });
        }

        // Push children onto the queue for the next BFS level
        if (subTree) {
          for (const child of Object.keys(subTree)) {
            queue.push({ node: child, parent: node, subTree: subTree[child] });
          }
        }
      }
    });

    // Pass our raw nodes/edges through Dagre to calculate crisp X/Y coordinates
    return getLayoutedElements(initialNodes, initialEdges);
  }, [hierarchies]);

  if (!hierarchies || hierarchies.length === 0) return null;

  return (
    <div className="react-flow-wrapper">
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        fitView
        minZoom={0.5}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--border)" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
