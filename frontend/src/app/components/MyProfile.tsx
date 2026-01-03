import { useState } from 'react';
import { User, Pencil, Plus, LogOut } from 'lucide-react';

interface MyProfileProps {
  userRole: 'employee' | 'admin';
  userName: string;
  onBack: () => void;
  onLogout: () => void;
}

type TabType = 'resume' | 'private' | 'salary' | 'security';

export default function MyProfile({ userRole, userName, onBack, onLogout }: MyProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('private');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<'employees' | 'attendance' | 'timeoff'>('employees');

  // Salary Info tab is only visible for admin/HR
  const showSalaryTab = userRole === 'admin';

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
                  onBack();
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
                  onBack();
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
                onClick={() => {
                  setActiveNavTab('timeoff');
                  onBack();
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
        <h2 className="text-gray-800">My Profile</h2>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Profile Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 bg-[#E381FF] rounded-full flex items-center justify-center">
                  <User size={64} className="text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                  <Pencil size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Center: Name and Basic Info */}
            <div className="flex-1">
              <h1 className="text-gray-900 mb-6">{userName}</h1>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Login ID</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">admin001</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Email</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">admin@company.com</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Mobile</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Company Info */}
            <div className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Company</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">Tech Solutions Inc.</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Department</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">Human Resources</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Manager</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">—</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Location</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-t-2xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex-1 px-6 py-4 text-sm transition-colors ${
                activeTab === 'resume'
                  ? 'bg-[#E381FF] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Resume
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`flex-1 px-6 py-4 text-sm transition-colors ${
                activeTab === 'private'
                  ? 'bg-[#E381FF] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Private Info
            </button>
            {showSalaryTab && (
              <button
                onClick={() => setActiveTab('salary')}
                className={`flex-1 px-6 py-4 text-sm transition-colors ${
                  activeTab === 'salary'
                    ? 'bg-[#E381FF] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Salary Info
              </button>
            )}
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 px-6 py-4 text-sm transition-colors ${
                activeTab === 'security'
                  ? 'bg-[#E381FF] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Resume Tab */}
            {activeTab === 'resume' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Resume */}
                <div>
                  <h3 className="text-gray-800 mb-6">Resume</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Address</label>
                      <input
                        type="text"
                        defaultValue="123 Main Street, San Francisco, CA 94102"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Personal Email</label>
                      <input
                        type="email"
                        defaultValue="personal@email.com"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Gender</label>
                      <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Marital Status</label>
                      <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm">
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Date Joining</label>
                      <input
                        type="date"
                        defaultValue="2022-01-15"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Date of Birth</label>
                      <input
                        type="date"
                        defaultValue="1990-05-20"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Bank Detail */}
                <div>
                  <h3 className="text-gray-800 mb-6">Bank Detail</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Bank Number</label>
                      <input
                        type="text"
                        defaultValue="1234567890123456"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Bank Name</label>
                      <input
                        type="text"
                        defaultValue="Chase Bank"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">IFSC Code</label>
                      <input
                        type="text"
                        defaultValue="CHAS0001234"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">UPI ID</label>
                      <input
                        type="text"
                        defaultValue="user@upi"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Private Info Tab */}
            {activeTab === 'private' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - About Section */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-gray-800">About</h3>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[120px]">
                      <textarea
                        className="w-full bg-transparent text-gray-600 text-sm leading-relaxed resize-none focus:outline-none"
                        rows={5}
                        defaultValue="A dedicated HR professional with over 5 years of experience in employee management, recruitment, and organizational development. Passionate about creating positive workplace cultures and streamlining HR processes."
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-gray-800">What I love about my job</h3>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                      <textarea
                        className="w-full bg-transparent text-gray-600 text-sm leading-relaxed resize-none focus:outline-none"
                        rows={4}
                        defaultValue="I love helping employees grow in their careers and watching them achieve their goals. Building strong relationships with team members and solving complex people-related challenges brings me great satisfaction."
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-gray-800">My interests and hobbies</h3>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                      <textarea
                        className="w-full bg-transparent text-gray-600 text-sm leading-relaxed resize-none focus:outline-none"
                        rows={4}
                        defaultValue="Reading books on leadership and psychology, practicing yoga, hiking on weekends, and volunteering at local community events. I also enjoy photography and traveling to new places."
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Skills and Certifications */}
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-gray-800 mb-4">Skills</h3>
                    <div className="space-y-2 mb-4">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <span className="text-gray-700 text-sm">Employee Relations</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <span className="text-gray-700 text-sm">Recruitment & Onboarding</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <span className="text-gray-700 text-sm">Performance Management</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <span className="text-gray-700 text-sm">HR Analytics</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <span className="text-gray-700 text-sm">Conflict Resolution</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-[#E381FF] hover:text-[#d66bfa] transition-colors text-sm">
                      <Plus size={16} />
                      <span>Add Skills</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-gray-800 mb-4">Certification</h3>
                    <div className="space-y-2 mb-4">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <p className="text-gray-700 text-sm">SHRM-CP (Society for Human Resource Management)</p>
                        <p className="text-gray-500 text-xs mt-1">Issued 2022</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <p className="text-gray-700 text-sm">Professional in Human Resources (PHR)</p>
                        <p className="text-gray-500 text-xs mt-1">Issued 2021</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <p className="text-gray-700 text-sm">Certified Diversity Professional (CDP)</p>
                        <p className="text-gray-500 text-xs mt-1">Issued 2023</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-[#E381FF] hover:text-[#d66bfa] transition-colors text-sm">
                      <Plus size={16} />
                      <span>Add Certification</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Salary Info Tab (Admin/HR Only) */}
            {activeTab === 'salary' && showSalaryTab && (
              <div className="space-y-6">
                {/* Top Summary */}
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-1">Monthly Wage</p>
                    <p className="text-2xl font-semibold text-gray-900">₹60,000</p>
                  </div>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-1">Annual</p>
                    <p className="text-2xl font-semibold text-gray-900">₹7,20,000</p>
                  </div>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Monthly Wage</p>
                    <p className="text-lg font-semibold text-gray-900">₹60,000</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Month working days</p>
                    <input
                      type="number"
                      defaultValue="22"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#E381FF]"
                    />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">No. of weeks</p>
                    <input
                      type="number"
                      defaultValue="4"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#E381FF]"
                    />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Yearly Wage</p>
                    <p className="text-lg font-semibold text-gray-900">₹7,20,000</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Year</p>
                    <input
                      type="text"
                      defaultValue="2025"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#E381FF]"
                    />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">PF Contribution</p>
                    <input
                      type="text"
                      defaultValue="₹7,200"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#E381FF]"
                    />
                  </div>
                </div>

                {/* Detailed Components Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Component</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Percentage</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Fixed Amount</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Calculated</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">Basic Salary</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹30,000</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹30,000</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-gray-50/50">
                          <td className="px-6 py-4 text-sm text-gray-800">House Rent Allowance</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">50%</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹15,000</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">HRA Fixed</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹5,000</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹5,000</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-gray-50/50">
                          <td className="px-6 py-4 text-sm text-gray-800">Standard Allowance</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">50%</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹15,000</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">Performance Bonus</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹3,000</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹3,000</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-gray-50/50">
                          <td className="px-6 py-4 text-sm text-gray-800">Leave Travel Allowance</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹2,000</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹2,000</td>
                        </tr>
                        <tr className="border-b-2 border-gray-300 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">Gross Salary</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">₹70,000</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-red-50/30">
                          <td className="px-6 py-4 text-sm text-red-700">PF Contribution (Employee)</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">12%</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">-₹3,600</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-red-50/30">
                          <td className="px-6 py-4 text-sm text-red-700">Professional Tax</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-red-700">₹200</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">-₹200</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-red-50/30">
                          <td className="px-6 py-4 text-sm text-red-700">Income Tax (TDS)</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-red-700">₹6,200</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">-₹6,200</td>
                        </tr>
                        <tr className="bg-[#E381FF]/10 border-t-2 border-[#E381FF]">
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">Net Salary (Take Home)</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-lg font-bold text-[#E381FF]">₹60,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <span className="font-semibold">Note:</span> This Salary Info tab is only visible to Admin and HR roles. 
                    Regular employees cannot access salary information through their profile.
                  </p>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-800 mb-2">Security Settings</h3>
                  <p className="text-gray-500 text-sm">
                    Security features including password management, two-factor authentication, 
                    and login history will be available soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
