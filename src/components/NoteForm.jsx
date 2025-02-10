// Componente para agregar notas (estado, manejo de notas y renderizado del formulario)
// Importa los hooks de React que se usarán en el componente.
import { useState } from 'react'

// Componente NoteForm (formulario)
const NoteForm = ({ createNote }) => {
  // Estado para almacenar el contenido de una nueva nota que se está escribiendo.
const [newNote, setNewNote] = useState('')

// Evento para añadir nuevas notas
const addNote = (event) => {
  event.preventDefault()
  // Intsancia para crear notas
  createNote({
    content: newNote, // Contenido del estado de la nueva nota
    important: true // Define la nota como importante por defecto (true)
  })
  setNewNote('') // Limpia el campo de entrada
}
// El código JSX que define el diseño y funcionalidad del componente.
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm