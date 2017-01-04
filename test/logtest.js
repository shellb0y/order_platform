/**
 * Created by zt on 16/12/29.
 */
var Logstash = require('logstash-client');

var host = '192.168.0.64';
var port = 514;

var logstash = new Logstash({
    type: 'udp', // udp, tcp, memory
    host: host,
    port: 55514
});


logstash.send({
    '@timestamp': new Date(),
    'message': 'order_platform',
    'level': 'error'
}, (err, data)=> {
    console.log(err);
    console.log(data);
});