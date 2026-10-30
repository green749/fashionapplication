import React, { useState } from 'react';
import {
  HardHat,
  Check,
  Users,
  Activity,
  Layers,
  FileCheck2
} from 'lucide-react';
import type { AppUser, Order } from '../../types';

interface SupervisorsResourcesModuleProps {
  users: AppUser[];
  orders: Order[];
  onAssignSupervisor: (orderId: string, supervisorId: string, supervisorName: string) => void;
  onApproveOvertime: (shedName: string) => void;
}

export const SupervisorsResourcesModule: React.FC<SupervisorsResourcesModuleProps> = ({
  users,
  orders,
  onAssignSupervisor,
  onApproveOvertime
}) => {
  const [activeTab, setActiveTab] = useState<'supervisors' | 'resources'>('supervisors');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>('usr_sup_1');
  const [selectedOrderToAssign, setSelectedOrderToAssign] = useState<string>('TX-1024');
  const [overtimeApprovedShed, setOvertimeApprovedShed] = useState<string | null>(null);

  const supervisors = users.filter((u) => u.role === 'supervisor');

  // Resource Mock State
  const WEAVING_SHEDS = [
    {
      id: 'shed_a',
      name: 'Airjet Weaving & Stitching Shed A',
      supervisor: 'Ramesh Kumar',
      supervisorId: 'usr_sup_1',
      totalLooms: 24,
      runningLooms: 19,
      idleLooms: 4,
      breakdownLooms: 1,
      maintenanceNotes: 'Loom #7 warp tension sensor recalibrated today. Line operational.',
      workersPresent: 24,
      workersAbsent: 1,
      capacityPace: '1,300 m / day',
      currentOrders: ['TX-1024 (Cotton Shirts)'],
      overtimeAllowed: overtimeApprovedShed === 'shed_a'
    },
    {
      id: 'shed_b',
      name: 'Dyeing & Weaving Shed B',
      supervisor: 'Murugan K.',
      supervisorId: 'usr_sup_2',
      totalLooms: 24,
      runningLooms: 16,
      idleLooms: 8,
      breakdownLooms: 0,
      maintenanceNotes: 'Eco dye soft-flow temperature sensor calibrated.',
      workersPresent: 20,
      workersAbsent: 0,
      capacityPace: '1,500 m / day',
      currentOrders: ['TX-1025 (Printed Fabric)'],
      overtimeAllowed: overtimeApprovedShed === 'shed_b'
    }
  ];

  const handleApproveOT = (shedId: string, shedName: string) => {
    setOvertimeApprovedShed(shedId);
    onApproveOvertime(shedName);
  };

  const selectedSupervisor = supervisors.find((s) => s.id === selectedSupervisorId) || supervisors[0];
  const assignedOrders = orders.filter((o) => o.assignedSupervisorId === selectedSupervisor?.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      {/* 1. PAGE HEADER */}
      <div className="module-header-flat">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>
            Supervisors & Resources
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: '#dff1ea',
            color: '#1e473d',
            padding: '5px 14px',
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <HardHat size={14} />
            <span>Active Shed Masters: <strong>{supervisors.length} On Duty</strong></span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Strip */}
      <div className="kpi-strip-flat">
        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Weaver Attendance
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
              <Users size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#1e473d' }}>44 / 45</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>97.8%</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Running Looms
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
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>35 / 48</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>73% Active</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Daily Capacity Pace
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
              <Layers size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0a0d10' }}>2,780</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>m / day</span>
          </div>
        </div>

        <div className="kpi-cell-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              Daily Reports Filed
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
              <FileCheck2 size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0 0' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#15803d' }}>100%</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>Compliant</span>
          </div>
        </div>
      </div>

      {/* 2. FILTERS AND SUB-TAB SWITCHER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => setActiveTab('supervisors')}
          style={{
            padding: '6px 16px',
            borderRadius: 9999,
            border: activeTab === 'supervisors' ? '1px solid #c6e5db' : '1px solid #e2e8f0',
            background: activeTab === 'supervisors' ? '#dff1ea' : '#ffffff',
            color: activeTab === 'supervisors' ? '#1e473d' : '#64748b',
            fontSize: 11.5,
            fontWeight: activeTab === 'supervisors' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Floor Supervisors ({supervisors.length})
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          style={{
            padding: '6px 16px',
            borderRadius: 9999,
            border: activeTab === 'resources' ? '1px solid #c6e5db' : '1px solid #e2e8f0',
            background: activeTab === 'resources' ? '#dff1ea' : '#ffffff',
            color: activeTab === 'resources' ? '#1e473d' : '#64748b',
            fontSize: 11.5,
            fontWeight: activeTab === 'resources' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Machinery & Workforce Resources (2 Sheds)
        </button>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      {activeTab === 'supervisors' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: 16, flex: 1, minHeight: 0 }}>
          {/* Supervisors List */}
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e5e9ee',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>
              Supervisor Directory & Active Floor Responsibilities
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {supervisors.map((s) => {
                const isSelected = s.id === selectedSupervisorId;
                const activeSupOrders = orders.filter((o) => o.assignedSupervisorId === s.id);

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSupervisorId(s.id)}
                    style={{
                      background: isSelected ? '#dff1ea' : '#f8fafc',
                      border: isSelected ? '1px solid #c6e5db' : '1px solid #e5e9ee',
                      padding: '12px 16px',
                      borderRadius: 18,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div>
                        <strong style={{ fontSize: 13, color: isSelected ? '#1e473d' : '#0a0d10' }}>{s.name}</strong>
                        <span style={{ fontSize: 11, color: isSelected ? '#3b6f63' : '#64748b', marginLeft: 6 }}>({s.title})</span>
                      </div>
                      <span style={{
                        background: isSelected ? '#1e473d' : '#dff1ea',
                        color: isSelected ? '#ffffff' : '#1e473d',
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: 9,
                        fontWeight: 700
                      }}>
                        Shift Active
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: isSelected ? '#1e473d' : '#475569' }}>
                      Assigned Department: <strong>{s.departmentOrCompany}</strong>
                    </div>
                    <div style={{ fontSize: 10.5, color: isSelected ? '#3b6f63' : '#64748b', marginTop: 2 }}>
                      Email: {s.email} &bull; Joined: {s.joinedAt}
                    </div>

                    <div style={{ marginTop: 8, fontSize: 11 }}>
                      <span style={{ fontWeight: 700, color: isSelected ? '#1e473d' : '#0a0d10' }}>Orders in Progress: </span>
                      {activeSupOrders.length > 0 ? (
                        activeSupOrders.map((o) => (
                          <span key={o.id} style={{ color: isSelected ? '#1e473d' : '#0369a1', fontWeight: 700, marginRight: 8 }}>
                            {o.id} ({o.productName})
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#94a3b8' }}>No currently active orders</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assign Supervisor to Order Console */}
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
            <div>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                FLOOR ASSIGNMENT DESK
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10', marginTop: 2 }}>
                Assign Order to {selectedSupervisor?.name}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#0a0d10' }}>
                Select Order to Assign:
              </label>
              <select
                value={selectedOrderToAssign}
                onChange={(e) => setSelectedOrderToAssign(e.target.value)}
                className="admin-form-select"
                style={{ borderRadius: 12 }}
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} &bull; {o.productName} ({o.quantityMeters.toLocaleString()}m) &bull; Currently: {o.assignedSupervisorName || 'Unassigned'}
                  </option>
                ))}
              </select>

              <button
                className="admin-btn-primary"
                style={{ marginTop: 4, padding: '9px 16px', fontSize: 11.5, width: 'fit-content' }}
                onClick={() => {
                  if (selectedSupervisor) {
                    onAssignSupervisor(selectedOrderToAssign, selectedSupervisor.id, selectedSupervisor.name);
                  }
                }}
              >
                <HardHat size={14} />
                <span>Confirm Assignment to {selectedSupervisor?.name}</span>
              </button>
            </div>

            {/* Currently Supervised Orders List */}
            <div style={{ marginTop: 8 }}>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: '#0a0d10', marginBottom: 8 }}>
                Active Production Supervised by {selectedSupervisor?.name}:
              </h4>
              {assignedOrders.length > 0 ? (
                assignedOrders.map((ao) => (
                  <div key={ao.id} style={{ background: '#f8fafc', border: '1px solid #e5e9ee', borderRadius: 16, padding: '10px 12px', marginBottom: 8, fontSize: 11.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span style={{ color: '#0a0d10' }}>{ao.id} &bull; {ao.productName}</span>
                      <span style={{ color: '#1e473d' }}>{ao.producedMeters.toLocaleString()} / {ao.quantityMeters.toLocaleString()} m</span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>
                      Deadline: {ao.deadlineDate} &bull; Current Phase: {ao.currentPhase}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: 11, fontStyle: 'italic', padding: 8 }}>
                  No active orders assigned to this supervisor.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Machinery & Workforce Resources Tab */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          {WEAVING_SHEDS.map((shed) => (
            <div key={shed.id} style={{ background: '#ffffff', border: '1px solid #e5e9ee', borderRadius: 24, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0a0d10' }}>{shed.name}</h3>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Floor Master: <strong>{shed.supervisor}</strong></span>
                </div>
                <span style={{ background: '#dff1ea', color: '#1e473d', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>
                  850 RPM Uptime
                </span>
              </div>

              {/* Looms Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 11 }}>
                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 14, border: '1px solid #e5e9ee' }}>
                  <span style={{ color: '#64748b', fontSize: 10, display: 'block' }}>Running Looms</span>
                  <strong style={{ color: '#10b981', fontSize: 14, marginTop: 2, display: 'block' }}>{shed.runningLooms} Running</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 14, border: '1px solid #e5e9ee' }}>
                  <span style={{ color: '#64748b', fontSize: 10, display: 'block' }}>Idle / Reserved</span>
                  <strong style={{ color: '#64748b', fontSize: 14, marginTop: 2, display: 'block' }}>{shed.idleLooms} Idle</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 14, border: '1px solid #e5e9ee' }}>
                  <span style={{ color: '#64748b', fontSize: 10, display: 'block' }}>Maintenance</span>
                  <strong style={{ color: shed.breakdownLooms > 0 ? '#dc2626' : '#10b981', fontSize: 14, marginTop: 2, display: 'block' }}>
                    {shed.breakdownLooms} Breakdown
                  </strong>
                </div>
              </div>

              {/* Workforce & Attendance */}
              <div style={{ background: '#f8fafc', border: '1px solid #e5e9ee', borderRadius: 16, padding: 12, fontSize: 11.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0a0d10' }}>
                  <span>Weavers on Shift: {shed.workersPresent} Present</span>
                  <span style={{ color: shed.workersAbsent > 0 ? '#b45309' : '#16a34a' }}>
                    {shed.workersAbsent > 0 ? `${shed.workersAbsent} Absent` : '100% Attendance'}
                  </span>
                </div>
                <div style={{ color: '#475569', fontSize: 10.5, marginTop: 4 }}>
                  Capacity Run-Rate: <strong>{shed.capacityPace}</strong> &bull; Active Orders: {shed.currentOrders.join(', ')}
                </div>
                <div style={{ color: '#64748b', fontSize: 10, marginTop: 4, fontStyle: 'italic' }}>
                  Maintenance: "{shed.maintenanceNotes}"
                </div>
              </div>

              {/* Overtime Approval Control */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e5e9ee', padding: 12, borderRadius: 16 }}>
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0a0d10' }}>Overtime Shift Authorization</span>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Authorize +2 hours evening shift if orders are expedited</div>
                </div>

                {shed.overtimeAllowed ? (
                  <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={14} />
                    Authorized
                  </span>
                ) : (
                  <button
                    className="admin-btn-primary"
                    style={{ fontSize: 11, padding: '6px 14px' }}
                    onClick={() => handleApproveOT(shed.id, shed.name)}
                  >
                    Authorize +2h OT
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
