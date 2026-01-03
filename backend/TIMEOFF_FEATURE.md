# Time Off Management Feature - Implementation Summary

## Overview

The Time Off Management feature provides a complete leave management system with employee self-service and admin approval workflows. Employees can view their balances, create time off requests, and track their status. Admin/HR users can review all requests, approve or reject them, and manage employee balances.

## Database Models

### TimeOffType Model
- **Purpose**: Define types of time off (Paid, Sick, Unpaid)
- **Fields**:
  - `id` - UUID primary key
  - `code` - Unique code (PAID, SICK, UNPAID)
  - `name` - Display name (e.g., "Paid time off")
  - `default_annual_allocation_days` - Default days allocated per year
  - `is_active` - Whether this type is currently active
  - `created_at` - Timestamp

### TimeOffBalance Model
- **Purpose**: Track remaining time off days per user, type, and year
- **Relationship**: ForeignKey to User and TimeOffType
- **Fields**:
  - `id` - UUID primary key
  - `user` - Foreign key to User
  - `timeoff_type` - Foreign key to TimeOffType
  - `year` - Integer year
  - `allocated_days` - Total days allocated for the year
  - `used_days` - Days already used
  - `created_at`, `updated_at` - Timestamps
- **Computed Property**:
  - `available_days` - Returns `allocated_days - used_days`
- **Constraints**: Unique together (user, timeoff_type, year)

### TimeOffRequest Model
- **Purpose**: Represents a time off allocation or leave request
- **Relationship**: ForeignKey to User (employee, requested_by, approved_by) and TimeOffType
- **Fields**:
  - `id` - UUID primary key
  - `employee` - Foreign key to User (who the request is for)
  - `timeoff_type` - Foreign key to TimeOffType
  - `start_date` - Start date of time off
  - `end_date` - End date of time off
  - `allocation_days` - Number of days (auto-calculated if not provided)
  - `attachment` - File upload (for medical certificates, etc.)
  - `status` - PENDING, APPROVED, or REJECTED
  - `requested_by` - User who created the request
  - `approved_by` - User who approved/rejected (nullable)
  - `rejection_reason` - Text reason for rejection
  - `created_at`, `updated_at` - Timestamps
- **Methods**:
  - `calculate_days(start_date, end_date)` - Static method to calculate days between dates

## API Endpoints

### Employee Endpoints

#### 1. Get My Time Off
- **Endpoint**: `GET /api/timeoff/me/`
- **Authentication**: Required (JWT)
- **Query Parameters**:
  - `year` (optional) - Year to filter balances (default: current year)
  - `search` (optional) - Search in type name or status
- **Purpose**: Get employee's balances and requests
- **Response**: 
  - `balances` - Array of balance objects with available days
  - `requests` - Array of request objects

#### 2. Create Time Off Request
- **Endpoint**: `POST /api/timeoff/me/`
- **Authentication**: Required (JWT)
- **Body**:
  - `timeoff_type` (required) - UUID of time off type
  - `start_date` (required) - Start date (YYYY-MM-DD)
  - `end_date` (required) - End date (YYYY-MM-DD)
  - `allocation_days` (optional) - Number of days (auto-calculated if omitted)
  - `attachment` (optional) - File upload
- **Purpose**: Create new time off request
- **Behavior**:
  - Auto-calculates days if not provided
  - Sets status to PENDING
  - Sets employee and requested_by to authenticated user
- **Response**: Created request and updated balances

### Admin/HR Endpoints

#### 3. List All Time Off Requests
- **Endpoint**: `GET /api/timeoff/admin/`
- **Authentication**: Required (JWT)
- **Permissions**: Admin or HR role
- **Query Parameters**:
  - `status` (optional) - Filter by status
  - `type` (optional) - Filter by type code
  - `employee` (optional) - Filter by employee UUID
  - `search` (optional) - Search across multiple fields
- **Purpose**: List all time off requests with filtering
- **Response**: Array of request objects

#### 4. Approve Time Off Request
- **Endpoint**: `POST /api/timeoff/admin/<uuid:request_id>/approve/`
- **Authentication**: Required (JWT)
- **Permissions**: Admin or HR role
- **Purpose**: Approve a pending time off request
- **Behavior**:
  - Validates status is PENDING
  - Validates sufficient balance
  - Deducts allocation_days from balance.used_days
  - Sets status to APPROVED
  - Sets approved_by to authenticated user
- **Response**: Updated request and balances

#### 5. Reject Time Off Request
- **Endpoint**: `POST /api/timeoff/admin/<uuid:request_id>/reject/`
- **Authentication**: Required (JWT)
- **Permissions**: Admin or HR role
- **Body** (optional):
  - `rejection_reason` - Text reason for rejection
- **Purpose**: Reject a pending time off request
- **Behavior**:
  - Validates status is PENDING
  - Sets status to REJECTED
  - Sets approved_by to authenticated user
  - Does NOT change balances
