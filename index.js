// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// -----------------------------------------------------------------
// SOLUCIÓN TIMESTAMP MICROSERVICE
// -----------------------------------------------------------------
app.get("/api/:date?", (req, res) => {
  const dateInput = req.params.date;
  let date;

  // 1. Si el parámetro está vacío, usar fecha actual
  if (!dateInput) {
    date = new Date();
  } 
  // 2. Si es un timestamp (solo números), convertir a entero
  // Comprobamos si NO es NaN (Not a Number)
  else if (!isNaN(dateInput)) {
    date = new Date(parseInt(dateInput));
  } 
  // 3. Si es formato texto (ISO, fecha normal, etc.)
  else {
    date = new Date(dateInput);
  }

  // 4. Si la fecha es inválida
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // 5. Retornar JSON con formatos unix y utc
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// SOLUCIÓN REQUEST HEADER PARSER
// -----------------------------------------------------------------

app.get('/api/whoami', (req, res) => {
  // 1. Obtener la IP. 
  // En servidores como Replit/Glitch/Heroku, la IP real suele estar en 'x-forwarded-for'.
  // Si no, usamos req.connection.remoteAddress.
  const ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // 2. Obtener el idioma del header 'accept-language'
  const language = req.headers['accept-language'];

  // 3. Obtener el software del header 'user-agent'
  const software = req.headers['user-agent'];

  // 4. Devolver el JSON
  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });
});

// -----------------------------------------------------------------

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});