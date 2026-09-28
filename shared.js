/**
 * ResQNow - Shared Tactical Disaster Management Core
 * LocalStorage Manager, Triage AI Rule Engine, Web Audio Synthesizer & Geo Utilities
 */

const STORAGE_KEY = 'resqnow_emergency_cases';
const FLEET_STORAGE_KEY = 'resqnow_rescue_fleet';

// High-Definition Tactical Tile Layers
// Google Maps Hybrid (Satellite + Roads & Labels) - No API Key Needed
const GOOGLE_HYBRID_TILES = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
// CartoDB Dark Matter (Watermark-free dark base)
const CARTODB_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Default Disaster Scenario: Flooding in Warin Chamrap / Ubon Ratchathani Basin (Mun River)
const DEFAULT_CENTER = {
    lat: 15.1985,
    lng: 104.8615,
    name: 'ศูนย์ปฏิบัติการกู้ภัยส่วนหน้า อ.วารินชำราบ (HQ Command Base)'
};

// Simulated Live Radar Flood Heatmap (GISTDA Sentinel-1 SAR & ThaiWater Telemetry)
const FLOOD_RISK_ZONES = [
    {
        id: 'RADAR-ZONE-RED-01',
        type: 'deep_water_red',
        name: '🔴 โซนน้ำลึกวิกฤต: ลุ่มแม่น้ำมูลล้นตลิ่ง (Deep Water Surge)',
        province: 'อุบลราชธานี - วารินชำราบ',
        lat: 15.2090,
        lng: 104.8640,
        radiusMeters: 650,
        pixelSize: 260,
        pulseColor: '#ef4444',
        waterDepth: '> 1.95 เมตร (มิดชั้น 1)',
        velocity: 'กระแสน้ำเชี่ยวจัด 2.8 ม./วินาที',
        sensor: 'GISTDA SAR + โทรมาตร M.7 ลุ่มน้ำมูล',
        status: 'CRITICAL INUNDATION (วิกฤตสูงสุด)',
        households: '~420 หลังคาเรือนติดค้าง',
        alert: 'ห้ามเรือเล็กสัญจร ต้องการเรือยนต์กู้ชีพยกสูงหรือเรือยางทหาร'
    },
    {
        id: 'RADAR-ZONE-ORANGE-01',
        type: 'moderate_orange',
        name: '🟠 โซนเสี่ยงปานกลาง: พื้นที่ลุ่มต่ำเกตุแก้ว-ท่ากอไผ่ (Moderate Flood)',
        province: 'อุบลราชธานี - เกตุแก้ว',
        lat: 15.1950,
        lng: 104.8510,
        radiusMeters: 800,
        pixelSize: 240,
        pulseColor: '#f59e0b',
        waterDepth: '0.85 - 1.20 เมตร (ระดับเอว-อก)',
        velocity: 'กระแสน้ำปานกลาง 1.1 ม./วินาที',
        sensor: 'GISTDA Sentinel-1C + สถานีวัดระดับน้ำเทศบาล',
        status: 'HIGH FLOOD RISK (เฝ้าระวังตัดไฟ)',
        households: '~280 หลังคาเรือน',
        alert: 'เสี่ยงตัดกระแสไฟฟ้าเร่งด่วน ลำเลียงเสบียงและอพยพผู้สูงอายุ'
    },
    {
        id: 'RADAR-ZONE-CHIANGRAI-RED',
        type: 'deep_water_red',
        name: '🔴 โซนน้ำหลากฉับพลัน: แม่สาย-เกาะทราย (Flash Flood Mudflow)',
        province: 'เชียงราย - แม่สาย',
        lat: 20.4320,
        lng: 99.8820,
        radiusMeters: 750,
        pixelSize: 250,
        pulseColor: '#ef4444',
        waterDepth: '> 2.10 เมตร (ดินโคลนถล่มรุนแรง)',
        velocity: 'กระแสน้ำเชี่ยวรุนแรง 3.5 ม./วินาที',
        sensor: 'GISTDA SAR + เซนเซอร์เตือนภัยน้ำหลากลุ่มน้ำกก',
        status: 'CRITICAL FLASH FLOOD',
        households: '~650 ครัวเรือน',
        alert: 'กระแสน้ำพัดโคลน ห้ามเดินลุยน้ำ ใช้เชือกและเรือยางคอมมานโดเท่านั้น'
    },
    {
        id: 'RADAR-ZONE-BANGKOK-ORANGE',
        type: 'moderate_orange',
        name: '🟠 โซนเฝ้าระวังน้ำทะเลหนุน: คลองรังสิต-เจ้าพระยา (River Tidal Surge)',
        province: 'กรุงเทพฯ - ปทุมธานี',
        lat: 13.9850,
        lng: 100.6150,
        radiusMeters: 900,
        pixelSize: 250,
        pulseColor: '#f59e0b',
        waterDepth: '0.60 - 0.90 เมตร (ลุ่มต่ำริมคลอง)',
        velocity: 'น้ำเอ่อล้นตามรอบน้ำทะเลหนุน',
        sensor: 'GISTDA THEOS-2 + สถานีสูบน้ำคลองรังสิต',
        status: 'TIDAL SURGE ALERT',
        households: '~340 ครัวเรือน',
        alert: 'เปิดเครื่องสูบน้ำเต็มกำลัง เสริมกระสอบทรายแนวคันกั้นน้ำ'
    }
];

