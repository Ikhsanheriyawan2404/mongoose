const express = require('express')
const expresLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')


require('./utils/db')
const Contact = require('./models/contact')

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express()
const port = 1234

app.use(methodOverride('_method'))
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
        title: 'Contact',
        data,
        msg: req.flash('msg')
    });
});

// View Create Contacts
app.get('/contact/create', async (req, res) => {
    res.render('contacts/create', {
        layout: 'layouts/main',
        title: 'Create Contact',
        msg: req.flash('msg')
    });
});

// Create Contacts
app.post('/contact', [
    body('name').custom(async (value) => {
        const duplicate = await Contact.findOne({ name: value })
        if (duplicate) {
            throw new Error('NIK sudah terdaftar!');
        }
        return true;
    }),
    body('name').isLength({ min: 3 })
],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('contacts/create', {
            layout: 'layouts/main',
            title: 'Form Tambah Kontak',
            errors: errors.array()
        })
    } else {
        Contact.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Data kontak berhasil ditambahkan!');
            res.redirect('/contact');
        });
    }
});

// View Update Contact
app.get('/contact/edit/:_id', async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params._id})
    res.render('contacts/edit', {
        layout: 'layouts/main',
        title: 'Edit Contact',
        contact,
    });
});

// Update Contact
app.put('/contact', [
    body('name').custom(async (value, { req }) => {
        const duplicate = await Contact.find({ name: value });
        if (value !== req.body.oldName && duplicate) {
            throw new Error('Nama sudah terdaftar!');
        }
        return true;
    }),
    body('name').isLength({ min: 3 })
],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('contacts/edit', {
            layout: 'layouts/main',
            title: 'Form Edit Kontak',
            errors: errors.array(),
            contact: req.body,
        })
    } else {
        Contact.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    name: req.body.name,
                    phone_number: req.body.phone_number,
                    email: req.body.email,
                }
            }
        ).then((result) => {
            req.flash('msg', 'Data kontak berhasil diedit!');
            res.redirect('/contact');
        })
    }
});

app.delete('/contact/', (req, res) => {
    Contact.deleteOne({ _id: req.body._id}).then((result) => {
        req.flash('msg', 'Data kontak berhasil dihapus!');
        res.redirect('/contact');
    });
})

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

