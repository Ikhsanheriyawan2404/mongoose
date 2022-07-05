const express = require('express');
const expresLayouts = require('express-ejs-layouts');

const app = express();
const port = 1234;

app.listen(port, () => {
    console.log(`Mongoose Contact App | Listening at http://localhost:${port}`);
})