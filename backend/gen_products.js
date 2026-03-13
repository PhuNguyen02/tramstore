const fs = require('fs');

const study_csv = `Duolingo,Super (1 tháng ) chung,"70,000 đ"
,Super ( 6 tháng ) chính chủ,"350,000 đ"
,Super ( 1 năm ) chính chủ,"600,000 đ"
,Max ( 1 năm ),"900,000 đ"
Elsa Speak Premium,1 Tháng ,"120,000 đ"
,3 tháng,"350,000 đ"
,6 tháng,"500,000 đ"
,1 năm,"900,000 đ"
Grammarly,1 tháng ( Premium ) ,"160,000 đ"
,3 tháng ( Premium ),"250,000 đ"
,6 tháng ( Premium ),"450,000 đ"
,1 năm ( Premium ) ,"600,000 đ"
Quillbot Premium,1 Tháng,"150,000 đ"
,3 Tháng,"400,000 đ"
,6 Tháng,"700,000 đ"
,1 năm,"900,000 đ"
QUIZLET ,1 Tháng ( Plus ),"50,000 đ"
,1 Năm chính chủ ( Plus ),"400,000 đ"
,1 Năm chính chủ  ( Premium ),"600,000 đ"
Cousera,1 tháng bussiness,"250,000 đ"
,1 tháng plus,"160,000 đ"
Ejoy,1 năm Pro plus (chung) ,"320,000 đ"
Busuu,1 năm Premium,"320,000 đ"
Wordwall,Pro 1 năm ,"600,000 đ"`;

const work_storage_csv = `Capcut,CAPCUT PRO TEAM 35DAYS ( riêng ) ,"70,000 đ"
,CAPCUT PRO TEAM 2 THÁNG,"150,000 đ"
,CAPCUT PRO TEAM 6 THÁNG,"300,000 đ"
,CAPCUT PRO TEAM 12 THÁNG,"500,000 đ"
Canva,Canva Edu - 12 Tháng (Chính chủ ) ,"70,000 đ"
,Canva Edu - 3 năm - VIP,"100,000 đ"
,CANVA EDU VĨNH VIỄN,"150,000 đ"
,CANVA PRO 1 NĂM,"200,000 đ"
Adobe Full Apps,ADOBE CreativeCloud Pro FULL APP 3 Tháng BH FULL,"300,000 đ"
,Nâng chính chủ 3 tháng,"320,000 đ"
,ADOBE CreativeCloud Pro FULL APP 1 Tháng BH FULL,"100,000 đ"
Microsoft Office,Slot Microsoft 365 Family 1 năm,"200,000 đ"
,Microsoft 365 Personal 1 năm,"500,000 đ"
,Fam Microsoft 365 Famliy 1 năm,"700,000 đ"
Google one,Google One 500G - 12 Tháng,"300,000 đ"
,Google One 1T - 12 Tháng,"450,000 đ"
,Google One - 5T - 12 Tháng,"950,000 đ"
,Google One 2TB - 12 Tháng ,"500,000 đ"
,Google One 2TB - 12 Tháng - Chủ Fam Add 5 Slot,"1,500,000 đ"
Icloud+ ,Icloud+ - Gói Add Fam 400G - 3 Tháng,"300,000 đ"
,Icloud+ - Gói Add Fam 400G - 6 Tháng,"600,000 đ"
,Icloud+ - Gói Add Fam 400G - 12 Tháng,"1,000,000 đ"
Google Meet,Tài khoản GoogleMeet Mở rộng – 3 tháng,"200,000 đ"
,Tài khoản GoogleMeet Doanh nghiệp – 6 tháng,"320,000 đ"
,Tài khoản GoogleMeet VIP – 1 năm,"520,000 đ"
Google One Mở Rộng Dung Lượng,1TB - 1 năm ,"200,000 đ"
Zoom,100 người 14 ngày,"80,000 đ"
,100 người 30 ngày,"150,000 đ"
,100 người 60 ngày,"250,000 đ"
,500 người 30 ngày,"200,000 đ"
,500 người 3 tháng,"400,000 đ"
,500 người 6 tháng,"700,000 đ"
,500 người 12 tháng,"1,000,000 đ"
Tradingview,Premium ( 1 tháng ) ,"150,000 đ"
Sierrachart,Vĩnh viễn full license,"2,500,000 đ"
,Rithmic DTC ( 14 ngày ) ,"50,000 đ"
Ninjatrader 8,Vĩnh viễn full license,"500,000 đ"
,Rithmic (1 tháng ) ,"100,000 đ"
Bookmap,Vĩnh viễn full license,"500,000 đ"
,Rithmic (1 tháng ) ,"100,000 đ"
Figma Pro,Figma Edu ( 1 năm ) chính chủ,"300,000 đ"
,Figma Edu ( 1 năm ),"200,000 đ"
AutoDesk,1 App (1 năm),"250,000 đ"
,"Full apps (1 năm) (AutoCAD, Revit, Civil 3D, Inventor, Navisworks, 3ds Max, Maya)","600,000 đ"
 LinkedIn Premium Career ,1 năm,"1,000,000 đ"`;

