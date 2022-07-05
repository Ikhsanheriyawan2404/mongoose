const express = require('express')
const expresLayouts = require('express-ejs-layouts')

const app = express()
const port = 1234

app.set('view engine', 'ejs')
app.use(expresLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main',
        title: 'Halaman Home',
    });
});

// Read Contacts
app.get('/contact', (req, res) => {
    // const data = contacts.loadContacts();
    res.render('contacts/index', {
        layout: 'layouts/main',
        title: 'Halaman Contact',
        // data,
        // msg: req.flash('msg')
    });
});

app.listen(port, () => {
    console.log(`Mongoose Contact App | Listening at http://localhost:${port}`)
})

