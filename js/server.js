#!/usr/bin/env node
'use strict';

const port = (() => {
    const args = process.argv;

    if (args.length !== 3) {
        console.error("usage: node index.js port");
        process.exit(1);
    }

    const num = parseInt(args[2], 10);
    if (isNaN(num)) {
        console.error("error: argument must be an integer.");
        process.exit(1);
    }

    return num;
})();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Allow all origins by default

/* ===================================================
   POST /weather
   Creates a new weather entry
=================================================== */
// app.post("/weather", async (req, res) => {
//     console.log("Incoming body:", req.body);
//     const { location, date, humidity, dewpoint_c, gust_kph, uv, sunrise, sunset, temp_c} = req.body;

    
//     console.log(location, date, humidity, dewpoint_c, gust_kph, uv, sunrise, sunset, temp_c)

//     if (!location || !date || !humidity || !dewpoint_c || !gust_kph || !uv || !sunrise || !sunset || !temp_c) {
//         return res.status(400).json({ message: "Invalid payload" });
//     }

//     try {
//         const weather = await prisma.weatherData.create({
//             data: req.body
//         });

//         res.status(201).json(weather);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });
app.post("/weather", async (req, res) => {
  try {
    const newWeather = await prisma.weatherData.create({
      data: req.body
    });
    res.status(201).json(newWeather);
  } catch (err) {
    console.error("PRISMA ERROR:", err);
    res.status(400).json({ message: "Invalid payload", error: err.message });
  }
});


/* ===================================================
   GET /weather
   Retrieve all weather entries
=================================================== */
app.get("/weather", async (req, res) => {
    try {
        const allData = await prisma.weatherData.findMany();

        res.status(200).json(allData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/* ===================================================
   GET /weather/:location
   Retrieve note if it belongs to the authenticated user
=================================================== */
app.get("/weather/:location", async (req, res) => {
    const location = req.params.location;

    if (isNaN(location)) {
        return res.status(404).json({ message: "Not found" });
    }

    try {
        const weatherData = await prisma.weatherData.findMany({ where: { location: location } });

        if (!weatherData) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json(weatherData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/* ===================================================
   PATCH /weather/:location
   Update note if owned by authenticated user
=================================================== */
app.patch("/weather/:location/:date", async (req, res) => {
    const location = req.params.location;
    const date = req.params.date;
    const updates = req.body;

    if (isNaN(location)) {
        return res.status(404).json({ message: "Not found" });
    }

    const validFields = ["location", "date", "humidity", "dewpoint_c", "gust_kp", "uv", "sunrise", "sunset", "temp_c"];
    const updateKeys = Object.keys(updates);

    if (updateKeys.length == 0 || !updateKeys.every(k => validFields.includes(k))) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    try {
        const note = await prisma.note.findUnique({ where: { location, date } });

        if (!note) {
            return res.status(404).json({ message: "Not found" });
        }

        const updatedNote = await prisma.weatherData.update({
            where: { location, date },
            data: updates,
        });

        res.status(200).json(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/* ===================================================
   DELETE /weather/:location
   Delete weather data for a given location
=================================================== */
app.delete("/weather/:location", async (req, res) => {
    const location = req.params.location;

    if (!location) {
        return res.status(400).json({ message: "Invalid location" });
    }

    try {
        const deleted = await prisma.weatherData.deleteMany({
            where: { location: location }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json({ message: "Weather data deleted successfully", count: deleted.count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ==================

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error(`cannot start server: ${err.message}`);
    process.exit(1);
});