const vpn_csv = `Gearup Booster,6 THÁNG ,"300,000 đ"
,1 NĂM,"400,000 đ"
Nord VPN,1 NĂM,"200,000 đ"
,3 tháng,"100,000 đ"
HMA VPN,5 thiết bị ( 1 tháng ) ,"100,000 đ"
,HMA VIP 5TB (1 Năm ) ,"600,000 đ"
Express VPN,VPN Express 1 Tháng – Kết Nối 8 Máy Cùng Lúc,"130,000 đ"
,VPN Express 1 Tháng – Kết Nối 5 Máy Cùng Lúc,"100,000 đ"
Surfshark,1 Năm,"200,000 đ"
,2 năm,"350,000 đ"
ProtonVPN,1 Thiết bị (  Năm ) ,
 ,2-5 thiết bị ( Năm ),
,10 Thiết bị ( Năm ),`;

const entertainment_csv = `Netflix,TÀI KHOẢN NETFLIX - DÙNG CHUNG - 1 THÁNG - BH FULL,"60,000 đ"
,TÀI KHOẢN NETFLIX - DÙNG CHUNG - 3 THÁNG - BH FULL,"150,000 đ"
,TÀI KHOẢN NETFLIX - RIÊNG BIỆT PROFILE - 1 THÁNG,"80,000 đ"
,TÀI KHOẢN NETFLIX - RIÊNG BIỆT- ỔN ĐỊNH - 3 THÁNG,"200,000 đ"
,TÀI KHOẢN RIÊNG BIỆT- TẠO ĐƯỢC 4 PROFILE,"120,000 đ"
Youtube,1 THÁNG,"50,000 đ"
,3 THÁNG,"120,000 đ"
,6 THÁNG,"220,000 đ"
,12 THÁNG,"440,000 đ"
Spotify,Spotify Premium 2 Tháng Gói individual,"100,000 đ"
,Spotify Premium 6 Tháng Gói individual,"250,000 đ"
,Spotify Premium 1 Năm Gói individual,"400,000 đ"
Galaxy Play,1 THÁNG - GÓI VIP ( CAO CẤP NHẤT CỦA GALAXY ),"70,000 đ"
,3 THÁNG - GÓI VIP ( CAO CẤP NHẤT CỦA GALAXY ),"160,000 đ"
,6 THÁNG - GÓI VIP ( CAO CẤP NHẤT CỦA GALAXY ),"250,000 đ"
,12 THÁNG - GÓI VIP ( CAO CẤP NHẤT CỦA GALAXY ),"400,000 đ"
Vieon,VIEON VIP - 1 THÁNG,"50,000 đ"
,VIEON VIP - 3 THÁNG + TẶNG 1 THÁNG,"120,000 đ"
,VIEON VIP - 6 THÁNG + TẶNG 2 THÁNG,"200,000 đ"
,VIEON VIP - 12 THÁNG + TẶNG 3 THÁNG,"400,000 đ"
,VIEON HBO,"70,000 đ"
Youku VIP,1 THÁNG ,"120,000 đ"
,6 THÁNG,"300,000 đ"
,12 THÁNG ( Chính chủ ) ,"500,000 đ"
iQIYI,iQIYI Premium Gói dùng chung (180 Ngày),"249,000 đ"
,iQIYI Premium  Gói dùng chung (360 Ngày),"400,000 đ"
FPT,FPT Play bản quyền chất lượng cao 1 tháng,"100,000 đ"
,FPT Play bản quyền chất lượng cao 3 tháng,"200,000 đ"
,FPT Play bản quyền chất lượng cao 6 tháng,"350,000 đ"
,FPT Play bản quyền chất lượng cao 12 tháng,"600,000 đ"
"P*rnHub, Brazzer premium",Tài Khoản P*rnhub premium 5 năm tính từ 2026,"1,000,000 đ"
,1 Tháng ( dùng chung ) ,"75,000 đ"
,Tài khoản Brazzer premium 25 năm tính từ 2026.,"4,000,000 đ"
Discord,Nitro Discord 1 Năm (Chính chủ),"900,000 đ"
,Discord Nitro Premium 1 tháng,"99,000 đ"
,Discord Nitro Premium 3 tháng,"200,000 đ"
,Discord Nitro Premium 6 tháng,"400,000 đ"
,Discord Nitro Premium Trial 3 tháng (chính chủ) ,"150,000 đ"
Apple Music,1 năm,"400,000 đ"
Tidal,1 năm,"500,000 đ"
Datacamp,3 tháng,"230,000 đ"
,6 tháng,"320,000 đ"
,1 năm,"600,000 đ"
Qobuz,3 tháng Studio ( chính chủ ) ,"600,000 đ"
,1 năm Studio ( chính chủ ) ,"1,600,000 đ"
Udemy,3 tháng Business ( Cookie login )  ,"300,000 đ"
Tinder,Tinder Platinum ( 6 tháng ) ,"400,000 đ"
,Tinder Platinum ( 3 tháng ) ,"350,000 đ"
Soundcloud,Pro (1 tháng ) ,"200,000 đ"
,Pro (1 năm ),"500,000 đ"
Cheathappens,150k RC ( Vĩnh viễn ) ,"1,000,000 đ"
TV360, Super Vip Hisense ,"75,000 đ"
, Vip ,"100,000 đ"`;

