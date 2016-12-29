/**
 * Created by zt on 16/12/29.
 */
var Redis2 = require('ioredis');
var redis2 = new Redis2({
    port: 63729,          // Redis port
    host: '139.199.65.115',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: 'melodicdeath',
    db: 0
});

redis2.hgetall('order_platform:config').then((data)=> {
    console.log(data);
}, (err)=> {
    console.log(err);
});

redis2.quit();

