import { useState, useEffect } from 'react';

// Función para obtener datos del localStorage
export const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error al obtener de localStorage:", error);
    return defaultValue;
  }
};

// Función para establecer datos en el localStorage
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
  }
};

// Hook personalizado para usar localStorage
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageItem(key, defaultValue);
  });

  useEffect(() => {
    setStorageItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

// Función para exportar todos los datos del localStorage a un JSON
export const exportAllDataToJson = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = getStorageItem(key, null);
  }
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jovalabs_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Función para importar datos desde un JSON al localStorage
export const importDataFromJson = (jsonFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        for (const key in data) {
          setStorageItem(key, data[key]);
        }
        resolve();
      } catch (error) {
        console.error("Error al importar datos:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      reject(error);
    };
    reader.readAsText(jsonFile);
  });
};