// Major Flood-Prone Regions of Thailand (For Quick GIS Switching)
const FLOOD_PRONE_REGIONS = {
    ubon: {
        id: 'ubon',
        name: 'อุบลราชธานี (ลุ่มน้ำมูล - วารินชำราบ)',
        subtext: 'แม่น้ำมูลล้นตลิ่ง วิกฤตน้ำท่วมขังมิดชั้น 1',
        lat: 15.2045,
        lng: 104.8582,
        zoom: 15
    },
    chiangrai: {
        id: 'chiangrai',
        name: 'เชียงราย (แม่สาย - แม่น้ำกก)',
        subtext: 'น้ำป่าไหลหลากฉับพลันและดินโคลนถล่ม',
        lat: 20.4320,
        lng: 99.8820,
        zoom: 14
    },
    bangkok: {
        id: 'bangkok',
        name: 'กรุงเทพฯ-ปทุมธานี (ลุ่มแม่น้ำเจ้าพระยา)',
        subtext: 'น้ำทะเลหนุนสูง น้ำเหนือหลากทุ่งรังสิต',
        lat: 13.9850,
        lng: 100.6150,
        zoom: 14
    }
};

// Critical Points of Interest (Hospitals & Rescue Command Centers / Safe Drop-off Zones)
const CRITICAL_POIS = [
    {
        id: 'POI-HOSP-01',
        type: 'hospital',
        name: 'รพ.วารินชำราบ (Warin Chamrap Hospital)',
        subname: 'ศูนย์การแพทย์ฉุกเฉินและอุบัติเหตุ (Trauma Center Level 2)',
        lat: 15.1915,
        lng: 104.8580,
        icon: '🏥',
        color: '#ef4444',
        status: 'พร้อมรับผู้ป่วยฉุกเฉิน (ICU 8 เตียงว่าง)',
        phone: '045-321-234',
        capacity: 'เตียงผู้ป่วยฉุกเฉิน: 35 เตียง',
        desc: 'มีจุดเทียบเรือพยาบาลด้านหลัง รพ. พร้อมเครื่องช่วยหายใจและแพทย์เฉพาะทาง'
    },
    {
        id: 'POI-HOSP-02',
        type: 'hospital',
        name: 'รพ.สรรพสิทธิประสงค์ (Sunpasitthiprasong Regional Hospital)',
        subname: 'โรงพยาบาลศูนย์ระดับตติยภูมิขั้นสูง (Tertiary Trauma Level 1)',
        lat: 15.2285,
        lng: 104.8590,
        icon: '🏥',
        color: '#ef4444',
        status: 'ศูนย์ส่งต่อวิกฤต (Critical Evacuation Hub)',
        phone: '045-244-973',
        capacity: 'ลานจอดเฮลิคอปเตอร์กู้ภัย & ICU 20 เตียง',
        desc: 'รองรับเคสผ่าตัดฉุกเฉิน ผู้ป่วยติดเตียงอาการหนัก และทารกแรกเกิดภาวะวิกฤต'
    },
    {
        id: 'POI-HOSP-03',
        type: 'hospital',
        name: 'รพ.ค่ายสรรพสิทธิประสงค์ (Military Base Hospital)',
        subname: 'หน่วยสนับสนุนการแพทย์ทหารบก (Army Field Hospital)',
        lat: 15.1840,
        lng: 104.8490,
        icon: '🏥',
        color: '#ef4444',
        status: 'เปิด รพ.สนามรองรับน้ำท่วม',
        phone: '045-324-111',
        capacity: 'เตียงสนาม: 50 เตียง',
        desc: 'รถพยาบาลยกสูงและยานเกราะลุยน้ำพร้อมลำเลียงผู้ป่วยออกจากพื้นที่เสี่ยง'
    },
    {
        id: 'POI-RESCUE-01',
        type: 'rescue_center',
        name: 'ศูนย์ปฏิบัติการกู้ภัยส่วนหน้า อ.วารินชำราบ (HQ Command Base)',
        subname: 'ฐานบัญชาการเรือกู้ภัยและจุดกระจายกำลังพล (ICS Forward Post)',
        lat: 15.1985,
        lng: 104.8615,
        icon: '🛡️',
        color: '#06b6d4',
        status: 'ฐานปล่อยเรือกู้ภัย 5 ลำ (Alpha/Delta/Bravo/Echo/Charlie)',
        phone: '1784 / 045-321-999',
        capacity: 'คลังน้ำมัน 2,000 ลิตร & กองเรือ 5 ลำ',
        desc: 'ศูนย์ประสานงานหลักทางวิทยุยุทธวิธี เชื่อมโยงสัญญาณ GPS และโดรนสำรวจ'
    },
    {
        id: 'POI-RESCUE-02',
        type: 'safe_zone',
        name: 'ศูนย์พักพิงเทศบาลและจุดปล่อยเสบียง (Safe Staging Evacuation Center)',
        subname: 'พื้นที่ปลอดภัยบนที่ดอน (High-Ground Safe Haven)',
        lat: 15.1870,
        lng: 104.8690,
        icon: '🛡️',
        color: '#10b981',
        status: 'รองรับผู้อพยพแล้ว 142/500 คน',
        phone: '045-321-888',
        capacity: 'ความจุ: 500 คน (มีอาหารปรุงสุก & น้ำสะอาด)',
        desc: 'มีโรงครัวพระราชทาน แพทย์สนามตรวจคัดกรอง และจุดส่งต่อญาติ'
    }
];

