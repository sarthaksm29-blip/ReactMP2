import fs from 'fs';

const initialPlants = [
  {
    id: "1", name: "Fiddle Leaf Fig", species: "Ficus lyrata", category: "Tropical", healthStatus: "Healthy", purchaseDate: "2023-05-10", wateringFrequency: 7, sunlightPreference: "Bright", notes: "Loves humidity and indirect bright light.", imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "2", name: "Snake Plant", species: "Sansevieria trifasciata", category: "Succulents", healthStatus: "Healthy", purchaseDate: "2022-01-15", wateringFrequency: 21, sunlightPreference: "Low", notes: "Almost unkillable.", imageUrl: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "3", name: "Monstera", species: "Monstera deliciosa", category: "Tropical", healthStatus: "Needs Attention", purchaseDate: "2023-02-20", wateringFrequency: 10, sunlightPreference: "Medium", notes: "Leaves are drooping slightly.", imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "4", name: "Aloe Vera", species: "Aloe barbadensis miller", category: "Succulents", healthStatus: "Healthy", purchaseDate: "2023-06-05", wateringFrequency: 14, sunlightPreference: "Bright", notes: "Good for skin burns.", imageUrl: "https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "5", name: "Peace Lily", species: "Spathiphyllum", category: "Flowering", healthStatus: "Healthy", purchaseDate: "2023-04-10", wateringFrequency: 7, sunlightPreference: "Low", notes: "Very communicative when thirsty.", imageUrl: "https://images.unsplash.com/photo-1616690248348-a901c1536ede?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "6", name: "Basil", species: "Ocimum basilicum", category: "Herbs", healthStatus: "Critical", purchaseDate: "2023-09-01", wateringFrequency: 3, sunlightPreference: "Bright", notes: "Needs constant watering and sun.", imageUrl: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "7", name: "Boston Fern", species: "Nephrolepis exaltata", category: "Ferns", healthStatus: "Healthy", purchaseDate: "2023-03-15", wateringFrequency: 5, sunlightPreference: "Medium", notes: "Mist regularly.", imageUrl: "https://images.unsplash.com/photo-1599598425947-5202edd56fde?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "8", name: "Spider Plant", species: "Chlorophytum comosum", category: "Tropical", healthStatus: "Healthy", purchaseDate: "2022-11-20", wateringFrequency: 7, sunlightPreference: "Medium", notes: "Producing lots of babies.", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "9", name: "Lavender", species: "Lavandula", category: "Herbs", healthStatus: "Needs Attention", purchaseDate: "2023-08-10", wateringFrequency: 10, sunlightPreference: "Bright", notes: "A bit dry at the bottom.", imageUrl: "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "10", name: "Pothos", species: "Epipremnum aureum", category: "Tropical", healthStatus: "Healthy", purchaseDate: "2023-01-05", wateringFrequency: 7, sunlightPreference: "Bright", notes: "Trailing beautifully.", imageUrl: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "11", name: "Orchid", species: "Orchidaceae", category: "Flowering", healthStatus: "Healthy", purchaseDate: "2023-02-14", wateringFrequency: 7, sunlightPreference: "Bright", notes: "Beautiful blooms.", imageUrl: "https://images.unsplash.com/photo-1566907226354-9e88b39c0fac?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  },
  {
    id: "12", name: "Tulsi", species: "Ocimum tenuiflorum", category: "Herbs", healthStatus: "Healthy", purchaseDate: "2023-03-20", wateringFrequency: 2, sunlightPreference: "Bright", notes: "Sacred plant, needs lots of sunlight.", imageUrl: "https://images.unsplash.com/photo-1656176815157-e9185b9c1a02?w=600&auto=format&fit=crop&q=80",
    lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    growthLogs: [], photos: [], careLogs: []
  }
];

const updated = initialPlants.map(plant => {
  const newLogs = [];
  // Ensure we cover the 30 day range well
  for(let i=0; i<6; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    newLogs.push({
      id: `h_${plant.id}_${i}`,
      date: date.toISOString().split('T')[0],
      score: Math.floor(Math.random() * 5) + 5, // 5 to 9
      notes: "Auto generated health log"
    });
  }
  // Sort them by date
  newLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
  return { ...plant, healthLogs: newLogs };
});

const fileContent = `export const initialPlants = ${JSON.stringify(updated, null, 2)};\n`;
fs.writeFileSync('./src/data/seedData.js', fileContent, 'utf-8');
console.log('Done generating seed data.');
