import { useState, useEffect } from 'react';
import { User, Pencil, Plus, LogOut, X } from 'lucide-react';
import { profileApi } from '../../api/profile';
import type { FullProfile, Skill, Certification } from '../../api/profile';
import { handleApiError } from '../../api/client';

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
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Salary Info tab is only visible for admin/HR
  const showSalaryTab = userRole === 'admin';

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await profileApi.getFullProfile();
      setProfile(data);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (section: string, data: any) => {
    try {
      setSaving(true);
      const updated = await profileApi.updateProfile({ [section]: data });
      setProfile(updated);
      alert('Profile updated successfully');
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    const name = prompt('Enter skill name:');
    if (!name) return;
    
    try {
      const skill = await profileApi.addSkill({ name });
      if (profile) {
        setProfile({ ...profile, skills: [...profile.skills, skill] });
      }
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    
    try {
      await profileApi.deleteSkill(id);
      if (profile) {
        setProfile({ ...profile, skills: profile.skills.filter(s => s.id !== id) });
      }
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleAddCertification = async () => {
    const title = prompt('Enter certification title:');
    if (!title) return;
    
    const issuer = prompt('Enter issuer:');
    const issuedDate = prompt('Enter issued date (YYYY-MM-DD):');
    
    try {
      const cert = await profileApi.addCertification({ title, issuer: issuer || '', issued_date: issuedDate || undefined });
      if (profile) {
        setProfile({ ...profile, certifications: [...profile.certifications, cert] });
      }
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    
    try {
      await profileApi.deleteCertification(id);
      if (profile) {
        setProfile({ ...profile, certifications: profile.certifications.filter(c => c.id !== id) });
      }
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadProfile}
            className="px-4 py-2 bg-[#E381FF] text-white rounded-lg hover:bg-[#d66bfa]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-gray-900 mb-6">{profile?.full_name || userName}</h1>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Login ID</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">{profile?.login_id}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Email</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">{profile?.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Mobile</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">{profile?.phone}</span>
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
                    <span className="text-gray-800">{profile?.company_name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Department</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">{profile?.profile.department || '—'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Manager</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">{profile?.profile.manager_name || '—'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-gray-600 text-sm w-24">Location</label>
                  <div className="flex-1 border-b border-gray-300 pb-1">
                    <span className="text-gray-800">{profile?.profile.location || '—'}</span>
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
            {activeTab === 'resume' && profile && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Resume */}
                <div>
                  <h3 className="text-gray-800 mb-6">Resume</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Address</label>
                      <input
                        type="text"
                        defaultValue={profile.resume.address}
                        onBlur={(e) => handleUpdateProfile('resume', { address: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Personal Email</label>
                      <input
                        type="email"
                        defaultValue={profile.resume.personal_email}
                        onBlur={(e) => handleUpdateProfile('resume', { personal_email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Gender</label>
                      <select 
                        defaultValue={profile.resume.gender}
                        onChange={(e) => handleUpdateProfile('resume', { gender: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      >
                        <option value="">Select...</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Marital Status</label>
                      <select 
                        defaultValue={profile.resume.marital_status}
                        onChange={(e) => handleUpdateProfile('resume', { marital_status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      >
                        <option value="">Select...</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Date Joining</label>
                      <input
                        type="date"
                        defaultValue={profile.resume.date_of_joining || ''}
                        onBlur={(e) => handleUpdateProfile('resume', { date_of_joining: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Date of Birth</label>
                      <input
                        type="date"
                        defaultValue={profile.resume.date_of_birth || ''}
                        onBlur={(e) => handleUpdateProfile('resume', { date_of_birth: e.target.value })}
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
                        defaultValue={profile.bank.bank_account_number}
                        onBlur={(e) => handleUpdateProfile('bank', { bank_account_number: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">Bank Name</label>
                      <input
                        type="text"
                        defaultValue={profile.bank.bank_name}
                        onBlur={(e) => handleUpdateProfile('bank', { bank_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">IFSC Code</label>
                      <input
                        type="text"
                        defaultValue={profile.bank.ifsc_code}
                        onBlur={(e) => handleUpdateProfile('bank', { ifsc_code: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">UPI ID</label>
                      <input
                        type="text"
                        defaultValue={profile.bank.upi_id}
                        onBlur={(e) => handleUpdateProfile('bank', { upi_id: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Private Info Tab */}
            {activeTab === 'private' && profile && (
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
                        defaultValue={profile.profile.about}
                        onBlur={(e) => handleUpdateProfile('profile', { about: e.target.value })}
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
                        defaultValue={profile.profile.what_i_love}
                        onBlur={(e) => handleUpdateProfile('profile', { what_i_love: e.target.value })}
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
                        defaultValue={profile.profile.interests_and_hobbies}
                        onBlur={(e) => handleUpdateProfile('profile', { interests_and_hobbies: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Skills and Certifications */}
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-gray-800 mb-4">Skills</h3>
                    <div className="space-y-2 mb-4">
                      {profile.skills.map((skill) => (
                        <div key={skill.id} className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                          <span className="text-gray-700 text-sm">{skill.name}</span>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={handleAddSkill}
                      className="flex items-center gap-2 text-[#E381FF] hover:text-[#d66bfa] transition-colors text-sm"
                    >
                      <Plus size={16} />
                      <span>Add Skills</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-gray-800 mb-4">Certification</h3>
                    <div className="space-y-2 mb-4">
                      {profile.certifications.map((cert) => (
                        <div key={cert.id} className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-700 text-sm">{cert.title}</p>
                              {cert.issuer && <p className="text-gray-500 text-xs mt-1">{cert.issuer}</p>}
                              {cert.issued_date && <p className="text-gray-500 text-xs mt-1">Issued {cert.issued_date}</p>}
                            </div>
                            <button
                              onClick={() => handleDeleteCertification(cert.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={handleAddCertification}
                      className="flex items-center gap-2 text-[#E381FF] hover:text-[#d66bfa] transition-colors text-sm"
                    >
                      <Plus size={16} />
                      <span>Add Certification</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Salary Info Tab (Admin Only) */}
            {activeTab === 'salary' && showSalaryTab && profile?.salary && (
              <div className="space-y-6">
                {/* Top Summary */}
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-1">Monthly Wage</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{parseFloat(profile.salary.net_salary).toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-1">Annual</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{parseFloat(profile.salary.annual_salary).toLocaleString()}</p>
                  </div>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Monthly Wage</p>
                    <p className="text-lg font-semibold text-gray-900">₹{parseFloat(profile.salary.net_salary).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Month working days</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.salary.monthly_working_days}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">No. of weeks</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.salary.weeks_per_month}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Yearly Wage</p>
                    <p className="text-lg font-semibold text-gray-900">₹{parseFloat(profile.salary.annual_salary).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Year</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.salary.year}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">PF Contribution</p>
                    <p className="text-lg font-semibold text-gray-900">₹{parseFloat(profile.salary.pf_contribution).toLocaleString()}</p>
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
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹{parseFloat(profile.salary.basic_salary).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹{parseFloat(profile.salary.basic_salary).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-gray-50/50">
                          <td className="px-6 py-4 text-sm text-gray-800">House Rent Allowance</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">{profile.salary.hra_percentage}%</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹{parseFloat(profile.salary.hra_calculated).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">HRA Fixed</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹{parseFloat(profile.salary.hra_fixed).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹{parseFloat(profile.salary.hra_fixed).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-gray-50/50">
                          <td className="px-6 py-4 text-sm text-gray-800">Standard Allowance</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">{profile.salary.standard_allowance_percentage}%</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹{parseFloat(profile.salary.standard_allowance_calculated).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">Performance Bonus</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹{parseFloat(profile.salary.performance_bonus).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹{parseFloat(profile.salary.performance_bonus).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-gray-50/50">
                          <td className="px-6 py-4 text-sm text-gray-800">Leave Travel Allowance</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-800">₹{parseFloat(profile.salary.leave_travel_allowance).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">₹{parseFloat(profile.salary.leave_travel_allowance).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b-2 border-gray-300 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">Gross Salary</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">₹{parseFloat(profile.salary.gross_salary).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-red-50/30">
                          <td className="px-6 py-4 text-sm text-red-700">PF Contribution (Employee)</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">{profile.salary.pf_percentage}%</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">-₹{parseFloat(profile.salary.pf_contribution).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-red-50/30">
                          <td className="px-6 py-4 text-sm text-red-700">Professional Tax</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-red-700">₹{parseFloat(profile.salary.professional_tax).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">-₹{parseFloat(profile.salary.professional_tax).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 bg-red-50/30">
                          <td className="px-6 py-4 text-sm text-red-700">Income Tax (TDS)</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-red-700">₹{parseFloat(profile.salary.income_tax).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">-₹{parseFloat(profile.salary.income_tax).toLocaleString()}</td>
                        </tr>
                        <tr className="bg-[#E381FF]/10 border-t-2 border-[#E381FF]">
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">Net Salary (Take Home)</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">—</td>
                          <td className="px-6 py-4 text-right text-lg font-bold text-[#E381FF]">₹{parseFloat(profile.salary.net_salary).toLocaleString()}</td>
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