const ai_csv = `Cursor,,"180,000 đ"
,Pro ( 3 tháng ) ,"300,000 đ"
,Unlimited (1 day),"60,000 đ"
,Unlimited (3 day),"150,000 đ"
,Unlimited ( 1 Tuần ),"200,000 đ"
,Unlimited ( 1 Tháng ),"450,000 đ"
CHATGPT,Plus (1 Thăng ) riêng,"70,000 đ"
,Plus (1 Năm ) ,"500,000 đ"
,Team ( 1 tháng) chính chủ,"100,000 đ"
,GPT Bussiness có thể add 5 người (1 tháng ) ,"200,000 đ"
,Go ( 1 năm ) ,"300,000 đ"
,GPT chính chủ ( 1 tháng giữ lịch sử ),"200,000 đ"
,GPT chính chủ ( 1 tháng ) lưu lịch sử,"300,000 đ"
Gemini Pro + Antigravity Pro + Google One2TB,🔥Gemini Pro +2TB+Veo3 | 1 slot mail khách 1 năm,"120,000 đ"
,Antigravity Pro + Gemini Pro 1 Năm,"150,000 đ"
,Gemini Pro +2TB+Veo3 thêm 5 slot mail khách 1 năm,"350,000 đ"
,Gemini Pixel ( 1 năm ),"250,000 đ"
Google AI Ultra Veo 3 ,Tài khoản Ultra 45.000 Credit | KBH,"250,000 đ"
,Tài khoản Ultra 45.000 Credit | BH7d,"450,000 đ"
,Bộ Prompt VEO 3 đỉnh cao,
Kling AI,Kling AI STANDARD 1 tháng (990 credit),"250,000 đ"
,KLING 1K1 CREDIT (KBH),"150,000 đ"
,KLING AI 1K5 CREDIT (KBH),"200,000 đ"
Higgsfield ,Higgsfield AI cấp sẵn gói Pro 1 tháng,"500,000 đ"
SUPER GROK,SUPER GROK 1 THÁNG ( ACC CẤP SẴN),"300,000 đ"
,SUPER GROK 1 NĂM( ACC CẤP SẴN),"1,000,000 đ"
Claude,Claude Pro - Nâng Chính Chủ - 1 Tháng,"500,000 đ"
Microsoft Copilot,1 tháng ( Tài khoản riêng ),"200,000 đ"
,3 tháng ,"300,000 đ"
,6 tháng,"500,000 đ"
,12 tháng,"700,000 đ"
Mid journey,Pro 1 tháng (riêng),"250,000 đ"
,3 tháng,"400,000 đ"
,6 tháng,"600,000 đ"
,1 năm,"700,000 đ"
Runway AI ,1 tháng Pro,"200,000 đ"
,1 năm Pro,"1,000,000 đ"
Notion AI,Notion AI Pro – 1 tháng,"150,000 đ"
,Notion AI Pro – 3 tháng,"250,000 đ"
,Notion AI Pro – 6 tháng,"450,000 đ"
,Notion AI Pro – 1 năm,"700,000 đ"
Perflexity,Code activate 1 năm Pro,"300,000 đ"
Github Copilot ,Pro ( 1 tháng ) ,"150,000 đ"
 ,Pro+  (1 tháng ),"500,000 đ"`;

