const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedData() {
  const mockData = [
    {
      location: "Toronto",
      date: "2025-10-16 17:15",
      humidity: 51,
      dewpoint_c: 2.1,
      gust_kph: 22.9,
      uv: 0.7,
      sunrise: "07:34 AM",
      sunset: "06:32 PM",
      temp_c: 14.4
    },
    {
      location: "New York",
      date: "2025-10-16 17:15",
      humidity: 31,
      dewpoint_c: 1.9,
      gust_kph: 22.9,
      uv: 0.7,
      sunrise: "07:34 AM",
      sunset: "06:32 PM",
      temp_c: 14.4
    },
    {
      location: "Chicago",
      date: "2025-10-16 17:15",
      humidity: 41,
      dewpoint_c: 1.9,
      gust_kph: 2.9,
      uv: 0.7,
      sunrise: "04:34 AM",
      sunset: "06:52 PM",
      temp_c: 28.5
    }
  ];

  for (const weatherEntry of mockData) {
    await prisma.weatherData.create({ data: weatherEntry });
  }
}

seedData().finally(() => prisma.$disconnect());