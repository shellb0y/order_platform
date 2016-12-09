/**
 * Created by zhangting on 16/12/9.
 */
var utility = require('../utility');
require('../date_ex');
require('../string_ex');

var date = new Date().format('yyyyMMddhhmmssS');
var random = utility.random_letter(4).toUpperCase();
var index = '1'.padLeft(5,'0');

var trade_no = `${date}${random}A${index}`;
console.log(trade_no);