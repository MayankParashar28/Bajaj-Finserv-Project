const express = require("express");
const cors = require("cors");
const bfhlRoutes = require("./routes/bfhl.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bfhl", bfhlRoutes);

// Root endpoint to show the server is alive
app.get("/", (req, res) => {
  res.status(200).send("<h1>BFHL Backend is Live!</h1><p>Send a POST request to <code>/bfhl</code></p>");
});

// Health check endpoint (for GET /bfhl)
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