// Live Dispatch Simulated Tactical Log (with precise victim coordinates)
const SIMULATED_DISPATCH_FEED = [
    {
        id: 'FEED-01',
        caseId: 'RQ-901',
        victim: 'ยายบุญมี สมบัติ',
        priority: 'CODE_RED',
        tag: 'ผู้ป่วยติดเตียง',
        lat: 15.2045,
        lng: 104.8582,
        distance: '1.2 กม.',
        boat: '🚤 Bravo-Medic',
        status: 'เรือเข้าเทียบชานเรือนแล้ว',
        time: '2 นาทีที่แล้ว'
    },
    {
        id: 'FEED-02',
        caseId: 'RQ-902',
        victim: 'คุณพรทิพย์ สุวรรณโชติ',
        priority: 'CODE_RED',
        tag: 'ทารก 3 เดือน',
        lat: 15.2112,
        lng: 104.8680,
        distance: '2.1 กม.',
        boat: '🚤 Delta-01',
        status: 'กำลังฝ่ากระแสน้ำเชี่ยวเข้าซอยย่อย',
        time: '5 นาทีที่แล้ว'
    },
    {
        id: 'FEED-03',
        caseId: 'RQ-906',
        victim: 'คุณธนาคาร อุดมสุข',
        priority: 'CODE_RED',
        tag: 'ผ่าตัดขา / น้ำท่วมคอ',
        lat: 15.2010,
        lng: 104.8490,
        distance: '1.5 กม.',
        boat: '🚤 Alpha-Command',
        status: 'ลำเลียงผู้ป่วยลงเรือยางเรียบร้อย',
        time: '11 นาทีที่แล้ว'
    },
    {
        id: 'FEED-04',
        caseId: 'RQ-903',
        victim: 'นายสมเกียรติ ยิ่งยืน',
        priority: 'CODE_ORANGE',
        tag: 'น้ำระดับอก / ขาดอาหาร',
        lat: 15.1920,
        lng: 104.8540,
        distance: '0.9 กม.',
        boat: '🚤 Charlie-02',
        status: 'ส่งมอบถุงยังชีพและน้ำดื่ม 4 ลัง',
        time: '18 นาทีที่แล้ว'
    }
];

