const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api', require('./routes/api.route'));
app.use('/api', require('./routes/menuItem'));
app.use('/api', require('./routes/orderItem'));
app.use('/api', require('./routes/paymongo'));
app.use('/api', require('./routes/order'));
app.use('/api', require('./routes/customerInfo'));
app.use('/api', require('./routes/basketItem'));
app.use('/api', require('./routes/message'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
