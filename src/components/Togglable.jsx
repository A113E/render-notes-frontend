// Importamos funciones de React: useState para manejar el estado, forwardRef para usar referencias en componentes funcionales, 
// y useImperativeHandle para controlar qué valores se exponen al padre a través de la referencia.
import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

// Definimos el componente Togglable, que es un componente funcional que utiliza forwardRef.
// forwardRef permite que este componente reciba una referencia que será utilizada para exponer funciones o valores al componente padre.
const Togglable = forwardRef((props, ref) => {
  // Declaramos el estado "visible" con un valor inicial de "false".
  // Esto controlará si el contenido está visible o no.
  const [visible, setVisible] = useState(false)

  // Definimos un estilo para ocultar un elemento cuando "visible" sea true.
  const hideWhenVisible = { display: visible ? 'none' : '' }

  // Definimos un estilo para mostrar un elemento cuando "visible" sea true.
  const showWhenVisible = { display: visible ? '' : 'none' }

  // Función que alterna el valor del estado "visible".
  const toggleVisibility = () => {
    setVisible(!visible) // Cambia "visible" al valor opuesto.
  }

  // useImperativeHandle personaliza los valores o funciones que se exponen al componente padre a través de la referencia.
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility // Expone la función "toggleVisibility" al padre.
    }
  })

  // Renderizamos el componente Togglable.
  return (
    <div>
      {/* Esta sección muestra un botón cuando "visible" es false. */}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      
      {/* Esta sección muestra los hijos del componente y un botón "cancel" cuando "visible" es true. */}
      <div style={showWhenVisible}>
        {props.children} {/* Renderiza el contenido pasado como hijos (children) al componente. */}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

// Arreglar el error: Component definition is missing display name
Togglable.displayName = 'Togglable'

// Exportamos el componente Togglable para que pueda ser usado en otros archivos.
export default Togglable

