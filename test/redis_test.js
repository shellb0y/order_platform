/**
 * Created by zt on 16/12/9.
 */
var redis = require("../redis");
//var client = redis.createClient();

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

//redis.client.set('order_platform:trade_index1',0);

//redis.client.incr('order_platform:trade_index1',(err,data)=>{
//    console.log(data);
//});

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



