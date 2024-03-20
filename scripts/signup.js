window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    //const form = document.querySelector("#form-header");
    const form = document.forms[0];
    const nombre = document.querySelector("#inputNombre")
    const apellido = document.querySelector("#inputApellido");
    const mail = document.querySelector("#inputEmail")
    const contrasenia = document.querySelector("#inputPassword")
    const repetir = document.querySelector("#inputPasswordRepetida")
    const url = "https://todo-api.ctd.academy/v1"



    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const peyloud = {

            firstName: nombre.value,
            lastName: apellido.value,
            email: mail.value,
            password: contrasenia.value

        }
        const settings = {
            method: "POST",
            body: JSON.stringify(peyloud),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        realizarRegister(settings)
        form.reset()

    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        fetch(`${url}/users`, settings)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response)
            })
            .then(data => {
                if (data.jwt) {
                    localStorage.setItem("jwt", JSON.stringify(data.jwt))
                    form.reset();
                    location.replace("./index.html")
                }

            })
            .catch(err => {
                if (err.status === 400) {
                    alert("El usuario ya se encuentra registrado ")
                } else if (err.status === 401) {
                    alert("Alguno de los datos requeridos está incompleto")

                } else {
                    alert("Error del servidor")
                }
            })
    }




})