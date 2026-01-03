import { useState } from 'react';
import { User, LogOut, Search, Plus, X, Upload, Check, XCircle } from 'lucide-react';

type TimeOffStatus = 'pending' | 'approved' | 'rejected';
type UserRole = 'employee' | 'admin';

interface TimeOffRequest {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  status: TimeOffStatus;
}

interface TimeOffProps {
  userRole: UserRole;
  userName: string;
  onBack?: () => void;
  onNavigateToProfile?: () => void;
  onLogout: () => void;
}

const mockRequests: TimeOffRequest[] = [
  {
    id: '1',
    employeeName: 'Sarah Johnson',
    startDate: '28/10/2025',
    endDate: '28/10/2025',
    type: 'Paid time Off',
    status: 'pending',
  },
  {
    id: '2',
    employeeName: 'Michael Chen',
    startDate: '15/11/2025',
    endDate: '20/11/2025',
    type: 'Sick leave',
    status: 'approved',
  },
  {
    id: '3',
    employeeName: 'Emily Rodriguez',
    startDate: '01/12/2025',
    endDate: '05/12/2025',
    type: 'Paid time Off',
    status: 'pending',
  },
  {
    id: '4',
    employeeName: 'David Kim',
    startDate: '10/11/2025',
    endDate: '12/11/2025',
    type: 'Unpaid leaves',
    status: 'rejected',
  },
  {
    id: '5',
    employeeName: 'Jessica Williams',
    startDate: '22/11/2025',
    endDate: '22/11/2025',
    type: 'Paid time Off',
    status: 'approved',
  },
];

export default function TimeOff({ userRole, userName, onBack, onNavigateToProfile, onLogout }: TimeOffProps) {
  const [activeNavTab, setActiveNavTab] = useState<'employees' | 'attendance' | 'timeoff'>('timeoff');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<TimeOffRequest[]>(mockRequests);

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'approved' as TimeOffStatus } : req))
    );
  };

  const handleReject = (id: string) => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'rejected' as TimeOffStatus } : req))
    );
  };

  const getStatusBadge = (status: TimeOffStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredRequests = requests.filter(req =>
    req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  onBack?.();
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
            For {userRole === 'employee' ? 'Employees' : 'Admin & HR Officer'} View
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
          {userRole === 'admin' && (
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
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-6 text-center min-w-[200px]">
            <h3 className="text-blue-600 mb-2">Paid time off</h3>
            <p className="text-gray-600 text-sm">24 Days Available</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-6 text-center min-w-[200px]">
            <h3 className="text-blue-600 mb-2">Sick time off</h3>
            <p className="text-gray-600 text-sm">07 Days Available</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">End Date</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Time off Type</th>
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
                      <td className="px-6 py-4 text-sm text-gray-800">{request.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.startDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.endDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.type}</td>
                      <td className="px-6 py-4">
                        {userRole === 'employee' ? (
                          getStatusBadge(request.status)
                        ) : (
                          <div className="flex items-center gap-2">
                            {request.status === 'pending' ? (
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
            <form className="p-6 space-y-5">
              {/* Employee */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Employee</label>
                <input
                  type="text"
                  value="[Employee]"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                />
              </div>

              {/* Time off Type */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Time off Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm">
                  <option>Paid time off</option>
                  <option>Sick leave</option>
                  <option>Unpaid leaves</option>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600 text-xs">To</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Allocation */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Allocation</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                  />
                  <span className="text-gray-600 text-sm">Days</span>
                </div>
              </div>

              {/* Attachment */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Attachment</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E381FF] transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm mb-1">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-xs">(For sick leave certificate)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Submit new request');
                    setShowNewRequestModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-[#E381FF] hover:bg-[#d66bfa] text-white rounded-lg transition-colors text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
