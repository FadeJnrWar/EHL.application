# Eagle HMO - Complete User Journey Stories

## Overview
This document tells the complete story of how users interact with the Eagle HMO system, showing what happens at each point, how components link together, and the full flow from start to finish.

---

# STORY 1: HR MANAGER ENROLLS COMPANY EMPLOYEES (BULK ENROLLMENT)

## Characters
- **Chioma** - HR Manager at Zenith Bank
- **System** - Eagle HMO Platform

## The Journey

### Act 1: Getting Ready
**What Happens:**
1. Chioma opens her computer and navigates to `https://eaglehmo.com`
2. The system loads → `App.tsx` initializes
3. Three contexts wrap around everything:
   - `AuthProvider` checks localStorage for existing session → None found
   - `NotificationProvider` initializes notification system
   - `OfflineProvider` checks internet connection → Online
4. Router sees no user session → Redirects to `/login`

**Screen:** Login Page (`src/pages/Login.tsx`)
- Shows Eagle HMO logo
- Email and password fields
- "Login" button

### Act 2: Authentication
**What Happens:**
1. Chioma enters:
   - Email: `chioma.okafor@zenithbank.com`
   - Password: `enroll123`
2. Clicks "Login" button
3. `Login.tsx` calls `AuthContext.login(email, password)`
4. `AuthContext.tsx` does:
   - Shows loading spinner
   - Searches user database for matching credentials
   - Finds: Chioma Okafor, Role: Enrollment Officer, Department: Enrollment
   - Creates user object with permissions: ['enrollment', 'all']
   - Stores user in localStorage
   - Updates app state with user
5. Router sees authenticated user with 'enrollment' permission
6. Redirects to `/` (Dashboard)

**Link:** `AuthContext.login()` → User State → Router → Dashboard

### Act 3: Arriving at Dashboard
**What Happens:**
1. Router renders `Layout` component (`src/components/Layout/Layout.tsx`)
2. Layout has three parts:
   - **Sidebar** (left): Shows navigation menu
   - **Header** (top): Shows user info and notifications
   - **Main Content** (center): Shows Dashboard

**Sidebar** (`src/components/Layout/Sidebar.tsx`):
- Reads user permissions from `AuthContext`
- Filters menu to show only allowed items
- Chioma sees:
  ```
  ✓ Dashboard
  ✓ Enrollment
    - Member Registration
    - Plan Management
    - Enrollment Management ← This is what she needs
  ```
- Other sections are hidden (no permission)

**Header** (`src/components/Layout/Header.tsx`):
- Shows: "Enrollment Portal"
- Shows: Chioma's name and role
- Shows: Notification bell (0 unread)
- Shows: Offline status button (Online - green)
- Shows: Settings and Logout buttons

**Dashboard** (`src/pages/Dashboard.tsx`):
- Detects user department: "Enrollment"
- Shows Enrollment Dashboard with 4 stat cards:
  1. New Enrollments: 45 (+23%)
  2. Plan Renewals: 123 (+8%)
  3. Pending Applications: 12 (-5)
  4. Conversion Rate: 87% (+3%)
- Shows Recent Activity feed
- Shows Quick Actions

**Link:** Layout → Sidebar (filters by permission) → Dashboard (customized by role)

### Act 4: Navigating to Enrollment Management
**What Happens:**
1. Chioma clicks on "Enrollment" in sidebar → Section expands
2. She clicks "Enrollment Management"
3. Router navigates to `/enrollment/management`
4. `Layout` stays (Sidebar + Header remain)
5. Main content area loads `EnrollmentManagement` page

**Screen:** Enrollment Management (`src/pages/EnrollmentManagement.tsx`)
- Shows page title: "Enrollment Management"
- Shows 4 stat cards:
  1. Total Enrollees: 3,247
  2. Active: 3,100 (green)
  3. Pending Validation: 89 (yellow)
  4. Inactive: 58 (red)
- Shows 5 tabs:
  - Search & Manage
  - Human Validation
  - **Bulk Upload** ← She clicks this
  - Benefits Upload
  - Generate E-Cards
- Shows "Bulk Upload" button (top right)

**Link:** Sidebar Click → Router → EnrollmentManagement Page

### Act 5: Opening Bulk Upload
**What Happens:**
1. Chioma clicks "Bulk Upload" tab
2. Screen shows:
   - Upload icon
   - Title: "Bulk Enrollee Upload"
   - Description: "Upload multiple enrollees via CSV file with auto-generated IDs"
   - Blue info box with features:
     * Auto-generated Enrollment IDs (ENR-YYYY-####)
     * Auto-generated e-IDs for digital cards
     * Organized by client/company
     * Real-time validation and error reporting
   - Big blue "Start Bulk Upload" button

3. Chioma clicks "Start Bulk Upload" button
4. Modal opens: `BulkUploadModal` component

**Link:** Tab Click → State Change → BulkUploadModal Component

### Act 6: The Bulk Upload Process
**Screen:** Bulk Upload Modal (`src/components/Enrollment/BulkUploadModal.tsx`)

**Step 1: Select Company**
1. Modal shows dropdown: "Select Client/Company"
2. Chioma clicks dropdown
3. System queries Supabase database:
   ```sql
   SELECT * FROM clients ORDER BY name
   ```
4. Returns list:
   - Zenith Bank
   - NNPC
   - Dangote Group
   - First Bank
   - etc.
5. Chioma selects "Zenith Bank"
6. System stores: `selectedClientId = "uuid-zenith-bank"`

**Step 2: Select CSV File**
1. Chioma clicks "Click to select file or drag and drop"
2. File picker opens
3. She selects: `zenith_new_employees_march_2025.csv`
4. File details show:
   - Filename: zenith_new_employees_march_2025.csv
   - Size: 245 KB
   - Rows: 150 employees

**Step 3: CSV Parsing**
System reads CSV:
```csv
name,nhia_number,bvn,gender,age,date_of_birth,phone,email,address,plan,effective_date,expiration_date
Adebayo Johnson,NHIA-123456,22334455667,Male,32,1993-03-15,08012345678,adebayo.j@zenithbank.com,"12 Marina St, Lagos",Gold,2025-04-01,2026-03-31
Fatima Ibrahim,NHIA-234567,33445566778,Female,28,1997-06-22,08023456789,fatima.i@zenithbank.com,"45 Ahmadu Bello Way, Abuja",Silver,2025-04-01,2026-03-31
...150 more rows
```

System validates each row:
- ✓ All required fields present
- ✓ Email format valid
- ✓ Phone format valid
- ✓ Date format valid
- ✓ Plan is Bronze/Silver/Gold

**Step 4: ID Generation**
For EACH enrollee, system does:

**a) Get Next Enrollment Number:**
```sql
SELECT enrollment_id FROM enrollees
WHERE enrollment_id LIKE 'ENR-2025-%'
ORDER BY enrollment_id DESC
LIMIT 1
```
Returns: `ENR-2025-3247`
Next number: `ENR-2025-3248`

