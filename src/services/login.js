// Servicio para hacer la solicitud POST a la dirección del servidor api/login
// Importa la librería Axios, que se utiliza para realizar solicitudes HTTP de manera sencilla.
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }