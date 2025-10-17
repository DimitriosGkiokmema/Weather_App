# Weather_App
Web app of local weather data. Displays real-time weather data for any city entered. User's current location is displayed by, and users can look up the weather info for any location by entering it in the search bar. City names, lat/long, and IP addresses are accepted for the search entry, among others.

Live link: [https://dimitriosweatherapp.netlify.app/](https://dimitriosweatherapp.netlify.app/)

# Web App
![Screenshot of web app](/images/webpage.jpeg)

# Coding Assessment
One of the internships I applied to required applicants to complete a weather app with API and CRUD integrations. I had already build the basic functionality for this weather app previously and had it configured with a weather API. For this coding assessment, I went back and integrated CRUD to store data for locations searched by users.

## Setup
1. Clone the repo
2. Run `npm install`
3. Set up your `.env` file (see `.env.example`)
4. Run `npx prisma generate`
5. Run `npx prisma db push` to create the SQLite database
6. (Optional) Seed the database: `node database/seed.js`
7. Start the server: `node index.js`