**b) Generate e-ID:**
Random 10-character alphanumeric: `A7KF9X2M1P`

**c) Prepare Data:**
```javascript
{
  enrollment_id: "ENR-2025-3248",
  e_id: "A7KF9X2M1P",
  client_id: "uuid-zenith-bank",
  name: "Adebayo Johnson",
  nhia_number: "NHIA-123456",
  bvn: "22334455667",
  gender: "Male",
  age: 32,
  date_of_birth: "1993-03-15",
  phone: "08012345678",
  email: "adebayo.j@zenithbank.com",
  address: "12 Marina St, Lagos",
  plan: "Gold",
  status: "pending",
  effective_date: "2025-04-01",
  expiration_date: "2026-03-31",
  validation_status: "pending",
  created_at: "2025-10-23T10:30:00Z"
}
```

Repeat for all 150 enrollees → IDs ENR-2025-3248 to ENR-2025-3397

**Step 5: Database Insert**
System executes:
```sql
INSERT INTO enrollees (
  enrollment_id, e_id, client_id, name, nhia_number,
  bvn, gender, age, date_of_birth, phone, email,
  address, plan, status, effective_date, expiration_date,
  validation_status
) VALUES
  (...enrollee 1...),
  (...enrollee 2...),
  ...
  (...enrollee 150...)
```

Database triggers automatically run (in `supabase/migrations/...`):
- ✓ Sets created_at timestamp
- ✓ Sets updated_at timestamp
- ✓ Validates foreign keys

**Step 6: Track Upload**
System inserts to bulk_uploads table:
```sql
INSERT INTO bulk_uploads (
  filename, client_id, uploaded_by,
  record_count, success_count, error_count,
  status
) VALUES (
  'zenith_new_employees_march_2025.csv',
  'uuid-zenith-bank',
  'Chioma Okafor',
  150,
  150,
  0,
  'completed'
)
```

**Step 7: Show Results**
Modal shows:
```
✓ Upload Successful!

Summary:
- Total Records: 150
- Successfully Uploaded: 150
- Errors: 0

Generated Enrollment IDs: ENR-2025-3248 to ENR-2025-3397

All enrollees are now in PENDING status and require human validation.
```

"Close" button appears

**Link:** File Upload → Parse → Validate → Generate IDs → Database Insert → Results

### Act 7: Back to Enrollment Management
**What Happens:**
1. Chioma clicks "Close" on modal
2. Modal closes
3. `EnrollmentManagement` page calls `loadEnrollees()` to refresh data
4. New query to database:
   ```sql
   SELECT enrollees.*, clients.name as client_name
   FROM enrollees
   LEFT JOIN clients ON enrollees.client_id = clients.id
   ORDER BY created_at DESC
   ```
5. Stat cards update:
   - Total Enrollees: 3,397 (was 3,247, +150)
   - Active: 3,100 (unchanged)
   - Pending Validation: 239 (was 89, +150)
   - Inactive: 58 (unchanged)

6. Chioma sees the "Search & Manage" tab with new enrollees at the top
7. All 150 new enrollees show:
   - Status: PENDING (yellow badge)
   - Validation: PENDING (yellow badge)

**Link:** Modal Close → Refresh Data → Updated Display

### Act 8: The Validation Process
**What Happens Next:**
1. Chioma clicks "Human Validation" tab
2. System filters: `WHERE validation_status = 'pending'`
3. Shows 239 enrollees needing validation
4. Each enrollee card shows:
   - Name: Adebayo Johnson
   - Enrollment ID: ENR-2025-3248
   - Company: Zenith Bank
   - Details: Male, 32y • Gold Plan
   - Button: "Review & Validate"

**The Validation Flow:**
1. Chioma clicks "Review & Validate" on first enrollee
2. Validation form modal opens showing ALL data:
   ```
   Validate Enrollee
   Adebayo Johnson (ENR-2025-3248)

   Left Column:
   - NHIA: NHIA-123456
   - BVN: 22334455667
   - e-ID: A7KF9X2M1P

   Right Column:
   - Phone: 08012345678
   - Email: adebayo.j@zenithbank.com
   - Plan: Gold

   Validation Notes: [text area]

   [Cancel] [Reject] [Approve]
   ```

3. Chioma verifies:
   - ✓ NHIA number format correct
   - ✓ BVN is 11 digits
   - ✓ e-ID is unique
   - ✓ Email format valid
   - ✓ Phone format valid

4. She types in notes: "All details verified. Documents checked. Approved for enrollment."

5. She clicks "Approve"

6. System executes:
   ```sql
   UPDATE enrollees
   SET
     validation_status = 'approved',
     status = 'active',
     validated_by = 'Chioma Okafor',
     validation_date = NOW(),
     validation_notes = 'All details verified. Documents checked. Approved for enrollment.'
   WHERE id = 'uuid-adebayo'
   ```

7. Modal closes
8. List refreshes → Adebayo removed from pending list (now 238 pending)
9. Stat cards update:
   - Active: 3,101 (was 3,100, +1)
   - Pending Validation: 238 (was 239, -1)

10. Notification appears: "Enrollee approved successfully!"

**Link:** Validation Tab → Review → Approve → Database Update → UI Refresh

### Act 9: Generating E-Cards
**What Happens:**
1. After validating several enrollees, Chioma switches to "Generate E-Cards" tab
2. Shows list of all APPROVED enrollees
3. She selects 20 newly approved enrollees (checkboxes)
4. Clicks "Generate E-Cards" button
5. System for each enrollee:
   - Creates digital card with:
     * Name
     * Enrollment ID
     * e-ID (QR code)
     * Photo placeholder
     * Plan type
     * Valid dates
   - Sends to enrollee email
   - Updates status: e_card_generated = true

6. Alert shows: "20 E-Cards generated and sent to enrollees!"

**Link:** Approval → E-Card Generation → Email Delivery

---

# STORY 2: ENROLLEE CHECKS ELIGIBILITY AT HOSPITAL

## Characters
- **Adebayo Johnson** - Newly enrolled Zenith Bank employee
- **Nurse Amaka** - Registration nurse at Lagos University Teaching Hospital (LUTH)

## The Journey

### Act 1: Enrollee Arrives at Hospital
**What Happens:**
1. Adebayo feels unwell, goes to LUTH
2. At registration desk, Nurse Amaka asks for insurance details
3. Adebayo shows:
   - Physical E-card (printed)
   - OR opens Eagle HMO app on phone → Shows digital e-card
