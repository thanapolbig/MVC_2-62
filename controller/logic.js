const logger = require('../util/logger.js')

var sql = require("mssql");
// config for your database
var config = {
    user: 'sa',
    password: 'P@d0rU123',
    server: '167.71.200.91',
    database: 'BigDB'
};

var err = sql.connect(config)
if (err) console.log(err);

class Acc {

    async Login(req) {
        let FunctionName = '[Login]'
        return new Promise(async function (resolve, reject) {
            try {
                var id = req.email.split('@')
                var pass = req.pass
                if(id[1] != "cskmitl.ac.th"){   //  check ว่าเป็นเมลสถาบันหรือไม่
                    let massageErr = {
                        statusCode: 400,
                        massage: "เมลล์ผิด"
                    }
                    reject(massageErr);
                    return
                }
                var request = new sql.Request();    //เรียกใช้ sqlcommand
                var command = `SELECT SID,Password,Status FROM MVC where SID = '${id[0]}' and Password = '${pass}';`    //คำสั่งsql ไว้ดูความถูกต้องของ ไอดีกับรหัส
                var result = await request.query(command); //นำคำสั่งลง db
                console.log(result)
                if(result.recordset.length == 0){  //check ถ้าใส่รหัสหรือไอดีผิด
                    let massageErr = {
                        statusCode: 400,
                        massage: "เมลล์ผิดหรือรหัสผ่านผิด"
                    }
                    reject(massageErr);
                    return
                }else if(result.recordset[0].Status == true){   //check ว่า นศ เคย login แล้วหรือไม่ status = 0 คือไม่เคยล็อคอิน status = 1 คือ ล็อคอินแล้ว 
                    let massageErr = {
                        statusCode: 400,
                        massage: "ล็อคอินไปแล้ว"
                    }
                    reject(massageErr);
                }
                var CommandUpdate = `UPDATE MVC SET Status = 1 WHERE SID = '${id[0]}';` //update สถานะว่าล็อคอินแล้ว
                var result = await request.query(CommandUpdate); 
                let massage = {
                    statusCode: 200,
                    massage: "ล็อคอินสำเร็จ",
                }
                resolve(massage)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    massage: error.massage || `${FunctionName} failed [Error] ${error}`
                }
                console.log(messageError)
                reject(messageError);
                return
            }
        })
    }
    async checkincount() {
        let FunctionName = '[checkincount]'
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();    //เรียกใช้ sqlcommand
                var command = `SELECT count(Status)as total_login FROM MVC where Status = 1;`   //เช็คจำนวนคน login แล้ว
                var countLogin = await request.query(command);
                var command2 = `SELECT count(Status)as total_unlogin FROM MVC where Status = 0;`//เช็คจำนวนคนที่ยังไม่ login
                var countLogin2 = await request.query(command2); 
                var command3 = `SELECT Firstname,Lastname FROM MVC where Status = 0;`   //เช็คจำนวนคนที่ยังไม่ login แล้วแสดงชื่อ
                var nameunLogin = await request.query(command3); 
                let massage = {         // สร้าง report 
                    statusCode: 200,
                    massagecount: countLogin.recordset[0] ,
                    massagecount2 : countLogin2.recordset[0],
                    massageName: nameunLogin.recordset,
                }
                resolve(massage)
                return
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    massage: error.massage || `${FunctionName} failed [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }

        })
    }

}


module.exports = Acc