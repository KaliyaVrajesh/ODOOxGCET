# Frontend-Backend Integration Guide

## Overview
This guide explains how to integrate the existing Dayflow frontend with the Django backend APIs.

## Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (Admin)
python manage.py createsuperuser

# Create sample data
python manage.py create_sample_employees
python manage.py init_timeoff_types
python manage.py create_sample_timeoff
python manage.py create_sample_profiles

# Run server
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install axios

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Run development server
npm run dev
```

## API Client Usage

### Authentication

```typescript
import { authApi } from './api/auth';

// Sign up
const handleSignup = async () => {
  try {
    const response = await authApi.signup({
      company_name: 'Tech Solutions',
      full_name: 'John Doe',
      email: 'john@company.com',
      phone: '+1234567890',
      password: 'SecurePass123',
      confirm_password: 'SecurePass123',
    });
    
    console.log('User:', response.user);
    console.log('Role:', response.user.role); // Use for conditional rendering
    
    // Tokens are automatically stored
    // Redirect to dashboard
  } catch (error) {
    console.error('Signup failed:', handleApiError(error));
  }
};

// Sign in
const handleSignin = async () => {
  try {
    const response = await authApi.signin({
      login_identifier: 'john@company.com', // or login_id
      password: 'SecurePass123',
    });
    
    // Store user in state/context
    setUser(response.user);
    setUserRole(response.user.role); // 'ADMIN' or 'EMPLOYEE'
    
  } catch (error) {
    console.error('Signin failed:', handleApiError(error));
  }
};

// Get current user
const user = authApi.getCurrentUser();
if (user) {
  console.log('Logged in as:', user.full_name);
  console.log('Role:', user.role);
}

// Sign out
const handleSignout = () => {
  authApi.signout();
  // Redirect to login
};
```

### Employees

```typescript
import { employeesApi } from './api/employees';

// Get employees list
const loadEmployees = async () => {
  try {
    const response = await employeesApi.list({ search: 'john' });
    setEmployees(response.results);
    
    // Each employee has status_icon: 'PRESENT' | 'ABSENT' | 'ON_LEAVE'
    // Use this for the colored dots
  } catch (error) {
    console.error('Failed to load employees:', handleApiError(error));
  }
};

// Get employee detail
const loadEmployeeDetail = async (id: string) => {
  try {
    const employee = await employeesApi.get(id);
    setSelectedEmployee(employee);
  } catch (error) {
    console.error('Failed to load employee:', handleApiError(error));
  }
};
```

### Attendance

```typescript
import { attendanceApi } from './api/attendance';

// Check in
const handleCheckIn = async () => {
  try {
    const response = await attendanceApi.checkIn();
    console.log(response.message); // "Checked in successfully"
    console.log(response.since_time); // "09:30"
    
    // Update UI - show green dot, display time
    setIsCheckedIn(true);
    setCheckInTime(response.since_time);
    
  } catch (error) {
    const errorMsg = handleApiError(error);
    if (errorMsg.includes('ALREADY_CHECKED_IN')) {
      alert('You have already checked in today');
    }
  }
};

// Check out
const handleCheckOut = async () => {
  try {
    const response = await attendanceApi.checkOut();
    console.log(response.duration); // "8h 30m"
    
    // Update UI
    setIsCheckedIn(false);
    alert(`Checked out successfully. Duration: ${response.duration}`);
    
  } catch (error) {
    console.error('Check out failed:', handleApiError(error));
  }
};

// Get current status
const loadCurrentStatus = async () => {
  try {
    const status = await attendanceApi.getCurrentStatus();
    setIsCheckedIn(status.is_checked_in);
    setCheckInTime(status.since_time);
    setStatusIcon(status.status_icon); // For colored dot
  } catch (error) {
    console.error('Failed to load status:', handleApiError(error));
  }
};

// Admin - Get day attendance
const loadAdminDayAttendance = async (date?: string) => {
  try {
    const data = await attendanceApi.getAdminDayAttendance(date);
    
    console.log('Date:', data.date); // "03/01/2026"
    console.log('Present:', data.total_present);
    console.log('Absent:', data.total_absent);
    
    // data.employees is array of AttendanceRecord
    setAttendanceRecords(data.employees);
    
  } catch (error) {
    console.error('Failed to load attendance:', handleApiError(error));
  }
};

