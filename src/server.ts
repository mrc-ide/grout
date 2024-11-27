import compression from "compression";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(compression({ level: 9 })); // Use best compression

// TODO: read from config file
const PORT = 5000;

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Hello grout" });
});

app.listen(PORT, () => {
    console.log(`Grout is running on port ${PORT}`);
});