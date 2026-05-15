import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedFile = path.join(__dirname, 'src', 'data', 'seedData.js');
let content = fs.readFileSync(seedFile, 'utf8');

const growthDataMap = {
  "Aloe Vera": [
    { id:'g_aloe_1', date:'2025-08-01', height:12 },
    { id:'g_aloe_2', date:'2025-10-01', height:15 },
    { id:'g_aloe_3', date:'2025-12-01', height:18 },
    { id:'g_aloe_4', date:'2026-02-01', height:20 },
    { id:'g_aloe_5', date:'2026-04-01', height:23 }
  ],
  "Basil": [
    { id:'g_basil_1', date:'2025-08-01', height:8  },
    { id:'g_basil_2', date:'2025-10-01', height:14 },
    { id:'g_basil_3', date:'2025-12-01', height:20 },
    { id:'g_basil_4', date:'2026-02-01', height:25 },
    { id:'g_basil_5', date:'2026-04-01', height:30 }
  ],
  "Lavender": [
    { id:'g_lav_1', date:'2025-08-01', height:18 },
    { id:'g_lav_2', date:'2025-10-01', height:22 },
    { id:'g_lav_3', date:'2025-12-01', height:27 },
    { id:'g_lav_4', date:'2026-02-01', height:30 },
    { id:'g_lav_5', date:'2026-04-01', height:33 }
  ],
  "Boston Fern": [
    { id:'g_fern_1', date:'2025-08-01', height:25 },
    { id:'g_fern_2', date:'2025-10-01', height:30 },
    { id:'g_fern_3', date:'2025-12-01', height:35 },
    { id:'g_fern_4', date:'2026-02-01', height:39 },
    { id:'g_fern_5', date:'2026-04-01', height:43 }
  ],
  "Monstera": [
    { id:'g_mon_1', date:'2025-08-01', height:35 },
    { id:'g_mon_2', date:'2025-10-01', height:43 },
    { id:'g_mon_3', date:'2025-12-01', height:49 },
    { id:'g_mon_4', date:'2026-02-01', height:54 },
    { id:'g_mon_5', date:'2026-04-01', height:59 }
  ],
  "Peace Lily": [
    { id:'g_peace_1', date:'2025-08-01', height:22 },
    { id:'g_peace_2', date:'2025-10-01', height:27 },
    { id:'g_peace_3', date:'2025-12-01', height:31 },
    { id:'g_peace_4', date:'2026-02-01', height:34 },
    { id:'g_peace_5', date:'2026-04-01', height:37 }
  ],
  "Snake Plant": [
    { id:'g_snake_1', date:'2025-08-01', height:30 },
    { id:'g_snake_2', date:'2025-10-01', height:34 },
    { id:'g_snake_3', date:'2025-12-01', height:37 },
    { id:'g_snake_4', date:'2026-02-01', height:40 },
    { id:'g_snake_5', date:'2026-04-01', height:42 }
  ],
  "Spider Plant": [
    { id:'g_spider_1', date:'2025-08-01', height:15 },
    { id:'g_spider_2', date:'2025-10-01', height:21 },
    { id:'g_spider_3', date:'2025-12-01', height:27 },
    { id:'g_spider_4', date:'2026-02-01', height:31 },
    { id:'g_spider_5', date:'2026-04-01', height:35 }
  ],
  "Tulsi": [
    { id:'g_tulsi_1', date:'2025-08-01', height:10 },
    { id:'g_tulsi_2', date:'2025-10-01', height:16 },
    { id:'g_tulsi_3', date:'2025-12-01', height:22 },
    { id:'g_tulsi_4', date:'2026-02-01', height:27 },
    { id:'g_tulsi_5', date:'2026-04-01', height:31 }
  ],
  "Orchid": [
    { id:'g_orchid_1', date:'2025-08-01', height:28 },
    { id:'g_orchid_2', date:'2025-10-01', height:31 },
    { id:'g_orchid_3', date:'2025-12-01', height:33 },
    { id:'g_orchid_4', date:'2026-02-01', height:35 },
    { id:'g_orchid_5', date:'2026-04-01', height:36 }
  ],
  "Pothos": [
    { id:'g_pothos_1', date:'2025-08-01', height:20 },
    { id:'g_pothos_2', date:'2025-10-01', height:29 },
    { id:'g_pothos_3', date:'2025-12-01', height:38 },
    { id:'g_pothos_4', date:'2026-02-01', height:44 },
    { id:'g_pothos_5', date:'2026-04-01', height:51 }
  ],
  "Fiddle Leaf Fig": [
    { id:'g_fig_1', date:'2025-08-01', height:40 },
    { id:'g_fig_2', date:'2025-10-01', height:46 },
    { id:'g_fig_3', date:'2025-12-01', height:50 },
    { id:'g_fig_4', date:'2026-02-01', height:53 },
    { id:'g_fig_5', date:'2026-04-01', height:55 }
  ]
};

// We need to carefully inject these into the string representation of initialPlants
// since seedData.js is a javascript module exporting an array.
// The easiest way is to match the "name": "Plant Name", and then replace "growthLogs": [], with the new array.
// Fiddle Leaf Fig already has some entries, so we match "growthLogs": [ ... ] 

for (const [plantName, growthData] of Object.entries(growthDataMap)) {
  const namePattern = new RegExp(`"name":\\s*"${plantName}"`);
  
  if (namePattern.test(content)) {
    // We found the plant. Now find its growthLogs array.
    // It's followed by "growthLogs": [ ... ] 
    // We'll use a regex that finds the plant name, and then replaces the next "growthLogs": [] or "growthLogs": [ ... ]
    
    // We can just parse the file if we convert it to json, but it's export const.
    // Let's just import it, mutate it, and write it back.
  }
}

// Better approach:
import { initialPlants } from './src/data/seedData.js';

initialPlants.forEach(plant => {
  if (growthDataMap[plant.name]) {
    plant.growthLogs = growthDataMap[plant.name];
  }
});

const newContent = `export const initialPlants = ${JSON.stringify(initialPlants, null, 2)};\n`;

fs.writeFileSync(seedFile, newContent, 'utf8');
console.log('Successfully injected growth entries into seedData.js');