4. E-card displays:
   - Name: Adebayo Johnson
   - Enrollment ID: ENR-2025-3248
   - e-ID: A7KF9X2M1P
   - Plan: Gold
   - Company: Zenith Bank
   - Valid: Apr 1, 2025 - Mar 31, 2026

### Act 2: Nurse Logs Into System
**What Happens:**
1. Nurse Amaka opens Eagle HMO system on hospital computer
2. Goes to `https://eaglehmo.com/login`
3. Enters credentials:
   - Email: `nurse.amaka@luth.edu.ng`
   - Password: `luth2025`
4. System authenticates via `AuthContext`
5. Finds: Role = Call Center Representative, Department = Call Center
6. Permissions: ['eligibility', 'diagnoses', 'complaints', 'approvals', 'benefits']
7. Redirects to Dashboard

**Dashboard Shows:**
- PA Codes Generated: 234 (+12.1%)
- Eligibility Checks: 456 (+8.5%)
- Pending Complaints: 23
- Approvals Today: 89

### Act 3: Checking Eligibility
**What Happens:**
1. Nurse Amaka clicks "Eligibility" in sidebar (Call Center section)
2. Router navigates to `/eligibility`
3. Page loads: `Eligibility.tsx`

**Screen Shows:**
- Left panel: Search form (`EligibilitySearch` component)
- Right panel: Results area (`EligibilityResults` component)

4. Nurse enters in search form:
   - Enrollee ID: `ENR-2025-3248`
   - (Name field optional, left empty)
5. Clicks "Search"

**System Does:**
```javascript
// In Eligibility.tsx → handleSearch()
setTimeout(() => {
  // Search enrollee database
  let enrollee = findEnrolleeById('ENR-2025-3248');

  // Found: Adebayo Johnson
  if (enrollee) {
    // Check status
    if (enrollee.status === 'active') {
      // Calculate benefits based on Gold plan
      setSearchResults({
        enrolleeId: 'ENR-2025-3248',
        name: 'Adebayo Johnson',
        gender: 'Male',
        age: 32,
        dateOfBirth: '1993-03-15',
        status: 'active', // ← Key check!
        plan: 'Gold Plan',
        company: 'Zenith Bank',
        effectiveDate: '2025-04-01',
        expirationDate: '2026-03-31',
        phone: '08012345678',
        email: 'adebayo.j@zenithbank.com',
        // Gold plan benefits
        copay: '₦1,000',
        deductible: '₦5,000',
        remainingDeductible: '₦5,000', // Not used yet
        benefitsUsed: '₦0', // New enrollee
        benefitsRemaining: '₦500,000' // Full Gold limit
      });
    } else {
      // If status = 'inactive' or 'pending'
      setSearchResults(null);
      alert('Enrollee not active. Please contact HMO.');
    }
  }
}, 500);
```

**Results Display:** (`EligibilityResults` component)
```
✓ ACTIVE ENROLLEE

Enrollee Information:
Name: Adebayo Johnson
ID: ENR-2025-3248
Gender: Male
Age: 32
Date of Birth: Mar 15, 1993
Status: [ACTIVE - Green Badge]

Plan Information:
Plan: Gold Plan
Company: Zenith Bank
Effective: Apr 1, 2025
Expiration: Mar 31, 2026

Contact Information:
Phone: 08012345678
Email: adebayo.j@zenithbank.com

Benefit Details:
Copay: ₦1,000
Deductible: ₦5,000 / ₦5,000 remaining
Benefits Used: ₦0
Benefits Remaining: ₦500,000
```

6. Nurse Amaka sees: ✓ Active status, ✓ Valid coverage, ✓ Gold plan
7. She tells Adebayo: "You're covered! Please proceed to see the doctor."

**Link:** Login → Eligibility Page → Search → Database Query → Results Display

### Act 4: Doctor Diagnoses and Needs Pre-Authorization
**What Happens:**
1. Doctor examines Adebayo
2. Diagnosis: Acute Appendicitis (ICD-10: K35.80)
3. Treatment needed: Emergency appendectomy surgery
4. This requires Pre-Authorization (PA) code from HMO

### Act 5: Generating PA Code
**What Happens:**
1. Nurse Amaka clicks "Diagnoses & PA" in sidebar
2. Router navigates to `/diagnoses`
3. Page loads: `Diagnoses.tsx`
4. She clicks "Generate PA Code" tab
5. Form appears: `PACodeGenerator` component

**Form Filling:**
```
Generate Pre-Authorization Code

Enrollee ID: ENR-2025-3248 [Auto-fills name after blur]
Enrollee Name: Adebayo Johnson [Auto-populated]

Diagnosis: Acute Appendicitis
ICD-10 Code: K35.80

Provider: Lagos University Teaching Hospital
Specialty: General Surgery

Proposed Treatment: Emergency Appendectomy
Estimated Cost: ₦250,000

Urgency: [Emergency] ← Selected

Medical Justification:
"Patient presents with acute abdominal pain, fever, and elevated WBC.
Clinical diagnosis of acute appendicitis confirmed by CT scan.
Emergency surgical intervention required within 24 hours."

[Cancel] [Generate PA Code]
```

6. Nurse clicks "Generate PA Code"

**System Process:**
```javascript
// In PACodeGenerator component
const handleSubmit = async () => {
  // 1. Validate enrollee is active
  if (enrollee.status !== 'active') {
    alert('Enrollee not active');
    return;
  }

  // 2. Check benefit coverage
  if (enrollee.benefitsRemaining < 250000) {
    alert('Insufficient benefit balance');
    return;
  }

  // 3. Validate ICD-10 code
  const valid = await validateICD10('K35.80');
  if (!valid) {
    alert('Invalid ICD-10 code');
    return;
  }

  // 4. Generate PA code
  const paCode = generatePACode(); // Returns: "PA-2025-0156"

  // 5. Save to database
  await supabase.from('pre_authorizations').insert({
    pa_code: 'PA-2025-0156',
    enrollee_id: 'ENR-2025-3248',
    diagnosis: 'Acute Appendicitis',
    icd10_code: 'K35.80',
    provider: 'LUTH',
    treatment: 'Emergency Appendectomy',
    estimated_cost: 250000,
    urgency: 'emergency',
    status: 'approved',
    valid_from: new Date(),
    valid_to: new Date(Date.now() + 7*24*60*60*1000), // 7 days
    generated_by: 'Nurse Amaka',
    generated_at: new Date()
  });

  // 6. Send notification to enrollee
  NotificationContext.addNotification({
    type: 'success',
    title: 'PA Code Generated',
    message: `PA-2025-0156 for appendectomy approved`
  });

  // 7. Show success
  alert(`PA Code Generated: PA-2025-0156\nValid for 7 days`);
};
```

