import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Compass,
  Search,
  ZoomIn,
  ZoomOut,
  Layers,
  MapPin,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Camera,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Download,
  Filter,
  Maximize2,
  Share2,
  FileText,
  Building2,
  ArrowUpRight,
  Check,
  Info,
} from 'lucide-react';
import { LandParcel } from '../../types';

export const GisMap: React.FC = () => {
  const {
    landParcels,
    selectedParcelId,
    setSelectedParcelId,
    setCurrentView,
    userRole,
    setUserRole,
    showToast,
  } = useApp();

  const [searchSurvey, setSearchSurvey] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<'cadastral' | 'satellite' | 'topo'>('cadastral');
  const [showAlignment, setShowAlignment] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const mapSvgRef = useRef<SVGSVGElement | null>(null);

  const selectedParcel =
    landParcels.find((p) => p.id === selectedParcelId) || landParcels[0];

  const filteredParcels = landParcels.filter((p) => {
    const matchesSearch =
      p.surveyNumber.toLowerCase().includes(searchSurvey.toLowerCase()) ||
      p.id.toLowerCase().includes(searchSurvey.toLowerCase()) ||
      p.landownerName.toLowerCase().includes(searchSurvey.toLowerCase()) ||
      p.village.toLowerCase().includes(searchSurvey.toLowerCase());

    const pStatus = p.acquisitionStatus || p.status || '';
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Acquired' && (pStatus.includes('Acquired') || pStatus.includes('Possession Completed'))) ||
      (statusFilter === 'Pending' && (pStatus.includes('Pending') || pStatus.includes('Notification') || pStatus.includes('Proposed'))) ||
      (statusFilter === 'Disputed' && pStatus.includes('Dispute')) ||
      (statusFilter === 'Compensation' && (pStatus.includes('Compensation') || pStatus.includes('Verification')));

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalParcelsCount = landParcels.length;
  const acquiredCount = landParcels.filter((p) => {
    const s = p.acquisitionStatus || p.status || '';
    return s.includes('Acquired') || s.includes('Possession Completed');
  }).length;
  const disputedCount = landParcels.filter((p) => (p.acquisitionStatus || p.status || '').includes('Dispute')).length;
  const pendingCount = landParcels.filter((p) => {
    const s = p.acquisitionStatus || p.status || '';
    return s.includes('Pending') || s.includes('Notification') || s.includes('Proposed');
  }).length;
  const inProgressCount = totalParcelsCount - acquiredCount - disputedCount - pendingCount;

  const getParcelColor = (status?: string, isSat: boolean = false) => {
    switch (status) {
      case 'Land Acquired':
      case 'Acquired':
      case 'Possession Completed':
        return {
          fill: isSat ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.24)',
          hoverFill: isSat ? 'rgba(16, 185, 129, 0.65)' : 'rgba(16, 185, 129, 0.4)',
          stroke: isSat ? '#34D399' : '#059669',
          selectedStroke: '#047857',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          name: 'Land Acquired',
        };
      case 'Proposed':
      case 'Notification Issued':
      case 'Pending':
        return {
          fill: isSat ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.24)',
          hoverFill: isSat ? 'rgba(245, 158, 11, 0.65)' : 'rgba(245, 158, 11, 0.4)',
          stroke: isSat ? '#FBBF24' : '#D97706',
          selectedStroke: '#B45309',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
          name: 'Pending / Notification',
        };
      case 'Disputed':
      case 'Under Dispute':
        return {
          fill: isSat ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.24)',
          hoverFill: isSat ? 'rgba(239, 68, 68, 0.65)' : 'rgba(239, 68, 68, 0.4)',
          stroke: isSat ? '#F87171' : '#DC2626',
          selectedStroke: '#B91C1C',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
          name: 'Under Legal Dispute',
        };
      case 'Compensation Pending':
      case 'Compensation In Progress':
      case 'Under Verification':
      default:
        return {
          fill: isSat ? 'rgba(37, 99, 235, 0.45)' : 'rgba(37, 99, 235, 0.22)',
          hoverFill: isSat ? 'rgba(37, 99, 235, 0.65)' : 'rgba(37, 99, 235, 0.38)',
          stroke: isSat ? '#60A5FA' : '#1D4ED8',
          selectedStroke: '#1E40AF',
          badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-600',
          name: 'Compensation In Progress',
        };
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    showToast('Viewport reset to default cadastral center', 'info');
  };

  // Step between parcels
  const currentIndex = landParcels.findIndex((p) => p.id === selectedParcel?.id);
  const handlePrevParcel = () => {
    const prevIdx = (currentIndex - 1 + landParcels.length) % landParcels.length;
    setSelectedParcelId(landParcels[prevIdx].id);
  };
  const handleNextParcel = () => {
    const nextIdx = (currentIndex + 1) % landParcels.length;
    setSelectedParcelId(landParcels[nextIdx].id);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              National Cadastral Geodatabase • GIS Map Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Cadastral Land Mapping & Corridor Alignment
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Interactive GIS survey parcel demarcations, statutory 60m Right-of-Way (ROW) buffer, and high-definition aerial survey layers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Stats Chips */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
            <span className="text-slate-500 font-medium">Parcels:</span>
            <span className="font-bold text-slate-900">{totalParcelsCount}</span>
            <span className="text-slate-300">|</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-emerald-800">{acquiredCount} Acquired</span>
            <span className="text-slate-300">|</span>
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-amber-800">{pendingCount} Pending</span>
          </div>

          <button
            onClick={() => showToast('Exported Cadastral Shapefile / GeoJSON package', 'success')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export GIS Layer</span>
          </button>
        </div>
      </div>

      {/* Main Row: Map Canvas (Left) + Survey Details Inspector Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================ */}
        {/* Left: GIS Map Viewport (Unobstructed & Clean)               */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Toolbar above the map */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            {/* Search by Survey Number */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchSurvey}
                onChange={(e) => setSearchSurvey(e.target.value)}
                placeholder="Search Survey No. (e.g. 145/2)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white transition-all"
              />
            </div>

            {/* Layer Switcher (Cadastral / Satellite / Topo) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setActiveLayer('cadastral')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeLayer === 'cadastral'
                    ? 'bg-white text-blue-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cadastral
              </button>
              <button
                onClick={() => setActiveLayer('satellite')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeLayer === 'satellite'
                    ? 'bg-white text-blue-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setActiveLayer('topo')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeLayer === 'topo'
                    ? 'bg-white text-blue-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Topographic
              </button>
            </div>

            {/* Highway Corridor Alignment Toggle */}
            <button
              onClick={() => setShowAlignment(!showAlignment)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                showAlignment
                  ? 'bg-blue-50 text-blue-900 border-blue-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>60m ROW Buffer</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
                className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold px-2 text-slate-700 min-w-[40px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
                className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-slate-200 mx-0.5" />
              <button
                onClick={handleResetView}
                className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Clean Map Viewport Container */}
          <div
            className={`relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs select-none transition-colors ${
              activeLayer === 'satellite'
                ? 'bg-[#15231c]'
                : activeLayer === 'topo'
                ? 'bg-[#F4F6F8]'
                : 'bg-[#F8FAFC]'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Background Texture based on Active Layer */}
            {activeLayer === 'satellite' && (
              <div className="absolute inset-0 pointer-events-none opacity-30">
                {/* Satellite terrain simulation pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-[#13281c] to-[#0a1810]" />
              </div>
            )}

            {activeLayer === 'topo' && (
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {/* Topographic contour texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px]" />
              </div>
            )}

            {/* Map Interactive SVG Stage */}
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-100 relative"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              <svg
                ref={mapSvgRef}
                viewBox="0 0 800 600"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Highway road asphalt pattern */}
                  <pattern id="roadHatch" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="20" height="20" fill="rgba(148, 163, 184, 0.08)" />
                    <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(100, 116, 139, 0.15)" strokeWidth="1" />
                  </pattern>

                  {/* Surveyor Grid Pattern */}
                  <pattern id="surveyGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="none"
                      stroke={activeLayer === 'satellite' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.2)'}
                      strokeWidth="0.8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="1.5"
                      fill={activeLayer === 'satellite' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(100, 116, 139, 0.3)'}
                    />
                  </pattern>

                  {/* Water Ripple Gradient */}
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#0284C7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Selected parcel glowing filter */}
                  <filter id="focusShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1D4ED8" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Background Surveyor Grid */}
                <rect width="800" height="600" fill="url(#surveyGrid)" />

                {/* Topographic Contour Lines in Topo Mode */}
                {activeLayer === 'topo' && (
                  <g opacity="0.35" stroke="#94A3B8" fill="none" strokeWidth="1">
                    <path d="M 0,200 Q 250,150 500,220 T 800,180" />
                    <text x="60" y="190" fontSize="9" fill="#64748B" fontFamily="monospace">EL: 540m</text>
                    <path d="M 0,350 Q 280,310 520,380 T 800,320" />
                    <text x="60" y="340" fontSize="9" fill="#64748B" fontFamily="monospace">EL: 550m</text>
                    <path d="M 0,500 Q 300,450 550,520 T 800,470" />
                    <text x="60" y="490" fontSize="9" fill="#64748B" fontFamily="monospace">EL: 560m</text>
                  </g>
                )}

                {/* Natural River / Waterbody (Musi River Tributary) */}
                <g>
                  <path
                    d="M -50,120 Q 200,180 350,110 T 850,220"
                    fill="none"
                    stroke={activeLayer === 'satellite' ? 'rgba(56, 189, 248, 0.4)' : '#BAE6FD'}
                    strokeWidth="32"
                    strokeLinecap="round"
                  />
                  <path
                    d="M -50,120 Q 200,180 350,110 T 850,220"
                    fill="none"
                    stroke={activeLayer === 'satellite' ? '#38BDF8' : '#38BDF8'}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeOpacity="0.7"
                  />
                  <text
                    x="70"
                    y="155"
                    fill={activeLayer === 'satellite' ? '#7DD3FC' : '#0369A1'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="sans-serif"
                    letterSpacing="0.5"
                  >
                    Musi River Tributary / Drainage Hydrology
                  </text>
                </g>

                {/* 60m Highway Alignment ROW Buffer Zone */}
                {showAlignment && (
                  <g>
                    {/* 60-meter ROW zone strip */}
                    <path
                      d="M 50,450 C 220,410 380,280 580,230 S 760,120 820,100"
                      fill="none"
                      stroke={activeLayer === 'satellite' ? 'rgba(253, 224, 71, 0.15)' : 'rgba(59, 130, 246, 0.12)'}
                      strokeWidth="76"
                      strokeLinecap="round"
                    />
                    {/* ROW Boundary Outer Dashed Lines */}
                    <path
                      d="M 40,412 C 210,372 370,242 570,192 S 750,82 810,62"
                      fill="none"
                      stroke={activeLayer === 'satellite' ? '#FDE047' : '#94A3B8'}
                      strokeWidth="1.2"
                      strokeDasharray="5 3"
                    />
                    <path
                      d="M 60,488 C 230,448 390,318 590,268 S 770,158 830,138"
                      fill="none"
                      stroke={activeLayer === 'satellite' ? '#FDE047' : '#94A3B8'}
                      strokeWidth="1.2"
                      strokeDasharray="5 3"
                    />

                    {/* Dual Carriageway Asphalt Roadway */}
                    <path
                      d="M 50,450 C 220,410 380,280 580,230 S 760,120 820,100"
                      fill="none"
                      stroke={activeLayer === 'satellite' ? '#1E293B' : '#334155'}
                      strokeWidth="24"
                      strokeLinecap="round"
                    />
                    {/* Road White Shoulders */}
                    <path
                      d="M 50,450 C 220,410 380,280 580,230 S 760,120 820,100"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="22"
                      strokeOpacity="0.15"
                      strokeLinecap="round"
                    />
                    {/* Centerline Divider (Amber dashes) */}
                    <path
                      d="M 50,450 C 220,410 380,280 580,230 S 760,120 820,100"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                    />

                    {/* Highway Corridor Marker Pill */}
                    <g transform="translate(420, 240)">
                      <rect
                        x="-10"
                        y="-14"
                        width="210"
                        height="20"
                        rx="4"
                        fill={activeLayer === 'satellite' ? '#0F172A' : '#1E293B'}
                        stroke="#F59E0B"
                        strokeWidth="1"
                      />
                      <text
                        x="95"
                        y="0"
                        textAnchor="middle"
                        fill="#F8FAFC"
                        fontSize="9.5"
                        fontWeight="bold"
                        letterSpacing="0.5"
                        fontFamily="monospace"
                      >
                        NH-65 EXPRESSWAY (ROW: 60M)
                      </text>
                    </g>

                    {/* Chainage distance flags */}
                    <g transform="translate(180, 420)">
                      <circle cx="0" cy="0" r="3" fill="#F59E0B" />
                      <text x="6" y="3" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="monospace">KM 42+000</text>
                    </g>
                    <g transform="translate(340, 310)">
                      <circle cx="0" cy="0" r="3" fill="#F59E0B" />
                      <text x="6" y="3" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="monospace">KM 42+500</text>
                    </g>
                    <g transform="translate(680, 160)">
                      <circle cx="0" cy="0" r="3" fill="#F59E0B" />
                      <text x="6" y="3" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="monospace">KM 43+000</text>
                    </g>
                  </g>
                )}

                {/* Cadastral Land Parcel Polygons */}
                {filteredParcels.map((parcel) => {
                  const parcelStatus = parcel.acquisitionStatus || parcel.status;
                  const isSat = activeLayer === 'satellite';
                  const colors = getParcelColor(parcelStatus, isSat);
                  const isSelected = selectedParcel?.id === parcel.id;
                  const pointsStr = parcel.polygonCoords
                    ? parcel.polygonCoords.map(([x, y]) => `${x},${y}`).join(' ')
                    : parcel.coordinates
                    ? parcel.coordinates.map((pt) => `${pt.x},${pt.y}`).join(' ')
                    : '100,100 200,100 200,200 100,200';

                  const avgX = parcel.center
                    ? parcel.center[0]
                    : parcel.coordinates
                    ? parcel.coordinates.reduce((sum, p) => sum + p.x, 0) / parcel.coordinates.length
                    : 400;
                  const avgY = parcel.center
                    ? parcel.center[1]
                    : parcel.coordinates
                    ? parcel.coordinates.reduce((sum, p) => sum + p.y, 0) / parcel.coordinates.length
                    : 300;

                  return (
                    <g
                      key={parcel.id}
                      onClick={() => {
                        setSelectedParcelId(parcel.id);
                        showToast(`Selected Sy No. ${parcel.surveyNumber} • ${parcel.landownerName}`, 'info');
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Polygon Base */}
                      <polygon
                        points={pointsStr}
                        fill={isSelected ? colors.hoverFill : colors.fill}
                        stroke={isSelected ? '#1D4ED8' : colors.stroke}
                        strokeWidth={isSelected ? '2.8' : '1.8'}
                        strokeLinejoin="round"
                        className="transition-all duration-150 group-hover:brightness-110"
                      />

                      {/* Selected Halo Outline */}
                      {isSelected && (
                        <polygon
                          points={pointsStr}
                          fill="none"
                          stroke="#1D4ED8"
                          strokeWidth="6"
                          strokeOpacity="0.25"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Clean Survey Label Pill (High contrast & readable on all maps) */}
                      <g transform={`translate(${avgX}, ${avgY})`}>
                        {/* Background badge */}
                        <rect
                          x="-32"
                          y="-16"
                          width="64"
                          height="28"
                          rx="5"
                          fill={isSelected ? '#1E3A8A' : '#FFFFFF'}
                          fillOpacity={isSelected ? '0.96' : '0.94'}
                          stroke={isSelected ? '#1D4ED8' : '#CBD5E1'}
                          strokeWidth={isSelected ? '1.5' : '1'}
                          className="shadow-xs"
                        />
                        {/* Survey Number text */}
                        <text
                          x="0"
                          y="-3"
                          textAnchor="middle"
                          fill={isSelected ? '#FFFFFF' : '#0F172A'}
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          Sy {parcel.surveyNumber}
                        </text>
                        {/* Area in Acres text */}
                        <text
                          x="0"
                          y="8"
                          textAnchor="middle"
                          fill={isSelected ? '#93C5FD' : '#475569'}
                          fontSize="8"
                          fontWeight="600"
                          fontFamily="sans-serif"
                        >
                          {parcel.areaAcres} Ac
                        </text>
                      </g>

                      {/* Selected Pin Marker on Centroid */}
                      {isSelected && (
                        <g transform={`translate(${avgX}, ${avgY - 26})`}>
                          <circle cx="0" cy="0" r="4" fill="#1D4ED8" />
                          <circle cx="0" cy="0" r="8" fill="#1D4ED8" fillOpacity="0.2" className="animate-ping" />
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom-Left Minimal Status Legend Chip (Non-intrusive) */}
            {showLegend ? (
              <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-2xs backdrop-blur-xs text-xs z-10 max-w-[210px]">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5 border-b border-slate-100 pb-1">
                  <span className="flex items-center gap-1.5 text-blue-900 font-mono text-[10px] uppercase tracking-wider">
                    <Layers className="w-3 h-3 text-blue-700" />
                    Parcel Status
                  </span>
                  <button
                    onClick={() => setShowLegend(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 font-normal"
                  >
                    Hide
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-600 shrink-0" />
                    <span className="text-slate-700 text-[10.5px]">Acquired ({acquiredCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 border border-amber-600 shrink-0" />
                    <span className="text-slate-700 text-[10.5px]">Pending ({pendingCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-600 shrink-0" />
                    <span className="text-slate-700 text-[10.5px]">Disputed ({disputedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 border border-blue-700 shrink-0" />
                    <span className="text-slate-700 text-[10.5px]">In Progress ({inProgressCount})</span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLegend(true)}
                className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-white/95 border border-slate-200 text-[11px] font-semibold text-blue-900 shadow-2xs z-10 flex items-center gap-1"
              >
                <Layers className="w-3 h-3 text-blue-700" />
                <span>Legend</span>
              </button>
            )}

            {/* Bottom-Right Coordinates & Scale Bar */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 text-[10px] font-mono text-slate-600 shadow-2xs z-10 flex items-center gap-3 pointer-events-none">
              <span>Telangana State Cadastre</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="border-b-2 border-slate-700 w-8 inline-block" />
                <span>100m</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Right: Dedicated Survey Parcel Inspector (PROPER POSITION)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {selectedParcel ? (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-mono font-bold">
                      Sy No: {selectedParcel.surveyNumber}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {selectedParcel.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Survey Parcel Inspector
                  </h3>
                </div>

                {/* Step through parcels */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevParcel}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    title="Previous Parcel"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextParcel}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    title="Next Parcel"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <StatusBadge status={selectedParcel.acquisitionStatus || selectedParcel.status || 'Pending'} />
              </div>

              {/* Parcel Attribute Key-Values */}
              <div className="space-y-2.5 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Landowner Legal Entity:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.landownerName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Acquired Extent:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {selectedParcel.areaAcres} Acres
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Land Classification:</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-800">
                    {selectedParcel.landType}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revenue Village / Mandal:</span>
                  <span className="font-medium text-slate-800">
                    {selectedParcel.village}, {selectedParcel.district}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Possession Demarcation:</span>
                  <span className="font-medium text-slate-700">
                    {selectedParcel.possessionStatus || 'Demarcated'}
                  </span>
                </div>

                {selectedParcel.maskedAadhaar && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Aadhaar (Masked):</span>
                    <span className="font-mono text-slate-600">{selectedParcel.maskedAadhaar}</span>
                  </div>
                )}
              </div>

              {/* Statutory Valuation Card (RFCTLARR 2013) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Govt Circle Rate / Acre:</span>
                  <span className="font-mono font-medium text-slate-900">
                    ₹{(selectedParcel.compensation?.governmentRatePerAcre || selectedParcel.marketValuePerAcre || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>100% Statutory Solatium:</span>
                  <span className="font-mono font-medium text-slate-900">
                    ₹{(selectedParcel.compensation?.solatium || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t border-slate-200/80 pt-1.5 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total Statutory Award:</span>
                  <span className="font-bold text-sm text-emerald-700 font-mono">
                    ₹{(selectedParcel.compensation?.totalCompensation || selectedParcel.totalCompensation || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setUserRole('officer');
                    setCurrentView('compensation');
                    showToast(`Loaded valuation hearing for Sy ${selectedParcel.surveyNumber}`, 'info');
                  }}
                  className="px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Award Approval</span>
                </button>

                {userRole === 'field_officer' && (
                  <button
                    onClick={() => {
                      setCurrentView('field_upload');
                      showToast(`Open geotagged evidence for Sy ${selectedParcel.surveyNumber}`, 'info');
                    }}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>Field Evidence</span>
                  </button>
                )}
              </div>

              {/* Print / Export Cadastral Notice */}
              <button
                onClick={() => showToast(`Generated Form 3A/3D Cadastral Notice for Sy ${selectedParcel.surveyNumber}`, 'success')}
                className="w-full mt-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <FileText className="w-3 h-3 text-slate-500" />
                <span>Download Section 3A Demarcation Slip</span>
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center text-slate-500">
              <MapPin className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-xs">Select any parcel on the GIS map to inspect survey details.</p>
            </div>
          )}

          {/* Alignment Corridor Info Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>Corridor Alignment Parameters</span>
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Expressway Chainage:</span>
                <span className="font-mono font-medium text-slate-900">KM 41+500 to KM 44+200</span>
              </div>
              <div className="flex justify-between">
                <span>Statutory ROW Width:</span>
                <span className="font-mono font-medium text-slate-900">60 Meters (4-Lane with Service)</span>
              </div>
              <div className="flex justify-between">
                <span>Competent Authority:</span>
                <span className="font-medium text-slate-900">Special LAO, Medchal-Malkajgiri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Bottom: Dedicated Survey Parcels Master Registry Table       */}
      {/* ============================================================ */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>Survey Details & Cadastral Parcels Registry</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete listing of survey numbers, landowner titles, statutory valuations, and acquisition milestones
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Parcels' },
              { id: 'Acquired', label: 'Acquired' },
              { id: 'Pending', label: 'Pending' },
              { id: 'Disputed', label: 'Disputed' },
              { id: 'Compensation', label: 'Compensation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-semibold text-[11px] uppercase border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Survey No</th>
                <th className="py-3 px-4">Parcel ID</th>
                <th className="py-3 px-4">Landowner Legal Entity</th>
                <th className="py-3 px-4">Village / Mandal</th>
                <th className="py-3 px-4">Extent (Acres)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Statutory Award</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredParcels.map((parcel) => {
                const isSelected = selectedParcel?.id === parcel.id;
                return (
                  <tr
                    key={parcel.id}
                    onClick={() => {
                      setSelectedParcelId(parcel.id);
                      showToast(`Focused on Sy ${parcel.surveyNumber}`, 'info');
                    }}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      Sy {parcel.surveyNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {parcel.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {parcel.landownerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {parcel.village}, {parcel.district}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold">
                      {parcel.areaAcres} Ac
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
                        {parcel.landType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      ₹{(parcel.compensation?.totalCompensation || parcel.totalCompensation || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={parcel.acquisitionStatus || parcel.status || 'Pending'} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedParcelId(parcel.id);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                          showToast(`Focused map on Sy ${parcel.surveyNumber}`, 'info');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Focus on Map</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
