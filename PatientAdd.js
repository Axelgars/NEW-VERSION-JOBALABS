import React, { useState, useEffect } from 'react';
import { generateUniqueId } from '../utils/helpers';

const PatientAdd = ({ onAddPatient, onUpdatePatient, editingPatient, setEditingPatient }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (editingPatient) {
      setName(editingPatient.name);
      setLastName(editingPatient.lastName);
      setPhone(editingPatient.phone);
      setEmail(editingPatient.email || ''); // Email puede ser nulo o vacío
    } else {
      setName('');
      setLastName('');
      setPhone('');
      setEmail('');
    }
  }, [editingPatient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && lastName && phone) { // Email ya no es obligatorio
      if (editingPatient) {
        onUpdatePatient({ ...editingPatient, name, lastName, phone, email });
        setEditingPatient(null);
      } else {
        onAddPatient({ id: generateUniqueId(), name, lastName, phone, email });
      }
      setName('');
      setLastName('');
      setPhone('');
      setEmail('');
    } else {
      alert('Por favor, completa los campos obligatorios: Nombre, Apellido y Teléfono.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {editingPatient ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre: <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Nombre del paciente"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Apellido: <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Apellido del paciente"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Teléfono: <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Teléfono de contacto"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email (Opcional):</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Correo electrónico"
          />
        </div>
        <div className="md:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="flex-grow bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
          >
            {editingPatient ? 'Actualizar Paciente' : 'Guardar Paciente'}
          </button>
          {editingPatient && (
            <button
              type="button"
              onClick={() => setEditingPatient(null)}
              className="flex-grow bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-400 transition-all duration-300 shadow-md"
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PatientAdd;