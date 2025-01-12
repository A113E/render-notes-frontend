// CONTROLADORES DE RUTA
// Creamos una instancia para importar la función Router de Express
const notesRouter = require('express').Router()
// Importamos el modelo Note
const Note = require('../models/note')

// Ruta para obtener todas las notas
notesRouter.get('/', (request, response) => {
  // Usamos el método find para obtener las notas d ela base de datos
  Note.find({}).then(notes => {
    response.json(notes) // El servidor responde con las notas en formato json
  })
})

// Ruta para buscar una nota por su ID
notesRouter.get('/:id', (request, response, next) => {
  // Usamos el método findById para obtener una nota por su ID
  Note.findById(request.params.id) // El 'id' se obtiene de los parámetros de la URL mediante 'request.params.id'
    .then(note => { // Responde con
      // Condicional
      if (note) {
        response.json(note) // Si se encuentra una nota con el 'id' especificado, responde con ella en formato JSON.
      } else { // Si no la encuentra responde
        response.status(404).end() // Estatus No se encontró NO FOUND
      }
    })
    // Manejo de errores
    .catch(error => next(error))
})

// Ruta para crear una nueva nota
notesRouter.post('/', (request, response, next) => {
  // Extraemos el cuerpo de la nota
  const body = request.body

  // Creamos una nueva instancia con la nueva nota creada
  const note = new Note({
    content: body.content, // - 'content': Toma el contenido enviado en la solicitud.
    date: body.date || new Date(), // - 'date': Usa la fecha enviada en la solicitud o genera la fecha actual si no se proporciona.
    important: body.important || false, // - 'important': Usa el valor enviado o, si no se proporciona, lo establece en 'false' por defecto.
  })

  // Intenta guardar la nueva nota en la base de datos.
  note.save()
    .then(savedNote => {
      response.json(savedNote) // Si se guarda con éxito, responde con el objeto de la nota guardada.
    })
  // Manejo de errores
    .catch(error => next(error))
})

// Ruta para eliminar una nota por su ID
notesRouter.delete('/:id', (request, response, next) => {
  // Usamos el método findByIdAndDelete para eliminar por ID
  Note.findByIdAndDelete(request.params.id) // El 'id' se obtiene de los parámetros de la URL mediante 'request.params.id'
    .then(() => { // Si el encuentra la nota y la elimina responde con:
      response.status(202).end() // No content (en ambos casos)
    })
    // Manejo de errores
    .catch(error => next(error))
})

// Ruta para actualizar la importancia de la nota
notesRouter.put('/:id', (request, response, next) => {
  // Contiene el cuerpo de la solicitud enviada por el cliente (en formato JSON).
  const { content, important } = request.body // Extraemos los campos del cuerpo

  // Usamos el Método findByIdAndUpdate para actualizar la nota por su ID
  Note.findByIdAndUpdate(request.params.id,
    { content, important }, // Usamos las propiedades del cuerpo (body)
    {
      new: true, // Indica que queremos el documento actualizado como resultado.
      runValidators: true, // Habilita las validaciones definidas en el modelo de Mongoose
      context: 'query' // Asegura que las validaciones funcionen correctamente en operaciones de actualización.
    }
  )
  // Maneja la resolución exitosa de la promesa.
    .then(updatedNote => {
      response.json(updatedNote) //Responde al cliente con el documento actualizado en formato JSON.
    })
  // Manejo de errores
    .catch(error => next(error)) // Pase el error al middleware de manejo de errores configurado en la aplicación
})

// Exportar el modulo
module.exports = notesRouter