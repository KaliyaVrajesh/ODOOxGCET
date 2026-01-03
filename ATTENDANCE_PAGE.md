# Attendance Page - Implementation Documentation

## Overview

The Attendance Page is a comprehensive view for tracking employee attendance with separate interfaces for Admin/HR Officers and Employees. It follows the exact wireframe specifications with clean HR SaaS styling.

## Component Structure

### File: `frontend/src/app/components/AttendancePage.tsx`

## Features

### Shared Elements (Both Views)

1. **Top Navigation Bar**
   - Left: Company Logo (Dayflow)
   - Center: Three tabs (Employees | Attendance | Time Off) with Attendance highlighted
   - Right: Circular user avatar with dropdown menu

2. **Navigation Controls**
   - Previous/Next arrow buttons (< >)
   - Date/Month selector with dropdown
   - Responsive layout

### Admin/HR Officer View

**Title:** "Attendance List view For Admin/HR Officer"

**Features:**
- Date selector with dropdown (e.g., "22 October 2025")
- Day label (e.g., "Thursday")
- Full-width search bar for filtering employees
- Attendance table with columns:
  - **Emp** - Employee name
  - **Check In** - Check-in time (right-aligned)
  - **Check Out** - Check-out time (right-aligned)
  - **Work hours** - Total work hours (right-aligned)
  - **Extra hours** - Overtime hours (right-aligned)

**Note Box:**
- Blue background with border
- Title: "NOTE"
- Explanation about attendance being the basis for payslip generation
- Information about unpaid/absent days reducing payable days

### Employee View

**Title:** "For Employees"

**Features:**
- Month selector dropdown (Oct ▼)
- Summary tiles showing:
  - **Days Present** - Count of days present (e.g., 22)
  - **Leaves Count** - Number of leaves taken (e.g., 3)
  - **Total Working Days** - Total days in month (e.g., 25)
- Attendance table with columns:
  - **Date** - Date in DD/MM/YYYY format
  - **Check In** - Check-in time (right-aligned)
  - **Check Out** - Check-out time (right-aligned)
  - **Work hours** - Total work hours (right-aligned)
  - **Extra hours** - Overtime hours (right-aligned)

## Visual Design