// Employee - Get month attendance
const loadEmployeeMonthAttendance = async (month: number, year: number) => {
  try {
    const data = await attendanceApi.getEmployeeMonthAttendance(month, year);
    
    console.log('Month:', data.month); // "Jan"
    console.log('Days present:', data.days_present);
    console.log('Days on leave:', data.days_on_leave);
    
    // data.records is array of AttendanceRecord
    setAttendanceRecords(data.records);
    
  } catch (error) {
    console.error('Failed to load attendance:', handleApiError(error));
  }
};
```

### Profile

```typescript
import { profileApi } from './api/profile';

// Get full profile
const loadProfile = async () => {
  try {
    const profile = await profileApi.getFullProfile();
    
    console.log('User:', profile.full_name);
    console.log('Role:', profile.role);
    
    // Profile tabs
    console.log('Profile:', profile.profile); // Header + Private Info
    console.log('Resume:', profile.resume); // Resume tab
    console.log('Bank:', profile.bank); // Bank details
    console.log('Salary:', profile.salary); // null if not admin
    console.log('Skills:', profile.skills);
    console.log('Certifications:', profile.certifications);
    
    setProfileData(profile);
    
  } catch (error) {
    console.error('Failed to load profile:', handleApiError(error));
  }
};

// Update profile (partial)
const updateProfile = async () => {
  try {
    const updated = await profileApi.updateProfile({
      profile: {
        about: 'Updated about text...',
      },
      resume: {
        address: 'New address...',
      },
    });
    
    setProfileData(updated);
    alert('Profile updated successfully');
    
  } catch (error) {
    console.error('Failed to update profile:', handleApiError(error));
  }
};

// Add skill
const addSkill = async (name: string) => {
  try {
    const skill = await profileApi.addSkill({ name, level: 'Expert' });
    setSkills([...skills, skill]);
  } catch (error) {
    console.error('Failed to add skill:', handleApiError(error));
  }
};

// Delete skill
const deleteSkill = async (id: string) => {
  try {
    await profileApi.deleteSkill(id);
    setSkills(skills.filter(s => s.id !== id));
  } catch (error) {
    console.error('Failed to delete skill:', handleApiError(error));
  }
};

// Get salary (Admin only)
const loadSalary = async () => {
  try {
    const salary = await profileApi.getSalary();
    
    console.log('Basic:', salary.basic_salary);
    console.log('Gross:', salary.gross_salary);
    console.log('Net:', salary.net_salary);
    console.log('Annual:', salary.annual_salary);
    
    setSalaryData(salary);
    
  } catch (error) {
    // Will return 403 if not admin
    console.error('Failed to load salary:', handleApiError(error));
  }
};
```

### Time Off

```typescript
import { timeoffApi } from './api/timeoff';

// Get my time off
const loadMyTimeOff = async () => {
  try {
    const data = await timeoffApi.getMyTimeOff();
    
    // Balances
    console.log('Balances:', data.balances);
    // [{ type_name: 'Paid Time Off', days_available: 24 }, ...]
    
    // Requests
    console.log('Requests:', data.requests);
    setTimeOffRequests(data.requests);
    setBalances(data.balances);
    
  } catch (error) {
    console.error('Failed to load time off:', handleApiError(error));
  }
};

// Create request
const createTimeOffRequest = async () => {
  try {
    const request = await timeoffApi.createRequest({
      timeoff_type: 'uuid-of-type',
      start_date: '2026-02-01',
      end_date: '2026-02-05',
      reason: 'Family vacation',
    });
    
    setTimeOffRequests([...requests, request]);
    alert('Request created successfully');
    
  } catch (error) {
    console.error('Failed to create request:', handleApiError(error));
  }
};

// Admin - Get all requests
const loadAdminTimeOff = async () => {
  try {
    const data = await timeoffApi.getAdminTimeOffList({ status: 'PENDING' });
    setTimeOffRequests(data.results);
  } catch (error) {
    console.error('Failed to load requests:', handleApiError(error));
  }
};

