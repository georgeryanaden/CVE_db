const axios = require("axios");
const mongoose = require("mongoose");
const MONGO_URI = "mongodb://localhost:27017/cve_db"

const cveSchema = new mongoose.Schema({
    id: String,
    published: String,
    lastModified: String,
    vulnStatus: String,
    descriptions: String,
    cveScore: String,
}, { timestamps: true });

// const CVE = mongoose.model("CVE_test", cveSchema);

const BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const resultsPerPage = 1;
let startIndex = 0;

async function test (){
    try {
        const response = await axios.get(`${BASE_URL}?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`);
        const data = response.data;
        console.log(data.vulnerabilities[0].cve.descriptions[0].value)
        // console.log(data.vulnerabilities[0].cve.descriptions)
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

test()