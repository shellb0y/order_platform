/**
 * Created by zt on 16/12/9.
 */
var redis = require("./redis");
var cronJob = require("cron").CronJob;


module.exports = function () {
    //new cronJob('0 0 0 * * *', function () {
    //    var client = redis.createClient();
    //    client.set('order_platform:trade_index', 0, (err, data)=> {
    //        if (!err)
    //            console.log(data);
    //        else
    //            console.error(err);
    //
    //        client.quit();
    //    });
    //}, null, true);
};
