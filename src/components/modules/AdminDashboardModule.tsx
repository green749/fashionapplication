import React, { useState } from 'react';
import {
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ChevronRight,
  ExternalLink
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
  orders,
  onNavigateTab,
  onSelectOrder,
  onOpenOrderModal,
  onApproveQuotation
}) => {
  // Time filter state for Revenue vs Profit Analytics
  const [analyticsFilter, setAnalyticsFilter] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>('Oct');
  const [quickApprovedId, setQuickApprovedId] = useState<string | null>(null);

  // Financial chart series data
  const financialData = [
    { period: 'May', rev: 19.2, profit: 4.2, exp: 4.5, x: 20, revY: 62, profY: 26 },
    { period: 'Jun', rev: 21.0, profit: 4.8, exp: 5.0, x: 60, revY: 68, profY: 30 },
    { period: 'Jul', rev: 23.4, profit: 5.3, exp: 5.5, x: 100, revY: 74, profY: 34 },
    { period: 'Aug', rev: 25.1, profit: 5.9, exp: 6.0, x: 140, revY: 80, profY: 38 },
    { period: 'Sep', rev: 26.3, profit: 6.2, exp: 6.4, x: 180, revY: 84, profY: 41 },
    { period: 'Oct', rev: 28.5, profit: 6.8, exp: 7.0, x: 220, revY: 92, profY: 46 }
  ];

  // Delivery alerts click handler
  const handleDeliveryAlertClick = (orderId: string) => {
    const matched = orders.find((o) => o.id === orderId);
    if (matched && onOpenOrderModal) {
      onOpenOrderModal(matched);
    } else if (onSelectOrder) {
      onSelectOrder(orderId);
      onNavigateTab('orders');
    }
  };

  const handleQuickApprove = (orderId: string) => {
    setQuickApprovedId(orderId);
    if (onApproveQuotation) {
      onApproveQuotation(orderId);
    }
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
          ROW 1: 4 KPI CARDS (Executive Performance Bar)
          Card 1: Active Orders (Solid Dark Forest Green Hero Card)
          Card 2: Completed Orders (Crisp White Card)
          Card 3: Orders in Production (Crisp White Card)
          Card 4: At-Risk Orders (White Card with subtle Red treatment)
          =================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        flexShrink: 0
      }}>
        {/* KPI CARD 1: ACTIVE ORDERS (Dark Forest Green Solid Hero Card) */}
        <div
          onClick={() => onNavigateTab('orders')}
          title="Click to view all Active Orders"
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
              Active Orders
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
            124
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#86efac', fontWeight: 600 }}>
            <Package size={12} strokeWidth={2.5} />
            <span>Currently being processed</span>
          </div>
        </div>

        {/* KPI CARD 2: COMPLETED ORDERS */}
        <div
          onClick={() => onNavigateTab('orders')}
          title="Click to inspect completed orders"
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
              Completed Orders
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
            48
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#164e32', fontWeight: 700 }}>
            <TrendingUp size={12} strokeWidth={2.5} />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* KPI CARD 3: ORDERS IN PRODUCTION */}
        <div
          onClick={() => onNavigateTab('production')}
          title="Click to track live production stages"
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
              Orders in Production
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
            58
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>
            <Layers size={12} strokeWidth={2.5} color="#164e32" />
            <span>Across six production stages</span>
          </div>
        </div>

        {/* KPI CARD 4: AT-RISK ORDERS (Subtle Red Treatment) */}
        <div
          onClick={() => onNavigateTab('production')}
          title="Click to view all At-Risk Orders requiring intervention"
          style={{
            background: '#ffffff',
            border: '1px solid #fecaca',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 1px 6px rgba(220, 38, 38, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#b91c1c', letterSpacing: '-0.2px' }}>
              At-Risk Orders
            </span>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#fef2f2',
              border: '1.5px solid #fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626'
            }}>
              <AlertTriangle size={13} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#dc2626', letterSpacing: '-0.8px', margin: '6px 0 4px' }}>
            06
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#dc2626', fontWeight: 600 }}>
            <ShieldAlert size={12} strokeWidth={2.5} />
            <span>Requires Admin intervention</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          ROW 2: MIDDLE ROW (3 COLUMNS)
          Col 1 (~44%): Revenue vs Profit Analytics (Line Chart with Filter)
          Col 2 (~28%): Admin Action Centre (4 Pending Approvals & Executions)
          Col 3 (~28%): Delivery & Order Alerts (Top 3 Urgent Delivery Bottlenecks)
          =================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1.05fr 1.05fr',
        gap: 12,
        flex: 1.15,
        minHeight: 0
      }}>
        {/* =================================================================
            COLUMN A: REVENUE VS PROFIT ANALYTICS
            Clean Line Chart: Dark Green (Revenue) & Light Green (Profit)
            ================================================================= */}
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
          {/* Header with Title, Legend & Time Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
                Revenue vs Profit Analytics
              </div>
              <div style={{ fontSize: 9.5, color: '#64748b', fontWeight: 500 }}>
                Monthly Revenue: ₹28.5L &bull; Actual Profit: ₹6.8L (23.8%)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9.5, fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#134e35' }}>
                  <span style={{ width: 8, height: 3, borderRadius: 2, background: '#134e35' }} />
                  Revenue
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669' }}>
                  <span style={{ width: 8, height: 3, borderRadius: 2, background: '#22c55e' }} />
                  Profit
                </span>
              </div>

              {/* Time Filter Pills */}
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: 9999,
                padding: '2px',
                gap: 2
              }}>
                {(['monthly', 'quarterly', 'yearly'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAnalyticsFilter(filter)}
                    style={{
                      background: analyticsFilter === filter ? '#ffffff' : 'transparent',
                      color: analyticsFilter === filter ? '#134e35' : '#64748b',
                      fontWeight: analyticsFilter === filter ? 800 : 500,
                      border: 'none',
                      borderRadius: 9999,
                      padding: '2px 8px',
                      fontSize: 9.5,
                      cursor: 'pointer',
                      boxShadow: analyticsFilter === filter ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      textTransform: 'capitalize'
                    }}
                  >
                    {filter === 'monthly' ? 'Monthly' : filter === 'quarterly' ? 'Quarterly' : 'Yearly'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clean Multi-Series Line Chart (Dark Green & Light Green) */}
          <div style={{
            position: 'relative',
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: 8
          }}>
            <svg
              viewBox="0 0 240 100"
              style={{ width: '100%', height: '88px', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#134e35" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#134e35" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid guide lines */}
              <line x1="10" y1="20" x2="230" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="10" y1="50" x2="230" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="10" y1="80" x2="230" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Revenue Area Fill & Line (Dark Green #134e35) */}
              <path
                d="M 20 62 L 60 56 L 100 48 L 140 42 L 180 36 L 220 22 L 220 85 L 20 85 Z"
                fill="url(#revenueFill)"
              />
              <path
                d="M 20 62 L 60 56 L 100 48 L 140 42 L 180 36 L 220 22"
                fill="none"
                stroke="#134e35"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Profit Area Fill & Line (Light Green #22c55e) */}
              <path
                d="M 20 78 L 60 74 L 100 68 L 140 64 L 180 60 L 220 54 L 220 85 L 20 85 Z"
                fill="url(#profitFill)"
              />
              <path
                d="M 20 78 L 60 74 L 100 68 L 140 64 L 180 60 L 220 54"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Expected Profit Projected Dashed Segment */}
              <line x1="180" y1="58" x2="220" y2="50" stroke="#86efac" strokeWidth="2" strokeDasharray="3 2" />

              {/* Data points */}
              {financialData.map((d) => (
                <g key={d.period} onMouseEnter={() => setHoveredMonth(d.period)} style={{ cursor: 'pointer' }}>
                  {/* Revenue point */}
                  <circle cx={d.x} cy={100 - d.revY * 0.78} r="3.5" fill="#ffffff" stroke="#134e35" strokeWidth="2" />
                  {/* Profit point */}
                  <circle cx={d.x} cy={100 - d.profY * 0.78} r="3" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
                </g>
              ))}

              {/* October Active Tooltip Pill */}
              {hoveredMonth === 'Oct' && (
                <g transform="translate(160, 2)">
                  <rect x="0" y="0" width="76" height="20" rx="6" fill="#111827" />
                  <text x="38" y="13.5" fill="#ffffff" fontSize="8" fontWeight="700" textAnchor="middle">
                    ₹28.5L / ₹6.8L (24%)
                  </text>
                </g>
              )}
            </svg>

            {/* Bottom X-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', marginTop: 2 }}>
              {financialData.map((d) => (
                <span
                  key={d.period}
                  onMouseEnter={() => setHoveredMonth(d.period)}
                  style={{
                    fontSize: 10,
                    fontWeight: hoveredMonth === d.period ? 800 : 500,
                    color: hoveredMonth === d.period ? '#134e35' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {d.period}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================
            COLUMN B: ADMIN ACTION CENTRE
            Pending Approvals: Quotations, POs, Discounts, Price Revisions
            ================================================================= */}
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
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
                Admin Action Centre
              </span>
              <span style={{
                fontSize: 9,
                fontWeight: 800,
                background: '#fee2e2',
                color: '#dc2626',
                padding: '1px 6px',
                borderRadius: 9999
              }}>
                4 Pending
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('quotations')}
              style={{
                background: 'none',
                border: 'none',
                color: '#164e32',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              View all
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Pending Decisions List (3-4 items) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minHeight: 0, justifyContent: 'center' }}>
            {/* Action 1: Quotation Approval */}
            <div
              onClick={() => onNavigateTab('quotations')}
              title="Click to review quotation"
              style={{
                background: '#f8faf9',
                border: '1px solid #edf2ef',
                borderRadius: 10,
                padding: '5px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: '#111827' }}>
                    Quote &bull; TX-1024
                  </span>
                  <span style={{ fontSize: 8, color: '#dc2626', background: '#fef2f2', padding: '1px 4px', borderRadius: 4, fontWeight: 700 }}>
                    High
                  </span>
                </div>
                <div style={{ fontSize: 8.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ABC Garments &bull; ₹3.50L (18% margin)
                </div>
              </div>
              <span style={{ fontSize: 8.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>2h wait</span>
            </div>

            {/* Action 2: Purchase Order Approval */}
            <div
              onClick={() => onNavigateTab('procurement')}
              title="Click to review purchase order"
              style={{
                background: '#f8faf9',
                border: '1px solid #edf2ef',
                borderRadius: 10,
                padding: '5px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: '#111827' }}>
                    Purchase PO &bull; PO-1001
                  </span>
                  <span style={{ fontSize: 8, color: '#dc2626', background: '#fef2f2', padding: '1px 4px', borderRadius: 4, fontWeight: 700 }}>
                    Urgent
                  </span>
                </div>
                <div style={{ fontSize: 8.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Sri Textiles &bull; 600m Cotton Fabric shortage
                </div>
              </div>
              <span style={{ fontSize: 8.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>5h wait</span>
            </div>

            {/* Action 3: Client Discount Request */}
            <div
              onClick={() => onNavigateTab('chat')}
              title="Click to resolve client discount request"
              style={{
                background: '#f8faf9',
                border: '1px solid #edf2ef',
                borderRadius: 10,
                padding: '5px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: '#111827' }}>
                    Discount &bull; TX-1025
                  </span>
                  <span style={{ fontSize: 8, color: '#b45309', background: '#fef3c7', padding: '1px 4px', borderRadius: 4, fontWeight: 700 }}>
                    Med
                  </span>
                </div>
                <div style={{ fontSize: 8.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  StyleMart &bull; -5% price cut to $3.80/m
                </div>
              </div>
              <span style={{ fontSize: 8.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>4h wait</span>
            </div>

            {/* Action 4: Quotation Price Revision */}
            <div
              onClick={() => onNavigateTab('priceCentre')}
              title="Click to inspect price revision"
              style={{
                background: '#f8faf9',
                border: '1px solid #edf2ef',
                borderRadius: 10,
                padding: '5px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: '#111827' }}>
                    Revision &bull; PR-108
                  </span>
                  <span style={{ fontSize: 8, color: '#475569', background: '#f1f5f9', padding: '1px 4px', borderRadius: 4, fontWeight: 700 }}>
                    Normal
                  </span>
                </div>
                <div style={{ fontSize: 8.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  FabIndia &bull; Yarn surge update +4.2%
                </div>
              </div>
              <span style={{ fontSize: 8.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>1d wait</span>
            </div>
          </div>

          {/* Prominent Action Button */}
          <button
            onClick={() => {
              if (quickApprovedId) {
                onNavigateTab('quotations');
              } else {
                handleQuickApprove('TX-1024');
              }
            }}
            style={{
              background: quickApprovedId ? '#059669' : 'linear-gradient(135deg, #134e35 0%, #1a5e41 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 9999,
              padding: '9px 16px',
              fontSize: 12,
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
            {quickApprovedId ? <CheckCircle2 size={15} /> : <CheckCircle2 size={15} />}
            <span>{quickApprovedId ? 'Quotation TX-1024 Approved' : 'Review Pending Approvals'}</span>
          </button>
        </div>

        {/* =================================================================
            COLUMN C: DELIVERY & ORDER ALERTS
            Top 3 Urgent Delivery Orders with Bottleneck Reasons
            ================================================================= */}
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
          {/* Header with 'View All' Pill Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
              Delivery &amp; Order Alerts
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
              View All
              <ArrowRight size={11} strokeWidth={2.5} />
            </button>
          </div>

          {/* 3 Urgent Order Alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, justifyContent: 'center' }}>
            {/* Alert 1: LP-902 */}
            <div
              onClick={() => handleDeliveryAlertClick('LP-902')}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '5px 7px',
                borderRadius: 8,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: '#ef4444',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1
              }}>
                <AlertTriangle size={12} strokeWidth={2.5} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#991b1b' }}>
                    LP-902 &bull; ABC Garments
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 800, color: '#dc2626' }}>
                    +4d delay
                  </span>
                </div>
                <span style={{ fontSize: 8.5, color: '#7f1d1d', marginTop: 1, lineHeight: 1.2 }}>
                  Raw material shortage (600m Cotton Fabric awaiting PO-1001)
                </span>
                <span style={{ fontSize: 8, color: '#991b1b', marginTop: 1 }}>
                  Deadline: 04 Nov 2026 &bull; <strong style={{ color: '#dc2626' }}>High Risk</strong>
                </span>
              </div>
            </div>

            {/* Alert 2: LP-904 */}
            <div
              onClick={() => handleDeliveryAlertClick('LP-904')}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '5px 7px',
                borderRadius: 8,
                background: '#fffbeb',
                border: '1px solid #fde68a',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: '#f59e0b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1
              }}>
                <Clock size={12} strokeWidth={2.5} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#92400e' }}>
                    LP-904 &bull; StyleMart
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 800, color: '#d97706' }}>
                    +2d delay
                  </span>
                </div>
                <span style={{ fontSize: 8.5, color: '#78350f', marginTop: 1, lineHeight: 1.2 }}>
                  Production below target (Airjet loom #7 recalibration)
                </span>
                <span style={{ fontSize: 8, color: '#92400e', marginTop: 1 }}>
                  Deadline: 08 Nov 2026 &bull; <strong style={{ color: '#d97706' }}>Medium Risk</strong>
                </span>
              </div>
            </div>

            {/* Alert 3: LP-901 */}
            <div
              onClick={() => handleDeliveryAlertClick('LP-901')}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '5px 7px',
                borderRadius: 8,
                background: '#f8faf9',
                border: '1px solid #edf2ef',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: '#0d9488',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1
              }}>
                <Activity size={12} strokeWidth={2.5} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#111827' }}>
                    LP-901 &bull; FabIndia
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 800, color: '#0d9488' }}>
                    +1d delay
                  </span>
                </div>
                <span style={{ fontSize: 8.5, color: '#64748b', marginTop: 1, lineHeight: 1.2 }}>
                  Continuous dyeing cycle bottleneck (Drying pace -15%)
                </span>
                <span style={{ fontSize: 8, color: '#64748b', marginTop: 1 }}>
                  Deadline: 12 Nov 2026 &bull; <strong style={{ color: '#059669' }}>Low Risk</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          ROW 3: BOTTOM ROW (3 PANELS)
          Panel A (~44%): Factory Resource Utilization (Loom 82%, Workforce 88%, Output 76%)
          Panel B (~28%): Order Status Distribution (124 Orders Donut Chart)
          Panel C (~28%): Today's Factory Performance (Live Floor Monitor: 2,350m / 2,700m)
          =================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1.05fr 1.05fr',
        gap: 12,
        flex: 1.15,
        minHeight: 0
      }}>
        {/* =================================================================
            PANEL A: FACTORY RESOURCE UTILIZATION
            Horizontal progress bars for Loom, Workforce & Output Capacity
            ================================================================= */}
        <div
          onClick={() => onNavigateTab('supervisors')}
          title="Click to view full Supervisor & Resource Allocation"
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #edf2ef',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            minHeight: 0
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
              Factory Resource Utilization
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              border: '1.5px solid #d1d5db',
              borderRadius: 9999,
              padding: '3px 10px',
              fontSize: 10.5,
              fontWeight: 600,
              color: '#164e32',
              background: '#eaf6ef'
            }}>
              Details
              <ExternalLink size={10} />
            </span>
          </div>

          {/* 3 Horizontal Progress Indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, justifyContent: 'center' }}>
            {/* Loom Utilization: 82% */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#111827', marginBottom: 3 }}>
                <span>Loom Utilization</span>
                <span style={{ color: '#164e32' }}>82% <span style={{ fontSize: 9, fontWeight: 500, color: '#64748b' }}>(39/48 active)</span></span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ width: '82%', height: '100%', background: '#164e32', borderRadius: 9999 }} />
              </div>
            </div>

            {/* Workforce Utilization: 88% */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#111827', marginBottom: 3 }}>
                <span>Workforce Utilization</span>
                <span style={{ color: '#059669' }}>88% <span style={{ fontSize: 9, fontWeight: 500, color: '#64748b' }}>(141/160 present)</span></span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: '#22c55e', borderRadius: 9999 }} />
              </div>
            </div>

            {/* Production Capacity Utilization: 76% */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#111827', marginBottom: 3 }}>
                <span>Production Capacity Utilization</span>
                <span style={{ color: '#0d9488' }}>76% <span style={{ fontSize: 9, fontWeight: 500, color: '#64748b' }}>(2,660m benchmark)</span></span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ width: '76%', height: '100%', background: '#0d9488', borderRadius: 9999 }} />
              </div>
            </div>
          </div>

          {/* Bottom Floor Alert */}
          <div style={{ fontSize: 9, color: '#64748b', background: '#f8faf9', padding: '3px 8px', borderRadius: 6, border: '1px solid #edf2ef' }}>
            Loom #7 recalibration scheduled at 14:00 (Shed A) &bull; Zero bottleneck on Shed B
          </div>
        </div>

        {/* =================================================================
            PANEL B: ORDER STATUS DISTRIBUTION
            Order count distribution across mutually exclusive stages
            ================================================================= */}
        <div
          onClick={() => onNavigateTab('orders')}
          title="Click to explore Orders pipeline by status"
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #edf2ef',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            minHeight: 0
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
            Order Status Distribution
          </div>

          {/* Semi-Circular Arc / Donut Chart */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginTop: 2
          }}>
            <svg width="170" height="88" viewBox="0 0 170 88">
              {/* Completed: 30 orders (Forest Green) */}
              <path
                d="M 15 80 A 70 70 0 0 1 155 80"
                fill="none"
                stroke="#d0ebd8"
                strokeWidth="15"
                strokeLinecap="round"
              />

              {/* In Production: 58 orders (Dark Green) */}
              <path
                d="M 15 80 A 70 70 0 0 1 155 80"
                fill="none"
                stroke="#134e35"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset="90"
              />

              {/* Awaiting Approval + New: 30 orders */}
              <path
                d="M 15 80 A 70 70 0 0 1 155 80"
                fill="none"
                stroke="#52b788"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset="140"
              />

              {/* At Risk: 6 orders (Subtle Red warning segment) */}
              <path
                d="M 15 80 A 70 70 0 0 1 155 80"
                fill="none"
                stroke="#ef4444"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset="195"
              />
            </svg>

            {/* Central 124 Orders Metric */}
            <div style={{
              position: 'absolute',
              bottom: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.5px' }}>
                124
              </span>
              <span style={{ fontSize: 9.5, color: '#64748b', fontWeight: 600, marginTop: 2 }}>
                Total Orders
              </span>
            </div>
          </div>

          {/* Legend Row representing order counts */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3px 10px', fontSize: 9, fontWeight: 600, color: '#475569' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#134e35' }} />
              In Prod: <strong>58</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788' }} />
              Approval: <strong>14</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d0ebd8' }} />
              Completed: <strong>30</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ color: '#dc2626' }}>At Risk: <strong>06</strong></span>
            </span>
          </div>
        </div>

        {/* =================================================================
            PANEL C: TODAY'S FACTORY PERFORMANCE
            Live Floor Monitor replacing timer (2,350m of 2,700m target - 87%)
            ================================================================= */}
        <div
          onClick={() => onNavigateTab('production')}
          title="Click to open Live Floor Production Tracking"
          style={{
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
            cursor: 'pointer',
            minHeight: 0
          }}
        >
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
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2f0e8' }}>
              Today's Factory Performance
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 8.5,
              fontWeight: 800,
              color: '#86efac',
              background: 'rgba(134, 239, 172, 0.15)',
              padding: '2px 7px',
              borderRadius: 9999
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#86efac' }} />
              LIVE FLOOR
            </span>
          </div>

          {/* Main Production Completed Readout */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            margin: '2px 0'
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1 }}>
              2,350 <span style={{ fontSize: 16, fontWeight: 600, color: '#86efac' }}>metres</span>
            </div>
            <div style={{ fontSize: 10, color: '#cde7d8', marginTop: 3 }}>
              Today's Target: <strong>2,700 m</strong> &bull; <span style={{ color: '#86efac', fontWeight: 700 }}>87% Completed</span>
            </div>
          </div>

          {/* Production Progress Bar against Target */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.18)', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ width: '87%', height: '100%', background: '#22c55e', borderRadius: 9999 }} />
            </div>
          </div>

          {/* Remaining Production & Pace Metrics */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 9.5,
            color: '#cde7d8'
          }}>
            <span>Remaining: <strong style={{ color: '#ffffff' }}>350 metres</strong></span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '2px 8px',
              borderRadius: 6,
              color: '#86efac',
              fontWeight: 700
            }}>
              142 m/hr pace
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardModule;