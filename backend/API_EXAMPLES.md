# Dayflow HRMS - API Examples

Complete examples for testing all API endpoints.

## Setup

Set your access token as an environment variable:

```bash
# After signing in, set your token
export TOKEN="your_access_token_here"
```

## Authentication APIs

### Admin Sign Up
```bash
curl -X POST http://localhost:8000/api/auth/admin/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Odoo India",
    "full_name": "John Doe",
    "email": "john@odoo.com",
    "phone": "+91-9876543210",
    "password": "SecurePass123",
    "confirm_password": "SecurePass123"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "OIJODO20260001",
    "password": "SecurePass123"
  }'
```

## Employee Management APIs

### List Employees
```bash
curl -X GET http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer $TOKEN"
```

### Search Employees
```bash
curl -X GET "http://localhost:8000/api/employees/?search=priya" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Employee Detail
```bash
curl -X GET http://localhost:8000/api/employees/<user_id>/ \
  -H "Authorization: Bearer $TOKEN"
```

## Attendance APIs

### Check In
```bash
curl -X POST http://localhost:8000/api/attendance/check-in/ \
  -H "Authorization: Bearer $TOKEN"
```

### Check Out
```bash
curl -X POST http://localhost:8000/api/attendance/check-out/ \
  -H "Authorization: Bearer $TOKEN"
```

### Get Current Status
```bash
curl -X GET http://localhost:8000/api/attendance/current/ \
  -H "Authorization: Bearer $TOKEN"
```

## Profile Management APIs

### Get My Profile
```bash
curl -X GET http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer $TOKEN"
```

### Update Profile (Full Update)
```bash
curl -X PUT http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_position": "Senior Software Engineer",
    "department": "Engineering",
    "manager_name": "Vikram Singh",
    "location": "Bangalore, India",
    "about": "Passionate software engineer with 5+ years of experience in full-stack development.",
    "what_i_love": "I love solving complex problems and learning new technologies.",
    "interests_and_hobbies": "Reading tech blogs, hiking, photography, and playing guitar."
  }'
```

### Update Profile (Partial Update)
```bash
curl -X PATCH http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_position": "Senior Software Engineer",
    "about": "Updated about section"
  }'
```

### Add Skill
```bash
curl -X POST http://localhost:8000/api/profile/me/skills/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python",
    "level": "Expert"
  }'
```

### Add Another Skill
```bash
curl -X POST http://localhost:8000/api/profile/me/skills/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Django",
    "level": "Advanced"
  }'
```

### Delete Skill
```bash
# Replace <skill_id> with actual UUID
curl -X DELETE http://localhost:8000/api/profile/me/skills/<skill_id>/ \
  -H "Authorization: Bearer $TOKEN"
```

### Add Certification
```bash
curl -X POST http://localhost:8000/api/profile/me/certifications/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "issued_date": "2023-06-15"
  }'
```

### Add Certification (Minimal)
```bash
curl -X POST http://localhost:8000/api/profile/me/certifications/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Professional Certificate"
  }'
```

### Delete Certification
```bash
# Replace <certification_id> with actual UUID
curl -X DELETE http://localhost:8000/api/profile/me/certifications/<certification_id>/ \
  -H "Authorization: Bearer $TOKEN"
```

## Complete Workflow Example

### 1. Sign Up as Admin
```bash
curl -X POST http://localhost:8000/api/auth/admin/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Tech Corp",
    "full_name": "Jane Smith",
    "email": "jane@techcorp.com",
    "phone": "+1-555-0123",
    "password": "SecurePass123",
    "confirm_password": "SecurePass123"
  }'
```

Save the `access` token from the response.

### 2. Get Your Profile
```bash
export TOKEN="<access_token_from_signup>"

curl -X GET http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Update Your Profile
```bash
curl -X PATCH http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_position": "CTO",
    "department": "Executive",
    "location": "San Francisco, CA",
    "about": "Experienced technology leader with 15+ years in software development.",
    "what_i_love": "Building great teams and innovative products.",
    "interests_and_hobbies": "Mentoring, reading, and sailing."
  }'
```

### 4. Add Skills
```bash
curl -X POST http://localhost:8000/api/profile/me/skills/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Leadership", "level": "Expert"}'

curl -X POST http://localhost:8000/api/profile/me/skills/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Python", "level": "Expert"}'

curl -X POST http://localhost:8000/api/profile/me/skills/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "System Architecture", "level": "Expert"}'
```

### 5. Add Certifications
```bash
curl -X POST http://localhost:8000/api/profile/me/certifications/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AWS Certified Solutions Architect - Professional",
    "issuer": "Amazon Web Services",
    "issued_date": "2022-08-15"
  }'

curl -X POST http://localhost:8000/api/profile/me/certifications/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "PMP Certification",
    "issuer": "Project Management Institute",
    "issued_date": "2021-03-20"
  }'
```

### 6. Check In
```bash
curl -X POST http://localhost:8000/api/attendance/check-in/ \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get Current Status
```bash
curl -X GET http://localhost:8000/api/attendance/current/ \
  -H "Authorization: Bearer $TOKEN"
```

### 8. View Complete Profile
```bash
curl -X GET http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool
```

## Error Handling Examples

### Duplicate Skill
```bash
# Try adding the same skill twice
curl -X POST http://localhost:8000/api/profile/me/skills/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Python", "level": "Expert"}'

# Second attempt will return:
# {"name": ["You already have this skill in your profile."]}
```

### Already Checked In
```bash
# Try checking in twice
curl -X POST http://localhost:8000/api/attendance/check-in/ \
  -H "Authorization: Bearer $TOKEN"

# Second attempt will return:
# {"error": "ALREADY_CHECKED_IN", "detail": "You have already checked in today..."}
```

### Invalid Credentials
```bash
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "wrong@email.com",
    "password": "wrongpassword"
  }'

# Returns:
# {"error": "INVALID_CREDENTIALS", "detail": "Invalid login credentials..."}
```

## Testing with Python

```python
import requests

BASE_URL = "http://localhost:8000/api"

# Sign in
response = requests.post(f"{BASE_URL}/auth/signin/", json={
    "login_identifier": "jane@techcorp.com",
    "password": "SecurePass123"
})
data = response.json()
token = data['access']

# Set up headers
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Get profile
profile = requests.get(f"{BASE_URL}/profile/me/", headers=headers).json()
print(f"Profile: {profile['full_name']}")

# Add skill
skill = requests.post(
    f"{BASE_URL}/profile/me/skills/",
    headers=headers,
    json={"name": "Docker", "level": "Advanced"}
).json()
print(f"Added skill: {skill['name']}")

# Check in
checkin = requests.post(f"{BASE_URL}/attendance/check-in/", headers=headers).json()
print(f"Checked in at: {checkin['since_time']}")
```

## Testing with JavaScript/Node.js

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

async function testAPI() {
  // Sign in
  const signInResponse = await axios.post(`${BASE_URL}/auth/signin/`, {
    login_identifier: 'jane@techcorp.com',
    password: 'SecurePass123'
  });
  
  const token = signInResponse.data.access;
  
  // Set up axios instance with auth
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Get profile
  const profile = await api.get('/profile/me/');
  console.log('Profile:', profile.data.full_name);
  
  // Add skill
  const skill = await api.post('/profile/me/skills/', {
    name: 'Kubernetes',
    level: 'Intermediate'
  });
  console.log('Added skill:', skill.data.name);
  
  // Check in
  const checkin = await api.post('/attendance/check-in/');
  console.log('Checked in at:', checkin.data.since_time);
}

testAPI().catch(console.error);
```


## Time Off Management APIs

### Employee Time Off

#### Get My Time Off
```bash
curl -X GET http://localhost:8000/api/timeoff/me/ \
  -H "Authorization: Bearer $TOKEN"
```

#### Get My Time Off for Specific Year
```bash
curl -X GET "http://localhost:8000/api/timeoff/me/?year=2026" \
  -H "Authorization: Bearer $TOKEN"
```

#### Create Time Off Request
```bash
# First, get time off types from your balances
# Then create request with the type UUID
curl -X POST http://localhost:8000/api/timeoff/me/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timeoff_type": "<timeoff-type-uuid>",
    "start_date": "2026-07-01",
    "end_date": "2026-07-05"
  }'
```

#### Create Time Off Request with Custom Days
```bash
curl -X POST http://localhost:8000/api/timeoff/me/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timeoff_type": "<timeoff-type-uuid>",
    "start_date": "2026-07-01",
    "end_date": "2026-07-02",
    "allocation_days": "1.5"
  }'
```

### Admin/HR Time Off Management

#### List All Time Off Requests
```bash
curl -X GET http://localhost:8000/api/timeoff/admin/ \
  -H "Authorization: Bearer $TOKEN"
```

#### Filter by Status
```bash
curl -X GET "http://localhost:8000/api/timeoff/admin/?status=PENDING" \
  -H "Authorization: Bearer $TOKEN"
```

#### Filter by Type
```bash
curl -X GET "http://localhost:8000/api/timeoff/admin/?type=PAID" \
  -H "Authorization: Bearer $TOKEN"
```

#### Search Requests
```bash
curl -X GET "http://localhost:8000/api/timeoff/admin/?search=priya" \
  -H "Authorization: Bearer $TOKEN"
```

#### Approve Request
```bash
curl -X POST http://localhost:8000/api/timeoff/admin/<request_id>/approve/ \
  -H "Authorization: Bearer $TOKEN"
```

