/**
 * Created by zt on 16/12/11.
 */
var db = require('../models/db');
var readline = require('readline'),
    fs = require('fs');

var rl = readline.createInterface({
    input: fs.createReadStream('2016-12-27_app_utf8.txt'),
    output: process.stdout,
    terminal: false
});

//rl.on('line', function (line) {
//    var data = [];
//    if (line) {
//        data.push({
//            _data: {
//                username: line.split('----')[0],
//                password: line.split('----')[1],
//                pay_passowrd:line.split('----')[2],
//                pc_cookie: line.split('----')[3],
//                source: 'xiaoafei',
//                cost: 0,
//                valid: 1,
//                unused_discount: 5
//            },
//            created: Date.now()
//        });
//    }
//
//    db.account.bulkCreate(data).catch((err)=>console.log(err));
//});

rl.on('line', function (line) {
    if (line) {
        db.sequelize.query(`update account_ set _data=JSON_SET(_data,'$.cookie','${line.split('----')[3]}') where _data->'$.username'='${line.split('----')[0]}'`).catch((err)=> {
            if (err instanceof Error)
                throw err;
            else
                throw new Error(err);
        });
    }
});