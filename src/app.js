const express = require('express');
const { config } = require('./config/config');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(fileUpload());

const routerApi = require('./routes');

const port = config.port || 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.send('403');
});


// Crear el job que se ejecuta cada 50 segundos
setInterval(async () => {
    try {
        console.log('Respuesta de la API:', new Date().toLocaleString());
        const response = await axios.get('http://localhost:4567/api/v1/calls/make');
    } catch (error) {
        console.error('Error al llamar a la API CALLS:', error);
    }
}, 50000); // 50000 milisegundos = 50 segundos

routerApi(app);

app.listen(port,()=>{
    console.log("Port ==> ", port);
});
