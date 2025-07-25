import React, { useState, useEffect } from 'react';
import { useLocalStorage, exportAllDataToJson, importDataFromJson } from './utils/storage';
import { calculateOrderTotal, applyConvenioDiscount, getBase64Image } from './utils/helpers';
import AuthLogin from './components/AuthLogin';
import LayoutHeader from './components/LayoutHeader';
import PatientAdd from './components/PatientAdd';
import PatientList from './components/PatientList';
import ConvenioAdd from './components/ConvenioAdd';
import ConvenioList from './components/ConvenioList';
import OrderCreate from './components/OrderCreate';
import OrderList from './components/OrderList';
import StudiesModule from './components/StudiesModule';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import CalendarView from './components/CalendarView'; // Importar el nuevo componente de calendario

import initialTests from './mock/tests';
import initialPackages from './mock/packages';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // Cambiado a 'home' como página inicial
  const [logoBase64, setLogoBase64] = useState('');

  // Estados para la edición de pacientes y convenios
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingConvenio, setEditingConvenio] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null); // Nuevo estado para la edición de órdenes

  // Los estudios fijos que no se pueden modificar ni eliminar
  // Asegurar que 'type' sea 'category' para los estudios individuales
  const fixedStudiesData = initialTests.map(test => ({ ...test, type: test.category }));
  // Asegurar que 'type' sea 'Paquetes' para los paquetes fijos
  const fixedPackagesData = initialPackages.map(pkg => ({ ...pkg, type: 'Paquetes' }));
  
  // Combinar todos los estudios y paquetes fijos para pasarlos al StudiesModule
  const allFixedItems = [...fixedStudiesData, ...fixedPackagesData];

  // Los estudios y paquetes que el usuario puede agregar/modificar
  const [userStudies, setUserStudies] = useLocalStorage('jovalabs_user_studies', []);
  const [userPackages, setUserPackages] = useLocalStorage('jovalabs_user_packages', []);

  // Combinar estudios fijos y de usuario para pasarlos a los componentes que los necesiten (ej. OrderCreate)
  const allStudies = [...fixedStudiesData, ...userStudies];
  const allPackages = [...fixedPackagesData, ...userPackages];


  const [patients, setPatients] = useLocalStorage('jovalabs_patients', []);
  const [convenios, setConvenios] = useLocalStorage('jovalabs_convenios', []);
  const [orders, setOrders] = useLocalStorage('jovalabs_orders', []);
  const [historicalOrders, setHistoricalOrders] = useLocalStorage('jovalabs_historical_orders', []);
  const [dailyProfits, setDailyProfits] = useLocalStorage('jovalabs_daily_profits', {});

  useEffect(() => {
    // Cargar Chart.js dinámicamente
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      console.log('Chart.js cargado');
    };
    document.body.appendChild(script);

    // Cargar jsPDF dinámicamente
    const scriptPdf = document.createElement('script');
    scriptPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    scriptPdf.onload = () => {
      console.log('jsPDF cargado');
    };
    document.body.appendChild(scriptPdf);

    // Cargar logo en base64
    getBase64Image('https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0lh9MhIXbcAaSYNqKr0LMw3z9nWTuy4eIjixU', (base64) => {
      setLogoBase64(base64);
    });

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(scriptPdf);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleAddPatient = (newPatient) => {
    setPatients([...patients, newPatient]);
  };

  const handleUpdatePatient = (updatedPatient) => {
    setPatients(patients.map(patient =>
      patient.id === updatedPatient.id ? updatedPatient : patient
    ));
  };

  const handleDeletePatient = (patientId) => {
    setPatients(patients.filter(patient => patient.id !== patientId));
  };

  const handleAddUserStudy = (newStudy) => {
    setUserStudies([...userStudies, newStudy]);
  };

  const handleUpdateUserStudy = (updatedStudy) => {
    setUserStudies(userStudies.map(study =>
      study.id === updatedStudy.id ? updatedStudy : study
    ));
  };

  const handleDeleteUserStudy = (studyId) => {
    setUserStudies(userStudies.filter(study => study.id !== studyId));
  };

  const handleAddUserPackage = (newPackage) => {
    setUserPackages([...userPackages, newPackage]);
  };

  const handleUpdateUserPackage = (updatedPackage) => {
    setUserPackages(userPackages.map(pkg =>
      pkg.id === updatedPackage.id ? updatedPackage : pkg
    ));
  };

  const handleDeleteUserPackage = (packageId) => {
    setUserPackages(userPackages.filter(pkg => pkg.id !== packageId));
  };

  const handleAddConvenio = (newConvenio) => {
    setConvenios([...convenios, newConvenio]);
  };

  const handleUpdateConvenio = (updatedConvenio) => {
    setConvenios(convenios.map(convenio =>
      convenio.id === updatedConvenio.id ? updatedConvenio : convenio
    ));
  };

  const handleDeleteConvenio = (convenioId) => {
    setConvenios(convenios.filter(convenio => convenio.id !== convenioId));
  };

  const handleAddOrder = (newOrder) => {
    // Si la orden ya existe (estamos editando), la actualizamos
    if (orders.some(order => order.id === newOrder.id)) {
      setOrders(orders.map(order => order.id === newOrder.id ? newOrder : order));
    } else { // Si no, es una nueva orden
      setOrders([...orders, newOrder]);
    }
    setEditingOrder(null); // Limpiar el estado de edición después de añadir/actualizar
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      if (newStatus === 'entregado') {
        const deliveredOrder = updatedOrders.find(order => order.id === orderId);
        if (deliveredOrder) {
          const totalAmount = calculateOrderTotal(deliveredOrder, allStudies, allPackages);
          const finalAmount = applyConvenioDiscount(totalAmount, deliveredOrder.convenioId, convenios);

          setDailyProfits(prevProfits => {
            const today = new Date().toISOString().split('T')[0];
            return {
              ...prevProfits,
              [today]: (prevProfits[today] || 0) + finalAmount
            };
          });

          // Solo añadir al historial si no está ya en él (para evitar duplicados)
          setHistoricalOrders(prevHistory => {
            if (!prevHistory.some(histOrder => histOrder.id === deliveredOrder.id)) {
              return [...prevHistory, deliveredOrder];
            }
            return prevHistory;
          });
          
          // Eliminar la orden de la lista de órdenes activas
          return updatedOrders.filter(order => order.id !== orderId);
        }
      }
      return updatedOrders;
    });
  };

  const handleDeleteHistoricalOrder = (orderId) => {
    // Filtrar el historial para eliminar la orden por su ID
    setHistoricalOrders(prevHistory => prevHistory.filter(order => order.id !== orderId));
  };

  // Función para simular el envío de TODOS los datos al servidor
  const handleSendAllDataToServer = async () => {
    const dataToSend = {
      patients: patients,
      studies: [...fixedStudiesData, ...userStudies], // Enviar todos los estudios
      packages: [...fixedPackagesData, ...userPackages], // Enviar todos los paquetes
      convenios: convenios,
      orders: orders,
      historicalOrders: historicalOrders,
      dailyProfits: dailyProfits
    };

    console.log("Simulando envío de TODOS los datos al servidor:", dataToSend);
    
    // Simular una llamada a la API
    try {
      // Aquí iría tu llamada fetch real a tu API
      // const response = await fetch('/api/saveAllData', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(dataToSend),
      // });

      // Simulación de respuesta exitosa o fallida
      const success = Math.random() > 0.2; // 80% de éxito, 20% de fallo
      
      if (success) {
        alert("¡Éxito! Todos los datos han sido enviados al servidor (simulado).");
        console.log("Respuesta simulada del servidor: Datos guardados correctamente.");
      } else {
        throw new Error("Error simulado al enviar datos al servidor.");
      }
    } catch (error) {
      alert(`¡Error! No se pudieron enviar los datos al servidor (simulado). Detalles: ${error.message}`);
      console.error("Error al enviar datos al servidor (simulado):", error);
    }
  };


  const handleExportData = () => {
    exportAllDataToJson();
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      importDataFromJson(file)
        .then(() => {
          alert('Datos importados con éxito. ¡Tu información está a salvo!');
          // Recargar la página para que los cambios de localStorage se reflejen
          window.location.reload();
        })
        .catch(error => {
          alert('Error al importar datos. Asegúrate de que el archivo sea un JSON válido.');
          console.error(error);
        });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': // Nueva página de inicio
        return (
          <CalendarView orders={orders} patients={patients} studies={allStudies} packages={allPackages} onDeleteOrder={handleDeleteOrder} dailyProfits={dailyProfits} />
        );
      case 'patients':
        return (
          <>
            <PatientAdd onAddPatient={handleAddPatient} onUpdatePatient={handleUpdatePatient} editingPatient={editingPatient} setEditingPatient={setEditingPatient} />
            <PatientList patients={patients} onEditPatient={setEditingPatient} onDeletePatient={handleDeletePatient} />
          </>
        );
      case 'orders':
        return (
          <>
            <OrderCreate
              patients={patients}
              studies={allStudies}
              packages={allPackages}
              convenios={convenios}
              onAddOrder={handleAddOrder}
              editingOrder={editingOrder} // Pasar la orden que se está editando
              setEditingOrder={setEditingOrder} // Pasar la función para limpiar el estado de edición
            />
            <OrderList
              orders={orders}
              patients={patients}
              studies={allStudies}
              packages={allPackages}
              convenios={convenios}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              logoBase64={logoBase64}
              onEditOrder={setEditingOrder} // Pasar la función para iniciar la edición
            />
          </>
        );
      case 'studies':
        return (
          <StudiesModule
            userStudies={userStudies}
            userPackages={userPackages}
            onAddStudy={handleAddUserStudy}
            onUpdateStudy={handleUpdateUserStudy}
            onDeleteStudy={handleDeleteUserStudy}
            onAddPackage={handleAddUserPackage}
            onUpdatePackage={handleUpdateUserPackage}
            onDeletePackage={handleDeleteUserPackage}
            fixedStudies={allFixedItems}
          />
        );
      case 'convenios':
        return (
          <>
            <ConvenioAdd onAddConvenio={handleAddConvenio} onUpdateConvenio={handleUpdateConvenio} editingConvenio={editingConvenio} setEditingConvenio={setEditingConvenio} />
            <ConvenioList convenios={convenios} onEditConvenio={setEditingConvenio} onDeleteConvenio={handleDeleteConvenio} />
          </>
        );
      case 'dashboard':
        return (
          <DashboardView
            orders={orders}
            studies={allStudies}
            packages={allPackages}
            convenios={convenios}
            dailyProfits={dailyProfits}
            historicalOrders={historicalOrders} // Pasar historicalOrders para el nuevo gráfico
          />
        );
      case 'history':
        return (
          <HistoryView
            historicalOrders={historicalOrders}
            patients={patients}
            studies={allStudies}
            packages={allPackages}
            convenios={convenios}
            onDeleteHistoricalOrder={handleDeleteHistoricalOrder}
            logoBase64={logoBase64} // Pasar logoBase64 para imprimir ticket
          />
        );
      default:
        return <CalendarView orders={orders} patients={patients} studies={allStudies} packages={allPackages} onDeleteOrder={handleDeleteOrder} dailyProfits={dailyProfits} />;
    }
  };

  if (!isLoggedIn) {
    return <AuthLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center bg-fixed font-sans"
      style={{ backgroundImage: `url('https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0JBsu93ipYIkKhaEN0eCX7zGogwrU3sn8TcHm')` }}
    >
      <LayoutHeader
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        onExport={handleExportData}
        onImport={handleImportData}
        onSendAllDataToServer={handleSendAllDataToServer} // Pasar la función al LayoutHeader
      />
      <main className="p-6">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;