import React, { useState, useEffect } from 'react';
import { generateUniqueId, calculateOrderTotal, applyConvenioDiscount, formatCurrency } from '../utils/helpers';

const OrderCreate = ({ patients, studies, packages, convenios, onAddOrder, editingOrder, setEditingOrder }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedStudies, setSelectedStudies] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedConvenio, setSelectedConvenio] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Combinar estudios y paquetes para la búsqueda
  const allAvailableItems = [
    ...studies.map(s => ({ ...s, itemType: 'study' })),
    ...packages.map(p => ({ ...p, itemType: 'package' }))
  ];

  useEffect(() => {
    if (editingOrder) {
      setSelectedPatient(editingOrder.patientId);
      setSelectedStudies(editingOrder.studies);
      setSelectedPackages(editingOrder.packages);
      setSelectedConvenio(editingOrder.convenioId || '');
      setAppointmentDate(editingOrder.appointmentDate || '');
      setAppointmentTime(editingOrder.appointmentTime || '');
    } else {
      setSelectedPatient('');
      setSelectedStudies([]);
      setSelectedPackages([]);
      setSelectedConvenio('');
      setAppointmentDate('');
      setAppointmentTime('');
    }
  }, [editingOrder]);

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setFilteredItems(
        allAvailableItems.filter(item =>
          item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (item.type && item.type.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (item.itemType === 'package' && 'paquete'.includes(lowerCaseSearchTerm))
        )
      );
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm, studies, packages]);

  const handleToggleItem = (item) => {
    if (item.itemType === 'study') {
      setSelectedStudies(prev =>
        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
      );
    } else if (item.itemType === 'package') {
      setSelectedPackages(prev =>
        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
      );
    }
  };

  const handleRemoveItem = (id, type) => {
    if (type === 'study') {
      setSelectedStudies(prev => prev.filter(sId => sId !== id));
    } else if (type === 'package') {
      setSelectedPackages(prev => prev.filter(pId => pId !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPatient && (selectedStudies.length > 0 || selectedPackages.length > 0)) {
      const newOrderData = {
        id: editingOrder ? editingOrder.id : generateUniqueId(),
        patientId: selectedPatient,
        studies: selectedStudies,
        packages: selectedPackages,
        convenioId: selectedConvenio,
        date: editingOrder ? editingOrder.date : new Date().toISOString().split('T')[0], // Mantener fecha original si se edita
        appointmentDate: appointmentDate || null,
        appointmentTime: appointmentTime || null,
        status: editingOrder ? editingOrder.status : 'pendiente', // Mantener estado original si se edita
        total: 0
      };

      onAddOrder(newOrderData); // Esta función ahora manejará tanto añadir como actualizar
      
      // Limpiar formulario
      setSelectedPatient('');
      setSelectedStudies([]);
      setSelectedPackages([]);
      setSelectedConvenio('');
      setAppointmentDate('');
      setAppointmentTime('');
      setSearchTerm('');
      setFilteredItems([]);
      setEditingOrder(null); // Limpiar el estado de edición
    } else {
      alert('¡Necesitas seleccionar un paciente y al menos un estudio o paquete!');
    }
  };

  const currentTotal = calculateOrderTotal(
    { studies: selectedStudies, packages: selectedPackages },
    studies,
    packages
  );
  const finalAmount = applyConvenioDiscount(currentTotal, selectedConvenio, convenios);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {editingOrder ? 'Modificar Orden de Estudio' : 'Crear Nueva Orden de Estudio'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Paciente:</label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            disabled={!!editingOrder} // Deshabilitar selección de paciente si se está editando
          >
            <option value="">Selecciona un paciente</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name} {patient.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Convenio (Opcional):</label>
          <select
            value={selectedConvenio}
            onChange={(e) => setSelectedConvenio(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            <option value="">Sin Convenio</option>
            {convenios.map(convenio => (
              <option key={convenio.id} value={convenio.id}>{convenio.name} ({convenio.discount}%)</option>
            ))}
          </select>
        </div>

        {/* Campo para agendar fecha de cita */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Cita (Opcional):</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
        </div>
        {/* Campo para agendar hora de cita */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Hora de Cita (Opcional):</label>
          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
        </div>

        {/* Sección de búsqueda y selección de estudios/paquetes con checkboxes */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Buscar y Añadir Estudios/Paquetes:</label>
          <input
            type="text"
            placeholder="Buscar estudio o paquete por nombre o clasificación..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="border border-gray-300 rounded-xl p-3 max-h-60 overflow-y-auto shadow-sm">
            {filteredItems.length === 0 && searchTerm !== '' ? (
              <p className="text-gray-600 text-sm">No se encontraron resultados.</p>
            ) : (
              filteredItems.map(item => (
                <label key={item.id} className="flex items-center py-1 text-sm text-gray-800 cursor-pointer hover:bg-green-50 rounded-lg px-2">
                  <input
                    type="checkbox"
                    checked={
                      (item.itemType === 'study' && selectedStudies.includes(item.id)) ||
                      (item.itemType === 'package' && selectedPackages.includes(item.id))
                    }
                    onChange={() => handleToggleItem(item)}
                    className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 flex-grow">{item.name} ({item.itemType === 'study' ? item.type : 'Paquete'})</span>
                  <span className="font-semibold">{formatCurrency(item.price)}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Estudios y Paquetes Seleccionados */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2 mt-4">Elementos Seleccionados:</label>
          {selectedStudies.length === 0 && selectedPackages.length === 0 ? (
            <p className="text-gray-600 text-sm">No se han seleccionado estudios ni paquetes.</p>
          ) : (
            <ul className="border border-gray-300 rounded-xl p-3 max-h-48 overflow-y-auto">
              {selectedStudies.map(sId => {
                const study = studies.find(s => s.id === sId);
                return study ? (
                  <li key={sId} className="flex justify-between items-center py-1 text-sm text-gray-800">
                    <span>{study.name} ({study.type})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(sId, 'study')}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      {/* Icono de tacha SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ) : null;
              })}
              {selectedPackages.map(pId => {
                const pkg = packages.find(p => p.id === pId);
                return pkg ? (
                  <li key={pId} className="flex justify-between items-center py-1 text-sm text-gray-800">
                    <span>{pkg.name} (Paquete)</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(pId, 'package')}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      {/* Icono de tacha SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </div>

        <div className="md:col-span-2 text-right text-xl font-bold text-gray-800 mt-4">
          Total: {formatCurrency(finalAmount)}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
          >
            {editingOrder ? 'Actualizar Orden' : 'Crear Orden'}
          </button>
          {editingOrder && (
            <button
              type="button"
              onClick={() => setEditingOrder(null)}
              className="w-full bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-400 transition-all duration-300 shadow-md mt-2"
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrderCreate;