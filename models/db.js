var Sequelize = require('sequelize');

//var sequelize = new Sequelize('mysql://root:1qaz@WSX@192.168.2.111:3306/task_schedule?useUnicode=true&characterEncoding=utf8');
var sequelize = new Sequelize("mobile_pay", "root", "1qaz@WSX", {
    host: "120.26.213.143",
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

db.pay_account = sequelize.import('./pay_account');
db.ticket_order = sequelize.import('./ticket_order');
db.account = sequelize.import('./account');


module.exports = db;