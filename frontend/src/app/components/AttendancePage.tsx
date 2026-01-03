import { useState } from 'react';
import { User, LogOut, ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';

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

// Mock data for Admin view
const mockAdminAttendance: AttendanceRecord[] = [
  { id: '1', employeeName: 'Sarah Johnson', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: '2', employeeName: 'Michael Chen', checkIn: '09:30', checkOut: '18:30', workHours: '09:00', extraHours: '00:00' },
  { id: '3', employeeName: 'Emily Rodriguez', checkIn: '10:15', checkOut: '19:15', workHours: '09:00', extraHours: '01:00' },
  { id: '4', employeeName: 'David Kim', checkIn: '09:00', checkOut: '18:00', workHours: '09:00', extraHours: '00:00' },
  { id: '5', employeeName: 'Jessica Williams', checkIn: '10:00', checkOut: '20:00', workHours: '10:00', extraHours: '02:00' },
  { id: '6', employeeName: 'Robert Taylor', checkIn: '09:45', checkOut: '18:45', workHours: '09:00', extraHours: '00:00' },
  { id: '7', employeeName: 'Amanda Brown', checkIn: '10:30', checkOut: '19:30', workHours: '09:00', extraHours: '01:00' },
  { id: '8', employeeName: 'James Wilson', checkIn: '09:15', checkOut: '18:15', workHours: '09:00', extraHours: '00:00' },
];

// Mock data for Employee view
const mockEmployeeAttendance: AttendanceRecord[] = [
  { id: '1', date: '28/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: '2', date: '27/10/2025', checkIn: '09:30', checkOut: '18:30', workHours: '09:00', extraHours: '00:00' },
  { id: '3', date: '26/10/2025', checkIn: '10:15', checkOut: '19:15', workHours: '09:00', extraHours: '01:00' },
  { id: '4', date: '25/10/2025', checkIn: '09:00', checkOut: '18:00', workHours: '09:00', extraHours: '00:00' },
  { id: '5', date: '24/10/2025', checkIn: '10:00', checkOut: '20:00', workHours: '10:00', extraHours: '02:00' },
  { id: '6', date: '23/10/2025', checkIn: '09:45', checkOut: '18:45', workHours: '09:00', extraHours: '00:00' },
  { id: '7', date: '22/10/2025', checkIn: '10:30', checkOut: '19:30', workHours: '09:00', extraHours: '01:00' },
  { id: '8', date: '21/10/2025', checkIn: '09:15', checkOut: '18:15', workHours: '09:00', extraHours: '00:00' },
];

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
  const [selectedDate, setSelectedDate] = useState('22 October 2025');
  const [selectedMonth, setSelectedMonth] = useState('Oct');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const isAdmin = userRole === 'admin';
  const attendanceData = isAdmin ? mockAdminAttendance : mockEmployeeAttendance;

  const filteredData = attendanceData.filter((record) => {
    if (!searchQuery) return true;
    if (isAdmin) {
      return record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return record.date?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePreviousDate = () => {
    console.log('Previous date');
  };

  const handleNextDate = () => {
    console.log('Next date');
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
                      <span className="text-gray-700 text-sm">{selectedDate}</span>
                      <ChevronDown size={16} className="text-gray-600" />
                    </button>
                    {showDateDropdown && (
                      <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 text-sm">
                          22 October 2025
                        </button>
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 text-sm">
                          21 October 2025
                        </button>
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 text-sm">
                          20 October 2025
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm">Thursday</span>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  {/* Summary Tiles */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Days Present</p>
                      <p className="text-2xl font-semibold text-gray-800">22</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Leaves Count</p>
                      <p className="text-2xl font-semibold text-gray-800">3</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Total Working Days</p>
                      <p className="text-2xl font-semibold text-gray-800">25</p>
                    </div>
                  </div>

                  {/* Month Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                      className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 text-sm">{selectedMonth}</span>
                      <ChevronDown size={16} className="text-gray-600" />
                    </button>
                    {showMonthDropdown && (
                      <div className="absolute top-full mt-2 right-0 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                          <button
                            key={month}
                            onClick={() => {
                              setSelectedMonth(month);
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
                      <td className="px-6 py-4 text-sm text-gray-800 text-right">
                        {record.checkIn}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-right">
                        {record.checkOut}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-right">
                        {record.workHours}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-right">
                        {record.extraHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
