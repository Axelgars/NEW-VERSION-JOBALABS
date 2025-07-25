import React, { useState } from 'react';

const ConvenioList = ({ convenios, onEditConvenio, onDeleteConvenio }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConvenios = convenios.filter(convenio =>
    convenio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Convenios Registrados</h3>
      <input
        type="text"
        placeholder="Buscar convenio por nombre..."
        className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredConvenios.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No hay convenios que coincidan con tu búsqueda. ¡Añade uno nuevo!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre del Convenio</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Descuento (%)</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredConvenios.map((convenio) => (
                <tr key={convenio.id} className="border-b border-gray-200 hover:bg-green-50 transition-colors duration-200">
                  <td className="py-3 px-4 text-sm text-gray-800">{convenio.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{convenio.discount}%</td>
                  <td className="py-3 px-4 text-sm text-gray-800 flex space-x-2">
                    <button
                      onClick={() => onEditConvenio(convenio)}
                      className="p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
                      title="Editar"
                    >
                      {/* Icono de lápiz SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-6.707 6.707a1 1 0 00-1.414 1.414l3.536 3.536a1 1 0 001.414 0l3.536-3.536a1 1 0 00-1.414-1.414L9 12.586l-2.121-2.121z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteConvenio(convenio.id)}
                      className="p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                      title="Eliminar"
                    >
                      {/* Icono de tacha roja SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConvenioList;