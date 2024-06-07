require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adRoutes = require('./routes/ads');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
// app.use(cors({
//     origin: ["http://localhost:4000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
// }));

//connecting to db
mongoose.connect(process.env.DB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log('connected to db and listening on port: ', process.env.PORT))
    })
    .catch((err) => console.log(err));

app.use(express.json());    //getting the data from the request body

//routes
app.use('/api/ads', adRoutes);
app.use('/api/user', userRoutes);