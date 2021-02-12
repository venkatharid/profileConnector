const express = require('express');
const connectDB = require('./config/db');


const app = express()

connectDB();

//Init MiddleWare
app.use(express.json({extended:false}));

app.get('/', (req,res) => res.send('API Running'));

//Define routes
app.use('/api/users', require('./route/api/users'))
app.use('/api/auth', require('./route/api/auth'))
app.use('/api/post', require('./route/api/post'))
app.use('/api/profile', require('./route/api/profile'))

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => console.log(`server started on port ${PORT}`))
