// Enrollee Login Credentials for Testing
export interface EnrolleeCredential {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  enrolleeId: string;
  company: string;
  plan: string;
  status: string;
}

export const enrolleeCredentials: EnrolleeCredential[] = [
  {
    id: '1',
    name: 'Adebayo Olumide',
    email: 'adebayo.olumide@zenithbank.com',
    password: 'enrollee123',
    phone: '+234-801-234-5678',
    enrolleeId: 'ENR-12345',
    company: 'Zenith Bank Plc',
    plan: 'Gold',
    status: 'active'
  },
  {
    id: '2',
    name: 'Fatima Abubakar',
    email: 'fatima.abubakar@nnpc.gov.ng',
    password: 'enrollee123',
    phone: '+234-802-345-6789',
    enrolleeId: 'ENR-67890',
    company: 'Nigerian National Petroleum Corporation',
    plan: 'Silver',
    status: 'active'
  },
  {
    id: '3',
    name: 'Chinedu Okafor',
    email: 'chinedu.okafor@accessbankplc.com',
    password: 'enrollee123',
    phone: '+234-803-456-7890',
    enrolleeId: 'ENR-11111',
    company: 'Access Bank Plc',
    plan: 'Bronze',
    status: 'active'
  },
  {
    id: '4',
    name: 'Kemi Adebayo',
    email: 'kemi.adebayo@mtn.com',
    password: 'enrollee123',
    phone: '+234-804-567-8901',
    enrolleeId: 'ENR-22222',
    company: 'MTN Nigeria',
    plan: 'Gold',
    status: 'active'
  },
  {
    id: '5',
    name: 'Ibrahim Musa',
    email: 'ibrahim.musa@firstbanknigeria.com',
    password: 'enrollee123',
    phone: '+234-805-678-9012',
    enrolleeId: 'ENR-33333',
    company: 'First Bank of Nigeria',
    plan: 'Silver',
    status: 'active'
  }
];

// Helper function to find enrollee credentials
export const findEnrolleeCredentials = (email: string): EnrolleeCredential | undefined => {
  return enrolleeCredentials.find(cred => cred.email === email);
};

// Helper function to validate enrollee login
export const validateEnrolleeLogin = (email: string, password: string): EnrolleeCredential | null => {
  const credentials = findEnrolleeCredentials(email);
  if (credentials && credentials.password === password) {
    return credentials;
  }
  return null;
};