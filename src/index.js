import express from 'express';
import session from 'express-session';
import authRoute from './routes/auth.route.js';
import connectToDb from './config/db.js';
import { ApplicationMiddleware } from './middleware/applicationError.js';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src', 'views'));

app.use(
  session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(ejsLayouts);
app.use(express.static(path.join(path.resolve(), 'src', 'views')));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/auth', authRoute);

app.use(ApplicationMiddleware);

app.listen(3000, (err, res) => {
  console.log('Server listening on port 3000');
  connectToDb();
})