// Importa la librería Axios, que se utiliza para realizar solicitudes HTTP de manera sencilla.
import axios from 'axios'

// Define la URL base para todas las solicitudes relacionadas con las notas.
// '/api/notes' indica que las solicitudes se enviarán a esta ruta en el servidor.
const baseUrl = '/api/notes'

// Función para obtener todas las notas desde el servidor.
const getAll = () => {
  // Realiza una solicitud GET a la URL base para obtener los datos.
  const request = axios.get(baseUrl)
  // Devuelve una promesa que extrae la propiedad `data` de la respuesta del servidor.
  return request.then(response => response.data)
}

// Función para crear una nueva nota en el servidor.
const create = newObject => {
  // Realiza una solicitud POST a la URL base, enviando el nuevo objeto como cuerpo de la solicitud.
  const request = axios.post(baseUrl, newObject)
  // Devuelve una promesa que extrae la propiedad `data` de la respuesta del servidor.
  return request.then(response => response.data)
}

// Función para actualizar una nota existente en el servidor.
const update = (id, newObject) => {
  // Realiza una solicitud PUT a una URL específica (`/api/notes/:id`), enviando el objeto actualizado como cuerpo.
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  // Devuelve una promesa que extrae la propiedad `data` de la respuesta del servidor.
  return request.then(response => response.data)
}

// Exporta las funciones `getAll`, `create`, y `update` como un objeto.
// Esto permite importarlas fácilmente desde otros archivos como parte de `noteService`.
export default { 
  getAll, // Exporta la función para obtener todas las notas.
  create, // Exporta la función para crear una nueva nota.
  update  // Exporta la función para actualizar una nota existente.
}

