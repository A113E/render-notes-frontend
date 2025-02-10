// Importa la librería Axios, que se utiliza para realizar solicitudes HTTP de manera sencilla.
import axios from 'axios'

// Define la URL base para todas las solicitudes relacionadas con las notas.
// '/api/notes' indica que las solicitudes se enviarán a esta ruta en el servidor.
const baseUrl = '/api/notes'

// Variable privada
let token = null

// Definimos la funcion para cambiar el valor de la variable privada token
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Función para obtener todas las notas desde el servidor.
const getAll = async () => {
  // Realiza una solicitud GET a la URL base para obtener los datos.
  const response = await axios.get(baseUrl)
  // Devuelve una promesa que extrae la propiedad `data` de la respuesta del servidor.
  return response.data
}

// Función para crear una nueva nota en el servidor. (Usando async/await)
const create = async newObject => {
  // Establece el token en el encabezado Authorization. 
  const config = {
    headers: { Authorization: token },
  }
  // Realiza una solicitud POST a la URL base, enviando el nuevo objeto como cuerpo de la solicitud.
  const response = await axios.post(baseUrl, newObject, config) // El header se le da a axios como el tercer parámetro del método post.
  // Devuelve una promesa que extrae la propiedad `data` de la respuesta del servidor.
  return response.data
}

// Función para actualizar una nota existente en el servidor.
const update = async (id, newObject) => {
  // Realiza una solicitud PUT a una URL específica (`/api/notes/:id`), enviando el objeto actualizado como cuerpo.
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  // Devuelve una promesa que extrae la propiedad `data` de la respuesta del servidor.
  return response.data
}

// Función para eliminar una nota existente en el servidor.
const remove = async id => {
  // Establece el token en el encabezado Authorization. 
  const config = {
    headers: { Authorization: token },
  }
  // Realiza una solicitud DELETE a una URL específica (`/api/notes/:id`), para eliminar.
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  // Devuelve una promesa que extrae la propiedad `data` de la respuesta del servidor.
  return response.data
}

// Exporta las funciones `getAll`, `create`, y `update` como un objeto.
// Esto permite importarlas fácilmente desde otros archivos como parte de `noteService`.
export default { 
  getAll, // Exporta la función para obtener todas las notas.
  create, // Exporta la función para crear una nueva nota.
  update,  // Exporta la función para actualizar una nota existente.
  remove,   // Exporta la función para eliminar una nota
  setToken // Exporta la funcion setToken para guardar el token
}