// Preset demo cases for pitching demonstration
const SEED_CASES = [
    {
        id: 'RQ-901',
        name: 'ยายบุญมี สมบัติ',
        phone: '081-992-4411',
        lat: 15.2045,
        lng: 104.8582,
        address: 'ชุมชนเกตุแก้ว ซอย 4 บ้านเลขที่ 18/2 (บ้านไม้สองชั้น ใกล้วัด)',
        headcount: 4,
        vulnerabilities: ['elderly', 'bedridden'],
        waterLevel: 'critical', // > 1.5m
        waterLevelText: 'ระดับมิดชั้น 1 (>1.8 ม.)',
        needs: [
            '🚤 เรืออพยพด่วน (Evacuation Boat)',
            '🛏️ ผู้ป่วยติดเตียง (Bedridden Patient)',
            '💊 ขาดออกซิเจนกระป๋อง/ยาประจำตัว'
        ],
        priority: 'CODE_RED',
        priorityScore: 98,
        status: 'PENDING',
        assignedBoat: null,
        notes: 'ยายติดเตียงอายุ 84 ปี เจาะคอ มีเสมหะ ต้องการเรือมีหลังคาและแพทย์สนามด่วน',
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        reportedTime: '18 นาทีที่แล้ว'
    },
    {
        id: 'RQ-902',
        name: 'คุณพรทิพย์ สุวรรณโชติ',
        phone: '089-445-1290',
        lat: 15.2112,
        lng: 104.8680,
        address: 'ชุมชนท่ากอไผ่ ริมแม่น้ำมูล หน้าร้านขายของชำ',
        headcount: 5,
        vulnerabilities: ['infant', 'children'],
        waterLevel: 'critical',
        waterLevelText: 'กระแสน้ำเชี่ยว สูงเกือบ 2 เมตร',
        needs: [
            '🚤 เรืออพยพด่วน (Evacuation Boat)',
            '🍼 นมผงและแพมเพิสเด็กทารก (Infant Supplies)',
            '🍱 อาหารและน้ำดื่มฉุกเฉิน'
        ],
        priority: 'CODE_RED',
        priorityScore: 94,
        status: 'PENDING',
        assignedBoat: null,
        notes: 'มีทารกวัย 3 เดือน และเด็ก 2 คน ติดอยู่บนดาดฟ้า น้ำไหลเชี่ยวมากเสี่ยงถล่ม',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        reportedTime: '25 นาทีที่แล้ว'
    },
    {
        id: 'RQ-903',
        name: 'นายสมเกียรติ ยิ่งยืน',
        phone: '092-331-8874',
        lat: 15.1920,
        lng: 104.8540,
        address: 'หมู่ 2 ถนนสถิตย์นิมานกาล ซอยเทศบาล 12',
        headcount: 3,
        vulnerabilities: ['elderly'],
        waterLevel: 'high', // 1.0m
        waterLevelText: 'ระดับอก (1.2 ม.)',
        needs: [
            '🚤 เรืออพยพด่วน (Evacuation Boat)',
            '🍱 อาหารและน้ำดื่มสะอาด',
            '⚡ แบตสำรอง/ไฟฉาย'
        ],
        priority: 'CODE_ORANGE',
        priorityScore: 78,
        status: 'DISPATCHED',
        assignedBoat: '🚤 เรือท้องแบน Delta-01',
        notes: 'คนแก่อายุ 68 ปี เดินได้แต่เริ่มอ่อนเพลีย ข้าวสารอาหารแห้งหมด',
        timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
        reportedTime: '55 นาทีที่แล้ว'
    },
    {
        id: 'RQ-904',
        name: 'น.ส.กัญญารัตน์ มงคล',
        phone: '061-229-3388',
        lat: 15.2180,
        lng: 104.8620,
        address: 'ใกล้สะพานเสรีประชาธิปไตย ฝั่งวารินฯ',
        headcount: 6,
        vulnerabilities: ['pets'],
        waterLevel: 'high',
        waterLevelText: 'ระดับเอว (0.9 ม.)',
        needs: [
            '🍱 อาหารและน้ำดื่มสะอาด',
            '🚤 ขออพยพคนและสัตว์เลี้ยง (หมา 2 ตัว)'
        ],
        priority: 'CODE_ORANGE',
        priorityScore: 65,
        status: 'PENDING',
        assignedBoat: null,
        notes: 'ยังปลอดภัยบนชั้น 2 แต่น้ำประปาและไฟฟ้าดับแล้ว ต้องการน้ำดื่ม',
        timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
        reportedTime: '1 ชั่วโมงที่แล้ว'
    },
    {
        id: 'RQ-905',
        name: 'ลุงประสิทธิ์ ดอกบัว',
        phone: '084-551-7890',
        lat: 15.1885,
        lng: 104.8710,
        address: 'ชุมชนหาดสวนยา บ้านไม้หลังคาสีเขียว',
        headcount: 2,
        vulnerabilities: [],
        waterLevel: 'medium',
        waterLevelText: 'ระดับเข่า (45 ซม.)',
        needs: [
            '🍱 อาหารกล่องและน้ำดื่ม',
            '💊 ยาสามัญ ยาแก้น้ำกัดเท้า'
        ],
        priority: 'CODE_YELLOW',
        priorityScore: 42,
        status: 'PENDING',
        assignedBoat: null,
        notes: 'ยังไม่ประสงค์อพยพ ต้องการเสบียงยังชีพประทัง 2-3 วัน',
        timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        reportedTime: '2 ชั่วโมงที่แล้ว'
    },
    {
        id: 'RQ-906',
        name: 'คุณธนาคาร อุดมสุข',
        phone: '095-776-1234',
        lat: 15.2010,
        lng: 104.8490,
        address: 'ซอยสุขสมบูรณ์ 3 บ้านรั้วสีส้ม',
        headcount: 4,
        vulnerabilities: ['elderly'],
        waterLevel: 'critical',
        waterLevelText: 'ระดับคอ (>1.6 ม.)',
        needs: [
            '🚤 เรืออพยพด่วน (Evacuation Boat)',
            '🛏️ ผู้ป่วยผ่าตัดขา เคลื่อนย้ายลำบาก'
        ],
        priority: 'CODE_RED',
        priorityScore: 92,
        status: 'DISPATCHED',
        assignedBoat: '🚤 เรือกู้ชีพ Alpha-Command',
        notes: 'ทีมกำลังเข้าช่วยเหลือ กำลังนำเรือเข้าทางซอยย่อย',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        reportedTime: '35 นาทีที่แล้ว'
    },
    {
        id: 'RQ-907',
        name: 'คุณป้ามาลี รัตนพงษ์',
        phone: '082-114-9988',
        lat: 15.1950,
        lng: 104.8660,
        address: 'ตลาดสดวารินเจริญศรี แผงผลไม้โซนใน',
        headcount: 3,
        vulnerabilities: [],
        waterLevel: 'medium',
        waterLevelText: 'ระดับน่อง (30 ซม.)',
        needs: [
            '🍱 อาหารกล่อง'
        ],
        priority: 'CODE_YELLOW',
        priorityScore: 35,
        status: 'RESOLVED',
        assignedBoat: '🚤 เรือท้องแบน Charlie-02',
        notes: 'อพยพสู่ศูนย์พักพิงเทศบาลเรียบร้อย ปลอดภัย',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        reportedTime: '3 ชั่วโมงที่แล้ว'
    }
];

