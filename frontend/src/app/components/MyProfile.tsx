import { useState } from 'react';
import { User, Pencil, Plus, LogOut } from 'lucide-react';

interface MyProfileProps {
  onBack: () => void;
}

export default function MyProfile({ onBack }: MyProfileProps) {
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary'>('private');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<'employees' | 'attendance' | 'timeoff'>('employees');

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
                      // Already on profile page
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
              <h1 className="text-gray-900 mb-6">My Name</h1>
              
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
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'private' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - About Section */}
                <div className="space-y-6">
                  {/* About */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-gray-800">About</h3>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[120px]">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        A dedicated HR professional with over 5 years of experience in employee management, 
                        recruitment, and organizational development. Passionate about creating positive workplace 
                        cultures and streamlining HR processes.
                      </p>
                    </div>
                  </div>

                  {/* What I love about my job */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-gray-800">What I love about my job</h3>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        I love helping employees grow in their careers and watching them achieve their goals. 
                        Building strong relationships with team members and solving complex people-related challenges 
                        brings me great satisfaction.
                      </p>
                    </div>
                  </div>

                  {/* My interests and hobbies */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-gray-800">My interests and hobbies</h3>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Reading books on leadership and psychology, practicing yoga, hiking on weekends, 
                        and volunteering at local community events. I also enjoy photography and traveling 
                        to new places.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Skills and Certifications */}
                <div className="space-y-6">
                  {/* Skills Card */}
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

                  {/* Certification Card */}
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

            {activeTab === 'resume' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Resume content will be displayed here</p>
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Salary information will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}