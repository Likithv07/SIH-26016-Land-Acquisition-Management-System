import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { SECTORS_CONFIG } from '../../data/sectorData';
import { SectorType } from '../../types';
import {
  Landmark,
  Lock,
  LogOut,
  Bell,
  ChevronDown,
  CheckCircle,
  Truck,
  Train,
  Zap,
  Building,
  ShieldCheck,
  UserCheck,
  FileText,
  Calculator,
  Camera,
  Bot,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeSector,
    setActiveSector,
    loginAsSector,
    loginAsRole,
    userRole,
    setUserRole,
    isLoggedIn,
    loggedInUser,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsChatbotOpen,
    showToast,
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showSectorMenu, setShowSectorMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentSectorConfig = SECTORS_CONFIG[activeSector];

  const getSectorIcon = (sec: SectorType) => {
    switch (sec) {
      case 'highways':
        return Truck;
      case 'railways':
        return Train;
      case 'power':
        return Zap;
      case 'urban':
        return Building;
      case 'revenue':
        return ShieldCheck;
      case 'citizen':
        return UserCheck;
      case 'field_officer':
        return Camera;
      default:
        return Landmark;
    }
  };

  const SectorIcon = getSectorIcon(activeSector);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Minimal Logo */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-800 transition-colors">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                BhoomiSetu
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                National Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Land Acquisition & Management System
            </p>
          </div>
        </div>

        {/* Center Navigation Links when on Landing page */}
        {!isLoggedIn || currentView === 'landing' ? (
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'landing'
                  ? 'text-blue-900 bg-blue-50 font-bold border border-blue-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About BhoomiSetu
            </button>
            <a
              href="#sectors-section"
              onClick={() => {
                if (currentView !== 'landing') setCurrentView('landing');
              }}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Sector Portals
            </a>
            {userRole !== 'citizen' && (
              <button
                onClick={() => setCurrentView('gis_map')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentView === 'gis_map'
                    ? 'text-blue-900 bg-blue-50 font-bold border border-blue-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                GIS Cadastral Map
              </button>
            )}
            <button
              onClick={() => setCurrentView('scope')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'scope'
                  ? 'text-blue-900 bg-blue-50 font-bold border border-blue-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              RFCTLARR Statutory Scope
            </button>
          </nav>
        ) : (
          /* When logged in, center displays the active sector info */
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Active Sector:</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50/90 border border-blue-200 text-blue-950 font-semibold shadow-2xs">
              <SectorIcon className="w-4 h-4 text-blue-700" />
              <span>{currentSectorConfig.name}</span>
            </div>
          </div>
        )}

        {/* Right Corner Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask BhoomiMitra AI Assistant Button - Exclusively for Citizen Portal */}
          {userRole === 'citizen' && (
            <button
              onClick={() => setIsChatbotOpen(true)}
              id="navbar-bhoomimitra-ai-btn"
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Ask BhoomiMitra AI Citizen Assistant"
            >
              <Bot className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">Ask BhoomiMitra AI</span>
              <span className="sm:hidden font-bold">AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* If NOT logged in: Prominently Highlighted Login Button in the Right Corner */}
          {!isLoggedIn ? (
            <button
              onClick={() => setCurrentView('login')}
              id="navbar-login-btn"
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          ) : (
            /* If logged in: Sector switcher, Notification bell, and Log Out */
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 p-3 shadow-lg z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-xs font-bold text-slate-900">Notifications</span>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 text-xs">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkView) setCurrentView(n.linkView as AppView);
                            setShowNotifs(false);
                          }}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-slate-50 border-slate-200 text-slate-500'
                              : 'bg-blue-50/60 border-blue-200/80 text-slate-800'
                          }`}
                        >
                          <div className="font-semibold text-slate-900">{n.title}</div>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sector / Role Quick Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSectorMenu(!showSectorMenu)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs ${
                    userRole === 'field_officer'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {userRole === 'field_officer' ? (
                    <>
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="hidden sm:inline">Field Officer (Survey)</span>
                    </>
                  ) : (
                    <>
                      <SectorIcon className="w-3.5 h-3.5 text-blue-700" />
                      <span className="hidden sm:inline">{currentSectorConfig?.shortName || 'Sector'}</span>
                    </>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showSectorMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 p-2 shadow-lg z-50 text-xs">
                    <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-100 mb-1">
                      Switch Sector / Role
                    </div>
                    {(['highways', 'railways', 'power', 'urban', 'revenue', 'citizen'] as SectorType[]).map((s) => {
                      const sec = SECTORS_CONFIG[s];
                      const IconComp = getSectorIcon(s);
                      return (
                        <button
                          key={s}
                          onClick={() => {
                            loginAsSector(s);
                            setActiveSector(s);

                            const roleMapping: Record<SectorType, any> = {
                              highways: 'central',
                              railways: 'central',
                              power: 'officer',
                              urban: 'state',
                              revenue: 'officer',
                              citizen: 'citizen',
                              field_officer: 'field_officer',
                            };

                            setUserRole(roleMapping[s]);
                            setShowSectorMenu(false);

                            if (s === 'field_officer') {
                              setCurrentView('field_upload');
                            } else {
                              setCurrentView('dashboard');
                            }

                            showToast(`Active sector set to ${sec.name}`, 'info');
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all btn-hover ${
                            userRole !== 'field_officer' && activeSector === s
                              ? 'bg-blue-50 text-blue-900 font-bold shadow-2xs'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <IconComp className="w-4 h-4 text-blue-700" />
                          <span>{sec.shortName}</span>
                        </button>
                      );
                    })}

                    {/* Field Officer in dropdown */}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          loginAsRole('field_officer');
                          setShowSectorMenu(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all btn-hover ${
                          userRole === 'field_officer'
                            ? 'bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                            : 'text-emerald-800 hover:bg-emerald-50/60 font-medium'
                        }`}
                      >
                        <Camera className="w-4 h-4 text-emerald-700" />
                        <div className="flex-1 min-w-0">
                          <span className="block font-semibold">Field Officer</span>
                          <span className="text-[10px] text-slate-500 block">Field Verification & DGPS</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Highlighted Log Out Button */}
              <button
                onClick={logout}
                id="navbar-logout-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-colors"
                title="Log Out to BhoomiSetu Landing Page"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
