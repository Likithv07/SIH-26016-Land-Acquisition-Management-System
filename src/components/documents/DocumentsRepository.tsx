import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FieldDocument, UserRole } from '../../types';
import {
  FileText,
  Search,
  UploadCloud,
  Download,
  Eye,
  ShieldCheck,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  Lock,
  FileCheck,
  Award,
  CreditCard,
  Building,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  FolderLock,
  Compass,
} from 'lucide-react';

export interface RepoDocument {
  id: string;
  title: string;
  category: string;
  parcelOrProject: string;
  parcelId?: string;
  date: string;
  size: string;
  verified: boolean;
  hash: string;
  source: 'statutory' | 'field' | 'citizen' | 'government';
  isGovernmentOnly: boolean; // TRUE for government gazettes, administrative resolutions, ministry memos
  fileType: string;
  documentType:
    | 'land_approval'
    | 'compensation_report'
    | 'application_report'
    | 'consent_undertaking'
    | 'title_deed'
    | 'citizen_proof'
    | 'government_gazette'
    | 'government_resolution'
    | 'field_survey';
  description?: string;
  recipientName?: string;
  issuingAuthority?: string;
  metadata?: {
    surveyNumber?: string;
    awardAmount?: string;
    statusNote?: string;
    approvalRef?: string;
  };
}

export const DocumentsRepository: React.FC = () => {
  const {
    userRole,
    loggedInUser,
    selectedParcelId,
    setSelectedParcelId,
    landParcels,
    fieldDocuments,
    addFieldDocument,
    showToast,
    loginAsRole,
  } = useApp();

  const isCitizen = userRole === 'citizen';

  // Identify citizen's parcel
  const citizenParcel =
    landParcels.find((p) => p.id === selectedParcelId) || landParcels[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<RepoDocument | null>(null);

  // Upload form states
  const [uploadTitle, setUploadTitle] = useState('');
  const [citizenUploadCategory, setCitizenUploadCategory] = useState<string>('Pahani / Title Deed Copy');
  const [govUploadCategory, setGovUploadCategory] = useState<FieldDocument['category']>('Title Deed');
  const [uploadParcelId, setUploadParcelId] = useState(citizenParcel?.id || landParcels[0]?.id || 'TS-HYD-2026-001245');
  const [uploadFileName, setUploadFileName] = useState('');

  // 1. STATUTORY GOVERNMENT-ONLY DOCUMENTS (Exclusively visible to Government Officers; strictly blocked for citizens)
  const governmentOnlyDocuments: RepoDocument[] = [
    {
      id: 'DOC-GOV-GAZ-01',
      title: 'Gazette Notification Section 3D (Declaration of Acquisition) - NH-65 Corridor',
      category: 'Gazette',
      parcelOrProject: 'NLA-TS-2026-001 (NH-65 Highway Corridor)',
      date: '02 Mar 2026',
      size: '3.8 MB',
      verified: true,
      hash: 'sha256: 7f8a192bc93214589dfbe76a1004cd821a81...',
      source: 'government',
      isGovernmentOnly: true,
      fileType: 'pdf',
      documentType: 'government_gazette',
      issuingAuthority: 'Ministry of Road Transport & Highways (MoRTH)',
      description: 'Official Extraordinary Gazette Notification declaring vesting of 480 hectares for national highway corridor expansion.',
    },
    {
      id: 'DOC-GOV-SIA-01',
      title: 'Gram Sabha Public Consultation Resolution & SIA Approval - Ghatkesar Mandal',
      category: 'SIA & Consent',
      parcelOrProject: 'Ghatkesar Revenue Mandal Secretariat',
      date: '15 Feb 2026',
      size: '2.1 MB',
      verified: true,
      hash: 'sha256: b892019488a01fe8399120bc7102948192a8...',
      source: 'government',
      isGovernmentOnly: true,
      fileType: 'pdf',
      documentType: 'government_resolution',
      issuingAuthority: 'District Collectorate & SIA Evaluation Authority',
      description: 'Administrative consensus minutes and Social Impact Assessment committee clearance for corridor construction.',
    },
    {
      id: 'DOC-GOV-MOEF-01',
      title: 'Inter-Departmental Forest & Environmental Clearance Sanction Order',
      category: 'Statutory Clearances',
      parcelOrProject: 'NLA-TS-2026-001 (Forest Division Zone 3)',
      date: '22 Jan 2026',
      size: '4.5 MB',
      verified: true,
      hash: 'sha256: 92fa88301ecbe2918827361a990234ac81...',
      source: 'government',
      isGovernmentOnly: true,
      fileType: 'pdf',
      documentType: 'government_resolution',
      issuingAuthority: 'Ministry of Environment, Forest and Climate Change',
      description: 'Stage-II forest diversion clearance and compensatory afforestation scheme approval.',
    },
    {
      id: 'DOC-GOV-SANCT-01',
      title: 'State Land Acquisition Administrative Financial Sanction (G.O. Ms. No. 42/2026)',
      category: 'Financial Sanctions',
      parcelOrProject: 'NLA-TS-2026-001 (Corridor Treasury Fund)',
      date: '10 Jan 2026',
      size: '1.9 MB',
      verified: true,
      hash: 'sha256: cc491823901bca77291841029481924719...',
      source: 'government',
      isGovernmentOnly: true,
      fileType: 'pdf',
      documentType: 'government_resolution',
      issuingAuthority: 'State Revenue & Finance Department',
      description: 'Budgetary release of ₹450.00 Crores towards CALA escrow for project land compensation disbursement.',
    },
    {
      id: 'DOC-GOV-DPR-01',
      title: 'Detailed Project Alignment Report (DPR) & Complete Land Schedule Dossier',
      category: 'Engineering & DPR',
      parcelOrProject: 'NLA-TS-2026-001 (NHAI Regional Office)',
      date: '05 Jan 2026',
      size: '18.4 MB',
      verified: true,
      hash: 'sha256: 310948ac01928471928bcfe918294719bbac...',
      source: 'government',
      isGovernmentOnly: true,
      fileType: 'pdf',
      documentType: 'government_gazette',
      issuingAuthority: 'National Highways Authority of India (NHAI)',
      description: 'Technical alignment schematics, chainage geometry, and composite survey plot schedules.',
    },
    // Another citizen's private file (Sita Devi - Sy 146/1) - visible to government, but restricted from Rajesh Kumar!
    {
      id: 'DOC-SITA-16C',
      title: 'Form 16-C Statutory Compensation Award Certificate (Sita Devi)',
      category: 'Valuation',
      parcelOrProject: 'TS-HYD-2026-001246 (Sy 146/1 - Sita Devi)',
      parcelId: 'TS-HYD-2026-001246',
      date: '04 Mar 2026',
      size: '2.1 MB',
      verified: true,
      hash: 'sha256: 88129481924719bbac902194881726a88201...',
      source: 'statutory',
      isGovernmentOnly: false,
      fileType: 'pdf',
      documentType: 'compensation_report',
      recipientName: 'Sita Devi Sharma',
      issuingAuthority: 'Competent Authority for Land Acquisition (CALA)',
      description: 'Private statutory compensation determination for Survey 146/1.',
    },
  ];

  // 2. CITIZEN-SPECIFIC OFFICIAL DOCUMENTS
  // Tailored specifically to the citizen: Land Approvals, Compensation Reports, Application Process Reports, Consent Deeds
  const getCitizenDocuments = (parcel: typeof citizenParcel): RepoDocument[] => {
    const totalCompStr = `₹${(parcel.totalCompensation || parcel.compensation?.totalCompensation || 7225000).toLocaleString('en-IN')}`;
    const baseLandVal = parcel.compensation?.baseCompensation || 6250000;
    const solatiumVal = parcel.compensation?.solatium || 625000;
    const assetVal = parcel.compensation?.additionalBenefits || 200000;
    const rrVal = parcel.compensation?.rrAssistance || 150000;

    return [
      // 1. LAND APPROVALS
      {
        id: `DOC-LA-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Land Acquisition Approval & Demarcation Certificate (Form 11-A)`,
        category: 'Land Approval',
        parcelOrProject: `${parcel.id} (Sy ${parcel.surveyNumber})`,
        parcelId: parcel.id,
        date: '08 Mar 2026',
        size: '1.8 MB',
        verified: true,
        hash: `sha256: 7a82f912bc44901928471928371948192a81...`,
        source: 'statutory',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'land_approval',
        recipientName: parcel.landownerName,
        issuingAuthority: 'Competent Authority for Land Acquisition (CALA)',
        description: `Statutory approval issued under Section 19 of RFCTLARR Act 2013 formally approving the acquisition of ${parcel.areaAcres} Acres of ${parcel.landType} land with verified boundary pegs and clean title clearance for ${parcel.projectName}.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          statusNote: 'Approved & Sealed by District Collector',
          approvalRef: `CALA/REV/2026/F11A-${parcel.surveyNumber.replace(/\//g, '')}`,
        },
      },
      {
        id: `DOC-FMB-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Cadastral Boundary Demarcation & FMB Sketch Order (BP-01 to BP-04)`,
        category: 'Land Approval',
        parcelOrProject: `${parcel.id} (Sy ${parcel.surveyNumber} - ${parcel.village})`,
        parcelId: parcel.id,
        date: '28 Feb 2026',
        size: '3.2 MB',
        verified: true,
        hash: `sha256: 3c9148bc902194881726a88201924719bbac...`,
        source: 'statutory',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'land_approval',
        recipientName: parcel.landownerName,
        issuingAuthority: 'Directorate of Survey, Settlement & Land Records',
        description: `Certified sub-meter RTK DGPS boundary sketch confirming non-overlapping perimeter, corner peggings (BP-01, BP-02, BP-03, BP-04), and exact extent demarcation of ${parcel.areaAcres} Acres.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          statusNote: 'Boundary Pegs Demarcated on Ground',
          approvalRef: `SSL/FMB/2026/${parcel.village.toUpperCase()}/${parcel.surveyNumber.replace(/\//g, '-')}`,
        },
      },

      // 2. COMPENSATION REPORTS
      {
        id: `DOC-16C-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Form 16-C Statutory Compensation Award Certificate (${totalCompStr})`,
        category: 'Compensation Report',
        parcelOrProject: `${parcel.id} (Total Award: ${totalCompStr})`,
        parcelId: parcel.id,
        date: '08 Mar 2026',
        size: '2.4 MB',
        verified: true,
        hash: `sha256: 419208aefd882194bbce10992381fca99021...`,
        source: 'statutory',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'compensation_report',
        recipientName: parcel.landownerName,
        issuingAuthority: 'Collector & District Magistrate, Hyderabad',
        description: `Official statutory award determining comprehensive entitlement under RFCTLARR Act 2013: Basic Land Value (₹${baseLandVal.toLocaleString('en-IN')}) + 100% Solatium (₹${solatiumVal.toLocaleString('en-IN')}) + Immovable Assets (₹${assetVal.toLocaleString('en-IN')}) + R&R Allowance (₹${rrVal.toLocaleString('en-IN')}).`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          awardAmount: totalCompStr,
          statusNote: parcel.compensationStatus === 'Approved' ? 'Ready for Electronic DBT Transfer' : 'Under Officer Verification',
          approvalRef: `CALA/AWD/2026/16C-${parcel.id.replace(/-/g, '')}`,
        },
      },
      {
        id: `DOC-VAL-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Immovable Asset Valuation & Horticultural Tree Assessment Report`,
        category: 'Compensation Report',
        parcelOrProject: `${parcel.id} (Trees, Borewell & Structures)`,
        parcelId: parcel.id,
        date: '26 Feb 2026',
        size: '1.9 MB',
        verified: true,
        hash: `sha256: d82914881726a88201924719bbac90219488...`,
        source: 'statutory',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'compensation_report',
        recipientName: parcel.landownerName,
        issuingAuthority: 'Joint Valuation Committee (PWD Roads & Horticulture)',
        description: `Itemized valuation of on-site structures and trees: 14 Mature Teak trees (₹1,20,000), 1 Deep Submersible Borewell (₹65,000), and micro-irrigation pipeline (₹15,000), total asset appraisal ₹${assetVal.toLocaleString('en-IN')}.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          awardAmount: `₹${assetVal.toLocaleString('en-IN')}`,
          statusNote: 'Joint Inspection Approved',
          approvalRef: `JVC/HORT-PWD/2026/VAL-${parcel.surveyNumber.replace(/\//g, '')}`,
        },
      },
      {
        id: `DOC-DBT-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `PFMS Direct Benefit Transfer (DBT) Disbursal & Mandate Advice`,
        category: 'Compensation Report',
        parcelOrProject: `${parcel.id} (Bank Mandate •••4892)`,
        parcelId: parcel.id,
        date: '10 Mar 2026',
        size: '890 KB',
        verified: true,
        hash: `sha256: 18294719bbac902194881726a88201924719...`,
        source: 'statutory',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'compensation_report',
        recipientName: parcel.landownerName,
        issuingAuthority: 'Public Financial Management System (PFMS), Ministry of Finance',
        description: `Electronic treasury disbursement mandate authorized to ${parcel.maskedBankAccount || 'State Bank of India (•••4892)'} under Token ID PFMS-GOI-2026-88194 for ${totalCompStr}.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          awardAmount: totalCompStr,
          statusNote: 'Authorized for Instant Credit',
          approvalRef: `PFMS-GOI-2026-88194`,
        },
      },

      // 3. APPLICATION PROCESS REPORTS
      {
        id: `DOC-APP-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Land Acquisition Application & Lifecycle Processing Status Report`,
        category: 'Application Process Report',
        parcelOrProject: `${parcel.id} (Application Dossier)`,
        parcelId: parcel.id,
        date: '12 Mar 2026',
        size: '2.1 MB',
        verified: true,
        hash: `sha256: ea91823901ba8892ca8817263bba01928371...`,
        source: 'statutory',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'application_report',
        recipientName: parcel.landownerName,
        issuingAuthority: 'BhoomiSetu National Land Portal System',
        description: `Consolidated lifecycle milestone tracking docket for Shri ${parcel.landownerName}: DPR Alignment -> Section 3A preliminary publication -> Joint DGPS Demarcation -> Section 3D declaration -> Claim inquiry closure -> Compensation award declaration -> Possession schedule.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          statusNote: 'Stage 5/7 Completed (Compensation Approved)',
          approvalRef: `BHM-APP-2026-${parcel.surveyNumber.replace(/\//g, '-')}`,
        },
      },
      {
        id: `DOC-JMVR-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Joint Measurement Verification Record (JMVR) Spot Inspection Report`,
        category: 'Application Process Report',
        parcelOrProject: `${parcel.id} (Field JMVR Inspection)`,
        parcelId: parcel.id,
        date: '18 Feb 2026',
        size: '3.5 MB',
        verified: true,
        hash: `sha256: 0x8f3a992b4510cdfa21b764e9a112048cf7a...`,
        source: 'field',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'application_report',
        recipientName: parcel.landownerName,
        issuingAuthority: 'Revenue Inspector & Mandal Surveyor',
        description: `On-ground physical survey docket counter-signed by Field Surveyor Vikramaditya Rao, Village Revenue Officer, and Landowner Shri ${parcel.landownerName} certifying boundary benchmarks and crop status.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          statusNote: 'Joint Inspection Signed',
          approvalRef: `JMVR-REV-2026-${parcel.surveyNumber.replace(/\//g, '')}`,
        },
      },

      // 4. CONSENT & TITLE DEEDS
      {
        id: `DOC-CS-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Signed Form-C Voluntary Acquisition Consent Undertaking (Aadhaar eSigned)`,
        category: 'Consent & Title',
        parcelOrProject: `${parcel.id} (eSign Verified Form 8-A)`,
        parcelId: parcel.id,
        date: '08 Mar 2026',
        size: '950 KB',
        verified: true,
        hash: `sha256: 0xaa782e449910d5ec8912ba0091ff654101e...`,
        source: 'citizen',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'consent_undertaking',
        recipientName: parcel.landownerName,
        issuingAuthority: 'UIDAI / CDAC Aadhaar eSign Authority',
        description: `Digitally executed and immutable consent deed executed under Section 4 of IT Act 2000 and Section 11 of RFCTLARR Act with biometric Aadhaar OTP verification.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          statusNote: parcel.consentReceived ? 'Legally Executed & Recorded' : 'Consent Undertaking Draft (Ready to eSign)',
          approvalRef: `UIDAI-ESIGN-2026-${parcel.id.substring(parcel.id.length - 6)}`,
        },
      },
      {
        id: `DOC-ROR-${parcel.surveyNumber.replace(/\//g, '-')}`,
        title: `Certified Record of Rights (Pahani / 1-B Dharani Revenue Extract)`,
        category: 'Consent & Title',
        parcelOrProject: `${parcel.id} (Khata No. 842 - Sy ${parcel.surveyNumber})`,
        parcelId: parcel.id,
        date: '14 Jan 2026',
        size: '1.6 MB',
        verified: true,
        hash: `sha256: 0x1c44bb82a7ef8193021e54bc9980d21e889...`,
        source: 'statutory',
        isGovernmentOnly: false,
        fileType: 'pdf',
        documentType: 'title_deed',
        recipientName: parcel.landownerName,
        issuingAuthority: 'Dharani Integrated Land Records Management System',
        description: `Certified revenue title certificate evidencing undisputed ancestral ownership of Shri ${parcel.landownerName} over Survey Number ${parcel.surveyNumber} with nil civil or financial encumbrances.`,
        metadata: {
          surveyNumber: parcel.surveyNumber,
          statusNote: 'Clear Ancestral Title Verified',
          approvalRef: `DHARANI-1B-2026-${parcel.surveyNumber.replace(/\//g, '')}`,
        },
      },
    ];
  };

  // Convert dynamic fieldDocuments from AppContext into RepoDocument format
  const dynamicFieldDocs: RepoDocument[] = fieldDocuments.map((fd) => {
    // If uploaded by citizen or has citizen proof category
    const isCitizenDoc =
      fd.uploadedBy.toLowerCase().includes('landowner') ||
      fd.uploadedBy.toLowerCase().includes('citizen') ||
      fd.category === 'Ownership Document' ||
      fd.category === 'Consent Form';

    return {
      id: fd.id,
      title: fd.title,
      category: isCitizen
        ? fd.category === 'Ownership Document'
          ? 'Consent & Title'
          : fd.category === 'Consent Form'
          ? 'Consent & Title'
          : 'My Uploaded Proofs'
        : fd.category,
      parcelOrProject: fd.parcelId,
      parcelId: fd.parcelId,
      date: fd.uploadDate,
      size: fd.fileSize,
      verified: fd.status === 'Verified',
      hash: fd.documentHash ? `sha256: ${fd.documentHash}` : 'sha256: 3c9148...',
      source: isCitizenDoc ? 'citizen' : 'field',
      isGovernmentOnly: false,
      fileType: fd.fileType || 'pdf',
      documentType: isCitizenDoc ? 'citizen_proof' : 'field_survey',
      description: `Uploaded record for parcel ${fd.parcelId} by ${fd.uploadedBy}.`,
      issuingAuthority: fd.uploadedBy,
    };
  });

  // Calculate document collection based on active role
  let allDocuments: RepoDocument[] = [];

  if (isCitizen) {
    // CITIZEN MODE:
    // 1. STRICTLY EXCLUDE all government-only documents (Gazettes, SIA Mandals, Clearances, DPRs).
    // 2. STRICTLY EXCLUDE other citizens' confidential records.
    // 3. SHOW ONLY documents related to the citizen: Land Approvals, Compensation Reports, Application Process Reports, Consent/Title, and Citizen Uploaded Proofs.
    const citizenDocs = getCitizenDocuments(citizenParcel);
    const relevantDynamicDocs = dynamicFieldDocs.filter(
      (doc) => doc.parcelId === citizenParcel.id
    );

    // Merge citizen docs and uploaded proofs
    allDocuments = [...citizenDocs, ...relevantDynamicDocs];
  } else {
    // GOVERNMENT OFFICER / ADMIN / STATE / CENTRAL MODE:
    // Full administrative access to:
    // - Government Gazettes, Clearances, Resolutions
    // - All parcels' Land Approvals, Compensation Awards, and Application reports
    // - All Field surveys and uploaded records
    const allParcelsCitizenDocs = landParcels.flatMap((p) => getCitizenDocuments(p));
    allDocuments = [
      ...governmentOnlyDocuments,
      ...allParcelsCitizenDocs,
      ...dynamicFieldDocs,
    ];
  }

  // Filter documents by search and category
  const filteredDocs = allDocuments.filter((doc) => {
    // Basic search match
    const matchSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.parcelOrProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.issuingAuthority && doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category match
    let matchCat = true;
    if (selectedCategory !== 'ALL') {
      if (isCitizen) {
        if (selectedCategory === 'Land Approvals') {
          matchCat = doc.category === 'Land Approval' || doc.documentType === 'land_approval';
        } else if (selectedCategory === 'Compensation Reports') {
          matchCat = doc.category === 'Compensation Report' || doc.documentType === 'compensation_report';
        } else if (selectedCategory === 'Application Process') {
          matchCat = doc.category === 'Application Process Report' || doc.documentType === 'application_report';
        } else if (selectedCategory === 'Consent & Title') {
          matchCat = doc.category === 'Consent & Title' || doc.documentType === 'consent_undertaking' || doc.documentType === 'title_deed';
        } else if (selectedCategory === 'My Uploaded Proofs') {
          matchCat = doc.source === 'citizen' || doc.category === 'My Uploaded Proofs' || doc.documentType === 'citizen_proof';
        } else {
          matchCat = doc.category === selectedCategory;
        }
      } else {
        matchCat = doc.category === selectedCategory;
      }
    }

    return matchSearch && matchCat;
  });

  // Download generator tailored to document type
  const handleDownload = (doc: RepoDocument) => {
    let specificContent = '';

    if (doc.documentType === 'land_approval') {
      specificContent = `================================================================================
GOVERNMENT OF INDIA - MINISTRY OF ROAD TRANSPORT & HIGHWAYS
COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
FORM 11-A STATUTORY LAND ACQUISITION APPROVAL & DEMARCATION ORDER
[Under Section 19(1) of RFCTLARR Act, 2013 & National Highways Act 1956]
================================================================================
APPROVAL ORDER REF     : ${doc.metadata?.approvalRef || doc.id}
LAND PARCEL IDENTIFIER : ${doc.parcelId || citizenParcel.id}
SURVEY NUMBER          : ${doc.metadata?.surveyNumber || citizenParcel.surveyNumber}
REGISTERED BENEFICIARY : ${doc.recipientName || citizenParcel.landownerName}
MASKED AADHAAR         : ${citizenParcel.landownerAadhaar || citizenParcel.maskedAadhaar}
REVENUE VILLAGE        : ${citizenParcel.village}, Mandal: Ghatkesar, Dist: ${citizenParcel.district}
LAND CLASSIFICATION    : ${citizenParcel.landType} (Title: Unencumbered Ancestral)
ACQUIRED EXTENT        : ${citizenParcel.areaAcres} Acres
INFRASTRUCTURE CORRIDOR: ${citizenParcel.projectName}

================================================================================
STATUTORY BOUNDARY DEMARCATION SCHEDULE
================================================================================
NORTH BOUNDARY : Survey No. 144 (Agricultural Land of Ramachandra Reddy)
SOUTH BOUNDARY : Proposed Service Road & Highway Median Alignment
EAST BOUNDARY  : Survey No. 145/3 (Gita Devi Sharma)
WEST BOUNDARY  : Survey No. 145/1 (Village Cart Track & Irrigation Canal)

GROUND PEGS    : BP-01, BP-02, BP-03, BP-04 (DGPS RTK Fixed - 1.5cm precision)
ENCUMBRANCES   : NIL (Certified by Sub-Registrar & Dharani Land Registry)
ORDER CLEARANCE: Clear title sanctioned for transfer to NHAI upon compensation award.
================================================================================
SEAL OF THE COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
Digitally Signed by: Ravi Kumar, IAS (District Collector & LAO)
Digital Token ID   : SHA256:${doc.hash.substring(8, 28)}
Date of Issue      : ${doc.date}
================================================================================`;
    } else if (doc.documentType === 'compensation_report') {
      const totalComp = citizenParcel.totalCompensation || 7225000;
      const baseLand = citizenParcel.compensation?.baseCompensation || 6250000;
      const solatium = citizenParcel.compensation?.solatium || 625000;
      const assetVal = citizenParcel.compensation?.additionalBenefits || 200000;
      const rrVal = citizenParcel.compensation?.rrAssistance || 150000;

      specificContent = `================================================================================
GOVERNMENT OF INDIA - STATE LAND ACQUISITION SECRETARIAT
FORM 16-C STATUTORY COMPENSATION AWARD & DETERMINATION STATEMENT
[Under Section 23, 26, 27, 28, 29 & 30 of RFCTLARR Act, 2013]
================================================================================
AWARD SERIAL NUMBER    : ${doc.metadata?.approvalRef || doc.id}
LAND PARCEL ID         : ${doc.parcelId || citizenParcel.id}
SURVEY NUMBER          : ${doc.metadata?.surveyNumber || citizenParcel.surveyNumber}
AWARDEE / LANDOWNER    : ${doc.recipientName || citizenParcel.landownerName}
ACQUIRED AREA          : ${citizenParcel.areaAcres} Acres (${citizenParcel.landType})
VILLAGE & DISTRICT     : ${citizenParcel.village}, ${citizenParcel.district}, ${citizenParcel.state}

================================================================================
STATUTORY COMPENSATION BREAKDOWN (FIRST SCHEDULE FORMULA)
================================================================================
1. Basic Land Value (Circle Rate × Rural Multiplier 1.5x) : ₹${baseLand.toLocaleString('en-IN')}
2. Immovable Assets Appraisal (14 Teak Trees & Borewell)   : ₹${assetVal.toLocaleString('en-IN')}
3. 100% Mandatory Solatium under Section 30(1)             : ₹${solatium.toLocaleString('en-IN')}
4. Resettlement & Rehabilitation Assistance (Second Sched) : ₹${rrVal.toLocaleString('en-IN')}
--------------------------------------------------------------------------------
TOTAL STATUTORY AWARD DETERMINED (NET PAYABLE)             : ₹${totalComp.toLocaleString('en-IN')}
================================================================================
PAYMENT DISBURSAL ROUTE & TREASURY INSTRUCTIONS
Target Bank Account    : ${citizenParcel.maskedBankAccount || 'State Bank of India (•••4892)'}
PFMS Mandate ID        : PFMS-GOI-2026-88194
Payment Mode           : Direct Benefit Transfer (DBT) via RBI Electronic Clearing
Status                 : ${citizenParcel.compensationStatus === 'Approved' ? 'SANCTIONED - READY FOR ACCOUNT DISBURSAL' : 'PENDING OFFICIAL DISBURSAL'}
Digital Checksum       : ${doc.hash}
================================================================================`;
    } else if (doc.documentType === 'application_report') {
      specificContent = `================================================================================
GOVERNMENT OF INDIA - BHOOMISETU NATIONAL LAND PORTAL
CITIZEN LAND ACQUISITION APPLICATION & PROCESS PROGRESS REPORT
================================================================================
APPLICATION DOSSIER ID : ${doc.metadata?.approvalRef || doc.id}
BENEFICIARY NAME       : ${doc.recipientName || citizenParcel.landownerName}
SURVEY NUMBER          : ${doc.metadata?.surveyNumber || citizenParcel.surveyNumber}
ACQUISITION CORRIDOR   : ${citizenParcel.projectName}
LIFECYCLE STATUS       : STAGE 5 / 7 (AWARD DETERMINED & APPROVED)
================================================================================
MILESTONE AUDIT TRAIL & STATUTORY DATES
--------------------------------------------------------------------------------
[✓] STAGE 1: DPR Alignment & Preliminary Survey           : 10 Jan 2026 (Completed)
[✓] STAGE 2: Section 3A Preliminary Gazette Issued        : 22 Jan 2026 (Completed)
[✓] STAGE 3: Drone LiDAR & Joint Field Demarcation (JMVR) : 18 Feb 2026 (Completed)
[✓] STAGE 4: Section 15(1) Objection Period Closure       : 28 Feb 2026 (No Disputed Claims)
[✓] STAGE 5: Form 16-C Statutory Award Declaration        : 08 Mar 2026 (Sanctioned)
[•] STAGE 6: PFMS Electronic DBT Disbursal to Bank        : IN PROGRESS (Treasury Queue)
[ ] STAGE 7: Final Physical Site Handover (Possession)    : Target 15 Apr 2026
================================================================================
REVENUE NODAL OFFICER REMARKS:
"Title deed, revenue 1-B extract, and joint spot measurement verified with landowner.
Consent recorded and statutory award passed with zero deductions."
Certified by: Competent Authority for Land Acquisition (CALA)
Ledger Hash: ${doc.hash}
================================================================================`;
    } else {
      specificContent = `================================================================================
GOVERNMENT OF INDIA - STATUTORY LAND REPOSITORY
CERTIFIED OFFICIAL RECORD & RECORD OF RIGHTS EXTRACT
================================================================================
DOCUMENT ID         : ${doc.id}
DOCUMENT TITLE      : ${doc.title}
CATEGORY            : ${doc.category}
ASSOCIATED ENTITY   : ${doc.parcelOrProject}
RECORDING DATE      : ${doc.date}
FILE SPECIFICATION  : ${doc.size} (${doc.fileType?.toUpperCase() || 'PDF'})
INTEGRITY VERIFIED  : YES - CRYPTOGRAPHICALLY VALID
ISSUING AUTHORITY   : ${doc.issuingAuthority || 'Competent Authority for Land Acquisition'}
SHA-256 CHECKSUM    : ${doc.hash}
DISPATCH TIMESTAMP  : ${new Date().toISOString()} IST
================================================================================
Notice: This document is an electronically certified statutory record 
recognized under Section 4 of the Information Technology Act 2000 and 
RFCTLARR Act 2013.
================================================================================`;
    }

    const blob = new Blob([specificContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.id}_${doc.title.substring(0, 25).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded certified record: ${doc.title}`, 'success');
  };

  // Upload submission handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showToast('Please enter a document title', 'warning');
      return;
    }

    if (isCitizen) {
      // Citizen Upload: Only citizen proof categories allowed
      addFieldDocument({
        parcelId: citizenParcel.id,
        title: uploadTitle,
        category: 'Ownership Document',
        uploadedBy: `${citizenParcel.landownerName} (Landowner)`,
        fileSize: uploadFileName ? '2.4 MB' : '1.8 MB',
        fileType: 'pdf',
      });

      showToast(`Submitted citizen proof: "${uploadTitle}" to your acquisition docket`, 'success');
    } else {
      // Government Upload: Official statutory records
      addFieldDocument({
        parcelId: uploadParcelId,
        title: uploadTitle,
        category: govUploadCategory,
        uploadedBy: loggedInUser || 'LAO District Secretariat',
        fileSize: uploadFileName ? '2.4 MB' : '1.8 MB',
        fileType: 'pdf',
      });

      showToast(`Uploaded statutory certified record: "${uploadTitle}"`, 'success');
    }

    setUploadTitle('');
    setUploadFileName('');
    setShowUploadModal(false);
  };

  // Categories list based on role
  const categoryFilters = isCitizen
    ? [
        { id: 'ALL', label: 'All My Documents', count: allDocuments.length },
        { id: 'Land Approvals', label: 'Land Approvals', count: allDocuments.filter((d) => d.documentType === 'land_approval').length },
        { id: 'Compensation Reports', label: 'Compensation Reports', count: allDocuments.filter((d) => d.documentType === 'compensation_report').length },
        { id: 'Application Process', label: 'Application Process', count: allDocuments.filter((d) => d.documentType === 'application_report').length },
        { id: 'Consent & Title', label: 'Consent & Title Deeds', count: allDocuments.filter((d) => d.documentType === 'consent_undertaking' || d.documentType === 'title_deed').length },
        { id: 'My Uploaded Proofs', label: 'My Uploaded Proofs', count: allDocuments.filter((d) => d.source === 'citizen' || d.documentType === 'citizen_proof').length },
      ]
    : [
        { id: 'ALL', label: 'All Documents', count: allDocuments.length },
        { id: 'Gazette', label: 'Gazette Notifications', count: allDocuments.filter((d) => d.category === 'Gazette').length },
        { id: 'Land Approval', label: 'Land Approvals', count: allDocuments.filter((d) => d.category === 'Land Approval' || d.documentType === 'land_approval').length },
        { id: 'Compensation Report', label: 'Compensation Reports', count: allDocuments.filter((d) => d.category === 'Compensation Report' || d.documentType === 'compensation_report').length },
        { id: 'Application Process Report', label: 'Process Dockets', count: allDocuments.filter((d) => d.category === 'Application Process Report' || d.documentType === 'application_report').length },
        { id: 'Consent & Title', label: 'Consent & Deeds', count: allDocuments.filter((d) => d.category === 'Consent & Title' || d.category === 'Title Deed' || d.category === 'Consent Form').length },
        { id: 'SIA & Consent', label: 'SIA & Clearances', count: allDocuments.filter((d) => d.category === 'SIA & Consent' || d.category === 'Statutory Clearances').length },
      ];

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isCitizen ? 'bg-emerald-600' : 'bg-blue-700'}`} />
            <span className={`text-xs uppercase font-mono font-bold tracking-wider ${isCitizen ? 'text-emerald-900' : 'text-blue-900'}`}>
              {isCitizen
                ? 'Citizen Protected Document Vault • Personal Land Records Only'
                : 'National Statutory & Government Document Repository'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {isCitizen ? 'My Documents & Statutory Reports' : 'Statutory Document Repository'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {isCitizen ? (
              <span>
                Official records for <strong className="text-slate-900 font-semibold">Shri {citizenParcel.landownerName}</strong> • Survey No.{' '}
                <span className="font-mono font-bold text-blue-900">{citizenParcel.surveyNumber}</span> ({citizenParcel.village}) • Aadhaar{' '}
                <span className="font-mono text-slate-700">{citizenParcel.landownerAadhaar || citizenParcel.maskedAadhaar}</span>
              </span>
            ) : (
              'Central cryptographic repository of Gazette notifications, administrative sanctions, and verified land dockets.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* If citizen has multiple parcels or switch is allowed */}
          {isCitizen && landParcels.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-slate-500 font-medium">My Land:</span>
              <select
                value={citizenParcel.id}
                onChange={(e) => setSelectedParcelId(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {landParcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    Sy {p.surveyNumber} ({p.village})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className={`px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-2xs btn-hover transition-colors cursor-pointer ${
              isCitizen ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isCitizen ? 'Upload Supporting Proof' : 'Upload Certified Record'}</span>
          </button>
        </div>
      </div>

      {/* Role Access Security Notice Callout */}
      {isCitizen ? (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <FolderLock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 flex items-center gap-2">
                <span>Citizen Confidentiality &amp; Data Privacy Mode Active</span>
                <span className="text-[10px] font-mono bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  IT Act § 43A Compliant
                </span>
              </h4>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                As a registered citizen, you only have access to records directly issued for you and your land parcel: 
                <strong> Land Demarcation &amp; Approval Orders</strong>, 
                <strong> Form 16-C Compensation Reports</strong>, 
                <strong> Application Status Reports</strong>, and 
                <strong> Aadhaar eSign Consent Proofs</strong>. Government gazettes, ministerial clearances, and other citizens’ files are strictly restricted.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Need administrative view?</span>
            <button
              onClick={() => {
                loginAsRole('officer');
                showToast('Switched to Revenue Officer (Full Statutory Repository Unlocked)', 'info');
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
            >
              Switch to Officer
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-blue-950 flex items-center gap-2">
                <span>Statutory Authority Administrative Document Vault</span>
                <span className="text-[10px] font-mono bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-bold">
                  Full Access
                </span>
              </h4>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                You have administrative access to all Government Gazettes, Inter-Departmental Forest &amp; Environment clearances, SIA Public Hearing resolutions, and individual land parcel dossiers across all projects. (Note: Citizen logins are strictly sandboxed to their own files).
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Test citizen isolation?</span>
            <button
              onClick={() => {
                loginAsRole('citizen');
                showToast('Switched to Citizen Role (Strict Isolation Active)', 'info');
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
            >
              Switch to Citizen
            </button>
          </div>
        </div>
      )}

      {/* Quick Summary Cards for Citizen */}
      {isCitizen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedCategory('Land Approvals')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              selectedCategory === 'Land Approvals'
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                CATEGORY 01
              </span>
              <FileCheck className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Land Approval Orders</h3>
            <p className="text-xs text-slate-600 mt-1">
              Form 11-A statutory clearance, boundary pegging map, and FMB cadastral demarcation.
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-blue-700">
              <span>View Approvals</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => setSelectedCategory('Compensation Reports')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              selectedCategory === 'Compensation Reports'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                CATEGORY 02
              </span>
              <CreditCard className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Compensation Reports</h3>
            <p className="text-xs text-slate-600 mt-1">
              Form 16-C Statutory Award (₹{(citizenParcel.totalCompensation || 7225000).toLocaleString('en-IN')}), tree appraisal, and PFMS DBT advice.
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-emerald-700">
              <span>View Financial Reports</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => setSelectedCategory('Application Process')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              selectedCategory === 'Application Process'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                CATEGORY 03
              </span>
              <Clock className="w-5 h-5 text-indigo-700" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Application Process Reports</h3>
            <p className="text-xs text-slate-600 mt-1">
              Stage 1 to Stage 7 progress report, on-ground JMVR spot certificate, and timeline tracking.
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-indigo-700">
              <span>View Process Docket</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isCitizen ? 'Search my approval, award or report...' : 'Search document, survey or gazette...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? isCitizen
                      ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                      : 'bg-blue-700 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Matching Documents Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isCitizen
                ? 'No citizen documents match the chosen category. Government gazettes and inter-departmental files are restricted from this view.'
                : 'No documents match the specified search or filter query.'}
            </p>
            {selectedCategory !== 'ALL' && (
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
              >
                Clear Category Filter
              </button>
            )}
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isLandApproval = doc.documentType === 'land_approval';
            const isCompensation = doc.documentType === 'compensation_report';
            const isAppReport = doc.documentType === 'application_report';
            const isConsent = doc.documentType === 'consent_undertaking' || doc.documentType === 'title_deed';

            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 card-hover transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Icon based on doc type */}
                    <div
                      className={`p-3 rounded-xl border shrink-0 ${
                        isLandApproval
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : isCompensation
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isAppReport
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : doc.isGovernmentOnly
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isLandApproval ? (
                        <Award className="w-5 h-5" />
                      ) : isCompensation ? (
                        <CreditCard className="w-5 h-5" />
                      ) : isAppReport ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      {/* Badge row */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {doc.id}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            isLandApproval
                              ? 'bg-blue-100/70 text-blue-900 border-blue-200'
                              : isCompensation
                              ? 'bg-emerald-100/70 text-emerald-900 border-emerald-200'
                              : isAppReport
                              ? 'bg-indigo-100/70 text-indigo-900 border-indigo-200'
                              : doc.isGovernmentOnly
                              ? 'bg-amber-100/70 text-amber-900 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {doc.category}
                        </span>

                        {doc.source === 'citizen' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] text-emerald-800 font-bold border border-emerald-200">
                            Citizen Record
                          </span>
                        )}

                        {doc.isGovernmentOnly && (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-[10px] text-purple-900 font-bold border border-purple-200">
                            Government Only
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>SHA-256 Sealed</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                        {doc.title}
                      </h3>

                      {/* Description if present */}
                      {doc.description && (
                        <p className="text-xs text-slate-600 max-w-2xl mb-1.5 leading-relaxed">
                          {doc.description}
                        </p>
                      )}

                      {/* Metadata row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          Target: <strong className="text-slate-800 font-medium">{doc.parcelOrProject}</strong>
                        </span>
                        {doc.issuingAuthority && (
                          <span>
                            Authority: <span className="text-slate-700">{doc.issuingAuthority}</span>
                          </span>
                        )}
                        {doc.metadata?.statusNote && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {doc.metadata.statusNote}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] font-mono text-slate-400 mt-1 truncate max-w-md">
                        {doc.hash}
                      </p>
                    </div>
                  </div>

                  {/* Actions & File info */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right text-xs">
                      <span className="text-slate-500 block">{doc.date}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{doc.size}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-2xs btn-hover cursor-pointer"
                        title="Preview Certified Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownload(doc)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs btn-hover cursor-pointer ${
                          isCitizen
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Certified Record Modal (Separated for Citizen vs Government) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in">
          <div className="max-w-lg w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isCitizen ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isCitizen ? 'Submit Citizen Supporting Proof' : 'Upload Certified Statutory Record'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isCitizen
                      ? 'Upload your personal land records, bank proof, or identity documents'
                      : 'Document will be cryptographically hashed and sealed on the national ledger'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Document Title / Description *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={
                    isCitizen
                      ? 'e.g., My Updated Dharani 1-B Extract or Bank Passbook Front Page'
                      : 'e.g., Certified 1-B Extract & Revenue Mutation Certificate'
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white"
                />
              </div>

              {isCitizen ? (
                // CITIZEN UPLOAD FORM: Strictly citizen-relevant categories
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Citizen Document Category *
                    </label>
                    <select
                      value={citizenUploadCategory}
                      onChange={(e) => setCitizenUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                    >
                      <option value="Pahani / Title Deed Copy">Pahani / Title Deed Copy</option>
                      <option value="Bank Passbook / Cancelled Cheque">Bank Passbook / Cancelled Cheque</option>
                      <option value="Aadhaar / Voter ID Proof">Aadhaar / Voter ID Proof</option>
                      <option value="Succession / Family Tree Certificate">Succession / Family Tree Certificate</option>
                      <option value="Citizen Objection / Representation Proof">Citizen Representation Proof</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Associated Land Parcel
                    </label>
                    <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 font-semibold">
                      Sy {citizenParcel.surveyNumber} ({citizenParcel.village})
                    </div>
                  </div>
                </div>
              ) : (
                // GOVERNMENT UPLOAD FORM
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Statutory Category *
                    </label>
                    <select
                      value={govUploadCategory}
                      onChange={(e) => setGovUploadCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-700"
                    >
                      <option value="Title Deed">Title Deed / Pahani Extract</option>
                      <option value="Valuation Report">Valuation Report / Form 16-B</option>
                      <option value="Consent Form">Consent Form / Form-C</option>
                      <option value="Gazette Notification">Gazette Notification (Sec 3D)</option>
                      <option value="Land Survey Report">DGPS Land Survey Report</option>
                      <option value="Field Inspection Report">Field Inspection Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Target Land Parcel *
                    </label>
                    <select
                      value={uploadParcelId}
                      onChange={(e) => setUploadParcelId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-700"
                    >
                      {landParcels.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.surveyNumber} ({p.landownerName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* File input */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Attach Certified PDF / Scan (Up to 25 MB)
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                  <FileText className="w-8 h-8 text-blue-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-800">
                    {uploadFileName || 'Click to select certified PDF or drag and drop'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Supports PDF, DOCX, JPG, PNG with digital certification
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  {isCitizen
                    ? 'Uploaded documents are securely timestamped and directly reviewed by your assigned Land Acquisition Officer.'
                    : 'Uploaded documents receive an automated SHA-256 ledger stamp and are backed up to NIC DigiLocker.'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-2xs btn-hover cursor-pointer ${
                    isCitizen ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  {isCitizen ? 'Submit to Acquisition File' : 'Upload & Seal Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in">
          <div className="max-w-2xl w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    previewDoc.documentType === 'land_approval'
                      ? 'bg-blue-50 text-blue-700'
                      : previewDoc.documentType === 'compensation_report'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {previewDoc.documentType === 'land_approval'
                      ? 'Statutory Land Approval & Demarcation Certificate'
                      : previewDoc.documentType === 'compensation_report'
                      ? 'Statutory Compensation Award & Financial Statement'
                      : previewDoc.documentType === 'application_report'
                      ? 'Land Acquisition Application & Process Report'
                      : 'Certified National Land Record'}
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CRYPTOGRAPHIC SEAL VALID (RFCTLARR ACT 2013)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured details table */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Document Identifier:</span>
                <span className="font-bold text-blue-900">{previewDoc.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Title:</span>
                <span className="font-bold text-slate-800 text-right max-w-sm">{previewDoc.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Statutory Classification:</span>
                <span className="text-slate-900 font-semibold">{previewDoc.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Associated Entity:</span>
                <span className="text-blue-900 font-bold">{previewDoc.parcelOrProject}</span>
              </div>
              {previewDoc.recipientName && (
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 font-sans">Beneficiary / Landowner:</span>
                  <span className="text-slate-900 font-bold">Shri {previewDoc.recipientName}</span>
                </div>
              )}
              {previewDoc.issuingAuthority && (
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 font-sans">Issuing Statutory Authority:</span>
                  <span className="text-slate-800 font-medium">{previewDoc.issuingAuthority}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Filing Date:</span>
                <span className="text-slate-700">{previewDoc.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Cryptographic Checksum:</span>
                <span className="text-slate-600 text-[10px] break-all">{previewDoc.hash}</span>
              </div>
            </div>

            {/* Document Preview Certificate Box */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Statutory Authority Certification &amp; Evidentiary Validity</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {previewDoc.description ||
                  'This record has been officially gazetted and digitally counter-signed by the Competent Authority for Land Acquisition (CALA). It holds full evidentiary value under the Right to Fair Compensation and Transparency in Land Acquisition (RFCTLARR) Act, 2013 and Section 65B of the Indian Evidence Act.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 btn-hover cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Certified Record (.txt / PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
