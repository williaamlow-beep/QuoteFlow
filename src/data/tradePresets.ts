import { TradeCategory, TradeInfo } from '../types';

export const PHOTO_REQUIRED_TRADES: TradeCategory[] = [
  'panel_beater',
  'mechanic',
  'auto_electrician',
  'plumber',
  'locksmith',
  'carpenter',
  'handyman',
  'towing',
];

export const TRADE_INFO: Record<TradeCategory, TradeInfo> = {
  panel_beater: {
    name: 'Panel Beater & Body Shop',
    iconName: 'Car',
    sampleVoicePrompt: 'Mr Tan, car plate SJB 8892, bumper dent repair 280 dollars, side door scratch touch up 180, windscreen chip resin 95.',
    presets: [
      { id: 'pb1', category: 'panel_beater', title: 'Front Bumper Dent Repair & Spray', price: 280 },
      { id: 'pb2', category: 'panel_beater', title: 'Side Door Scratch Touch-Up', price: 180 },
      { id: 'pb3', category: 'panel_beater', title: 'Windscreen Chip Resin Seal', price: 95 },
      { id: 'pb4', category: 'panel_beater', title: 'Headlight Polish & UV Restoration', price: 75 },
      { id: 'pb5', category: 'panel_beater', title: 'Fender Knocking & Realignment', price: 220 },
      { id: 'pb6', category: 'panel_beater', title: 'Rear Quarter Panel Paint Blend', price: 340 },
    ],
  },
  mechanic: {
    name: 'Car Mechanic & Garage',
    iconName: 'Wrench',
    sampleVoicePrompt: 'David Lim, Toyota Vios, full synthetic engine service 160, replace front brake pads 190, battery test and swap 140.',
    presets: [
      { id: 'm1', category: 'mechanic', title: 'Full Synthetic Engine Oil Service', price: 160 },
      { id: 'm2', category: 'mechanic', title: 'Front Brake Pads Replacement', price: 190 },
      { id: 'm3', category: 'mechanic', title: 'Maintenance-Free Car Battery (DIN55)', price: 140 },
      { id: 'm4', category: 'mechanic', title: 'Transmission Fluid Flush (ATF)', price: 120 },
      { id: 'm5', category: 'mechanic', title: 'Radiator Coolant Flush & Check', price: 85 },
      { id: 'm6', category: 'mechanic', title: 'Spark Plugs Set (Iridium x4)', price: 110 },
    ],
  },
  auto_electrician: {
    name: 'Auto Electrician',
    iconName: 'Zap',
    sampleVoicePrompt: 'Mrs Ong, Honda City, fuse box wiring diagnostic 110, install front and rear dual dashcam 95, alternator charging fix 180.',
    presets: [
      { id: 'ae1', category: 'auto_electrician', title: 'Electrical Short & Wiring Diagnostic', price: 110 },
      { id: 'ae2', category: 'auto_electrician', title: 'Dual Dashcam Hardwire Installation', price: 95 },
      { id: 'ae3', category: 'auto_electrician', title: 'Alternator Repair & Carbon Brush', price: 180 },
      { id: 'ae4', category: 'auto_electrician', title: 'Power Window Motor Replacement', price: 150 },
      { id: 'ae5', category: 'auto_electrician', title: 'Car Alarm & Central Lock Repair', price: 130 },
    ],
  },
  plumber: {
    name: 'Plumbing Services',
    iconName: 'Droplets',
    sampleVoicePrompt: 'Madam Wong, Unit 14-02, kitchen sink drain unblock 110, replace master bathroom toilet inlet valve 130, fix pipe leak under sink 90.',
    presets: [
      { id: 'p1', category: 'plumber', title: 'Under-Sink Pipe Leak Repair', price: 130 },
      { id: 'p2', category: 'plumber', title: 'Kitchen Sink / Floor Trap Drain Unclog', price: 110 },
      { id: 'p3', category: 'plumber', title: 'Toilet Bowl Replacement (Labor)', price: 250 },
      { id: 'p4', category: 'plumber', title: 'Water Heater Supply Pipe & Tap Install', price: 95 },
      { id: 'p5', category: 'plumber', title: 'High Pressure Water Jetting Blockage', price: 280 },
    ],
  },
  locksmith: {
    name: 'Locksmith & Security',
    iconName: 'Key',
    sampleVoicePrompt: 'Mr Kelvin, urgent condo main door lockout service 120, replace digital lock cylinder 160.',
    presets: [
      { id: 'l1', category: 'locksmith', title: 'Emergency Residential Door Unlock', price: 120 },
      { id: 'l2', category: 'locksmith', title: 'High-Security Deadbolt Replacement', price: 160 },
      { id: 'l3', category: 'locksmith', title: 'Vehicle Door Lockout Extraction', price: 140 },
      { id: 'l4', category: 'locksmith', title: 'Smart Digital Lock Installation', price: 180 },
    ],
  },
  carpenter: {
    name: 'Carpentry & Cabinetry',
    iconName: 'Hammer',
    sampleVoicePrompt: 'Sarah Chen, repair kitchen cabinet soft close hinges 90, replace warped sliding wardrobe track 160.',
    presets: [
      { id: 'c1', category: 'carpenter', title: 'Cabinet Soft-Close Hinges Realign & Swap', price: 90 },
      { id: 'c2', category: 'carpenter', title: 'Sliding Wardrobe Roller Track Repair', price: 160 },
      { id: 'c3', category: 'carpenter', title: 'Solid Wood Door Planing & Trimming', price: 130 },
      { id: 'c4', category: 'carpenter', title: 'Custom Wooden Shelf Fabrication & Fit', price: 220 },
    ],
  },
  handyman: {
    name: 'General Handyman',
    iconName: 'Tool',
    sampleVoicePrompt: 'Mr Jackson, 65 inch TV wall mounting 120, assemble 3 tier Ikea storage rack 75, replace ceiling light fixture 50.',
    presets: [
      { id: 'h1', category: 'handyman', title: 'TV Wall Bracket Mounting (Up to 75")', price: 120 },
      { id: 'h2', category: 'handyman', title: 'Flat-Pack Furniture Assembly (Large)', price: 85 },
      { id: 'h3', category: 'handyman', title: 'Ceiling Fan & Light Fixture Install', price: 90 },
      { id: 'h4', category: 'handyman', title: 'Curtain Rod & Blinds Drilling & Setup', price: 70 },
    ],
  },
  towing: {
    name: 'Towing & Recovery',
    iconName: 'Truck',
    sampleVoicePrompt: 'Alex Kumar, vehicle broken down at Highway KM 14, flatbed towing to workshop 150, tire change assistance 50.',
    presets: [
      { id: 't1', category: 'towing', title: 'Flatbed Recovery Tow (Within 20km)', price: 150 },
      { id: 't2', category: 'towing', title: 'Underground Multi-Storey Rescue Tow', price: 220 },
      { id: 't3', category: 'towing', title: 'Roadside Jump Start / Battery Boost', price: 60 },
      { id: 't4', category: 'towing', title: 'Spare Tire Replacement On-Site', price: 50 },
    ],
  },
  beauty_salon: {
    name: 'Beauty, Nails & Spa',
    iconName: 'Sparkles',
    sampleVoicePrompt: 'Jessica, Gel manicure with nail art 85, express pedicure 45, organic eyelash extension 110.',
    presets: [
      { id: 'b1', category: 'beauty_salon', title: 'Express Gel Manicure & Cuticle Care', price: 65 },
      { id: 'b2', category: 'beauty_salon', title: 'Full Classic Pedicure & Callus Scrub', price: 55 },
      { id: 'b3', category: 'beauty_salon', title: 'Nail Extension & Custom 3D Art', price: 120 },
      { id: 'b4', category: 'beauty_salon', title: 'Deep Hydrating Facial Treatment', price: 140 },
    ],
  },
  pet_grooming: {
    name: 'Pet Grooming Services',
    iconName: 'Heart',
    sampleVoicePrompt: 'Chloe, Golden Retriever full wash deshedding and scissor cut 95, ear cleaning and nail clipping 30.',
    presets: [
      { id: 'pg1', category: 'pet_grooming', title: 'Full Dog Wash, Blow-dry & Styling', price: 85 },
      { id: 'pg2', category: 'pet_grooming', title: 'Cat Bath, De-shed & Lion Cut', price: 95 },
      { id: 'pg3', category: 'pet_grooming', title: 'Nail Trimming, Paw Pad Shave & Ear Clean', price: 30 },
      { id: 'pg4', category: 'pet_grooming', title: 'Medicated Skin Wash & Flea Treatment', price: 60 },
    ],
  },
  dentist: {
    name: 'Dental Care & Clinic',
    iconName: 'Smile',
    sampleVoicePrompt: 'Mr Roger, dental consultation scaling and polishing 120, composite tooth filling 90.',
    presets: [
      { id: 'd1', category: 'dentist', title: 'Consultation, Scaling & Airflow Polishing', price: 120 },
      { id: 'd2', category: 'dentist', title: 'Composite Tooth Coloured Filling (Per Tooth)', price: 95 },
      { id: 'd3', category: 'dentist', title: 'Digital Panoramic X-Ray Scan', price: 75 },
      { id: 'd4', category: 'dentist', title: 'In-Office Tooth Whitening Session', price: 350 },
    ],
  },
  other: {
    name: 'General Service & Trade',
    iconName: 'Briefcase',
    sampleVoicePrompt: 'Client Eric, on-site assessment inspection 80, emergency labor service 150.',
    presets: [
      { id: 'o1', category: 'other', title: 'Standard On-Site Callout & Diagnostic', price: 80 },
      { id: 'o2', category: 'other', title: 'Hourly Specialized Trade Labor', price: 90 },
      { id: 'o3', category: 'other', title: 'Materials Sourcing & Delivery', price: 50 },
      { id: 'o4', category: 'other', title: 'Emergency After-Hours Service Surcharge', price: 120 },
    ],
  },
};
