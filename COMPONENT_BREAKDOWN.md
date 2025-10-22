# Eagle HMO - Complete Component Breakdown by Stage

## Application Architecture Overview

```
App.tsx
├── AuthProvider (Authentication State)
├── NotificationProvider (Notifications State)
├── OfflineProvider (Offline Mode State)
└── Router
    ├── Public Routes
    │   ├── /login → Login Page
    │   ├── /provider-registration → Provider Registration
    │   └── /enrollee-registration → Enrollee Registration
    │
    ├── Protected Routes (Authenticated Users)
    │   ├── /provider → Provider Portal
    │   ├── /enrollee → Enrollee Portal
    │   └── / → Layout (Sidebar + Header + Main Content)
    │       ├── Dashboard
    │       ├── Call Center Module
    │       ├── Claims Module
    │       ├── Provider Module
    │       ├── Enrollment Module
    │       ├── Finance Module
    │       ├── Underwriting Module
    │       └── Regulation Module
```

---

## STAGE 1: AUTHENTICATION & SESSION MANAGEMENT

### **Login Page** (`src/pages/Login.tsx`)
**What it does:** Entry point for all users (Staff, Providers, Enrollees)

**Internal Process:**
1. User enters email and password
2. Form validation checks for empty fields
3. Submits credentials to AuthContext
4. Loading spinner shows during authentication
5. On success: Redirects based on user role
6. On failure: Shows error message

**Components Used:**
- None (standalone page)

**Data Flow:**
- Input: Email, Password
- Process: AuthContext.login()
- Output: User session stored in localStorage
- Redirect: Dashboard, Provider Portal, or Enrollee Portal

---

### **AuthContext** (`src/contexts/AuthContext.tsx`)
**What it does:** Manages user authentication state across the entire app

**Internal Process:**
1. **On App Load:**
   - Checks localStorage for existing session
   - If found, restores user state
   - If not, shows login page

2. **On Login:**
   - Validates credentials against user database
   - Checks regular users first
   - Falls back to enrollee credentials if not found
   - Creates user object with permissions
   - Stores session in localStorage and state

3. **On Logout:**
   - Clears user state
   - Removes localStorage data
   - Forces page reload to clear cached data
   - Redirects to /login

**User Database:**
- Super Admin: Emmanuel Onifade (all permissions)
- Call Center: Winifred Festus, Ajayi Seyi (eligibility, diagnoses, complaints, approvals, benefits)
- Claims: Emmanuel Onifade, Dr. Owolabi, Olufemi (claims, providers, medical review)
- Providers: LUTH (provider-portal access)
- Enrollees: Adebayo Olumide, Fatima Abubakar (enrollee-portal access)

**Permissions System:**
- 'all' - Super Admin (access everything)
- 'eligibility' - Can check eligibility
- 'diagnoses' - Can manage diagnoses
- 'complaints' - Can handle complaints
- 'approvals' - Can approve treatments
- 'claims' - Can process claims
- 'providers' - Can manage providers
- 'provider-portal' - Provider access
- 'enrollee-portal' - Enrollee access

---

### **NotificationContext** (`src/contexts/NotificationContext.tsx`)
**What it does:** Real-time notification system for the entire app

**Internal Process:**
1. **On App Load:**
   - Initializes with 2 sample notifications
   - Tracks unread count

2. **Adding Notifications:**
   - Creates unique ID using timestamp
   - Adds to top of notification list
   - Marks as unread
   - Updates unread count badge

3. **Reading Notifications:**
   - Marks specific notification as read
   - Updates unread count
   - Maintains notification history

4. **Clearing All:**
   - Removes all notifications
   - Resets unread count

**Notification Types:**
- info: General information (blue)
- success: Successful operations (green)
- warning: Warnings (yellow)
- error: Errors (red)

---

### **OfflineContext** (`src/contexts/OfflineContext.tsx`)
**What it does:** Manages offline mode and form data backup

**Internal Process:**
1. **Connection Monitoring:**
   - Listens to browser online/offline events
   - Updates connection status in real-time
   - Tracks last online time

2. **Manual Offline Mode:**
   - User can toggle offline mode manually
   - Persists state in localStorage
   - Overrides network status

3. **Form Data Backup:**
   - saveFormData(key, data): Saves form to localStorage with timestamp
   - getFormData(key): Retrieves saved form data
   - clearFormData(key): Removes backup after successful submission
   - hasBackup(key): Checks if backup exists
   - getAllBackups(): Lists all saved forms

4. **Connection States:**
   - 'online': Network connected, manual offline disabled
   - 'offline': Network disconnected
   - 'manual-offline': User-initiated offline mode

**Backup Metadata:**
- timestamp: When backup was created
- page: Current page path
- userAgent: Browser information

---

## STAGE 2: LAYOUT & NAVIGATION

### **Layout Component** (`src/components/Layout/Layout.tsx`)
**What it does:** Main layout wrapper for all authenticated pages

**Structure:**
```
<Layout>
  <Sidebar />          ← Left navigation
  <div>
    <Header />         ← Top bar
    <main>
      <Outlet />       ← Page content renders here
    </main>
  </div>
  <NotificationCenter /> ← Notification panel
</Layout>
```

**Components Used:**
- Sidebar
- Header
- NotificationCenter

---

### **Sidebar** (`src/components/Layout/Sidebar.tsx`)
**What it does:** Role-based navigation menu

**Internal Process:**
1. **Permission Checking:**
   - Gets current user from AuthContext
   - Filters menu items based on user.permissions
   - Super Admin sees all sections
   - Other roles see only permitted sections

