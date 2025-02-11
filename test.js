const axios = require("axios");
const mongoose = require("mongoose");
const MONGO_URI = "mongodb://localhost:27017/cve_db"

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const cveSchema = new mongoose.Schema({
    id: String,
    published: String,
    lastModified: String,
    vulnStatus: String,
    description: String,
    cveScore: String,
}, { timestamps: true });

const CVE = mongoose.model("CVE", cveSchema);

const BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const resultsPerPage = 2000;
let startIndex = 22000;

async function fetchCves() {
    while (true) {
        try {
            const response = await axios.get(`${BASE_URL}?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`);
            const data = response.data;

            if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
                break; // Stop when no more data
            }

            // Extract relevant CVE data
            const cveData = data.vulnerabilities.map(item => ({
                id: item.cve.id,
                published: item.cve.published,
                lastModified: item.cve.lastModified,
                vulnStatus: item.cve.vulnStatus,
                description: item.cve.descriptions?.[0]?.value || "No description",
                cveScore: item.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || item.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || "Unknown"
            }));

            // Insert CVEs into MongoDB
            await CVE.insertMany(cveData);
            console.log(`Inserted ${cveData.length} CVEs into MongoDB`);

            startIndex += resultsPerPage;
        } catch (error) {
            console.error("Error fetching data:", error.message);
            break;
        }
    }

    mongoose.connection.close();
    console.log("MongoDB connection closed.");
}

module.exports = fetchCves;