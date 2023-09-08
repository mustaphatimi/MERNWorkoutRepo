const express = require('express');
const workoutRoutes = require('./routes/workouts.js');
const userRoutes = require('./routes/userRoutes.js');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(express.json())
// app.use((req, res, next) => {
//     console.log(req.path, req.method);
//     next()
// })


// Database connection
const dbUrl = process.env.MONGO_URI

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind('Error'))
db.once('open', () => {
    app.listen(port, () => {
        console.log(`listening on port ${port}!!!`)
    })
})

app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);

app.use((err, req, res, next) => {
    const { message, status = 400 } = err;
    res.status(status).json({ error: message })
})
