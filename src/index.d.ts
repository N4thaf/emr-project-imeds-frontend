// =====================
// Types for Patient Data
// =====================

export interface PersonalInfo {
    name: string;
    nik: string;
    birthDate: string;  // format YYYY-MM-DD
    gender: "Male" | "Female";
    address: string;
    phone: string;
  }
  
  export interface Diagnosis {
    date: string;       // format YYYY-MM-DD
    diagnosis: string;
    icd10: string;
    doctor: string;
  }
  
  export interface Vitals {
    date: string;       // format YYYY-MM-DD
    time: string;       // format HH:mm
    bp: string;         // e.g. "120/80"
    hr: string;         // heart rate
    temp: string;       // e.g. "36.7°C"
    weight: string;     // e.g. "70kg"
    height: string;     // e.g. "170cm"
  }
  
  export interface LabResult {
    date: string;
    test: string;
    result: string;
    reference: string;
    status: "Normal" | "High" | "Low" | "Abnormal";
  }
  
  export interface Treatment {
    date: string;
    medication: string;
    dosage: string;
    duration: string;   // e.g. "30 days"
    doctor: string;
  }
  
  export interface ConsultationNote {
    date: string;
    doctor: string;
    specialty: string;
    chief_complaint: string;
    assessment: string;
    plan: string;
  }
  
  export interface Disposition {
    date: string;
    status: string;          // e.g. "Discharged Home"
    instructions: string;
    next_appointment: string; // format YYYY-MM-DD
  }
  
  export interface PatientData {
    personalInfo: PersonalInfo;
    diagnosis: Diagnosis[];
    vitals: Vitals[];
    labResults: LabResult[];
    treatments: Treatment[];
    consultationNotes: ConsultationNote[];
    disposition: Disposition[];
  }
  
  // Array of patients
  export type PatientsData = PatientData[];
  