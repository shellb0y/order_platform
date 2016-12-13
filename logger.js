/**
 * Created by zt on 16/7/18.
 */
var dgram = require('dgram');
var host = '115.28.102.142';
var port = 55514;

function send2Server(level, message, program) {

    var client = dgram.createSocket('udp4');

    var data = {'program': program || 'order_platform', 'message': message, '@fields.levelname': level};
    console.log(data);
    data = JSON.stringify(data);
    var message = new Buffer(data);
    client.send(data, 0, message.length, port, host, function (err, bytes) {
        if (err)
            console.error(err);
        client.close();
    });
}

exports.t = (message, program)=> {
    console.log(message, program);
};

exports.i = (message, program)=> {
    console.log(message);
    send2Server("INFO", message, program);
};

exports.w = (message, program)=> {
    console.log(message);
    send2Server("WARN", message, program);
};

exports.d = (message, program)=> {
    console.log(message);
    send2Server("DEBUG", message, program);
};

exports.e = (message, program)=> {
    console.error(message);
    if (message.stack)
        send2Server("ERROR", message.stack,program);
    else
        send2Server("ERROR", message,program);
};