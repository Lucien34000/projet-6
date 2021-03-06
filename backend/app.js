const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const path = require('path');
const morgan = require('morgan');
const winston = require('./monitoring/config/winston');
const helmet = require('helmet');

require('dotenv').config();
const mdp = process.env.mdpMongoDb;

mongoose.connect(`mongodb+srv://User:${mdp}@cluster0.ikvrg.mongodb.net/<dbname>?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use(morgan('combined', { stream: winston.stream }));
app.use(helmet());
app.use(bodyParser.json()); 

module.exports = app;