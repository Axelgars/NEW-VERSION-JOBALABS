import React, { useState, useEffect } from 'react';
import { generateUniqueId } from '../utils/helpers';

const StudyAdd = ({ onAddStudy, onUpdateStudy, editingStudy, setEditingStudy }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState(''); // Usamos 'type' para la categoría
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (editingStudy) {
      setName(editingStudy.name);
      setType(editingStudy.type);
      setPrice(editingStudy.price.toString());
    } else {
      setName('');
      setType('');
      setPrice('');
    }
  }, [editingStudy]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && type && price) {
      // Asegurarse de que el precio se parsea como float y se fija a 2 decimales
      const parsedPrice = parseFloat(price).toFixed(2);
      if (editingStudy) {
        onUpdateStudy({ ...editingStudy, name, type, price: parseFloat(parsedPrice) });
        setEditingStudy(null);
      } else {
        // Al agregar un nuevo estudio, la categoría es 'type'
        onAddStudy({ id: generateUniqueId(), name, type, category: type, price: parseFloat(parsedPrice) });
      }
      setName('');
      setType('');
      setPrice('');
    } else {
      alert('¡Ups! Faltan campos por llenar. ¡No te rindas!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {editingStudy ? 'Editar Estudio' : 'Agregar Nuevo Estudio'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Estudio:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Ej. Biometría Hemática"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Categoría/Tipo:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Ej. Hematología, Química Clínica"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Precio:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Ej. 250.00"
            step="0.01"
          />
        </div>
        <div className="md:col-span-3 flex space-x-4">
          <button
            type="submit"
            className="flex-grow bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
          >
            {editingStudy ? 'Actualizar Estudio' : 'Guardar Estudio'}
          </button>
          {editingStudy && (
            <button
              type="button"
              onClick={() => setEditingStudy(null)}
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

export default StudyAdd;