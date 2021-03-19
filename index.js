const express = require('express')
const app = express();
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const MS = require('express-mongoose-store')(session, mongoose);
const fileUpload = require('express-fileupload');
const path = require('path');

require('dotenv').config()
require('./config/passport')(passport)

app.use(require('serve-static')('./public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MS({
        ttl: 63113904000
    })
}));

app.use(fileUpload({
    useTempFiles: true,
    debug: false,
    limits: {
        fileSize: 500 * 1024 * 1024
    },
    tempFileDir: path.join(__dirname, '/destroy/tmp/')
}));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use('/*', async function (req, res, next) {
    console.log(req.method + ' ' + req.originalUrl /*+ ' ' + req.ip*/ )
    next()
})

if (process.env.ENV == "p" || process.env.ENV == "production") {
    app.use('/', require('./routes/main'))
    app.use('/account', require('./routes/account'))
    app.use('/app', require('./routes/app'))
    app.use('/dev', require('./routes/developer'))
    app.use('/', require('./routes/user'))
}

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.listen(process.env.PORT, console.log(`${process.env.NAME} is live at http://localhost:${process.env.PORT}`))