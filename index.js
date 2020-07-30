const express = require('express');
const app = express();
const morgan = require('morgan');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());                            // Este método permite al servidor recibir formatos JSON y procesarlos

// Variables
app.set('port', process.env.PORT || 8085);

// routes
app.use(require('./routes/'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})