**PA Code Details Generated:**
```
✓ PA Code Generated Successfully!

PA Code: PA-2025-0156
Enrollee: Adebayo Johnson (ENR-2025-3248)
Diagnosis: Acute Appendicitis (K35.80)
Treatment: Emergency Appendectomy
Provider: Lagos University Teaching Hospital
Estimated Cost: ₦250,000
Valid From: Oct 23, 2025
Valid To: Oct 30, 2025 (7 days)
Status: APPROVED

This PA code authorizes the specified treatment.
Provider can proceed with surgery.
```

7. PA code added to enrollee's record
8. Notification sent to Adebayo's email and phone

**Link:** Diagnosis → PA Generation → Database Insert → Notification

---

# STORY 3: HOSPITAL SUBMITS CLAIM AFTER SURGERY

## Characters
- **Dr. Okonkwo** - Surgeon at LUTH
- **Provider Portal** - LUTH's access to submit claims
- **Emmanuel Onifade** - Claims Adjudicator at Eagle HMO
- **Dr. Owolabi** - Medical Director at Eagle HMO

## The Journey

### Act 1: Surgery Completed
**What Happens:**
1. Adebayo's appendectomy performed successfully
2. Hospital stay: 3 days
3. Discharged in good condition
4. Total hospital bill: ₦280,000 (slightly over estimate)
5. LUTH billing department prepares to submit claim

### Act 2: Provider Logs Into Portal
**What Happens:**
1. LUTH billing officer opens `https://eaglehmo.com/provider`
2. Enters credentials:
   - Email: `billing@luth.edu.ng`
   - Password: `luth_billing_2025`
3. System authenticates
4. Role: Provider, Permissions: ['provider-portal']
5. Loads: `ProviderPortal.tsx`

**Provider Portal Dashboard Shows:**
```
Welcome, Lagos University Teaching Hospital

Quick Stats:
- Pending Claims: 23
- Claims This Month: 156
- Approval Rate: 94%
- Avg Payment Time: 7 days

Menu:
→ Eligibility Verification
→ Submit Claim ← Click here
→ Claim Status
→ Payment History
```

### Act 3: Submitting the Claim
**What Happens:**
1. Billing officer clicks "Submit Claim"
2. Claim form appears

**Claim Form:**
```
Submit New Claim

Enrollee Details:
Enrollment ID: ENR-2025-3248 [Search]
→ After search, auto-fills:
  Name: Adebayo Johnson
  Plan: Gold
  Status: Active ✓

PA Code: PA-2025-0156 [Validate]
→ After validation:
  Diagnosis: Acute Appendicitis (K35.80)
  Authorized Treatment: Emergency Appendectomy
  Valid Until: Oct 30, 2025 ✓

Service Details:
Date of Service: Oct 23, 2025
Procedure Code: CPT-44950 (Appendectomy)
ICD-10 Code: K35.80 (Acute Appendicitis)

Services Provided:
☑ Emergency Surgery: ₦180,000
☑ Hospital Stay (3 days): ₦60,000
☑ Medications: ₦15,000
☑ Laboratory Tests: ₦10,000
☑ Anesthesia: ₦15,000

Total Claimed: ₦280,000

Supporting Documents:
[Upload] Surgical Report ✓
[Upload] Hospital Bill ✓
[Upload] Discharge Summary ✓
[Upload] Lab Results ✓

Provider Notes:
"Emergency appendectomy performed under PA-2025-0156.
Patient recovered well, discharged after 3 days.
All services rendered within approved treatment plan."

[Cancel] [Submit Claim]
```

3. Officer clicks "Submit Claim"

**System Process:**
```javascript
// In ProviderPortal → handleClaimSubmit()
const submitClaim = async (claimData) => {
  // 1. Validate PA code
  const pa = await validatePACode('PA-2025-0156');
  if (!pa || pa.status !== 'approved') {
    alert('Invalid or expired PA code');
    return;
  }

  // 2. Verify enrollee still active
  const enrollee = await getEnrollee('ENR-2025-3248');
  if (enrollee.status !== 'active') {
    alert('Enrollee no longer active');
    return;
  }

  // 3. Validate ICD-10 and CPT codes
  const icdValid = await validateICD10('K35.80');
  const cptValid = await validateCPT('44950');
  if (!icdValid || !cptValid) {
    alert('Invalid medical codes');
    return;
  }

  // 4. Generate claim ID
  const claimId = generateClaimID(); // Returns: "CLM-2025-0789"

  // 5. Insert claim into database
  await supabase.from('claims').insert({
    claim_id: 'CLM-2025-0789',
    enrollee_id: 'ENR-2025-3248',
    provider_id: 'PROV-LUTH-001',
    pa_code: 'PA-2025-0156',
    service_date: '2025-10-23',
    diagnosis_code: 'K35.80',
    procedure_code: 'CPT-44950',
    amount_claimed: 280000,
    status: 'pending',
    submitted_by: 'billing@luth.edu.ng',
    submitted_at: new Date(),
    // Store itemized services
    services: [
      {item: 'Emergency Surgery', amount: 180000},
      {item: 'Hospital Stay (3 days)', amount: 60000},
      {item: 'Medications', amount: 15000},
      {item: 'Laboratory Tests', amount: 10000},
      {item: 'Anesthesia', amount: 15000}
    ]
  });

  // 6. Upload supporting documents to storage
  await uploadDocuments('CLM-2025-0789', documents);

  // 7. Create notification for claims department
  await supabase.from('notifications').insert({
    recipient: 'claims_team',
    type: 'new_claim',
    title: 'New Claim Submitted',
    message: 'CLM-2025-0789 from LUTH requires review',
    claim_id: 'CLM-2025-0789'
  });

  // 8. Send confirmation to provider
  alert('Claim submitted successfully!\nClaim ID: CLM-2025-0789');
};
```

**Success Screen:**
```
✓ Claim Submitted Successfully!

Claim ID: CLM-2025-0789
Enrollee: Adebayo Johnson (ENR-2025-3248)
Amount Claimed: ₦280,000
Status: Pending Review

Your claim has been submitted to Eagle HMO Claims Department.
Expected review time: 2-3 business days.
You will receive email notification when claim status changes.

Track this claim: [View Status]
```

**Link:** Provider Portal → Claim Form → Validation → Database Insert → Notification

### Act 4: Claims Adjudicator Reviews (Initial Vetting)
**What Happens:**

**Next Morning at Eagle HMO:**
1. Emmanuel Onifade (Claims Adjudicator) logs in
2. Dashboard shows: "Pending Vetting: 68" (was 67 yesterday +1)
3. Red notification badge on header: "1 new notification"
4. Clicks notification bell

