import React, { useEffect, useRef } from 'react';
import { formatCurrency } from '../utils/helpers';

const DashboardView = ({ orders, studies, packages, convenios, dailyProfits, historicalOrders }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const monthlyStudiesChartRef = useRef(null);
  const monthlyStudiesChartInstance = useRef(null);

  // Destruir instancias de Chart.js al desmontar el componente
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      if (monthlyStudiesChartInstance.current) {
        monthlyStudiesChartInstance.current.destroy();
      }
    };
  }, []);

  // Gráfico de Ganancias Diarias
  useEffect(() => {
    if (window.Chart && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const labels = Object.keys(dailyProfits).sort();
      const data = labels.map(date => dailyProfits[date]);

      chartInstance.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Ganancias Diarias',
            data: data,
            backgroundColor: [
              '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#F44336',
              '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Ganancias Diarias (Órdenes Entregadas)',
              font: {
                size: 18,
                weight: 'bold'
              },
              color: '#333'
            }
          }
        }
      });
    }
  }, [dailyProfits]);

  // Gráfico de Estudios Realizados por Mes y Categoría
  useEffect(() => {
    if (window.Chart && monthlyStudiesChartRef.current) {
      const ctx = monthlyStudiesChartRef.current.getContext('2d');

      if (monthlyStudiesChartInstance.current) {
        monthlyStudiesChartInstance.current.destroy();
      }

      // Calcular estudios por mes y categoría
      const monthlyStudyCounts = {}; // { 'YYYY-MM': { 'CATEGORY': count, ... } }

      historicalOrders.forEach(order => {
        const month = order.date.substring(0, 7); // YYYY-MM
        if (!monthlyStudyCounts[month]) {
          monthlyStudyCounts[month] = {};
        }

        // Procesar estudios individuales
        order.studies.forEach(studyId => {
          const study = studies.find(s => s.id === studyId);
          if (study) {
            const category = study.category || study.type || 'Sin Categoría';
            monthlyStudyCounts[month][category] = (monthlyStudyCounts[month][category] || 0) + 1;
          }
        });
        // Procesar estudios dentro de paquetes
        order.packages.forEach(packageId => {
          const pkg = packages.find(p => p.id === packageId);
          if (pkg && pkg.includes) {
            pkg.includes.forEach(studyId => {
              const study = studies.find(s => s.id === studyId);
              if (study) {
                const category = study.category || study.type || 'Sin Categoría';
                monthlyStudyCounts[month][category] = (monthlyStudyCounts[month][category] || 0) + 1;
              }
            });
          }
        });
      });

      const months = Object.keys(monthlyStudyCounts).sort();
      const allCategories = [...new Set(studies.map(s => s.category || s.type).filter(Boolean))].sort();

      const datasets = allCategories.map((category, index) => {
        const data = months.map(month => monthlyStudyCounts[month][category] || 0);
        const colors = [
          'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(201, 203, 207, 0.6)',
          'rgba(70, 130, 180, 0.6)', 'rgba(210, 105, 30, 0.6)', 'rgba(128, 0, 128, 0.6)',
          'rgba(0, 128, 128, 0.6)', 'rgba(128, 128, 0, 0.6)', 'rgba(0, 0, 128, 0.6)'
        ];
        return {
          label: category,
          data: data,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length].replace('0.6', '1'),
          borderWidth: 1
        };
      });

      monthlyStudiesChartInstance.current = new window.Chart(monthlyStudiesChartRef.current, {
        type: 'bar',
        data: {
          labels: months,
          datasets: datasets
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Mes'
              }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              title: {
                display: true,
                text: 'Número de Estudios'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Estudios Realizados por Mes y Categoría',
              font: {
                size: 18,
                weight: 'bold'
              },
              color: '#333'
            }
          }
        }
      });
    }
  }, [historicalOrders, studies, packages]);

  const totalPending = orders.filter(o => o.status === 'pendiente').length;
  const totalDelivered = orders.filter(o => o.status === 'entregado').length;

  const totalRevenue = Object.values(dailyProfits).reduce((sum, profit) => sum + profit, 0);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de JovaLabs</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-5 rounded-xl shadow-md flex flex-col items-center justify-center">
          <p className="text-4xl font-extrabold text-blue-700">{totalPending}</p>
          <p className="text-lg text-blue-600 font-semibold">Órdenes Pendientes</p>
        </div>
        <div className="bg-green-50 p-5 rounded-xl shadow-md flex flex-col items-center justify-center">
          <p className="text-4xl font-extrabold text-green-700">{totalDelivered}</p>
          <p className="text-lg text-green-600 font-semibold">Órdenes Entregadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Ganancias Totales (Entregadas)</h4>
          <p className="text-5xl font-extrabold text-green-700">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow-md">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <canvas ref={monthlyStudiesChartRef}></canvas>
      </div>
    </div>
  );
};

export default DashboardView;