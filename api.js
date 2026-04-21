import http from 'http';

const servidor = http.createServer((req, res) => {
  console.log(“Alguien me mandó una solicitud”);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Quiero la libertad de esculpir y cincelar mi propio rostro, de detener la hemorragia con cenizas, de crear mis propios dioses a partir de mis entrañas...\n');
});

