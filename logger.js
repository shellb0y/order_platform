/**
 * Created by zt on 16/7/18.
 */
var dgram = require('dgram');
var host = '115.28.102.142';
var port = 55514;

function send2Server(level, key, msg, program) {

    var client = dgram.createSocket('udp4');

    var data = {
        'program': program || 'order_platform',
        'key': key || '',
        'message': msg,
        '@fields.levelname': level
    };
    console.log(data);
    data = JSON.stringify(data);
    var message = new Buffer(data);
    client.send(data, 0, message.length, port, host, function (err, bytes) {
        if (err)
            console.error(err);
        client.close();
    });
}

exports.t = (key, message, program)=> {
    console.log(key, message, program);
};

exports.i = (key, message, program)=> {
    console.log(message);
    send2Server("INFO", key, message, program);
};

exports.w = (key, message, program)=> {
    console.log(message);
    send2Server("WARN", message, program);
};

exports.d = (key, message, program)=> {
    console.log(message);
    send2Server("DEBUG", key, message, program);
};

exports.e = (key, message, program)=> {
    console.error(message);
    if (message && message.stack)
        send2Server("ERROR", key, message.stack, program);
    else
        send2Server("ERROR", key, message, program);
};