import React, { useState } from 'react';
import { formatDate, formatCurrency, calculateOrderTotal, applyConvenioDiscount, generateReceiptPdf } from '../utils/helpers';

const HistoryView = ({ historicalOrders, patients, studies, packages, convenios, onDeleteHistoricalOrder, logoBase64, onSendHistoricalOrdersToServer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'completado': return 'bg-blue-100 text-blue-800';
      case 'entregado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = historicalOrders.filter(order => {
    const patient = patients.find(p => p.id === order.patientId);
    const patientName = patient ? `${patient.name} ${patient.lastName}`.toLowerCase() : '';
    const orderId = order.id.toLowerCase();

    return (
      (searchTerm === '' || patientName.includes(searchTerm.toLowerCase()) || orderId.includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || order.status === filterStatus)
    );
  });

  const handleGenerateReceipt = (order) => {
    const patient = patients.find(p => p.id === order.patientId);
    if (patient) {
      generateReceiptPdf(order, patient, studies, packages, convenios, logoBase64);
    } else {
      alert('Paciente no encontrado para generar el recibo.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Historial Completo de Órdenes</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por paciente o ID de orden..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
          <option value="entregado">Entregado</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No hay órdenes en el historial que coincidan con tu búsqueda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID Orden</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Paciente</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Estudios/Paquetes</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const patient = patients.find(p => p.id === order.patientId);
                const totalAmount = calculateOrderTotal(order, studies, packages);
                const finalAmount = applyConvenioDiscount(totalAmount, order.convenioId, convenios);

                return (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-green-50 transition-colors duration-200">
                    <td className="py-3 px-4 text-sm text-gray-800">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{patient ? `${patient.name} ${patient.lastName}` : 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{formatDate(order.date)}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {order.studies.map(sId => studies.find(s => s.id === sId)?.name).filter(Boolean).join(', ')}
                      {order.packages.length > 0 && (order.studies.length > 0 ? ', ' : '')}
                      {order.packages.map(pId => packages.find(p => p.id === pId)?.name).filter(Boolean).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">{formatCurrency(finalAmount)}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 flex space-x-2">
                      <button
                        onClick={() => onDeleteHistoricalOrder(order.id)}
                        className="p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                        title="Eliminar del Historial"
                      >
                        {/* Icono de tacha roja SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleGenerateReceipt(order)}
                        className="p-1 rounded-full hover:bg-purple-100 transition-colors duration-200"
                        title="Generar Recibo PDF"
                      >
                        {/* Icono de PDF SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            onClick={onSendHistoricalOrdersToServer}
            className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md"
          >
            Enviar Historial al Servidor
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryView;