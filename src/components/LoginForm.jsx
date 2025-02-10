// Componente para agregar notas (estado, manejo de notas y renderizado del formulario)
// Importa los hooks de React que se usarán en el componente.
import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ userLogged, loginVisible, setLoginVisible }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await userLogged({ username, password })
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Error de login:', error)
    }
  }

  const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  const showWhenVisible = { display: loginVisible ? '' : 'none' }

  return (
    <div>
      <h2>Login</h2>
      <div style={hideWhenVisible}>
        <button onClick={() => setLoginVisible(true)}>log in</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
        <button onClick={() => setLoginVisible(false)} style={showWhenVisible}>cancel</button>
      </div>
    </div>
  )
}
// Definimos Prop-Types obligatorios
LoginForm.propTypes = {
  userLogged: PropTypes.func.isRequired,        // userLogged debe ser una función y es obligatorio
  loginVisible: PropTypes.bool.isRequired,      // loginVisible es un booleano, no una función
  setLoginVisible: PropTypes.func.isRequired    // setLoginVisible debe ser una función y es obligatorio
}


export default LoginForm