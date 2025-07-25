import React, { useState, useEffect } from 'react';
import { formatDate, formatCurrency } from '../utils/helpers';

const CalendarView = ({ orders, patients, studies, packages, onDeleteOrder, dailyProfits }) => { // Recibir dailyProfits
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getStartDayOfWeek = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.
  };

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const ordersWithAppointments = orders.filter(order => order.appointmentDate);

  const appointmentsByDate = ordersWithAppointments.reduce((acc, order) => {
    const dateKey = order.appointmentDate; // Assuming appointmentDate is 'YYYY-MM-DD'
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(order);
    return acc;
  }, {});

  const renderCalendarDays = () => {
    const days = getDaysInMonth(currentMonth);
    const startDay = getStartDayOfWeek(currentMonth);
    const calendarDays = [];

    // Fill leading empty days
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2 text-center text-gray-400"></div>);
    }

    // Fill days with dates
    days.forEach(day => {
      const dateKey = day.toISOString().split('T')[0];
      const hasAppointments = appointmentsByDate[dateKey] && appointmentsByDate[dateKey].length > 0;
      const isToday = day.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

      calendarDays.push(
        <div
          key={dateKey}
          className={`p-2 text-center rounded-lg cursor-pointer transition-colors duration-200
            ${isToday ? 'bg-green-200 font-bold' : ''}
            ${isSelected ? 'bg-green-400 text-white' : 'hover:bg-green-100'}
            ${hasAppointments ? 'border-2 border-green-600' : ''}
          `}
          onClick={() => setSelectedDate(day)}
        >
          {day.getDate()}
          {hasAppointments && (
            <div className="text-xs text-green-700 font-semibold mt-1">
              {appointmentsByDate[dateKey].length} citas
            </div>
          )}
        </div>
      );
    });

    return calendarDays;
  };

  // Resumen rápido para el día actual
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointmentsByDate[today] ? appointmentsByDate[today].length : 0;
  const todayRevenue = dailyProfits[today] ? dailyProfits[today] : 0;
  const pendingOrdersCount = orders.filter(order => order.status === 'pendiente').length;


  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Agenda de Citas</h3>

      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
          &lt;
        </button>
        <h4 className="text-xl font-semibold text-gray-800">
          {currentMonth.toLocaleString('es-MX', { month: 'long', year: 'numeric' })}
        </h4>
        <button onClick={nextMonth} className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-gray-600 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 border border-green-300 rounded-xl bg-green-50">
          <h4 className="text-xl font-bold text-gray-800 mb-3">Citas para {formatDate(selectedDate.toISOString().split('T')[0])}</h4>
          {appointmentsByDate[selectedDate.toISOString().split('T')[0]] && appointmentsByDate[selectedDate.toISOString().split('T')[0]].length > 0 ? (
            <ul>
              {appointmentsByDate[selectedDate.toISOString().split('T')[0]]
                .sort((a, b) => (a.appointmentTime || '').localeCompare(b.appointmentTime || '')) // Ordenar por hora
                .map(order => {
                const patient = patients.find(p => p.id === order.patientId);
                const studyNames = order.studies.map(sId => studies.find(s => s.id === sId)?.name).filter(Boolean).join(', ');
                const packageNames = order.packages.map(pId => packages.find(p => p.id === pId)?.name).filter(Boolean).join(', ');
                const allItems = [studyNames, packageNames].filter(Boolean).join(', ');

                return (
                  <li key={order.id} className="mb-2 p-2 bg-white rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {order.appointmentTime ? `${order.appointmentTime} - ` : ''}
                        Paciente: {patient ? `${patient.name} ${patient.lastName}` : 'Desconocido'}
                      </p>
                      <p className="text-gray-600 text-sm">Orden ID: {order.id}</p>
                      <p className="text-gray-600 text-sm">Estudios/Paquetes: {allItems || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                      title="Eliminar Cita"
                    >
                      {/* Icono de tacha roja SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600">No hay citas agendadas para esta fecha.</p>
          )}
        </div>
      )}

      {/* Nuevo módulo de resumen rápido */}
      <div className="mt-8 p-6 bg-blue-50 rounded-2xl shadow-xl border border-blue-200">
        <h4 className="text-2xl font-bold text-blue-800 mb-4">Resumen Rápido del Día</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center">
            <p className="text-3xl font-extrabold text-blue-700">{todayAppointments}</p>
            <p className="text-md text-blue-600 font-semibold">Citas para Hoy</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center">
            <p className="text-3xl font-extrabold text-green-700">{formatCurrency(todayRevenue)}</p>
            <p className="text-md text-green-600 font-semibold">Ganancias de Hoy</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center">
            <p className="text-3xl font-extrabold text-yellow-700">{pendingOrdersCount}</p>
            <p className="text-md text-yellow-600 font-semibold">Órdenes Pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;