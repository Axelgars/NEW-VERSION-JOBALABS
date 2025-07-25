import React, { useState } from 'react';

const AuthLogin = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinInput = (value) => {
    if (pin.length < 4) {
      setPin(prevPin => prevPin + value);
      setError(''); // Limpiar error al empezar a escribir
    }
  };

  const handleDelete = () => {
    setPin(prevPin => prevPin.slice(0, -1));
    setError(''); // Limpiar error al borrar
  };

  const handleLogin = () => {
    if (pin === '5212') {
      onLoginSuccess();
    } else {
      setError('PIN incorrecto. ¡Intenta de nuevo, campeón!');
      setPin(''); // Limpiar PIN para reintentar
    }
  };

  const renderPinDots = () => {
    return (
      <div className="flex justify-center space-x-2 mb-6">
        {[0, 1, 2, 3].map(index => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full border-2 border-green-500 transition-colors duration-200 ${
              pin.length > index ? 'bg-green-500' : 'bg-white'
            }`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-center mb-8">
          <img src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0lh9MhIXbcAaSYNqKr0LMw3z9nWTuy4eIjixU" alt="JovaLabs Logo" className="h-24 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Ingresa tu PIN</h2>
        
        {renderPinDots()}

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handlePinInput(num.toString())}
              className="bg-gray-200 text-gray-800 font-bold py-4 rounded-xl text-2xl hover:bg-gray-300 transition-colors duration-200 shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="bg-red-200 text-red-800 font-bold py-4 rounded-xl text-2xl hover:bg-red-300 transition-colors duration-200 shadow-sm"
          >
            {/* Icono de borrar */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 3l3.532 3.532M21 21l-3.532-3.532M3 21l3.532-3.532M21 3l-3.532 3.532M6.532 6.532L12 12l-5.468 5.468M17.468 6.532L12 12l5.468 5.468" />
            </svg>
          </button>
          <button
            onClick={() => handlePinInput('0')}
            className="bg-gray-200 text-gray-800 font-bold py-4 rounded-xl text-2xl hover:bg-gray-300 transition-colors duration-200 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleLogin}
            className="bg-green-500 text-white font-bold py-4 rounded-xl text-2xl hover:bg-green-600 transition-colors duration-200 shadow-sm"
          >
            {/* Icono de check */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;