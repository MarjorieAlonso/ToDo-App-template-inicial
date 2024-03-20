window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */


    const form = document.forms[0];

    const email = document.querySelector("#inputEmail")
    const password = document.querySelector("#inputPassword")
    const url = "https://todo-api.ctd.academy/v1"

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {

        event.preventDefault();
        const payload = {
            email: email.value,
            password: password.value
        }

        const settings = {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        realizarLogin(settings)

        form.reset();
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
        fetch(`${url}/users/login`, settings)
            .then(response => {
                if (response.ok)
                    return response.json()
                return Promise.reject(response)
            })
            .then(data => {
                if (data.jwt) {
                    localStorage.setItem("jwt", JSON.stringify(data.jwt))

                    form.reset();

                    location.replace("./mis-tareas.html")
                }

            })
            .catch(err => {
                if (err.status === 400) {
                    alert("contraseña incorrecta")
                } else if (err.status === 404) {
                    alert("usuario no encontrado")
                } else {
                    alert("error del servidor")
                }
                console.error(err.status)
            })




    };


});