import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Check,
  Eye,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  Truck,
  FileCheck2,
  AlertCircle,
  Activity
} from 'lucide-react';
import type { Order, AppUser } from '../../types';

interface ProductionTrackingModuleProps {
  orders: Order[];
  supervisors?: AppUser[];
  onSelectOrder: (orderId: string) => void;
  onOpenOrderModal: (order: Order) => void;
  onUpdateClientProgressView?: (orderId: string) => void;
  onInvestigateDelay?: (orderId: string) => void;
}

export const ProductionTrackingModule: React.FC<ProductionTrackingModuleProps> = ({
  orders,
  onSelectOrder,
  onOpenOrderModal,
  onUpdateClientProgressView: _onUpdateClientProgressView,
  onInvestigateDelay: _onInvestigateDelay
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('TX-1024');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // 5 Textile Production Stages
  const getOrderProductionStages = (order: Order) => {
    const isTX1024 = order.id === 'TX-1024';
    const isTX1025 = order.id === 'TX-1025';
    const isTX1026 = order.id === 'TX-1026';

    return [
      {
        id: 'stg_1',
        name: '1. Cutting',
        department: 'Pattern & Cutting Floor',
        plannedDates: '28 Oct - 30 Oct 2026',
        actualDates: '28 Oct - 29 Oct 2026',
        progressPercent: 100,
        status: 'completed' as const,
        produced: order.quantityMeters,
        target: order.quantityMeters,
        dailyTarget: 2500,
        dailyActual: 2500,
        workers: '8 Cutters Present',
        machine: 'CNC Laser Fabric Cutter Active',
        notes: 'Fabric pattern lay and laser cutting cleared with 99.4% precision.'
      },
      {
        id: 'stg_2',
        name: '2. Stitching',
        department: 'Garment Sewing Line A',
        plannedDates: '30 Oct - 08 Nov 2026',
        actualDates: '30 Oct - Ongoing',
        progressPercent: isTX1026 ? 100 : (isTX1024 ? 65 : 0),
        status: isTX1026 ? ('completed' as const) : (isTX1024 ? ('in_progress' as const) : ('pending' as const)),
        produced: isTX1026 ? order.quantityMeters : (isTX1024 ? 3250 : 0),
        target: order.quantityMeters,
        dailyTarget: 650,
        dailyActual: isTX1024 ? 650 : 0,
        workers: '24 Operators Present (Ramesh Kumar)',
        machine: 'Juki Direct Drive Lockstitch (19 units running)',
        notes: isTX1024 ? 'Running on track. 3,250 pcs completed. Sensor recalibrated on Line 3.' : 'Pending cutting completion.'
      },
      {
        id: 'stg_3',
        name: '3. Dyeing',
        department: 'Continuous Dyeing Bay (Shed B)',
        plannedDates: '09 Nov - 12 Nov 2026',
        actualDates: isTX1026 ? 'Completed' : (isTX1025 ? 'Ongoing' : 'Pending'),
        progressPercent: isTX1026 ? 100 : (isTX1025 ? 35 : (isTX1024 ? 30 : 0)),
        status: (isTX1025 || isTX1024) ? ('at_risk' as const) : (isTX1026 ? ('completed' as const) : ('pending' as const)),
        produced: isTX1026 ? order.quantityMeters : (isTX1025 ? 1050 : 1500),
        target: order.quantityMeters,
        dailyTarget: 1000,
        dailyActual: isTX1025 ? 520 : 0,
        workers: '12 Dye House Staff (Murugan K.)',
        machine: 'Eco Soft-Flow Dyeing Machine',
        delayReason: 'Reactive chemical dye deficit (50 kg) & cotton fabric shortage (600 m awaiting PO-1001 arrival)',
        correctiveAction: 'Dispatch expedited PO-1001 with Sri Textiles; delivery scheduled for 02 Nov.',
        notes: 'Stage flagged at risk due to raw chemical lead time.'
      },
      {
        id: 'stg_4',
        name: '4. Finishing',
        department: 'Garment Finishing & Steam Bay',
        plannedDates: '13 Nov - 14 Nov 2026',
        actualDates: isTX1026 ? 'Completed' : 'Pending',
        progressPercent: isTX1026 ? 100 : 0,
        status: isTX1026 ? ('completed' as const) : ('pending' as const),
        produced: isTX1026 ? order.quantityMeters : 0,
        target: order.quantityMeters,
        dailyTarget: 2500,
        dailyActual: 0,
        workers: 'Steam ironers on standby',
        machine: 'Veit Steam Finishing Tunnel',
        notes: 'Waiting for stitching & dyeing completion.'
      },
      {
        id: 'stg_5',
        name: '5. Quality Check & Packing',
        department: 'Final QA & Carton Dispatch Bay',
        plannedDates: '14 Nov - 15 Nov 2026',
        actualDates: isTX1026 ? 'Completed' : 'Pending',
        progressPercent: isTX1026 ? 100 : 0,
        status: isTX1026 ? ('completed' as const) : ('pending' as const),
        produced: isTX1026 ? order.quantityMeters : 0,
        target: order.quantityMeters,
        dailyTarget: 5000,
        dailyActual: 0,
        workers: 'AQL 2.5 Audit Inspectors',
        machine: 'Needle Detector & Barcode Sealers Ready',
        notes: 'Scheduled for dispatch inspection on target delivery date.'
      }
    ];
  };

  const stages = getOrderProductionStages(selectedOrder);

  const getOrderStatusBadge = (orderId: string) => {
    switch (orderId) {
      case 'TX-1024':
        return <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>In Progress</span>;
      case 'TX-1025':
        return <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>At Risk</span>;
      case 'TX-1026':
        return <span style={{ background: '#dff1ea', color: '#1e473d', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>Completed</span>;
      case 'TX-1027':
      case 'TX-1028':
      default:
        return <span style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>Pending</span>;
    }
  };

  const getOrderProgress = (orderId: string): number => {
    switch (orderId) {
      case 'TX-1024': return 65;
      case 'TX-1025': return 35;
      case 'TX-1026': return 100;
      case 'TX-1027': return 0;
      case 'TX-1028': return 0;
      default: return 50;
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (stageFilter === 'in_production') return o.id === 'TX-1024';
    if (stageFilter === 'at_risk') return o.id === 'TX-1025';
    if (stageFilter === 'completed') return o.id === 'TX-1026';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      {/* 1. PAGE HEADER */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>
            Production Tracking
          </h1>
        </div>
      </div>

      {/* 2. TOP 4 KPI CARDS */}
      <div className="kpi-strip-flat">
        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              In Production
            </div>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              background: '#e0f2fe',
              color: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>14</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>&uarr; 6%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              At Risk
            </div>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>3</span>
            <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>&uarr; 1%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Completed
            </div>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              background: '#dff1ea',
              color: '#1e473d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>22</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>&uarr; 8%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              On Time Delivery
            </div>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              background: '#ede9fe',
              color: '#5b21b6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>92%</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>&uarr; 2%</span>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN MAIN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 0.95fr)', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Left Column: Production Orders Table & Order Flow Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', paddingRight: 4 }}>
          {/* Production Orders Table */}
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e5e9ee',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} color="#111315" />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
                  Production Orders
                </h3>
              </div>

              <select
                className="admin-form-select"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="in_production">In Production</option>
                <option value="at_risk">At Risk</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #edf1f5', textAlign: 'left' }}>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Order ID</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Product</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600, width: 90 }}>Progress</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Current Stage</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Deadline</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => {
                    const isSelected = o.id === selectedOrderId;
                    const progress = getOrderProgress(o.id);

                    return (
                      <tr
                        key={o.id}
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          onSelectOrder(o.id);
                        }}
                        style={{
                          background: isSelected ? '#f0fdf9' : 'transparent',
                          cursor: 'pointer',
                          borderBottom: '1px solid #edf1f5',
                          transition: 'background 0.15s'
                        }}
                      >
                        <td style={{ padding: '10px 6px', fontWeight: 800, color: isSelected ? '#1e473d' : '#0a0d10' }}>
                          {o.id}
                        </td>
                        <td style={{ padding: '10px 6px', color: '#0a0d10', fontWeight: 600 }}>
                          {o.productName}
                        </td>
                        <td style={{ padding: '10px 6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${progress}%`,
                                  height: '100%',
                                  background: o.id === 'TX-1025' ? '#f59e0b' : (progress === 100 || progress === 85 ? '#10b981' : '#0284c7'),
                                  borderRadius: 9999
                                }}
                              />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', minWidth: 26 }}>
                              {progress}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 6px', color: '#475569' }}>
                          {o.currentPhase}
                        </td>
                        <td style={{ padding: '10px 6px' }}>
                          {getOrderStatusBadge(o.id)}
                        </td>
                        <td style={{ padding: '10px 6px', color: '#64748b' }}>
                          {o.deadlineDate.replace(' 2026', '')}
                        </td>
                        <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrderId(o.id);
                              onSelectOrder(o.id);
                            }}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: 9999,
                              padding: '3px 10px',
                              color: '#0a0d10',
                              fontSize: 10.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2
                            }}
                          >
                            View <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Flow Pipeline Stepper */}
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e5e9ee',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="#111315" />
              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0a0d10' }}>
                Order Flow &bull; {selectedOrder.id} ({selectedOrder.productName})
              </h4>
            </div>

            {/* Visual Stepper */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '6px 20px 0 20px'
            }}>
              {/* Submitted Step */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#dff1ea',
                  color: '#1e473d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={14} />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0a0d10' }}>Submitted</span>
                <span style={{ fontSize: 9.5, color: '#94a3b8' }}>28 Oct</span>
              </div>

              {/* Connector 1 */}
              <div style={{ flex: 1, height: 2, background: '#10b981', margin: '0 -2px', marginTop: -18 }} />

              {/* Feasibility Step */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#dff1ea',
                  color: '#1e473d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={14} />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0a0d10' }}>Feasibility</span>
                <span style={{ fontSize: 9.5, color: '#94a3b8' }}>29 Oct</span>
              </div>

              {/* Connector 2 */}
              <div style={{ flex: 1, height: 2, background: '#10b981', margin: '0 -2px', marginTop: -18 }} />

              {/* Quotation Step */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#dff1ea',
                  color: '#1e473d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={14} />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0a0d10' }}>Quotation</span>
                <span style={{ fontSize: 9.5, color: '#94a3b8' }}>30 Oct</span>
              </div>

              {/* Connector 3 */}
              <div style={{ flex: 1, height: 2, background: '#111315', margin: '0 -2px', marginTop: -18 }} />

              {/* Production Step (Active) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: '#111315',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 4px rgba(17, 19, 21, 0.15)'
                }}>
                  <Layers size={14} />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: '#111315' }}>Production</span>
                <span style={{ fontSize: 9.5, color: '#1e473d', fontWeight: 700 }}>In Progress</span>
              </div>

              {/* Connector 4 */}
              <div style={{ flex: 1, height: 2, background: '#e2e8f0', margin: '0 -2px', marginTop: -18 }} />

              {/* Delivery Step */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Truck size={14} />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#94a3b8' }}>Delivery</span>
                <span style={{ fontSize: 9.5, color: '#94a3b8' }}>Pending</span>
              </div>
            </div>
          </div>

          {/* 5 Stages Detail List */}
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e5e9ee',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0a0d10' }}>
              Stage Progress & Operations Checklist
            </h4>

            {stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in_progress';
              const isAtRisk = stage.status === 'at_risk';

              return (
                <div
                  key={stage.id}
                  style={{
                    borderBottom: '1px solid #edf1f5',
                    padding: '10px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isCompleted ? '#dff1ea' : (isInProgress ? '#111315' : (isAtRisk ? '#fef3c7' : '#f1f5f9')),
                        color: isCompleted ? '#1e473d' : (isInProgress ? '#ffffff' : (isAtRisk ? '#b45309' : '#94a3b8')),
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 800
                      }}>
                        {isCompleted ? <Check size={12} /> : idx + 1}
                      </span>
                      <strong style={{ fontSize: 12.5, color: '#0a0d10' }}>{stage.name}</strong>
                      <span style={{ fontSize: 10, color: '#64748b' }}>&bull; {stage.department}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: isAtRisk ? '#b45309' : (isCompleted ? '#16a34a' : '#0369a1') }}>
                        {stage.progressPercent}% ({stage.produced.toLocaleString()} / {stage.target.toLocaleString()} pcs)
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: 9,
                        fontWeight: 700,
                        background: isCompleted ? '#dcfce7' : (isAtRisk ? '#fef3c7' : (isInProgress ? '#e0f2fe' : '#f1f5f9')),
                        color: isCompleted ? '#15803d' : (isAtRisk ? '#b45309' : (isInProgress ? '#0369a1' : '#64748b'))
                      }}>
                        {stage.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 4, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${stage.progressPercent}%`,
                        height: '100%',
                        background: isAtRisk ? '#f59e0b' : (isCompleted ? '#10b981' : '#111315'),
                        borderRadius: 9999
                      }}
                    />
                  </div>

                  {isAtRisk && (
                    <div style={{ borderLeft: '3px solid #d97706', padding: '6px 10px', fontSize: 11, background: '#fffbeb', borderRadius: '0 8px 8px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={13} color="#d97706" />
                        <span>Delay Alert: {stage.delayReason}</span>
                      </div>
                      <div style={{ color: '#92400e' }}>
                        <strong>Action:</strong> {stage.correctiveAction}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Details, Donut Chart, Supervisor, & Alerts */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          overflowY: 'auto'
        }}>
          {/* Order Details Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e5e9ee',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Order Details
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0a0d10', marginTop: 2 }}>
                  {selectedOrder.id}
                </h2>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {selectedOrder.productName} &bull; {selectedOrder.clientName}
                </div>
              </div>

              <span style={{ background: '#dff1ea', color: '#1e473d', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>
                &bull; On Track
              </span>
            </div>

            {/* Donut Chart and Metadata */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '6px 0' }}>
              {/* SVG Donut */}
              <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#1e473d"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(65 / 100) * (2 * Math.PI * 32)} ${2 * Math.PI * 32}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>65%</span>
                  <span style={{ fontSize: 8.5, color: '#94a3b8' }}>Complete</span>
                </div>
              </div>

              {/* Metadata */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color="#64748b" />
                  <div>
                    <span style={{ fontSize: 9.5, color: '#94a3b8', display: 'block' }}>Deadline</span>
                    <strong style={{ color: '#0a0d10' }}>{selectedOrder.deadlineDate}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileCheck2 size={14} color="#64748b" />
                  <div>
                    <span style={{ fontSize: 9.5, color: '#94a3b8', display: 'block' }}>Supervisor</span>
                    <strong style={{ color: '#0a0d10' }}>{selectedOrder.assignedSupervisorName || 'Ramesh Kumar'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Info Banner */}
            <div style={{
              background: '#dff1ea',
              border: '1px solid #c6e5db',
              borderRadius: 16,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e473d', fontWeight: 700, fontSize: 11 }}>
                <CheckCircle2 size={14} color="#1e473d" />
                <span>Key Info</span>
              </div>
              <p style={{ fontSize: 10.5, color: '#1e473d', margin: 0 }}>
                On track to meet deadline. 3,250 of 5,000 pcs completed across cutting and stitching.
              </p>
            </div>
          </div>

          {/* Alerts Box */}
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e5e9ee',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} color="#111315" />
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0a0d10' }}>
                  Alerts
                </h4>
              </div>
              <span style={{ fontSize: 11, color: '#1e473d', fontWeight: 700, cursor: 'pointer' }}>
                View All &rarr;
              </span>
            </div>

            <div style={{
              background: '#fffbeb',
              borderLeft: '3px solid #f59e0b',
              padding: '8px 10px',
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>
                  Material shortage: Cotton Fabric
                </span>
                <span style={{ fontSize: 9.5, color: '#94a3b8' }}>2h ago</span>
              </div>
              <span style={{ fontSize: 10, color: '#b45309' }}>
                600 m required for finishing. PO-1001 queued for Sri Textiles.
              </span>
            </div>

            <div style={{
              background: '#ede9fe',
              borderLeft: '3px solid #7c3aed',
              padding: '8px 10px',
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#5b21b6' }}>
                  Price increase: Dyeing Chemicals
                </span>
                <span style={{ fontSize: 9.5, color: '#94a3b8' }}>4h ago</span>
              </div>
              <span style={{ fontSize: 10, color: '#6d28d9' }}>
                +8% this week on spot exchange. Proposed revision prepared.
              </span>
            </div>

            {/* Action Button */}
            <div style={{ marginTop: 'auto', paddingTop: 6 }}>
              <button
                className="admin-btn-primary"
                style={{ width: '100%', fontSize: 11.5, padding: '9px 12px', justifyContent: 'center' }}
                onClick={() => onOpenOrderModal(selectedOrder)}
              >
                <Eye size={14} />
                <span>Explore Order Details & Timeline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
