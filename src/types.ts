export type SectorType =
  | 'highways'
  | 'railways'
  | 'power'
  | 'urban'
  | 'revenue'
  | 'citizen'
  | 'field_officer';

export interface SectorInfo {
  id: SectorType;
  name: string;
  shortName: string;
  department: string;
  tagline: string;
  badge: string;
  defaultUsername: string;
}

export type UserRole =
  | 'central'
  | 'state'
  | 'officer'
  | 'field_officer'
  | 'citizen'
  | 'admin';

export type ProjectType =
  | 'Highway'
  | 'Railway'
  | 'Metro'
  | 'Airport'
  | 'Industrial Corridor'
  | 'Power Plant'
  | 'Smart City'
  | 'Defence';

export type ProjectStatus = 'Active' | 'Under Survey' | 'Compensation Stage' | 'Possession' | 'Completed' | 'Delayed';

export type LifecycleStageStatus = 'Completed' | 'In Progress' | 'Pending' | 'Delayed';

export interface LifecycleStage {
  id: number;
  name: string;
  description: string;
  status: LifecycleStageStatus;
  completedDate?: string;
  targetDate?: string;
  officerInCharge?: string;
  delayDays?: number;
}

export interface Project {
  id: string;
  name: string;
  ministry: string;
  implementingAgency: string;
  state: string;
  district: string;
  projectType: ProjectType;
  landRequired: number; // in Acres
  landAcquired: number; // in Acres
  progress: number; // 0 to 100
  status: ProjectStatus;
  startDate: string;
  expectedCompletionDate: string;
  budgetCr: number;
  compensationDisbursedCr: number;
  lifecycle: LifecycleStage[];
}

export type AcquisitionStatus =
  | 'Proposed'
  | 'Notification Issued'
  | 'Under Verification'
  | 'Compensation Pending'
  | 'Land Acquired'
  | 'Disputed'
  | 'Possession Completed';

export type LandType = 'Agricultural' | 'Commercial' | 'Residential' | 'Barren / Industrial' | 'Forest';

export type GrievanceCategory =
  | 'Compensation Issue'
  | 'Land Area Dispute'
  | 'Ownership Issue'
  | 'Payment Delay'
  | 'Incorrect Information'
  | 'R&R Issue'
  | 'Other';

export interface CompensationCalculation {
  basicLandValue: number;
  multiplierFactor: number;
  multipliedLandValue: number;
  assetValuation: number;
  solatiumPercentage: number;
  solatiumAmount: number;
  interestPercentage: number;
  interestAmount: number;
  totalCompensation: number;
}

export interface LandParcel {
  id: string; // e.g. "TS-HYD-2026-001245"
  surveyNumber: string; // e.g. "145/2"
  projectId: string;
  projectName: string;
  landownerName: string;
  landownerMobile: string;
  landownerAddress: string;
  maskedAadhaar: string;
  maskedBankAccount: string;
  state: string;
  district: string;
  village: string;
  areaAcres: number;
  landType: LandType;
  acquisitionStatus: AcquisitionStatus;
  status?: string; // alias for acquisitionStatus
  compensationStatus: 'Pending' | 'Approved' | 'Payment Processing' | 'Payment Completed' | 'Under Review' | 'Disputed';
  possessionStatus: 'Not Started' | 'Demarcated' | 'Partial Possession' | 'Possession Completed';
  lastUpdated: string;
  // GIS polygon coordinates relative to canvas/SVG viewport
  polygonCoords: [number, number][];
  center: [number, number];
  coordinates?: { x: number; y: number }[];
  marketValuePerAcre?: number;
  multiplierFactor?: number;
  assetValuation?: number;
  totalCompensation?: number;
  consentReceived?: boolean;
  consentDate?: string;
  landownerAadhaar?: string;
  compensation: {
    governmentRatePerAcre: number;
    baseCompensation: number;
    solatium: number;
    additionalBenefits: number;
    rrAssistance: number;
    totalCompensation: number;
    officerRemarks?: string;
    internalNotes?: string;
    approvedBy?: string;
    approvalDate?: string;
  };
}

export interface FieldPhoto {
  id: string;
  parcelId: string;
  photoUrl: string;
  thumbnailUrl: string;
  caption: string;
  timestamp: string;
  gpsCoords: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
  };
  officerName: string;
  url?: string;
  gpsCoordinates?: string;
  status?: 'Pending' | 'Verified' | 'Rejected';
}

export interface FieldDocument {
  id: string;
  parcelId: string;
  title: string;
  category:
    | 'Land Survey Report'
    | 'Ownership Document'
    | 'Consent Form'
    | 'Field Inspection Report'
    | 'Title Deed'
    | 'Valuation Report'
    | 'Gazette Notification'
    | 'Other';
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  version: string;
  fileType: 'pdf' | 'jpg' | 'png';
  documentHash?: string;
}

export interface FieldAssignment {
  id: string;
  parcelId: string;
  surveyNumber: string;
  landownerName: string;
  village: string;
  district: string;
  projectName: string;
  assignedDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  requiredTasks: string[];
}

export interface LandownerConsent {
  id: string;
  parcelId: string;
  landownerName: string;
  consentStatus: 'Verified' | 'Pending Verification' | 'Rejected';
  dateSigned: string;
  fieldOfficerName: string;
  signatureUrl: string;
  qrVerificationCode: string;
  documentHash: string;
  timestamp: string;
  versionHistory: {
    version: string;
    action: string;
    timestamp: string;
    officer: string;
  }[];
}

export interface Grievance {
  id: string; // e.g. "GRV-2026-TS-00124"
  parcelId: string;
  citizenName: string;
  mobile: string;
  category:
    | 'Compensation Issue'
    | 'Land Area Dispute'
    | 'Ownership Issue'
    | 'Payment Delay'
    | 'Incorrect Information'
    | 'R&R Issue'
    | 'Other';
  subject: string;
  description: string;
  status: 'Submitted' | 'Under Review' | 'Officer Assigned' | 'Resolved';
  submittedDate: string;
  assignedOfficer?: string;
  resolutionNote?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  parcelId?: string;
  ipAddress?: string;
  txHash?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'notification' | 'compensation' | 'payment' | 'verification' | 'field' | 'project';
  read: boolean;
  linkView?: string;
}

export interface AffectedFamily {
  familyId: string;
  headOfFamily: string;
  village: string;
  district: string;
  familyMembersCount: number;
  category?: string;
  affectedType?: 'Agricultural' | 'Homestead & Land' | 'Commercial' | 'Tenant';
  relocationStatus?: 'Rehabilitated' | 'Pending Rehabilitation' | 'Allotment in Progress';
  benefits?: string;
  financialPackageLakhs?: number;
  status?: 'Active' | 'Disbursed' | 'Under Assessment';
  rehabilitationStatus?: string;
  homesteadAllottedUnit?: string;
  subsistenceAllowancePaid?: number;
  skillTrainingEnrolledTrade?: string;
}

export interface StateData {
  id: string;
  name: string;
  code: string;
  projectsCount: number;
  landProposedAcres: number;
  landAcquiredAcres: number;
  compensationPaidCr: number;
  affectedFamilies: number;
  activeDistricts: number;
  svgPathCoord: string;
  centroid: [number, number];
}