2. **Section Management:**
   - Tracks expanded/collapsed sections
   - Default: Call Center and Claims Management expanded
   - Toggle sections on click

3. **Navigation Items:**
   - Dashboard (always visible)
   - Call Center (5 sub-items)
   - Claims Management (4 sub-items)
   - Provider Management (3 sub-items)
   - Enrollment (3 sub-items)
   - Finance (2 sub-items)
   - Underwriting (2 sub-items)
   - Regulation (2 sub-items)
   - Offline Mode

4. **Active State:**
   - Highlights current page
   - Shows border accent on active item
   - Changes icon color

**Menu Structure:**
```
Dashboard
Call Center ▼
  ├── Eligibility
  ├── Diagnoses & PA
  ├── Complaints
  ├── Approvals
  └── Benefits
Claims Management ▼
  ├── Claims Queue
  ├── Submitted Claims
  ├── Claims Analytics
  └── Payment Processing
Provider Management ▼
  ├── Provider Directory
  ├── Contracts
  └── Performance
Enrollment ▼
  ├── Member Registration
  ├── Plan Management
  └── Enrollment Management
Finance ▼
  ├── Billing
  └── Financial Reports
Underwriting ▼
  ├── Risk Assessment
  └── Policy Management
Regulation ▼
  ├── Compliance
  └── Audit Trail
Offline Mode
```

---

### **Header** (`src/components/Layout/Header.tsx`)
**What it does:** Top navigation bar with user info and actions

**Components:**
1. **Department Portal Title:** Shows current user's department
2. **Offline Status Button:** Toggle offline mode
3. **Notification Bell:** Shows unread count with badge
4. **Settings Icon:** Access settings (placeholder)
5. **User Menu Dropdown:**
   - User name and role
   - Profile option
   - Settings option
   - Logout button

**Internal Process:**
- Manages dropdown state (open/close)
- Displays notification badge with unread count
- Calls logout function from AuthContext
- Shows user avatar with first initial

**User Menu States:**
- Closed: Shows user info and avatar
- Open: Shows full menu with options

---

### **NotificationCenter** (`src/components/Notifications/NotificationCenter.tsx`)
**What it does:** Displays system notifications

**Internal Process:**
1. Gets notifications from NotificationContext
2. Displays in reverse chronological order
3. Shows notification type icon
4. Allows marking individual as read
5. Allows clearing all notifications

**Notification Display:**
- Title and message
- Timestamp (formatted)
- Type indicator (color and icon)
- Read/unread status
- Mark as read button

---

## STAGE 3: DASHBOARD

### **Dashboard Page** (`src/pages/Dashboard.tsx`)
**What it does:** Role-based overview page

**Internal Process:**
1. **Role Detection:**
   - Gets user from AuthContext
   - Determines dashboard type based on permissions and role

2. **Dashboard Types:**
   - **Super Admin Dashboard:**
     - Active Enrollees: 12,847 (+5.2%)
     - Monthly Revenue: ₦47.3M (+15.7%)
     - Claims This Month: 3,247 (+8.3%)
     - Provider Network: 247 (+12)

   - **Medical Director Dashboard:**
     - Pending Medical Review: 23 (+5)
     - Approved Today: 45 (+12)
     - High-Value Claims: 8 (+2)
     - Avg Review Time: 1.8 hrs (-0.3 hrs)

   - **Claims Adjudicator Dashboard:**
     - Pending Vetting: 67 (+8)
     - Processed Today: 34 (+15)
     - Forwarded to Medical: 12 (+3)
     - Processing Time: 2.1 hrs (-0.4 hrs)

   - **Call Center Dashboard:**
     - PA Codes Generated: 234 (+12.1%)
     - Eligibility Checks: 456 (+8.5%)
     - Pending Complaints: 23 (-8.3%)
     - Approvals Today: 89 (+15.7%)

   - **Claims Department Dashboard:**
     - Claims Under Review: 156 (+5.2%)
     - Approved Today: 89 (+12.1%)
     - Total Value Today: ₦2.4M (+8.7%)
     - Avg Processing Time: 2.3 hrs (-0.5 hrs)

3. **Components:**
   - StatCard (4 cards with metrics)
   - RecentActivity (activity feed)
   - QuickActions (quick links)

**Components Used:**
- StatCard (x4)
- RecentActivity
- QuickActions

---

### **StatCard** (`src/components/Dashboard/StatCard.tsx`)
**What it does:** Displays a single metric with trend

**Props:**
- title: Metric name
- value: Current value
- change: Change percentage/amount
- icon: Lucide icon component
- color: Theme color (sky, green, teal, orange)

**Display:**
- Large value display
- Trend indicator (up/down arrow)
- Color-coded icon
- Animated on load

---

### **RecentActivity** (`src/components/Dashboard/RecentActivity.tsx`)
**What it does:** Shows recent system activities

**Internal Process:**
1. Displays hardcoded activity feed
2. Shows timestamp relative to current time
3. Color-codes by activity type
4. Shows user/system who performed action

**Activity Types:**
- Claim processed
- Approval granted
- New complaint
- Provider added
- Eligibility checked

---

### **QuickActions** (`src/components/Dashboard/QuickActions.tsx`)
**What it does:** Provides quick access to common tasks

**Actions:**
1. Check Eligibility → /eligibility
2. Process Claim → /claims
3. Review Approvals → /approvals
4. Add Provider → /providers

**Display:**
- Icon for each action
- Action title
- Click to navigate

---

## STAGE 4: CALL CENTER MODULE

### **Eligibility Page** (`src/pages/Eligibility.tsx`)
**What it does:** Checks enrollee eligibility and benefits

