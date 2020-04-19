// server.js

const express = require('express');
const CoinRouter = require('./routes/router');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public')); // использовать папку папблик, для доступа к статичным файлам (стили, картинки, клиентские JS и пр)
app.use('/coins', CoinRouter);

// app.set('views', path.join(__dirname, '/views/coins'));


app.listen(port, function(){
	console.log('Node js Express js Tutorial\nServer is running...');
});

app.set('view engine', 'ejs'); // установить переменную 'view engine' - назначает используемый шаблонизатор, по умолчанию это EJS

console.log(app.get('view engine'));


app.get('/', function (req, res) { // вызывает отработку колбэк функции, при GET запросе адреса (первый параметр)
	res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname,'public', '404.html'));
});

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/expressdemo', { useUnifiedTopology: true, useNewUrlParser: true });


