const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const logger = require('./util/logger.js')
//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));    //เรียกใช่ swagger
//ตัวอ่าน json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', require('./index'));   //เมื่อมี req มาจะเรียก index
var port = process.env.PORT || 7777;    //ประกาศช่อง port
app.listen(port,'0.0.0.0', () => {
    logger.info('[Swagger] http://localhost:' + port + '/api-docs/')
    logger.debug(`[Role] ${process.env.ROLE}`)
    logger.info('Start server at port ' + port)
})
module.exports = app