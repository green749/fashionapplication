import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  FileCheck2,
  Boxes,
  Activity,
  HardHat,
  TrendingUp,
  MessageSquare,
  Truck,
  Sparkles,
  Users,
  ShieldCheck,
  LogOut,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import type { AdminUser, AdminNavTab } from '../../types';

export type { AdminNavTab };

interface AdminSidebarProps {
  currentTab: AdminNavTab;
  onTabChange: (tab: AdminNavTab) => void;
  user: AdminUser;
  pendingQuotesCount: number;
  openEscalationsCount: number;
  surgeAlertsCount: number;
  materialShortagesCount?: number;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  user,
  pendingQuotesCount,
  openEscalationsCount,
  surgeAlertsCount,
  materialShortagesCount = 2,
  onLogout
}) => {
  const navItems: { id: AdminNavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="nav-icon" /> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList className="nav-icon" /> },
    { id: 'quotations', label: 'Quotations', icon: <FileCheck2 className="nav-icon" />, badge: pendingQuotesCount },
    { id: 'procurement', label: 'Procurement', icon: <Boxes className="nav-icon" />, badge: materialShortagesCount },
    { id: 'production', label: 'Production', icon: <Activity className="nav-icon" /> },
    { id: 'supervisors', label: 'Supervisors', icon: <HardHat className="nav-icon" /> },
    { id: 'priceCentre', label: 'Market Prices', icon: <TrendingUp className="nav-icon" />, badge: surgeAlertsCount },
    { id: 'chat', label: 'Communications', icon: <MessageSquare className="nav-icon" />, badge: openEscalationsCount },
    { id: 'deliveries', label: 'Deliveries', icon: <Truck className="nav-icon" /> },
    { id: 'aiAgents', label: 'AI Agents', icon: <Sparkles className="nav-icon" /> },
    { id: 'users', label: 'Users', icon: <Users className="nav-icon" /> },
    { id: 'audit', label: 'Settings', icon: <ShieldCheck className="nav-icon" /> }
  ];

  return (
    <div className="sidebar-column">
      <aside className="sidebar-pillar" aria-label="Admin Navigation">
        {/* Top: Geometric Brand Emblem + Name */}
        <div className="sidebar-top">
          <div
            className="brand-header-wrap"
            onClick={() => onTabChange('dashboard')}
            title="LoomPilot OS"
          >
            <div className="brand-emblem-wrap">
              <Layers size={18} />
            </div>
            <span className="brand-name-text">LoomPilot</span>
          </div>

          {/* Navigation Items with Label and Badge */}
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  aria-label={item.label}
                >
                  <span className="nav-icon-box">{item.icon}</span>
                  <span className="nav-label-text">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="nav-badge-count">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Mobile App / Telemetry Lime Card + User Pill (Eduplex Style) */}
        <div className="sidebar-bottom">
          <div
            className="sidebar-promo-card"
            onClick={() => onTabChange('production')}
            title="View Live Loom Telemetry"
          >
            <div className="promo-card-top">
              <span className="promo-card-tag">Mill Live</span>
              <div className="promo-arrow-circle">
                <ArrowUpRight size={12} color="#ffffff" />
              </div>
            </div>
            <div className="promo-card-title">Floor Telemetry</div>
            <div className="promo-card-sub">48 Looms &bull; 5 Agents</div>
          </div>

          <div
            className="sidebar-user-row"
            title={`${user.name} (Managing Director)`}
            onClick={() => onTabChange('users')}
          >
            <div className="sidebar-user-avatar">JD</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.name}</span>
              <span className="sidebar-user-role">Managing Director</span>
            </div>
            {onLogout && (
              <button
                className="sidebar-logout-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
