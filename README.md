# CVE Fetcher & API Server
## Overview
This project fetches CVE (Common Vulnerabilities and Exposures) data from the NVD (National Vulnerability Database) API and stores it in a local MongoDB database. The data is updated every 2 days automatically using a scheduled job. A RESTful API is provided to query CVEs with pagination and filtering options.

## Features
1. Fetches CVE data from the NVD API and stores it in MongoDB
2. Prevents duplicate entries by updating existing records
3. Schedules automatic updates every 2 days using node-cron
4. Provides a REST API to retrieve CVEs with pagination and filtering

## Project Structure
```
cve-fetcher
├── index.js        # Main file - Starts the cron job and initial fetch
├── server.js       # Express.js API server to query stored CVEs
├── test.js         # Fetches CVEs and updates the MongoDB database
├── package.json    # Dependencies and scripts
└── README.md       # Project documentation
```
