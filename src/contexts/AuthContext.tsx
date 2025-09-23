import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User database with Nigerian staff
const users = [
  {
    id: '1',
    name: 'Emmanuel Onifade',
    email: 'emmanuel.onifade@eaglehmo.com',
    password: '1234',
    role: 'Super Admin',
    department: 'Management',
    permissions: ['all']
  },
  // Call Center Unit
  {
    id: '2',
    name: 'Winifred Festus',
    email: 'winifred.festus@eaglehmo.com',
    password: 'callcenter123',
    role: 'Call Center Representative',
    department: 'Call Center',
    permissions: ['eligibility', 'diagnoses', 'complaints', 'approvals', 'benefits']
  },
  {
    id: '3',
    name: 'Ajayi Seyi',
    email: 'ajayi.seyi@eaglehmo.com',
    password: 'callcenter123',
    role: 'Call Center Representative',
    department: 'Call Center',
    permissions: ['eligibility', 'diagnoses', 'complaints', 'approvals', 'benefits']
  },
  // Claims Unit
  {
    id: '4',
    name: 'Emmanuel Onifade',
    email: 'emmanuel.claims@eaglehmo.com',
    password: 'claims123',
    role: 'Claims Adjudicator',
    department: 'Claims',
    permissions: ['claims', 'providers']
  },
  {
    id: '5',
    name: 'Dr. Owolabi Adebayo',
    email: 'dr.owolabi@eaglehmo.com',
    password: 'medical123',
    role: 'Medical Director',
    department: 'Claims',
    permissions: ['claims', 'medical-review', 'providers']
  },
  {
    id: '6',
    name: 'Olufemi Adegbami',
    email: 'olufemi.adegbami@eaglehmo.com',
    password: 'executive123',
    role: 'Executive Director',
    department: 'Claims',
    permissions: ['claims', 'providers', 'analytics', 'reports']
  },
  // Provider Account
  {
    id: '7',
    name: 'Lagos University Teaching Hospital (LUTH)',
    email: 'provider@luth.edu.ng',
    password: 'provider123',
    role: 'Provider',
    department: 'Provider Network',
    permissions: ['provider-portal']
  },
  // Enrollee Accounts
  {
    id: '8',
    name: 'Adebayo Olumide',
    email: 'adebayo.olumide@zenithbank.com',
    password: 'enrollee123',
    role: 'Enrollee',
    department: 'Member',
    permissions: ['enrollee-portal']
  },
  {
    id: '9',
    name: 'Fatima Abubakar',
    email: 'fatima.abubakar@nnpc.gov.ng',
    password: 'enrollee123',
    role: 'Enrollee',
    department: 'Member',
    permissions: ['enrollee-portal']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const foundUser = users.find(u => u.email === email && u.password === password);
          if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            // Clear any existing session data
            localStorage.removeItem('user');
            // Set new user
            setUser(userWithoutPassword);
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            resolve(true);
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1500);
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all session data
    setUser(null);
    localStorage.removeItem('user');
    // Force page reload to clear any cached state
    window.location.href = '/login';
  };

  useEffect(() => {
    // Check for existing session
    setIsLoading(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
    setIsInitialized(true);
  }, []);


  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eagle-50 via-naija-50 to-gold-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-eagle-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Eagle HMO...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};