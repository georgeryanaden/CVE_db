const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/cve_db";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define CVE Schema
const cveSchema = new mongoose.Schema({
    id: String,
    published: String,
    lastModified: String,
    description: String,
    severity: String,
    baseScore: Number // Ensure baseScore exists in your data
}, { timestamps: true });

const CVE = mongoose.model("CVE", cveSchema);

// Get all CVEs (with optional filters)
// ✅ Get paginated CVEs
app.get("/api/cves", async (req, res) => {
    try {
        let { page = 1, limit = 10, year, minScore, maxScore } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let filter = {};

        // Filter by year
        if (year) {
            filter.published = new RegExp(`^${year}`);
        }

        // Filter by CVE Score (baseScore)
        if (minScore || maxScore) {
            filter.baseScore = {};
            if (minScore) filter.baseScore.$gte = parseFloat(minScore);
            if (maxScore) filter.baseScore.$lte = parseFloat(maxScore);
        }

        const totalCount = await CVE.countDocuments(filter); // Get total count
        const cves = await CVE.find(filter)
            .sort({ published: -1 }) // Sort by newest first
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            cves,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get CVE by ID
app.get("/api/cves/:id", async (req, res) => {
    try {
        const cve = await CVE.findOne({ id: req.params.id });
        if (!cve) return res.status(404).json({ message: "CVE not found" });
        res.json(cve);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));