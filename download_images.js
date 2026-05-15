import fs from 'fs';

const plants = [
  { id: 1, file: 'fiddle.jpg', title: 'Ficus_lyrata' },
  { id: 2, file: 'snake.jpg', title: 'Dracaena_trifasciata' },
  { id: 3, file: 'monstera.jpg', title: 'Monstera_deliciosa' },
  { id: 4, file: 'aloe.jpg', title: 'Aloe_vera' },
  { id: 5, file: 'peacelily.jpg', title: 'Spathiphyllum' },
  { id: 6, file: 'basil.jpg', title: 'Basil' },
  { id: 7, file: 'boston.jpg', title: 'Nephrolepis_exaltata' },
  { id: 8, file: 'spider.jpg', title: 'Chlorophytum_comosum' },
  { id: 9, file: 'lavender.jpg', title: 'Lavandula' },
  { id: 10, file: 'orchid.jpg', title: 'Orchidaceae' }
];

async function run() {
  fs.mkdirSync('./public/plants', { recursive: true });
  for (let p of plants) {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${p.title}&prop=pageimages&format=json&pithumbsize=800`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const imgUrl = pages[pageId].thumbnail?.source;
    
    if (imgUrl) {
      console.log(`Downloading ${imgUrl} for ${p.title}`);
      const imgRes = await fetch(imgUrl);
      const buffer = await imgRes.arrayBuffer();
      fs.writeFileSync(`./public/plants/${p.file}`, Buffer.from(buffer));
    } else {
      console.log(`No image found for ${p.title}`);
    }
  }
}

run();
