import React from 'react';

const LayoutHeader = ({ onNavigate, currentPage, onExport, onImport, onSendAllDataToServer }) => {
  const navItems = [
    { name: 'Inicio', page: 'home' },
    { name: 'Pacientes', page: 'patients' },
    { name: 'Órdenes', page: 'orders' },
    { name: 'Estudios', page: 'studies' },
    { name: 'Convenios', page: 'convenios' },
    { name: 'Historial', page: 'history' }
  ];

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <img src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0lh9MhIXbcAaSYNqKr0LMw3z9nWTuy4eIjixU" alt="JovaLabs Logo" className="h-12 object-contain mr-2" />
      </div>
      <nav className="flex space-x-4">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
              ${currentPage === item.page ? 'bg-white text-green-800 shadow-md' : 'hover:bg-green-700 hover:text-white'}`}
          >
            {item.name}
          </button>
        ))}
      </nav>
      <div className="flex space-x-2">
        <button
          onClick={onExport}
          className="px-4 py-2 rounded-full bg-white text-green-800 text-sm font-medium hover:bg-gray-100 transition-all duration-300 shadow-md"
        >
          Exportar Datos
        </button>
        <input
          type="file"
          id="importFile"
          className="hidden"
          accept=".json"
          onChange={onImport}
        />
        <label
          htmlFor="importFile"
          className="px-4 py-2 rounded-full bg-white text-green-800 text-sm font-medium hover:bg-gray-100 transition-all duration-300 shadow-md cursor-pointer"
        >
          Importar Datos
        </label>
        <button
          onClick={onSendAllDataToServer}
          className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all duration-300 shadow-md"
        >
          Enviar Todo al Servidor
        </button>
      </div>
    </header>
  );
};

export default LayoutHeader;