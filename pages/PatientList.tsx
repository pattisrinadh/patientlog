import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Patient, Gender } from '../types';
import EmptyState from '../components/EmptyState';
import { Users } from 'lucide-react';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    gender: Gender.Male,
    dob: '',
    contact: '',
    address: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setPatients(StorageService.getPatients());
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.firstName || !newPatient.lastName) return;

    const patient: Patient = {
      id: crypto.randomUUID(),
      firstName: newPatient.firstName!,
      lastName: newPatient.lastName!,
      dob: newPatient.dob || '',
      gender: newPatient.gender as Gender,
      phone: newPatient.phone || '',
      email: newPatient.email || '',
      address: newPatient.address || '',
      allergies: [],
      createdAt: new Date().toISOString()
    };

    StorageService.addPatient(patient);
    setIsModalOpen(false);
    setNewPatient({ gender: Gender.Male }); // Reset
    loadPatients();
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
          <p className="text-slate-500 text-sm mt-1">Manage patient records and information</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Patient
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <Filter size={18} className="mr-2" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gender/Age</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registered</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{patient.firstName} {patient.lastName}</div>
                          <div className="text-xs text-slate-500">ID: #{patient.id.slice(0,6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{patient.phone}</div>
                      <div className="text-xs text-slate-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                       }`}>
                         {patient.gender}
                       </span>
                       <span className="ml-2 text-sm text-slate-500">
                         {patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A'} yrs
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/patients/${patient.id}`} className="text-teal-600 hover:text-teal-900 mr-4">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            icon={Users} 
            title="No Patients Found" 
            description={searchTerm ? "Try adjusting your search terms." : "Get started by adding a new patient."}
            action={
              !searchTerm && (
                <button onClick={() => setIsModalOpen(true)} className="mt-4 text-teal-600 font-medium hover:underline">
                  Create new patient
                </button>
              )
            }
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Add New Patient</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    value={newPatient.firstName} onChange={e => setNewPatient({...newPatient, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    value={newPatient.lastName} onChange={e => setNewPatient({...newPatient, lastName: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input type="date" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                      value={newPatient.dob} onChange={e => setNewPatient({...newPatient, dob: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                      value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value as Gender})}>
                        <option value={Gender.Male}>Male</option>
                        <option value={Gender.Female}>Female</option>
                        <option value={Gender.Other}>Other</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input required type="tel" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
              </div>
              
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;