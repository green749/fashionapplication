import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  Package,
  Layers,
  X,
  Scale
} from 'lucide-react';
import type { MaterialRequirement, Order } from '../../types';
import { INITIAL_PURCHASE_ORDERS } from '../../data/mockData';

interface MaterialsProcurementModuleProps {
  materials?: MaterialRequirement[];
  orders?: Order[];
  onRecordPurchaseDecision: (materialId: string, status: MaterialRequirement['status'], notes?: string) => void;
  onRerunFeasibility: (orderId: string) => void;
}

export const MaterialsProcurementModule: React.FC<MaterialsProcurementModuleProps> = ({
  onRecordPurchaseDecision
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('TX-1024');

  // Sample suppliers for comparison
  const suppliers = [
    {
      id: 'sup_sri',
      initial: 'S',
      name: 'Sri Textiles',
      price: '₹120',
      leadTime: 'Lead: 3 days',
      bg: '#0369a1'
    },
    {
      id: 'sup_vetri',
      initial: 'V',
      name: 'Vetri Fabrics',
      price: '₹118',
      leadTime: 'Lead: 5 days',
      bg: '#1e473d'
    },
    {
      id: 'sup_kings',
      initial: 'K',
      name: 'Kings Textiles',
      price: '₹122',
      leadTime: 'Lead: 4 days',
      bg: '#5b21b6'
    }
  ];

  // Material requirements
  const currentRequirements = [
    {
      id: 'req_1',
      name: 'Cotton Fabric',
      icon: 'fabric',
      required: '2,000 m',
      available: '1,400 m',
      shortage: '600 m',
      status: 'shortage',
      statusLabel: 'Shortage'
    },
    {
      id: 'req_2',
      name: 'Yarn',
      icon: 'yarn',
      required: '500 kg',
      available: '520 kg',
      shortage: '-',
      status: 'sufficient',
      statusLabel: 'Sufficient'
    },
    {
      id: 'req_3',
      name: 'Dyeing Chemicals',
      icon: 'dye',
      required: '350 kg',
      available: '300 kg',
      shortage: '50 kg',
      status: 'low_stock',
      statusLabel: 'Low Stock'
    },
    {
      id: 'req_4',
      name: 'Buttons',
      icon: 'trims',
      required: '5,000 pcs',
      available: '6,200 pcs',
      shortage: '-',
      status: 'sufficient',
      statusLabel: 'Sufficient'
    }
  ];

  const handleApprovePurchase = () => {
    onRecordPurchaseDecision('mat_1', 'approved', '600 m Cotton Fabric ordered from Sri Textiles');
    alert('Purchase PO approved! 600 m Cotton Fabric purchase order sent to Sri Textiles (3-day delivery).');
  };

  const handleCancelPurchase = () => {
    onRecordPurchaseDecision('mat_1', 'cancelled', 'Admin cancelled direct purchase');
    alert('Purchase decision cancelled. Order TX-1024 holds for Admin review.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      {/* 1. PAGE HEADER */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>
            Materials & Procurement
          </h1>
        </div>
      </div>

      {/* 2. TOP 4 KPI CARDS */}
      <div className="kpi-strip-flat">
        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Total Materials
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
              <Boxes size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>12</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>&uarr; 1%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Shortages
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
              <AlertTriangle size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>2</span>
            <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>&uarr; 1%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Pending Purchases
            </div>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              background: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>3</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>0%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              In Stock
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
            <span style={{ fontSize: 24, fontWeight: 800, color: '#1e473d' }}>10</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>&uarr; 2%</span>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN MAIN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 0.95fr)', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Left Column: Material Requirement & Purchase Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', paddingRight: 4 }}>
          {/* Upper: Material Requirement Table */}
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
                <Boxes size={16} color="#111315" />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
                  Material Requirement
                </h3>
              </div>

              <select
                className="admin-form-select"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
              >
                <option value="TX-1024">Order: TX-1024</option>
                <option value="TX-1025">Order: TX-1025</option>
                <option value="TX-1026">Order: TX-1026</option>
                <option value="TX-1027">Order: TX-1027</option>
                <option value="TX-1028">Order: TX-1028</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #edf1f5', textAlign: 'left' }}>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Material</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Required</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Available</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Shortage</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequirements.map((item) => {
                    const isShortage = item.status === 'shortage';
                    const isLow = item.status === 'low_stock';

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #edf1f5' }}>
                        <td style={{ padding: '10px 6px', fontWeight: 700, color: '#0a0d10' }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '10px 6px', color: '#475569' }}>
                          {item.required}
                        </td>
                        <td style={{ padding: '10px 6px', color: '#475569' }}>
                          {item.available}
                        </td>
                        <td style={{ padding: '10px 6px', fontWeight: 700, color: isShortage || isLow ? '#dc2626' : '#94a3b8' }}>
                          {item.shortage}
                        </td>
                        <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 10,
                            fontWeight: 700,
                            background: isShortage ? '#fee2e2' : (isLow ? '#fef3c7' : '#dff1ea'),
                            color: isShortage ? '#dc2626' : (isLow ? '#b45309' : '#1e473d')
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                            {item.statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lower: Purchase Orders Table */}
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
                <ShoppingCart size={16} color="#111315" />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
                  Purchase Orders
                </h3>
              </div>
              <span style={{ fontSize: 11, color: '#1e473d', fontWeight: 700, cursor: 'pointer' }}>
                View All &rarr;
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #edf1f5', textAlign: 'left' }}>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>PO No.</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Supplier</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Items</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Amount</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>Expected Delivery</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_PURCHASE_ORDERS.map((po) => {
                    const isOrdered = po.status === 'Ordered';

                    return (
                      <tr key={po.poNo} style={{ borderBottom: '1px solid #edf1f5' }}>
                        <td style={{ padding: '10px 6px', fontWeight: 800, color: '#0a0d10' }}>
                          {po.poNo}
                        </td>
                        <td style={{ padding: '10px 6px', color: '#0a0d10', fontWeight: 600 }}>
                          {po.supplier}
                        </td>
                        <td style={{ padding: '10px 6px', color: '#475569' }}>
                          {po.items}
                        </td>
                        <td style={{ padding: '10px 6px', fontWeight: 800, color: '#0a0d10' }}>
                          ₹{po.amount.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 6px', color: '#64748b' }}>
                          {po.expectedDelivery}
                        </td>
                        <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 10,
                            fontWeight: 700,
                            background: isOrdered ? '#e0f2fe' : '#ede9fe',
                            color: isOrdered ? '#0369a1' : '#5b21b6'
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Supplier Comparison & Purchase Decision */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          overflowY: 'auto'
        }}>
          {/* Upper: Supplier Comparison */}
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
                <Scale size={16} color="#111315" />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
                  Supplier Comparison
                </h3>
              </div>
              <span style={{ fontSize: 11, color: '#1e473d', fontWeight: 700, cursor: 'pointer' }}>
                View All &rarr;
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {suppliers.map((sup) => (
                <div
                  key={sup.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    border: '1px solid #e5e9ee',
                    borderRadius: 18,
                    background: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: sup.bg,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800
                    }}>
                      {sup.initial}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0a0d10' }}>
                        {sup.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                        {sup.price} &bull; {sup.leadTime}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: '#0a0d10',
                      cursor: 'pointer'
                    }}
                    onClick={() => alert(`Comparing ${sup.name}: Rate ${sup.price}/m with ${sup.leadTime}.`)}
                  >
                    Compare
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lower: Purchase Decision */}
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e5e9ee',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={16} color="#111315" />
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
                Purchase Decision
              </h3>
            </div>

            {/* Note banner */}
            <div style={{
              background: '#dff1ea',
              border: '1px solid #c6e5db',
              borderRadius: 16,
              padding: '10px 14px',
              fontSize: 11,
              color: '#1e473d',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8
            }}>
              <span style={{ fontWeight: 800, fontSize: 12 }}>ℹ</span>
              <span>
                <strong>600 m of Cotton Fabric</strong> is required for order <strong>TX-1024</strong>.
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <button
                className="admin-btn-primary"
                style={{ flex: 1.2, padding: '9px 14px', fontSize: 11.5, justifyContent: 'center' }}
                onClick={handleApprovePurchase}
              >
                <ShoppingCart size={14} />
                <span>Approve Purchase</span>
              </button>

              <button
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  fontSize: 11.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 9999,
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                onClick={handleCancelPurchase}
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
