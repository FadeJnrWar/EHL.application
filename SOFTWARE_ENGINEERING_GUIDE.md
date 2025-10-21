# Eagle HMO Platform - Software Engineering Guide

## Project Overview
A comprehensive Health Maintenance Organization (HMO) management system for Nigerian healthcare providers. The platform manages enrollees, claims processing, provider networks, and healthcare operations with offline capability.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage for file uploads

### Key Libraries
```json
{
  "@supabase/supabase-js": "^2.58.0",
  "react": "^18.3.1",
  "react-router-dom": "^7.8.2",
  "lucide-react": "^0.344.0"
}
```

---

## Architecture Patterns

### 1. **Folder Structure**
```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Header, Sidebar, Layout wrapper
│   ├── Common/          # Shared components (buttons, modals)
│   ├── Approvals/       # Domain-specific components
│   ├── Claims/
│   ├── Enrollment/
│   └── Providers/
├── contexts/            # React Context providers
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   └── OfflineContext.tsx
├── pages/               # Route-level page components
│   ├── Dashboard.tsx
│   ├── EnrollmentManagement.tsx
│   ├── Claims.tsx
│   └── ...
├── data/                # Mock data and constants
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

### 2. **Component Architecture**
- **Atomic Design Principles**: Break UI into smallest reusable components
- **Single Responsibility**: Each component should do one thing well
- **Composition over Inheritance**: Compose complex UIs from simple components

### 3. **State Management Strategy**
- **Local State**: `useState` for component-specific state
- **Global State**: React Context for auth, notifications, offline status
- **Server State**: Direct Supabase queries, no client-side caching layer
- **Form State**: Controlled components with local state

---

## Database Design Principles

### 1. **Schema Design**
```sql
-- Tables should follow this pattern:
CREATE TABLE entity_name (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Business fields here
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 2. **Naming Conventions**
- Tables: `snake_case`, plural (e.g., `enrollees`, `clients`)
- Columns: `snake_case` (e.g., `enrollment_id`, `client_code`)
- Foreign Keys: `{table_name}_id` (e.g., `client_id`)
- Indexes: `idx_{table}_{column}` (e.g., `idx_enrollees_status`)

### 3. **Migration Standards**
Every migration MUST include:
```sql
/*
  # Migration Title

  ## Overview
  Brief description of what this migration does

  ## New Tables
  - `table_name`
    - Column descriptions

  ## Security
  - RLS policies

  ## Indexes
  - Performance indexes
*/
```

### 4. **Row Level Security (RLS)**
ALWAYS enable RLS on every table:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Restrictive policies only
CREATE POLICY "Policy name"
  ON table_name FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### 5. **Auto-Generated IDs**
Use database triggers for business IDs:
```sql
CREATE OR REPLACE FUNCTION generate_enrollment_id()
RETURNS TRIGGER AS $$
DECLARE
  current_year text;
  max_number integer;
  new_number text;
BEGIN
  IF NEW.enrollment_id IS NULL THEN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::text;

    SELECT COALESCE(MAX(
      CAST(SUBSTRING(enrollment_id FROM 'ENR-' || current_year || '-(.*)') AS INTEGER)
    ), 0) INTO max_number
    FROM enrollees
    WHERE enrollment_id LIKE 'ENR-' || current_year || '-%';

    new_number := LPAD((max_number + 1)::text, 4, '0');
    NEW.enrollment_id := 'ENR-' || current_year || '-' || new_number;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Authentication Flow

### 1. **Setup Supabase Client**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. **Auth Context Pattern**
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Login implementation
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    setUser(data.user);
  };

  // Logout implementation
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3. **Protected Routes**
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};
```

---

## Data Operations Patterns

### 1. **Reading Data**
```typescript
// Always use maybeSingle() for zero-or-one results
const { data, error } = await supabase
  .from('enrollees')
  .select(`
    *,
    client:clients(name, client_code)
  `)
  .eq('id', enrolleeId)
  .maybeSingle();

// Use select() for multiple results
const { data, error } = await supabase
  .from('enrollees')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);
```

### 2. **Creating Data**
```typescript
const { data, error } = await supabase
  .from('enrollees')
  .insert({
    name: 'John Doe',
    client_id: clientId,
    status: 'pending'
  })
  .select()
  .single();

if (error) {
  console.error('Insert error:', error);
  // Handle error
}
```

### 3. **Updating Data**
```typescript
const { error } = await supabase
  .from('enrollees')
  .update({
    status: 'active',
    validation_status: 'approved'
  })
  .eq('id', enrolleeId);
```

### 4. **Deleting Data**
```typescript
// Soft delete (preferred)
const { error } = await supabase
  .from('enrollees')
  .update({ status: 'inactive', deleted_at: new Date().toISOString() })
  .eq('id', enrolleeId);

// Hard delete (use sparingly)
const { error } = await supabase
  .from('enrollees')
  .delete()
  .eq('id', enrolleeId);
```

### 5. **Bulk Operations**
```typescript
const { error } = await supabase
  .from('enrollees')
  .update({ status: 'active' })
  .in('id', selectedIds);
```

---

## File Upload Patterns

### 1. **CSV Parsing**
```typescript
const parseCSV = (text: string): ParsedData[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const data: ParsedData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
};
```

### 2. **Bulk Upload with Error Handling**
```typescript
const handleBulkUpload = async (data: ParsedData[]) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const item of data) {
    try {
      const { error } = await supabase
        .from('enrollees')
        .insert(item);

      if (error) {
        results.failed++;
        results.errors.push(`${item.name}: ${error.message}`);
      } else {
        results.successful++;
      }
    } catch (err: any) {
      results.failed++;
      results.errors.push(`${item.name}: ${err.message}`);
    }
  }

  return results;
};
```

---

## UI/UX Standards

### 1. **Design System - Colors**
```typescript
// Tailwind config custom colors
colors: {
  eagle: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',  // Primary
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  naija: {
    600: '#059669',  // Nigerian green
  },
  gold: {
    600: '#ca8a04',  // Nigerian gold
  }
}
```

### 2. **Typography Standards**
- **Headings**: Bold, hierarchy from text-3xl to text-sm
- **Body**: text-gray-600 for secondary text, text-gray-900 for primary
- **Labels**: text-sm font-medium text-gray-700

### 3. **Component Patterns**

**Button Styles:**
```typescript
// Primary button
className="bg-eagle-600 text-white px-4 py-2 rounded-lg hover:bg-eagle-700 transition-colors"

// Secondary button
className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"

// Danger button
className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
```

**Status Badges:**
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

**Modal Pattern:**
```typescript
{isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Modal content */}
    </div>
  </div>
)}
```

### 4. **Loading States**
```typescript
{loading ? (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-eagle-600 border-t-transparent mx-auto mb-4"></div>
    <p className="text-gray-600">Loading...</p>
  </div>
) : (
  <Content />
)}
```

---

## Error Handling

### 1. **Database Errors**
```typescript
try {
  const { data, error } = await supabase
    .from('enrollees')
    .select('*');

  if (error) throw error;

  return data;
} catch (error: any) {
  console.error('Database error:', error);

  // User-friendly error message
  if (error.code === 'PGRST116') {
    alert('No records found');
  } else {
    alert('An error occurred. Please try again.');
  }

  return [];
}
```

### 2. **Form Validation**
```typescript
const validateEnrollee = (data: EnrolleeInput): string[] => {
  const errors: string[] = [];

  if (!data.name) errors.push('Name is required');
  if (!data.date_of_birth) errors.push('Date of birth is required');
  if (data.email && !isValidEmail(data.email)) errors.push('Invalid email format');

  return errors;
};
```

### 3. **Network Errors**
```typescript
// Offline detection
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

---

## Performance Optimization

### 1. **Database Indexes**
Create indexes for frequently queried columns:
```sql
CREATE INDEX idx_enrollees_status ON enrollees(status);
CREATE INDEX idx_enrollees_validation_status ON enrollees(validation_status);
CREATE INDEX idx_enrollees_client_id ON enrollees(client_id);
```

### 2. **Query Optimization**
```typescript
// BAD: Fetching all data then filtering in JS
const allData = await supabase.from('enrollees').select('*');
const filtered = allData.filter(e => e.status === 'active');

// GOOD: Filter in database
const { data } = await supabase
  .from('enrollees')
  .select('*')
  .eq('status', 'active');
```

### 3. **Component Optimization**
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Expensive rendering logic
});

// Use useMemo for expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => matchesFilter(item));
}, [data, filters]);

// Use useCallback for event handlers passed to children
const handleClick = useCallback((id: string) => {
  // Handle click
}, [dependency]);
```

---

## Testing Strategy

### 1. **Manual Testing Checklist**
- [ ] User can log in with valid credentials
- [ ] User cannot log in with invalid credentials
- [ ] Protected routes redirect to login when not authenticated
- [ ] Bulk upload accepts valid CSV files
- [ ] Bulk upload shows errors for invalid data
- [ ] Auto-generated IDs increment correctly
- [ ] Search and filters work correctly
- [ ] Validation workflow (approve/reject) functions
- [ ] Bulk actions work on selected items
- [ ] Forms validate required fields
- [ ] Error messages display correctly

### 2. **Database Testing**
```sql
-- Test auto-increment IDs
INSERT INTO enrollees (name, client_id, date_of_birth, gender)
VALUES ('Test User', 'client-uuid', '1990-01-01', 'Male');

SELECT enrollment_id, e_id FROM enrollees WHERE name = 'Test User';
-- Should return: ENR-2025-0001, EID-XXXXXXXXXXXX

-- Test RLS policies
SET ROLE authenticated;
SELECT * FROM enrollees;  -- Should work

SET ROLE anon;
SELECT * FROM enrollees;  -- Should return empty or error
```

### 3. **Edge Cases to Test**
- Empty database (no clients, no enrollees)
- Large dataset (1000+ records)
- Concurrent bulk uploads
- Network disconnection during operation
- Invalid CSV formats
- Duplicate entries
- SQL injection attempts (should be prevented by Supabase)

---

## Security Best Practices

### 1. **Environment Variables**
Never commit sensitive data. Use `.env` file:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. **RLS Policies**
ALWAYS enable RLS and create restrictive policies:
```sql
-- Bad: Too permissive
CREATE POLICY "Allow all" ON table_name FOR ALL USING (true);

-- Good: Restrictive
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### 3. **Input Sanitization**
```typescript
// Sanitize user input before inserting
const sanitizeInput = (input: string): string => {
  return input.trim().substring(0, 255);
};

const name = sanitizeInput(userInput.name);
```

### 4. **Password Requirements**
- Minimum 8 characters
- No password stored in code
- Use Supabase Auth for password handling

---

## Deployment Checklist

### 1. **Pre-Deployment**
- [ ] All migrations applied to production database
- [ ] Environment variables configured
- [ ] RLS policies enabled on all tables
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Build succeeds without errors: `npm run build`

### 2. **Database Setup**
```bash
# Apply migrations in order
supabase db push

# Verify tables created
supabase db list

# Test RLS policies
supabase db test
```

### 3. **Production Environment Variables**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 4. **Post-Deployment Testing**
- [ ] Login/logout works
- [ ] Data loads correctly
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] Error messages display
- [ ] Mobile responsive

---

## Common Pitfalls & Solutions

### 1. **RLS Blocking Queries**
**Problem**: Queries return empty even though data exists.
**Solution**: Check RLS policies are created for SELECT operations.

### 2. **Auto-Generated IDs Not Working**
**Problem**: Enrollment IDs not generating.
**Solution**: Verify trigger is created and function is correct.

### 3. **CORS Errors**
**Problem**: API calls blocked by CORS.
**Solution**: Supabase handles CORS automatically. Check if using correct anon key.

### 4. **Slow Queries**
**Problem**: Queries taking too long.
**Solution**: Add indexes on filtered/sorted columns.

### 5. **Type Mismatches**
**Problem**: TypeScript errors for Supabase data.
**Solution**: Generate types from database:
```bash
supabase gen types typescript --project-id your-project > src/types/database.ts
```

---

## Development Workflow

### 1. **Feature Development Process**
1. Create database migrations first
2. Apply migrations to local database
3. Build components with TypeScript interfaces
4. Implement data operations
5. Add error handling
6. Test manually
7. Create pull request

### 2. **Code Review Checklist**
- [ ] No hardcoded credentials
- [ ] Error handling implemented
- [ ] Loading states present
- [ ] TypeScript types defined
- [ ] RLS policies enabled
- [ ] No SQL injection vulnerabilities
- [ ] Follows naming conventions
- [ ] Components are properly scoped

### 3. **Git Workflow**
```bash
# Feature branch
git checkout -b feature/enrollment-bulk-upload

# Commit migrations separately
git add supabase/migrations/
git commit -m "Add enrollment tables and triggers"

# Commit code
git add src/
git commit -m "Implement bulk upload component"

# Push and create PR
git push origin feature/enrollment-bulk-upload
```

---

## Maintenance & Monitoring

### 1. **Database Maintenance**
- Monitor table sizes: Large tables may need partitioning
- Check index usage: Remove unused indexes
- Vacuum database regularly (Supabase handles this)
- Monitor RLS policy performance

### 2. **Application Monitoring**
- Track error rates in console
- Monitor page load times
- Check database query performance
- Monitor API response times

### 3. **User Feedback**
- Collect user reports of issues
- Track feature usage
- Monitor bulk upload success rates
- Review validation rejection reasons

---

## Resources & Documentation

### Official Documentation
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Database Resources
- **PostgreSQL Triggers**: https://www.postgresql.org/docs/current/triggers.html
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security

### Code Examples
- See existing components in `src/components/` for patterns
- Check `src/pages/EnrollmentManagement.tsx` for complete feature example
- Review `src/contexts/AuthContext.tsx` for auth patterns

---

## Support & Contact

For technical questions:
- Review this guide
- Check Supabase documentation
- Review existing codebase for patterns
- Test in local environment first

**Remember**:
- Data safety is the highest priority
- Always enable RLS
- Test thoroughly before deploying
- Document complex logic
- Keep components small and focused
