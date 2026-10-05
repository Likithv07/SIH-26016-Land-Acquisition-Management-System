import { SectorType, SectorInfo } from '../types';

export interface SectorMetric {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  statusColor?: string;
}

export interface SectorActionItem {
  id: string;
  title: string;
  urgency: 'critical' | 'high' | 'normal';
  category: string;
  detail: string;
  actionText: string;
}

export interface SectorConfig extends SectorInfo {
  heroTagline: string;
  iconName?: string;
  demoUsername: string;
  demoPassword: string;
  officerDesignation: string;
  primaryMetrics: SectorMetric[];
  actionItems: SectorActionItem[];
  keyHighlights: string[];
}

export const SECTORS_CONFIG: Record<SectorType, SectorConfig> = {
  highways: {
    id: 'highways',
    name: 'Highways & Road Transport',
    shortName: 'Highways',
    department: 'Ministry of Road Transport & Highways (MoRTH)',
    tagline: 'Continuous Right-of-Way (RoW) acquisition for Expressways and National Highway corridors under NH Act 1956 & RFCTLARR Act 2013.',
    heroTagline: 'Expediting 60-Meter RoW Clearances & Continuous Corridor Handovers',
    badge: 'NHAI / MoRTH',
    defaultUsername: 'officer.nhai@morth.gov.in',
    demoUsername: 'officer.nhai@morth.gov.in',
    demoPassword: 'Bhoomi#Highways2026',
    officerDesignation: 'Er. Sandeep Verma, Chief Project Officer (NHAI)',
    primaryMetrics: [
      {
        label: 'Right-of-Way (RoW) Cleared',
        value: '742.5 km / 890 km',
        subtext: '83.4% contiguous corridor ready for civil works',
        trend: '+24 km this month',
        statusColor: 'emerald',
      },
      {
        label: 'Statutory 3D Declarations',
        value: '42 Gazette Orders',
        subtext: 'Vestment of land free from all encumbrances',
        trend: '94% on schedule',
        statusColor: 'cyan',
      },
      {
        label: 'Critical Bottleneck Parcels',
        value: '7 Survey Plots',
        subtext: 'Stalling continuous road construction package',
        trend: '3 under High Court hearing',
        statusColor: 'amber',
      },
      {
        label: 'PFMS Direct Payout Disbursed',
        value: '₹1,420.8 Cr',
        subtext: '89.2% of sanctioned award deposited with CALA',
        trend: 'Zero intermediary delay',
        statusColor: 'emerald',
      },
    ],
    actionItems: [
      {
        id: 'HW-01',
        title: 'Section 3G Award Deposit for Chandauli Package',
        urgency: 'critical',
        category: 'Statutory Deposit',
        detail: 'Deposit ₹48.5 Cr in CALA escrow for immediate possession of 14 continuous km stretch.',
        actionText: 'Authorize Treasury Release',
      },
      {
        id: 'HW-02',
        title: 'Joint Forest Inspection for NH-65 Bypass',
        urgency: 'high',
        category: 'Environment & Forest',
        detail: 'Stage-1 compensatory afforestation clearance pending with DFO Nalgonda (18.4 hectares).',
        actionText: 'Review Joint Verification',
      },
      {
        id: 'HW-03',
        title: 'Concessionaire Handover Certificate (PKG-03)',
        urgency: 'normal',
        category: 'Civil Handover',
        detail: '80% continuous milestone reached; issue formal possession certificate to L&T Infra.',
        actionText: 'Generate Handover Certificate',
      },
    ],
    keyHighlights: [
      'Automated Section 3A to 3D Gazette notification mapping against DGPS survey coordinates',
      'Continuous linear corridor visualization identifying unacquired survey plot gaps',
      'Direct integration with PFMS and CALA (Competent Authority for Land Acquisition) accounts',
      'Real-time concessionaire encumbrance-free physical handover certification',
    ],
  },

  railways: {
    id: 'railways',
    name: 'Railways & High-Speed Corridors',
    shortName: 'Railways',
    department: 'Ministry of Railways & NHSRCL',
    tagline: 'Dedicated Freight Corridors (DFC), High-Speed Bullet Train track alignments, and Station Yard land acquisition under Railways Act 1989.',
    heroTagline: 'Precision Track Alignment Surveys & 30m Safety Buffer Demarcation',
    badge: 'IR / NHSRCL / DFCCIL',
    defaultUsername: 'dyce.railways@gov.in',
    demoUsername: 'dyce.railways@gov.in',
    demoPassword: 'Bhoomi#Railways2026',
    officerDesignation: 'Anil Mehra, Dy. Chief Engineer (Const.), Northern Railway',
    primaryMetrics: [
      {
        label: 'Track Alignment Acquired',
        value: '318 km / 360 km',
        subtext: '88.3% linear rail line possession completed',
        trend: '+12 km last fortnight',
        statusColor: 'emerald',
      },
      {
        label: 'Joint Measurement Surveys (JMS)',
        value: '1,840 / 1,950 Plots',
        subtext: 'Joint sign-off with Tehsildar & Railway engineers',
        trend: '94.3% signed off',
        statusColor: 'cyan',
      },
      {
        label: 'Track Safety Buffer (30m)',
        value: '91.2% Cleared',
        subtext: 'Clearance from track center-line for 160+ km/h operations',
        trend: '14 encroachments removed',
        statusColor: 'emerald',
      },
      {
        label: 'Traction Substation (TSS) Plots',
        value: '8 / 9 Sites Ready',
        subtext: '220kV/25kV electrical feeding substation parcels',
        trend: '1 under final award',
        statusColor: 'amber',
      },
    ],
    actionItems: [
      {
        id: 'RW-01',
        title: 'Sign-off on Palghar JMS Cadastral Sheets',
        urgency: 'critical',
        category: 'Joint Survey',
        detail: '14 village survey plots verified by Dy Collector; digital sign-off needed for Special Railway Project Gazette.',
        actionText: 'E-Sign Joint Survey Sheets',
      },
      {
        id: 'RW-02',
        title: 'Level Crossing 44 Elimination Plot Acquisition',
        urgency: 'high',
        category: 'Safety Zone',
        detail: 'Acquiring 0.85 acres for Road Over Bridge (ROB) approach ramps in Rohtak district.',
        actionText: 'Review Section 20A Notice',
      },
      {
        id: 'RW-03',
        title: 'DFCCIL Yard Remodeling Parcel Transfer',
        urgency: 'normal',
        category: 'Inter-agency Transfer',
        detail: 'Transfer of 4.2 acres state revenue land to Dedicated Freight Corridor Corporation.',
        actionText: 'Process Mutation Order',
      },
    ],
    keyHighlights: [
      'Automated 30m / 50m track buffer calculation from rail center-line coordinates',
      'Joint Measurement Survey (JMS) digital co-signing by Revenue Tehsildar & Railway Engineer',
      'Special Railway Project Gazette notifications under Chapter IVA of Railways Act',
      'Dedicated tracking for Traction Substations, Overbridges (ROB/RUB), and Yard loops',
    ],
  },

  power: {
    id: 'power',
    name: 'Energy, Power & Transmission',
    shortName: 'Power & Grid',
    department: 'Ministry of Power & PowerGrid Corporation of India',
    tagline: 'Tower footing base acquisitions, 765kV/400kV line-stringing corridor Right-of-Way, and Grid Substation land assembly.',
    heroTagline: 'Tower Footing Demarcation & Diminution of Land Value Compensation',
    badge: 'PowerGrid / NTPC / Discoms',
    defaultUsername: 'gm.powergrid@pgcil.in',
    demoUsername: 'gm.powergrid@pgcil.in',
    demoPassword: 'Bhoomi#PowerGrid2026',
    officerDesignation: 'P. K. Sharma, General Manager (Land & RoW), PowerGrid',
    primaryMetrics: [
      {
        label: 'Tower Footings Acquired',
        value: '1,420 / 1,480 Towers',
        subtext: 'Permanent base plots (400 sq.m each) possessed',
        trend: '95.9% tower foundations ready',
        statusColor: 'emerald',
      },
      {
        label: 'Line Corridor RoW Easement',
        value: '412 km Stringing',
        subtext: '46m width Right-of-Way clearance under Indian Telegraph Act',
        trend: '+18 km cleared',
        statusColor: 'cyan',
      },
      {
        label: 'Crop & Tree Diminution Award',
        value: '₹84.6 Cr Paid',
        subtext: 'Direct compensation for tree felling & agricultural yield loss',
        trend: '100% via DBT',
        statusColor: 'emerald',
      },
      {
        label: 'Forest Rights Act (FRA) Clearances',
        value: '38 Gram Sabhas',
        subtext: 'No-objection resolutions secured for Green Energy Corridor',
        trend: '2 resolutions pending',
        statusColor: 'amber',
      },
    ],
    actionItems: [
      {
        id: 'PW-01',
        title: 'Tower #142 to #146 Stringing RoW Settlement',
        urgency: 'critical',
        category: 'RoW Settlement',
        detail: 'Landowners demanding reassessment of horticulture mango grove diminution compensation.',
        actionText: 'Recalculate Diminution Award',
      },
      {
        id: 'PW-02',
        title: '765kV Wardha Substation 40-Acre Possession',
        urgency: 'high',
        category: 'Substation Assembly',
        detail: 'Contiguous parcel boundary fencing scheduled; revenue patwari demarcation complete.',
        actionText: 'Confirm Physical Handover',
      },
      {
        id: 'PW-03',
        title: 'Crop Damage Assessment Report (Kharif Season)',
        urgency: 'normal',
        category: 'Crop Damage',
        detail: 'Agriculture officer verified 28 farmers affected by heavy equipment movement.',
        actionText: 'Approve Compensation Batch',
      },
    ],
    keyHighlights: [
      'Dual acquisition logic: Outright purchase for Tower Footings vs Easement rights for Wire Corridor',
      'Automated Tree & Crop Diminution calculation under MoP 2016 guidelines (85% + 15% rate)',
      'Substation 50-to-100 acre contiguous plot pooling & GIS slope/contour analysis',
      'Direct integration with Forest Rights Act (FRA) Gram Sabha resolution repository',
    ],
  },

  urban: {
    id: 'urban',
    name: 'Urban Development & Industrial Corridors',
    shortName: 'Urban & Industrial',
    department: 'National Industrial Corridor Development Corp (NICDC) / Smart Cities',
    tagline: 'Land pooling, Town Planning Schemes (TPS), industrial mega-node assembly, and municipal infrastructure rights-of-way.',
    heroTagline: 'Land Pooling Reconstitution & Industrial Plot Demarcation for Global Investors',
    badge: 'NICDC / Smart Cities / Metro',
    defaultUsername: 'ceo.dmic@nicdc.in',
    demoUsername: 'ceo.dmic@nicdc.in',
    demoPassword: 'Bhoomi#Urban2026',
    officerDesignation: 'Sunita Deshmukh, IAS, CEO & Managing Director (Industrial Corridor)',
    primaryMetrics: [
      {
        label: 'Industrial Land Assembled',
        value: '6,290 / 7,500 Acres',
        subtext: '83.8% contiguous mega-node assembled',
        trend: '+320 acres in Q3',
        statusColor: 'emerald',
      },
      {
        label: 'Land Pooling (TPS) Reconstituted',
        value: '4,100 Plots',
        subtext: '50% returnable developed commercial/residential plots',
        trend: '92% farmer consent',
        statusColor: 'cyan',
      },
      {
        label: 'Plug-and-Play Plots Ready',
        value: '142 Industrial Plots',
        subtext: 'With water, power, and road access for immediate allotment',
        trend: '48 allotted to anchor units',
        statusColor: 'emerald',
      },
      {
        label: 'R&R Smart Township Housing',
        value: '1,280 / 1,400 Units',
        subtext: 'Multi-story modern rehabilitation apartments handed over',
        trend: '91.4% families moved',
        statusColor: 'emerald',
      },
    ],
    actionItems: [
      {
        id: 'UR-01',
        title: 'Town Planning Scheme 4 Final Sanction',
        urgency: 'critical',
        category: 'Town Planning',
        detail: 'Draft scheme objections heard by Arbitrator; send final layout to Urban Development Dept.',
        actionText: 'Submit Final TPS Layout',
      },
      {
        id: 'UR-02',
        title: 'Mega Solar Component Manufacturer Plot Allotment',
        urgency: 'high',
        category: 'Plot Demarcation',
        detail: '120-acre contiguous plot demarcated with underground utility trunk connection.',
        actionText: 'Issue Allotment Letter',
      },
      {
        id: 'UR-03',
        title: 'Phase-2 Metro Depot 28-Acre Vesting Order',
        urgency: 'normal',
        category: 'Public Transit',
        detail: 'Transfer municipal barren lands to Metro Rail Corporation for train stabling lines.',
        actionText: 'Execute Transfer Deed',
      },
    ],
    keyHighlights: [
      'Equitable Land Pooling model: Farmers receive 50% reconstituted high-value urban plots',
      'GIS parcel subdivision generating clean investor leasehold plot registry with utility lines',
      'Comprehensive Resettlement & Rehabilitation (R&R) housing allotment with biometric tracking',
      'Automated Change of Land Use (CLU) clearance and Master Plan zoning compliance checks',
    ],
  },

  revenue: {
    id: 'revenue',
    name: 'State Revenue & District Administration',
    shortName: 'District Collector / LAO',
    department: 'Department of Revenue & Disaster Management, State Governments',
    tagline: 'Statutory Section 19 lapsing watchdogs, Khasra mutation, Record of Rights (RoR), and Award declaration under RFCTLARR Act 2013.',
    heroTagline: 'Statutory Section 19 Watchdog, Award Determination & Khasra Mutations',
    badge: 'District Collector / CALA',
    defaultUsername: 'collector.district@gov.in',
    demoUsername: 'collector.district@gov.in',
    demoPassword: 'Bhoomi#Revenue2026',
    officerDesignation: 'Ravi Kumar, IAS, District Collector & Arbitrator',
    primaryMetrics: [
      {
        label: 'Section 19 SLA Watchdog',
        value: '0 Lapsed Notices',
        subtext: 'All 18 projects on track within 12-month statutory deadline',
        trend: 'Strict compliance maintained',
        statusColor: 'emerald',
      },
      {
        label: 'Khasra Title Deeds Verified',
        value: '4,892 / 5,120 Deeds',
        subtext: 'Tehsildar mutation and encumbrance search completed',
        trend: '95.5% certified',
        statusColor: 'cyan',
      },
      {
        label: 'Statutory Awards Signed (DSC)',
        value: '₹3,410 Cr Total Value',
        subtext: 'Signed using Class-3 Government Digital Signature Certificates',
        trend: '100% Solatium verified',
        statusColor: 'emerald',
      },
      {
        label: 'Section 15 Objections Resolved',
        value: '412 / 438 Hearings',
        subtext: 'Public hearing objections addressed and formally recorded',
        trend: '26 pending hearings',
        statusColor: 'amber',
      },
    ],
    actionItems: [
      {
        id: 'RV-01',
        title: 'Section 19 Deadline in 22 Days (NLA-TS-2026-001)',
        urgency: 'critical',
        category: 'Statutory Compliance',
        detail: 'Declaration was issued on 2024-11-04; award must be published before lapse date to prevent nullification.',
        actionText: 'Execute Collector Award Order',
      },
      {
        id: 'RV-02',
        title: 'Disputed Khasra #142/2A Inheritance Hearing',
        urgency: 'high',
        category: 'Title Adjudication',
        detail: 'Three legal heirs submitted conflicting legal heir certificates; hearing scheduled in Collectorate.',
        actionText: 'View Case Documents',
      },
      {
        id: 'RV-03',
        title: 'Disburse Village Shivampet Compensation Batch #12',
        urgency: 'normal',
        category: 'PFMS Release',
        detail: '48 farmers with verified bank accounts; total batch amount ₹18.42 Cr ready for digital release.',
        actionText: 'Authorize Bank Batch',
      },
    ],
    keyHighlights: [
      'Automated 12-month statutory timer alerts under Section 19 of RFCTLARR Act 2013',
      'Multi-factor statutory award calculator: (Base Market Rate × Multiplier) + 100% Solatium + 12% Interest',
      'Integration with State Land Records (Bhoomi, Dharani, AnyROR, Bhulekh) for real-time mutations',
      'Cryptographic Class-3 DSC digital signing ensuring tamper-evident gazette publication',
    ],
  },

  citizen: {
    id: 'citizen',
    name: 'Citizen & Landowner Portal',
    shortName: 'Citizen Portal',
    department: 'Public Transparency & Direct Benefit Transfer Wing',
    tagline: 'Self-service portal for farmers and landowners to view survey demarcation, inspect certified compensation awards, and eSign consent.',
    heroTagline: '100% Transparency in Land Valuation, Solatium & Direct Bank Deposit',
    badge: 'Citizen / Landowner',
    defaultUsername: 'citizen.rajesh@gmail.com',
    demoUsername: 'citizen.rajesh@gmail.com',
    demoPassword: 'Bhoomi#Citizen2026',
    officerDesignation: 'Rajesh Kumar, Landowner (Survey Plot #145/2)',
    primaryMetrics: [
      {
        label: 'My Notified Land Area',
        value: '1.75 Acres',
        subtext: 'Survey No. 145/2, Village Shivampet, Nalgonda',
        trend: 'Acquisition Section 3D gazetted',
        statusColor: 'cyan',
      },
      {
        label: 'Certified Compensation Award',
        value: '₹72,25,000',
        subtext: 'Includes 100% Solatium (₹33.75L) & Asset Valuation',
        trend: 'Highest circle rate applied',
        statusColor: 'emerald',
      },
      {
        label: 'Bank Direct Deposit (DBT)',
        value: 'Ready for Release',
        subtext: 'State Bank of India (A/C: •••• 4091) linked via Aadhaar',
        trend: 'PFMS pre-validated',
        statusColor: 'emerald',
      },
      {
        label: 'eSign Consent & Possession',
        value: 'Pending Your Sign',
        subtext: 'Digital consent enables immediate 100% payment release',
        trend: 'One-click Aadhaar OTP',
        statusColor: 'amber',
      },
    ],
    actionItems: [
      {
        id: 'CZ-01',
        title: 'Review Certified Statutory Award Calculation Sheet',
        urgency: 'high',
        category: 'Compensation Verification',
        detail: 'Examine detailed breakdown of base land value, 1.5x rural multiplier, 100% solatium, and tree valuations.',
        actionText: 'View Detailed Breakdown',
      },
      {
        id: 'CZ-02',
        title: 'Aadhaar eSign Consent for Direct Bank Credit',
        urgency: 'critical',
        category: 'Digital Consent',
        detail: 'Digitally accept the award order to trigger immediate treasury credit of ₹72,25,000 into your SBI account.',
        actionText: 'eSign Award Agreement',
      },
      {
        id: 'CZ-03',
        title: 'Download Certified Survey Map & Possession Receipt',
        urgency: 'normal',
        category: 'Legal Documents',
        detail: 'Download QR-coded certified map copy and digital compensation certificate for your records.',
        actionText: 'Download Document Vault',
      },
    ],
    keyHighlights: [
      'Zero paper visits: View the exact survey boundary demarcated on high-resolution satellite imagery',
      'Transparent mathematical breakdown: See the basic rate, multiplier, solatium, and tree valuations clearly',
      'Direct treasury deposit via PFMS directly to your bank account with zero middleman deductions',
      'Dedicated grievance submission with guaranteed response SLA by District Collectorate',
    ],
  },

  field_officer: {
    id: 'field_officer',
    name: 'Field Verification & Survey Unit',
    shortName: 'Field Officer',
    department: 'Directorate of Survey, Settlement & Land Records',
    tagline: 'On-ground cadastral verification, DGPS coordinate recording, boundary pegging, and geo-tagged photographic evidence.',
    heroTagline: 'DGPS Boundary Marking, Crop & Structure Inspection & Geo-Tagged Evidence',
    badge: 'Field Survey Unit / DGPS',
    defaultUsername: 'field.officer@bhoomi.gov.in',
    demoUsername: 'field.officer@bhoomi.gov.in',
    demoPassword: 'Bhoomi#Field2026',
    officerDesignation: 'Vikramaditya Rao, Senior Field Officer & Cadastral Surveyor',
    primaryMetrics: [
      {
        label: 'Field Parcels Verified',
        value: '482 / 520 Plots',
        subtext: '92.7% on-ground survey completed',
        trend: '+28 plots this week',
        statusColor: 'emerald',
      },
      {
        label: 'Geo-Tagged Photographs',
        value: '1,420 Uploads',
        subtext: 'Differential GPS RTK locked with sub-meter accuracy',
        trend: '100% anti-tamper hashed',
        statusColor: 'cyan',
      },
      {
        label: 'Pending Field Inspections',
        value: '14 Assignments',
        subtext: 'Scheduled for joint verification with revenue patwari',
        trend: '3 priority highway plots',
        statusColor: 'amber',
      },
      {
        label: 'Landowner Biometric Consents',
        value: '412 Verified',
        subtext: 'Aadhaar eSign & spot sign-off authenticated',
        trend: 'Zero dispute rate',
        statusColor: 'emerald',
      },
    ],
    actionItems: [
      {
        id: 'FO-01',
        title: 'Survey & DGPS Pegging for Sy. 146/1 (Ghatkesar)',
        urgency: 'critical',
        category: 'Boundary Pegging',
        detail: 'Demarcate northern boundary stone and verify commercial structure frontage with landowner present.',
        actionText: 'Start DGPS Pegging',
      },
      {
        id: 'FO-02',
        title: 'Upload Geo-Tagged Inspection Photos for Sy. 150/3',
        urgency: 'high',
        category: 'Evidence Capture',
        detail: 'Capture 4-corner boundary pillars and upload RTK geo-tagged photographs to Cadastral Database.',
        actionText: 'Upload Field Photos',
      },
      {
        id: 'FO-03',
        title: 'Joint Boundary Verification with Revenue Patwari for Sy. 148/A',
        urgency: 'normal',
        category: 'Joint Inspection',
        detail: 'Re-verify western boundary peg overlap objection with original 1974 village cadastral sheet.',
        actionText: 'Conduct Joint Survey',
      },
    ],
    keyHighlights: [
      'Sub-meter RTK GPS and NavIC satellite coordinate locking directly tied to survey markers',
      'Real-time camera geo-tagging with automated cryptographic anti-tamper checksums',
      'Mobile field verification suite integrated directly with Central Cadastral Geodatabase',
      'On-the-spot landowner consent verification, biometric eSign, and QR stamping',
    ],
  },
};
