import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  TrendingUp,
  Video,
  Plus,
  Play,
  Pause,
  Square,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { Order, AppUser, MarketCommodity, AdminNavTab, AuditEntry } from '../../types';

interface AdminDashboardModuleProps {
  orders: Order[];
  users: AppUser[];
  commodities: MarketCommodity[];
  auditLogs?: AuditEntry[];
  onNavigateTab: (tab: AdminNavTab) => void;
  onSelectOrder?: (orderId: string) => void;
  onOpenOrderModal?: (order: Order) => void;
  onApproveQuotation?: (orderId: string) => void;
  onRejectQuotation?: (orderId: string, reason: string) => void;
}

export const AdminDashboardModule: React.FC<AdminDashboardModuleProps> = ({
  onNavigateTab
}) => {
  // Timer State for the Donezo Time Tracker card
  const [seconds, setSeconds] = useState<number>(5048); // 01:24:08 initial
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [meetingJoined, setMeetingJoined] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '2px 4px'
    }}>
      {/* ===================================================================
          ROW 1: 4 KPI CARDS (Donezo Signature Top Bar)
          Card 1: Solid Dark Forest Green
          Cards 2, 3, 4: Pure White with Outline Circular Arrow
          =================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        flexShrink: 0
      }}>
        {/* KPI CARD 1: TOTAL PROJECTS (Forest Green Solid Hero Card) */}
        <div
          onClick={() => onNavigateTab('orders')}
          style={{
            background: 'linear-gradient(135deg, #134e35 0%, #1a5e41 100%)',
            borderRadius: 18,
            padding: '14px 16px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 14px rgba(19, 78, 53, 0.22)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e8f5ec', letterSpacing: '-0.2px' }}>
              Total Projects
            </span>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#134e35',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.8px', margin: '6px 0 4px' }}>
            24
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#86efac', fontWeight: 600 }}>
            <TrendingUp size={12} strokeWidth={2.5} />
            <span>Increased from last month</span>
          </div>
        </div>

        {/* KPI CARD 2: ENDED PROJECTS */}
        <div
          onClick={() => onNavigateTab('orders')}
          style={{
            background: '#ffffff',
            border: '1px solid #edf2ef',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 1px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', letterSpacing: '-0.2px' }}>
              Ended Projects
            </span>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: '1.5px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827'
            }}>
              <ArrowUpRight size={14} strokeWidth={2.2} />
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.8px', margin: '6px 0 4px' }}>
            10
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>
            <TrendingUp size={12} strokeWidth={2.5} color="#164e32" />
            <span>Increased from last month</span>
          </div>
        </div>

        {/* KPI CARD 3: RUNNING PROJECTS */}
        <div
          onClick={() => onNavigateTab('production')}
          style={{
            background: '#ffffff',
            border: '1px solid #edf2ef',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 1px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', letterSpacing: '-0.2px' }}>
              Running Projects
            </span>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: '1.5px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827'
            }}>
              <ArrowUpRight size={14} strokeWidth={2.2} />
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.8px', margin: '6px 0 4px' }}>
            12
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>
            <TrendingUp size={12} strokeWidth={2.5} color="#164e32" />
            <span>Increased from last month</span>
          </div>
        </div>

        {/* KPI CARD 4: PENDING PROJECT */}
        <div
          onClick={() => onNavigateTab('quotations')}
          style={{
            background: '#ffffff',
            border: '1px solid #edf2ef',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 1px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', letterSpacing: '-0.2px' }}>
              Pending Project
            </span>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: '1.5px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827'
            }}>
              <ArrowUpRight size={14} strokeWidth={2.2} />
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.8px', margin: '6px 0 4px' }}>
            2
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>
            <Clock size={12} strokeWidth={2.5} color="#64748b" />
            <span>On Discuss</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          ROW 2: MIDDLE ROW (3 COLUMNS)
          Col 1 (~44%): Project Analytics (Pill Bar Chart with Hatched Stripes & 74% circle)
          Col 2 (~28%): Reminders (Meeting Card with Green Pill Button)
          Col 3 (~28%): Project (5 Items with Colorful Geometric Icons)
          =================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1.05fr 1.05fr',
        gap: 12,
        flex: 1.15,
        minHeight: 0
      }}>
        {/* CARD 1: PROJECT ANALYTICS (Donezo Capsule Pillars Bar Chart) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #edf2ef',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
          minHeight: 0
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
            Project Analytics
          </div>

          {/* 7 Capsule Pillars Chart */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flex: 1,
            padding: '10px 8px 4px',
            position: 'relative'
          }}>
            {[
              { day: 'S', height: 48, type: 'hatched' },
              { day: 'M', height: 72, type: 'dark_green' },
              { day: 'T', height: 62, type: 'mint_badge', badge: '74%' },
              { day: 'W', height: 92, type: 'forest_green' },
              { day: 'T', height: 76, type: 'hatched' },
              { day: 'F', height: 58, type: 'hatched' },
              { day: 'S', height: 66, type: 'hatched' }
            ].map((col, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  height: '100%',
                  justifyContent: 'flex-end',
                  position: 'relative'
                }}
              >
                {/* Floating percentage badge above Tuesday pill */}
                {col.type === 'mint_badge' && (
                  <div style={{
                    position: 'absolute',
                    top: `calc(100% - ${col.height}% - 34px)`,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9.5,
                    fontWeight: 800,
                    color: '#111827',
                    zIndex: 5
                  }}>
                    {col.badge}
                  </div>
                )}

                {/* Capsule Rounded Pillar */}
                <div
                  style={{
                    width: 28,
                    height: `${col.height}%`,
                    borderRadius: 9999,
                    background:
                      col.type === 'forest_green'
                        ? '#134e35'
                        : col.type === 'dark_green'
                        ? '#1e6849'
                        : col.type === 'mint_badge'
                        ? '#52b788'
                        : 'repeating-linear-gradient(135deg, #cbd5e1 0px, #cbd5e1 2px, #f1f5f9 2px, #f1f5f9 6px)',
                    transition: 'height 0.3s ease'
                  }}
                />

                {/* Bottom Day Label */}
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94a3b8'
                }}>
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 2: REMINDERS (Donezo Meeting Card with Green Button) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #edf2ef',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
          minHeight: 0
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
              Reminders
            </div>

            <div style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#111827',
              marginTop: 14,
              letterSpacing: '-0.3px',
              lineHeight: 1.3
            }}>
              Meeting with Arc Company
            </div>

            <div style={{
              fontSize: 11,
              color: '#64748b',
              marginTop: 6,
              fontWeight: 500
            }}>
              Time : 02.00 pm - 04.00 pm
            </div>
          </div>

          {/* Solid Forest Green Start Meeting Button */}
          <button
            onClick={() => setMeetingJoined(!meetingJoined)}
            style={{
              background: meetingJoined ? '#059669' : 'linear-gradient(135deg, #134e35 0%, #1a5e41 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 9999,
              padding: '10px 18px',
              fontSize: 12.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(19, 78, 53, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {meetingJoined ? <CheckCircle2 size={16} /> : <Video size={16} />}
            <span>{meetingJoined ? 'Meeting Active' : 'Start Meeting'}</span>
          </button>
        </div>

        {/* CARD 3: PROJECT (5 Items with Geometric Icons + '+ New' Button) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #edf2ef',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
          minHeight: 0
        }}>
          {/* Header with '+ New' Pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
              Project
            </span>
            <button
              onClick={() => onNavigateTab('orders')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                border: '1.5px solid #d1d5db',
                borderRadius: 9999,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 600,
                color: '#111827',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Plus size={11} strokeWidth={2.5} />
              New
            </button>
          </div>

          {/* 5 Project Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, justifyContent: 'center' }}>
            {[
              {
                title: 'Develop API Endpoints',
                date: 'Due date: Nov 26, 2024',
                iconBg: '#3b82f6',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                    <line x1="6" y1="18" x2="18" y2="6" />
                    <line x1="12" y1="18" x2="20" y2="10" />
                  </svg>
                )
              },
              {
                title: 'Onboarding Flow',
                date: 'Due date: Nov 28, 2024',
                iconBg: '#0d9488',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )
              },
              {
                title: 'Build Dashboard',
                date: 'Due date: Nov 30, 2024',
                iconBg: '#10b981',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                    <rect x="4" y="4" width="7" height="7" rx="2" />
                    <rect x="13" y="4" width="7" height="7" rx="2" />
                    <rect x="4" y="13" width="7" height="7" rx="2" />
                    <rect x="13" y="13" width="7" height="7" rx="2" />
                  </svg>
                )
              },
              {
                title: 'Optimize Page Load',
                date: 'Due date: Dec 5, 2024',
                iconBg: '#f59e0b',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 4v8l6 3" />
                  </svg>
                )
              },
              {
                title: 'Cross-Browser Testing',
                date: 'Due date: Dec 6, 2024',
                iconBg: '#8b5cf6',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                    <circle cx="7" cy="8" r="3" fill="#ffffff" />
                    <circle cx="17" cy="8" r="3" fill="#ffffff" />
                    <circle cx="12" cy="16" r="3" fill="#ffffff" />
                  </svg>
                )
              }
            ].map((proj, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: proj.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {proj.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                    {proj.title}
                  </span>
                  <span style={{ fontSize: 9, color: '#94a3b8' }}>
                    {proj.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================
          ROW 3: BOTTOM ROW (3 COLUMNS)
          Col 1 (~44%): Team Collaboration (4 Members + Status Pills)
          Col 2 (~28%): Project Progress (Semi-Circular Arc Meter 41%)
          Col 3 (~28%): Time Tracker (Dark Green Card with Contour Lines & Timer 01:24:08)
          =================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1.05fr 1.05fr',
        gap: 12,
        flex: 1.15,
        minHeight: 0
      }}>
        {/* CARD 1: TEAM COLLABORATION */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #edf2ef',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
          minHeight: 0
        }}>
          {/* Header with '+ Add Member' Pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
              Team Collaboration
            </span>
            <button
              onClick={() => onNavigateTab('users')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                border: '1.5px solid #111827',
                borderRadius: 9999,
                padding: '3px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: '#111827',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Plus size={11} strokeWidth={2.5} />
              Add Member
            </button>
          </div>

          {/* 4 Member Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'center' }}>
            {[
              {
                name: 'Alexandra Deff',
                task: 'Working on Github Project Repository',
                status: 'Completed',
                statusBg: '#eaf6ef',
                statusColor: '#164e32',
                avatarBg: '#fbcfe8',
                emoji: '👩‍💻'
              },
              {
                name: 'Edwin Adenike',
                task: 'Working on Integrate User Authentication System',
                status: 'In Progress',
                statusBg: '#fef3c7',
                statusColor: '#b45309',
                avatarBg: '#fed7aa',
                emoji: '👨‍💼'
              },
              {
                name: 'Isaac Oluwatemilorun',
                task: 'Working on Develop Search and Filter Functionality',
                status: 'Pending',
                statusBg: '#fee2e2',
                statusColor: '#dc2626',
                avatarBg: '#bae6fd',
                emoji: '🧑‍💻'
              },
              {
                name: 'David Oshodi',
                task: 'Working on Responsive Layout for Homepage',
                status: 'In Progress',
                statusBg: '#fef3c7',
                statusColor: '#b45309',
                avatarBg: '#fef08a',
                emoji: '👨‍🎨'
              }
            ].map((member, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '3px 0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: member.avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    flexShrink: 0
                  }}>
                    {member.emoji}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                      {member.name}
                    </span>
                    <span style={{ fontSize: 9.5, color: '#64748b' }}>
                      {member.task}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  background: member.statusBg,
                  color: member.statusColor,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  whiteSpace: 'nowrap'
                }}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 2: PROJECT PROGRESS (Semi-Circular Arc Meter 41%) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #edf2ef',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
          minHeight: 0
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
            Project Progress
          </div>

          {/* Donezo Semi-Circular Arc Meter */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginTop: 2
          }}>
            <svg width="170" height="88" viewBox="0 0 170 88">
              <defs>
                <pattern id="donezoHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" strokeWidth="2.2" />
                </pattern>
              </defs>

              {/* Segment 3: Right Hatched Track (Pending) */}
              <path
                d="M 15 80 A 70 70 0 0 1 155 80"
                fill="none"
                stroke="url(#donezoHatch)"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Segment 2: In Progress Dark Green */}
              <path
                d="M 15 80 A 70 70 0 0 1 155 80"
                fill="none"
                stroke="#134e35"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset="75"
              />

              {/* Segment 1: Completed Forest Green */}
              <path
                d="M 15 80 A 70 70 0 0 1 155 80"
                fill="none"
                stroke="#2d8659"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset="135"
              />
            </svg>

            {/* Central 41% Metric */}
            <div style={{
              position: 'absolute',
              bottom: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.5px' }}>
                41%
              </span>
              <span style={{ fontSize: 9.5, color: '#64748b', fontWeight: 600, marginTop: 2 }}>
                Project Ended
              </span>
            </div>
          </div>

          {/* Legend Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, fontSize: 9.5, fontWeight: 600, color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2d8659' }} />
              Completed
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#134e35' }} />
              In Progress
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'repeating-linear-gradient(45deg, #cbd5e1 0px, #cbd5e1 1.5px, #f1f5f9 1.5px, #f1f5f9 3px)' }} />
              Pending
            </span>
          </div>
        </div>

        {/* CARD 3: TIME TRACKER (Dark Forest Green Card with Wavy Topography Lines) */}
        <div style={{
          background: 'linear-gradient(135deg, #0e3d28 0%, #08291a 100%)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(14, 61, 40, 0.3)',
          minHeight: 0
        }}>
          {/* SVG Organic Wavy Topography Contour Background Pattern */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: 0.32
            }}
            viewBox="0 0 240 180"
            preserveAspectRatio="none"
          >
            <path d="M-20,160 Q60,80 140,130 T260,70" fill="none" stroke="#22c55e" strokeWidth="1.2" />
            <path d="M-20,140 Q60,60 140,110 T260,50" fill="none" stroke="#22c55e" strokeWidth="1.2" />
            <path d="M-20,120 Q60,40 140,90 T260,30" fill="none" stroke="#22c55e" strokeWidth="1.2" />
            <path d="M-20,100 Q60,20 140,70 T260,10" fill="none" stroke="#22c55e" strokeWidth="1.2" />
            <path d="M-20,80 Q60,0 140,50 T260,-10" fill="none" stroke="#22c55e" strokeWidth="1.2" />
            <path d="M-20,60 Q60,-20 140,30 T260,-30" fill="none" stroke="#22c55e" strokeWidth="1.2" />
          </svg>

          {/* Header */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2f0e8' }}>
              Time Tracker
            </span>
          </div>

          {/* Timer Readout: 01:24:08 */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '1px',
            fontVariantNumeric: 'tabular-nums',
            margin: '4px 0'
          }}>
            {formatTimer(seconds)}
          </div>

          {/* Play/Pause & Stop Controls */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}>
            {/* Pause / Play Button (White Circle) */}
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              title={timerRunning ? 'Pause' : 'Play'}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#ffffff',
                border: 'none',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.1s ease'
              }}
            >
              {timerRunning ? <Pause size={15} fill="#111827" /> : <Play size={15} fill="#111827" style={{ marginLeft: 2 }} />}
            </button>

            {/* Stop Button (Red Circle) */}
            <button
              onClick={() => {
                setTimerRunning(false);
                setSeconds(5048);
              }}
              title="Reset"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                transition: 'transform 0.1s ease'
              }}
            >
              <Square size={14} fill="#ffffff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardModule;