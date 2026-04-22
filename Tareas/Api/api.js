import http from "http";
import { URLSearchParams } from "url"; 

const puerto = 3000; //puerto del localhost
const API_KEY = "0bd4f283cc69c0a78a1df3cf52844209"; 

const servidor = http.createServer(async (req, res) => { //funcion para crear el servidor y manejar las solicitudes con la api ipstack
    console.log(`Solicitud: ${req.method} ${req.url}`); //imprime en consola el metodo y la url de la solicitud
    if (req.method === "GET" && req.url === "/") { //si la solicitud es un GET a la raiz, se muestra el formulario para ingresar la IP
        const html = ` //html del formulario con estilos de bootstrap y fondo oscuro, con texto blanco para mejor visibilidad
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>IPStack Geolocation - Node</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body style="background-color: #0f172a; color: #f8fafc; padding: 50px;">
            <div class="container text-center">
                <h1 class="display-4 mb-4 text-info">Geolocalizador de IP 📍</h1>
                <div class="card bg-dark border-info mx-auto" style="max-width: 500px;">
                    <div class="card-body">
                        <p class="text-white">Ingresa una dirección IP para conocer su ubicación física.</p>
                        <form action="/geolocalizar" method="POST">
                            <div class="input-group mb-3">
                                <input type="text" name="ip" class="form-control bg-secondary text-white" placeholder="Ej: 8.8.8.8">
                                <button class="btn btn-info fw-bold" type="submit">Localizar</button>
                            </div>
                            <small class="text-white">Si lo dejas vacío, intentará localizar tu IP actual.</small>
                        </form>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); // codigo 200 para indicar que se logró con exito
        res.end(html); //envia el html al cliente y finaliza la respuesta
    }

    else if (req.method === "POST" && req.url === "/geolocalizar") { // si la solicitud es un POST a /geolocalizar, se procesa el formulario y se consulta la API de ipstack
        let body = ""; //variable para almacenar los datos del formulario que se reciben en partes (chunks) a medida que llegan
        req.on("data", chunk => { body += chunk.toString(); }); //acumula los datos que llegan de la varible bodu

        req.on("end", async () => { //procesa los datos y se consulta a la api para conocer su ubicacion
            try {
                const params = new URLSearchParams(body); //convierte los datos del formulario a un formato que se pueda trabajar fácilmente para obtener la ip ingresada por el usuario
                const ipCliente = params.get("ip") || "check"; //obtiene la ip ingresada por el usuario, si no se ingresa ninguna ip, se utiliza "check" para que la api de ipstack intente localizar la ip del cliente que hace la solicitud

                const response = await fetch(`http://api.ipstack.com/${ipCliente}?access_key=${API_KEY}`); //consulta a la api de ipstack con la ip ingresada por el usuario k" para obtener la ip del cliente que hace la solicitud
                const data = await response.json(); // convierte la respuesta de la api a formato json para poder trabajar con los datos de la ubicacion de la ip ingresada

                if (data.error) throw new Error(data.error.info); //erorr por si la api devuelve un error
// html que mostrará los resulados
                const resultadoHTML = ` 
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body style="background-color: #0f172a; color: white; padding: 50px; text-align: center;">
                    <div class="container">
                        <div class="card bg-dark border-info mx-auto text-white" style="max-width: 600px;">
                            <div class="card-header border-info text-info fw-bold">Resultados de Ubicación</div>
                            <div class="card-body">
                                <h2 class="mb-4 text-white">${data.city || 'Desconocido'}, ${data.region_name || 'N/A'}</h2>
                                
                                <div class="row text-start">
                                    <div class="col-6">
                                        <p class="text-white"><strong>País:</strong> ${data.country_name} ${data.location.country_flag_emoji || ''}</p>
                                        <p class="text-white"><strong>IP Consultada:</strong> ${data.ip}</p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-white"><strong>Latitud:</strong> ${data.latitude}</p>
                                        <p class="text-white"><strong>Longitud:</strong> ${data.longitude}</p>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <a href="https://www.google.com/maps?q=${data.latitude},${data.longitude}" target="_blank" class="btn btn-info fw-bold">Ver en Google Maps</a>
                                </div>
                                
                                <div class="mt-3">
                                    <a href="/" class="text-info" style="text-decoration: none;">← Realizar otra consulta</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>`;

                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); //codigo 200 para indicar que se logró con exito y se envia el resultado al cliente, el resultado es un html con los datos de la ubicacion de la ip ingresada
                res.end(resultadoHTML);

            } catch (error) {
                res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
                res.end(`<body style="background-color:#0f172a; color:white; text-align:center; padding:50px;"> //pagina de error
                    <h1 style="color: #ff4d4d;">Error: ${error.message}</h1>
                    <a href="/" style="color: #0dcaf0;">Volver al inicio</a>
                </body>`);
            }
        });
    }

    else {
        res.writeHead(404);
        res.end("No encontrado");
    }
});

servidor.listen(puerto, () => {
    console.log(`Práctica IPStack activa en http://localhost:${puerto}`); //inicia el servidor y muestra un mensaje en consola que nos indica que está activo y además el código dunciona conrrectamente
});