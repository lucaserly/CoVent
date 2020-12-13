'use strict';

const express = require('express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT;
const router = require('./router');
const db = require('./models');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(router);

(async function bootstrap () {
  await db.sequelize.sync();
  app.listen(PORT, () => {
    console.log(`COVENT listening at http://localhost:${PORT}`);
  });
})();