**Notification Panel:**
```
🔔 Notifications (1 unread)

NEW - 5 minutes ago
Title: New Claim Submitted
Message: CLM-2025-0789 from LUTH requires review
[View Claim]
```

5. He clicks "View Claim" → Navigates to `/claims`
6. Page loads: `Claims.tsx` → Shows `ClaimsQueue` component

**Claims Queue Screen:**
```
Claims Processing
[Export Claims]

Stats Bar:
Pending Claims: 68 | Approved Today: 0 | Total Value: ₦4.2M | Avg Time: 2.3 hrs

Tabs:
[Claims Queue] [Analytics]

Filters:
Status: [Pending ▼] Adjudicator: [All ▼] Provider: [All ▼] Date: [7 days ▼]

Claims Table:
┌──────────────┬────────────┬──────────────────┬──────────┬──────────┬────────┐
│ Claim ID     │ Date       │ Provider         │ Enrollee │ Amount   │ Status │
├──────────────┼────────────┼──────────────────┼──────────┼──────────┼────────┤
│ CLM-2025-0789│ Oct 23     │ LUTH             │ ENR-3248 │ ₦280,000 │ [PENDING]│ → NEW!
│ CLM-2025-0788│ Oct 22     │ First Clinic     │ ENR-3101 │ ₦15,000  │ [PENDING]│
│ ...          │ ...        │ ...              │ ...      │ ...      │ ...     │
└──────────────┴────────────┴──────────────────┴──────────┴──────────┴────────┘
```

### Act 5: Detailed Claim Review
**What Happens:**
1. Emmanuel clicks on CLM-2025-0789 row
2. Modal opens with full claim details

**Claim Review Modal:**
```
Claim Details - CLM-2025-0789

ENROLLEE INFORMATION:
Name: Adebayo Johnson
ID: ENR-2025-3248
Plan: Gold Plan
Company: Zenith Bank
Status: ACTIVE ✓
Benefits Remaining: ₦500,000 ✓

PROVIDER INFORMATION:
Name: Lagos University Teaching Hospital
Provider ID: PROV-LUTH-001
Tier: 1 (Primary)
Status: Active ✓
Contract Valid: Yes ✓

PRE-AUTHORIZATION:
PA Code: PA-2025-0156
Status: Approved ✓
Valid Until: Oct 30, 2025 ✓
Authorized Amount: ₦250,000
Actual Claimed: ₦280,000 [⚠️ Over by ₦30,000]

MEDICAL INFORMATION:
Diagnosis: Acute Appendicitis
ICD-10: K35.80 ✓ Valid code
Procedure: Emergency Appendectomy
CPT Code: CPT-44950 ✓ Valid code
Service Date: Oct 23, 2025

ITEMIZED SERVICES:
1. Emergency Surgery      ₦180,000
2. Hospital Stay (3 days) ₦60,000
3. Medications            ₦15,000
4. Laboratory Tests       ₦10,000
5. Anesthesia            ₦15,000
Total:                   ₦280,000

SUPPORTING DOCUMENTS:
📄 Surgical Report ✓
📄 Hospital Bill ✓
📄 Discharge Summary ✓
📄 Lab Results ✓

VALIDATION CHECKS:
✓ Enrollee active
✓ Provider in network
✓ PA code valid
✓ ICD-10 code valid
✓ CPT code valid
✓ Documents complete
⚠️ Amount exceeds PA by ₦30,000

ADJUDICATOR NOTES:
[Text area for notes]

ACTIONS:
[Approve] [Deny] [Forward to Medical Director] [Request More Info]
```

**Emmanuel's Review Process:**
```javascript
// He checks each item:

1. ✓ Enrollee eligibility confirmed
   - Status: Active
   - Plan: Gold (high coverage)
   - Benefits available: ₦500,000

2. ✓ Provider verification
   - LUTH is Tier 1 provider
   - Contract active and valid
   - In good standing

3. ✓ PA code validation
   - PA-2025-0156 approved
   - Diagnosis matches (K35.80)
   - Still valid (within 7 days)

4. ✓ Medical code validation
   - ICD-10 K35.80: Valid diagnosis code
   - CPT-44950: Standard appendectomy code
   - Codes match service provided

5. ✓ Documents review
   - Surgical report: Complete
   - Hospital bill: Itemized correctly
   - Discharge summary: Patient recovered well
   - Lab results: Support diagnosis

6. ⚠️ Amount discrepancy
   - PA authorized: ₦250,000
   - Claim amount: ₦280,000
   - Difference: ₦30,000 (12% over)
   - Reason: Longer hospital stay (3 days vs 2 estimated)
```

**Decision Point:**
Emmanuel thinks:
- "Claim is legitimate and well-documented"
- "Amount variance is reasonable (extended recovery)"
- "But exceeds PA by 12% - needs medical director approval"
- "Gold plan has sufficient benefits"

### Act 6: Forward to Medical Director
**What Happens:**
1. Emmanuel types in Adjudicator Notes:
   ```
   Initial vetting completed:
   - All documentation complete and valid
   - Enrollee has active Gold coverage with ₦500K benefits
   - PA code approved and valid
   - Medical codes verified (ICD-10: K35.80, CPT: 44950)
   - LUTH is Tier 1 provider in good standing

   ISSUE: Claim amount (₦280K) exceeds PA authorization (₦250K) by ₦30K
   REASON: Extended hospital stay (3 days vs 2 days estimated)
   RECOMMENDATION: Approve. Variance justified by medical necessity.

   Forwarding to Medical Director for high-value review.
   ```

2. Clicks "Forward to Medical Director"

**System Process:**
```javascript
// In ClaimsQueue component
const forwardToMedical = async () => {
  // Update claim status
  await supabase.from('claims').update({
    status: 'medical_review',
    adjudicator: 'Emmanuel Onifade',
    adjudicator_notes: notes,
    adjudicated_at: new Date(),
    assigned_to: 'Dr. Owolabi Adebayo'
  }).eq('claim_id', 'CLM-2025-0789');

  // Create notification for Medical Director
  await supabase.from('notifications').insert({
    recipient: 'dr.owolabi@eaglehmo.com',
    type: 'medical_review_needed',
    title: 'Claim Requires Medical Review',
    message: 'CLM-2025-0789 forwarded by Emmanuel. Amount variance.',
    claim_id: 'CLM-2025-0789',
    priority: 'normal'
  });

  // Log to audit trail
  await supabase.from('audit_trail').insert({
    action: 'claim_forwarded',
    claim_id: 'CLM-2025-0789',
    performed_by: 'Emmanuel Onifade',
    details: 'Forwarded to Medical Director for high-value review',
    timestamp: new Date()
  });

  alert('Claim forwarded to Medical Director for review');
};
```

