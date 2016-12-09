/**
 * Created by zt on 16/12/9.
 */
var redis = require('redis');
var client = redis.createClient(6379, '139.199.65.115');

//client.select(1, function (err, data) {
//    if (err)
//        console.log('redis select db error -' + err);
//    else
//        console.log('choose db1 ' + data);
//});

client.on('error', function (err) {
    console.log('redis error - ' + err);
});

//exports.hgetallSync = async function (key) {
//    return await new Pormise((resovle, reject)=> {
//        client.hgetall(key, (err, data)=> {
//            if (err)
//                reject(err);
//            else
//                resovle(data);
//        });
//    });
//};

exports.client = client;