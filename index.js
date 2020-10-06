const express = require('express')
const app = express()
const Acc = require('./controller/logic');
const logger = require('./util/logger.js')



app.post(`/Login`, async (req, res) => {
    try {
        var result = await new Acc().Login(req.body)    //ไปยัง function login
        res.status(200)
        res.json(result)
        console.log(result)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ,
            message: error.message || error
        }
        res.status(messageError.statusCode).json(messageError)
        console.log(messageError)
    }
});
app.post('/checkincount' , async(req,res) => {
    try{
        var result = await new Acc().checkincount()     //ไปยัง function checkincount
        res.status(200)
        res.json(result)
        console.log(result)
    }catch(error){
        let messageError = {
            statusCode: error.statusCode || 400,
            message: error.message || error
        }
        res.status(messageError.statusCode).json(messageError)
        console.log(messageError)
    }
    
})


module.exports = app