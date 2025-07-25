import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';

const StudyList = ({ studies, onEditStudy, onDeleteStudy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Función para obtener la categoría del estudio, priorizando 'category' sobre 'type'
  const getCategory = (study) => study.category || study.type || 'Sin Categoría';

  // Obtener tipos únicos de estudios basados en la categoría
  const uniqueTypes = [...new Set(studies.map(study => getCategory(study)))].sort();

  const filteredStudies = studies.filter(study =>
    (study.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     getCategory(study).toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === '' || getCategory(study) === filterType)
  );

  const studiesByCategory = filteredStudies.reduce((acc, study) => {
    const category = getCategory(study);
    acc[category] = acc[category] || [];
    acc[category].push(study);
    return acc;
  }, {});

  const toggleCategory = (type) => {
    setExpandedCategories(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-200 mt-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Estudios Disponibles</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar estudio por nombre o tipo..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Todos los Tipos</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {Object.keys(studiesByCategory).length === 0 ? (
        <p className="text-gray-600 text-center py-4">No hay estudios que coincidan con tu búsqueda. ¡Añade uno nuevo!</p>
      ) : (
        <div className="overflow-x-auto">
          {Object.keys(studiesByCategory).map(type => (
            <div key={type} className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(type)}
                className="w-full flex justify-between items-center bg-green-50 p-3 text-left text-lg font-semibold text-gray-800 hover:bg-green-100 transition-colors duration-200"
              >
                {type}
                <span>{expandedCategories[type] ? '▲' : '▼'}</span>
              </button>
              {expandedCategories[type] && (
                <table className="min-w-full bg-white">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studiesByCategory[type].map((study) => (
                      <tr key={study.id} className="border-b border-gray-200 hover:bg-green-50 transition-colors duration-200">
                        <td className="py-2 px-4 text-sm text-gray-800">{study.name}</td>
                        <td className="py-2 px-4 text-sm text-gray-800">{formatCurrency(study.price)}</td>
                        <td className="py-2 px-4 text-sm text-gray-800 flex space-x-2">
                          {onEditStudy && ( // Solo mostrar si la prop onEditStudy existe
                            <button
                              onClick={() => onEditStudy(study)}
                              className="p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
                              title="Editar"
                            >
                              {/* Icono de lápiz SVG */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-6.707 6.707a1 1 0 00-1.414 1.414l3.536 3.536a1 1 0 001.414 0l3.536-3.536a1 1 0 00-1.414-1.414L9 12.586l-2.121-2.121z" />
                              </svg>
                            </button>
                          )}
                          {onDeleteStudy && ( // Solo mostrar si la prop onDeleteStudy existe
                            <button
                              onClick={() => onDeleteStudy(study.id)}
                              className="p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                              title="Eliminar"
                            >
                              {/* Icono de tacha roja SVG */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyList;