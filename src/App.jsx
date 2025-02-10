// Importa los hooks de React que se usarán en el componente.
import { useState, useEffect, useRef } from 'react'
// Importa el componente Note, que representa una nota individual.
import Note from './components/Note'
// Importa el componente Notification, que muestra mensajes de error o notificaciones.
import Notification from './components/Notification'
// Importa el componente Footer, que probablemente contiene un pie de página para la aplicación.
import Footer from './components/Footer'
// Importa el componente FormLogin, formulario de logeo
import LoginForm from './components/LoginForm'
// Importa el componente FormNote, formulario para agregar notas
import NoteForm from './components/NoteForm'
// Importa el componente Togglable que permite alternar la visibilidad de su contenido (cualquier componente que le pases como children).
import Togglable from './components/Togglable'
// Importa el servicio noteService, que contiene funciones para interactuar con un servidor (API) relacionado con las notas.
import noteService from './services/notes'
// Importa el servicio loginService, que contiene las funciones para interactuar con un servidor (API) para que los usuarios inicien sesión
import loginService from './services/login'


// Define el componente principal de la aplicación.
const App = () => {
  // Estado para almacenar las notas. Inicialmente, es un array vacío.
  const [notes, setNotes] = useState([])
  // Estado para alternar entre mostrar todas las notas o solo las importantes.
  const [showAll, setShowAll] = useState(true)
 // Creamos el estado para mostrar Notificaciones
 const [notification, setNotification] = useState({message: '', type:''}) // Toma dos parámetros el mensaje y tipo
  // Estado para almacenar los usuarios logeados (null)
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  

  const noteFormRef = useRef() // Mecanismo de ref de React, que ofrece una referencia al componente.

  // Hook useEffect: se ejecuta una vez al cargar el componente para obtener todas las notas desde el servidor (async/await).
  useEffect(() => {
    // Función asincrónica
    const fetchNotes = async () => {
      const initialNotes = await noteService.getAll() // Espera la respuesta del servidor
      setNotes(initialNotes) // Cambiamos el estado con las notas obtenidas
    }
    fetchNotes() // LLamamos a la función asincrónicas
  }, []) // El array vacío asegura que esto solo se ejecute al montar el componente.

  // Hook  useEffect:  se ejecuta una vez al cargar el componente la aplicación verifique si los detalles de un usuario que inició sesión ya se pueden encontrar en el local storage.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, []) // El array vacío como parámetro del effect hook asegura que el hook se ejecute solo cuando el componente es renderizado por primera vez

  // Función para manejar las notificaciones
  const showNotification = (message, type) => {
    setNotification({message, type})
    setTimeout(() => {
      setNotification({message: '', type: ''})
    }, 5000)
  }

// Función para manejar la adición de una nueva nota.
const addNote = async (noteObject) => {
  try {
    noteFormRef.current.toggleVisibility() // Ocultar el formulario llamando a noteFormRef.current.toggleVisibility() después de que se haya creado una nueva nota
    // Llama al servicio para crear la nueva nota en el servidor.
    const returnedNote = await noteService.create(noteObject)

    // Agrega la nueva nota al estado y limpia el campo de entrada.
    setNotes(notes.concat(returnedNote))

    // Notificación de éxito
    showNotification('Nota agregada exitosamente', 'success')
  } catch (exception) {
    // Notificación de error más específica
    showNotification('Error al agregar la nota. Inténtalo de nuevo.', 'error')
    console.error('Error al agregar la nota:', exception)
  }
}
   

  // Función para alternar la importancia de una nota específica.
const toggleImportanceOf = async (id) => {
  const note = notes.find(n => n.id === id) // Encuentra la nota por su ID.

  if (!note) {
    showNotification(`La nota con ID ${id} no existe.`, 'error')
    return
  }

  try {
    const changedNote = { ...note, important: !note.important } // Crea una copia con la importancia alternada.

    // Llama al servicio para actualizar la nota en el servidor.
    const returnedNote = await noteService.update(id, changedNote)

    // Actualiza la nota en el estado.
    setNotes(notes.map(n => n.id !== id ? n : returnedNote))
  } catch (exception) {
    showNotification(`La nota '${note.content}' ya fue eliminada del servidor.`, 'error') // Notificación de error
    console.error('Error al actualizar la nota:', exception)
  }
}

  
  
  

 

  // Calcula las notas a mostrar según el estado de showAll.
  const notesToShow = showAll
    ? notes // Si showAll es true, muestra todas las notas.
    : notes.filter(note => note.important) // Si showAll es false, solo muestra las importantes.

    // Función para eliminar notas
const handleDelete = async (id) => {
  
    try {
    const noteToDelete = notes.find(note => note.id === id)

    if(!noteToDelete) {
      showNotification('Note not found. Please refresh and try again.', 'error')
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar la nota: "${noteToDelete.content}"?`)) {
      await noteService.remove(id) // Elimina la nota en el servidor

      // Actualiza el estado eliminando la nota
      setNotes(notes.filter(note => note.id !== id))

      // Notificación de éxito
      showNotification(`Nota "${noteToDelete.content}" eliminada exitosamente.`, 'success')
    }
  } catch (exception) {
    // Notificación de error en caso de fallo
    showNotification(`Error al eliminar la nota. Inténtalo de nuevo.`, 'error')
    console.error('Error al eliminar la nota:', exception)
  }
}

      
  

    // Función para manejar el inicio de sesión (Login)
    const handleLogin = async ({ username, password }) => {
      try {
        const user = await loginService.login({ username, password })
    
        window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
        noteService.setToken(user.token)
        setUser(user)
        showNotification(`Welcome back, ${user.name || user.username}!`, 'success')
      } catch (exception) {
        showNotification('Invalid username or password. Please try again.', 'error')
        console.error('Login error:', exception)
      }
    }
        
  // El código JSX que define el diseño y funcionalidad del componente.
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={notification.message} type={notification.type}/>  

      {!user && 
      <LoginForm
      userLogged={handleLogin}
      loginVisible={loginVisible}
      setLoginVisible={setLoginVisible}
    />}
      {user && <div>
       <p>{user.name} logged in</p>
       <Togglable buttonLabel="new note" ref={noteFormRef}>
       <NoteForm createNote={addNote} />
      </Togglable>
      </div>
     } 

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            onDelete={handleDelete}
          />
        )}
      </ul>
      <Footer />
    </div>
  )
}
  


// Exporta el componente App para ser usado en otros archivos.
export default App
