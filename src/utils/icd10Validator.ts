// ICD-10 code validation utility
export const validateICD10Code = (code: string): boolean => {
  // Basic ICD-10 format validation
  const icd10Regex = /^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/;
  return icd10Regex.test(code);
};

export const generatePACode = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PA-${timestamp}-${random}`;
};

export const commonICD10Codes = [
  { code: 'B50.9', description: 'Plasmodium falciparum malaria, unspecified' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'I10', description: 'Essential hypertension' },
  { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation' },
  { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
  { code: 'K59.00', description: 'Constipation, unspecified' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'M79.3', description: 'Panniculitis, unspecified' },
  { code: 'K35.9', description: 'Acute appendicitis, unspecified' },
  { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  { code: 'O80', description: 'Encounter for full-term uncomplicated delivery' },
  { code: 'N61', description: 'Inflammatory disorders of breast' },
  { code: 'C50.9', description: 'Malignant neoplasm of unspecified site of unspecified female breast' },
  { code: 'N40', description: 'Benign prostatic hyperplasia' },
  { code: 'Z51.11', description: 'Encounter for antineoplastic chemotherapy' },
  { code: 'S72.001A', description: 'Fracture of unspecified part of neck of right femur, initial encounter' },
  { code: 'H52.4', description: 'Presbyopia' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus' },
  { code: 'M25.50', description: 'Pain in unspecified joint' }
];

export const getDiagnosisFromICD10 = (code: string): string => {
  const diagnosis = commonICD10Codes.find(item => item.code === code);
  return diagnosis ? diagnosis.description : '';
};