import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import './App.css';

const personaSchema = z.object({
  nombre: z.string().min(1, { message: "Debe ingresar un nombre" }),
  apellidoPaterno: z.string().min(1, { message: "Debe ingresar el apellido paterno" }),
  apellidoMaterno: z.string().min(1, { message: "Debe ingresar el apellido materno" }),
  fechaNacimiento: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Fecha inválida, el formato debe ser AAAA-MM-DD" }),
  numeroContacto: z.string().min(10, { message: "El número de contacto debe tener al menos 10 dígitos" }),
  email: z.string().email({ message: "Correo electrónico no válido" }),
});

function App() {
  const [persona, setPersona] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    numeroContacto: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/personas')
      .then(response => response.json())
      .then(data => setPersonas(data))
      .catch(error => console.error('Error al cargar personas:', error));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setPersona(prev => ({ ...prev, [name]: value }));

    const result = personaSchema.safeParse({ ...persona, [name]: value });
    if (!result.success) {
      const newErrors = { ...errors };
      newErrors[name] = result.error.formErrors.fieldErrors[name] ? result.error.formErrors.fieldErrors[name].join(", ") : "";
      setErrors(newErrors);
    } else {
      const newErrors = { ...errors };
      newErrors[name] = "";
      setErrors(newErrors);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:3001/api/personas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(persona)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Persona registrada:', data);
        setPersonas([...personas, data]);
        setPersona({
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          fechaNacimiento: '',
          numeroContacto: '',
          email: ''
        });
      })
      .catch(error => console.error('Error al registrar persona:', error));
  }

  function handleEdit(persona) {
    setPersona({
      nombre: persona.nombre,
      apellidoPaterno: persona.apellidoPaterno,
      apellidoMaterno: persona.apellidoMaterno,
      fechaNacimiento: persona.fechaNacimiento.split('T')[0],
      numeroContacto: persona.numeroContacto,
      email: persona.email,
    });
  }

  function handleDelete(id) {
    fetch(`http://localhost:3001/api/personas/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setPersonas(personas.filter(persona => persona.ID !== id));
        console.log(`Persona con ID ${id} eliminada`);
      })
      .catch(error => console.error('Error al eliminar persona:', error));
  }

  return (
    <div className="App">
      <div className='datos'>
        <form onSubmit={handleSubmit}>
          <label>Nombre: <input type='text' name='nombre' value={persona.nombre} onChange={handleChange} /></label>
          <label>Apellido Paterno: <input type='text' name='apellidoPaterno' value={persona.apellidoPaterno} onChange={handleChange} /></label>
          <label>Apellido Materno: <input type='text' name='apellidoMaterno' value={persona.apellidoMaterno} onChange={handleChange} /></label>
          <label>Fecha de nacimiento: <input type='date' name='fechaNacimiento' value={persona.fechaNacimiento} onChange={handleChange} /></label>
          <label>Numero de contacto: <input type='tel' name='numeroContacto' value={persona.numeroContacto} onChange={handleChange} /></label>
          <label>Correo electrónico: <input type='email' name='email' value={persona.email} onChange={handleChange} /></label>
          <button type='submit' className='btn-registro'>Registrar</button>
        </form>
        <h2>Personas Registradas</h2>
        <div className="personas-registradas">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((persona, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{persona.nombre}</td>
                  <td>{persona.apellidoPaterno}</td>
                  <td>{persona.apellidoMaterno}</td>
                  <td>
                  <button onClick={() => handleEdit(persona)} className="btn-editar">Editar</button>
                <button onClick={() => handleDelete(persona.ID)} className="btn-eliminar">Eliminar</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