// Admin - Approve request
const approveRequest = async (id: string) => {
  try {
    const response = await timeoffApi.approveRequest(id);
    
    // Update the request in state
    setTimeOffRequests(requests.map(r => 
      r.id === id ? response.request : r
    ));
    
    alert('Request approved');
    
  } catch (error) {
    console.error('Failed to approve:', handleApiError(error));
  }
};

// Admin - Reject request
const rejectRequest = async (id: string, reason: string) => {
  try {
    const response = await timeoffApi.rejectRequest(id, reason);
    
    // Update the request in state
    setTimeOffRequests(requests.map(r => 
      r.id === id ? response.request : r
    ));
    
    alert('Request rejected');
    
  } catch (error) {
    console.error('Failed to reject:', handleApiError(error));
  }
};
```

## Role-Based Rendering

```typescript
import { authApi } from './api/auth';

const MyProfile = () => {
  const user = authApi.getCurrentUser();
  const showSalaryTab = user?.role === 'ADMIN' || user?.role === 'HR';
  
  return (
    <div>
      <Tab>Resume</Tab>
      <Tab>Private Info</Tab>
      {showSalaryTab && <Tab>Salary Info</Tab>}
      <Tab>Security</Tab>
    </div>
  );
};

const TimeOff = () => {
  const user = authApi.getCurrentUser();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';
  
  return (
    <div>
      {isAdmin && <SearchBar />}
      {isAdmin ? <AdminView /> : <EmployeeView />}
    </div>
  );
};
```

## Real-Time Updates

```typescript
// After check-in, immediately update status
const handleCheckIn = async () => {
  const response = await attendanceApi.checkIn();
  
  // Update local state
  setIsCheckedIn(true);
  setStatusIcon('PRESENT');
  
  // Optionally reload employees list to update dots
  await loadEmployees();
};

// After time off approval, update table
const handleApprove = async (id: string) => {
  const response = await timeoffApi.approveRequest(id);
  
  // Update the specific request in state
  setRequests(requests.map(r => 
    r.id === id ? { ...r, status: 'APPROVED' } : r
  ));
};

// After profile update, reflect changes immediately
const handleProfileUpdate = async (data) => {
  const updated = await profileApi.updateProfile(data);
  setProfileData(updated); // UI updates instantly
};
```

## Error Handling

```typescript
import { handleApiError } from './api/client';

try {
  await someApiCall();
} catch (error) {
  const errorMessage = handleApiError(error);
  
  // Show error to user
  setError(errorMessage);
  // or
  toast.error(errorMessage);
  // or
  alert(errorMessage);
}
```

## Complete Integration Example

```typescript
// App.tsx
import { useEffect, useState } from 'react';
import { authApi } from './api/auth';
import { attendanceApi } from './api/attendance';

function App() {
  const [user, setUser] = useState(authApi.getCurrentUser());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadCurrentStatus();
    }
  }, [user]);
  
  const loadCurrentStatus = async () => {
    try {
      const status = await attendanceApi.getCurrentStatus();
      setIsCheckedIn(status.is_checked_in);
    } catch (error) {
      console.error(handleApiError(error));
    }
  };
  
  const handleCheckIn = async () => {
    try {
      await attendanceApi.checkIn();
      setIsCheckedIn(true);
      // Show success message
    } catch (error) {
      alert(handleApiError(error));
    }
  };
  
  const handleLogout = () => {
    authApi.signout();
    setUser(null);
    // Redirect to login
  };
  
  if (!user) {
    return <LoginPage />;
  }
  
  return (
    <Dashboard
      user={user}
      isCheckedIn={isCheckedIn}
      onCheckIn={handleCheckIn}
      onLogout={handleLogout}
    />
  );
}
```

## Testing

1. **Start backend**: `python manage.py runserver`
2. **Start frontend**: `npm run dev`
3. **Test flow**:
   - Sign up as Admin
   - Create employees
   - Check in/out
   - View attendance
   - Create time off requests
   - Approve/reject as admin
   - Update profile
   - View salary (admin only)

## Notes

- All API calls automatically include JWT token
- Token refresh is handled automatically
- Errors are formatted consistently
- Role-based access is enforced on backend
- Frontend should check user.role for conditional rendering
- All dates from backend are in ISO format or DD/MM/YYYY
- Times are in HH:MM format
