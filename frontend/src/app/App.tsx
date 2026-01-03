import { useState, useEffect } from 'react';
import { Eye, EyeOff, Upload } from 'lucide-react';
import EmployeesDashboard from './components/EmployeesDashboard';
import { authApi } from '../api/auth';
import { handleApiError } from '../api/client';

type UserRole = 'admin' | 'employee';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup' | 'dashboard'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (user) {
      setCurrentUser({
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role.toLowerCase() as UserRole,
      });
      setCurrentPage('dashboard');
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const loginId = (form.elements.namedItem('loginId') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const response = await authApi.signin({
        login_identifier: loginId,
        password: password,
      });

      setCurrentUser({
        id: response.user.id,
        name: response.user.full_name,
        email: response.user.email,
        role: response.user.role.toLowerCase() as UserRole,
      });
      setCurrentPage('dashboard');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const companyName = (form.elements.namedItem('companyName') as HTMLInputElement).value;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const password = (form.elements.namedItem('signupPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.signup({
        company_name: companyName,
        full_name: name,
        email: email,
        phone: phone,
        password: password,
        confirm_password: confirmPassword,
      });

      setCurrentUser({
        id: response.user.id,
        name: response.user.full_name,
        email: response.user.email,
        role: response.user.role.toLowerCase() as UserRole,
      });
      setCurrentPage('dashboard');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.signout();
    setCurrentUser(null);
    setCurrentPage('signin');
  };

  // Show dashboard if logged in
  if (currentPage === 'dashboard' && currentUser) {
    return <EmployeesDashboard userRole={currentUser.role} userName={currentUser.name} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {currentPage === 'signin' ? (
        // Sign In Page
        <div className="w-full max-w-md">
          {/* Logo Placeholder */}
          <div className="flex justify-center mb-8">
            <div className="w-48 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <span className="text-gray-400">Dayflow Logo</span>
            </div>
          </div>

          {/* Sign In Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h1 className="text-center mb-8 text-gray-800">Sign In</h1>

            <form className="space-y-5" onSubmit={handleSignIn}>
              {/* Login ID / Email */}
              <div>
                <label htmlFor="loginId" className="block mb-2 text-gray-700 text-sm">
                  Login ID / Email
                </label>
                <input
                  type="text"
                  id="loginId"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                  placeholder="Enter your login ID or email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block mb-2 text-gray-700 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message Space */}
              <div className="min-h-[24px]">
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E381FF] hover:bg-[#d66bfa] text-white py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>

              {/* Test Credentials Info */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 font-semibold mb-2">Backend Connected!</p>
                <p className="text-xs text-blue-700">Create an account or use test data from backend</p>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-4">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage('signup')}
                  className="text-[#E381FF] hover:text-[#d66bfa] transition-colors text-sm"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Sign Up Page
        <div className="w-full max-w-md">
          {/* Logo and Upload Area */}
          <div className="flex justify-between items-center mb-8">
            <div className="w-48 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <span className="text-gray-400">Dayflow Logo</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Upload size={18} className="text-gray-600" />
              <span className="text-gray-700">Upload Logo</span>
            </button>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h1 className="text-center mb-6 text-gray-800">Sign Up</h1>
            <p className="text-center text-gray-500 text-sm mb-6">Admin / HR Registration</p>

            <form className="space-y-4" onSubmit={handleSignUp}>
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block mb-2 text-gray-700 text-sm">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                  placeholder="Enter company name"
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-700 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-gray-700 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                  placeholder="Enter work email"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block mb-2 text-gray-700 text-sm">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signupPassword" className="block mb-2 text-gray-700 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    id="signupPassword"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showSignUpPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-gray-700 text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E381FF] focus:border-transparent transition-all"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message Space */}
              <div className="min-h-[24px]">
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E381FF] hover:bg-[#d66bfa] text-white py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SIGNING UP...' : 'Sign Up'}
              </button>

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <span className="text-gray-600 text-sm">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage('signin')}
                  className="text-[#E381FF] hover:text-[#d66bfa] transition-colors text-sm"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}