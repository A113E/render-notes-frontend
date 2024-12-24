// Importa los hooks de React que se usarán en el componente.
import { useState, useEffect } from 'react'
// Importa el componente Note, que representa una nota individual.
import Note from './components/Note'
// Importa el componente Notification, que muestra mensajes de error o notificaciones.
import Notification from './components/Notification'
// Importa el componente Footer, que probablemente contiene un pie de página para la aplicación.
import Footer from './components/Footer'
// Importa el servicio noteService, que contiene funciones para interactuar con un servidor (API) relacionado con las notas.
import noteService from './services/notes'

// Define el componente principal de la aplicación.
const App = () => {
  // Estado para almacenar las notas. Inicialmente, es un array vacío.
  const [notes, setNotes] = useState([])
  // Estado para almacenar el contenido de una nueva nota que se está escribiendo.
  const [newNote, setNewNote] = useState('')
  // Estado para alternar entre mostrar todas las notas o solo las importantes.
  const [showAll, setShowAll] = useState(true)
  // Estado para almacenar mensajes de error. Inicialmente, es null (sin mensaje).
  const [errorMessage, setErrorMessage] = useState(null)

  // Hook useEffect: se ejecuta una vez al cargar el componente para obtener todas las notas desde el servidor.
  useEffect(() => {
    noteService
      .getAll() // Llama a la función getAll del servicio para obtener las notas.
      .then(initialNotes => {
        setNotes(initialNotes) // Actualiza el estado con las notas obtenidas.
      })
  }, []) // El array vacío asegura que esto solo se ejecute al montar el componente.

  // Función para manejar la adición de una nueva nota.
  const addNote = (event) => {
    event.preventDefault() // Evita que el formulario recargue la página.
    const noteObject = {
      content: newNote, // Usa el contenido de la nueva nota del estado.
      important: Math.random() > 0.5, // Asigna aleatoriamente si es importante.
    }

    // Llama al servicio para crear la nueva nota en el servidor.
    noteService
      .create(noteObject)
      .then(returnedNote => { // Cuando se crea la nota con éxito:
        setNotes(notes.concat(returnedNote)) // Agrega la nueva nota al estado.
        setNewNote('') // Limpia el campo de entrada.
      })
  }

  // Función para alternar la importancia de una nota específica.
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id) // Encuentra la nota por su ID.
    const changedNote = { ...note, important: !note.important } // Crea una copia con la importancia alternada.

    // Llama al servicio para actualizar la nota en el servidor.
    noteService
      .update(id, changedNote)
      .then(returnedNote => { // Cuando la actualización es exitosa:
        setNotes(notes.map(note => note.id !== id ? note : returnedNote)) // Actualiza la nota en el estado.
      })
      .catch(error => { // Maneja errores si la nota no se encuentra.
        setErrorMessage(`Note '${note.content}' was already removed from server`) // Muestra un mensaje de error.
        setTimeout(() => { // El mensaje desaparece después de 5 segundos.
          setErrorMessage(null)
        }, 5000)
      })
  }

  // Función para manejar los cambios en el campo de entrada para una nueva nota.
  const handleNoteChange = (event) => {
    setNewNote(event.target.value) // Actualiza el estado con el valor del campo de entrada.
  }

  // Calcula las notas a mostrar según el estado de showAll.
  const notesToShow = showAll
    ? notes // Si showAll es true, muestra todas las notas.
    : notes.filter(note => note.important) // Si showAll es false, solo muestra las importantes.

  // El código JSX que define el diseño y funcionalidad del componente.
  return (
    <div>
      <h1>Notes</h1>
      {/* Muestra el componente Notification con el mensaje actual. */}
      <Notification message={errorMessage} />
      <div>
        {/* Botón para alternar entre mostrar todas las notas o solo las importantes. */}
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      {/* Lista de notas. */}
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id} // Cada nota debe tener un key único.
            note={note} // Pasa la nota como propiedad al componente Note.
            toggleImportance={() => toggleImportanceOf(note.id)} // Función para alternar la importancia.
          />
        )}
      </ul>
      {/* Formulario para agregar una nueva nota. */}
      <form onSubmit={addNote}>
        <input
          value={newNote} // Vincula el valor del campo de entrada al estado newNote.
          onChange={handleNoteChange} // Llama a handleNoteChange cuando cambia el valor.
        />
        <button type="submit">save</button> {/* Botón para enviar el formulario. */}
      </form>
      {/* Componente Footer para mostrar el pie de página. */}
      <Footer />
    </div>
  )
}

// Exporta el componente App para ser usado en otros archivos.
export default App
