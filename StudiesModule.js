import React, { useState } from 'react';
import StudyAdd from './StudyAdd';
import StudyList from './StudyList';
import PackageAdd from './PackageAdd';
import PackageList from './PackageList';
import ModalComponent from './ModalComponent'; // Importar el nuevo componente Modal

const StudiesModule = ({
  userStudies, // Estudios que el usuario puede agregar/modificar
  userPackages, // Paquetes que el usuario puede agregar/modificar
  onAddStudy,
  onUpdateStudy,
  onDeleteStudy,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
  fixedStudies // Estudios y paquetes fijos que no se pueden modificar ni eliminar
}) => {
  const [activeTab, setActiveTab] = useState('add'); // 'add' o 'view'
  const [editingStudy, setEditingStudy] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);

  const [isUserStudiesModalOpen, setIsUserStudiesModalOpen] = useState(false);
  const [isUserPackagesModalOpen, setIsUserPackagesModalOpen] = useState(false);

  const handleEditStudy = (study) => {
    setEditingStudy(study);
    setActiveTab('add'); // Cambiar a la pestaña de agregar/editar
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setActiveTab('add'); // Cambiar a la pestaña de agregar/editar
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-200">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 text-lg font-semibold transition-all duration-300 ${
            activeTab === 'add'
              ? 'border-b-4 border-green-600 text-green-800'
              : 'text-gray-600 hover:text-green-700'
          }`}
        >
          Agregar/Editar Estudios y Paquetes
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-6 py-3 text-lg font-semibold transition-all duration-300 ${
            activeTab === 'view'
              ? 'border-b-4 border-green-600 text-green-800'
              : 'text-gray-600 hover:text-green-700'
          }`}
        >
          Ver Estudios Fijos
        </button>
      </div>

      {activeTab === 'add' && (
        <div>
          <StudyAdd
            onAddStudy={onAddStudy}
            onUpdateStudy={onUpdateStudy}
            editingStudy={editingStudy}
            setEditingStudy={setEditingStudy}
          />
          <PackageAdd
            studies={[...fixedStudies.filter(item => item.category !== 'Paquetes'), ...userStudies]} // Pasa todos los estudios (fijos y de usuario) para seleccionar en paquetes
            onAddPackage={onAddPackage}
            onUpdatePackage={onUpdatePackage}
            editingPackage={editingPackage}
            setEditingPackage={setEditingPackage}
          />
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setIsUserStudiesModalOpen(true)}
              className="bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              Ver Estudios Personalizados
            </button>
            <button
              onClick={() => setIsUserPackagesModalOpen(true)}
              className="bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              Ver Paquetes Personalizados
            </button>
          </div>
        </div>
      )}

      {activeTab === 'view' && (
        <div>
          <StudyList
            studies={fixedStudies} // Solo se muestran los estudios fijos
            onEditStudy={() => alert('Este estudio es fijo y no se puede editar.')}
            onDeleteStudy={() => alert('Este estudio es fijo y no se puede eliminar.')}
          />
        </div>
      )}

      {/* Modal para Estudios Personalizados */}
      <ModalComponent
        isOpen={isUserStudiesModalOpen}
        onClose={() => setIsUserStudiesModalOpen(false)}
        title="Estudios Personalizados"
      >
        <StudyList
          studies={userStudies}
          onEditStudy={handleEditStudy}
          onDeleteStudy={onDeleteStudy}
        />
      </ModalComponent>

      {/* Modal para Paquetes Personalizados */}
      <ModalComponent
        isOpen={isUserPackagesModalOpen}
        onClose={() => setIsUserPackagesModalOpen(false)}
        title="Paquetes Personalizados"
      >
        <PackageList
          packages={userPackages}
          studies={[...fixedStudies.filter(item => item.category !== 'Paquetes'), ...userStudies]}
          onEditPackage={handleEditPackage}
          onDeletePackage={onDeletePackage}
        />
      </ModalComponent>
    </div>
  );
};

export default StudiesModule;