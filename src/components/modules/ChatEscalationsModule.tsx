import React, { useState } from 'react';
import {
  Send,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import type { Order, ChatMessage } from '../../types';

interface ChatEscalationsModuleProps {
  orders: Order[];
  chatMessages: Record<string, ChatMessage[]>;
  onSendMessage: (orderId: string, content: string) => void;
  onResolveEscalation: (orderId: string, approved: boolean, concessionPercent?: number) => void;
}

export const ChatEscalationsModule: React.FC<ChatEscalationsModuleProps> = ({
  orders,
  chatMessages,
  onSendMessage,
  onResolveEscalation
}) => {
  const [activeOrderId, setActiveOrderId] = useState<string>('TX-1024');
  const [replyText, setReplyText] = useState<string>('');
  const [isTakeoverActive, setIsTakeoverActive] = useState<boolean>(true);

  const escalatedOrders = orders.filter((o) => o.discountEscalation !== undefined);
  const activeOrder = orders.find((o) => o.id === activeOrderId) || escalatedOrders[0] || orders[0];
  const messages = chatMessages[activeOrderId] || [];
  const escalation = activeOrder?.discountEscalation;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendMessage(activeOrderId, replyText.trim());
    setReplyText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflow: 'hidden' }}>
      {/* 1. Module Header */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>
            Client Communications
          </h1>
        </div>
      </div>

      {/* 2. Split Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Left List of Escalated Conversations */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid #e5e9ee',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflowY: 'auto'
        }}>
          <div>
            <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0a0d10' }}>
              Client Conversations ({escalatedOrders.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {escalatedOrders.map((order) => {
              const esc = order.discountEscalation!;
              const isSelected = order.id === activeOrderId;

              return (
                <div
                  key={order.id}
                  onClick={() => setActiveOrderId(order.id)}
                  style={{
                    background: isSelected ? '#dff1ea' : '#f8fafc',
                    border: isSelected ? '1px solid #c6e5db' : '1px solid #e5e9ee',
                    padding: '12px 14px',
                    borderRadius: 18,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 12.5, color: isSelected ? '#1e473d' : '#0a0d10' }}>{order.id}</strong>
                    <span style={{
                      background: isSelected ? '#1e473d' : '#fef3c7',
                      color: isSelected ? '#ffffff' : '#b45309',
                      fontSize: 8.5,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontWeight: 700
                    }}>
                      {esc.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: isSelected ? '#1e473d' : '#0a0d10', marginTop: 4 }}>
                    {order.clientName}
                  </div>
                  <div style={{ fontSize: 10.5, color: isSelected ? '#3b6f63' : '#64748b', marginTop: 2 }}>
                    Discount: <strong>{esc.requestedDiscountPercent}%</strong> (${esc.requestedPrice}/m)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chat Conversation Box & Admin Controls */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid #e5e9ee',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          gap: 12
        }}>
          {/* Chat Header with Takeover Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #edf1f5',
            paddingBottom: 10
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
                Conversation: {activeOrder?.clientName} ({activeOrder?.id})
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Fabric: {activeOrder?.productName} &bull; Base Price: ${activeOrder?.quotation?.pricePerUnit}/m
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isTakeoverActive ? '#1e473d' : '#64748b' }}>
                {isTakeoverActive ? 'Admin Takeover Active' : 'AI Assistant Handling'}
              </span>
              <button
                onClick={() => setIsTakeoverActive(!isTakeoverActive)}
                style={{
                  background: isTakeoverActive ? '#dff1ea' : '#f1f5f9',
                  color: isTakeoverActive ? '#1e473d' : '#64748b',
                  border: isTakeoverActive ? '1px solid #c6e5db' : '1px solid #e2e8f0',
                  borderRadius: 9999,
                  padding: '5px 12px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <UserCheck size={13} />
                <span>{isTakeoverActive ? 'Release to AI' : 'Take Over Chat'}</span>
              </button>
            </div>
          </div>

          {/* Escalation Summary Box (If open) */}
          {escalation && escalation.status === 'open' && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: 18,
              padding: '12px 16px',
              fontSize: 11.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#92400e' }}>
                <ShieldAlert size={15} />
                <span>Discount Concession Escalation Summary</span>
              </div>
              <p style={{ color: '#78350f', marginTop: 4, lineHeight: 1.4 }}>
                Client proposes <strong>{escalation.requestedDiscountPercent}% discount</strong> down to <strong>${escalation.requestedPrice}/m</strong>.
                Current gross margin is <strong>{escalation.currentMarginPercent}%</strong>. Approving leaves margin at <strong>15.2%</strong> (above 15.0% floor).
              </p>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  className="admin-btn-primary"
                  style={{ padding: '6px 14px', fontSize: 11 }}
                  onClick={() => onResolveEscalation(activeOrderId, true, escalation.requestedDiscountPercent)}
                >
                  <CheckCircle2 size={13} />
                  <span>Approve Concession ({escalation.requestedDiscountPercent}%)</span>
                </button>
                <button
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 9999,
                    padding: '6px 14px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                  onClick={() => onResolveEscalation(activeOrderId, false)}
                >
                  <XCircle size={13} />
                  <span>Decline Concession</span>
                </button>
              </div>
            </div>
          )}

          {/* Message Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: '#f8fafc',
            borderRadius: 20,
            padding: 16
          }}>
            {messages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              const isClient = msg.sender === 'client';

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isAdmin ? 'flex-end' : (isClient ? 'flex-start' : 'center'),
                    maxWidth: msg.isInternalContext ? '95%' : '80%',
                    background: msg.isInternalContext ? '#ede9fe' : (isAdmin ? '#dff1ea' : '#ffffff'),
                    color: isAdmin ? '#1e473d' : '#0a0d10',
                    padding: '10px 14px',
                    borderRadius: 18,
                    fontSize: 11.5,
                    border: msg.isInternalContext ? '1px dashed #c4b5fd' : '1px solid #e5e9ee',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ fontSize: 9.5, fontWeight: 700, marginBottom: 3, color: isAdmin ? '#3b6f63' : '#64748b' }}>
                    {msg.senderName} &bull; {msg.timestamp}
                  </div>
                  <div style={{ lineHeight: 1.4 }}>{msg.content}</div>
                </div>
              );
            })}
          </div>

          {/* Admin Reply Input */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
            <input
              type="text"
              className="admin-form-input"
              style={{ flex: 1, padding: '10px 16px' }}
              placeholder={isTakeoverActive ? 'Reply directly as Managing Director John Doe...' : 'Take over chat to reply...'}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button type="submit" className="admin-btn-primary" style={{ padding: '0 20px' }}>
              <Send size={14} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
