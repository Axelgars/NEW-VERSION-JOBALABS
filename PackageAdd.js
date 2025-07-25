import React, { useState, useEffect } from 'react';
import { generateUniqueId } from '../utils/helpers';

const PackageAdd = ({ studies, onAddPackage, onUpdatePackage, editingPackage, setEditingPackage }) => {
  const [name, setName] = useState('');
  const [selectedStudies, setSelectedStudies] = useState([]);
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (editingPackage) {
      setName(editingPackage.name);
      setSelectedStudies(editingPackage.includes || []); // Usar 'includes' para los estudios del paquete
      setPrice(editingPackage.price.toString());
    } else {
      setName('');
      setSelectedStudies([]);
      setPrice('');
    }
  }, [editingPackage]);

  const handleStudyChange = (e) => {
    const studyId = e.target.value;
    setSelectedStudies(prev => {
      if (prev.includes(studyId)) {
        return prev.filter(id => id !== studyId);
      } else {
        return [...prev, studyId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selectedStudies.length > 0 && price) {
      // Asegurarse de que el precio se parsea como float y se fija a 2 decimales
      const parsedPrice = parseFloat(price).toFixed(2);
      if (editingPackage) {
        onUpdatePackage({ ...editingPackage, name, includes: selectedStudies, price: parseFloat(parsedPrice) });
        setEditingPackage(null);
      } else {
        // Al agregar un nuevo paquete, la categoría es 'Paquetes'
        onAddPackage({ id: generateUniqueId(), name, includes: selectedStudies, price: parseFloat(parsedPrice), category: "Paquetes" });
      }
      setName('');
      setSelectedStudies([]);
      setPrice('');
    } else {
      alert('¡No olvides seleccionar estudios y ponerle precio al paquete!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {editingPackage ? 'Editar Paquete de Estudios' : 'Crear Nuevo Paquete de Estudios'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Paquete:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Ej. Paquete Básico de Salud"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Precio del Paquete:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Ej. 800.00"
            step="0.01"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Estudios Incluidos:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-xl p-3">
            {studies.map(study => (
              <label key={study.id} className="flex items-center text-gray-800 text-sm cursor-pointer hover:bg-green-50 rounded-lg p-2 transition-colors duration-200">
                <input
                  type="checkbox"
                  value={study.id}
                  checked={selectedStudies.includes(study.id)}
                  onChange={handleStudyChange}
                  className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="ml-2">{study.name} ({study.category || study.type})</span>
              </label>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="flex-grow bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
          >
            {editingPackage ? 'Actualizar Paquete' : 'Guardar Paquete'}
          </button>
          {editingPackage && (
            <button
              type="button"
              onClick={() => setEditingPackage(null)}
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

export default PackageAdd;