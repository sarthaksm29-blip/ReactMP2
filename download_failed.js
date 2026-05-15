import fs from 'fs';

const plants = [
  { file: 'boston.jpg', title: 'Nephrolepis_exaltata' },
  { file: 'spider.jpg', title: 'Chlorophytum_comosum' },
  { file: 'lavender.jpg', title: 'Lavandula' },
  { file: 'orchid.jpg', title: 'Phalaenopsis' } // Phalaenopsis is a popular orchid
];

async function run() {
  for (let p of plants) {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${p.title}&prop=pageimages&format=json&piprop=original`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const imgUrl = pages[pageId].original?.source;
    
    if (imgUrl) {
      console.log(`Downloading ${imgUrl} for ${p.title}`);
      const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'PlantTrackerApp/1.0 (test@example.com)' } });
      const buffer = await imgRes.arrayBuffer();
      fs.writeFileSync(`./public/plants/${p.file}`, Buffer.from(buffer));
    } else {
      console.log(`No image found for ${p.title}`);
    }
  }
}

run();
