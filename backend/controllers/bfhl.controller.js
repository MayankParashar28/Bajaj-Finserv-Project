const validationService = require("../services/validation.service");
const graphService = require("../services/graph.service");

// Note: These would usually sit in a .env file, but hardcoding them here for the assignment requirements.
const USER_ID = "mayank_parashar_28082005"; 
const EMAIL_ID = "mp0120@srmist.edu.in";
const COLLEGE_ROLL = "RA2311026030144";

exports.processHierarchies = (req, res) => {
  const { data } = req.body;

  // Basic sanity check before we try doing graph math on it
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid request format. 'data' array is required." });
  }

  // 1. Clean up and validate the raw input
  const { validEdges, invalid_entries, duplicate_edges } = validationService.processInput(data);

  // 2. Build out our trees/cycles from the valid edges
  const hierarchies = graphService.buildHierarchies(validEdges);

  // 3. Tally up the final stats
  const summary = graphService.computeSummary(hierarchies);

  // 4. Ship it back to the client!
  return res.json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary,
  });
};