- **Response**: Updated request and balances

#### 6. Get Employee Balances
- **Endpoint**: `GET /api/timeoff/admin/balances/<uuid:employee_id>/`
- **Authentication**: Required (JWT)
- **Permissions**: Admin or HR role
- **Query Parameters**:
  - `year` (optional) - Year to get balances for
- **Purpose**: Get time off balances for a specific employee
- **Response**: Employee info and balances array

## Business Rules

### Balance Management
1. **Auto-Creation**: Balances are automatically created when first needed
2. **Default Allocation**: Uses `default_annual_allocation_days` from TimeOffType
3. **Deduction on Approval**: `used_days` increases when request is approved
4. **No Deduction on Rejection**: Balances unchanged when request is rejected
5. **Validation**: Cannot approve if `allocation_days > available_days`

### Request Workflow
1. **Creation**: Employee creates request with PENDING status
2. **Review**: Admin/HR reviews the request
3. **Approval**: 
   - Validates sufficient balance
   - Deducts from balance
   - Sets status to APPROVED
   - Records approver
4. **Rejection**:
   - No balance changes
   - Sets status to REJECTED
   - Records approver and reason

### Permissions
- **Employees**: Can only view/create their own requests
- **Admin/HR**: Can view all requests, approve/reject any request
- **Status Changes**: Only PENDING requests can be approved/rejected

### Audit Trail
- `requested_by` - Who created the request
- `approved_by` - Who approved/rejected the request
- `created_at` - When request was created
- `updated_at` - When request was last modified
- `rejection_reason` - Why request was rejected

## Utility Functions

### get_or_create_balance(user, timeoff_type, year)
- Gets existing balance or creates new one with default allocation
- Used when approving requests to ensure balance exists

### validate_balance_for_request(balance, requested_days)
- Validates sufficient available days
- Returns error message if insufficient, None if valid

### initialize_balances_for_user(user, year)
- Creates balances for all active time off types for a user
- Used when onboarding new employees or starting new year

## Management Commands

### init_timeoff_types
```bash
python manage.py init_timeoff_types
```
- Creates/updates default time off types (PAID, SICK, UNPAID)
- Sets default allocations (24, 7, 0 days respectively)
- Idempotent - safe to run multiple times

### init_timeoff_balances
```bash
python manage.py init_timeoff_balances [--year YEAR]
```
- Initializes balances for all active users
- Creates balances for all active time off types
- Optional year parameter (default: current year)

### create_sample_timeoff
```bash
python manage.py create_sample_timeoff
```
- Creates sample time off requests for testing
- Requires sample employees to exist
- Creates mix of PENDING and APPROVED requests
- Updates balances for approved requests

## Frontend Integration

### Employee View Structure
```
Time Off Page
├── Balance Cards
│   ├── Paid Time Off (24 Days Available)
│   └── Sick Leave (7 Days Available)
├── New Request Button
└── Requests Table
    ├── Date Range
    ├── Type
    ├── Status
    └── Actions (if pending)
```

### Admin/HR View Structure
```
Time Off Management
├── Filters
│   ├── Status (All, Pending, Approved, Rejected)
│   ├── Type (All, Paid, Sick, Unpaid)
│   └── Search
├── Requests Table
│   ├── Employee Name
│   ├── Date Range
│   ├── Type
│   ├── Days
│   ├── Status
│   └── Actions (Approve/Reject if pending)
└── Employee Balance Lookup
```

### Example React Hook
```javascript
const useTimeOff = () => {
  const [data, setData] = useState({ balances: [], requests: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTimeOff();
  }, []);
  
  const fetchTimeOff = async () => {
    const response = await api.get('/timeoff/me/');
    setData(response.data);
    setLoading(false);
  };
  
  const createRequest = async (requestData) => {
    const response = await api.post('/timeoff/me/', requestData);
    setData(prev => ({
      balances: response.data.balances,
      requests: [response.data.request, ...prev.requests]
    }));
    return response.data;
  };
  
  return { data, loading, createRequest, refresh: fetchTimeOff };
};
```

