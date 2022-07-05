const express = require('express')
const expresLayouts = require('express-ejs-layouts')

require('./utils/db')
const Contact = require('./models/contact')

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express()
const port = 1234

app.set('view engine', 'ejs')
app.use(expresLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash());

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main',
        title: 'Halaman Home',
    });
});

// Read Contacts
app.get('/contact', async (req, res) => {
    
    const data = await Contact.find();
    res.render('contacts/index', {
        layout: 'layouts/main',
        title: 'Halaman Contact',
        data,
        msg: req.flash('msg')
    });
});

// // Detail Contact
// app.get('/contact/', async (req, res) => {
    
//     const data = await Contact.find();
//     res.render('contacts/index', {
//         layout: 'layouts/main',
//         title: 'Halaman Contact',
//         data,
//         msg: req.flash('msg')
//     });
// });

app.listen(port, () => {
    console.log(`Mongoose Contact App | Listening at http://localhost:${port}`)
})

