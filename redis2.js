/**
 * Created by zt on 16/12/9.
 */
'use strict';
var redis = require('redis');
var client = redis.createClient(6379, '139.199.65.115');

client.on('error', function (err) {
    console.log('redis error - ' + err);
});
client.unref();
exports.client = client;

//Error: Redis connection to 139.199.65.115:6379 failed - read ETIMEDOUT