// Rescue fleet units available
const DEFAULT_FLEET = [
    { id: 'BOAT-01', name: 'Alpha-Command', type: 'เรือยนต์กู้ชีพความเร็วสูง', capacity: 6, status: 'BUSY', fuel: '85%', assignedTo: 'RQ-906' },
    { id: 'BOAT-02', name: 'Delta-01', type: 'เรือท้องแบนเครื่องยนต์หางยาว', capacity: 10, status: 'BUSY', fuel: '70%', assignedTo: 'RQ-903' },
    { id: 'BOAT-03', name: 'Bravo-Medic', type: 'เรือพยาบาลสนามขั้นสูง', capacity: 4, status: 'READY', fuel: '100%', assignedTo: null },
    { id: 'BOAT-04', name: 'Echo-Heavy', type: 'เรือยางเครื่องยนต์ทหาร (Ranger)', capacity: 8, status: 'READY', fuel: '90%', assignedTo: null },
    { id: 'BOAT-05', name: 'Charlie-02', type: 'เรือท้องแบนลำเลียงเสบียง', capacity: 12, status: 'READY', fuel: '95%', assignedTo: null }
];

// Web Audio Tactical Sound Synthesizer (Native Zero-Dependency)
class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
    }

    playBeep(freq = 880, duration = 0.08, type = 'sine', gain = 0.15) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            g.gain.setValueAtTime(gain, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio policy ignore
        }
    }

    playAlert() {
        if (!this.enabled) return;
        this.playBeep(880, 0.1, 'sawtooth', 0.2);
        setTimeout(() => this.playBeep(1174, 0.15, 'sawtooth', 0.25), 120);
    }

    playSuccess() {
        if (!this.enabled) return;
        this.playBeep(523.25, 0.08, 'triangle', 0.15); // C5
        setTimeout(() => this.playBeep(659.25, 0.08, 'triangle', 0.18), 90); // E5
        setTimeout(() => this.playBeep(783.99, 0.16, 'triangle', 0.2), 180); // G5
    }

    playSonar() {
        if (!this.enabled) return;
        this.playBeep(1400, 0.35, 'sine', 0.12);
    }

    playClick() {
        if (!this.enabled) return;
        this.playBeep(600, 0.03, 'sine', 0.08);
    }
}

