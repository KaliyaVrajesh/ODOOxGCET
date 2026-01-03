import { useState, useEffect } from 'react';
import { User, LogOut, ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { attendanceApi } from '../../api/attendance';
import { handleApiError } from '../../api/client';

type UserRole = 'admin' | 'employee';

interface AttendanceRecord {
  id: string;
  employeeName?: string; // For admin view
  date?: string; // For employee view
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

interface AttendancePageProps {
  userRole: UserRole;
  userName: string;
  onBack?: () => void;
  onNavigateToTimeOff?: () => void;
  onNavigateToProfile?: () => void;
  onLogout: () => void;
}

export default function AttendancePage({ userRole, userName, onBack, onNavigateToTimeOff, onNavigateToProfile, onLogout }: AttendancePageProps) {
  const [activeNavTab, setActiveNavTab] = useState<'employees' | 'attendance' | 'timeoff'>('attendance');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Admin view stats
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalOnLeave, setTotalOnLeave] = useState(0);
  
  // Employee view stats
  const [daysPresent, setDaysPresent] = useState(0);
  const [daysOnLeave, setDaysOnLeave] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const isAdmin = userRole === 'admin';

  // Load data on mount and when date/month changes
  useEffect(() => {
    if (isAdmin) {
      loadAdminDayAttendance();
    } else {
      loadEmployeeMonthAttendance();
    }
  }, [isAdmin, selectedDate, selectedMonth, selectedYear]);

  const loadAdminDayAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      
      const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await attendanceApi.getAdminDayAttendance(dateStr);
      
      // Map API response to component format
      const mappedData = response.employees.map(emp => ({
        id: emp.id,
        employeeName: emp.employee_name,
        checkIn: emp.check_in,
        checkOut: emp.check_out,
        workHours: emp.work_hours,
        extraHours: emp.extra_hours,
      }));
      
      setAttendanceData(mappedData);
      setTotalPresent(response.total_present);
      setTotalAbsent(response.total_absent);
      setTotalOnLeave(response.total_on_leave);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to load admin attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeMonthAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await attendanceApi.getEmployeeMonthAttendance(selectedMonth, selectedYear);
      
      // Map API response to component format
      const mappedData = response.records.map(rec => ({
        id: rec.id,
        date: rec.date,
        checkIn: rec.check_in,
        checkOut: rec.check_out,
        workHours: rec.work_hours,
        extraHours: rec.extra_hours,
      }));
      
      setAttendanceData(mappedData);
      setDaysPresent(response.days_present);
      setDaysOnLeave(response.days_on_leave);
      setTotalDays(response.total_days);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to load employee attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = attendanceData.filter((record) => {
    if (!searchQuery) return true;
    if (isAdmin) {
      return record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return record.date?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePreviousDate = () => {
    if (isAdmin) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    } else {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    }
  };

  const handleNextDate = () => {
    if (isAdmin) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

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
                onClick={() => setActiveNavTab('attendance')}
                className={`px-6 py-2 rounded-md transition-all text-sm ${
                  activeNavTab === 'attendance'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('timeoff');
                  onNavigateToTimeOff?.();
                }}
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
                      setShowUserDropdown(false);
                      onNavigateToProfile?.();
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {isAdmin ? 'Attendance List view For Admin/HR Officer' : 'For Employees'}
          </h2>

          {/* Controls Row */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              {/* Left: Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousDate}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={handleNextDate}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Center/Right: Date/Month Selector and Summary */}
              {isAdmin ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowDateDropdown(!showDateDropdown)}
                      className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 text-sm">{formatDate(selectedDate)}</span>
                      <ChevronDown size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                  {/* Admin Summary */}
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Present</p>
                      <p className="text-xl font-semibold text-green-600">{totalPresent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Absent</p>
                      <p className="text-xl font-semibold text-red-600">{totalAbsent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">On Leave</p>
                      <p className="text-xl font-semibold text-yellow-600">{totalOnLeave}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  {/* Summary Tiles */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Days Present</p>
                      <p className="text-2xl font-semibold text-gray-800">{daysPresent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Leaves Count</p>
                      <p className="text-2xl font-semibold text-gray-800">{daysOnLeave}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Total Working Days</p>
                      <p className="text-2xl font-semibold text-gray-800">{totalDays}</p>
                    </div>
                  </div>

                  {/* Month Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                      className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 text-sm">{getMonthName(selectedMonth)} {selectedYear}</span>
                      <ChevronDown size={16} className="text-gray-600" />
                    </button>
                    {showMonthDropdown && (
                      <div className="absolute top-full mt-2 right-0 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 max-h-64 overflow-y-auto">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                          <button
                            key={month}
                            onClick={() => {
                              setSelectedMonth(index + 1);
                              setShowMonthDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 text-sm"
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            {isAdmin && (
              <div className="relative">
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

          {/* Attendance Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading attendance data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => isAdmin ? loadAdminDayAttendance() : loadEmployeeMonthAttendance()}
                  className="px-4 py-2 bg-[#E381FF] text-white rounded-lg hover:bg-[#d66bfa]"
                >
                  Retry
                </button>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No attendance records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        {isAdmin ? 'Emp' : 'Date'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Check In
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Check Out
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Work hours
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Extra hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((record, index) => (
                      <tr
                        key={record.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {isAdmin ? record.employeeName : record.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">
                          {record.checkIn}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">
                          {record.checkOut}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">
                          {record.workHours}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">
                          {record.extraHours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Note Box (Admin Only) */}
          {isAdmin && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">NOTE</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Attendance is the basis for payslip generation. Unpaid or absent days will automatically 
                reduce the number of payable days. Please ensure all attendance records are accurate and 
                up-to-date to avoid discrepancies in salary calculations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
