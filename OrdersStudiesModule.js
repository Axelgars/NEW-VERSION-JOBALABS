import React, { useState } from 'react';
import StudyAdd from './StudyAdd';
import StudyList from './StudyList';
import PackageAdd from './PackageAdd';
import PackageList from './PackageList';
import OrderCreate from './OrderCreate';
import OrderList from './OrderList';

const OrdersStudiesModule = ({
  patients,
  studies,
  packages,
  convenios,
  orders,
  onAddStudy,
  onUpdateStudy,
  onDeleteStudy,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
  onAddOrder,
  onUpdateOrderStatus,
  logoBase64
}) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' o 'studies'
  const [editingStudy, setEditingStudy] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);

  const handleEditStudy = (study) => {
    setEditingStudy(study);
    setActiveTab('studies'); // Asegurarse de que la pestaña de estudios esté activa
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setActiveTab('studies'); // Asegurarse de que la pestaña de estudios esté activa
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-200">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 text-lg font-semibold transition-all duration-300 ${
            activeTab === 'orders'
              ? 'border-b-4 border-green-600 text-green-800'
              : 'text-gray-600 hover:text-green-700'
          }`}
        >
          Gestión de Órdenes
        </button>
        <button
          onClick={() => setActiveTab('studies')}
          className={`px-6 py-3 text-lg font-semibold transition-all duration-300 ${
            activeTab === 'studies'
              ? 'border-b-4 border-green-600 text-green-800'
              : 'text-gray-600 hover:text-green-700'
          }`}
        >
          Gestión de Estudios y Paquetes
        </button>
      </div>

      {activeTab === 'orders' && (
        <div>
          <OrderCreate
            patients={patients}
            studies={studies}
            packages={packages}
            convenios={convenios}
            onAddOrder={onAddOrder}
          />
          <OrderList
            orders={orders}
            patients={patients}
            studies={studies}
            packages={packages}
            convenios={convenios}
            onUpdateOrderStatus={onUpdateOrderStatus}
            logoBase64={logoBase64}
          />
        </div>
      )}

      {activeTab === 'studies' && (
        <div>
          <StudyAdd
            onAddStudy={onAddStudy}
            onUpdateStudy={onUpdateStudy}
            editingStudy={editingStudy}
            setEditingStudy={setEditingStudy}
          />
          <StudyList
            studies={studies}
            onEditStudy={handleEditStudy}
            onDeleteStudy={onDeleteStudy}
          />
          <PackageAdd
            studies={studies}
            onAddPackage={onAddPackage}
            onUpdatePackage={onUpdatePackage}
            editingPackage={editingPackage}
            setEditingPackage={setEditingPackage}
          />
          <PackageList
            packages={packages}
            studies={studies}
            onEditPackage={handleEditPackage}
            onDeletePackage={onDeletePackage}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersStudiesModule;