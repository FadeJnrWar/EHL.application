// Nigerian Enrollees Database for Eagle HMO
export interface Enrollee {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  company: string;
  plan: 'Bronze' | 'Silver' | 'Gold';
  status: 'active' | 'inactive';
  effectiveDate: string;
  expirationDate: string;
  dateOfBirth: string;
  phone: string;
  email: string;
}

export const enrollees: Enrollee[] = [
  {
    id: 'ENR-12345',
    name: 'Adebayo Olumide',
    gender: 'Male',
    age: 39,
    company: 'Zenith Bank Plc',
    plan: 'Gold',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1985-03-15',
    phone: '+234-801-234-5678',
    email: 'adebayo.olumide@zenithbank.com'
  },
  {
    id: 'ENR-67890',
    name: 'Fatima Abubakar',
    gender: 'Female',
    age: 34,
    company: 'Nigerian National Petroleum Corporation (NNPC)',
    plan: 'Silver',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1990-07-22',
    phone: '+234-802-345-6789',
    email: 'fatima.abubakar@nnpc.gov.ng'
  },
  {
    id: 'ENR-11111',
    name: 'Chinedu Okafor',
    gender: 'Male',
    age: 36,
    company: 'Access Bank Plc',
    plan: 'Bronze',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1988-11-08',
    phone: '+234-803-456-7890',
    email: 'chinedu.okafor@accessbankplc.com'
  },
  {
    id: 'ENR-22222',
    name: 'Kemi Adebayo',
    gender: 'Female',
    age: 32,
    company: 'MTN Nigeria',
    plan: 'Gold',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1992-05-18',
    phone: '+234-804-567-8901',
    email: 'kemi.adebayo@mtn.com'
  },
  {
    id: 'ENR-33333',
    name: 'Ibrahim Musa',
    gender: 'Male',
    age: 37,
    company: 'First Bank of Nigeria',
    plan: 'Silver',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1987-09-12',
    phone: '+234-805-678-9012',
    email: 'ibrahim.musa@firstbanknigeria.com'
  },
  {
    id: 'ENR-44444',
    name: 'Aisha Mohammed',
    gender: 'Female',
    age: 33,
    company: 'Dangote Cement Plc',
    plan: 'Bronze',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1991-12-03',
    phone: '+234-806-789-0123',
    email: 'aisha.mohammed@dangote.com'
  },
  {
    id: 'ENR-55555',
    name: 'Emeka Nwankwo',
    gender: 'Male',
    age: 40,
    company: 'Shell Nigeria',
    plan: 'Gold',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1984-04-27',
    phone: '+234-807-890-1234',
    email: 'emeka.nwankwo@shell.com'
  },
  {
    id: 'ENR-66666',
    name: 'Blessing Okoro',
    gender: 'Female',
    age: 35,
    company: 'Nigerian Breweries Plc',
    plan: 'Silver',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1989-08-14',
    phone: '+234-808-901-2345',
    email: 'blessing.okoro@nbplc.com'
  },
  {
    id: 'ENR-77777',
    name: 'Yusuf Abdullahi',
    gender: 'Male',
    age: 31,
    company: 'Guaranty Trust Bank',
    plan: 'Bronze',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1993-01-30',
    phone: '+234-809-012-3456',
    email: 'yusuf.abdullahi@gtbank.com'
  },
  {
    id: 'ENR-88888',
    name: 'Chioma Nwankwo',
    gender: 'Female',
    age: 38,
    company: 'United Bank for Africa (UBA)',
    plan: 'Gold',
    status: 'inactive',
    effectiveDate: '2023-01-01',
    expirationDate: '2023-12-31',
    dateOfBirth: '1986-06-09',
    phone: '+234-810-123-4567',
    email: 'chioma.nwankwo@ubagroup.com'
  }
];

// Helper function to find enrollee by ID
export const findEnrolleeById = (id: string): Enrollee | undefined => {
  return enrollees.find(enrollee => enrollee.id === id);
};

// Helper function to get enrollees by company
export const getEnrolleesByCompany = (company: string): Enrollee[] => {
  return enrollees.filter(enrollee => enrollee.company === company);
};

// Helper function to get enrollees by plan
export const getEnrolleesByPlan = (plan: 'Bronze' | 'Silver' | 'Gold'): Enrollee[] => {
  return enrollees.filter(enrollee => enrollee.plan === plan);
};