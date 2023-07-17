const express = require('express');
const app = express();
const port = 3000;
const homeRoutes = require('./routes/home');

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(homeRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
