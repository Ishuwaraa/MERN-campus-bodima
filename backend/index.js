require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adRoutes = require('./routes/ads');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admins');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// app.use(cors());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    // methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));

//connecting to db
mongoose.connect(process.env.DB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log('connected to db and listening on port: ', process.env.PORT))
    })
    .catch((err) => console.log(err));

app.use(express.json());    //getting the data from the request body
app.use(cookieParser());

//routes
app.use('/api/ads', adRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);