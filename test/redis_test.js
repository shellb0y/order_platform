/**
 * Created by zt on 16/12/9.
 */
var redis = require("../redis");
var client = redis.createClient();


//redis.client.set("string key1", "string val", (err, data)=> {
//    if (!err) {
//        console.log(data);
//    }
//});

//client.get('order_platform:trade_index', (err, data)=> {
//    if (!err) {
//        console.log(data);
//    }
//});
//client.quit();

//client.set('order_platform:phone_charge:trade_no:1111','11111');
//client.hgetall('order_platform:phone_charge:trade_no:20161211203604436HPQNA00001',(err,data)=>{
//    console.log(data);
//});
//client.del('order_platform:phone_charge:trade_no:1111');
//client.exists('order_platform:phone_charge:trade_no:1111',(err,data)=>{
//    console.log(data);
//});

//(async()=>{
//    console.log(await redis.incrSync(client));
//    client.quit();
//})();

//var date = new Date();
//client.expire('order_platform:trade_index', (86400 - (date.getHours() * 3600 + date.getMinutes() * 60)) / 60,
//    function (err, data) {
//        console.log(data);
//    });
//client.quit();

client.lpush('order_platform:phone_charge:order','20161215065138422LPCOA00002',(err,data)=>{
    console.log(data);
});
client.quit();

//redis.client.set('order_platform:trade_index',0,(err,data)=>{
//    if(!err)
//        console.log(data);
//});
//redis.client.quit();

//var clientBlocking = redis.client.duplicate();

//redis.client.lpush("trades", "$100.00", function (err, data) {
//    console.log(data)
//});
//redis.client.lpush("trades", "$101.00", function (err, data) {
//    console.log(data)
//});
//redis.client.lpush("trades", "$102.00", function (err, data) {
//    console.log(data)
//});
//redis.client.lpush("trades", "$103.00", function (err, data) {
//    console.log(data)
//});


//var brpop = function () {
//    console.log('brpop');
//    redis.client.brpop('trades', 0, function (err, data) {
//        console.log(data);
//    });result
//    setTimeout( brpop, 1000 );
//};
//
//brpop();

//for(var i=0;i<100;i++)
//    redis.client.brpop('trades',5, function(err, data) {console.log('brpop'); console.log(data); });


//var get = function() {
//    console.log("get called");
//    redis.client.get("any_key",function() { console.log("get returned"); });
//    setTimeout( get, 1000 );
//};
//var brpop = function() {
//    console.log("brpop called");
//    clientBlocking.brpop("nonexistent", 5, function() {
//        console.log("brpop return");
//        setTimeout( brpop, 1000 );
//    });
//};
//get();
//brpop();



