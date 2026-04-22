import http from "http";
import url from "url";

const servidor = http.createServer((req, res) => {
	//console.log(req);
	const urlProcesada = url.parse(req.url, true);
	//console.log(urlProcesada);
	const queryParams = urlProcesada.query;
	console.log(queryParams.x);

  if (queryParams.x == "1") {

    console.log("si es 1");
  }else{
    console.log("No es 1");
  }

	console.log("Alguien me mandó una solicitud");
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end(
		"Quiero la libertad de esculpir y cincelar mi propio rostro, de detener la hemorragia con cenizas, de crear mis propios dioses a partir de mis entrañas...\n",
	);
});

const puerto = 1984;

servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en el puerto ${puerto}`);
});