### Example Admin Hook
```javascript
const useAdminTimeOff = () => {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });
  
  useEffect(() => {
    fetchRequests();
  }, [filters]);
  
  const fetchRequests = async () => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/timeoff/admin/?${params}`);
    setRequests(response.data);
  };
  
  const approveRequest = async (requestId) => {
    const response = await api.post(`/timeoff/admin/${requestId}/approve/`);
    await fetchRequests(); // Refresh list
    return response.data;
  };
  
  const rejectRequest = async (requestId, reason) => {
    const response = await api.post(`/timeoff/admin/${requestId}/reject/`, {
      rejection_reason: reason
    });
    await fetchRequests(); // Refresh list
    return response.data;
  };
  
  return { requests, filters, setFilters, approveRequest, rejectRequest };
};
```

## Error Handling

### Common Errors

#### 1. Insufficient Balance
```json
{
  "error": "INSUFFICIENT_BALANCE",
  "detail": "Insufficient balance. Requested: 10.0 days, Available: 5.0 days for Paid time off"
}
```
**Solution**: Employee needs to request fewer days or wait for balance reset

#### 2. Invalid Status
```json
{
  "error": "INVALID_STATUS",
  "detail": "Cannot approve request with status: APPROVED"
}
```
**Solution**: Request has already been processed

#### 3. Invalid Date Range
```json
{
  "end_date": ["End date must be after or equal to start date."]
}
```
**Solution**: Fix date range in request

#### 4. Unauthorized
```json
{
  "detail": "You do not have permission to perform this action."
}
```
**Solution**: User doesn't have Admin/HR role for admin endpoints

## Testing

### Setup Test Data
```bash
# 1. Initialize types
python manage.py init_timeoff_types

# 2. Create sample employees
python manage.py create_sample_employees

# 3. Initialize balances
python manage.py init_timeoff_balances

# 4. Create sample requests
python manage.py create_sample_timeoff
```

### Test Scenarios

#### Scenario 1: Employee Creates Request
1. Sign in as employee
2. GET `/api/timeoff/me/` to see balances
3. POST `/api/timeoff/me/` to create request
4. Verify request appears with PENDING status
5. Verify balances unchanged

#### Scenario 2: Admin Approves Request
1. Sign in as admin
2. GET `/api/timeoff/admin/?status=PENDING`
3. POST `/api/timeoff/admin/<id>/approve/`
4. Verify request status changed to APPROVED
5. Verify balance.used_days increased
6. Verify balance.available_days decreased

#### Scenario 3: Admin Rejects Request
1. Sign in as admin
2. GET `/api/timeoff/admin/?status=PENDING`
3. POST `/api/timeoff/admin/<id>/reject/` with reason
4. Verify request status changed to REJECTED
5. Verify balances unchanged
6. Verify rejection_reason saved

#### Scenario 4: Insufficient Balance
1. Create request for more days than available
2. Admin attempts to approve
3. Verify error returned
4. Verify request status unchanged
5. Verify balances unchanged

## Performance Considerations

### Database Queries
- Use `select_related` for foreign keys (user, timeoff_type, approved_by)
- Indexes on frequently queried fields (status, employee, created_at)
- Unique constraint on (user, timeoff_type, year) for balances

### Caching (Future)
- Cache balance calculations
- Cache time off types (rarely change)
- Invalidate cache on approval/rejection

## Future Enhancements

### Planned Features
- **Calendar Integration**: Visual calendar view of time off
- **Team Calendar**: See team members' time off
- **Conflict Detection**: Warn if too many team members off same day
- **Recurring Time Off**: Support for regular schedules
- **Half Days**: Support for 0.5 day increments
- **Carryover**: Roll unused days to next year
- **Accrual**: Earn days monthly instead of annual allocation
- **Holidays**: Exclude public holidays from day calculations
- **Weekends**: Exclude weekends from day calculations
- **Notifications**: Email/push notifications for status changes
- **Bulk Operations**: Approve/reject multiple requests at once
- **Reports**: Analytics on time off usage patterns
- **Export**: Export time off data to CSV/PDF

### Technical Improvements
- Add file size validation for attachments
- Add file type validation (PDF, images only)
- Implement soft delete for audit purposes
- Add request cancellation (employee can cancel PENDING requests)
- Add request modification (before approval)
- Add delegation (manager can approve on behalf of HR)
- Add multi-level approval workflow
- Add custom approval rules per department

## Security Considerations

### Authentication
- All endpoints require valid JWT token
- Token must not be expired

### Authorization
- Employees can only access their own data
- Admin/HR role required for admin endpoints
- Approval/rejection requires Admin/HR role

### Data Validation
- Date ranges validated (end >= start)
- Allocation days validated (>= 0.5)
- Balance validated before approval
- Status validated before state changes

### File Uploads
- Files stored in `media/timeoff_attachments/`
- File paths returned as absolute URLs
- Consider adding virus scanning for production
- Consider adding file size limits

## Deployment Checklist

### Initial Setup
- [ ] Run migrations
- [ ] Initialize time off types
- [ ] Initialize balances for existing users
- [ ] Configure media file storage
- [ ] Set up file upload limits
- [ ] Configure CORS for file uploads

### Production Considerations
- [ ] Set up proper media file storage (S3, etc.)
- [ ] Configure file upload size limits
- [ ] Set up backup for time off data
- [ ] Configure email notifications
- [ ] Set up monitoring for approval delays
- [ ] Document approval SLAs
- [ ] Train admin/HR users

### Annual Maintenance
- [ ] Reset balances for new year
- [ ] Handle carryover (if implemented)
- [ ] Archive old requests
- [ ] Review and update default allocations
- [ ] Generate annual reports
