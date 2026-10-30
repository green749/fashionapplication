import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Check,
  X,
  Search,
  FileText,
  Clock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import type { Order } from '../../types';

interface QuotationApprovalsModuleProps {
  orders: Order[];
  onSelectOrder: (id: string) => void;
  onApproveQuotation: (orderId: string, editedMargin?: number) => void;
  onRejectQuotation: (orderId: string, reason: string) => void;
}

export const QuotationApprovalsModule: React.FC<QuotationApprovalsModuleProps> = ({
  orders: _orders,
  onSelectOrder,
  onApproveQuotation,
  onRejectQuotation
}) => {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('QT-1001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMargin, setEditedMargin] = useState<number>(18);

  // Quotes list matching mockup
  const quotationsList = [
    {
      id: 'QT-1001',
      orderId: 'TX-1024',
      productName: 'Cotton Shirts',
      clientName: 'ABC Garments',
      totalCost: '₹ 2,85,000',
      sellingPrice: '₹ 3,50,000',
      margin: '18%',
      marginVal: 18,
      status: 'pending',
      statusLabel: 'Pending Approval',
      date: '29 Oct 2026',
      costBreakdown: {
        fabric: '₹ 1,10,000',
        labour: '₹ 95,000',
        dyeing: '₹ 60,000',
        others: '₹ 85,000',
        totalDisplay: '₹ 3.50L'
      },
      riskAlert: 'Cotton price may increase by 5–8% next week.'
    },
    {
      id: 'QT-1002',
      orderId: 'TX-1025',
      productName: 'Printed Fabric',
      clientName: 'StyleMart',
      totalCost: '₹ 1,72,000',
      sellingPrice: '₹ 2,15,000',
      margin: '20%',
      marginVal: 20,
      status: 'approved',
      statusLabel: 'Approved',
      date: '28 Oct 2026',
      costBreakdown: {
        fabric: '₹ 85,000',
        labour: '₹ 45,000',
        dyeing: '₹ 25,000',
        others: '₹ 17,000',
        totalDisplay: '₹ 2.15L'
      },
      riskAlert: 'Dyeing chemical lead time extends into next production batch.'
    },
    {
      id: 'QT-1003',
      orderId: 'TX-1026',
      productName: 'Linen Trousers',
      clientName: 'HomeNest',
      totalCost: '₹ 3,20,000',
      sellingPrice: '₹ 3,85,000',
      margin: '17%',
      marginVal: 17,
      status: 'rejected',
      statusLabel: 'Rejected',
      date: '28 Oct 2026',
      costBreakdown: {
        fabric: '₹ 1,80,000',
        labour: '₹ 80,000',
        dyeing: '₹ 35,000',
        others: '₹ 25,000',
        totalDisplay: '₹ 3.85L'
      },
      riskAlert: 'Specialty flax yarn requires recalculation with higher margin.'
    },
    {
      id: 'QT-1004',
      orderId: 'TX-1027',
      productName: 'Polo T-Shirts',
      clientName: 'TechCart',
      totalCost: '₹ 1,95,000',
      sellingPrice: '₹ 2,42,000',
      margin: '19%',
      marginVal: 19,
      status: 'pending',
      statusLabel: 'Pending Approval',
      date: '27 Oct 2026',
      costBreakdown: {
        fabric: '₹ 95,000',
        labour: '₹ 60,000',
        dyeing: '₹ 22,000',
        others: '₹ 18,000',
        totalDisplay: '₹ 2.42L'
      },
      riskAlert: 'Yarn price fluctuating on domestic exchange (+3.2%).'
    },
    {
      id: 'QT-1005',
      orderId: 'TX-1028',
      productName: 'Kitchen Aprons',
      clientName: 'KitchenKart',
      totalCost: '₹ 1,20,000',
      sellingPrice: '₹ 1,52,000',
      margin: '21%',
      marginVal: 21,
      status: 'approved',
      statusLabel: 'Approved',
      date: '26 Oct 2026',
      costBreakdown: {
        fabric: '₹ 65,000',
        labour: '₹ 30,000',
        dyeing: '₹ 15,000',
        others: '₹ 10,000',
        totalDisplay: '₹ 1.52L'
      },
      riskAlert: 'Canvas fabric in ample stock at warehouse.'
    }
  ];

  const selectedQuote = quotationsList.find((q) => q.id === selectedQuoteId) || quotationsList[0];

  const filteredQuotes = quotationsList.filter((q) => {
    const matchesSearch =
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = () => {
    onApproveQuotation(selectedQuote.orderId, isEditing ? editedMargin : selectedQuote.marginVal);
    setIsEditing(false);
    alert(`Quotation ${selectedQuote.id} for ${selectedQuote.orderId} approved and signed off!`);
  };

  const handleReject = () => {
    const reason = prompt('Please provide reason for quotation rejection:', 'Margin below threshold');
    if (reason) {
      onRejectQuotation(selectedQuote.orderId, reason);
      alert(`Quotation ${selectedQuote.id} rejected. Sent back for BOM recalculation.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      {/* 1. PAGE HEADER */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>
            Quotations & Approvals
          </h1>
        </div>
      </div>

      {/* 2. TOP 4 KPI CARDS */}
      <div className="kpi-strip-flat">
        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Total Quotations
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
              <FileText size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>48</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>&uarr; 8%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Pending Approval
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
              <Clock size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>12</span>
            <span style={{ fontSize: 11, color: '#b45309', fontWeight: 700 }}>&uarr; 2%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Approved
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
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>30</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>&uarr; 5%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Rejected
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
              <X size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>6</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>&rarr; 0%</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN VIEW (Quotes List + Details Pane) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 0.95fr)',
        gap: 16,
        flex: 1,
        minHeight: 0
      }}>
        {/* Left Column: Quotations Filter & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          {/* Search & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 9999,
              padding: '6px 14px',
              flex: 1
            }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search quotation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 11.5, background: 'transparent', width: '100%', color: '#1e293b' }}
              />
            </div>

            <select
              className="admin-form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select className="admin-form-select">
              <option>Date Range</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          {/* Quotations List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
            {filteredQuotes.map((q) => {
              const isSelected = q.id === selectedQuoteId;
              const isPending = q.status === 'pending';
              const isApproved = q.status === 'approved';

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedQuoteId(q.id);
                    onSelectOrder(q.orderId);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 20,
                    background: isSelected ? '#dff1ea' : '#ffffff',
                    border: isSelected ? '1px solid #c6e5db' : '1px solid #e5e9ee',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(30, 71, 61, 0.05)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 90 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: isSelected ? '#1e473d' : '#0a0d10' }}>
                      {q.id}
                    </div>
                    <div style={{ fontSize: 10, color: isSelected ? '#3b6f63' : '#64748b' }}>
                      {q.orderId}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, padding: '0 10px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#1e473d' : '#0a0d10' }}>
                      {q.productName}
                    </div>
                    <div style={{ fontSize: 10, color: isSelected ? '#3b6f63' : '#64748b' }}>
                      {q.clientName}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, minWidth: 95 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: isSelected ? '#1e473d' : '#0a0d10' }}>
                      {q.totalCost}
                    </div>
                    <div style={{ fontSize: 10, color: isSelected ? '#3b6f63' : '#64748b' }}>
                      Margin: {q.margin}
                    </div>
                  </div>

                  <div style={{ minWidth: 120, textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      fontSize: 9.5,
                      fontWeight: 700,
                      background: isPending ? '#fef3c7' : (isApproved ? '#dcfce7' : '#fee2e2'),
                      color: isPending ? '#b45309' : (isApproved ? '#15803d' : '#dc2626')
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                      {q.statusLabel}
                    </span>
                  </div>

                  <div style={{ fontSize: 10, color: isSelected ? '#3b6f63' : '#64748b', minWidth: 65, textAlign: 'right' }}>
                    {q.date.replace(' 2026', '')}
                  </div>

                  <ChevronRight size={14} color={isSelected ? '#1e473d' : '#94a3b8'} style={{ marginLeft: 6 }} />
                </div>
              );
            })}
          </div>

          {/* Bottom Pagination */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0',
            fontSize: 11,
            color: '#64748b',
            marginTop: 'auto'
          }}>
            <span>Showing 1 – {filteredQuotes.length} of 48 quotations</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 9999,
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <ChevronLeft size={12} color="#64748b" />
              </button>

              <button style={{
                background: '#111315',
                color: '#ffffff',
                border: 'none',
                borderRadius: 9999,
                width: 26,
                height: 26,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                1
              </button>

              <button style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 9999,
                width: 26,
                height: 26,
                fontSize: 11,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}>
                2
              </button>

              <button style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 9999,
                width: 26,
                height: 26,
                fontSize: 11,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}>
                3
              </button>

              <span style={{ padding: '0 2px', color: '#94a3b8' }}>...</span>

              <button style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 9999,
                width: 26,
                height: 26,
                fontSize: 11,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}>
                10
              </button>

              <button style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 9999,
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <ChevronRight size={12} color="#64748b" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quotation Details & Cost Breakdown */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid #e5e9ee',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} color="#111315" />
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
                Quotation Details
              </h3>
            </div>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 9999,
              fontSize: 10,
              fontWeight: 700,
              background: selectedQuote.status === 'pending' ? '#fef3c7' : (selectedQuote.status === 'approved' ? '#dcfce7' : '#fee2e2'),
              color: selectedQuote.status === 'pending' ? '#b45309' : (selectedQuote.status === 'approved' ? '#15803d' : '#dc2626')
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
              {selectedQuote.statusLabel}
            </span>
          </div>

          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0a0d10' }}>
              {selectedQuote.id} &bull; {selectedQuote.orderId}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
              {selectedQuote.productName} | Client: <strong>{selectedQuote.clientName}</strong>
            </div>
          </div>

          {/* 3 Key Stat Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Total Cost</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10', marginTop: 2 }}>
                {selectedQuote.totalCost}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Selling Price</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10', marginTop: 2 }}>
                {selectedQuote.sellingPrice}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Profit Margin</div>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <input
                    type="number"
                    value={editedMargin}
                    onChange={(e) => setEditedMargin(parseFloat(e.target.value) || 0)}
                    style={{ width: 44, fontSize: 12, fontWeight: 700, padding: '2px 4px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>%</span>
                </div>
              ) : (
                <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', marginTop: 2 }}>
                  {selectedQuote.margin}
                </div>
              )}
            </div>
          </div>

          {/* Cost Breakdown Donut & Values */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0a0d10' }}>
                Cost Breakdown
              </div>
              <span style={{ fontSize: 10, color: '#1e473d', fontWeight: 700, cursor: 'pointer' }}>
                View Details &rarr;
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Donut Chart */}
              <div style={{ position: 'relative', width: 85, height: 85, flexShrink: 0 }}>
                <svg width="85" height="85" viewBox="0 0 85 85">
                  <circle cx="42.5" cy="42.5" r="32" stroke="#f1f5f9" strokeWidth="9" fill="none" />
                  {/* Fabric segment */}
                  <circle
                    cx="42.5"
                    cy="42.5"
                    r="32"
                    stroke="#1e473d"
                    strokeWidth="9"
                    fill="none"
                    strokeDasharray="75 201"
                    strokeDashoffset="0"
                    transform="rotate(-90 42.5 42.5)"
                  />
                  {/* Labour segment */}
                  <circle
                    cx="42.5"
                    cy="42.5"
                    r="32"
                    stroke="#111315"
                    strokeWidth="9"
                    fill="none"
                    strokeDasharray="55 201"
                    strokeDashoffset="-75"
                    transform="rotate(-90 42.5 42.5)"
                  />
                  {/* Dyeing segment */}
                  <circle
                    cx="42.5"
                    cy="42.5"
                    r="32"
                    stroke="#0284c7"
                    strokeWidth="9"
                    fill="none"
                    strokeDasharray="40 201"
                    strokeDashoffset="-130"
                    transform="rotate(-90 42.5 42.5)"
                  />
                  {/* Others segment */}
                  <circle
                    cx="42.5"
                    cy="42.5"
                    r="32"
                    stroke="#64748b"
                    strokeWidth="9"
                    fill="none"
                    strokeDasharray="31 201"
                    strokeDashoffset="-170"
                    transform="rotate(-90 42.5 42.5)"
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
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0a0d10' }}>
                    {selectedQuote.costBreakdown.totalDisplay}
                  </span>
                  <span style={{ fontSize: 8.5, color: '#94a3b8' }}>Total</span>
                </div>
              </div>

              {/* Legend & Amounts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1e473d' }} />
                    <span style={{ color: '#475569' }}>Fabric</span>
                  </div>
                  <strong style={{ color: '#0a0d10' }}>{selectedQuote.costBreakdown.fabric}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#111315' }} />
                    <span style={{ color: '#475569' }}>Labour</span>
                  </div>
                  <strong style={{ color: '#0a0d10' }}>{selectedQuote.costBreakdown.labour}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0284c7' }} />
                    <span style={{ color: '#475569' }}>Dyeing</span>
                  </div>
                  <strong style={{ color: '#0a0d10' }}>{selectedQuote.costBreakdown.dyeing}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#64748b' }} />
                    <span style={{ color: '#475569' }}>Others</span>
                  </div>
                  <strong style={{ color: '#0a0d10' }}>{selectedQuote.costBreakdown.others}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Alert Box */}
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 16,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#be123c', fontWeight: 700, fontSize: 11 }}>
              <AlertTriangle size={13} color="#e11d48" />
              <span>Risk Alert</span>
            </div>
            <p style={{ fontSize: 10.5, color: '#9f1239', margin: 0, lineHeight: 1.4 }}>
              {selectedQuote.riskAlert}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 6 }}>
            <button
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 11,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 9999,
                color: '#0a0d10',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 size={12} />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>

            <button
              style={{
                flex: 1.2,
                padding: '8px 12px',
                fontSize: 11,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: '#111315',
                border: 'none',
                borderRadius: 9999,
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={handleApprove}
            >
              <Check size={13} />
              <span>Approve</span>
            </button>

            <button
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 11,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: '#fee2e2',
                border: '1px solid #fecdd3',
                borderRadius: 9999,
                color: '#dc2626',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={handleReject}
            >
              <X size={12} />
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
