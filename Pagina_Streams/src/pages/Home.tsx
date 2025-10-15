import React from 'react';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#f8f9fa', color: '#333', fontFamily: 'Arial, sans-serif' }}>
      {/* Encabezado */}
      <header style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#ffffff' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
          Transmite, Conecta y Crece con StreamHub
        </h1>
        <p style={{ fontSize: '18px', color: '#555' }}>
          La plataforma de streaming donde espectadores y streamers se conectan a través de un sistema único de niveles, recompensas y regalos virtuales.
        </p>
        <div style={{ marginTop: '20px' }}>
          <button style={buttonStyle}>Comenzar Ahora</button>
          <button style={buttonStyle}>Iniciar Sesión</button>
        </div>
      </header>

      {/* Sección de características */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px 20px' }}>
        {['Transmisiones en Vivo', 'Sistema de Regalos', 'Niveles y Progreso', 'Comunidad Activa'].map((item, index) => (
          <div key={index} style={cardStyle}>
            <div style={iconStyle}>🔴</div>
            <h3>{item}</h3>
            <p>Descripción breve de {item.toLowerCase()}.</p>
          </div>
        ))}
      </div>

      {/* Llamado a la acción */}
      <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#007bff', color: 'white' }}>
        <h2>¿Listo para comenzar tu aventura?</h2>
        <p>Únete a StreamHub hoy y descubre una nueva forma de conectar con tu audiencia.</p>
        <button style={buttonStyle}>Crear Cuenta Gratis</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#030405ff',
  color: 'red ',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  margin: '10px',
  cursor: 'pointer',
};

const cardStyle : React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '20px',
  textAlign: "center",
  width: '200px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const iconStyle = {
  fontSize: '40px',
  marginBottom: '10px',
};