const sfx = new SoundFX();

// LocalStorage API Helpers
const ResQStorage = {
    getAllCases() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                // Pre-seed with demo flood crisis cases for pitch showcase!
                ResQStorage.seedDemo();
                return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            }
            return JSON.parse(raw);
        } catch (e) {
            console.error('Storage read error:', e);
            return SEED_CASES;
        }
    },

    saveCases(cases) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
            // Trigger storage event for live multi-tab sync
            window.dispatchEvent(new Event('resqnow-db-updated'));
        } catch (e) {
            console.error('Storage write error:', e);
        }
    },

    addCase(newCase) {
        const cases = ResQStorage.getAllCases();
        cases.unshift(newCase);
        ResQStorage.saveCases(cases);
        return newCase;
    },

    updateCase(id, updates) {
        const cases = ResQStorage.getAllCases();
        const idx = cases.findIndex(c => c.id === id);
        if (idx !== -1) {
            cases[idx] = { ...cases[idx], ...updates, updatedAt: new Date().toISOString() };
            ResQStorage.saveCases(cases);
            return cases[idx];
        }
        return null;
    },

    deleteCase(id) {
        const cases = ResQStorage.getAllCases().filter(c => c.id !== id);
        ResQStorage.saveCases(cases);
    },

    seedDemo() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CASES));
        localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(DEFAULT_FLEET));
        window.dispatchEvent(new Event('resqnow-db-updated'));
    },

    clearAll() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(FLEET_STORAGE_KEY);
        window.dispatchEvent(new Event('resqnow-db-updated'));
    },

    getFleet() {
        try {
            const raw = localStorage.getItem(FLEET_STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(DEFAULT_FLEET));
                return DEFAULT_FLEET;
            }
            return JSON.parse(raw);
        } catch (e) {
            return DEFAULT_FLEET;
        }
    },

    saveFleet(fleet) {
        localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(fleet));
        window.dispatchEvent(new Event('resqnow-db-updated'));
    }
};

