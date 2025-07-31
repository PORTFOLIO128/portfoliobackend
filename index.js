import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS config to allow frontend domain
app.use(cors({
  origin: "https://portfoliobuilders.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/submit-form", (req, res) => {
  const formData = req.body;

  if (!formData.name || !formData.email || !formData.message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("Received form data:", formData);
  res.status(200).json({ message: "Form submitted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
