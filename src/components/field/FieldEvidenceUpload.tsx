import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Camera,
  UploadCloud,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  FileImage,
  Sparkles,
  Compass,
  Check,
  RefreshCw,
  Download,
  FileCheck,
  Layers,
  AlertCircle,
  CheckSquare,
  ShieldCheck,
  Landmark,
  Eye,
  Crosshair,
  ClipboardList,
  ArrowRight
} from 'lucide-react';

export const FieldEvidenceUpload: React.FC = () => {
  const {
    landParcels,
    fieldPhotos,
    fieldAssignments,
    startFieldAssignment,
    selectedParcelId,
    setSelectedParcelId,
    addFieldPhoto,
    verifyFieldPhoto,
    loggedInUser,
    userRole,
    showToast,
  } = useApp();

  const [parcelId, setParcelId] = useState(selectedParcelId || landParcels[0]?.id || 'TS-HYD-2026-001245');
  const [photoType, setPhotoType] = useState<
    'Boundary Marker' | 'Agricultural Crop' | 'Residential Structure' | 'Commercial Shed' | 'Borewell & Irrigation' | 'Tree Orchard'
  >('Boundary Marker');
  const [notes, setNotes] = useState('');
  const [officerId, setOfficerId] = useState(
    loggedInUser?.includes('Field') || loggedInUser?.includes('Rao')
      ? loggedInUser
      : 'FO-TEL-7842 (Vikramaditya Rao)'
  );

  React.useEffect(() => {
    if (loggedInUser) {
      setOfficerId(loggedInUser);
    }
  }, [loggedInUser]);

  React.useEffect(() => {
    if (selectedParcelId) {
      setParcelId(selectedParcelId);
    }
  }, [selectedParcelId]);

  // Boundary pegging status checklist for current parcel
  const [boundaryPegs, setBoundaryPegs] = useState<Record<string, boolean>>({
    'BP-01 (Northwest Corner - 17.4485°N, 78.6812°E)': true,
    'BP-02 (Northeast Corner - 17.4491°N, 78.6825°E)': true,
    'BP-03 (Southeast Corner - 17.4478°N, 78.6830°E)': false,
    'BP-04 (Southwest Corner - 17.4472°N, 78.6816°E)': false,
  });

  // Spot Landowner Presence verification
  const [landownerVerifiedSpot, setLandownerVerifiedSpot] = useState(false);

  // GPS Simulation state
  const [gpsCoord, setGpsCoord] = useState<{ lat: number; lng: number }>({
    lat: 17.4485,
    lng: 78.6812,
  });
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(0.4);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const currentParcel = landParcels.find((p) => p.id === parcelId) || landParcels[0];

  // Selected sample image
  const sampleImages = [
    {
      label: 'Cadastral Boundary Peg BP-01',
      category: 'Boundary Marker',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Standing Paddy Crop Assessment',
      category: 'Agricultural Crop',
      url: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Residential Boundary Wall',
      category: 'Residential Structure',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Deep Tube Well & Power Pump',
      category: 'Borewell & Irrigation',
      url: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Commercial Storage Godown',
      category: 'Commercial Shed',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Perennial Mango & Teak Orchard',
      category: 'Tree Orchard',
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    },
  ];
  const [selectedSampleUrl, setSelectedSampleUrl] = useState(sampleImages[0].url);

  const handleSimulateGPS = () => {
    setIsCapturingGps(true);
    setTimeout(() => {
      const lat = 17.4400 + Math.random() * 0.02;
      const lng = 78.6700 + Math.random() * 0.02;
      setGpsCoord({ lat: parseFloat(lat.toFixed(5)), lng: parseFloat(lng.toFixed(5)) });
      setGpsAccuracy(parseFloat((0.3 + Math.random() * 0.3).toFixed(1)));
      setIsCapturingGps(false);
      showToast('Differential GPS RTK fix locked with sub-meter accuracy (±0.4m)', 'success');
    }, 500);
  };

  const handleTogglePeg = (pegName: string) => {
    setBoundaryPegs((prev) => {
      const updated = { ...prev, [pegName]: !prev[pegName] };
      showToast(
        `${pegName.split(' ')[0]} ${!prev[pegName] ? 'marked as physically pegged & demarcated' : 'unmarked'}`,
        'info'
      );
      return updated;
    });
  };

  const handleSpotLandownerVerify = () => {
    setLandownerVerifiedSpot(true);
    showToast(
      `Joint presence of landowner ${currentParcel?.landownerName || 'Citizen'} recorded on spot via Aadhaar authentication!`,
      'success'
    );
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      showToast('Please enter brief field inspection notes', 'warning');
      return;
    }

    addFieldPhoto({
      parcelId,
      photoUrl: selectedSampleUrl,
      thumbnailUrl: selectedSampleUrl,
      caption: `${photoType}: ${notes.slice(0, 50)}`,
      gpsCoords: {
        latitude: gpsCoord.lat,
        longitude: gpsCoord.lng,
        accuracyMeters: gpsAccuracy,
      },
      officerName: officerId,
    });
    setNotes('');
    showToast('Inspection photo & DGPS evidence cryptographically signed and stored.', 'success');
  };

  const handleSelectAssignment = (assignParcelId: string) => {
    setParcelId(assignParcelId);
    setSelectedParcelId(assignParcelId);
    showToast(`Loaded survey assignment for plot ${assignParcelId}`, 'info');
  };

  const handleDownloadCertificate = () => {
    const certText = `================================================================================
GOVERNMENT OF TELANGANA / NATIONAL HIGHWAYS AUTHORITY OF INDIA
DEPARTMENT OF SURVEY, SETTLEMENT & LAND RECORDS
STATUTORY FIELD VERIFICATION & CADASTRAL INSPECTION CERTIFICATE
================================================================================

CERTIFICATE ID: CERT-FV-${Date.now().toString().slice(-6)}
DATE OF INSPECTION: ${new Date().toLocaleDateString('en-IN')}
INSPECTING OFFICER: ${officerId}
SURVEY ROVER DEVICE: Trimble R12i GNSS DGPS Rover (S/N: TRM-2026-8941)
RTK FIX QUALITY: Carrier-Phase RTK Fixed | Constellation: NavIC/IRNSS + GLONASS

1. LAND PARCEL SPECIFICATION
--------------------------------------------------------------------------------
Parcel Identifier: ${currentParcel?.id || parcelId}
Survey / Khasra No: ${currentParcel?.surveyNumber || '145/2'}
Recorded Landowner: ${currentParcel?.landownerName || 'Rajesh Kumar'}
Location: Ghatkesar Village, Medchal-Malkajgiri District, Telangana
Total Demarcated Extent: ${currentParcel?.areaAcres || 1.75} Acres
Acquisition Purpose: Hyderabad-Vijayawada Expressway (NH-65 Corridor Expansion)

2. VERIFIED BOUNDARY COORDINATES (WGS-84 / UTM 44N)
--------------------------------------------------------------------------------
- BP-01 (NW Corner): 17.44850° N, 78.68120° E [Pegged: ${boundaryPegs['BP-01 (Northwest Corner - 17.4485°N, 78.6812°E)'] ? 'YES' : 'PENDING'}]
- BP-02 (NE Corner): 17.44910° N, 78.68250° E [Pegged: ${boundaryPegs['BP-02 (Northeast Corner - 17.4491°N, 78.6825°E)'] ? 'YES' : 'PENDING'}]
- BP-03 (SE Corner): 17.44780° N, 78.68300° E [Pegged: ${boundaryPegs['BP-03 (Southeast Corner - 17.4478°N, 78.6830°E)'] ? 'YES' : 'PENDING'}]
- BP-04 (SW Corner): 17.44720° N, 78.68160° E [Pegged: ${boundaryPegs['BP-04 (Southwest Corner - 17.4472°N, 78.6816°E)'] ? 'YES' : 'PENDING'}]

3. ON-SPOT ASSET & STRUCTURE CENSUS
--------------------------------------------------------------------------------
- Standing Crop: Perennial Mango Orchard & Cotton crop verified
- Immovable Assets: 1 Commercial Borewell (600 ft) with 5HP pump
- Structures: Boundary stone demarcation pillars set at all 4 corners
- Joint Inspection Landowner Presence: ${landownerVerifiedSpot ? 'VERIFIED (Aadhaar e-KYC Matched)' : 'RECORDED BY LOCAL PANCHAYAT WITNESS'}

4. DIGITAL ATTESTATION
--------------------------------------------------------------------------------
Certified that the boundaries of Plot ${currentParcel?.id || parcelId} have been physically
verified on the ground with RTK DGPS rover and found free of disputes.

Digitally Sealed by:
${officerId}
Senior Field Officer & Surveyor
Government of Telangana / NHAI Project Cell
SHA-256 Checksum: 0x8f4c718b29de41098b63a201fe9941da
================================================================================`;

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Field_Verification_Report_${parcelId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Field Inspection Certificate downloaded successfully', 'success');
  };

  const filteredPhotos = fieldPhotos.filter((p) => {
    const matchesParcel = !parcelId || p.parcelId === parcelId;
    if (selectedCategoryFilter === 'All') return matchesParcel;
    return matchesParcel && p.caption.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs uppercase font-mono text-emerald-900 font-bold tracking-wider">
              Official Field Officer Console • On-Ground Cadastral Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Field Verification & Evidence Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time on-ground photographic evidence with sub-meter RTK GPS timestamps, boundary pegging, and asset enumeration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadCertificate}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
            title="Export official certified field survey docket"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Download Field Certificate</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">Target Plot:</span>
            <select
              value={parcelId}
              onChange={(e) => {
                setParcelId(e.target.value);
                setSelectedParcelId(e.target.value);
              }}
              className="bg-transparent text-slate-900 text-xs font-mono font-bold focus:outline-none cursor-pointer"
            >
              {landParcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} (Sy. {p.surveyNumber} • {p.landownerName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Field Officer Credentials & Active Rover Pill */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{officerId}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">
                Authorized Field Officer
              </span>
            </div>
            <span className="text-[11px] text-slate-600">
              Department of Survey, Settlement & Land Records • Govt of Telangana
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-slate-600 font-mono">
            <Crosshair className="w-3.5 h-3.5 text-emerald-700" />
            <span>Trimble R12i GNSS Rover (TRM-8941)</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-emerald-800 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>RTK FIXED (±0.4m)</span>
          </div>
        </div>
      </div>

      {/* Section 1: Active Field Verification Assignments Queue */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Assigned Field Verification Tasks ({fieldAssignments.length} Parcels In Queue)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Click any assignment to immediately inspect and upload ground evidence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {fieldAssignments.map((assign) => {
            const isCurrent = assign.parcelId === parcelId;
            return (
              <div
                key={assign.id}
                onClick={() => handleSelectAssignment(assign.parcelId)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-400 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      Sy. No. {assign.surveyNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        assign.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {assign.status}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-800">{assign.landownerName}</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {assign.village}, {assign.district} • {assign.projectName}
                  </div>

                  {/* Tasks list */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Required Checks:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {assign.requiredTasks.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-500">{assign.id}</span>
                  <span className={`text-[11px] font-bold ${isCurrent ? 'text-emerald-800' : 'text-blue-700'}`}>
                    {isCurrent ? '● Active Inspection' : 'Select for Survey →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Field Verification Assignments */}
      {fieldAssignments && fieldAssignments.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-700" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Assigned Field Survey Tasks ({fieldAssignments.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Official on-ground inspection orders assigned to {officerId}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 self-start sm:self-auto">
              Trimble R12i GNSS Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {fieldAssignments.map((asn) => {
              const isSelected = parcelId === asn.parcelId;
              return (
                <div
                  key={asn.id}
                  onClick={() => {
                    setParcelId(asn.parcelId);
                    setSelectedParcelId(asn.parcelId);
                    showToast(`Selected Survey Sy. ${asn.surveyNumber} (${asn.village})`, 'info');
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-600 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-blue-900">{asn.parcelId}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        asn.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {asn.priority} Priority
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-xs truncate">
                    Sy {asn.surveyNumber} • {asn.landownerName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {asn.village}, {asn.district}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{asn.requiredTasks.length} tasks</span>
                    <span className="font-semibold text-blue-700 flex items-center gap-0.5">
                      {isSelected ? 'Active Target' : 'Select'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Interface Form + GPS Satellite Lock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold text-slate-900">
                Upload Field Inspection Photo & Evidence
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-semibold">
              Ready for Capture
            </span>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Parcel & Photo Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Land Parcel
                </label>
                <select
                  value={parcelId}
                  onChange={(e) => {
                    setParcelId(e.target.value);
                    setSelectedParcelId(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none"
                >
                  {landParcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - Sy {p.surveyNumber} ({p.landownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evidence Category
                </label>
                <select
                  value={photoType}
                  onChange={(e: any) => setPhotoType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-blue-700 focus:bg-white focus:outline-none"
                >
                  <option value="Boundary Marker">Boundary Marker / Concrete Peg</option>
                  <option value="Agricultural Crop">Standing Agricultural Crop</option>
                  <option value="Residential Structure">Residential Structure / Wall</option>
                  <option value="Commercial Shed">Commercial / Industrial Shed</option>
                  <option value="Borewell & Irrigation">Borewell & Irrigation System</option>
                  <option value="Tree Orchard">Tree Orchard (Timber/Fruit)</option>
                </select>
              </div>
            </div>

            {/* Photo Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select or Capture Inspection Photograph (Realistic Field Evidence)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {sampleImages.map((img) => (
                  <div
                    key={img.label}
                    onClick={() => {
                      setSelectedSampleUrl(img.url);
                      setPhotoType(img.category as any);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video group ${
                      selectedSampleUrl === img.url
                        ? 'border-emerald-600 ring-2 ring-emerald-200'
                        : 'border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {selectedSampleUrl === img.url && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/85 text-[9.5px] text-white p-1 truncate font-medium">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspection Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inspection Notes & Cadastral Survey Remarks
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Concrete survey pillar BP-01 verified in presence of revenue patwari and landowner Rajesh Kumar. No encroachment noted."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Sign & Geo-Tag Evidence to Cadastral Database</span>
            </button>
          </form>
        </div>

        {/* GPS Satellite Lock Simulator + Landowner Spot Check Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* GPS Hardware Sync Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-bold text-slate-900">
                  NavIC / GPS Hardware Sync
                </h2>
              </div>
              <button
                onClick={handleSimulateGPS}
                disabled={isCapturingGps}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-mono flex items-center gap-1.5 transition-colors font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isCapturingGps ? 'animate-spin' : ''}`} />
                <span>Re-Acquire RTK</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 font-medium">Current GPS Fix:</span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    RTK FIXED (3D)
                  </span>
                </div>
                <p className="font-mono text-xl font-bold text-slate-900 tracking-wider">
                  {gpsCoord.lat}° N, {gpsCoord.lng}° E
                </p>
                <p className="text-[11px] text-blue-900 mt-0.5 font-mono font-medium">
                  Horizontal Accuracy: ±{gpsAccuracy}m • Satellites Locked: 18 NavIC/GLONASS
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Authorized Field Officer:</span>
                  <span className="text-slate-900 font-semibold">{officerId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Survey Equipment:</span>
                  <span className="text-slate-900 font-medium">Trimble R12i GNSS Rover</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cryptographic Nonce:</span>
                  <span className="text-blue-900 font-mono text-[10.5px] font-semibold">
                    SHA256: 9b2d...f4a1
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Landowner Spot Presence & Joint Verification */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-slate-900">
                  Joint Landowner Spot Verification
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  landownerVerifiedSpot
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {landownerVerifiedSpot ? 'Joint Presence Verified' : 'Awaiting Field Witness'}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Landowner Name:</span>
                <strong className="text-slate-900">{currentParcel?.landownerName || 'Rajesh Kumar'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Survey / Plot:</span>
                <span className="font-mono">{currentParcel?.surveyNumber || '145/2'} ({currentParcel?.id})</span>
              </div>
              <div className="flex justify-between">
                <span>Aadhaar Link:</span>
                <span className="text-emerald-700 font-semibold">Matched (xxxx-xxxx-4819)</span>
              </div>
            </div>

            {!landownerVerifiedSpot ? (
              userRole === 'field_officer' ? (
                <button
                  type="button"
                  onClick={handleSpotLandownerVerify}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Landowner Physical Presence</span>
                </button>
              ) : (
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500 text-xs text-center font-medium">
                  Field Officer authorization required to verify presence
                </div>
              )
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Landowner Joint Inspection Certificate Stamped</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Four-Corner Boundary Pegging & Pillar Demarcation Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Boundary Pegging & Cadastral Stone Monumentation (Sy. {currentParcel?.surveyNumber})</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Physical boundary pillars placed at the 4 vertices of the acquired corridor area
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {Object.values(boundaryPegs).filter(Boolean).length} of 4 Pegs Demarcated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(boundaryPegs).map(([pegName, isPegged]) => (
            <div
              key={pegName}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isPegged
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    {pegName.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isPegged
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isPegged ? 'Demarcated' : 'Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono mb-2">
                  {pegName.split('(')[1]?.replace(')', '') || '17.4485°N, 78.6812°E'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTogglePeg(pegName)}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  isPegged
                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isPegged ? 'Peg Verified' : 'Mark Pegged'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Evidence Gallery with Filters */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-blue-700" />
              <span>Inspection Evidence Gallery</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Field evidence logs tagged to Cadastral Survey records for Plot {parcelId}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Filter:</span>
            {['All', 'Boundary', 'Crop', 'Residential', 'Commercial'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategoryFilter === cat
                    ? 'bg-blue-700 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const isVerified = photo.status === 'Verified';
            return (
              <div
                key={photo.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all shadow-2xs group"
              >
                {/* Image display */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={photo.photoUrl || photo.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="font-mono text-[10px] font-bold text-slate-900 bg-white/95 px-2 py-0.5 rounded shadow-xs border border-slate-200">
                      {photo.parcelId}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={photo.status || 'Verified'} />
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 line-clamp-2 mb-2">
                      {photo.caption}
                    </p>

                    <div className="space-y-1 text-slate-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-700" />
                        <span className="truncate">
                          {photo.gpsCoords
                            ? `${photo.gpsCoords.latitude}°N, ${photo.gpsCoords.longitude}°E`
                            : photo.gpsCoordinates || '17.4485°N, 78.6812°E'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{photo.timestamp || '2026-09-08 10:30 IST'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <UserCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{photo.officerName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isVerified ? (
                      <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified & Approved by Field Officer</span>
                      </span>
                    ) : userRole === 'field_officer' ? (
                      <button
                        onClick={() => verifyFieldPhoto(photo.id)}
                        className="w-full py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirm Field Officer Approval</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Field Officer approval required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
