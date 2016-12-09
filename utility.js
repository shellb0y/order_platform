/**
 * Created by zhangting on 16/12/9.
 */

var utility = function(){};

utility.random_letter = function(len){
    len = len || 32;
    var $chars = 'abcdefghijklmnopqrstuvwxyz';
    var maxPos = $chars.length;
    var data = '';
    for (var i = 0; i < len; i++) {
        data += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return data;
};

module.exports = utility;