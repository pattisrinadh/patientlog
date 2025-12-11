import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Activity, 
  Plus, 
  Clock,
  Printer
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Patient, Visit, Prescription, Appointment, VisitType } from '../types';
import EmptyState from '../components/EmptyState';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'visits' | 'prescriptions' | 'appointments'>('visits');
  
  // Modal States
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  
  // Forms
  const [newVisit, setNewVisit] = useState<Partial<Visit>>({
    type: VisitType.Routine,
    vitals: {}
  });
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({});

  useEffect(() => {
    if (id) {
      const allPatients = StorageService.getPatients();
      const found = allPatients.find(p => p.id === id);
      if (found) {
        setPatient(found);
        loadData();
      } else {
        navigate('/patients');
      }
    }
  }, [id, navigate]);

  const loadData = () => {
    if(!id) return;
    setVisits(StorageService.getVisits(id));
    setPrescriptions(StorageService.getPrescriptions(id));
    setAppointments(StorageService.getAppointments(id));
  };

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!id) return;
    const visit: Visit = {
      id: crypto.randomUUID(),
      patientId: id,
      date: new Date().toISOString(),
      type: newVisit.type as VisitType,
      symptoms: newVisit.symptoms || '',
      diagnosis: newVisit.diagnosis || '',
      notes: newVisit.notes || '',
      vitals: newVisit.vitals
    };
    StorageService.addVisit(visit);
    setIsVisitModalOpen(false);
    setNewVisit({ type: VisitType.Routine, vitals: {} });
    loadData();
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if(!id) return;
    const presc: Prescription = {
      id: crypto.randomUUID(),
      visitId: 'manual', // In a real app, you'd link to a specific visit
      patientId: id,
      datePrescribed: new Date().toISOString(),
      medicationName: newPrescription.medicationName || '',
      dosage: newPrescription.dosage || '',
      frequency: newPrescription.frequency || '',
      duration: newPrescription.duration || '',
      notes: newPrescription.notes || ''
    };
    StorageService.addPrescription(presc);
    setIsPrescriptionModalOpen(false);
    setNewPrescription({});
    loadData();
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header / Back */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/patients')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-500" />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-slate-800">{patient.firstName} {patient.lastName}</h1>
           <p className="text-slate-500 text-sm">Patient ID: #{patient.id}</p>
        </div>
        <div className="flex-1"></div>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm"
        >
          <Printer size={16} className="mr-2" />
          Print Record
        </button>
      </div>

      {/* Patient Card info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</span>
            <span className="block text-slate-800 mt-1">{patient.phone}</span>
            <span className="block text-slate-500 text-sm">{patient.email}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Demographics</span>
            <span className="block text-slate-800 mt-1">{patient.gender}, {patient.dob}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Address</span>
            <span className="block text-slate-800 mt-1">{patient.address}</span>
          </div>
          <div>
             <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Allergies</span>
             {patient.allergies.length > 0 ? (
               <div className="flex flex-wrap gap-1 mt-1">
                 {patient.allergies.map(a => (
                   <span key={a} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">{a}</span>
                 ))}
               </div>
             ) : (
               <span className="text-slate-500 text-sm mt-1">None known</span>
             )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'visits', label: 'Visits History', icon: Activity },
            { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              <tab.icon className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === tab.id ? 'text-teal-500' : 'text-slate-400 group-hover:text-slate-500'}
              `} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* VISITS TAB */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
             <div className="flex justify-end">
                <button 
                  onClick={() => setIsVisitModalOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm text-sm"
                >
                  <Plus size={16} className="mr-2" /> Record Visit
                </button>
             </div>
             {visits.length > 0 ? (
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <div key={visit.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-semibold mb-1">
                            {visit.type}
                          </span>
                          <h3 className="text-lg font-bold text-slate-800">{visit.diagnosis}</h3>
                        </div>
                        <span className="text-sm text-slate-500">{new Date(visit.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{visit.notes}</p>
                      
                      {visit.vitals && Object.keys(visit.vitals).length > 0 && (
                        <div className="bg-slate-50 rounded-md p-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {Object.entries(visit.vitals).map(([key, val]) => (
                             <div key={key}>
                               <span className="block text-xs text-slate-400 uppercase">{key}</span>
                               <span className="block text-sm font-semibold text-slate-700">{val}</span>
                             </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
             ) : (
                <EmptyState icon={Activity} title="No Visits Recorded" description="Record a new checkup or consultation." />
             )}
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
           <div className="space-y-4">
             <div className="flex justify-end">
                <button 
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm text-sm"
                >
                  <Plus size={16} className="mr-2" /> Add Prescription
                </button>
             </div>
             {prescriptions.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {prescriptions.map((rx) => (
                   <div key={rx.id} className="bg-white border-l-4 border-teal-500 rounded-r-lg shadow-sm p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-slate-800">{rx.medicationName}</h4>
                        <span className="text-xs text-slate-400">{new Date(rx.datePrescribed).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-slate-600">
                        <p><span className="font-semibold">Dosage:</span> {rx.dosage}</p>
                        <p><span className="font-semibold">Frequency:</span> {rx.frequency}</p>
                        <p><span className="font-semibold">Duration:</span> {rx.duration}</p>
                      </div>
                      {rx.notes && <p className="mt-2 text-xs text-slate-400 italic">"{rx.notes}"</p>}
                   </div>
                 ))}
               </div>
             ) : (
               <EmptyState icon={FileText} title="No Prescriptions" description="Add medication details for this patient." />
             )}
           </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
           <div className="space-y-4">
              <div className="flex justify-end">
                <button 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm text-sm"
                  onClick={() => alert("Scheduler feature would open here")}
                >
                  <Plus size={16} className="mr-2" /> Schedule Follow-up
                </button>
             </div>
             {appointments.length > 0 ? (
               <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                 <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date/Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {appointments.map(apt => (
                        <tr key={apt.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-slate-400" />
                              {apt.date} at {apt.time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{apt.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             ) : (
               <EmptyState icon={Calendar} title="No Upcoming Appointments" description="Schedule a follow-up visit." />
             )}
           </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Record Visit Modal */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Record New Visit</h2>
            </div>
            <form onSubmit={handleAddVisit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Visit Type</label>
                   <select className="w-full p-2 border border-slate-200 rounded-lg"
                    value={newVisit.type} onChange={e => setNewVisit({...newVisit, type: e.target.value as VisitType})}>
                     {Object.values(VisitType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
                   <input type="text" className="w-full p-2 border border-slate-200 rounded-lg" required
                    value={newVisit.diagnosis} onChange={e => setNewVisit({...newVisit, diagnosis: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg"
                  value={newVisit.symptoms} onChange={e => setNewVisit({...newVisit, symptoms: e.target.value})} />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Vitals</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   <input placeholder="BP (120/80)" className="p-2 border rounded text-sm" 
                     value={newVisit.vitals?.bp || ''} onChange={e => setNewVisit({...newVisit, vitals: {...newVisit.vitals, bp: e.target.value}})} />
                   <input placeholder="Heart Rate (bpm)" className="p-2 border rounded text-sm"
                     value={newVisit.vitals?.heartRate || ''} onChange={e => setNewVisit({...newVisit, vitals: {...newVisit.vitals, heartRate: e.target.value}})} />
                   <input placeholder="Temp (°F)" className="p-2 border rounded text-sm"
                     value={newVisit.vitals?.temperature || ''} onChange={e => setNewVisit({...newVisit, vitals: {...newVisit.vitals, temperature: e.target.value}})} />
                   <input placeholder="Weight (kg)" className="p-2 border rounded text-sm"
                     value={newVisit.vitals?.weight || ''} onChange={e => setNewVisit({...newVisit, vitals: {...newVisit.vitals, weight: e.target.value}})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes</label>
                <textarea className="w-full p-2 border border-slate-200 rounded-lg h-24"
                  value={newVisit.notes} onChange={e => setNewVisit({...newVisit, notes: e.target.value})} />
              </div>

              <div className="flex justify-end pt-2 space-x-3">
                <button type="button" onClick={() => setIsVisitModalOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
             <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">New Prescription</h2>
            </div>
            <form onSubmit={handleAddPrescription} className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medication Name</label>
                  <input type="text" required className="w-full p-2 border border-slate-200 rounded-lg"
                    value={newPrescription.medicationName} onChange={e => setNewPrescription({...newPrescription, medicationName: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                    <input type="text" placeholder="e.g. 500mg" className="w-full p-2 border border-slate-200 rounded-lg"
                      value={newPrescription.dosage} onChange={e => setNewPrescription({...newPrescription, dosage: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                    <input type="text" placeholder="e.g. 7 days" className="w-full p-2 border border-slate-200 rounded-lg"
                      value={newPrescription.duration} onChange={e => setNewPrescription({...newPrescription, duration: e.target.value})} />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                  <input type="text" placeholder="e.g. Twice daily after meals" className="w-full p-2 border border-slate-200 rounded-lg"
                    value={newPrescription.frequency} onChange={e => setNewPrescription({...newPrescription, frequency: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea className="w-full p-2 border border-slate-200 rounded-lg h-20"
                    value={newPrescription.notes} onChange={e => setNewPrescription({...newPrescription, notes: e.target.value})} />
               </div>
               <div className="flex justify-end pt-2 space-x-3">
                <button type="button" onClick={() => setIsPrescriptionModalOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Prescribe</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;