#### Reject Request
```bash
curl -X POST http://localhost:8000/api/timeoff/admin/<request_id>/reject/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rejection_reason": "Overlaps with team event"
  }'
```

#### Get Employee Balances
```bash
curl -X GET http://localhost:8000/api/timeoff/admin/balances/<employee_id>/ \
  -H "Authorization: Bearer $TOKEN"
```

## Complete Time Off Workflow

### 1. Initialize Time Off System (Admin)
```bash
# Initialize time off types
python manage.py init_timeoff_types

# Initialize balances for all users
python manage.py init_timeoff_balances

# Create sample data (optional)
python manage.py create_sample_timeoff
```

### 2. Employee Creates Request
```bash
# Sign in as employee
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "priya.sharma@odoo.com",
    "password": "Employee123"
  }'

# Save the token
export EMPLOYEE_TOKEN="<access_token>"

# Get balances and find time off type UUID
curl -X GET http://localhost:8000/api/timeoff/me/ \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN"

# Create request
curl -X POST http://localhost:8000/api/timeoff/me/ \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timeoff_type": "<paid-timeoff-type-uuid>",
    "start_date": "2026-08-01",
    "end_date": "2026-08-05"
  }'

# Save the request ID from response
```

### 3. Admin Reviews and Approves
```bash
# Sign in as admin
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "admin@odoo.com",
    "password": "AdminPass123"
  }'

# Save the token
export ADMIN_TOKEN="<access_token>"

# List pending requests
curl -X GET "http://localhost:8000/api/timeoff/admin/?status=PENDING" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Approve the request
curl -X POST http://localhost:8000/api/timeoff/admin/<request_id>/approve/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 4. Employee Checks Updated Status
```bash
# Get updated balances and requests
curl -X GET http://localhost:8000/api/timeoff/me/ \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN"
```

## Testing with Python

```python
import requests

BASE_URL = "http://localhost:8000/api"

# Sign in as employee
response = requests.post(f"{BASE_URL}/auth/signin/", json={
    "login_identifier": "priya.sharma@odoo.com",
    "password": "Employee123"
})
employee_token = response.json()['access']

headers = {
    "Authorization": f"Bearer {employee_token}",
    "Content-Type": "application/json"
}

# Get balances
timeoff_data = requests.get(f"{BASE_URL}/timeoff/me/", headers=headers).json()
print(f"Balances: {timeoff_data['balances']}")

# Get PAID time off type UUID
paid_type_id = None
for balance in timeoff_data['balances']:
    if balance['type_code'] == 'PAID':
        # Extract type ID from balance or use a separate endpoint
        paid_type_id = balance['id']  # This is balance ID, need type ID
        break

# Create request
request_data = {
    "timeoff_type": paid_type_id,
    "start_date": "2026-08-01",
    "end_date": "2026-08-05"
}
response = requests.post(
    f"{BASE_URL}/timeoff/me/",
    headers=headers,
    json=request_data
)
print(f"Created request: {response.json()}")

# Admin approves
admin_response = requests.post(f"{BASE_URL}/auth/signin/", json={
    "login_identifier": "admin@odoo.com",
    "password": "AdminPass123"
})
admin_token = admin_response.json()['access']
admin_headers = {"Authorization": f"Bearer {admin_token}"}

request_id = response.json()['request']['id']
approve_response = requests.post(
    f"{BASE_URL}/timeoff/admin/{request_id}/approve/",
    headers=admin_headers
)
print(f"Approval result: {approve_response.json()}")
```

## Testing with JavaScript/Node.js

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

async function testTimeOff() {
  // Sign in as employee
  const signInResponse = await axios.post(`${BASE_URL}/auth/signin/`, {
    login_identifier: 'priya.sharma@odoo.com',
    password: 'Employee123'
  });
  
  const employeeToken = signInResponse.data.access;
  const employeeApi = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${employeeToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Get balances
  const timeoffData = await employeeApi.get('/timeoff/me/');
  console.log('Balances:', timeoffData.data.balances);
  
  // Find PAID type
  const paidBalance = timeoffData.data.balances.find(b => b.type_code === 'PAID');
  
  // Create request
  const createResponse = await employeeApi.post('/timeoff/me/', {
    timeoff_type: paidBalance.id,  // Note: This is balance ID, need type ID
    start_date: '2026-08-01',
    end_date: '2026-08-05'
  });
  console.log('Created request:', createResponse.data);
  
  // Admin approves
  const adminSignIn = await axios.post(`${BASE_URL}/auth/signin/`, {
    login_identifier: 'admin@odoo.com',
    password: 'AdminPass123'
  });
  
  const adminToken = adminSignIn.data.access;
  const adminApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  const requestId = createResponse.data.request.id;
  const approveResponse = await adminApi.post(`/timeoff/admin/${requestId}/approve/`);
  console.log('Approval result:', approveResponse.data);
}

testTimeOff().catch(console.error);
```
