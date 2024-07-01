const express = require('express');
const routes = require('./routes');

require('./database');

require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));