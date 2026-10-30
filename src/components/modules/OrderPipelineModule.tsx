import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Order } from '../../types';

interface OrderPipelineModuleProps {
  orders: Order[];
  selectedOrderId: string;
  onSelectOrder: (id: string) => void;
  onOpenOrderModal: (order: Order) => void;
  onDeclineOrder?: (id: string) => void;
}

export const OrderPipelineModule: React.FC<OrderPipelineModuleProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onOpenOrderModal,
  onDeclineOrder: _onDeclineOrder
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'review' | 'approved' | 'in_production' | 'at_risk' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');

  // Hardcoded counts matching mockup
  const filterCounts = {
    all: 42,
    new: 8,
    review: 7,
    approved: 14,
    in_production: 9,
    at_risk: 3,
    completed: 11
  };

  const getOrderStatusDisplay = (order: Order) => {
    switch (order.id) {
      case 'TX-1024':
        return { label: 'In Production', color: '#0369a1', bg: '#e0f2fe', progress: 65, unit: 'pcs' };
      case 'TX-1025':
        return { label: 'At Risk', color: '#b45309', bg: '#fef3c7', progress: 35, unit: 'm' };
      case 'TX-1026':
        return { label: 'Approved', color: '#1e473d', bg: '#dff1ea', progress: 100, unit: 'pcs' };
      case 'TX-1027':
        return { label: 'Pending', color: '#5b21b6', bg: '#ede9fe', progress: 0, unit: 'pcs' };
      case 'TX-1028':
        return { label: 'New', color: '#86198f', bg: '#fae8ff', progress: 0, unit: 'pcs' };
      default:
        return { label: 'In Production', color: '#0369a1', bg: '#e0f2fe', progress: 50, unit: 'm' };
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClient = selectedClientFilter === 'all' || o.clientName === selectedClientFilter;
    const matchesProduct = selectedProductFilter === 'all' || o.productName === selectedProductFilter;

    let matchesStatus = true;
    if (statusFilter === 'new') matchesStatus = o.id === 'TX-1028' || o.status === 'submitted';
    else if (statusFilter === 'review') matchesStatus = o.id === 'TX-1027' || o.status === 'quotation_pending_approval';
    else if (statusFilter === 'approved') matchesStatus = o.id === 'TX-1026' || o.status === 'client_accepted';
    else if (statusFilter === 'in_production') matchesStatus = o.id === 'TX-1024' || o.status === 'in_production';
    else if (statusFilter === 'at_risk') matchesStatus = o.id === 'TX-1025' || o.status === 'awaiting_admin_decision';
    else if (statusFilter === 'completed') matchesStatus = o.id === 'TX-1026' || o.status === 'completed';

    return matchesSearch && matchesClient && matchesProduct && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      {/* 1. PAGE HEADER */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>
            Orders Management
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="admin-btn-primary"
            style={{ padding: '7px 18px', fontSize: 11.5 }}
            onClick={() => alert('New Order submission workflow: Client order intake form')}
          >
            <Plus size={14} />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* 2. STATUS FILTER PILLS (Neo-Minimalist Capsule Pills) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All', count: filterCounts.all },
          { key: 'new', label: 'New', count: filterCounts.new, dotColor: '#fae8ff' },
          { key: 'review', label: 'Under Review', count: filterCounts.review, dotColor: '#ede9fe' },
          { key: 'approved', label: 'Approved', count: filterCounts.approved, dotColor: '#dff1ea' },
          { key: 'in_production', label: 'In Production', count: filterCounts.in_production, dotColor: '#e0f2fe' },
          { key: 'at_risk', label: 'At Risk', count: filterCounts.at_risk, dotColor: '#fef3c7' },
          { key: 'completed', label: 'Completed', count: filterCounts.completed, dotColor: '#d1fae5' }
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
                border: isActive ? '1px solid #c6e5db' : '1px solid #e2e8f0',
                background: isActive ? '#dff1ea' : '#ffffff',
                color: isActive ? '#1e473d' : '#475569',
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: isActive ? 'rgba(30, 71, 61, 0.12)' : '#f1f5f9',
                color: isActive ? '#1e473d' : '#64748b',
                padding: '1px 8px',
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

      {/* 3. SEARCH & CONTROLS ROW */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {/* Search input with icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
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
            style={{ border: 'none', outline: 'none', fontSize: 11.5, background: 'transparent', width: '100%', color: '#1e293b' }}
          />
        </div>

        {/* Dropdowns & Filter Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            className="admin-form-select"
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
          >
            <option value="all">All Clients</option>
            <option value="ABC Garments">ABC Garments</option>
            <option value="StyleMart">StyleMart</option>
            <option value="HomeNest">HomeNest</option>
            <option value="TechCart">TechCart</option>
            <option value="KitchenKart">KitchenKart</option>
          </select>

          <select
            className="admin-form-select"
            value={selectedProductFilter}
            onChange={(e) => setSelectedProductFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="Cotton Shirts">Cotton Shirts</option>
            <option value="Printed Fabric">Printed Fabric</option>
            <option value="Linen Trousers">Linen Trousers</option>
            <option value="Polo T-Shirts">Polo T-Shirts</option>
            <option value="Kitchen Aprons">Kitchen Aprons</option>
          </select>

          <select className="admin-form-select">
            <option>Date Range</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Q4 2026</option>
          </select>

          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 9999,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--c-text-primary)',
              cursor: 'pointer'
            }}
          >
            <Filter size={13} color="#64748b" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 4. ORDERS TABLE */}
      <div style={{
        overflowX: 'auto',
        background: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e5e9ee',
        padding: '6px 12px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '1px solid #edf1f5', textAlign: 'left' }}>
              <th style={{ padding: '10px 8px', fontWeight: 600 }}>Order ID</th>
              <th style={{ padding: '10px 8px', fontWeight: 600 }}>Client</th>
              <th style={{ padding: '10px 8px', fontWeight: 600 }}>Product</th>
              <th style={{ padding: '10px 8px', fontWeight: 600 }}>Quantity</th>
              <th style={{ padding: '10px 8px', fontWeight: 600 }}>Delivery Date</th>
              <th style={{ padding: '10px 8px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '10px 8px', fontWeight: 600, width: 140 }}>Progress</th>
              <th style={{ padding: '10px 8px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              const info = getOrderStatusDisplay(order);

              return (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order.id)}
                  style={{
                    background: isSelected ? '#f0fdf9' : 'transparent',
                    cursor: 'pointer',
                    borderBottom: '1px solid #edf1f5',
                    transition: 'background 0.15s'
                  }}
                >
                  <td style={{ padding: '12px 8px', fontWeight: 800, color: isSelected ? '#1e473d' : '#0a0d10' }}>
                    {order.id}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: '#0a0d10' }}>
                    {order.clientName}
                  </td>
                  <td style={{ padding: '12px 8px', color: '#475569' }}>
                    {order.productName}
                  </td>
                  <td style={{ padding: '12px 8px', color: '#0a0d10', fontWeight: 600 }}>
                    {order.quantityMeters.toLocaleString()} {info.unit}
                  </td>
                  <td style={{ padding: '12px 8px', color: '#64748b' }}>
                    {order.deadlineDate}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: info.bg,
                      color: info.color,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      fontSize: 10,
                      fontWeight: 700
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: info.color }} />
                      {info.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, minWidth: 26, color: '#475569' }}>
                        {info.progress}%
                      </span>
                      <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${info.progress}%`,
                            height: '100%',
                            background: info.color,
                            borderRadius: 9999
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order.id);
                          onOpenOrderModal(order);
                        }}
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
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order.id);
                          onOpenOrderModal(order);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: 2
                        }}
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5. BOTTOM PAGINATION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 0',
        fontSize: 11,
        color: '#64748b'
      }}>
        <span>Showing 1 – {filteredOrders.length} of 42 orders</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 9999,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <ChevronLeft size={13} color="#64748b" />
          </button>

          <button style={{
            background: '#111315',
            color: '#ffffff',
            border: 'none',
            borderRadius: 9999,
            width: 28,
            height: 28,
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            1
          </button>

          <button style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#475569',
            borderRadius: 9999,
            width: 28,
            height: 28,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            2
          </button>

          <button style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#475569',
            borderRadius: 9999,
            width: 28,
            height: 28,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            3
          </button>

          <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>

          <button style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#475569',
            borderRadius: 9999,
            width: 28,
            height: 28,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            9
          </button>

          <button style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 9999,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <ChevronRight size={13} color="#64748b" />
          </button>
        </div>
      </div>
    </div>
  );
};
