/**
 * Created by zt on 16/12/11.
 */
var db = require('../models/db');
var readline = require('readline'),
    fs = require('fs');

var rl = readline.createInterface({
    input: fs.createReadStream('jd_account_3.txt'),
    output: process.stdout,
    terminal: false
});

rl.on('line', function (line) {
    if(line) {
        db.account.create({
                _data: {
                    username: line.split('----')[0],
                    password: line.split('----')[1],
                    pc_cookie:line.split('----')[3],
                    source:'xiaoafei'
                },
                created: Date.now()
            }
        ).then((data)=>console.log(`${data} success`));
    }
});