import React, { useState } from 'react';
import { Truck, DollarSign, Plus, CheckCircle2, PackageCheck } from 'lucide-react';
import type { Order, DeliveryRecord, PaymentRecord } from '../../types';

interface DeliveriesPaymentsModuleProps {
  orders: Order[];
  onSelectOrder: (id: string) => void;
  onRecordDelivery: (orderId: string, delivery: Omit<DeliveryRecord, 'id'>) => void;
  onRecordPayment: (orderId: string, payment: Omit<PaymentRecord, 'id'>) => void;
}

export const DeliveriesPaymentsModule: React.FC<DeliveriesPaymentsModuleProps> = ({
  orders,
  onSelectOrder,
  onRecordDelivery,
  onRecordPayment
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'deliveries' | 'payments'>('deliveries');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [targetOrderId, setTargetOrderId] = useState<string>(orders[0]?.id || 'TX-1024');

  // Form states
  const [delQty, setDelQty] = useState<number>(3000);
  const [delInvoice, setDelInvoice] = useState<string>('INV-2026-8901');
  const [delCarrier, setDelCarrier] = useState<string>('VRL Logistics Freight');

  const [payAmount, setPayAmount] = useState<number>(14500);
  const [payType, setPayType] = useState<'advance_30' | 'mid_progress_40' | 'final_balance_30'>('advance_30');
  const [payStatus] = useState<'pending' | 'received'>('received');

  const allDeliveries: { order: Order; delivery: DeliveryRecord }[] = [];
  const allPayments: { order: Order; payment: PaymentRecord }[] = [];

  orders.forEach((o) => {
    o.deliveries.forEach((d) => allDeliveries.push({ order: o, delivery: d }));
    o.payments.forEach((p) => allPayments.push({ order: o, payment: p }));
  });

  const handleCreateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordDelivery(targetOrderId, {
      orderId: targetOrderId,
      date: new Date().toISOString().split('T')[0],
      quantityMeters: delQty,
      invoiceNumber: delInvoice,
      carrier: delCarrier,
      deliveryType: 'partial',
      status: 'delivered'
    });
    setShowAddModal(false);
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordPayment(targetOrderId, {
      orderId: targetOrderId,
      invoiceNumber: delInvoice,
      amount: payAmount,
      date: new Date().toISOString().split('T')[0],
      type: payType,
      status: payStatus
    });
    setShowAddModal(false);
  };

  const totalDeliveredMeters = allDeliveries.reduce((s, d) => s + d.delivery.quantityMeters, 0);
  const totalPaidRevenue = allPayments.filter((p) => p.payment.status === 'received').reduce((s, p) => s + p.payment.amount, 0);
  const totalPendingBalance = allPayments.filter((p) => p.payment.status === 'pending').reduce((s, p) => s + p.payment.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      {/* 1. Header Banner */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>
            Deliveries & Payments
          </h1>
        </div>

        <button
          className="admin-btn-primary"
          style={{ padding: '7px 18px', fontSize: 11.5 }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={14} />
          <span>Record New Entry</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Strip */}
      <div className="kpi-strip-flat">
        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Completed Dispatches
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
              <Truck size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>{allDeliveries.length}</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Shipments</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Delivered Yardage
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
              <PackageCheck size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#1e473d' }}>{totalDeliveredMeters.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: '#1e473d', fontWeight: 700 }}>m</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Settled Receipts
            </div>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#15803d' }}>${totalPaidRevenue.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>Paid</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Outstanding Balance
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
              <DollarSign size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: totalPendingBalance > 0 ? '#b45309' : '#0a0d10' }}>
              ${totalPendingBalance.toLocaleString()}
            </span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Due</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setActiveSubTab('deliveries')}
          style={{
            padding: '6px 16px',
            borderRadius: 9999,
            border: activeSubTab === 'deliveries' ? '1px solid #c6e5db' : '1px solid #e2e8f0',
            background: activeSubTab === 'deliveries' ? '#dff1ea' : '#ffffff',
            color: activeSubTab === 'deliveries' ? '#1e473d' : '#64748b',
            fontSize: 11.5,
            fontWeight: activeSubTab === 'deliveries' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
        >
          <Truck size={14} />
          <span>Dispatch & Delivery Records ({allDeliveries.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('payments')}
          style={{
            padding: '6px 16px',
            borderRadius: 9999,
            border: activeSubTab === 'payments' ? '1px solid #c6e5db' : '1px solid #e2e8f0',
            background: activeSubTab === 'payments' ? '#dff1ea' : '#ffffff',
            color: activeSubTab === 'payments' ? '#1e473d' : '#64748b',
            fontSize: 11.5,
            fontWeight: activeSubTab === 'payments' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
        >
          <DollarSign size={14} />
          <span>Payment Invoices & Receipts ({allPayments.length})</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 24,
        border: '1px solid #e5e9ee',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flex: 1
      }}>
        {activeSubTab === 'deliveries' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allDeliveries.map(({ order, delivery }) => (
              <div
                key={delivery.id}
                onClick={() => onSelectOrder(order.id)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e9ee',
                  borderRadius: 18,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <div>
                  <strong style={{ fontSize: 13, color: '#0a0d10' }}>
                    {delivery.invoiceNumber} &bull; {order.productName} ({order.id})
                  </strong>
                  <p style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                    Client: <strong>{order.clientName}</strong> &bull; Carrier: <strong>{delivery.carrier}</strong> &bull; Date: <strong>{delivery.date}</strong>
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1e473d' }}>
                    {delivery.quantityMeters.toLocaleString()} meters
                  </div>
                  <span style={{
                    background: '#dff1ea',
                    color: '#1e473d',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    fontSize: 9.5,
                    fontWeight: 700,
                    marginTop: 4,
                    display: 'inline-block'
                  }}>
                    {delivery.deliveryType.toUpperCase()} DELIVERED
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allPayments.map(({ order, payment }) => (
              <div
                key={payment.id}
                onClick={() => onSelectOrder(order.id)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e9ee',
                  borderRadius: 18,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <div>
                  <strong style={{ fontSize: 13, color: '#0a0d10' }}>
                    {payment.invoiceNumber} &bull; {order.clientName} ({order.id})
                  </strong>
                  <p style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                    Type: <strong>{payment.type.replace('_', ' ').toUpperCase()}</strong> &bull; Date: <strong>{payment.date}</strong>
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#15803d' }}>
                    ${payment.amount.toLocaleString()}
                  </div>
                  <span style={{
                    background: payment.status === 'received' ? '#dcfce7' : '#fef3c7',
                    color: payment.status === 'received' ? '#15803d' : '#b45309',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    fontSize: 9.5,
                    fontWeight: 700,
                    marginTop: 4,
                    display: 'inline-block'
                  }}>
                    {payment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Record Delivery or Payment Receipt</h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <button
                onClick={() => setActiveSubTab('deliveries')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  border: activeSubTab === 'deliveries' ? '1px solid #c6e5db' : '1px solid #e2e8f0',
                  background: activeSubTab === 'deliveries' ? '#dff1ea' : '#ffffff',
                  color: activeSubTab === 'deliveries' ? '#1e473d' : '#64748b',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Log Delivery Shipment
              </button>
              <button
                onClick={() => setActiveSubTab('payments')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  border: activeSubTab === 'payments' ? '1px solid #c6e5db' : '1px solid #e2e8f0',
                  background: activeSubTab === 'payments' ? '#dff1ea' : '#ffffff',
                  color: activeSubTab === 'payments' ? '#1e473d' : '#64748b',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Log Payment Receipt
              </button>
            </div>

            {activeSubTab === 'deliveries' ? (
              <form onSubmit={handleCreateDelivery} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10', display: 'block', marginBottom: 4 }}>Order Code</label>
                  <select className="admin-form-input" value={targetOrderId} onChange={(e) => setTargetOrderId(e.target.value)}>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>{o.id} - {o.clientName} ({o.productName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10', display: 'block', marginBottom: 4 }}>Dispatched Meters</label>
                  <input type="number" className="admin-form-input" value={delQty} onChange={(e) => setDelQty(+e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10', display: 'block', marginBottom: 4 }}>Invoice / Gate Pass #</label>
                  <input type="text" className="admin-form-input" value={delInvoice} onChange={(e) => setDelInvoice(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10', display: 'block', marginBottom: 4 }}>Carrier & Tracking Details</label>
                  <input type="text" className="admin-form-input" value={delCarrier} onChange={(e) => setDelCarrier(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="submit" className="admin-btn-primary">Record Dispatch</button>
                  <button
                    type="button"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 9999,
                      padding: '8px 16px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreatePayment} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10', display: 'block', marginBottom: 4 }}>Order Code</label>
                  <select className="admin-form-input" value={targetOrderId} onChange={(e) => setTargetOrderId(e.target.value)}>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>{o.id} - {o.clientName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10', display: 'block', marginBottom: 4 }}>Received Amount ($)</label>
                  <input type="number" className="admin-form-input" value={payAmount} onChange={(e) => setPayAmount(+e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10', display: 'block', marginBottom: 4 }}>Milestone Type</label>
                  <select className="admin-form-input" value={payType} onChange={(e: any) => setPayType(e.target.value)}>
                    <option value="advance_30">Advance 30% Deposit</option>
                    <option value="mid_progress_40">Mid-Production 40%</option>
                    <option value="final_balance_30">Final Balance 30% (Post-Delivery)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="submit" className="admin-btn-primary">Record Payment Receipt</button>
                  <button
                    type="button"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 9999,
                      padding: '8px 16px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