3. Emmanuel's dashboard updates: "Forwarded to Medical: 13" (+1)
4. Claim removed from his pending queue

**Link:** Claim Review → Validation → Forward → Database Update → Notification

### Act 7: Medical Director Reviews
**What Happens:**

**That Afternoon:**
1. Dr. Owolabi Adebayo logs in
2. Dashboard shows: "Pending Medical Review: 24" (+1)
3. Notification: "CLM-2025-0789 forwarded by Emmanuel"
4. He clicks notification → Opens claim

**Medical Director View:**
```
Medical Review - CLM-2025-0789

[All previous information displayed...]

ADJUDICATOR ASSESSMENT (Emmanuel Onifade):
Initial vetting completed - all checks passed.
Issue: ₦30K over PA due to extended stay.
Recommendation: Approve - medically justified.

CLINICAL REVIEW:
[Pulls up medical documents]

Surgical Report Review:
- Emergency appendectomy performed
- Complicated by localized peritonitis
- Required additional observation
- No complications post-op

Hospital Stay Justification:
Day 1: Surgery + immediate post-op monitoring
Day 2: IV antibiotics, pain management
Day 3: Transition to oral meds, monitored before discharge
→ 3-day stay medically appropriate for complicated case

Cost Breakdown Review:
- Surgery cost: ₦180K (standard for emergency)
- Daily room rate: ₦20K × 3 = ₦60K (reasonable)
- Medications: ₦15K (IV antibiotics justified)
- Labs: ₦10K (standard post-op)
- Anesthesia: ₦15K (standard rate)
→ All costs within normal range

Benefits Check:
- Gold Plan limit: ₦500,000/year
- Current usage: ₦0
- This claim: ₦280,000
- Remaining: ₦220,000
→ Well within limits

MEDICAL DIRECTOR DECISION:
☑ Medical necessity confirmed
☑ Treatment appropriate for diagnosis
☑ Hospital stay duration justified
☑ Costs reasonable and customary
☑ Benefits available

Decision: APPROVE FULL AMOUNT (₦280,000)

Medical Director Notes:
[Text area]
```

2. Dr. Owolabi types:
   ```
   Medical review completed. Emergency appendectomy with localized
   peritonitis requiring extended stay fully justified. All costs
   reasonable and within acceptable range for Gold plan.
   Approve full claim amount of ₦280,000.
   ```

3. Clicks "Approve Claim"

**System Process:**
```javascript
const approveFullClaim = async () => {
  // Update claim to approved
  await supabase.from('claims').update({
    status: 'approved',
    approved_amount: 280000,
    medical_reviewer: 'Dr. Owolabi Adebayo',
    medical_review_notes: notes,
    medical_review_date: new Date(),
    approved_by: 'Dr. Owolabi Adebayo',
    approved_at: new Date()
  }).eq('claim_id', 'CLM-2025-0789');

  // Update enrollee benefits used
  await supabase.rpc('update_benefits_used', {
    enrollee_id: 'ENR-2025-3248',
    amount: 280000
  });

  // Create payment record
  await supabase.from('payments').insert({
    claim_id: 'CLM-2025-0789',
    provider_id: 'PROV-LUTH-001',
    amount: 280000,
    status: 'pending_payment',
    approved_by: 'Dr. Owolabi Adebayo',
    created_at: new Date()
  });

  // Notify provider
  await sendEmail({
    to: 'billing@luth.edu.ng',
    subject: 'Claim Approved - CLM-2025-0789',
    body: `Your claim CLM-2025-0789 has been approved for ₦280,000.
           Payment will be processed within 5-7 business days.`
  });

  // Notify enrollee
  await sendEmail({
    to: 'adebayo.j@zenithbank.com',
    subject: 'Claim Processed - Eagle HMO',
    body: `Your claim for appendectomy at LUTH has been processed.
           Amount covered: ₦280,000
           Your copay: ₦1,000 (paid at hospital)
           EOB attached.`
  });

  // Generate EOB (Explanation of Benefits)
  await generateEOB('CLM-2025-0789');

  alert('Claim approved and queued for payment');
};
```

**Link:** Medical Review → Clinical Assessment → Approval → Payment Queue → Notifications

### Act 8: Payment Processing
**What Happens:**

**Next Day - Finance Department:**
1. Finance officer logs in
2. Navigates to `/claims/payments`
3. Page loads: `PaymentProcessing.tsx`

**Payment Processing Screen:**
```
Payment Processing

Approved Claims Awaiting Payment: 34

Filters: [This Week ▼] [All Providers ▼]

Payment Batch Creation:
┌──────────────┬──────────┬─────────┬─────────────┬──────┐
│ Claim ID     │ Provider │ Amount  │ Approved    │ Pay  │
├──────────────┼──────────┼─────────┼─────────────┼──────┤
│ CLM-2025-0789│ LUTH     │ ₦280,000│ Oct 23, 2PM │ ☑    │
│ CLM-2025-0785│ LUTH     │ ₦45,000 │ Oct 22      │ ☑    │
│ CLM-2025-0780│ LUTH     │ ₦120,000│ Oct 21      │ ☑    │
│ ...          │ ...      │ ...     │ ...         │ ...  │
└──────────────┴──────────┴─────────┴─────────────┴──────┘

[Select All LUTH Claims] [Create Payment Batch]
```

2. Finance officer selects all LUTH claims (15 claims total)
3. Total: ₦3,250,000
4. Clicks "Create Payment Batch"

**System Process:**
```javascript
const createPaymentBatch = async (selectedClaims) => {
  // Generate batch ID
  const batchId = 'BATCH-2025-0045';

  // Create batch record
  await supabase.from('payment_batches').insert({
    batch_id: batchId,
    provider_id: 'PROV-LUTH-001',
    claim_count: 15,
    total_amount: 3250000,
    status: 'pending',
    created_by: 'Finance Officer',
    created_at: new Date()
  });

  // Link claims to batch
  await supabase.from('payments').update({
    batch_id: batchId,
    status: 'batched'
  }).in('claim_id', selectedClaims);

  // Generate bank transfer file
  const transferFile = generateBankFile({
    batchId: batchId,
    bankAccount: 'LUTH-Account-1234567890',
    amount: 3250000,
    currency: 'NGN'
  });

  alert('Payment batch created. Ready for bank transfer.');
};
```

5. Batch approved by Finance Manager
6. Bank transfer initiated
7. 2 days later: Payment confirmed by bank