### Color Scheme
- **Primary Accent:** Soft purple (#E381FF)
- **Background:** Light gray (#F9FAFB)
- **Borders:** Light gray (#E5E7EB)
- **Text:** Dark gray (#1F2937)
- **Table Headers:** Bold, gray background

### Table Styling
- Clean borders with light gray
- Subtle zebra striping (alternating row colors)
- Hover effect on rows
- Right-aligned time columns
- Bold headers
- Responsive horizontal scroll on mobile

### Interactive Elements
- Hover states on all buttons
- Dropdown menus with smooth transitions
- Active tab highlighting with purple accent
- Search bar with focus ring

## Props

```typescript
interface AttendancePageProps {
  userRole?: 'admin' | 'employee';  // Determines which view to show
  onBack?: () => void;               // Callback for navigation
}
```

## Usage

### In EmployeesDashboard

```typescript
import AttendancePage from './AttendancePage';

// Show attendance page
if (currentView === 'attendance') {
  return <AttendancePage 
    userRole="admin" 
    onBack={() => {
      setCurrentView('dashboard');
      setActiveTab('employees');
    }} 
  />;
}
```

### Standalone Usage

```typescript
// Admin view
<AttendancePage userRole="admin" />

// Employee view
<AttendancePage userRole="employee" />
```

## Mock Data

### Admin View Data Structure
```typescript
interface AttendanceRecord {
  id: string;
  employeeName: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}
```

### Employee View Data Structure
```typescript
interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}
```

## Responsive Design

### Desktop (lg and above)
- Full table width
- All columns visible
- Side-by-side layout for controls

### Tablet (md)
- Horizontal scroll for table
- Stacked controls
- Maintained readability

### Mobile (sm)
- Horizontal scroll enabled
- Compact controls
- Touch-friendly buttons
- Minimum column widths maintained

## State Management

### Local State
- `activeNavTab` - Current navigation tab
- `showUserDropdown` - User menu visibility
- `searchQuery` - Search filter text (admin only)
- `selectedDate` - Current date selection (admin)
- `selectedMonth` - Current month selection (employee)
- `showDateDropdown` - Date dropdown visibility
- `showMonthDropdown` - Month dropdown visibility

### Computed Values
- `isAdmin` - Derived from userRole prop
- `attendanceData` - Filtered based on role
- `filteredData` - Search-filtered results

## Navigation Flow

### From Attendance Page
1. **Employees Button** → Returns to dashboard, shows employee grid
2. **Attendance Button** → Stays on attendance page (already there)
3. **Time Off Button** → Navigates to Time Off page
4. **User Avatar → My Profile** → Navigates to profile page
5. **User Avatar → Log Out** → Logs out user

### To Attendance Page
- Click "Attendance" tab from any page
- Sets `currentView` to 'attendance'
- Renders AttendancePage component

## Features to Implement (Backend Integration)

### API Endpoints Needed

1. **Get Attendance Records (Admin)**
   - `GET /api/attendance/admin/?date=YYYY-MM-DD`
   - Returns all employee attendance for selected date

2. **Get Attendance Records (Employee)**
   - `GET /api/attendance/me/?month=MM&year=YYYY`
   - Returns user's attendance for selected month

3. **Get Attendance Summary (Employee)**
   - `GET /api/attendance/me/summary/?month=MM&year=YYYY`
   - Returns days present, leaves count, total working days

### Data Transformations
- Convert backend timestamps to HH:MM format
- Calculate work hours and extra hours
- Format dates for display
- Handle timezone conversions

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for interactive elements
- Focus indicators on all interactive elements
- Screen reader friendly table structure

## Performance Considerations

- Efficient filtering with useMemo (when integrated)
- Virtualized table for large datasets (future)
- Debounced search input (future)
- Lazy loading for date ranges (future)

## Testing Checklist

### Admin View
- [ ] Date selector changes date
- [ ] Previous/Next buttons navigate dates
- [ ] Search filters employee list
- [ ] Table displays all columns correctly
- [ ] Note box is visible
- [ ] Navigation buttons work

### Employee View
- [ ] Month selector changes month
- [ ] Summary tiles show correct counts
- [ ] Previous/Next buttons navigate months
- [ ] Table displays all columns correctly
- [ ] Date format is correct
- [ ] Navigation buttons work

### Both Views
- [ ] Top navigation tabs work
- [ ] User dropdown menu works
- [ ] Responsive on mobile
- [ ] Table scrolls horizontally on small screens
- [ ] Hover states work
- [ ] Active states are visible

## Future Enhancements

1. **Export Functionality**
   - Export to CSV
   - Export to PDF
   - Print view

2. **Advanced Filtering**
   - Filter by department
   - Filter by date range
   - Filter by attendance status

3. **Bulk Operations**
   - Mark multiple as present/absent
   - Bulk edit attendance

4. **Real-time Updates**
   - Live attendance updates
   - WebSocket integration

5. **Analytics**
   - Attendance trends
   - Charts and graphs
   - Comparison views

6. **Notifications**
   - Late arrival alerts
   - Missing check-out reminders
   - Attendance anomalies

## Code Quality

- ✅ TypeScript for type safety
- ✅ Consistent naming conventions
- ✅ Reusable component structure
- ✅ Clean separation of concerns
- ✅ Proper prop typing
- ✅ Responsive design patterns
- ✅ Accessible markup

## Integration Notes

When integrating with backend:
1. Replace mock data with API calls
2. Add loading states
3. Add error handling
4. Implement pagination
5. Add data refresh functionality
6. Handle empty states
7. Add success/error notifications