const software_csv = `Malwarebytes,1 Thiết bị (năm) ,"200,000 đ"
,3 thiết bị,"350,000 đ"
,6 thiết bị,"550,000 đ"
Kaspersky, Premium 1 thiết bị ( năm ) ,"200,000 đ"
, Premium 3 thiết bị ( năm ) ,"350,000 đ"
,Premium 6 thiết bị ( năm ) ,"550,000 đ"
McAfee,5 thiết bị ( năm ),"245,000 đ"
Norton,Standard 5 thiết bị ( năm ) ,"300,000 đ"
,Plus 1 thiết bị ( 15 tháng ) ,"250,000 đ"
Adguard,1 thiết bị ( vĩnh viễn ) ,"200,000 đ"
IDM Dowload manager,1 thiết bị (  vĩnh viễn ),"400,000 đ"
Lightroom Mobile,1 năm,"300,000 đ"
TrueCaller,1 năm,"150,000 đ"
"Key Windows 7,10,11",Vĩnh viễn (KBH),"100,000 đ"
,Vĩnh viễn (BH 2 năm ) ,"180,000 đ"
Picart,PRO (1 Năm),"400,000 đ"
,Plus (1 Năm) ,"350,000 đ"
Photoroom,Premium chính chủ,"500,000 đ"
Padlet,Premium (1 năm ) ,"450,000 đ"
Lingokids,Plus (1 năm) ,"500,000 đ"
Meitu,Vip (1 tháng ) ,"100,000 đ"
,Svip ( 1 tháng ),"130,000 đ"
Vietmap,Pro (1 Năm),"450,000 đ"
,Pro (2 Năm),"850,000 đ"`;

function parsePrice(p) {
  if (!p) return 0;
  p = p.replace(/đ/g, '').replace(/,/g, '').trim();
  const val = parseInt(p);
  return isNaN(val) ? 0 : val;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const allProducts = [];
let currentId = 1;

const categories = [
  { csv: study_csv, category: 'Education' },
  { csv: work_storage_csv, category: 'Work & Storage' },
  { csv: vpn_csv, category: 'VPN' },
  { csv: entertainment_csv, category: 'Entertainment' },
  { csv: ai_csv, category: 'AI Tools' },
  { csv: software_csv, category: 'Software' },
];

const imageMap = {
  spotify: '/Spotify.png',
  adobe: '/adobe.png',
  canva: '/canva.png',
  chatgpt: '/chatgpt-icon.webp',
  netflix: '/netflix.png',
  youtube: '/youtube.png',
  google: '/globe.svg',
  cursor: '/file.svg',
  github: '/file.svg',
};

categories.forEach(({ csv, category }) => {
  const lines = csv.split('\n');
  let lastName = '';
  lines.forEach((line) => {
    if (!line.trim()) return;

    let parts = [];
    let currentPart = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') inQuotes = !inQuotes;
      else if (line[i] === ',' && !inQuotes) {
        parts.push(currentPart.trim());
        currentPart = '';
      } else currentPart += line[i];
    }
    parts.push(currentPart.trim());

    let name = parts[0] || '';
    let variant = parts[1] || '';
    let priceStr = parts[2] || '';

    if (!name) name = lastName;
    else lastName = name;

    const price = parsePrice(priceStr);
    if (price === 0 && !variant) return;

    const title = variant ? `${name} - ${variant}` : name;
    const slug = slugify(title);

    let image = '/file.svg';
    const lowerName = name.toLowerCase();
    for (const [key, val] of Object.entries(imageMap)) {
      if (lowerName.includes(key)) {
        image = val;
        break;
      }
    }

    const originalPrice = Math.floor(price * 1.3);
    const discount = 25;
    let tag = 'Trending 🚀';
    if (price > 500000) tag = 'Premium ✨';
    if (price < 100000) tag = 'Hot Deal 🔥';

    allProducts.push({
      id: String(currentId++),
      title,
      slug,
      category,
      price,
      originalPrice,
      image,
      rating: Number((4.5 + (currentId % 5) * 0.1).toFixed(1)),
      reviews: 50 + ((currentId * 7) % 200),
      discount,
      tag,
    });
  });
});

const outputPath = './src/mock/products.json';
fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
console.log(
  `Successfully wrote ${allProducts.length} products to ${outputPath}`,
);
