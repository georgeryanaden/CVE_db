const mongoose = require("mongoose");
const cron = require("node-cron");
const fetchCves = require("./test"); // Import the fetchCves function

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/cveDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Run fetchCves on startup
fetchCves();

// Schedule to run every 2 days at midnight
cron.schedule("0 0 */2 * *", async () => {
    console.log("⏳ Running scheduled CVE update...");
    await fetchCves();
    console.log("✅ CVE update completed.");
});