// start mongoose & mongodb connection to server
require('./db/mongoose');
const express = require('express');
// import routers
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

// Creates an express app.
const app = express()
const port = process.env.PORT;

// basic error handler
const basicErrorHandler = (err, req, res, next) => {
    res.status(400).send({
        'error': err.message
    })
}

// express json middleware
app.use(express.json());
// routers
app.use(userRouter);
app.use(taskRouter);
// error handlers
app.use(basicErrorHandler);



// LISTEN
app.listen(port, () => {
    console.log('Server is up on port: ', port);
});





// ================ TESTING ================


app.post('/test', (req, res) => {
    res.send('No Errors!')
})