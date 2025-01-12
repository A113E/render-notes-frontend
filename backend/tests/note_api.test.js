const { test, after, beforeEach } = require('node:test')
const assert = require('assert') // Asegúrate de tener esta línea si usas assert
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note') // Importa el modelo Note

const api = supertest(app)

// Datos iniciales para las pruebas
const initialNotes = [
  { content: 'HTML is easy', important: false },
  { content: 'Browser can execute only JavaScript', important: true },
]

// Inicializa la base de datos antes de cada prueba
beforeEach(async () => {
    await Note.deleteMany({}) // Borra todas las notas de la base de datos
  
    // Inserta las notas iniciales una por una
    let noteObject = new Note(initialNotes[0])
    await noteObject.save()
  
    noteObject = new Note(initialNotes[1])
    await noteObject.save()
  })

// Ajusta las pruebas para usar initialNotes
test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
  
    // Compara el número de notas devueltas con la longitud de initialNotes
    assert.strictEqual(response.body.length, initialNotes.length)
  })
  
  test('the first note is about HTML', async () => {
    const response = await api.get('/api/notes')
  
    // Verifica que el contenido de la primera nota esté en los datos devueltos
    const contents = response.body.map(note => note.content)
    assert(contents.includes('HTML is easy'))
  })

  after(async () => {
    await mongoose.connection.close()
  })
  
  