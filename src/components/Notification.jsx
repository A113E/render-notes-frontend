// Componente para las notificaciones
const Notification = ({message, type}) => {
  // Solo muestra la notificación si hay un mensaje
if (!message) return null;
  const notificationStyle = {
      color: type === 'success' ? 'green': 'red',
      background: 'lightgrey',
      fontSize: '20px',
      border: `1px solid ${type === 'success' ? 'green' : 'red'}`,
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }
  return <div style={notificationStyle}>{message}</div>
}

// Exportar el componente
export default Notification