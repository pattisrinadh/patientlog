export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum VisitType {
  Routine = 'Routine Checkup',
  Emergency = 'Emergency',
  FollowUp = 'Follow Up',
  Specialist = 'Specialist Consultation'
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  createdAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  type: VisitType;
  symptoms: string;
  diagnosis: string;
  notes: string;
  vitals?: {
    bp?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
  };
}

export interface Prescription {
  id: string;
  visitId: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  datePrescribed: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string; // ISO date string
  time: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Stats {
  totalPatients: number;
  visitsToday: number;
  activePrescriptions: number;
  pendingAppointments: number;
}