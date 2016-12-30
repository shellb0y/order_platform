/**
 * Created by zt on 16/12/9.
 */
'use strict';
var redis = require('redis');

exports.setnxSync = async function (client, key, value) {
    return await new Promise((resovle, reject)=> {
        client.setnx(key, value, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};

exports.lpushSync = async function (client, key, value) {
    return await new Promise((resovle, reject)=> {
        client.lpush(key, value, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};

exports.llenSync = async function (client, key, alias) {
    return await new Promise((resovle, reject)=> {
        client.llen(key, (err, data)=> {
            if (err)
                reject(err);
            else {
                resovle({name: alias, data: {count: data}});
            }
        });
    });
};

exports.brpopSync = async function (client, queueName, timeout) {
    return await new Promise((resovle, reject)=> {
        client.brpop(queueName, timeout, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};

exports.getSync = async function (client, key) {
    return await new Promise((resovle, reject)=> {
        client.get(key, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};

exports.hgetallSync = async function (client, key) {
    return await new Promise((resovle, reject)=> {
        client.hgetall(key, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};

exports.hgetSync = async function (client, key, field) {
    return await new Promise((resovle, reject)=> {
        client.hget(key, field, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};


exports.incrSync = async (client)=> {
    var index = await new Promise((resovle, reject)=> {
        client.incr('order_platform:trade_index', (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });

    if (index == 1) {
        var date = new Date();
        client.expire('order_platform:trade_index', 86400 - (date.getHours() * 3600 + date.getMinutes() * 60));
    }

    return index;
};

exports.existSync = async (client, key)=> {
    return await new Promise((resovle, reject)=> {
        client.exists(key, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};

exports.hmsetSync = async (client, key, value)=> {
    return await new Promise((resovle, reject)=> {
        client.hmset(key, value, (err, data)=> {
            if (err)
                reject(err);
            else
                resovle(data);
        });
    });
};

exports.createClient = function () {
    var client = redis.createClient(6379, '139.199.65.115', {password: 'melodicdeath'});
    //client.select(1, function (err, data) {
    //    if (err)
    //        console.log('redis select db error -' + err);
    //    else
    //        console.log('choose db1 ' + data);
    //});

    client.on('error', function (err) {
        console.log('redis error - ' + err);
    });
    return client;
};