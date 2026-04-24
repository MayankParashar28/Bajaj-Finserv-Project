import React from 'react';
import './TreeViewer.css';

const TreeNode = ({ node, treeObj, prefix, isLast, isRoot }) => {
  const children = treeObj ? Object.keys(treeObj) : [];
  
  let linePrefix = '';
  if (!isRoot) {
    linePrefix = isLast ? '└── ' : '├── ';
  }

  const labelClass = children.length === 0 ? 'tree-leaf' : 'tree-node';

  return (
    <>
      <div className="tree-line">
        {isRoot ? (
          <span className="tree-root-label">{node}</span>
        ) : (
          <>
            <span className="tree-connector">{prefix}{linePrefix}</span>
            <span className={labelClass}>{node}</span>
          </>
        )}
      </div>
      {children.map((child, i) => {
        const last = i === children.length - 1;
        const newPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ');
        return (
          <TreeNode
            key={child}
            node={child}
            treeObj={treeObj[child]}
            prefix={newPrefix}
            isLast={last}
            isRoot={false}
          />
        );
      })}
    </>
  );
};

export const TreeViewer = ({ hierarchy }) => {
  const isCycle = hierarchy.has_cycle === true;

  if (isCycle) {
    return (
      <div className="h-card cycle">
        <div className="h-card-header">
          <div className="root-badge">{hierarchy.root}</div>
          <div className="h-card-meta">
            <div className="root-label">Root: {hierarchy.root}</div>
            <div className="root-sub">Cycle</div>
          </div>
          <span className="tag tag-cycle">Cycle</span>
        </div>
        <div className="h-card-body">
          <div className="cycle-msg">This group contains a cycle — no tree can be rendered.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-card">
      <div className="h-card-header">
        <div className="root-badge">{hierarchy.root}</div>
        <div className="h-card-meta">
          <div className="root-label">Root: {hierarchy.root}</div>
          <div className="root-sub">Tree · depth {hierarchy.depth}</div>
        </div>
        <span className="tag tag-depth">Depth: {hierarchy.depth}</span>
      </div>
      <div className="h-card-body tree-root">
        <TreeNode 
          node={hierarchy.root} 
          treeObj={hierarchy.tree[hierarchy.root]} 
          prefix="" 
          isLast={true} 
          isRoot={true} 
        />
      </div>
    </div>
  );
};
