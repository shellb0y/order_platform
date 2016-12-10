var Sequelize = require('sequelize');

//var sequelize = new Sequelize('mysql://root:1qaz@WSX@192.168.2.111:3306/task_schedule?useUnicode=true&characterEncoding=utf8');
var sequelize = new Sequelize("order_platform", "root", "1qaz@WSX", {
    host: "139.199.65.115",
    port: 3306,
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.account = sequelize.import('./account_');
db.order = sequelize.import('./order_');


module.exports = db;