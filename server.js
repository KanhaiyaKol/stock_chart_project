const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const app = express();
app.use(cors());

const PORT = 5000;
const csvFilePath = path.join(__dirname, "dump.csv");

let stockData = {};

// ✅ Read CSV and Store Data
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
        const indexName = row["index_name"];
        if (!indexName) return;

        if (!stockData[indexName]) {
            stockData[indexName] = [];
        }

        stockData[indexName].push({
            date: row["index_date"],
            open: parseFloat(row["open_index_value"]),
            high: parseFloat(row["high_index_value"]),
            low: parseFloat(row["low_index_value"]),
            close: parseFloat(row["closing_index_value"]),
            pointsChange: parseFloat(row["points_change"]),
            changePercent: parseFloat(row["change_percent"]),
            volume: parseInt(row["volume"], 10),
            turnover: parseFloat(row["turnover_rs_cr"]),
            peRatio: parseFloat(row["pe_ratio"]),
            pbRatio: parseFloat(row["pb_ratio"]),
            divYield: parseFloat(row["div_yield"])
        });
    })
    .on("end", () => {
        console.log("✅ CSV file processed successfully");
    });

// ✅ Get all index names
app.get("/indices", (req, res) => {
    res.json(Object.keys(stockData));
});

// ✅ Get data for a specific index
app.get("/index/:name", (req, res) => {
    const indexName = decodeURIComponent(req.params.name);
    const data = stockData[indexName];
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: "Index not found" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
