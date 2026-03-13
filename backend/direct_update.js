const fs = require('fs');
const path = require('path');

const files = [
  { path: 'c:\\Users\\ADMIN\\Desktop\\study.csv', category: 'Education' },
  {
    path: 'c:\\Users\\ADMIN\\Desktop\\work_storage.csv',
    category: 'Work & Storage',
  },
  { path: 'c:\\Users\\ADMIN\\Desktop\\vpn.csv', category: 'VPN' },
  {
    path: 'c:\\Users\\ADMIN\\Desktop\\entertainment.csv',
    category: 'Entertainment',
  },
  { path: 'c:\\Users\\ADMIN\\Desktop\\AI.csv', category: 'AI Tools' },
  { path: 'c:\\Users\\ADMIN\\Desktop\\sofware.csv', category: 'Software' },
];

function parsePrice(p) {
  if (!p) return 0;
  return (
    parseInt(
      p
        .replace(/đ/g, '')
        .replace(/,/g, '')
        .replace(/"/g, '')
        .replace(/\./g, '')
        .trim(),
    ) || 0
  );
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const imageMap = {
  spotify: '/Spotify.png',
  adobe: '/adobe.png',
  canva: '/canva.png',
  chatgpt: '/chatgpt-icon.webp',
  netflix: '/netflix.png',
  youtube: '/youtube.png',
  google: '/globe.svg',
};

const allProducts = [];
let idCounter = 1;

files.forEach((f) => {
  try {
    if (!fs.existsSync(f.path)) {
      console.log(`File not found: ${f.path}`);
      return;
    }
    const content = fs.readFileSync(f.path, 'utf8');
    const lines = content.split(/\r?\n/);
    let lastName = '';

    lines.forEach((line, index) => {
      if (index === 0 || !line.trim()) return; // Skip header/empty

      // Basic CSV split
      const parts = line.split(',').map((s) => s.trim());
      if (parts.length < 2) return;

      let name = parts[0].replace(/^"|"$/g, '');
      let type = parts[1].replace(/^"|"$/g, '');
      let priceStr = parts.slice(2).join(',').replace(/^"|"$/g, '');

      if (!name) name = lastName;
      else lastName = name;

      const price = parsePrice(priceStr);
      if (price === 0 && !type) return;

      const title = type ? `${name} - ${type}` : name;
      const slug = slugify(title);

      let image = '/file.svg';
      const lowerName = name.toLowerCase();
      for (const [key, val] of Object.entries(imageMap)) {
        if (lowerName.includes(key)) {
          image = val;
          break;
        }
      }

      allProducts.push({
        id: String(idCounter++),
        title,
        slug,
        category: f.category,
        price,
        originalPrice: Math.floor(price * 1.4),
        image,
        rating: Number((4.5 + (idCounter % 5) * 0.1).toFixed(1)),
        reviews: 50 + ((idCounter * 7) % 200),
        discount: 30,
        tag:
          price > 500000
            ? 'Premium ✨'
            : price < 100000
              ? 'Hot Deal 🔥'
              : 'Trending 🚀',
      });
    });
  } catch (err) {
    console.error(`Error processing ${f.path}: ${err.message}`);
  }
});

const outputPath =
  'g:\\tramStore\\temp-design\\backend\\src\\mock\\products.json';
fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
console.log(
  `Successfully updated ${allProducts.length} products to ${outputPath}`,
);
