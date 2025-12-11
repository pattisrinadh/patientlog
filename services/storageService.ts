import { Patient, Visit, Prescription, Appointment, Gender, VisitType } from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'patientlog_patients',
  VISITS: 'patientlog_visits',
  PRESCRIPTIONS: 'patientlog_prescriptions',
  APPOINTMENTS: 'patientlog_appointments',
};

// Seed data to make the app look good initially
const SEED_PATIENTS: Patient[] = [
  {
    id: 'p1',
    firstName: 'Sarah',
    lastName: 'Connor',
    dob: '1985-05-12',
    gender: Gender.Female,
    phone: '555-0123',
    email: 'sarah.c@example.com',
    address: '123 Tech Blvd, Silicon Valley',
    allergies: ['Penicillin'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1978-11-02',
    gender: Gender.Male,
    phone: '555-0199',
    email: 'john.d@example.com',
    address: '456 Maple Dr, Springfield',
    allergies: [],
    createdAt: new Date().toISOString()
  }
];

const SEED_VISITS: Visit[] = [
  {
    id: 'v1',
    patientId: 'p1',
    date: new Date().toISOString(),
    type: VisitType.Routine,
    symptoms: 'Mild headache, fatigue',
    diagnosis: 'Tension Headache',
    notes: 'Patient advised to rest and hydrate.',
    vitals: { bp: '120/80', heartRate: '72', temperature: '98.6', weight: '65kg' }
  }
];

const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00',
    reason: 'Follow up checkup',
    status: 'Scheduled'
  }
];

// Helper to get data from local storage
const getList = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to local storage
const saveList = <T>(key: string, list: T[]) => {
  localStorage.setItem(key, JSON.stringify(list));
};

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      saveList(STORAGE_KEYS.PATIENTS, SEED_PATIENTS);
      saveList(STORAGE_KEYS.VISITS, SEED_VISITS);
      saveList(STORAGE_KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
    }
  },

  getPatients: (): Patient[] => getList(STORAGE_KEYS.PATIENTS),
  
  addPatient: (patient: Patient) => {
    const list = getList<Patient>(STORAGE_KEYS.PATIENTS);
    list.push(patient);
    saveList(STORAGE_KEYS.PATIENTS, list);
  },

  getVisits: (patientId?: string): Visit[] => {
    const list = getList<Visit>(STORAGE_KEYS.VISITS);
    if (patientId) return list.filter(v => v.patientId === patientId);
    return list;
  },

  addVisit: (visit: Visit) => {
    const list = getList<Visit>(STORAGE_KEYS.VISITS);
    list.push(visit);
    saveList(STORAGE_KEYS.VISITS, list);
  },

  getPrescriptions: (patientId?: string): Prescription[] => {
    const list = getList<Prescription>(STORAGE_KEYS.PRESCRIPTIONS);
    if (patientId) return list.filter(p => p.patientId === patientId);
    return list;
  },

  addPrescription: (prescription: Prescription) => {
    const list = getList<Prescription>(STORAGE_KEYS.PRESCRIPTIONS);
    list.push(prescription);
    saveList(STORAGE_KEYS.PRESCRIPTIONS, list);
  },

  getAppointments: (patientId?: string): Appointment[] => {
    const list = getList<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    if (patientId) return list.filter(a => a.patientId === patientId);
    return list;
  },

  addAppointment: (appointment: Appointment) => {
    const list = getList<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    list.push(appointment);
    saveList(STORAGE_KEYS.APPOINTMENTS, list);
  },

  getStats: () => {
    const patients = getList<Patient>(STORAGE_KEYS.PATIENTS);
    const visits = getList<Visit>(STORAGE_KEYS.VISITS);
    const prescriptions = getList<Prescription>(STORAGE_KEYS.PRESCRIPTIONS);
    const appointments = getList<Appointment>(STORAGE_KEYS.APPOINTMENTS);

    const todayStr = new Date().toISOString().split('T')[0];

    return {
      totalPatients: patients.length,
      visitsToday: visits.filter(v => v.date.startsWith(todayStr)).length,
      activePrescriptions: prescriptions.length, // Simplified logic
      pendingAppointments: appointments.filter(a => a.status === 'Scheduled').length
    };
  }
};