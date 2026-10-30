import React, { useState } from 'react';
import {
  Search,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Check,
  Package,
  Award
} from 'lucide-react';
import type { Order, OrderItemProduct } from '../../types';

interface OrderPipelineModuleProps {
  orders: Order[];
  selectedOrderId: string;
  onSelectOrder: (id: string) => void;
  onOpenOrderModal: (order: Order) => void;
  onDeclineOrder?: (id: string) => void;
}

export const OrderPipelineModule: React.FC<OrderPipelineModuleProps> = ({
  orders: propOrders,
  selectedOrderId: _selectedOrderId,
  onSelectOrder,
  onOpenOrderModal
}) => {
  const [orders, setOrders] = useState<Order[]>(propOrders);
  const [statusFilter, setStatusFilter] = useState<'all' | 'on_track' | 'at_risk' | 'early_production' | 'just_started'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [activeDetailOrderId, setActiveDetailOrderId] = useState<string | null>(null);
  const [selectedProductItemId, setSelectedProductItemId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quantity-Weighted Order Progress Calculation
  const calculateWeightedProgress = (items?: OrderItemProduct[], fallbackProgress: number = 0): number => {
    if (!items || items.length === 0) return fallbackProgress;
    const totalQty = items.reduce((acc, item) => acc + item.quantityPieces, 0);
    if (totalQty === 0) return fallbackProgress;
    const weightedSum = items.reduce((acc, item) => acc + (item.quantityPieces * item.progressPercent), 0);
    return Math.round(weightedSum / totalQty);
  };

  // Determine Card Size & Color Category
  const getCardPresentation = (order: Order) => {
    const progress = calculateWeightedProgress(
      order.items,
      Math.round((order.producedMeters / (order.quantityMeters || 1)) * 100)
    );

    const isAtRisk = order.riskStatus === 'at_risk' || order.status === 'awaiting_admin_decision';
    const isCompleted = progress >= 95 || order.status === 'completed';
    const isAlmostCompleted = progress >= 70 && !isAtRisk;
    const isEarlyOrWarning = (progress >= 20 && progress < 45 && !isAtRisk) || order.riskStatus === 'early_production';
    const isSmallJustStarted = progress < 20 && !isAtRisk;

    // Sizing: Large = span 2, Medium = span 1, Small = span 1 (compact)
    let sizeCategory: 'large' | 'medium' | 'small' = 'medium';
    if (isAlmostCompleted || isCompleted) {
      sizeCategory = 'large';
    } else if (isSmallJustStarted) {
      sizeCategory = 'small';
    }

    // Color Theme: full red for At-Risk, yellow for early/warning, green for completed, mint/white for standard
    let themeType: 'red' | 'yellow' | 'dark_green' | 'mint_large' | 'white_standard' = 'white_standard';
    if (isAtRisk) {
      themeType = 'red';
    } else if (isCompleted) {
      themeType = 'dark_green';
    } else if (isAlmostCompleted) {
      themeType = 'mint_large';
    } else if (isEarlyOrWarning) {
      themeType = 'yellow';
    }

    return {
      progress,
      isAtRisk,
      sizeCategory,
      themeType
    };
  };

  // Handle stage advancement
  const handleAdvanceStage = (orderId: string, itemId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId || !ord.items) return ord;

        const updatedItems = ord.items.map((item) => {
          if (item.id !== itemId) return item;

          const currentInProgIdx = item.timeline.findIndex((s) => s.status === 'in_progress');
          if (currentInProgIdx === -1) {
            const firstPendingIdx = item.timeline.findIndex((s) => s.status === 'pending');
            if (firstPendingIdx !== -1) {
              const newTimeline = [...item.timeline];
              newTimeline[firstPendingIdx] = {
                ...newTimeline[firstPendingIdx],
                status: 'in_progress',
                dateOrDetails: 'In progress · Current stage'
              };
              const newProgress = Math.min(100, item.progressPercent + 15);
              return { ...item, progressPercent: newProgress, timeline: newTimeline };
            }
            return item;
          }

          const newTimeline = [...item.timeline];
          newTimeline[currentInProgIdx] = {
            ...newTimeline[currentInProgIdx],
            status: 'completed',
            dateOrDetails: `Completed · ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
          };

          if (currentInProgIdx + 1 < newTimeline.length) {
            newTimeline[currentInProgIdx + 1] = {
              ...newTimeline[currentInProgIdx + 1],
              status: 'in_progress',
              dateOrDetails: 'Current stage · Underway'
            };
          }

          const completedCount = newTimeline.filter((s) => s.status === 'completed').length;
          const inProgressCount = newTimeline.filter((s) => s.status === 'in_progress').length;
          const calculatedItemProgress = Math.round(((completedCount + inProgressCount * 0.5) / newTimeline.length) * 100);

          return {
            ...item,
            progressPercent: calculatedItemProgress,
            timeline: newTimeline
          };
        });

        const newWeighted = calculateWeightedProgress(updatedItems);
        const newProduced = Math.round((ord.quantityMeters * newWeighted) / 100);

        return {
          ...ord,
          items: updatedItems,
          producedMeters: newProduced
        };
      })
    );

    showNotification(`Stage advanced & overall progress recalculated automatically.`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClient = selectedClientFilter === 'all' || o.clientName === selectedClientFilter;

    let matchesStatus = true;
    if (statusFilter === 'on_track') matchesStatus = o.riskStatus === 'on_track' || (!o.riskStatus && o.status === 'in_production');
    else if (statusFilter === 'at_risk') matchesStatus = o.riskStatus === 'at_risk' || o.status === 'awaiting_admin_decision';
    else if (statusFilter === 'early_production') matchesStatus = o.riskStatus === 'early_production';
    else if (statusFilter === 'just_started') matchesStatus = o.riskStatus === 'just_started' || o.status === 'submitted';

    return matchesSearch && matchesClient && matchesStatus;
  });

  const activeOrder = orders.find((o) => o.id === activeDetailOrderId);
  const activeProduct = activeOrder?.items?.find((i) => i.id === selectedProductItemId) || activeOrder?.items?.[0];

  // =========================================================================
  // VIEW MODE 2: DEDICATED FULL-PAGE ORDER DETAILS VIEW
  // =========================================================================
  if (activeOrder) {
    const weightedOrderProgress = calculateWeightedProgress(
      activeOrder.items,
      Math.round((activeOrder.producedMeters / (activeOrder.quantityMeters || 1)) * 100)
    );
    const isAtRisk = activeOrder.riskStatus === 'at_risk' || activeOrder.status === 'awaiting_admin_decision';

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: '100%',
        overflowY: 'auto',
        paddingRight: 4
      }}>
        {/* Top Back Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <button
            onClick={() => setActiveDetailOrderId(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              border: '1px solid #edf2ef',
              borderRadius: 9999,
              padding: '6px 14px',
              fontSize: 11.5,
              fontWeight: 700,
              color: '#164e32',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
            }}
          >
            <ArrowLeft size={14} />
            Back to Orders Overview
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 10,
              fontWeight: 700,
              color: isAtRisk ? '#dc2626' : '#164e32',
              background: isAtRisk ? '#fef2f2' : '#eaf6ef',
              border: isAtRisk ? '1px solid #fecaca' : '1px solid #cde7d8',
              padding: '3px 10px',
              borderRadius: 9999
            }}>
              {isAtRisk ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
              {isAtRisk ? 'At Risk Intervention' : 'Production Active'}
            </span>

            <button
              onClick={() => onOpenOrderModal(activeOrder)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#164e32',
                color: '#ffffff',
                border: 'none',
                borderRadius: 9999,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Inspect Specifications
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>

        {/* 1. ORDER SUMMARY AT THE TOP */}
        <div style={{
          background: isAtRisk ? '#fff5f5' : '#ffffff',
          borderRadius: 20,
          border: isAtRisk ? '2px solid #ef4444' : '1px solid #edf2ef',
          padding: '16px 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.4px' }}>
                  {activeOrder.id}
                </h1>
                <span style={{
                  background: isAtRisk ? '#ef4444' : '#164e32',
                  color: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: 9999,
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px'
                }}>
                  {isAtRisk ? 'At Risk' : 'In Production'}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginTop: 2 }}>
                {activeOrder.clientName} &bull; <span style={{ fontWeight: 500, color: '#64748b' }}>{activeOrder.productName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11 }}>
              <div style={{ background: '#f8faf9', padding: '6px 12px', borderRadius: 10, border: '1px solid #edf2ef' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: 9 }}>Order Date</span>
                <strong style={{ color: '#111827' }}>{activeOrder.submittedDate}</strong>
              </div>
              <div style={{ background: '#f8faf9', padding: '6px 12px', borderRadius: 10, border: '1px solid #edf2ef' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: 9 }}>Delivery Deadline</span>
                <strong style={{ color: isAtRisk ? '#dc2626' : '#164e32' }}>{activeOrder.deadlineDate}</strong>
              </div>
              <div style={{ background: '#f8faf9', padding: '6px 12px', borderRadius: 10, border: '1px solid #edf2ef' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: 9 }}>Total Volume</span>
                <strong style={{ color: '#111827' }}>
                  {activeOrder.items?.reduce((a, b) => a + b.quantityPieces, 0)?.toLocaleString() || activeOrder.quantityMeters.toLocaleString()} pcs
                </strong>
              </div>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '12px 14px',
            border: '1px solid #edf2ef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>
                  Overall Order Progress: <span style={{ color: isAtRisk ? '#dc2626' : '#164e32', fontSize: 18 }}>{weightedOrderProgress}%</span>
                </span>
                <span style={{ fontSize: 10, color: '#64748b', marginLeft: 8 }}>
                  (Quantity-Weighted across {activeOrder.items?.length || 1} designs)
                </span>
              </div>
              <div style={{ fontSize: 9.5, color: '#164e32', fontWeight: 700, background: '#eaf6ef', padding: '2px 8px', borderRadius: 6 }}>
                &sum;(Qty &times; Item Progress) / &sum;Qty
              </div>
            </div>

            <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${weightedOrderProgress}%`,
                  height: '100%',
                  background: isAtRisk ? '#dc2626' : '#164e32',
                  borderRadius: 9999,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>

            {isAtRisk && (
              <div style={{
                marginTop: 8,
                padding: '6px 10px',
                borderRadius: 8,
                background: '#fee2e2',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10,
                color: '#991b1b',
                fontWeight: 700
              }}>
                <AlertTriangle size={13} color="#dc2626" />
                <span>
                  <strong>Risk Cause:</strong> {activeOrder.riskReason || 'Material shortage or production speed recalibration required.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. PRODUCT / DESIGN SELECTOR BELOW IT */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Items in this Order ({activeOrder.items?.length || 0})
            </h2>
            <span style={{ fontSize: 10, color: '#64748b' }}>
              Select a design to inspect its timeline below
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 10
          }}>
            {activeOrder.items?.map((item) => {
              const isSelected = activeProduct?.id === item.id;
              const isItemAtRisk = item.riskStatus === 'at_risk';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedProductItemId(item.id)}
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    border: isSelected ? '2px solid #164e32' : isItemAtRisk ? '1.5px solid #ef4444' : '1px solid #edf2ef',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 14px rgba(22, 78, 50, 0.15)' : '0 1px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          objectFit: 'cover',
                          border: '1px solid #edf2ef',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: '#eaf6ef',
                        color: '#164e32',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Package size={20} />
                      </div>
                    )}

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#111827', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                        {item.quantityPieces.toLocaleString()} pieces &bull; <span style={{ color: '#164e32', fontWeight: 700 }}>{item.designCode}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, marginBottom: 3 }}>
                      <span style={{ color: '#475569' }}>Item Progress</span>
                      <span style={{ color: isItemAtRisk ? '#dc2626' : '#164e32' }}>{item.progressPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.progressPercent}%`,
                          height: '100%',
                          background: isItemAtRisk ? '#ef4444' : '#164e32',
                          borderRadius: 9999
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: isItemAtRisk ? '#ffffff' : '#164e32',
                      background: isItemAtRisk ? '#ef4444' : '#eaf6ef',
                      padding: '2px 8px',
                      borderRadius: 9999
                    }}>
                      {isItemAtRisk ? 'Shortage Detected' : isSelected ? 'Active Timeline' : 'Click to Inspect'}
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: 9, color: '#164e32', fontWeight: 800 }}>
                        Viewing &darr;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. INDIVIDUAL PRODUCT PRODUCTION TIMELINE UNDERNEATH */}
        {activeProduct && (
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #edf2ef',
            padding: '18px 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0 }}>
                    {activeProduct.name} &bull; Timeline
                  </h3>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: '#eaf6ef',
                    color: '#164e32',
                    padding: '2px 8px',
                    borderRadius: 9999
                  }}>
                    {activeProduct.quantityPieces.toLocaleString()} pieces
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  Independent production tracking &bull; Product Progress: <strong>{activeProduct.progressPercent}%</strong>
                </div>
              </div>

              <button
                onClick={() => handleAdvanceStage(activeOrder.id, activeProduct.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#164e32',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '7px 16px',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(22, 78, 50, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Check size={14} strokeWidth={2.5} />
                <span>Advance Production Stage &bull; Recalculate Progress</span>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 8,
              padding: '12px 0 6px',
              borderTop: '1px solid #f1f5f9',
              borderBottom: '1px solid #f1f5f9'
            }}>
              {activeProduct.timeline.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isInProgress = stage.status === 'in_progress';

                return (
                  <div
                    key={stage.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      background: isInProgress ? '#eaf6ef' : isCompleted ? '#f8faf9' : '#ffffff',
                      border: isInProgress ? '1.5px solid #164e32' : '1px solid #edf2ef',
                      borderRadius: 12,
                      padding: '10px 10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: '#64748b' }}>
                        Step {idx + 1}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 size={15} color="#164e32" />
                      ) : isInProgress ? (
                        <Clock size={15} color="#164e32" />
                      ) : (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #cbd5e1' }} />
                      )}
                    </div>

                    <div style={{ fontSize: 11, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                      {stage.name}
                    </div>

                    <span style={{
                      fontSize: 8.5,
                      fontWeight: 700,
                      alignSelf: 'flex-start',
                      color: isCompleted ? '#164e32' : isInProgress ? '#164e32' : '#94a3b8',
                      background: isCompleted ? '#dcfce7' : isInProgress ? '#ffffff' : '#f1f5f9',
                      padding: '1px 6px',
                      borderRadius: 4
                    }}>
                      {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                    </span>

                    <div style={{ fontSize: 8.5, color: '#64748b', lineHeight: 1.3 }}>
                      {stage.dateOrDetails}
                    </div>

                    {stage.notes && (
                      <div style={{ fontSize: 8, color: '#94a3b8', fontStyle: 'italic', marginTop: 'auto' }}>
                        {stage.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#111827',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            zIndex: 100
          }}>
            <Sparkles size={15} color="#86efac" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 1: VISUAL PRODUCTION CARDS GRID (With Bold Colors & Distinct Sizes)
  // =========================================================================
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      height: '100%',
      overflowY: 'auto',
      paddingRight: 4
    }}>
      {/* 1. PAGE HEADER */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', margin: 0 }}>
            Production Orders
          </h1>
          <p style={{ fontSize: 10.5, color: '#64748b', margin: '2px 0 0' }}>
            Visual production cards &bull; Card size represents progress, bold colours represent risk &amp; status
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => showNotification('Client intake modal opened.')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#164e32',
              color: '#ffffff',
              border: 'none',
              borderRadius: 9999,
              padding: '6px 16px',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(22, 78, 50, 0.25)'
            }}
          >
            <Plus size={14} />
            New Order
          </button>
        </div>
      </div>

      {/* 2. STATUS FILTER PILLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All Orders', count: orders.length },
          { key: 'on_track', label: 'On Track', count: orders.filter((o) => o.riskStatus === 'on_track' || (!o.riskStatus && o.status === 'in_production')).length },
          { key: 'at_risk', label: 'At Risk', count: orders.filter((o) => o.riskStatus === 'at_risk' || o.status === 'awaiting_admin_decision').length },
          { key: 'early_production', label: 'Early Production', count: orders.filter((o) => o.riskStatus === 'early_production').length },
          { key: 'just_started', label: 'Just Started', count: orders.filter((o) => o.riskStatus === 'just_started' || o.status === 'submitted').length }
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 9999,
                border: isActive ? '1px solid #cde7d8' : '1px solid #edf2ef',
                background: isActive ? '#eaf6ef' : '#ffffff',
                color: isActive ? '#164e32' : '#475569',
                fontSize: 11,
                fontWeight: isActive ? 800 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: isActive ? 'rgba(22, 78, 50, 0.15)' : '#f1f5f9',
                color: isActive ? '#164e32' : '#64748b',
                padding: '1px 7px',
                borderRadius: 9999,
                fontSize: 9.5,
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & CLIENT CONTROLS ROW */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#ffffff',
          border: '1px solid #edf2ef',
          borderRadius: 9999,
          padding: '6px 14px',
          flex: 1,
          maxWidth: 420
        }}>
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by order ID, client or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 11.5, background: 'transparent', width: '100%', color: '#111827' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            className="admin-form-select"
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            style={{ fontSize: 11 }}
          >
            <option value="all">All Clients</option>
            <option value="Fashion House">Fashion House</option>
            <option value="Urban Textiles">Urban Textiles</option>
            <option value="Style World">Style World</option>
            <option value="Home Living">Home Living</option>
            <option value="ABC Garments">ABC Garments</option>
            <option value="StyleMart">StyleMart</option>
          </select>

          {/* Color Legend Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, background: '#f8faf9', padding: '4px 10px', borderRadius: 9999, border: '1px solid #edf2ef' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444' }} />
              Full Red (At Risk)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#facc15' }} />
              Full Yellow (Early)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#164e32' }} />
              Large (Span 2)
            </span>
          </div>
        </div>
      </div>

      {/* 4. RESPONSIVE GRID OF VISUAL PRODUCTION CARDS (With Distinct Sizes & Bold Full Colors) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
        alignItems: 'stretch'
      }}>
        {filteredOrders.map((order) => {
          const { progress, isAtRisk, sizeCategory, themeType } = getCardPresentation(order);
          const isLarge = sizeCategory === 'large';
          const isSmall = sizeCategory === 'small';

          // Visual styles based on themeType:
          let cardBg = '#ffffff';
          let cardBorder = '1px solid #edf2ef';
          let textColor = '#111827';
          let subtitleColor = '#475569';
          let progressBg = '#f1f5f9';
          let progressFill = '#164e32';
          let pillBg = '#eaf6ef';
          let pillText = '#164e32';
          let pillBorder = '1px solid #cde7d8';
          let chevronBg = '#f1f5f9';
          let chevronColor = '#111827';
          let cardShadow = '0 1px 6px rgba(0,0,0,0.02)';

          // FULL RED for At-Risk Cards (as requested by user!)
          if (themeType === 'red') {
            cardBg = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            cardBorder = '1.5px solid #b91c1c';
            textColor = '#ffffff';
            subtitleColor = '#fecaca';
            progressBg = 'rgba(255, 255, 255, 0.25)';
            progressFill = '#ffffff';
            pillBg = '#ffffff';
            pillText = '#dc2626';
            pillBorder = 'none';
            chevronBg = '#ffffff';
            chevronColor = '#dc2626';
            cardShadow = '0 4px 16px rgba(220, 38, 38, 0.22)';
          }
          // FULL YELLOW for Early Production / Warning (as requested by user!)
          else if (themeType === 'yellow') {
            cardBg = 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)';
            cardBorder = '1.5px solid #eab308';
            textColor = '#78350f';
            subtitleColor = '#854d0e';
            progressBg = 'rgba(133, 77, 14, 0.18)';
            progressFill = '#78350f';
            pillBg = '#78350f';
            pillText = '#ffffff';
            pillBorder = 'none';
            chevronBg = '#78350f';
            chevronColor = '#ffffff';
            cardShadow = '0 4px 14px rgba(234, 179, 8, 0.18)';
          }
          // FULL FOREST GREEN for 100% Completed
          else if (themeType === 'dark_green') {
            cardBg = 'linear-gradient(135deg, #134e35 0%, #1a5e41 100%)';
            cardBorder = '1.5px solid #0d3824';
            textColor = '#ffffff';
            subtitleColor = '#cde7d8';
            progressBg = 'rgba(255, 255, 255, 0.2)';
            progressFill = '#86efac';
            pillBg = '#ffffff';
            pillText = '#134e35';
            pillBorder = 'none';
            chevronBg = '#ffffff';
            chevronColor = '#134e35';
            cardShadow = '0 4px 16px rgba(19, 78, 53, 0.25)';
          }
          // MINT LARGE for Almost Completed (Spans 2 columns!)
          else if (themeType === 'mint_large') {
            cardBg = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
            cardBorder = '2px solid #164e32';
            textColor = '#111827';
            subtitleColor = '#164e32';
            progressBg = 'rgba(22, 78, 50, 0.12)';
            progressFill = '#164e32';
            pillBg = '#164e32';
            pillText = '#ffffff';
            pillBorder = 'none';
            chevronBg = '#164e32';
            chevronColor = '#ffffff';
            cardShadow = '0 4px 18px rgba(22, 78, 50, 0.12)';
          }

          return (
            <div
              key={order.id}
              onClick={() => {
                setActiveDetailOrderId(order.id);
                onSelectOrder(order.id);
              }}
              style={{
                gridColumn: isLarge ? 'span 2' : 'span 1',
                background: cardBg,
                border: cardBorder,
                borderRadius: 22,
                padding: isLarge ? '20px 24px' : isSmall ? '12px 16px' : '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: isLarge ? 220 : isSmall ? 135 : 180,
                cursor: 'pointer',
                boxShadow: cardShadow,
                transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Header: ID + Status Badge + Chevron */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: isLarge ? 18 : 15,
                      fontWeight: 800,
                      color: textColor,
                      letterSpacing: '-0.3px'
                    }}>
                      {order.id}
                    </span>

                    <span style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      background: pillBg,
                      color: pillText,
                      border: pillBorder,
                      padding: '2px 9px',
                      borderRadius: 9999,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                      {isAtRisk ? 'At Risk' : progress >= 95 ? 'Completed' : isLarge ? 'Almost Completed' : order.riskStatus === 'early_production' ? 'Early Prod' : 'On Track'}
                    </span>
                  </div>

                  <div style={{
                    fontSize: isLarge ? 13 : 11.5,
                    fontWeight: 700,
                    color: textColor,
                    marginTop: 3
                  }}>
                    {order.clientName}
                  </div>
                </div>

                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: chevronBg,
                  color: chevronColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                  <ChevronRight size={15} strokeWidth={2.5} />
                </div>
              </div>

              {/* Product and Pieces commitment */}
              <div style={{ fontSize: isLarge ? 12 : 10.5, color: subtitleColor, margin: isSmall ? '2px 0' : '4px 0' }}>
                <span style={{ fontWeight: 700, color: textColor }}>{order.productName}</span> &bull; {order.quantityMeters.toLocaleString()} pcs
              </div>

              {/* For Large Cards: Multi-item mini chips preview */}
              {isLarge && order.items && order.items.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: 8,
                  margin: '6px 0',
                  flexWrap: 'wrap'
                }}>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(22, 78, 50, 0.2)',
                        borderRadius: 8,
                        padding: '3px 8px',
                        fontSize: 9.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#164e32' }}>{item.name}:</span>
                      <strong style={{ color: '#111827' }}>{item.progressPercent}%</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress Section: Clear percentage & visual bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{
                    fontSize: isLarge ? 34 : isSmall ? 22 : 26,
                    fontWeight: 800,
                    color: textColor,
                    lineHeight: 1,
                    letterSpacing: '-0.5px'
                  }}>
                    {progress}%
                  </span>

                  <span style={{
                    fontSize: isLarge ? 11 : 9.5,
                    color: subtitleColor,
                    fontWeight: 700
                  }}>
                    {order.riskReason || (isLarge ? `Almost completed · Due ${order.deadlineDate}` : `Due ${order.deadlineDate}`)}
                  </span>
                </div>

                <div style={{ width: '100%', height: isLarge ? 8 : 6, background: progressBg, borderRadius: 9999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: progressFill,
                      borderRadius: 9999,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              {/* Footer: Multi-item count & click prompt */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: isSmall ? 4 : 6,
                fontSize: 9.5,
                color: subtitleColor
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {isLarge ? <Award size={12} color={textColor} /> : <Layers size={11} color={subtitleColor} />}
                  <span>{order.items?.length || 1} product designs &bull; {isLarge ? 'Large Card' : isSmall ? 'Small Card' : 'Medium Card'}</span>
                </span>

                <span style={{ fontWeight: 800, color: textColor, display: 'flex', alignItems: 'center', gap: 2 }}>
                  Inspect Details &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#111827',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 100
        }}>
          <Sparkles size={15} color="#86efac" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default OrderPipelineModule;