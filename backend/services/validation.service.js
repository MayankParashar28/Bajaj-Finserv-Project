/**
 * Quick regex check to make sure the edge format is exactly "X->Y".
 * Both sides need to be a single uppercase letter.
 * Also checking `entry[0] !== entry[3]` to prevent silly self-loops like "A->A".
 */
function isValid(entry) {
  return /^[A-Z]->[A-Z]$/.test(entry) && entry[0] !== entry[3];
}

exports.processInput = (data) => {
  const invalid_entries = [];
  const duplicate_edges = [];
  const validEdges = [];
  
  // Sets for quick O(1) lookups
  const seenEdges = new Set();
  const duplicateSet = new Set(); // Need this so we don't push the same duplicate multiple times

  for (let raw of data) {
    // If someone passes a number or object by accident, catch it
    if (typeof raw !== "string") {
      invalid_entries.push(raw);
      continue;
    }

    const entry = raw.trim();

    if (!isValid(entry)) {
      invalid_entries.push(raw); // Pushing the *raw* original string as per requirements
      continue;
    }

    if (seenEdges.has(entry)) {
      // It's a duplicate! Only add to the array if we haven't flagged this specific duplicate yet.
      if (!duplicateSet.has(entry)) {
        duplicateSet.add(entry);
        duplicate_edges.push(entry);
      }
    } else {
      // First time seeing this valid edge, all good.
      seenEdges.add(entry);
      validEdges.push(entry);
    }
  }

  return { validEdges, invalid_entries, duplicate_edges };
};