**Final Updates:**
```javascript
// When payment confirmed
await supabase.from('payment_batches').update({
  status: 'paid',
  payment_date: new Date(),
  reference: 'BANK-REF-789456'
}).eq('batch_id', 'BATCH-2025-0045');

await supabase.from('payments').update({
  status: 'paid',
  payment_date: new Date()
}).eq('batch_id', 'BATCH-2025-0045');

// Notify LUTH
await sendEmail({
  to: 'billing@luth.edu.ng',
  subject: 'Payment Processed - Batch 0045',
  body: 'Payment of ₦3,250,000 for 15 claims has been transferred.
         Reference: BANK-REF-789456'
});
```

**Link:** Approved Claims → Batch Creation → Bank Transfer → Payment Confirmation

---

# STORY 4: ENROLLEE TRACKS CLAIM VIA ENROLLEE PORTAL

## Characters
- **Adebayo Johnson** - Recovered enrollee checking his claim

## The Journey

### Act 1: Checking Claim Status
**What Happens:**
1. Adebayo opens phone browser
2. Goes to `https://eaglehmo.com/enrollee`
3. Enters login:
   - Email: `adebayo.j@zenithbank.com`
   - Password: (set during enrollment)
4. System authenticates → Role: Enrollee
5. Loads: `EnrolleePortal.tsx`

**Enrollee Portal Dashboard:**
```
Welcome back, Adebayo Johnson

Quick Stats:
Plan: Gold Plan
Company: Zenith Bank
Benefits Used: ₦280,000 of ₦500,000
Coverage Valid Until: Mar 31, 2026

Menu:
- My Profile
- My Benefits
- Claims History ← Click here
- Find Provider
- File Complaint
```

### Act 2: Viewing Claims
1. Clicks "Claims History"
2. Shows:

```
My Claims History

Recent Claims:
┌────────────┬───────────┬──────────┬─────────┬────────┐
│ Date       │ Provider  │ Service  │ Amount  │ Status │
├────────────┼───────────┼──────────┼─────────┼────────┤
│ Oct 23     │ LUTH      │ Surgery  │ ₦280,000│ ✓ PAID │
└────────────┴───────────┴──────────┴─────────┴────────┘

[View Details] [Download EOB]
```

3. Clicks "View Details"

**Claim Details Screen:**
```
Claim Details

Claim ID: CLM-2025-0789
Date of Service: October 23, 2025
Provider: Lagos University Teaching Hospital

Diagnosis: Acute Appendicitis
Treatment: Emergency Appendectomy

Amount Billed: ₦280,000
HMO Covered: ₦280,000
Your Copay: ₦1,000 (paid at hospital)
Your Deductible: ₦0 (already met)

Claim Status: PAID ✓
Payment to Provider: October 25, 2025

Timeline:
Oct 23 10:30 AM - Claim submitted by LUTH
Oct 23 11:45 AM - Initial review completed
Oct 23 2:15 PM  - Medical review approved
Oct 25 9:00 AM  - Payment processed

[Download EOB] [Print]
```

4. He sees everything was approved and paid
5. Downloads EOB (Explanation of Benefits) PDF

**Link:** Enrollee Login → Claims History → Claim Details → EOB Download

---

# STORY 5: CALL CENTER HANDLES COMPLAINT

## Characters
- **Mrs. Adebisi** - Frustrated enrollee
- **Winifred Festus** - Call Center Representative

## The Journey

### Act 1: Enrollee Has Issue
**What Happens:**
1. Mrs. Adebisi went to a hospital
2. Hospital rejected her HMO card
3. Said she's not in the system
4. She had to pay cash: ₦25,000
5. Very upset, calls Eagle HMO hotline

### Act 2: Call Center Receives Call
**What Happens:**
1. Winifred answers: "Good morning, Eagle HMO Customer Service"
2. Mrs. Adebisi explains situation angrily
3. Winifred already logged into Eagle HMO system
4. Dashboard open

### Act 3: Checking Eligibility
**What Happens:**
1. While listening, Winifred clicks "Eligibility" in sidebar
2. Enters: Enrollee ID from Mrs. Adebisi's card
3. Searches...

**Result Shows:**
```
❌ INACTIVE ENROLLEE

Name: Mrs. Adebisi Olowokure
ID: ENR-2024-1567
Status: INACTIVE - Expired Coverage
Plan: Silver Plan (expired)
Company: Dangote Group
Expiration Date: September 30, 2025 ← Already passed!

Current Date: October 23, 2025
```

4. Winifred sees the problem immediately
5. Says: "Mrs. Adebisi, I can see the issue. Your coverage expired on September 30. Your company may need to renew."

### Act 4: Filing Complaint
**What Happens:**
1. Mrs. Adebisi still upset: "Nobody told me! I shouldn't have to pay!"
2. Winifred: "I understand your frustration. Let me file a complaint for you."
3. Clicks "Complaints" in sidebar
4. Page loads: `Complaints.tsx`
5. Clicks "Submit Complaint" tab
6. Form opens: `ComplaintForm` component

**Filling Complaint:**
```
Submit Complaint

Complaint Type: [Billing ▼]

Priority: [High ▼]

Affected Party:
Name: Mrs. Adebisi Olowokure
ID: ENR-2024-1567
Contact: 08023456789

Complaint Description:
"Enrollee's coverage expired Sept 30, but she was not notified.
She attempted to use HMO at City Hospital on Oct 23 and was rejected.
Had to pay ₦25,000 out of pocket.
Requests investigation into notification failure and reimbursement."

Attachments:
[Upload] Hospital Receipt ✓

Internal Notes (visible to staff only):
"Checked system - coverage actually expired.
Possible notification failure on our end.
Needs escalation to Enrollment team for renewal check.
Consider goodwill reimbursement."

[Cancel] [Submit Complaint]
```

2. Winifred clicks "Submit Complaint"

**System Process:**
```javascript
const submitComplaint = async (complaintData) => {
  // Generate complaint ID
  const complaintId = 'COMP-2025-0234';

  // Insert to database
  await supabase.from('complaints').insert({
    complaint_id: complaintId,
    type: 'billing',
    priority: 'high',
    enrollee_id: 'ENR-2024-1567',
    enrollee_name: 'Mrs. Adebisi Olowokure',
    description: complaintData.description,
    internal_notes: complaintData.notes,
    status: 'open',
    submitted_by: 'Winifred Festus',
    assigned_to: 'Enrollment Team',
    submitted_at: new Date()
  });

  // Upload receipt
  await uploadAttachment(complaintId, receipt);

  // Notify enrollment team
  await supabase.from('notifications').insert({
    recipient: 'enrollment_team',
    type: 'complaint',
    title: 'High Priority Complaint',
    message: 'COMP-2025-0234 - Expired coverage issue',
    complaint_id: complaintId
  });

  // Send confirmation email to enrollee
  await sendEmail({
    to: 'adebisi.o@dangotegroup.com',
    subject: 'Complaint Received - Eagle HMO',
    body: `Your complaint COMP-2025-0234 has been received.
           Our team will investigate and contact you within 24 hours.`
  });

  alert('Complaint submitted: COMP-2025-0234');
};
```

