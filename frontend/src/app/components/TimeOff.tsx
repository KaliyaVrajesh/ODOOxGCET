import { useState, useEffect } from 'react';
import { User, LogOut, Search, Plus, X, Upload, Check, XCircle } from 'lucide-react';
import { timeoffApi } from '../../api/timeoff';
import { handleApiError } from '../../api/client';

type TimeOffStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type UserRole = 'employee' | 'admin';

interface TimeOffRequest {
  id: string;
  employee_name?: string;
  type_name: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: TimeOffStatus;
  reason: string;
  rejection_reason?: string;
}

interface TimeOffBalance {
  type_name: string;
  days_available: number;
}

interface TimeOffProps {
  userRole: UserRole;
  userName: string;
  onBack?: () => void;
  onNavigateToAttendance?: () => void;
  onNavigateToProfile?: () => void;
  onLogout: () => void;
}

export default function TimeOff({ userRole, userName, onBack, onNavigateToAttendance, onNavigateToProfile, onLogout }: TimeOffProps) {
  const [activeNavTab, setActiveNavTab] = useState<'employees' | 'attendance' | 'timeoff'>('timeoff');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [balances, setBalances] = useState<TimeOffBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = userRole === 'admin';

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (isAdmin) {
        // Load all requests for admin
        const response = await timeoffApi.getAdminTimeOffList({ status: undefined });
        setRequests(response.results);
      } else {
        // Load my requests and balances for employee
        const response = await timeoffApi.getMyTimeOff();
        setRequests(response.requests);
        setBalances(response.balances);
      }
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to load time off data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await timeoffApi.approveRequest(id);
      
      // Update the request in state
      setRequests(requests.map(req => 
        req.id === id ? response.request : req
      ));
      
      alert('Request approved successfully');
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      const response = await timeoffApi.rejectRequest(id, reason);
      
      // Update the request in state
      setRequests(requests.map(req => 
        req.id === id ? response.request : req
      ));
      
      alert('Request rejected');
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const timeoffType = (form.elements.namedItem('timeoffType') as HTMLSelectElement).value;
    const startDate = (form.elements.namedItem('startDate') as HTMLInputElement).value;
    const endDate = (form.elements.namedItem('endDate') as HTMLInputElement).value;
    const reason = (form.elements.namedItem('reason') as HTMLTextAreaElement).value;
    
    try {
      await timeoffApi.createRequest({
        timeoff_type: timeoffType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      });
      
      setShowNewRequestModal(false);
      alert('Request submitted successfully');
      
      // Reload data
      loadData();
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: TimeOffStatus) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-700 border-green-300',
      REJECTED: 'bg-red-100 text-red-700 border-red-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const filteredRequests = requests.filter(req => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      req.type_name.toLowerCase().includes(searchLower) ||
      (req.employee_name && req.employee_name.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="w-40 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <span className="text-gray-400 text-sm">Dayflow</span>
            </div>

            {/* Center Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setActiveNavTab('employees');
                  onBack?.();
                }}
                className={`px-6 py-2 rounded-md transition-all text-sm ${
                  activeNavTab === 'employees'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('attendance');
                  onNavigateToAttendance?.();
                }}
                className={`px-6 py-2 rounded-md transition-all text-sm ${
                  activeNavTab === 'attendance'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => setActiveNavTab('timeoff')}
                className={`px-6 py-2 rounded-md transition-all text-sm ${
                  activeNavTab === 'timeoff'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Time Off
              </button>
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-10 h-10 bg-[#E381FF] rounded-full flex items-center justify-center text-white hover:bg-[#d66bfa] transition-colors"
              >
                <User size={20} />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={() => {
                      onNavigateToProfile?.();
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header Strip */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-gray-800">Time Off</h2>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* View Label */}
        <div className="mb-4">
          <p className="text-blue-600 text-sm">
            For {isAdmin ? 'Admin & HR Officer' : 'Employees'} View
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="bg-[#E381FF] hover:bg-[#d66bfa] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <Plus size={18} />
            NEW
          </button>
          {isAdmin && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
              />
            </div>
          )}
        </div>

        {/* Allocation Summary Strip */}
        {!isAdmin && balances.length > 0 && (
          <div className="flex items-center justify-center gap-8 mb-8">
            {balances.map((balance, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl px-8 py-6 text-center min-w-[200px]">
                <h3 className="text-blue-600 mb-2">{balance.type_name}</h3>
                <p className="text-gray-600 text-sm">{balance.days_available} Days Available</p>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading time off requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-[#E381FF] text-white rounded-lg hover:bg-[#d66bfa]"
              >
                Retry
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No time off requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      {isAdmin && <th className="px-6 py-4 text-left text-sm text-gray-700">Name</th>}
                      <th className="px-6 py-4 text-left text-sm text-gray-700">Start Date</th>
                      <th className="px-6 py-4 text-left text-sm text-gray-700">End Date</th>
                      <th className="px-6 py-4 text-left text-sm text-gray-700">Time off Type</th>
                      <th className="px-6 py-4 text-left text-sm text-gray-700">Days</th>
                      <th className="px-6 py-4 text-left text-sm text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr
                        key={request.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        {isAdmin && <td className="px-6 py-4 text-sm text-gray-800">{request.employee_name}</td>}
                        <td className="px-6 py-4 text-sm text-gray-600">{request.start_date}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.end_date}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.type_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.days_requested}</td>
                        <td className="px-6 py-4">
                          {isAdmin ? (
                            <div className="flex items-center gap-2">
                              {request.status === 'PENDING' ? (
                                <>
                                  <button
                                    onClick={() => handleApprove(request.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
                                  >
                                    <Check size={14} />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(request.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
                                  >
                                    <XCircle size={14} />
                                    Reject
                                  </button>
                                </>
                              ) : (
                                getStatusBadge(request.status)
                              )}
                            </div>
                          ) : (
                            getStatusBadge(request.status)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Time Off Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-gray-800">Time off Type Request</h3>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form className="p-6 space-y-5" onSubmit={handleSubmitRequest}>
              {/* Employee */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Employee</label>
                <input
                  type="text"
                  value={userName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                />
              </div>

              {/* Time off Type */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Time off Type</label>
                <select 
                  name="timeoffType"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                >
                  <option value="">Select type...</option>
                  {balances.map((balance, index) => (
                    <option key={index} value={balance.type_name}>
                      {balance.type_name} ({balance.days_available} days available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Validity Period */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Validity Period</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600 text-xs">From</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600 text-xs">To</label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Reason</label>
                <textarea
                  name="reason"
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                  placeholder="Enter reason for time off..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-[#E381FF] hover:bg-[#d66bfa] text-white rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
