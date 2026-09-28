# 🌊 ResQNow - Tactical Flood Rescue Dispatch OS
### ระบบแจ้งพิกัดและบริหารจัดการกู้ภัยอุทกภัยอัจฉริยะ (Pitching Prototype)

**ResQNow** เป็นต้นแบบระบบปฏิบัติการกู้ภัยฉุกเฉินระดับยุทธวิธี (Tactical Disaster Incident Command System) ที่ถูกออกแบบมาเพื่อแก้ปัญหาคอขวดของการกู้ภัยน้ำท่วมในประเทศไทย:
1. ผู้ประสบภัยตื่นตระหนก บอกพิกัดไม่ถูก และไม่มีระบบคัดกรองความเร่งด่วน
2. ทีมกู้ภัยขาดมุมมองภาพรวม (Common Operating Picture) ทำให้เรือกู้ภัยวิ่งวนหรือเข้าช่วยเหลือเคสไม่ตรงตามลำดับความวิกฤต

---

## 🚀 ฟีเจอร์หลัก 4 รายการที่ได้รับการอัปเกรด (Key Features)

### 1. 🪄 UI/UX & Smooth Animations (Wow Factor)
- **Tactical Cyber-HUD Aesthetics**: ดีไซน์แบบ Dark Glassmorphism ผสมผสานโทนสีเข้ม (#070a13), นีออนไซแอน (#06b6d4), แดงฉุกเฉิน (#ef4444) และเหลืองแจ้งเตือน (#f59e0b)
- **Stagger-Fade-In & Slide-Up**: การ์ดทุกใบและองค์ประกอบ UI จะค่อยๆ สไลด์ลอยขึ้นมาอย่างนุ่มนวลเมื่อโหลดหน้าเว็บ
- **Micro-Interactions**: ปุ่มกดและกล่องเลือก Triage มีเอฟเฟกต์ bounce/scale, แสงเรือง (glow), และประกายแสง Shimmer Sheen
- **Tactile Triage Selectors**: กล่องเลือก "ผู้ป่วยติดเตียง", "เด็กทารก", "ระดับน้ำ" มีสถานะ interactive ตอบสนองทันที
- **Dynamic AI Triage Priority Gauge**: เกจวิเคราะห์ระดับความเร่งด่วน (Code Red / Code Orange / Code Yellow) คำนวณแบบ Real-time ตามอาการและระดับน้ำ
- **Modern Tactical Modal & Toasts**: แทนที่ `alert()` ดั้งเดิมด้วย Success Modal สไตล์ศูนย์สั่งการทางทหาร และ Toast แจ้งเตือนพร้อมเสียง Sound FX

### 2. 🗺️ Advanced Map Interactions & GIS Tactical Overlays
- **Real-World Google Maps Hybrid Satellite Tiles**: แผนที่ภาพถ่ายดาวเทียมความละเอียดสูงผสานเส้นทางถนนและป้ายชื่อ (`https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`) ไม่ต้องใช้ API Key
- **Watermark-Free Dark Matter Layer**: ทางเลือกสลับมุมมองแผนที่มืดยุทธวิธี CartoDB Dark ไร้ลายน้ำ (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
- **Flood Risk Zones (Heatmap & Danger Polygons)**:
  - 🔴 **โซนสีแดง (วิกฤต)**: แม่น้ำมูลล้นตลิ่ง น้ำท่วมขังมิดชั้น 1 (>1.8 ม.) กระแสน้ำเชี่ยวจัด
  - 🟠 **โซนสีส้ม (เฝ้าระวัง)**: พื้นที่ลุ่มต่ำเกตุแก้ว-ท่ากอไผ่ ระดับน้ำ 0.8 - 1.2 ม.
  - 🔵 **โซนสีฟ้า (ปลอดภัย)**: จุดตั้งเต็นท์แพทย์สนาม คลังเสบียง และศูนย์พักพิงเทศบาล
- **Dynamic Animated Neon Rescue Route**:
  - หมุดฐานบัญชาการกู้ภัยส่วนหน้า (**Rescue Command Center**) สไตล์เรดาร์สมอเรือ
  - เส้นประเรืองแสงสีนีออนไซแอน (**Neon Cyan Glowing Polyline**) วิ่งอนิเมชันเชื่อมต่อฐานกู้ภัยไปยังพิกัดผู้ประสบภัย
  - คำนวณระยะทางจริง (กม.) และเวลาเดินทางของเรือ (ETA) แบบไดนามิกทันทีที่ปักหมุด
- **High-Tech Radar Blips**: หมุดพิกัดพร้อมวงแหวนเรดาร์ 2 ชั้น (Concentric Sonar Rings) และขอบสีขาวคมชัดพิเศษ ตัดกับพื้นหลังภาพถ่ายดาวเทียมอย่างสวยงาม
- **Smooth `map.flyTo()`**: แอนิเมชันบินค้นหาพิกัดผู้ใช้ หรือ Fallback ไปยังพิกัดลุ่มน้ำมูลเพื่อการสาธิตที่ไร้รอยต่อ

### 3. 🚨 Interactive Dispatch Log, Color-Coded Pins & Case Resolution
- **Interactive Click-to-Fly Log**: ในกล่อง "LIVE DISPATCH LOG" (มุมขวาล่าง) ผู้ใช้สามารถคลิกที่แต่ละรายการเพื่อสั่งให้ Leaflet `map.flyTo()` แพนและซูมกล้องดาวเทียมตรงไปยังพิกัดผู้ประสบภัยคนนั้นอย่างนุ่มนวล พร้อมเปิด Popup รายละเอียดและอัปเดตเส้นทางเดินเรือ AI Rescue Route ทันที
- **Priority Color-Coded Victim Pins**: หมุดบนแผนที่แบ่งแยกสีตามระดับความวิกฤตชัดเจน:
  - 🚨 **Code Red (หมุดสีแดง)**: ผู้ป่วยติดเตียง / ทารกแรกเกิด / น้ำท่วมมิดหลังคา พร้อมคลื่น Sonar Pulse สีแดงเรืองแสง 2 ชั้น
  - ⚠️ **Code Orange (หมุดสีส้ม)**: ผู้สูงอายุ / อาหารหมด / น้ำระดับอก พร้อมคลื่นแจ้งเตือนสีอำพัน
  - 📍 **Code Yellow / Blue (หมุดสีฟ้า)**: ผู้ประสบภัยทั่วไป / เฝ้าระวัง พร้อมวงแหวนไซแอน
- **"✔️ ปิดเคส" (Resolve / Clear Case Button)**:
  - ปุ่มกดสีมรกตไซเบอร์ใน Live Dispatch Log และใน Leaflet Popup
  - เมื่อคลิก ระบบจะเล่นอนิเมชัน Fade-Out & Slide-Away หายไปจากแถบอย่างนุ่มนวล
  - ลบหมุดของผู้ประสบภัยออกจากแผนที่ดาวเทียมทันที
  - ลบข้อมูลออกจาก LocalStorage Array รักษาความสะอาดของแดชบอร์ดตามมาตรฐาน Incident Command

### 4. 🏥 Critical POIs (Hospitals & Rescue Safe Drop-off Havens)
- **จุดพิกัดสำคัญแสดงอัตโนมัติบนแผนที่ (Static POIs on Load)**:
  - 🏥 **3 โรงพยาบาลหลัก (Red Badges)**:
    1. *รพ.วารินชำราบ (Warin Chamrap Hospital)* - ศูนย์อุบัติเหตุ มีจุดเทียบเรือพยาบาลด้านหลัง
    2. *รพ.สรรพสิทธิประสงค์ (Sunpasitthiprasong Regional Hospital)* - โรงพยาบาลศูนย์ระดับ 1 มีลานจอด ฮ. กู้ภัย และ ICU ทารก
    3. *รพ.ค่ายสรรพสิทธิประสงค์ (Military Base Hospital)* - รพ.สนามทหารบก พร้อมยานเกราะลุยน้ำ
  - 🛡️ **2 ฐานกู้ภัยและศูนย์พักพิงที่ดอน (Cyan & Emerald Badges)**:
    1. *ศูนย์ปฏิบัติการกู้ภัยส่วนหน้า อ.วารินชำราบ (HQ Command Base)* - ฐานปล่อยเรือ 5 ลำ และคลังน้ำมัน
    2. *ศูนย์พักพิงเทศบาลและจุดปล่อยเสบียง (Safe Staging Evacuation Center)* - จุดส่งต่อผู้ประสบภัยบนที่ดอน มีโรงครัวพระราชทานและแพทย์ตรวจคัดกรอง
  - ดีไซน์หมุดทรงสี่เหลี่ยมโค้งมน (Rounded-Square Badge) ขอบสีขาวคมชัด แยกความแตกต่างจากหมุดผู้ประสบภัยที่เป็นวงกลมเรดาร์อย่างเด็ดขาด ช่วยให้เรือกู้ภัยรู้จุดส่งตัวผู้ป่วยได้ทันที

### 5. ⚓ Rescue Command Dashboard (`dashboard.html`)
- **Incident Command System (ICS)**: หน้าจอศูนย์สั่งการกู้ภัยที่ผสานแผนที่ดาวเทียม Google Hybrid, Critical POIs, และหมุดเคสผู้ประสบภัย
- **Smart Route Optimization**: คัดกรองเคสผู้ป่วยติดเตียงและเด็กทารกขึ้นอันดับ 1 โดยอัตโนมัติ พร้อมวาดเส้นทางเดินเรือเรืองแสงครอบคลุมเคสวิกฤตไปจนถึงศูนย์พักพิง
- **Fleet Dispatch Action**: สั่งการส่งเรือกู้ภัย เช่น *Bravo-Medic* หรือ *Alpha-Command* เข้าสู่เคส พร้อมระบุ ETA
- **Live KPI Telemetry**: นับเคสรอช่วยเหลือ, เคสวิกฤต Code Red, เรือที่กำลังวิ่ง และจำนวนผู้ประสบภัยรวม
- **Web Audio Sound Effects**: ระบบเสียงสังเคราะห์ผ่าน Web Audio API ไม่ต้องโหลดไฟล์เสียงภายนอก

### 6. 🚀 High-Tech Splash Screen (Landing Entry & Smooth Transition)
- **Full-Screen Dark Landing Page**: เปิดตัวด้วยหน้าต่างบูตระบบสไตล์ศูนย์สั่งการทางทหารสีเข้มลึก ลวดลายกริดเลเซอร์ไซแอน
- **Glowing Tactical Centerpiece**: โลโก้สายฟ้าเรืองแสงสีแดง-ส้ม พร้อมวงแหวนเรดาร์หมุนวน 360 องศา (Orbiting Ring) และแบนเนอร์ *TACTICAL FLOOD RESCUE SYSTEM*
- **Dynamic Uplink Sequence**: แสดงข้อความจำลองการเชื่อมต่อดาวเทียมและเซนเซอร์เรียลไทม์:
  1. `Initializing Satellite Uplink...` (18%)
  2. `Fetching GISTDA Real-time Flood Data...` (48%)
  3. `Connecting to ThaiWater Sensors...` (75%)
  4. `Calibrating Tactical GIS Coordinates...` (92%)
  5. `All Systems Operational • Launching Dashboard...` (100%)
- **Smooth 2.5s CSS Fade-Out Transition**: ค่อยๆ เฟดจางออกอย่างนุ่มนวล (Scale & Blur Fade) เผยให้เห็นหน้าจอแผนที่ดาวเทียมด้านหลังอย่างไร้รอยต่อ
- **Interactive Controls**: มีปุ่ม `⚡ ข้าม (Skip Intro)` และปุ่ม `🎬 Intro` บนแถบเมนูด้านบน เพื่อให้กดเล่นแอนิเมชันเปิดตัวซ้ำได้ตลอดเวลาระหว่างการ Pitching

### 7. 🛰️ Real-Time Flood Radar Simulation & GISTDA Live Sync Widget
- **Simulated Live Radar Heatmap**: ยกระดับจากวงกลมธรรมดาเป็นเรดาร์ตรวจจับระดับน้ำท่วมแบบมีชีวิต (Live Pulsing Concentric Waves & 360° Sweep Scanline)
- **Multi-Zone Danger Waves**:
  - 🔴 **Deep Water Surge (สีแดงเรืองแสง)**: คลื่นเรดาร์ 3 ชั้นกระพริบแผ่ออกเป็นจังหวะ แสดงระดับน้ำลึกวิกฤต (>1.95 ม. มิดชั้น 1) กระแสน้ำเชี่ยวจัด พร้อมป้าย HUD `DEEP WATER 1.95`
  - 🟠 **Moderate Flood Zone (สีส้มเรืองแสง)**: คลื่นเตือนภัยระดับอก (0.8 - 1.2 ม.) เฝ้าระวังน้ำท่วมเข้าบ้านเรือน
- **📡 LIVE: GISTDA Satellite Sync Active Widget**: วิดเจ็ตลอยมุมบนของแผนที่ แสดงสถานะเชื่อมต่อดาวเทียมสด พร้อมไฟเขียว Blinking Green Dot และ Ping Latency
- **Quick Flood Basin Switcher**: ปุ่มลัดสลับพิกัดลุ่มน้ำวิกฤตสำคัญของไทยเพื่อการนำเสนอ:
  - 🔴 **อุบลฯ**: แม่น้ำมูลล้นตลิ่ง วารินชำราบ (สถานี M.7)
  - 🟠 **แม่สาย**: แม่น้ำสายล้นทะลัก เชียงราย
  - 🔵 **กทม.**: รังสิต-ปทุมธานี ลุ่มเจ้าพระยา
- **GISTDA SAR Telemetry Popups**: เมื่อคลิกที่วงเรดาร์ จะแสดงกล่องข้อมูลโทรมาตรระดับน้ำ ความเร็วกระแสน้ำ และคำแนะนำการนำเรือเข้าช่วยเหลือตามมาตรฐาน ปภ.

---

## 🖥️ วิธีการเปิดใช้งาน (How to Run)

เปิดไฟล์ผ่าน Browser ได้ทันที หรือใช้งานผ่าน Local Server:

### วิธีที่ 1: ดับเบิลคลิกเปิดไฟล์โดยตรง
- ดับเบิลคลิกไฟล์ `index.html` เพื่อเข้าหน้าแจ้งเหตุฉุกเฉินสำหรับประชาชน (มี High-Tech Splash Screen)
- ดับเบิลคลิกไฟล์ `dashboard.html` เพื่อเข้าหน้าจอศูนย์สั่งการกู้ภัย

### วิธีที่ 2: รันผ่าน Local Server (แนะนำสำหรับการพรีเซนต์)
```bash
# รันผ่าน Node.js ในโฟลเดอร์ ResQNow
node -e "
const http = require('http'), fs = require('fs'), path = require('path');
http.createServer((req, res) => {
    let f = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(f, (err, d) => {
        if(err) { res.writeHead(404); res.end(); }
        else { res.writeHead(200); res.end(d); }
    });
}).listen(4173, () => console.log('ResQNow running on http://localhost:4173'));
"
```
เปิดเบราว์เซอร์ที่:
- **Citizen SOS Reporting Portal**: [http://localhost:4173/index.html](http://localhost:4173/index.html)
- **Rescue Command Center OS**: [http://localhost:4173/dashboard.html](http://localhost:4173/dashboard.html)

---

## 🎯 คำแนะนำการนำเสนอใน Pitching Competition (1-2 นาที Demo Flow)

1. **เปิดหน้าแรก `index.html` (First Impression & Wow Factor)**:
   - กรรมการจะเห็น **High-Tech Splash Screen** บูตระบบ เชื่อมต่อดาวเทียม GISTDA Sentinel-1 และเซนเซอร์ ThaiWater
   - แถบความคืบหน้าจะวิ่งเต็ม 100% แล้ว **Smooth Fade-Out** เผยหน้าจอ Tactical Dashboard ออกมาอย่างน่าประทับใจ
   - (หากต้องการเปิดให้ดูอีกรอบ ให้กดปุ่ม **"🎬 Intro"** บนแถบเมนู)
2. **โชว์ Real-Time Flood Radar Simulation**:
   - ชี้ให้กรรมการเห็นคลื่นเรดาร์สีแดง-ส้มที่กระพริบเป็นจังหวะรอบแม่น้ำมูล พร้อมเส้นกวาดเรดาร์ 360 องศา
   - ชี้วิดเจ็ต **"📡 LIVE: GISTDA Satellite Sync Active"** มุมบนซ้ายของแผนที่
   - กดปุ่ม **"🟠 แม่สาย"** หรือ **"🔵 กทม."** เพื่อโชว์ความสามารถในการดึงข้อมูลดาวเทียมและบินข้ามจังหวัดด้วย Smooth `map.flyTo()`
3. **สาธิตการคัดกรอง Triage และแจ้งเหตุ**:
   - กดเลือก **"🛏️ ผู้ป่วยติดเตียง"** หรือ **"🌊 น้ำมิดชั้น 1 (>1.5ม.)"** ชี้ให้เห็นว่าเกจ AI Triage ปรับเป็น **`CODE RED: วิกฤตสูงสุด`** ทันที
   - ปักหมุดบนแผนที่ หรือกดปุ่ม **"🎯 ค้นหาพิกัดฉันปัจจุบัน"** เพื่อโชว์ Drop Pin และเส้นทางเดินเรือเรืองแสง AI Rescue Route พร้อมคำนวณ ETA
   - กด **"🚨 ส่งสัญญาณขอความช่วยเหลือฉุกเฉิน"** เพื่อโชว์ Success Modal สไตล์ยุทธวิธี
4. **กดปุ่มสลับไปยัง `dashboard.html` (ฝั่งศูนย์สั่งการกู้ภัย)**:
   - โชว์มุมมองภาพรวม Incident Command Center พร้อมคลื่นเรดาร์น้ำท่วมและหมุดผู้ประสบภัย
   - ชี้ไปที่แถบขวา **"Smart Route Optimization"** ซึ่งระบบได้จัดเคส Code Red ขึ้นมาเป็นอันดับที่ 1 ทันที พร้อมคำนวณระยะทางจากฐาน
   - กดปุ่ม **"🚤 ส่งเรือทันที"** หรือ **"🚀 ส่งเรือตามเส้นทางนี้"** เพื่อโชว์การกระจายกำลังเรือแบบอัตโนมัติ
   - สลับกลับมาหน้าแรกเพื่อโชว์การกด **"✔️ ปิดเคส"** ใน Live Dispatch Log เพื่อเคลียร์เคสอย่างนุ่มนวล
