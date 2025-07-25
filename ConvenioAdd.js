import React, { useState, useEffect } from 'react';
import { generateUniqueId } from '../utils/helpers';

const ConvenioAdd = ({ onAddConvenio, onUpdateConvenio, editingConvenio, setEditingConvenio }) => {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    if (editingConvenio) {
      setName(editingConvenio.name);
      setDiscount(editingConvenio.discount.toString());
    } else {
      setName('');
      setDiscount('');
    }
  }, [editingConvenio]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && discount) {
      // Asegurarse de que el descuento se parsea como float y se fija a 2 decimales
      const parsedDiscount = parseFloat(discount).toFixed(2);
      if (editingConvenio) {
        onUpdateConvenio({ ...editingConvenio, name, discount: parseFloat(parsedDiscount) });
        setEditingConvenio(null);
      } else {
        onAddConvenio({ id: generateUniqueId(), name, discount: parseFloat(parsedDiscount) });
      }
      setName('');
      setDiscount('');
    } else {
      alert('¡No te olvides de poner el nombre y el descuento del convenio!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {editingConvenio ? 'Editar Convenio' : 'Agregar Nuevo Convenio'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Convenio:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Ej. Seguro GNP, IMSS"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Descuento (%):</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            placeholder="Ej. 10, 20"
            step="0.01"
            min="0"
            max="100"
          />
        </div>
        <div className="md:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="flex-grow bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
          >
            {editingConvenio ? 'Actualizar Convenio' : 'Guardar Convenio'}
          </button>
          {editingConvenio && (
            <button
              type="button"
              onClick={() => setEditingConvenio(null)}
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

export default ConvenioAdd;