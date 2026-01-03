import { useState, useEffect } from 'react';
import { User, LogOut, ArrowLeft, Mail, Phone, Briefcase, Building2, Calendar } from 'lucide-react';
import { employeesApi } from '../../api/employees';
import { handleApiError } from '../../api/client';

interface EmployeeDetailProps {
  employeeId: string;
  userRole: 'admin' | 'employee';
  userName: string;
  onBack: () => void;
  onLogout: () => void;
}

export default function EmployeeDetail({ employeeId, userRole, userName, onBack, onLogout }: EmployeeDetailProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadEmployeeDetail();
  }, [employeeId]);

  const loadEmployeeDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await employeesApi.get(employeeId);
      setEmployee(data);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to load employee details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PRESENT: 'bg-green-100 text-green-700 border-green-300',
      ABSENT: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      ON_LEAVE: 'bg-blue-100 text-blue-700 border-blue-300',
    };

    const labels = {
      PRESENT: 'Present in Office',
      ABSENT: 'Absent',
      ON_LEAVE: 'On Leave',
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm border ${styles[status as keyof typeof styles] || styles.ABSENT}`}>
        {labels[status as keyof typeof labels] || 'Unknown'}
      </span>
    );
  };

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

            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-800">Employee Information</h1>

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

      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading employee details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadEmployeeDetail}
              className="px-4 py-2 bg-[#E381FF] text-white rounded-lg hover:bg-[#d66bfa]"
            >
              Retry
            </button>
          </div>
        ) : employee ? (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={48} className="text-gray-400" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-1">{employee.full_name}</h2>
                      <p className="text-gray-500">Login ID: {employee.login_id}</p>
                    </div>
                    {getStatusBadge(employee.status_icon)}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Briefcase size={20} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Job Title</p>
                        <p className="text-sm text-gray-900">{employee.job_title || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Building2 size={20} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="text-sm text-gray-900">{employee.department || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{employee.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{employee.phone || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date Joined</p>
                    <p className="text-sm text-gray-900">
                      {employee.date_joined ? new Date(employee.date_joined).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm text-gray-900 font-medium">{employee.role}</p>
                </div>
              </div>
            </div>

            {/* View-Only Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a view-only page. You cannot edit this employee's information from here.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
