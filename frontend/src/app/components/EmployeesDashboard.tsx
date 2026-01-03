import { useState, useEffect } from 'react';
import { Search, Plus, ChevronRight, Plane, LogOut, User } from 'lucide-react';
import MyProfile from './MyProfile';
import TimeOff from './TimeOff';
import AttendancePage from './AttendancePage';
import EmployeeDetail from './EmployeeDetail';
import { employeesApi } from '../../api/employees';
import { attendanceApi } from '../../api/attendance';
import { handleApiError } from '../../api/client';

type EmployeeStatus = 'present' | 'on-leave' | 'absent';
type UserRole = 'admin' | 'employee';

interface Employee {
  id: string;
  name: string;
  status: EmployeeStatus;
  avatar?: string;
}

interface EmployeesDashboardProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export default function EmployeesDashboard({ userRole, userName, onLogout }: EmployeesDashboardProps) {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'timeoff'>('employees');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'timeoff' | 'attendance' | 'employee-detail'>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Load employees on mount
  useEffect(() => {
    loadEmployees(); // Load for all users, not just admin
  }, [userRole]);

  // Load current attendance status on mount and when component becomes visible
  useEffect(() => {
    loadCurrentStatus();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const employeesList = await employeesApi.list({ search: searchQuery });
      
      // Map API response to component format
      const mappedEmployees = employeesList.map(emp => ({
        id: emp.id,
        name: emp.full_name,
        status: emp.status_icon.toLowerCase().replace('_', '-') as EmployeeStatus,
        avatar: emp.profile_picture || undefined,
      }));
      
      setEmployees(mappedEmployees);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentStatus = async () => {
    try {
      const status = await attendanceApi.getCurrentStatus();
      setIsCheckedIn(status.is_checked_in);
      setCheckInTime(status.since_time || '');
    } catch (err) {
      console.error('Failed to load status:', err);
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await attendanceApi.checkIn();
      setIsCheckedIn(true);
      setCheckInTime(response.since_time);
      
      // Reload employees to update status dots for all users
      loadEmployees();
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await attendanceApi.checkOut();
      setIsCheckedIn(false);
      setCheckInTime('');
      alert(`Checked out successfully. Duration: ${response.duration}`);
      
      // Reload employees to update status dots for all users
      loadEmployees();
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  // Search employees when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleEmployeeClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setCurrentView('employee-detail');
  };

  const getStatusIndicator = (status: EmployeeStatus) => {
    switch (status) {
      case 'present':
        return <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />;
      case 'on-leave':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <Plane size={12} className="text-white" />
          </div>
        );
      case 'absent':
        return <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-sm" />;
    }
  };

  // Show Employee Detail view
  if (currentView === 'employee-detail' && selectedEmployeeId) {
    return <EmployeeDetail 
      employeeId={selectedEmployeeId}
      userRole={userRole}
      userName={userName}
      onBack={() => {
        setCurrentView('dashboard');
        setSelectedEmployeeId(null);
      }}
      onLogout={onLogout}
    />;
  }

  // Show My Profile view
  if (currentView === 'profile') {
    return <MyProfile 
      userRole={userRole}
      userName={userName}
      onBack={() => setCurrentView('dashboard')} 
      onLogout={onLogout}
    />;
  }

  // Show Time Off view
  if (currentView === 'timeoff') {
    return <TimeOff 
      userRole={userRole}
      userName={userName}
      onBack={() => {
        setCurrentView('dashboard');
        setActiveTab('employees');
      }}
      onNavigateToAttendance={() => setCurrentView('attendance')}
      onNavigateToProfile={() => setCurrentView('profile')}
      onLogout={onLogout}
    />;
  }

  // Show Attendance view
  if (currentView === 'attendance') {
    return <AttendancePage 
      userRole={userRole}
      userName={userName}
      onBack={() => {
        setCurrentView('dashboard');
        setActiveTab('employees');
      }}
      onNavigateToTimeOff={() => setCurrentView('timeoff')}
      onNavigateToProfile={() => setCurrentView('profile')}
      onLogout={onLogout}
    />;
  }

  const filteredEmployees = employees;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
                  setActiveTab('employees');
                  setCurrentView('dashboard');
                }}
                className={`px-6 py-2 rounded-md transition-all text-sm ${
                  activeTab === 'employees'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => {
                  setActiveTab('attendance');
                  setCurrentView('attendance');
                }}
                className={`px-6 py-2 rounded-md transition-all text-sm ${
                  activeTab === 'attendance'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => {
                  setActiveTab('timeoff');
                  setCurrentView('timeoff');
                }}
                className={`px-6 py-2 rounded-md transition-all text-sm ${
                  activeTab === 'timeoff'
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
                      console.log('Navigate to My Profile');
                      setShowUserDropdown(false);
                      setCurrentView('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      console.log('Log out');
                      setShowUserDropdown(false);
                      onLogout();
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

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Section - Employee Grid */}
        <div className="flex-1 p-6">
          {/* Action Bar */}
          <div className="flex items-center gap-4 mb-6">
            <button className="bg-[#E381FF] hover:bg-[#d66bfa] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm">
              <Plus size={18} />
              NEW
            </button>
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading employees...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={loadEmployees}
                  className="mt-4 px-4 py-2 bg-[#E381FF] text-white rounded-lg hover:bg-[#d66bfa]"
                >
                  Retry
                </button>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No employees found</p>
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee.id)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer text-left relative group"
                >
                  {/* Status Indicator - Top Right */}
                  <div className="absolute top-4 right-4">
                    {getStatusIndicator(employee.status)}
                  </div>

                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                    <User size={32} className="text-gray-400" />
                  </div>

                  {/* Employee Name */}
                  <p className="text-gray-800">{employee.name}</p>
                </button>
              ))
            )}
          </div>

          {/* Status Legend */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 inline-block">
            <p className="text-gray-700 mb-3 text-sm">Status Indicators:</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-gray-600 text-sm">Present in office</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Plane size={10} className="text-white" />
                </div>
                <span className="text-gray-600 text-sm">On leave</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className="text-gray-600 text-sm">Absent (no time-off applied)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Check In/Out Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 hidden lg:flex flex-col">
          <h3 className="text-gray-800 mb-6">Attendance</h3>

          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              className="w-full bg-[#E381FF] hover:bg-[#d66bfa] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Check IN</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-700 text-sm">Checked In</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Since {checkInTime}</p>
              <button
                onClick={handleCheckOut}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <span>Check Out</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-xs text-center">
              Your attendance is tracked for today
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Check In/Out - Bottom Fixed */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {!isCheckedIn ? (
          <button
            onClick={handleCheckIn}
            className="w-full bg-[#E381FF] hover:bg-[#d66bfa] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <span>Check IN</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-700 text-xs">Checked In</span>
              </div>
              <p className="text-gray-600 text-xs">Since {checkInTime}</p>
            </div>
            <button
              onClick={handleCheckOut}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <span>Check Out</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}