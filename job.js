/**
 * Created by zt on 16/12/9.
 */
var redis = require("./redis");
var cronJob = require("cron").CronJob;
var db = require('./models/db');
var request = require('request-promise');
var crypto = require('crypto');
var log = require('./logger');

module.exports = function () {
    new cronJob('0 0 0 * * *', function () {
        var client = redis.createClient();
        client.set('order_platform:trade_index', 0, (err, data)=> {
            if (!err)
                console.log(data);
            else
                console.error(err);

            client.quit();
        });
    }, null, true);
};


async function syncStatus(){
    setInterval(async function(){
        var order = await db.sequelize.query(`select _data from order_ where _data->'$.status' = '付款成功'`,
            {type: db.sequelize.QueryTypes.SELECT}).catch((err)=> {
            if (err instanceof Error)
                throw err;
            else
                throw new Error(err);
        });

        log.i('get jd status');


        //order.forEach(async (o)=> {
        //    var _o = JSON.parse(o._data);
        //
        //    var t = Date.now();
        //    //var _target = `${_o.partner_price}${_o.partner_order_id}${JSON.parse(_o.partner).secret}1${t}${_o.trade_no})`;
        //    var _target = `${_o.partner_price}${JSON.parse(_o.partner).secret}1${t}${_o.trade_no})`;
        //    console.log('callback target:' + _target);
        //    var sign = crypto.createHash('md5').update(_target).digest('hex');
        //    console.log('callback sign:' + sign);
        //    var url = `${decodeURI(_o.callback)}?trade_no=${_o.trade_no}&amount=${_o.partner_price}&success=1&t=${t}&sign=${sign}`;
        //    request.get(url).catch((e)=>console.log(e));
        //});
    },5000);
}