// Priority AI Rule Engine
function calculateTriagePriority({ headcount = 1, vulnerabilities = [], waterLevel = 'medium', needs = [] }) {
    let score = 0;

    // Vulnerability Weight
    if (vulnerabilities.includes('bedridden')) score += 45;
    if (vulnerabilities.includes('infant')) score += 35;
    if (vulnerabilities.includes('elderly')) score += 20;
    if (vulnerabilities.includes('pregnant')) score += 30;
    if (vulnerabilities.includes('pets')) score += 5;

    // Water Level Weight
    if (waterLevel === 'critical') score += 40; // >1.5m
    else if (waterLevel === 'high') score += 25; // 0.8 - 1.5m
    else if (waterLevel === 'medium') score += 10; // 0.3 - 0.8m

    // Headcount Weight
    score += Math.min(parseInt(headcount || 1) * 3, 20);

    // Needs Weight
    const needsStr = needs.join(' ').toLowerCase();
    if (needsStr.includes('เรือ') || needsStr.includes('อพยพ')) score += 15;
    if (needsStr.includes('ออกซิเจน') || needsStr.includes('ยา') || needsStr.includes('แพทย์')) score += 20;

    let priority = 'CODE_YELLOW';
    let label = 'CODE YELLOW (เฝ้าระวัง / เสบียง)';
    let color = '#06b6d4'; // Cyan

    if (score >= 70 || vulnerabilities.includes('bedridden') || (waterLevel === 'critical' && vulnerabilities.includes('infant'))) {
        priority = 'CODE_RED';
        label = 'CODE RED (วิกฤตสูงสุด - ต้องการเรือด่วน)';
        color = '#ef4444'; // Red
    } else if (score >= 45 || waterLevel === 'critical' || vulnerabilities.includes('elderly') || vulnerabilities.includes('infant')) {
        priority = 'CODE_ORANGE';
        label = 'CODE ORANGE (เร่งด่วนสูง - อพยพด่วน)';
        color = '#f59e0b'; // Amber
    }

    return { score, priority, label, color };
}

// Modern Toast Notification Utility
const Toast = {
    container: null,

    init() {
        if (!this.container && typeof document !== 'undefined') {
            this.container = document.createElement('div');
            this.container.id = 'tactical-toast-shelf';
            this.container.className = 'fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4';
            document.body.appendChild(this.container);
        }
    },

    show({ title, message, type = 'info', duration = 4000 }) {
        this.init();
        if (!this.container) return;

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto transform transition-all duration-300 ease-out translate-y-[-20px] opacity-0 rounded-xl p-4 shadow-2xl backdrop-blur-xl border flex items-start gap-3 text-slate-100 ${
            type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 shadow-emerald-950/50'
                : type === 'danger' || type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 shadow-rose-950/50'
                : type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 shadow-amber-950/50'
                : 'bg-slate-900/90 border-cyan-500/50 shadow-cyan-950/50'
        }`;

        const iconMap = {
            success: '✅',
            danger: '🚨',
            error: '⚠️',
            warning: '⚡',
            info: '📡'
        };

        toast.innerHTML = `
            <div class="text-2xl pt-0.5 select-none">${iconMap[type] || '🔔'}</div>
            <div class="flex-1 min-w-0">
                <div class="font-bold text-sm tracking-wider uppercase ${
                    type === 'success' ? 'text-emerald-400' :
                    type === 'danger' ? 'text-rose-400' :
                    type === 'warning' ? 'text-amber-400' : 'text-cyan-400'
                }">${title}</div>
                <div class="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">${message}</div>
            </div>
            <button class="text-slate-400 hover:text-white transition-colors p-1" onclick="this.parentElement.remove()">✕</button>
        `;

        this.container.appendChild(toast);

        // Play SFX
        if (type === 'danger' || type === 'error') sfx.playAlert();
        else if (type === 'success') sfx.playSuccess();
        else sfx.playClick();

        // Animate In
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-[-20px]', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });

        // Auto Dismiss
        setTimeout(() => {
            toast.classList.add('opacity-0', 'scale-95');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Distance calculation in kilometers (Haversine Formula)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
}

// Export for module/global usage
if (typeof window !== 'undefined') {
    window.ResQStorage = ResQStorage;
    window.calculateTriagePriority = calculateTriagePriority;
    window.Toast = Toast;
    window.sfx = sfx;
    window.DEFAULT_CENTER = DEFAULT_CENTER;
    window.calculateDistanceKm = calculateDistanceKm;
    window.GOOGLE_HYBRID_TILES = GOOGLE_HYBRID_TILES;
    window.CARTODB_DARK_TILES = CARTODB_DARK_TILES;
    window.FLOOD_RISK_ZONES = FLOOD_RISK_ZONES;
    window.FLOOD_PRONE_REGIONS = FLOOD_PRONE_REGIONS;
    window.SIMULATED_DISPATCH_FEED = SIMULATED_DISPATCH_FEED;
    window.CRITICAL_POIS = CRITICAL_POIS;
}
