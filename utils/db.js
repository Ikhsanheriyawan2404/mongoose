const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const Contact = mongoose.model('Contact', {
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true
    }
})

const contact1 = new Contact({
    name: 'Ikhsan Heriyawan',
    phone_number: '092312',
    email: 'ikhsanheriyawan2404@gmail.com'
})

contact1.save().then((result) => {
    console.log(result)
})