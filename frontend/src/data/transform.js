/**
 * Transform products.json:
 * - Convert accountTypes → variants with full info  
 * - Products without accountTypes → single variant
 * - Remove rating/reviews
 * - Each variant gets its own: price, originalPrice, discount, stock, description, features, warranties
 */
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "products.json");
const products = JSON.parse(fs.readFileSync(src, "utf8"));

const transformed = products.map((p) => {
  const base = {
    id: p.id,
    title: p.title.split(" - ")[0].trim(),
    slug: p.slug,
    category: p.category,
    image: p.image,
    tag: p.tag,
    brand: p.brand,
  };

  if (p.accountTypes && p.accountTypes.length > 0) {
    // Product has multiple types → expand to variants
    base.variants = p.accountTypes.map((at, i) => {
      const variant = {
        id: `${p.id}-${i + 1}`,
        label: `${base.title} — ${at.label}`,
        price: at.price,
        originalPrice: Math.round(at.price / (1 - p.discount / 100)),
        discount: p.discount,
        stock: p.stock || 99,
        description:
          at.description ||
          p.description ||
          `${base.title} — ${at.label}. Sản phẩm chất lượng cao từ TramStore.`,
        features: at.features || p.features || [],
      };

      // Filter warranties compatible with this account type
      if (p.warranties && p.warranties.length > 0) {
        variant.warranties = p.warranties
          .filter((w) => w.compatibleWith.includes(at.value))
          .map((w) => ({
            label: w.label,
            value: w.value,
            price: w.price,
          }));
      }

      return variant;
    });
  } else {
    // Single product → 1 variant
    base.variants = [
      {
        id: `${p.id}-1`,
        label: p.title,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        stock: p.stock || 99,
        description:
          p.description ||
          `${p.title} — sản phẩm chất lượng cao từ TramStore.`,
        features: p.features || [],
      },
    ];
  }

  return base;
});

fs.writeFileSync(src, JSON.stringify(transformed, null, 2), "utf8");
console.log(`✅ Transformed ${transformed.length} products`);
console.log(
  `   With multiple variants: ${transformed.filter((p) => p.variants.length > 1).length}`
);
console.log(
  `   Single variant: ${transformed.filter((p) => p.variants.length === 1).length}`
);
