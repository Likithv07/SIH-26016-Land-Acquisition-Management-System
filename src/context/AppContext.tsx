import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  SectorType,
  UserRole,
  Project,
  LandParcel,
  FieldPhoto,
  FieldDocument,
  FieldAssignment,
  LandownerConsent,
  Grievance,
  AuditLogEntry,
  NotificationItem,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_LAND_PARCELS,
  INITIAL_FIELD_PHOTOS,
  INITIAL_FIELD_DOCUMENTS,
  INITIAL_FIELD_ASSIGNMENTS,
  INITIAL_CONSENT,
  INITIAL_GRIEVANCES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'portal_select'
  | 'login'
  | 'dashboard'
  | 'projects'
  | 'project_details'
  | 'gis_map'
  | 'compensation'
  | 'field_upload'
  | 'consent'
  | 'citizen_land'
  | 'citizen_compensation'
  | 'grievance'
  | 'documents'
  | 'audit'
  | 'timeline_monitoring'
  | 'rr_dashboard'
  | 'ai_analytics'
  | 'scope'
  | 'citizen_rr_choices';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeSector: SectorType;
  setActiveSector: (sector: SectorType) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  loggedInUser: string | null;
  setLoggedInUser: (username: string | null) => void;
  loginAsSector: (sector: SectorType, username?: string) => void;
  loginAsRole: (role: UserRole, username?: string) => void;
  logout: () => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedParcelId: string;
  setSelectedParcelId: (id: string) => void;
  selectedStateId: string | null;
  setSelectedStateId: (id: string | null) => void;
  projects: Project[];
  landParcels: LandParcel[];
  fieldPhotos: FieldPhoto[];
  fieldDocuments: FieldDocument[];
  fieldAssignments: FieldAssignment[];
  consentDoc: LandownerConsent;
  grievances: Grievance[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  removeToast: (id: string) => void;
  updateCompensation: (
    parcelId: string,
    updates: Partial<LandParcel['compensation']> & {
      areaAcres?: number;
      marketValuePerAcre?: number;
      multiplierFactor?: number;
      assetValuation?: number;
      totalCompensation?: number;
      solatium?: number;
      baseCompensation?: number;
    }
  ) => void;
  approveCompensation: (parcelId: string, remarks?: string, notes?: string) => void;
  rejectCompensation: (parcelId: string, reason: string) => void;
  requestDocuments: (parcelId: string, docsNote: string) => void;
  addGrievance: (data: { parcelId: string; citizenName: string; mobile: string; category: Grievance['category']; subject: string; description: string }) => string;
  updateGrievanceStatus: (id: string, status: Grievance['status'], resolutionNote?: string) => void;
  deleteGrievance: (id: string) => void;
  lastSyncedAt: string;
  isRefreshing: boolean;
  refreshData: () => void;
  addAuditLog: (action: string, module: string, details: string, parcelId?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addFieldPhoto: (photo: { parcelId: string; photoUrl: string; thumbnailUrl: string; caption: string; gpsCoords: { latitude: number; longitude: number; accuracyMeters: number }; officerName: string }) => void;
  addFieldDocument: (doc: { parcelId: string; title: string; category: FieldDocument['category']; uploadedBy: string; fileSize: string; fileType: 'pdf' | 'jpg' | 'png' }) => void;
  verifyConsentDocument: () => void;
  startFieldAssignment: (assignmentId: string) => void;
  calculateCompensation: (parcelId: string, calc: any) => void;
  submitConsent: (parcelId: string) => void;
  verifyFieldPhoto: (photoId: string) => void;
  rejectFieldPhoto: (photoId: string, reason?: string) => void;
  approveAllFieldPhotos: (parcelId?: string) => void;
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('officer');
  const [activeSector, setInternalActiveSector] = useState<SectorType>('highways');
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const setActiveSector = (sector: SectorType) => {
    setInternalActiveSector(sector);
    const roleMapping: Record<SectorType, UserRole> = {
      highways: 'central',
      railways: 'central',
      power: 'officer',
      urban: 'state',
      revenue: 'officer',
      citizen: 'citizen',
      field_officer: 'field_officer',
    };
    if (roleMapping[sector]) {
      setUserRole(roleMapping[sector]);
    }
  };
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('NLA-TS-2026-001');
  const [selectedParcelId, setSelectedParcelId] = useState<string>('TS-HYD-2026-001245');
  const [selectedStateId, setSelectedStateId] = useState<string | null>('TS');

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [landParcels, setLandParcels] = useState<LandParcel[]>(INITIAL_LAND_PARCELS);
  const [fieldPhotos, setFieldPhotos] = useState<FieldPhoto[]>(INITIAL_FIELD_PHOTOS);
  const [fieldDocuments, setFieldDocuments] = useState<FieldDocument[]>(INITIAL_FIELD_DOCUMENTS);
  const [fieldAssignments, setFieldAssignments] = useState<FieldAssignment[]>(INITIAL_FIELD_ASSIGNMENTS);
  const [consentDoc, setConsentDoc] = useState<LandownerConsent>(INITIAL_CONSENT);
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastSyncedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
      showToast('Registry synchronized with NIC Land Records & PFMS Gateway', 'success');
    }, 400);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginAsSector = (sector: SectorType, username?: string) => {
    setActiveSector(sector);
    setIsLoggedIn(true);
    const sectorNames: Record<SectorType, string> = {
      highways: 'Highways & Road Transport (MoRTH / NHAI)',
      railways: 'Railways & High-Speed Corridors (IR / NHSRCL)',
      power: 'Energy & Power Transmission (PowerGrid / NTPC)',
      urban: 'Urban Development & Industrial Corridors (NICDC)',
      revenue: 'State Revenue & District Administration (LAO)',
      citizen: 'Citizen & Landowner Portal',
      field_officer: 'Field Verification & Survey Unit',
    };
    const defaultUsers: Record<SectorType, string> = {
      highways: 'Er. Sandeep Verma (Chief Project Officer, NHAI)',
      railways: 'Anil Mehra (Dy. Chief Engineer, Railways)',
      power: 'P. K. Sharma (General Manager, PowerGrid)',
      urban: 'Sunita Deshmukh, IAS (CEO, Industrial Corridor)',
      revenue: 'Ravi Kumar, IAS (District Collector & LAO)',
      citizen: 'Rajesh Kumar (Landowner, Survey #145/2)',
      field_officer: 'Vikramaditya Rao (Senior Field Officer)',
    };
    const roleMapping: Record<SectorType, UserRole> = {
      highways: 'central',
      railways: 'central',
      power: 'officer',
      urban: 'state',
      revenue: 'officer',
      citizen: 'citizen',
      field_officer: 'field_officer',
    };
    setUserRole(roleMapping[sector]);
    setLoggedInUser(username || defaultUsers[sector]);
    if (sector === 'field_officer') {
      setCurrentView('field_upload');
    } else {
      setCurrentView('dashboard');
    }
    showToast(`Authenticated: ${sectorNames[sector]}`, 'success');
  };

  const loginAsRole = (role: UserRole, username?: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    const roleDefaultUsers: Record<UserRole, string> = {
      central: 'Er. Sandeep Verma (Chief Project Officer, NHAI)',
      state: 'Sunita Deshmukh, IAS (State Land Commissioner)',
      officer: 'Ravi Kumar, IAS (District Collector & LAO)',
      field_officer: 'Vikramaditya Rao (Senior Field Officer & Surveyor)',
      citizen: 'Rajesh Kumar (Landowner, Survey #145/2)',
      admin: 'SysAdmin Root (NIC Command)',
    };
    setLoggedInUser(username || roleDefaultUsers[role] || 'Field Officer');
    if (role === 'field_officer') {
      setCurrentView('field_upload'); // Directly open Field Verification suite
    } else if (role === 'citizen') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('dashboard');
    }
    showToast(
      `Authenticated as ${role === 'field_officer' ? 'Field Officer • Mobile Field Verification Suite Active' : role}`,
      'success'
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setCurrentView('landing');
    showToast('Signed out of BhoomiSetu portal', 'info');
  };

  const addAuditLog = (action: string, module: string, details: string, parcelId?: string) => {
    const userNames: Record<UserRole, string> = {
      central: 'Joint Secretary (Infrastructure)',
      state: 'State Land Commissioner, IAS',
      officer: 'Ravi Kumar (District LAO)',
      field_officer: 'Vikramaditya Rao (Field Officer)',
      citizen: 'Rajesh Kumar (Landowner)',
      admin: 'SysAdmin Root',
    };

    const roleNames: Record<UserRole, string> = {
      central: 'Central Government',
      state: 'State Authority',
      officer: 'District Officer',
      field_officer: 'Field Officer',
      citizen: 'Citizen / Landowner',
      admin: 'System Administrator',
    };

    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      user: userNames[userRole],
      role: roleNames[userRole],
      action,
      module,
      details,
      parcelId,
      ipAddress: '10.244.18.92',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateCompensation = (
    parcelId: string,
    updates: Partial<LandParcel['compensation']> & {
      areaAcres?: number;
      marketValuePerAcre?: number;
      multiplierFactor?: number;
      assetValuation?: number;
      totalCompensation?: number;
      solatium?: number;
      baseCompensation?: number;
    }
  ) => {
    setLandParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id === parcelId) {
          const comp = { ...parcel.compensation, ...updates };
          const finalTotal =
            updates.totalCompensation ||
            comp.totalCompensation ||
            (comp.baseCompensation || 0) +
              (comp.solatium || 0) +
              (comp.additionalBenefits || 0) +
              (comp.rrAssistance || 0);

          return {
            ...parcel,
            areaAcres: updates.areaAcres ?? parcel.areaAcres,
            marketValuePerAcre: updates.marketValuePerAcre ?? parcel.marketValuePerAcre,
            multiplierFactor: updates.multiplierFactor ?? parcel.multiplierFactor,
            assetValuation: updates.assetValuation ?? parcel.assetValuation,
            totalCompensation: finalTotal,
            compensation: {
              ...comp,
              totalCompensation: finalTotal,
            },
          };
        }
        return parcel;
      })
    );
    showToast('Compensation values updated & recalculated.', 'info');
    addAuditLog('Modified Compensation Assessment', 'Compensation Assessment & Approval', `Recalculated values for parcel ${parcelId}`, parcelId);
  };

  const approveCompensation = (parcelId: string, remarks?: string, notes?: string) => {
    setLandParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          return {
            ...p,
            acquisitionStatus: 'Land Acquired',
            compensationStatus: 'Approved',
            possessionStatus: 'Demarcated',
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
            compensation: {
              ...p.compensation,
              officerRemarks: remarks || p.compensation.officerRemarks,
              internalNotes: notes || p.compensation.internalNotes,
              approvedBy: 'Ravi Kumar (LAO)',
              approvalDate: new Date().toISOString().split('T')[0],
            },
          };
        }
        return p;
      })
    );

    // Also update project stats
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === 'NLA-TS-2026-001') {
          return {
            ...proj,
            landAcquired: proj.landAcquired + 2.5,
            progress: Math.min(100, proj.progress + 2),
          };
        }
        return proj;
      })
    );

    showToast(`Compensation for ${parcelId} Approved Successfully!`, 'success');
    addAuditLog('Approved Compensation', 'Compensation Assessment & Approval', `Award authorized and queued for DBT processing`, parcelId);

    // Queue notification
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Compensation Approved',
        message: `Statutory compensation award for parcel ${parcelId} approved by District Officer.`,
        timestamp: 'Just now',
        category: 'compensation',
        read: false,
        linkView: 'citizen_compensation',
      },
      ...prev,
    ]);
  };

  const rejectCompensation = (parcelId: string, reason: string) => {
    setLandParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          return {
            ...p,
            acquisitionStatus: 'Disputed',
            compensationStatus: 'Disputed',
            compensation: {
              ...p.compensation,
              officerRemarks: `Rejected: ${reason}`,
            },
          };
        }
        return p;
      })
    );
    showToast(`Compensation assessment for ${parcelId} returned for revision.`, 'warning');
    addAuditLog('Rejected Compensation Proposal', 'Compensation Assessment & Approval', reason, parcelId);
  };

  const requestDocuments = (parcelId: string, docsNote: string) => {
    showToast(`Document request notice dispatched to landowner for ${parcelId}.`, 'info');
    addAuditLog('Requested Additional Documents', 'Compensation Assessment & Approval', docsNote, parcelId);
  };

  const addGrievance = (data: {
    parcelId: string;
    citizenName: string;
    mobile: string;
    category: Grievance['category'];
    subject: string;
    description: string;
  }): string => {
    const generatedId = `GRV-2026-TS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance: Grievance = {
      id: generatedId,
      parcelId: data.parcelId,
      citizenName: data.citizenName,
      mobile: data.mobile,
      category: data.category,
      subject: data.subject,
      description: data.description,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      assignedOfficer: 'District Grievance Redressal Cell',
    };

    setGrievances((prev) => [newGrievance, ...prev]);
    showToast(`Grievance ${generatedId} filed successfully!`, 'success');
    addAuditLog('Filed Public Grievance', 'Grievance Redressal System', `Category: ${data.category}`, data.parcelId);
    return generatedId;
  };

  const updateGrievanceStatus = (id: string, status: Grievance['status'], resolutionNote?: string) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status,
              ...(resolutionNote ? { resolutionNote } : {}),
            }
          : g
      )
    );
    showToast(`Grievance ${id} status updated to ${status}`, 'success');
    addAuditLog('Updated Grievance Status', 'Grievance Redressal System', `Status: ${status}${resolutionNote ? ` | ${resolutionNote}` : ''}`, id);
  };

  const deleteGrievance = (id: string) => {
    setGrievances((prev) => prev.filter((g) => g.id !== id));
    showToast(`Grievance ${id} removed from registry`, 'info');
    addAuditLog('Deleted Grievance Record', 'Grievance Redressal System', `Removed petition ${id}`, id);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const addFieldPhoto = (photo: {
    parcelId: string;
    photoUrl: string;
    thumbnailUrl: string;
    caption: string;
    gpsCoords: { latitude: number; longitude: number; accuracyMeters: number };
    officerName: string;
  }) => {
    const newPhoto: FieldPhoto = {
      id: `PH-${Date.now().toString().slice(-4)}`,
      parcelId: photo.parcelId,
      photoUrl: photo.photoUrl,
      thumbnailUrl: photo.thumbnailUrl,
      caption: photo.caption,
      timestamp: new Date().toLocaleString('en-IN', { hour12: false }) + ' IST',
      gpsCoords: photo.gpsCoords,
      officerName: photo.officerName,
    };
    setFieldPhotos((prev) => [newPhoto, ...prev]);
    showToast('Field photo uploaded with verified GPS coordinates!', 'success');
    addAuditLog('Uploaded Geo-Tagged Photo', 'Field Evidence Upload', `${photo.caption} (${photo.gpsCoords.latitude}, ${photo.gpsCoords.longitude})`, photo.parcelId);
  };

  const addFieldDocument = (doc: {
    parcelId: string;
    title: string;
    category: FieldDocument['category'];
    uploadedBy: string;
    fileSize: string;
    fileType: 'pdf' | 'jpg' | 'png';
  }) => {
    const newDoc: FieldDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      parcelId: doc.parcelId,
      title: doc.title,
      category: doc.category,
      uploadedBy: doc.uploadedBy,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: doc.fileSize,
      status: 'Pending',
      version: 'v1.0',
      fileType: doc.fileType,
      documentHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };
    setFieldDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${doc.title}" uploaded to repository.`, 'success');
    addAuditLog('Uploaded Regulatory Document', 'Document Management Repository', `${doc.category} - ${doc.title}`, doc.parcelId);
  };

  const verifyConsentDocument = () => {
    setConsentDoc((prev) => ({
      ...prev,
      consentStatus: 'Verified',
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      versionHistory: [
        {
          version: `v${(parseFloat(prev.versionHistory[prev.versionHistory.length - 1].version.replace('v', '')) + 0.1).toFixed(1)}`,
          action: 'Consent digitally verified and sealed by District Authority',
          timestamp: new Date().toLocaleString('en-IN') + ' IST',
          officer: 'Ravi Kumar (LAO)',
        },
        ...prev.versionHistory,
      ],
    }));
    showToast('Land Acquisition Consent form digitally verified & cryptographically stamped!', 'success');
    addAuditLog('Verified Landowner Consent', 'Land Acquisition Consent', 'Aadhaar eSign & QR verification sealed', consentDoc.parcelId);
  };

  const startFieldAssignment = (assignmentId: string) => {
    setFieldAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'In Progress' } : a))
    );
    showToast('Field survey assignment activated.', 'info');
    setCurrentView('field_upload');
  };

  const calculateCompensation = (parcelId: string, calc: any) => {
    updateCompensation(parcelId, {
      baseCompensation: calc.multipliedLandValue || calc.basicLandValue,
      solatium: calc.solatiumAmount,
      totalCompensation: calc.totalCompensation,
    });
  };

  const submitConsent = (parcelId: string) => {
    setLandParcels((prev) =>
      prev.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              consentReceived: true,
              consentDate: new Date().toISOString().split('T')[0],
              compensationStatus: 'Approved' as const,
            }
          : p
      )
    );
    verifyConsentDocument();
  };

  const verifyFieldPhoto = (photoId: string) => {
    if (userRole !== 'field_officer') {
      showToast('Field evidence verification is restricted to the Field Officer role.', 'warning');
      return;
    }
    setFieldPhotos((prev) =>
      prev.map((ph) =>
        ph.id === photoId ? { ...ph, status: 'Verified' as const } : ph
      )
    );
    showToast(`Field Inspection photo ${photoId} verified & approved by Field Officer`, 'success');
  };

  const rejectFieldPhoto = (photoId: string, reason?: string) => {
    if (userRole !== 'field_officer') {
      showToast('Field evidence rejection is restricted to the Field Officer role.', 'warning');
      return;
    }
    setFieldPhotos((prev) =>
      prev.map((ph) =>
        ph.id === photoId ? { ...ph, status: 'Rejected' as const } : ph
      )
    );
    showToast(`Field Inspection photo ${photoId} marked as Rejected: ${reason || 'Re-survey required'}`, 'warning');
  };

  const approveAllFieldPhotos = (parcelId?: string) => {
    if (userRole !== 'field_officer') {
      showToast('Field photo approvals are strictly restricted to Field Officers', 'warning');
      return;
    }
    setFieldPhotos((prev) =>
      prev.map((ph) =>
        (!parcelId || ph.parcelId === parcelId) && ph.status !== 'Verified'
          ? { ...ph, status: 'Verified' as const }
          : ph
      )
    );
    showToast('All pending field inspection photos verified & approved by Field Officer', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeSector,
        setActiveSector,
        isLoggedIn,
        setIsLoggedIn,
        loggedInUser,
        setLoggedInUser,
        loginAsSector,
        loginAsRole,
        logout,
        currentView,
        setCurrentView,
        selectedProjectId,
        setSelectedProjectId,
        selectedParcelId,
        setSelectedParcelId,
        selectedStateId,
        setSelectedStateId,
        projects,
        landParcels,
        fieldPhotos,
        fieldDocuments,
        fieldAssignments,
        consentDoc,
        grievances,
        auditLogs,
        notifications,
        toasts,
        showToast,
        removeToast,
        updateCompensation,
        approveCompensation,
        rejectCompensation,
        requestDocuments,
        addGrievance,
        updateGrievanceStatus,
        deleteGrievance,
        lastSyncedAt,
        isRefreshing,
        refreshData,
        addAuditLog,
        markNotificationRead,
        markAllNotificationsRead,
        addFieldPhoto,
        addFieldDocument,
        verifyConsentDocument,
        startFieldAssignment,
        calculateCompensation,
        submitConsent,
        verifyFieldPhoto,
        rejectFieldPhoto,
        approveAllFieldPhotos,
        isChatbotOpen,
        setIsChatbotOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