**Components:**
1. **OfflineBanner:** Shows if offline
2. **EligibilitySearch:** Search form
3. **EligibilityResults:** Display results

**Internal Process:**
1. User enters Enrollee ID or Name
2. Searches enrollee database
3. If found: Shows full eligibility details
4. If not found: Shows error alert
5. Calculates benefits based on plan and status

**Search Methods:**
- By Enrollee ID (exact match)
- By Name (partial match, case-insensitive)

**Results Displayed:**
- Personal info (name, gender, age, DOB)
- Status (active/inactive)
- Plan type and company
- Dates (effective and expiration)
- Contact info (phone, email)
- Financial details (copay, deductible, benefits used/remaining)

**Components Used:**
- EligibilitySearch
- EligibilityResults
- OfflineBanner

---

### **EligibilitySearch** (`src/components/Eligibility/EligibilitySearch.tsx`)
**What it does:** Search form for finding enrollees

**Form Fields:**
1. Enrollee ID (optional)
2. Enrollee Name (optional)

**Internal Process:**
1. User enters search criteria
2. At least one field required
3. Validates before submission
4. Calls onSearch prop with data
5. Shows loading spinner during search

**Offline Support:**
- Form works offline
- Saves backup if network fails
- Restores from backup on reload

---

### **EligibilityResults** (`src/components/Eligibility/EligibilityResults.tsx`)
**What it does:** Displays enrollee eligibility details

**Display Sections:**
1. **Enrollee Information:**
   - Name, ID, Gender, Age, DOB
   - Status badge (Active/Inactive)

2. **Plan Information:**
   - Plan type
   - Company
   - Effective date
   - Expiration date

3. **Contact Information:**
   - Phone number
   - Email address

4. **Benefit Details:**
   - Copay amount
   - Deductible (total and remaining)
   - Benefits used
   - Benefits remaining

**Status Display:**
- Active: Green badge, full benefit info
- Inactive: Red badge, "N/A" for benefits

**Empty State:**
- Shows search prompt
- Instructions for use

---

### **Diagnoses Page** (`src/pages/Diagnoses.tsx`)
**What it does:** Manages diagnoses and Pre-Authorization (PA) code generation

**Components:**
1. **DiagnosisUpload:** Upload diagnosis files
2. **PACodeGenerator:** Generate PA codes
3. **DiagnosisHistory:** View diagnosis history

**Tabs:**
1. **Upload Diagnosis:** File upload interface
2. **Generate PA Code:** PA code generator
3. **History:** Past diagnoses

**Internal Process:**
1. Provider uploads diagnosis
2. System validates ICD-10 codes
3. Generates unique PA code
4. Links to enrollee record
5. Notifies enrollee

**Components Used:**
- DiagnosisUpload
- PACodeGenerator
- DiagnosisHistory
- OfflineBanner

---

### **DiagnosisUpload** (`src/components/Diagnoses/DiagnosisUpload.tsx`)
**What it does:** Handles diagnosis file uploads

**Internal Process:**
1. User selects enrollee
2. Uploads diagnosis document
3. System extracts ICD-10 codes
4. Validates codes against database
5. Creates diagnosis record

**Supported Formats:**
- PDF
- Images (JPG, PNG)
- Documents (DOC, DOCX)

**Validation:**
- File size limit
- Format validation
- ICD-10 code validation

---

### **PACodeGenerator** (`src/components/Diagnoses/PACodeGenerator.tsx`)
**What it does:** Generates Pre-Authorization codes

**Form Fields:**
1. Enrollee ID
2. Diagnosis description
3. ICD-10 code
4. Provider
5. Urgency level

**Internal Process:**
1. Validates enrollee eligibility
2. Checks benefit limits
3. Generates unique PA code (PA-YYYY-####)
4. Records in database
5. Sends notification to enrollee

**PA Code Format:** PA-2025-0001

**Output:**
- PA code
- Valid from/to dates
- Authorized services
- Benefit limits

---

### **DiagnosisHistory** (`src/components/Diagnoses/DiagnosisHistory.tsx`)
**What it does:** Shows diagnosis history for enrollee

**Display:**
- Date of diagnosis
- ICD-10 code and description
- Provider
- PA code (if generated)
- Status

**Filters:**
- Date range
- Provider
- Status

---

### **Complaints Page** (`src/pages/Complaints.tsx`)
**What it does:** Manages enrollee and provider complaints

**Components:**
1. **ComplaintFilters:** Filter complaints
2. **ComplaintList:** Display complaints
3. **ComplaintForm:** Submit new complaint

**Tabs:**
1. **Active Complaints:** Unresolved complaints
2. **Resolved:** Closed complaints
3. **Submit Complaint:** New complaint form

**Internal Process:**
1. User submits complaint
2. System creates ticket
3. Assigns to appropriate department
4. Tracks status and resolution
5. Notifies submitter

**Complaint Fields:**
- Type (medical, billing, service, provider)
- Priority (low, medium, high, critical)
- Description
- Affected party (enrollee or provider)
- Attachments

**Components Used:**
- ComplaintFilters
- ComplaintList
- ComplaintForm
- OfflineBanner

---

### **ComplaintFilters** (`src/components/Complaints/ComplaintFilters.tsx`)
**What it does:** Filters complaint list

**Filter Options:**
1. Status (open, in-progress, resolved, closed)
2. Type (medical, billing, service, provider)
3. Priority (low, medium, high, critical)
4. Date range

**Internal Process:**
- Updates filter state
- Passes to parent component
- Parent filters complaint list

---

### **ComplaintList** (`src/components/Complaints/ComplaintList.tsx`)
**What it does:** Displays filtered complaints

**Display:**
- Complaint ID
- Date submitted
- Type and priority
- Status
- Description preview
- Assigned to
- Actions (view, update status, resolve)

**Actions:**
- View details
- Update status
- Add notes
- Resolve/Close
- Escalate

---

### **ComplaintForm** (`src/components/Complaints/ComplaintForm.tsx`)
**What it does:** Form for submitting new complaints

**Form Fields:**
1. Complaint type
2. Priority level
3. Affected party (name and ID)
4. Description
5. File attachments

**Internal Process:**
1. Validates all required fields
2. Uploads attachments
3. Creates complaint record
4. Generates ticket number
5. Sends notification
6. Returns ticket number to user

**Offline Support:**
- Saves draft automatically
- Queues submission when online
- Syncs when connection restored

---

### **Approvals Page** (`src/pages/Approvals.tsx`)
**What it does:** Manages care approval requests

**Components:**
1. **ApprovalStats:** Approval metrics
2. **ApprovalFilters:** Filter approvals
3. **ApprovalQueue:** List of requests
4. **TreatmentForm:** New treatment request

**Tabs:**
- Approval queue (default view)

**Internal Process:**
1. Provider submits care request
2. Call center reviews request
3. Checks eligibility and benefits
4. Approves or denies
5. Notifies provider and enrollee

**Approval Types:**
- Hospitalization
- Surgery
- Specialty care
- High-cost treatments
- Out-of-network care

**Components Used:**
- ApprovalStats
- ApprovalFilters
- ApprovalQueue
- TreatmentForm
- OfflineBanner

---

### **ApprovalStats** (`src/components/Approvals/ApprovalStats.tsx`)
**What it does:** Shows approval metrics

**Metrics:**
1. Pending Approvals: 23
2. Approved Today: 15
3. Avg Response Time: 45 min
4. High Priority: 5

**Display:**
- Stat cards with icons
- Trend indicators
- Color coding by urgency

---

### **ApprovalFilters** (`src/components/Approvals/ApprovalFilters.tsx`)
**What it does:** Filters approval queue

**Filter Options:**
1. Status (pending, approved, denied)
2. Urgency (all, routine, urgent, emergency)
3. Provider (all, or specific)

**Internal Process:**
- Updates filter state
- Re-renders approval queue
- Shows filtered count

---

### **ApprovalQueue** (`src/components/Approvals/ApprovalQueue.tsx`)
**What it does:** Displays approval requests

**Display:**
- Request ID
- Date submitted
- Enrollee name and ID
- Provider
- Treatment requested
- Urgency level
- Status
- Actions

**Actions:**
1. **View Details:** Opens full request
2. **Approve:** Approves request
3. **Deny:** Denies with reason
4. **Request More Info:** Asks for additional details

**Internal Process:**
1. Loads approval requests from database
2. Applies filters
3. Sorts by urgency and date
4. Displays in table format

**Approval Workflow:**
1. Review enrollee eligibility
2. Check benefit coverage
3. Verify medical necessity
4. Approve or deny
5. Add approval notes
6. Send notification

---

### **TreatmentForm** (`src/components/Approvals/TreatmentForm.tsx`)
**What it does:** Form for requesting treatment approval

**Form Fields:**
1. Enrollee ID
2. Diagnosis
3. Proposed treatment
4. Provider
5. Estimated cost
6. Urgency level
7. Medical justification
8. Supporting documents

**Internal Process:**
1. Validates enrollee eligibility
2. Checks benefit limits
3. Calculates coverage amount
4. Submits request
5. Generates request ID
6. Notifies call center

**Validation:**
- Enrollee must be active
- Benefits available
- Required fields completed
- Valid ICD-10 codes

---

### **Benefits Page** (`src/pages/Benefits.tsx`)
**What it does:** Views enrollee benefit utilization

**Components:**
1. **BenefitSearch:** Search for enrollee
2. **BenefitDetails:** Shows benefit breakdown
3. **BenefitAlerts:** Usage warnings

**Internal Process:**
1. Search for enrollee
2. Load benefit records
3. Calculate usage by category
4. Show alerts for high usage
5. Display remaining benefits

**Benefit Categories:**
- Medical (consultations, procedures)
- Dental (cleanings, fillings, orthodontics)
- Optical (eye exams, glasses, contacts)
- Maternity (prenatal, delivery, postnatal)
- Pharmacy (medications)

**Components Used:**
- BenefitSearch
- BenefitDetails
- BenefitAlerts
- OfflineBanner

---

### **BenefitSearch** (`src/components/Benefits/BenefitSearch.tsx`)
**What it does:** Search form for finding enrollee benefits

**Form Fields:**
1. Enrollee ID
2. Enrollee Name (optional)

**Internal Process:**
1. Validates input
2. Searches database
3. Loads benefit records
4. Calculates usage
5. Returns results

---

### **BenefitDetails** (`src/components/Benefits/BenefitDetails.tsx`)
**What it does:** Displays detailed benefit breakdown

**Display Sections:**
1. **Enrollee Info:** Name, ID, Plan
2. **Benefit Summary:** Overall usage
3. **Category Breakdown:**
   - Medical: Used ₦15,000 / ₦50,000
   - Dental: Used ₦800 / ₦2,000
   - Optical: Used ₦150 / ₦500
   - Maternity: Used ₦0 / ₦10,000

4. **Usage Chart:** Visual representation
5. **Recent Claims:** Last 10 benefit uses

**Calculations:**
- Percentage used per category
- Remaining balance
- Year-to-date totals
- Projected usage

---

### **BenefitAlerts** (`src/components/Benefits/BenefitAlerts.tsx`)
**What it does:** Shows benefit usage warnings

**Alert Types:**
1. **Warning (80%+ used):** "Approaching dental benefit limit"
2. **Info (0% used):** "Maternity benefit unused"
3. **Critical (100% used):** "Medical benefit exhausted"

**Display:**
- Color-coded alerts
- Icon by type
- Recommendation text
- Action button (if applicable)

---

## STAGE 5: CLAIMS MODULE

### **Claims Page** (`src/pages/Claims.tsx`)
**What it does:** Claims processing and adjudication

**Components:**
1. **ClaimsStats:** Claims metrics
2. **ClaimsFilters:** Filter claims
3. **ClaimsQueue:** List of claims
4. **ClaimsAnalytics:** Analytics dashboard

**Tabs:**
1. **Claims Queue:** Active claims
2. **Analytics:** Reports and insights

**Internal Process:**
1. Provider submits claim
2. Claims adjudicator reviews
3. Validates ICD-10 codes
4. Checks benefit coverage
5. Approves or denies
6. Forwards to medical review if needed
7. Processes payment

**Components Used:**
- ClaimsStats
- ClaimsFilters
- ClaimsQueue
- ClaimsAnalytics
- OfflineBanner

---

### **ClaimsStats** (`src/components/Claims/ClaimsStats.tsx`)
**What it does:** Shows claims processing metrics

**Metrics:**
1. Pending Claims: 156
2. Approved Today: 89
3. Total Value: ₦2.4M
4. Avg Processing Time: 2.3 hrs

**Display:**
- Stat cards
- Trend indicators
- Color coding

---

### **ClaimsFilters** (`src/components/Claims/ClaimsFilters.tsx`)
**What it does:** Filters claims queue

**Filter Options:**
1. Status (pending, approved, denied, review)
2. Adjudicator (all, or specific)
3. Provider (all, or specific)
4. Date range (today, 7 days, 30 days, custom)

**Internal Process:**
- Updates filter state
- Re-renders claims queue
- Shows filtered count

---

### **ClaimsQueue** (`src/components/Claims/ClaimsQueue.tsx`)
**What it does:** Displays claims for processing

**Display:**
- Claim ID
- Date submitted
- Provider
- Enrollee name and ID
- Service provided
- Amount claimed
- Status
- Actions

**Actions:**
1. **Review Claim:** Opens full details
2. **Approve:** Approves claim
3. **Deny:** Denies with reason
4. **Forward to Medical:** Sends to medical director
5. **Request Documents:** Asks for more info

**Claim Review Process:**
1. **Initial Vetting (Claims Adjudicator):**
   - Verifies enrollee eligibility
   - Checks provider network status
   - Validates ICD-10 codes
   - Confirms benefit coverage
   - Reviews supporting documents
   - Decision: Approve, Deny, or Forward to Medical

2. **Medical Review (Medical Director):**
   - Reviews clinical justification
   - Checks medical necessity
   - Evaluates treatment appropriateness
   - High-value claim review
   - Decision: Approve or Deny

3. **Payment Processing:**
   - Approved claims go to finance
   - Payment batch creation
   - Provider payment
   - EOB sent to enrollee

---

### **ClaimsAnalytics** (`src/components/Claims/ClaimsAnalytics.tsx`)
**What it does:** Claims analytics and reporting

**Reports:**
1. **Claims by Status:** Pie chart
2. **Claims Trend:** Line chart over time
3. **Top Providers:** Bar chart
4. **Avg Processing Time:** Trend
5. **Approval Rate:** Percentage
6. **High-Value Claims:** List

**Filters:**
- Date range
- Provider
- Claim type
- Status

**Export Options:**
- PDF report
- Excel spreadsheet
- CSV data

---

### **SubmittedClaims Page** (`src/pages/SubmittedClaims.tsx`)
**What it does:** Shows all submitted claims (read-only view)

**Display:**
- All claims submitted by providers
- Filters by provider, date, status
- Search by claim ID or enrollee
- Export capability

**Internal Process:**
1. Loads all claims from database
2. Displays in table format
3. Allows filtering and searching
4. Can export to Excel/PDF

---

### **ClaimsAnalytics Page** (`src/pages/ClaimsAnalytics.tsx`)
**What it does:** Dedicated analytics page

**Analytics Sections:**
1. **Overview Metrics:** Key stats
2. **Charts and Graphs:** Visual analytics
3. **Provider Performance:** Top/bottom providers
4. **Trend Analysis:** Historical trends
5. **Predictive Insights:** Forecasting

---

### **PaymentProcessing Page** (`src/pages/PaymentProcessing.tsx`)
**What it does:** Manages provider payments

**Internal Process:**
1. Approved claims queued for payment
2. Batch creation by provider
3. Payment generation
4. Bank transfer initiation
5. Payment confirmation
6. EOB generation

**Display:**
- Payment batches
- Provider payment history
- Outstanding payments
- Payment schedules

---

## STAGE 6: PROVIDER MODULE

### **Providers Page** (`src/pages/Providers.tsx`)
**What it does:** Manages provider network

**Components:**
1. **ProviderStats:** Provider metrics
2. **ProviderSearch:** Search providers
3. **ProviderList:** List of providers
4. **ProviderForm:** Add/edit provider
5. **ProviderLoginManagement:** Manage provider logins

**Tabs:**
1. **Provider Directory:** List all providers
2. **Login Management:** Manage provider access

**Internal Process:**
1. Maintains provider database
2. Tracks provider contracts
3. Manages credentials
4. Monitors performance
5. Handles provider enrollment

**Components Used:**
- ProviderStats
- ProviderSearch
- ProviderList
- ProviderForm
- ProviderLoginManagement
- OfflineBanner

---

### **ProviderStats** (`src/components/Providers/ProviderStats.tsx`)
**What it does:** Shows provider network metrics

**Metrics:**
1. Total Providers: 247
2. Active: 235
3. Pending: 8
4. Suspended: 4

**Display:**
- Stat cards
- Provider count by category
- Geographic distribution

---

### **ProviderSearch** (`src/components/Providers/ProviderSearch.tsx`)
**What it does:** Search and filter providers

**Search Options:**
1. Provider name
2. Location
3. Category (hospital, clinic, pharmacy, lab)
4. Tier (1, 2, 3)
5. Status (active, pending, suspended)

**Internal Process:**
- Real-time search
- Filters applied immediately
- Shows result count

---

### **ProviderList** (`src/components/Providers/ProviderList.tsx`)
**What it does:** Displays provider directory

**Display:**
- Provider name
- Category and tier
- Location
- Contact info
- Status
- Actions

**Actions:**
1. View details
2. Edit information
3. View contracts
4. View performance
5. Manage credentials
6. Suspend/Activate

---

### **ProviderForm** (`src/components/Providers/ProviderForm.tsx`)
**What it does:** Form for adding/editing providers

**Form Fields:**
1. Provider name
2. Category (hospital, clinic, pharmacy, lab, diagnostic)
3. Tier (1, 2, 3)
4. Location (address, city, state)
5. Contact (phone, email)
6. Services offered
7. Contract details
8. Banking information

**Internal Process:**
1. Validates all fields
2. Checks for duplicates
3. Creates provider record
4. Generates provider ID
5. Sets up credentials
6. Activates provider

---

### **ProviderLoginManagement** (`src/components/Providers/ProviderLoginManagement.tsx`)
**What it does:** Manages provider portal access

**Features:**
1. Create provider logins
2. Reset passwords
3. Manage permissions
4. Suspend access
5. Track login activity

**Display:**
- Provider name
- Email/username
- Last login
- Status
- Actions (reset password, suspend, delete)

---

### **ProviderContracts Page** (`src/pages/ProviderContracts.tsx`)
**What it does:** Manages provider contracts

**Features:**
1. Contract creation
2. Contract renewal
3. Terms management
4. Fee schedules
5. Contract termination

**Display:**
- Provider name
- Contract start/end dates
- Terms summary
- Fee schedule
- Status

---

### **ProviderPerformance Page** (`src/pages/ProviderPerformance.tsx`)
**What it does:** Tracks provider performance

**Metrics:**
1. Claims submitted
2. Claims approved
3. Approval rate
4. Avg claim value
5. Member satisfaction
6. Response time

**Display:**
- Performance dashboard
- Charts and graphs
- Ranking
- Alerts for poor performance

---

## STAGE 7: ENROLLMENT MODULE

### **EnrollmentManagement Page** (`src/pages/EnrollmentManagement.tsx`)
**What it does:** Comprehensive enrollee management system

**Components:**
1. **BulkUploadModal:** Bulk CSV upload
2. Stats cards (Total, Active, Pending, Inactive)

**Tabs:**
1. **Search & Manage:** Main management interface
2. **Human Validation:** Validate new enrollees
3. **Bulk Upload:** CSV bulk enrollment
4. **Benefits Upload:** Upload benefit packages
5. **Generate E-Cards:** Digital ID cards

**Internal Process - Tab 1 (Search & Manage):**
1. **Search & Filter:**
   - Search by name, enrollment ID, or company
   - Filter by status, plan, validation status
   - Multi-select enrollees

2. **Bulk Actions:**
   - Reactivate selected
   - Deactivate selected
   - Archive selected

3. **Individual Actions:**
   - Validate enrollee
   - Generate e-card
   - View full details

4. **Display Table:**
   - Enrollee details (name, ENR-ID, e-ID, gender, age)
   - Company and plan
   - Status badge
   - Validation status badge
   - Action buttons

**Internal Process - Tab 2 (Human Validation):**
1. Shows all enrollees with validation_status = 'pending'
2. Each enrollee card shows:
   - Full enrollee details
   - Review & Validate button

3. **Validation Form:**
   - Displays all enrollee data
   - NHIA number verification
   - BVN verification
   - e-ID confirmation
   - Validation notes field
   - Actions: Cancel, Reject, Approve

4. **On Approval:**
   - Updates validation_status to 'approved'
   - Sets status to 'active'
   - Records validator and timestamp
   - Saves validation notes

5. **On Rejection:**
   - Updates validation_status to 'rejected'
   - Sets status to 'inactive'
   - Records validator and timestamp
   - Saves rejection notes

**Internal Process - Tab 3 (Bulk Upload):**
- Opens BulkUploadModal
- Features explanation
- Auto-ID generation info
- Upload button

**Database Integration:**
- Connects to Supabase
- Real-time data loading
- Auto-refresh after actions
- Relational data (clients table)

**Auto-Generated IDs:**
1. **Enrollment ID (ENR-YYYY-####):**
   - Format: ENR-2025-0001
   - Auto-increments
   - Unique per year

2. **e-ID (Digital Card ID):**
   - 10-character alphanumeric
   - Unique identifier
   - Used for digital cards

**Components Used:**
- BulkUploadModal
- Inline validation form
- Supabase client

---

### **BulkUploadModal** (`src/components/Enrollment/BulkUploadModal.tsx`)
**What it does:** Handles bulk enrollee uploads via CSV

**Internal Process:**
1. **File Selection:**
   - User clicks to select CSV file
   - Drag & drop supported
   - File type validation

2. **Client Selection:**
   - Dropdown to select company/client
   - Required before upload

3. **CSV Parsing:**
   - Reads CSV file
   - Parses headers and rows
   - Validates structure

4. **Data Validation:**
   - Checks required fields
   - Validates data formats
   - Checks for duplicates
   - Reports errors

5. **ID Generation:**
   - Gets next enrollment number
   - Generates ENR-YYYY-#### for each
   - Generates unique e-ID for each

6. **Batch Insert:**
   - Inserts all enrollees to database
   - Transaction-based (all or nothing)
   - Returns success/failure count

7. **Results Display:**
   - Success count
   - Error count
   - Error details (if any)

**Required CSV Columns:**
- name
- nhia_number
- bvn
- gender
- age
- date_of_birth
- phone
- email
- address
- plan
- effective_date
- expiration_date

**Optional CSV Columns:**
- Any additional fields

**Output:**
- Auto-generated: enrollment_id, e_id
- Default: status='pending', validation_status='pending'
- Timestamp: created_at

**Error Handling:**
- Invalid CSV format
- Missing required fields
- Duplicate enrollees
- Database errors
- Network errors

---

### **MemberRegistration Page** (`src/pages/MemberRegistration.tsx`)
**What it does:** Individual enrollee registration (placeholder)

**Planned Features:**
- Single enrollee registration form
- Plan selection
- Document upload
- Payment processing
- E-card generation

**Current Status:** Coming Soon

---

### **PlanManagement Page** (`src/pages/PlanManagement.tsx`)
**What it does:** Healthcare plan administration (placeholder)

**Planned Features:**
- Create/edit plans
- Benefit configuration
- Pricing management
- Plan comparison

**Current Status:** Coming Soon

---

## STAGE 8: FINANCE MODULE

### **Billing Page** (`src/pages/Billing.tsx`)
**What it does:** Premium billing and collections (placeholder)

**Planned Features:**
- Generate invoices
- Track payments
- Send reminders
- Payment reconciliation

**Current Status:** Coming Soon

---

### **FinancialReports Page** (`src/pages/FinancialReports.tsx`)
**What it does:** Financial reporting and analytics (placeholder)

**Planned Features:**
- Revenue reports
- Expense reports
- Profit/loss statements
- Cash flow analysis
- Premium collection reports

**Current Status:** Coming Soon

---

## STAGE 9: UNDERWRITING MODULE

### **RiskAssessment Page** (`src/pages/RiskAssessment.tsx`)
**What it does:** Risk evaluation and underwriting (placeholder)

**Planned Features:**
- Risk scoring
- Medical underwriting
- Premium calculation
- Risk pool analysis

**Current Status:** Coming Soon

---

### **PolicyManagement Page** (`src/pages/PolicyManagement.tsx`)
**What it does:** Insurance policy administration (placeholder)

**Planned Features:**
- Policy creation
- Terms management
- Exclusions configuration
- Policy documents

**Current Status:** Coming Soon

---

## STAGE 10: REGULATION MODULE

### **Compliance Page** (`src/pages/Compliance.tsx`)
**What it does:** Regulatory compliance management (placeholder)

**Planned Features:**
- NHIA compliance tracking
- Regulatory reporting
- Audit preparation
- Compliance dashboard

**Current Status:** Coming Soon

---

### **AuditTrail Page** (`src/pages/AuditTrail.tsx`)
**What it does:** System audit logging (placeholder)

**Planned Features:**
- User activity logs
- Data change tracking
- Login history
- Compliance audit reports

**Current Status:** Coming Soon

---

## STAGE 11: OFFLINE MODE

### **OfflineMode Page** (`src/pages/OfflineMode.tsx`)
**What it does:** Offline data management

**Features:**
1. **Offline Status Display:**
   - Shows current connection state
   - Last online timestamp

2. **Saved Forms:**
   - Lists all backed-up forms
   - Shows timestamp and page
   - Restore functionality

3. **Manual Controls:**
   - Enable/disable offline mode
   - Clear all backups
   - Sync data when online

**Internal Process:**
1. Uses OfflineContext
2. Displays saved form backups
3. Allows restoration
4. Queues actions for when online
5. Auto-syncs when connection restored

---

## STAGE 12: PROVIDER PORTAL

### **ProviderPortal Page** (`src/pages/ProviderPortal.tsx`)
**What it does:** Provider-facing interface

**Features:**
1. **Eligibility Verification:**
   - Check enrollee status
   - View benefit information

2. **Claims Submission:**
   - Submit new claims
   - View claim status
   - Track payments

3. **Treatment Requests:**
   - Request pre-authorization
   - Submit treatment plans

4. **Reports:**
   - Claims history
   - Payment history
   - Performance metrics

**Internal Process:**
1. Provider logs in
2. Selects enrollee
3. Verifies eligibility
4. Submits claim or request
5. Tracks status
6. Views payments

---

## STAGE 13: ENROLLEE PORTAL

### **EnrolleePortal Page** (`src/pages/EnrolleePortal.tsx`)
**What it does:** Member-facing interface

**Features:**
1. **My Profile:**
   - View personal info
   - View e-card
   - Update contact info

2. **My Benefits:**
   - View plan details
   - Check benefit usage
   - See remaining benefits

3. **Claims History:**
   - View submitted claims
   - Track claim status
   - Download EOBs

4. **Find Provider:**
   - Search provider network
   - Get directions
   - View provider details

5. **File Complaint:**
   - Submit complaints
   - Track resolution

**Internal Process:**
1. Enrollee logs in
2. Views dashboard
3. Accesses features
4. Views/downloads documents
5. Submits requests

---

## COMMON COMPONENTS

### **OfflineBanner** (`src/components/Common/OfflineBanner.tsx`)
**What it does:** Shows offline status warning

**Display:**
- Yellow banner at top of page
- "You are offline" message
- Manual offline mode indicator
- Last online time

**Triggers:**
- Network disconnection
- Manual offline mode enabled

---

### **OfflineStatusButton** (`src/components/Common/OfflineStatusButton.tsx`)
**What it does:** Toggle offline mode manually

**Display:**
- Wifi icon (connected) or WifiOff icon (offline)
- Click to toggle
- Shows current state

**States:**
- Green: Online
- Red: Offline (network)
- Yellow: Manual offline

---

## DATABASE SCHEMA

### **clients Table**
```sql
id: uuid (primary key)
name: text (company name)
created_at: timestamptz
```

**Purpose:** Stores company/client information

---

### **enrollees Table**
```sql
id: uuid (primary key)
enrollment_id: text (ENR-YYYY-####, auto-generated)
e_id: text (digital card ID, auto-generated)
client_id: uuid (foreign key → clients.id)
name: text
nhia_number: text
bvn: text
gender: text
age: integer
date_of_birth: date
phone: text
email: text
address: text
plan: text (Bronze/Silver/Gold)
status: text (active/pending/inactive)
effective_date: date
expiration_date: date
validation_status: text (pending/approved/rejected)
validated_by: text (nullable)
validation_date: timestamptz (nullable)
validation_notes: text (nullable)
created_at: timestamptz
updated_at: timestamptz
```

**Purpose:** Stores enrollee/member information

**Auto-Generation:**
- enrollment_id: Trigger generates ENR-YYYY-#### format
- e_id: Trigger generates 10-character alphanumeric

---

### **bulk_uploads Table**
```sql
id: uuid (primary key)
filename: text
client_id: uuid (foreign key → clients.id)
uploaded_by: text
record_count: integer
success_count: integer
error_count: integer
errors: jsonb (nullable)
status: text
created_at: timestamptz
```

**Purpose:** Tracks bulk upload operations

---

## DATA FLOW EXAMPLES

### **Example 1: Enrollee Eligibility Check**
```
User Input → EligibilitySearch Component
     ↓
Search enrollee database (src/data/enrollees.ts)
     ↓
Find match by ID or Name
     ↓
Load enrollee record
     ↓
Calculate benefits based on plan and status
     ↓
EligibilityResults Component → Display
```

---

### **Example 2: Bulk Enrollment Upload**
```
User selects CSV file → BulkUploadModal
     ↓
Parse CSV → Validate data
     ↓
Select client/company
     ↓
Get next enrollment number from database
     ↓
Generate ENR-YYYY-#### for each enrollee
     ↓
Generate unique e-ID for each enrollee
     ↓
Batch insert to Supabase enrollees table
     ↓
Update bulk_uploads table with results
     ↓
Display success/error counts
     ↓
Reload enrollee list
```

---

### **Example 3: Claims Processing**
```
Provider submits claim → ClaimsQueue
     ↓
Claims Adjudicator reviews
     ↓
Initial vetting:
  - Check eligibility (active status)
  - Validate ICD-10 codes
  - Verify provider network status
  - Check benefit coverage
  - Review documents
     ↓
Decision: Approve / Deny / Forward to Medical
     ↓
If forwarded → Medical Director review
     ↓
Medical review:
  - Clinical justification
  - Medical necessity
  - Treatment appropriateness
     ↓
Decision: Approve / Deny
     ↓
If approved → Payment Processing
     ↓
Create payment batch
     ↓
Process payment to provider
     ↓
Generate EOB for enrollee
     ↓
Close claim
```

---

### **Example 4: Human Validation Workflow**
```
Bulk upload completes → Enrollees created with status='pending'
     ↓
EnrollmentManagement → Validation tab
     ↓
Shows all pending enrollees
     ↓
Officer clicks "Review & Validate"
     ↓
Validation form opens with all data:
  - Personal info
  - NHIA number
  - BVN
  - e-ID
  - Contact info
  - Plan details
     ↓
Officer verifies accuracy
     ↓
Enters validation notes
     ↓
Decision: Approve or Reject
     ↓
If Approved:
  - validation_status = 'approved'
  - status = 'active'
  - validated_by = officer name
  - validation_date = now
     ↓
If Rejected:
  - validation_status = 'rejected'
  - status = 'inactive'
  - validated_by = officer name
  - validation_date = now
     ↓
Database updated
     ↓
Notification sent (future feature)
     ↓
E-card generated (if approved)
```

---

## SUMMARY

This Eagle HMO system is a comprehensive healthcare management platform with:

- **28 pages** across 8 modules
- **60+ components** organized by feature
- **3 contexts** for global state management
- **3 database tables** with auto-generation triggers
- **5 user roles** with permission-based access
- **Offline support** with automatic form backup
- **Auto-ID generation** for enrollment IDs and digital card IDs
- **Human validation workflow** for quality assurance
- **Bulk upload** capability for efficient enrollment
- **Claims processing** with dual-level review
- **Provider network** management
- **Real-time notifications** system
- **Role-based dashboards** with relevant metrics

Each component has a specific purpose, clear data flow, and well-defined internal processes that work together to create an end-to-end healthcare management solution.
