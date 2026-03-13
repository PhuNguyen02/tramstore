const fs = require("fs");
const path = require("path");

const mockPath = path.join(
  "g:",
  "tramStore",
  "temp-design",
  "frontend",
  "src",
  "mock",
  "data-product-mock.json",
);
const targetPath = path.join(
  "g:",
  "tramStore",
  "temp-design",
  "frontend",
  "src",
  "data",
  "products.json",
);

const rawData = JSON.parse(fs.readFileSync(mockPath, "utf8"));

const categoryMap = {
  Education: "Học tập",
  "Work & Storage": "Làm việc - lưu trữ",
  Entertainment: "Giải trí",
  "AI Tools": "AI",
  VPN: "VPN",
  Software: "Phần mềm",
};

const brands_list = [
  "netflix",
  "spotify",
  "youtube",
  "adobe",
  "canva",
  "capcut",
  "figma",
  "chatgpt",
  "claude",
  "grok",
  "perplexity",
  "github copilot",
  "cursor",
  "gemini",
  "duolingo",
  "elsa",
  "grammarly",
  "quillbot",
  "quizlet",
  "coursera",
  "cousera",
  "udemy",
  "datacamp",
  "nord vpn",
  "nordvpn",
  "express vpn",
  "expressvpn",
  "surfshark",
  "kling",
  "runway",
  "higgsfield",
  "midjourney",
  "zoom",
  "microsoft",
  "google one",
  "google meet",
  "icloud",
  "picart",
  "photoroom",
  "vieon",
  "galaxy play",
  "fpt play",
  "iqiyi",
  "youku",
  "apple music",
  "tidal",
  "soundcloud",
  "qobuz",
  "hma",
  "tradingview",
  "key windows",
];

const transformedData = rawData
  .filter((item) => item.price > 0)
  .map((item) => {
    let image = "/file.svg";
    const title = item.title.toLowerCase();

    // Determine brand for grouping
    let brand = "other";
    for (const b of brands_list) {
      if (title.includes(b)) {
        brand = b;
        break;
      }
    }
    if (brand === "other") {
      brand = item.title.split(" - ")[0].trim().toLowerCase();
    }

    // Icon Mapping
    if (title.includes("netflix")) image = "/netflix.png";
    else if (title.includes("spotify")) image = "/Spotify.png";
    else if (title.includes("youtube")) image = "/youtube.png";
    else if (title.includes("adobe") || title.includes("lightroom"))
      image = "/adobe.png";
    else if (
      title.includes("canva") ||
      title.includes("capcut") ||
      title.includes("figma") ||
      title.includes("picart") ||
      title.includes("photoroom")
    )
      image = "/canva.png";
    else if (
      title.includes("chatgpt") ||
      title.includes("claude") ||
      title.includes("grok") ||
      title.includes("perplexity")
    )
      image = "/chatgpt-icon.webp";
    else if (title.includes("github copilot")) image = "/chatgpt-icon.webp";
    else if (title.includes("cursor")) image = "/chatgpt-icon.webp";
    else if (title.includes("gemini")) image = "/globe.svg";
    else if (title.includes("google one") || title.includes("google meet"))
      image = "/globe.svg";
    else if (title.includes("icloud")) image = "/globe.svg";
    else if (title.includes("duolingo")) image = "/Duolingo.png";
    else if (title.includes("elsa")) image = "/elsa-speak.webp";
    else if (title.includes("grammarly")) image = "/grammarly.webp";
    else if (title.includes("quillbot")) image = "/quillbot.png";
    else if (title.includes("quizlet")) image = "/Quizlet.png";
    else if (title.includes("coursera") || title.includes("cousera"))
      image = "/coursera.webp";
    else if (title.includes("udemy")) image = "/Udemy.png";
    else if (title.includes("datacamp")) image = "/Datacamp.jpg";
    else if (title.includes("vieon")) image = "/Vieon.png";
    else if (title.includes("galaxy play")) image = "/GalaxyPlay.png";
    else if (title.includes("fpt play")) image = "/FPTPlay.png";
    else if (title.includes("iqiyi")) image = "/iQIYI.png";
    else if (title.includes("youku")) image = "/Youku.jpg";
    else if (title.includes("apple music")) image = "/Apple-Music-Logo.png";
    else if (title.includes("tidal")) image = "/tidal-logo.png";
    else if (title.includes("soundcloud")) image = "/Soundcloud.png";
    else if (title.includes("qobuz")) image = "/Qobuz.png";
    else if (title.includes("nord vpn") || title.includes("nordvpn"))
      image = "/NordVPN.png";
    else if (title.includes("express vpn") || title.includes("expressvpn"))
      image = "/ExpressVPN.png";
    else if (title.includes("surfshark")) image = "/Surfshark.png";
    else if (title.includes("kling")) image = "/KlingAI.png";
    else if (title.includes("runway")) image = "/RunwayAI.png";
    else if (title.includes("higgsfield")) image = "/Higgsfield.png";
    else if (title.includes("midjourney")) image = "/Midjourney.png";
    else if (title.includes("zoom")) image = "/Zoom.jfif";
    else if (
      title.includes("microsoft") ||
      title.includes("windows") ||
      title.includes("office")
    )
      image = "/Microsoft.png";

    return {
      ...item,
      category: categoryMap[item.category] || item.category,
      image: image,
      brand: brand,
    };
  });

// Select only unique brand per category
const seenInFlashSale = new Set();
const seenByBrandInCategory = {};

const finalData = [];

// For the purposes of display variety, we filter uniqueness by brand-category combination
transformedData.forEach((item) => {
  const key = `${item.category}-${item.brand}`;
  if (!seenByBrandInCategory[key]) {
    seenByBrandInCategory[key] = true;
    finalData.push(item);
  }
});

fs.writeFileSync(targetPath, JSON.stringify(finalData, null, 2));
console.log(
  `Transformed and saved data successfully. Total products: ${finalData.length} (Unique brands per category)`,
);
