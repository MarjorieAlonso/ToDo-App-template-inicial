// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

if (!localStorage.jwt) {
  location.replace("./index.hmtl")

}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const formCrearTarea = document.querySelector(".nueva-tarea")
  const btnCerrarSesion = document.querySelector("#closeApp")
  const nuevaTarea = document.querySelector("#nuevaTarea")

  const url = "https://todo-api.ctd.academy/v1"
  const urlUsuario = `${url}/users/getMe`
  const urlTareas = `${url}/tasks`
  const token = JSON.parse(localStorage.jwt)
  obtenerNombreUsuario()
  consultarTareas()

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    const cerrarSesion = confirm("¿Está seguro de cerrar sesión?")

    if (cerrarSesion) {
      localStorage.clear()
      location.replace("./index.hmtl")

    }



  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const setting = {
      method: "GET",
      headers: {
        autorization: token
      }
    }
    fetch(urlUsuario, setting)
      .then(response => response.json())
      .then(userData => {
        console.log(userData)
        const nombreUsuario = document.querySelector(".user-info p")
        nombreUsuario.textContent = userData.firstName
      })
      .catch(err => console.log(err))

  };


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const settings = {
      method: "GET",
      headers: {
        autorization: token
      }
    }

    fetch(urlTareas, settings)
      .then(response => response.json())
      .then(tareas => {
        console.log(tareas);
      })
    renderizarTareas()
    botonesCambioEstado()
    botonBorrarTarea()
      .catch(err => console.log(err))
  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();

    const payload = {
      description: nuevaTarea.value.trim(),

    }
    const settings = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        autorization: token
      }
    }
      .fetch(urlTareas, settings)
      .then(response => response.json())
      .then(tarea => {
        console.log(tarea);
        consultarTareas()
      })

      .catch(err => console.log(err))

    formCrearTarea.reset()
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    const tareasPendientes = document.querySelector(".tareas-pendientes");
    const tareasTerminadas = document.querySelector(".tareas-terminadas")

    tareasPendientes.innerHTML = ""
    tareasTerminadas.innerHTML = ""
    const cantidadFinalizadas = document.querySelector("#cantidad-finalizadas")
    let contador = 0;
    cantidadFinalizadas.textContent = contador;

    listado.forEach(tarea => {
      let fecha = new Date(tarea.createdAt)

      if (tarea.completed) {
        contador++
        tareasTerminadas.innerHTML += tareasTerminadas.innerHTML += `
        <li class="tarea">
          <div class="hecha">
            <i class="fa-regular fa-circle-check"></i>
          </div>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <div class="cambios-estados">
              <button class="change incompleta" id="${tarea.id}"><i class="fa-solid fa-rotate-left"></i></button>
              <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </div>
        </li>
      `        
      }else {
        tareasPendientes.innerHTML += `
        <li class="tarea">
          <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <p class="timestamp">${fecha.toLocaleDateString()}</p>
          </div>
        </li>
      `
      }
    })
    cantidadFinalizadas.textContent = contador
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll(".change")
    // console.log(btnCambioEstado);

    btnCambioEstado.forEach( boton => {
      //a cada boton le asignamos una funcionalidad
      boton.addEventListener("click", (ev) => { 
        console.log("🪵 cambio estado de tarea");
        // console.log(ev);
        // console.log(ev.target);
        console.log(ev.target.id);
        
        const id = ev.target.id
        const urlChange = `${urlTareas}/${id}`
        const payload = {}

        //segun el tipo de boton que fue clickeado, cambiamos el estado de la tarea
        if (ev.target.classList.contains("incompleta")) {
          // si está completada, la paso a pendiente
          payload.completed = false
        } else {
          // sino, está pendiente, la paso a completada
          payload.completed = true
        }
        console.log(payload);

        const settings = {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            authorization: token, 
          }
        }

        fetch(urlChange, settings)
          .then(response => {
            console.log(response);
            consultarTareas()
          })

       })

    })

    




  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const btnBorrar = document.querySelectorAll(".borrar");
    alert("¿Esta seguro de borrar la tarea?")
    btnBorrar.forEach( boton => {
      //a cada boton le asignamos una funcionalidad
      boton.addEventListener("click", (ev) => {
        console.log("🪵 Eliminar tarea");
        // console.log(ev);
        // console.log(ev.target);
        console.log(ev.target.id);
        const id = ev.target.id
        const urlChange = `${urlTareas}/${id}`

        const settings = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          }
        }

        fetch(urlChange, settings)
          .then(response => {
            console.log(response);
            consultarTareas()
          })

      })

    })
  };

});