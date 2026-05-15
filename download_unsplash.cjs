const https = require('https');
const fs = require('fs');

function download(url, dest) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      download(res.headers.location, dest);
    } else if (res.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded to ${dest}`);
      });
    } else {
      console.log(`Failed to download ${url}: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.log(`Error on ${url}: ${err.message}`);
  });
}

// Fern
download('https://images.unsplash.com/photo-1512428559087-560fa5ceab42', './public/plants/boston.jpg'); 
// Plant
download('https://images.unsplash.com/photo-1509423350716-9b19e007c4bc', './public/plants/spider.jpg'); 
// Lavender
download('https://images.unsplash.com/photo-1496857239036-1fb1372025bf', './public/plants/lavender.jpg'); 
// Orchid
download('https://images.unsplash.com/photo-1520302630592-fac08d49eb9a', './public/plants/orchid.jpg');
