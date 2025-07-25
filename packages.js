const packages = [
  {
    id: "PKG-001",
    name: "PRE-NATAL",
    category: "Paquetes", // Usar 'category' para consistencia
    price: 500.00,
    description: "Paquete de estudios para control prenatal",
    includes: [
      "HEM-001", // Biometría hemática
      "HEM-002", // Grupo sanguíneo
      "QUI-001", // Glucosa (parte de Química sanguínea)
      "QUI-003", // Colesterol (parte de Química sanguínea)
      "QUI-006", // Triglicéridos (parte de Química sanguínea)
      "INM-006", // VDRL
      "INM-005", // HIV
      "URI-001"  // Examen general de orina
    ]
  },
  {
    id: "PKG-002",
    name: "PRE-OPERATORIO",
    category: "Paquetes", // Usar 'category'
    price: 550.00,
    description: "Paquete de estudios para evaluación pre-operatoria",
    includes: [
      "HEM-001", // Biometría hemática
      "COG-001", // Tiempo de protrombina (TP-INR)
      "COG-002", // Tiempo de tromboplastina (TPT)
      "QUI-001", // Glucosa (parte de Química sanguínea)
      "QUI-003", // Colesterol (parte de Química sanguínea)
      "QUI-006", // Triglicéridos (parte de Química sanguínea)
      "INM-005", // HIV
      "HEM-002"  // Grupo sanguíneo
    ]
  },
  {
    id: "PKG-003",
    name: "GUARDERÍA",
    category: "Paquetes", // Usar 'category'
    price: 500.00,
    description: "Paquete de estudios para ingreso a guardería",
    includes: [
      "HEM-001", // Biometría hemática
      "HEM-002", // Grupo sanguíneo
      "PAR-003", // Coproparasitoscópico de 3 muestras
      "MIC-016", // Cultivo exudado faríngeo
      "URI-001"  // Examen general de orina
    ]
  },
  {
    id: "PKG-004",
    name: "GENERAL ADULTO",
    category: "Paquetes", // Usar 'category'
    price: 600.00,
    description: "Paquete de estudios generales para adultos",
    includes: [
      "HEM-001", // Biometría hemática
      "QUI-007", // Ácido úrico
      "QUI-001", // Glucosa (parte de Química sanguínea)
      "QUI-003", // Colesterol
      "MAR-001", // Antígeno prostático (PSA)
      "URI-001"  // Examen general de orina
    ]
  },
  {
    id: "PKG-005",
    name: "INFANTIL",
    category: "Paquetes", // Usar 'category'
    price: 500.00,
    description: "Paquete de estudios generales para niños",
    includes: [
      "HEM-001", // Biometría hemática
      "QUI-001", // Glucosa (parte de Química sanguínea)
      "INM-010", // Reacciones febriles
      "URI-001", // Examen general de orina
      "PAR-004"  // Coprológico
    ]
  },
  {
    id: "PKG-006",
    name: "RIESGO CARDÍACO",
    category: "Paquetes", // Usar 'category'
    price: 400.00,
    description: "Paquete de estudios para evaluar riesgo cardíaco",
    includes: [
      "HEM-001", // Biometría hemática
      "QUI-007", // Ácido úrico
      "QUI-001", // Glucosa (parte de Química sanguínea)
      "QUI-003", // Colesterol
      "QUI-006", // Triglicéridos
      "URI-001"  // Examen general de orina
    ]
  }
];

export default packages;