3. Winifred tells Mrs. Adebisi: "I've filed complaint COMP-2025-0234. Our team will investigate within 24 hours."

**Link:** Phone Call → Eligibility Check → Complaint Form → Database Insert → Notification

### Act 5: Complaint Resolution
**What Happens Next Day:**

**Enrollment Team Member logs in:**
1. Dashboard shows: "New Complaints: 1"
2. Clicks "Complaints" in sidebar
3. Filters to "High Priority"
4. Sees COMP-2025-0234

**Investigation:**
```
Complaint Details - COMP-2025-0234

Enrollee: Mrs. Adebisi Olowokure (ENR-2024-1567)
Issue: Expired coverage, not notified, had to pay cash
Amount: ₦25,000

Investigation:
1. Check notification logs:
   - Email sent: Sept 15 (15 days before expiry) ✓
   - Email bounced: Sept 15 ❌
   - SMS sent: Sept 15 ✓
   - SMS delivered: Sept 15 ✓

2. Check company renewal status:
   - Dangote Group renewed: Oct 1 ✓
   - New enrollee list received: Oct 5 ✓
   - Mrs. Adebisi NOT on new list ❌

3. Contact Dangote HR:
   - HR confirms: Mrs. Adebisi transferred to another division
   - Should have been included but was missed
   - HR will submit update immediately

Resolution Action:
1. Reactivate Mrs. Adebisi's coverage (backdated to Oct 1)
2. Process reimbursement: ₦25,000
3. Generate new e-card
4. Update notification email (new address)

Status: RESOLVED
Resolution: Coverage reinstated, reimbursement approved
```

2. Team member updates complaint
3. System sends email to Mrs. Adebisi with apology and reimbursement notice

**Link:** Complaint → Investigation → Database Checks → Resolution → Update → Notification

---

# HOW EVERYTHING LINKS TOGETHER

## The Complete System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER LOGS IN                            │
│                           ↓                                  │
│                    AuthContext                               │
│              (Validates credentials)                         │
│                           ↓                                  │
│           ┌───────────────┴───────────────┐                 │
│           ↓                               ↓                  │
│    Staff/Provider                    Enrollee               │
│           ↓                               ↓                  │
│      Main Layout                  Enrollee Portal           │
│  (Sidebar + Header)                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CONTEXT PROVIDERS                         │
│  (Wrap entire app, available everywhere)                    │
│                                                              │
│  AuthContext ────────────── User state, login/logout        │
│  NotificationContext ────── Real-time notifications         │
│  OfflineContext ─────────── Connection status, form backup  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW LAYERS                          │
│                                                              │
│  UI Components                                              │
│       ↕                                                     │
│  Page Components                                            │
│       ↕                                                     │
│  Context APIs                                               │
│       ↕                                                     │
│  Supabase Client                                            │
│       ↕                                                     │
│  Database (PostgreSQL)                                      │
│       ↕                                                     │
│  Triggers & Functions                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  MODULE INTERCONNECTIONS                     │
│                                                              │
│  Enrollment ──→ Generates enrollees                         │
│       ↓                                                     │
│  Eligibility ──→ Checks enrollee status                     │
│       ↓                                                     │
│  Diagnoses ──→ Creates PA codes                            │
│       ↓                                                     │
│  Provider ──→ Submits claims                               │
│       ↓                                                     │
│  Claims ──→ Processes claims                               │
│       ↓                                                     │
│  Payment ──→ Pays providers                                │
│       ↓                                                     │
│  Benefits ──→ Updates usage                                │
│       ↓                                                     │
│  Complaints ──→ Resolves issues                            │
└─────────────────────────────────────────────────────────────┘
```

## Key Integration Points

### 1. Enrollment → All Modules
- **Creates**: Enrollee records with auto-generated IDs
- **Used by**:
  - Eligibility (checks status)
  - Benefits (tracks usage)
  - Claims (validates coverage)
  - Provider (verifies enrollment)

### 2. Eligibility → Diagnoses/Claims
- **Provides**: Active status confirmation
- **Enables**: PA code generation, claim submission
- **Blocks**: Inactive enrollees from services

### 3. Diagnoses → Claims
- **Creates**: PA codes
- **Required for**: High-cost procedures
- **Validates**: ICD-10 codes used in claims

### 4. Claims → Payment → Benefits
- **Flow**: Claim approved → Payment queued → Benefits updated
- **Updates**:
  - enrollee.benefits_used
  - enrollee.benefits_remaining
  - provider.payment_history

### 5. All Modules → Complaints
- **Triggers**: Any issue can generate complaint
- **Links back to**: Original transaction (claim, enrollment, etc.)
- **Resolves**: Updates source records

### 6. Offline Context → All Forms
- **Monitors**: Connection status
- **Backs up**: Form data automatically
- **Syncs**: When connection restored

### 7. Notification Context → All Actions
- **Listens**: Database changes, user actions
- **Alerts**: Real-time notifications
- **Displays**: Notification center

---

## Complete User Journey Map

```
ENROLLEE LIFECYCLE:

Registration → Validation → Activation → E-Card
     ↓            ↓            ↓           ↓
  Pending     Human Review  Active     Digital ID
     ↓            ↓            ↓           ↓
     └────────────┴────────────┴───────────┘
                      ↓
            ┌─────────┴─────────┐
            ↓                   ↓
      Eligibility          Provider
       Checks              Visits
            ↓                   ↓
        PA Codes          Treatments
            ↓                   ↓
        Approvals           Claims
            ↓                   ↓
        Benefits          Payments
         Usage              To Provider
            ↓                   ↓
        Complaints         Resolution
            ↓                   ↓
        Renewal           Continue
```

---

# SUMMARY

This system is a complete, interconnected healthcare management platform where:

1. **Every action has a consequence** - Enrollment enables eligibility, eligibility enables treatment, treatment creates claims, claims trigger payments

2. **Data flows bidirectionally** - Claims update benefits, complaints can update any module, offline mode backs up everything

3. **Context providers manage global state** - Auth, Notifications, and Offline wrap everything and are accessible anywhere

4. **Database is the single source of truth** - Supabase PostgreSQL stores everything with triggers for automation

5. **User journeys are complete** - From HR enrolling employees to enrollees receiving care to providers getting paid

6. **Real-time updates everywhere** - Notifications, dashboard stats, claim status all update immediately

The system handles the complete lifecycle of healthcare management from enrollment through claims to payment, with built-in complaint resolution, offline support, and role-based access control.
