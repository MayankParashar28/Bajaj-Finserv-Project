const express = require("express");
const cors = require("cors");
const bfhlRoutes = require("./routes/bfhl.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bfhl", bfhlRoutes);

// Health check endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
