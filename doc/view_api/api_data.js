define({ "api": [  {    "type": "GET",    "url": "/account",    "title": "获取账号列表",    "name": "GET_ACCOUNTS",    "version": "1.0.0",    "group": "Account",    "description": "<p>获取账号</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "source",            "description": "<p>账号来源,根据角色从/account/source或者/account/source/{partner_name}接口获取,管理员可以查看单个来源或者传入&quot;所有&quot;来查看所有账号状态</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "status",            "description": "<p>成功|失败|未使用|所有</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "from",            "description": "<p>开始时间</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "to",            "description": "<p>结束时间</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "page_index",            "description": "<p>页码,从0开始</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "page_size",            "description": "<p>每页数据条数</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "list",            "description": "<p>数据列</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.cost",            "description": "<p>账号成本</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.source",            "description": "<p>是否启用</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.password",            "description": "<p>账号密码</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.username",            "description": "<p>账号用户名</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.cookie",            "description": "<p>app cookie</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.pc_cookie",            "description": "<p>pc cookie</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.account_id",            "description": "<p>账号ID</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.order_count",            "description": "<p>账号订单数</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.pay_status",            "description": "<p>账号订单支付状态,0未支付,1已支付</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.valid",            "description": "<p>账号是否有效,0无效1有效</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.valid_message",            "description": "<p>账号无效原因</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.unused_discount",            "description": "<p>未使用的优惠券金额</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "total",            "description": "<p>总页数</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "pageCurrent",            "description": "<p>当前页码</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "stat",            "description": "<p>统计数据,已用中文标注,建议在页面动态生成</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"list\": [\n    {\n      \"cost\": 0,\n      \"source\": \"xiaoafei\",\n      \"password\": \"vbnm1357\",\n      \"username\": \"luyi56352\",\n      \"unused_discount\": 5\n    },\n    {\n      \"cost\": 0,\n      \"source\": \"xiaoafei\",\n      \"password\": \"peishi12196\",\n      \"username\": \"nubeiemea\",\n      \"unused_discount\": 5\n    },\n    ...\n  ],\n  \"total\": 390,\n  \"pageCurrent\": 1,\n  \"stat\": {\n    \"账号总数\": 390,\n    \"优惠券总额\": 1950,\n    \"已使用优惠券金额\": 10,\n    \"使用成功账号数\": 2,\n    \"使用失败账号数\": 195,\n    \"未使用账号数\": 192\n  }\n}",          "type": "json"        }      ]    },    "examples": [      {        "title": "Example usage:",        "content": "curl -i /api/view/account?source=xiaoafei&status=%E6%89%80%E6%9C%89&from=2016-12-1&to=2016-12-20&page_index=0&page_size=30",        "type": "json"      }    ],    "filename": "api/view/account.js",    "groupTitle": "Account"  },  {    "type": "GET",    "url": "/account/source",    "title": "获取账号来源",    "name": "GET_ACCOUNT_SOURCE",    "version": "1.0.0",    "group": "Account",    "description": "<p>获取账号来源,只有管理员才调用</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n['xiaoafei']",          "type": "json"        }      ]    },    "filename": "api/view/account.js",    "groupTitle": "Account"  },  {    "type": "GET",    "url": "/account/source/{partner}",    "title": "获取一级合作伙伴账号来源",    "name": "GET_PARTNER_ACCOUNT_SOURCE",    "version": "1.0.0",    "group": "Account",    "description": "<p>获取一级合作伙伴账号来源</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -i /api/view/account/source/fbtest",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n['xiaoafei']",          "type": "json"        }      ]    },    "filename": "api/view/account.js",    "groupTitle": "Account"  },  {    "type": "POST",    "url": "/account",    "title": "上传账号",    "name": "UPLOAD_ACCOUNT",    "version": "1.0.0",    "group": "Account",    "description": "<p>上传账号</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -i -X POST \\\n-H \"Content-type:application/json\" \\\n-H \"charset':utf-8\" \\\n-H \"Accept: text/plain\" \\\n-d '{\"cost\":0,\"data\":[\"明枫芝辉馨星----cnm2016*----re59xnt8----pin=%E6%98%8E%E6%9E%AB%E8%8A%9D%E8%BE%89%E9%A6%A8%E6%98%9F; wskey=AAFYYg9OAFABS5B4jyVZhyWZ58-02ttCiWIk0Sv69VLnHdiAtvtEQVJkqbjPhFU4O837wSyP7QByDS6NIuInMnnRnywlmPNHnNkm527-xlmopKtWkpFO_g; whwswswws=; uuid=010254432301522-FEC4168C048C\",\n\"戴枝昭耿芸育lrX6----cnm2016*----qq345678----pin=%E6%88%B4%E6%9E%9D%E6%98%AD%E8%80%BF%E8%8A%B8%E8%82%B2lrX6; wskey=AAFYYg9PAFA1B1-FVsNRfCcbA1xCaU9_xDo1yPdHbjS90zNNdbqsz_0utNf5N-PxFfqG5V-OWzSqgSj97-JJcZJYEQ_A7d3zF2jkm3m7Wj4ZLSonvMXmJQ; whwswswws=; uuid=010185182301363-8C5E01E137BF;\"]}'\\\n/api/view/account",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>是否成功</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "affectedRows",            "description": "<p>受影响行数</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"affeted_rows\": 2\n}",          "type": "json"        }      ]    },    "filename": "api/view/account.js",    "groupTitle": "Account"  },  {    "type": "GET",    "url": "/order",    "title": "获取订单列表",    "name": "GET_ORDER_LIST",    "version": "1.0.0",    "group": "Order",    "description": "<p>获取订单列表,管理员多增加一个参数s=1即可查看所有数据,否则不显示敏感数据</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "source",            "description": "<p>商户名,商户只能看自己的订单,一级合作伙伴和管理员可以查看所有商户(传入中文&quot;所有&quot;)的订单</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "status",            "description": "<p>状态(对商户和一级合作伙伴而言:暂时只有三个状态:充值成功|充值失败|充值中,对管理员而言可以访问/order/status(获取订单状态)获取所有状态)</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "from",            "description": "<p>开始时间</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "to",            "description": "<p>结束时间</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "page_index",            "description": "<p>页码,从0开始</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "page_size",            "description": "<p>每页数据条数</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "list",            "description": "<p>数据列</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.money",            "description": "<p>订单交易金额</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.amount",            "description": "<p>充值金额</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.dxqids",            "description": "<p>优惠券ID</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.mobile",            "description": "<p>充值手机号</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.status",            "description": "<p>状态(商户和一级合作伙伴需要包装一下状态,只显示三个状态:充值成功|充值失败|充值中</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "list.account",            "description": "<p>略.详见获取账号列表接口</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "list.partner",            "description": "<p>略.详见获取商户接口</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.areaName",            "description": "<p>手机号所在省份</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.callback",            "description": "<p>订单回调地址</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.discount",            "description": "<p>优惠金额</p>"          },          {            "group": "Success 200",            "type": "Float",            "optional": false,            "field": "list.jd_price",            "description": "<p>计算得出的订单金额</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.trade_no",            "description": "<p>订单交易号</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.jd_order_id",            "description": "<p>京东订单ID</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.pay_task_id",            "description": "<p>支付ID</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "list.order_timeout",            "description": "<p>订单超时时间</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.partner_price",            "description": "<p>合作伙伴价格</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.callback_status",            "description": "<p>订单回调状态</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "list.partner_order_id",            "description": "<p>商户订单号</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "list.order_request_time",            "description": "<p>订单接收时间</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "list.order_handler_time",            "description": "<p>订单处理时间</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "list.order_handler_complete_time",            "description": "<p>订单处理完成时间</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "list.order_faild_time",            "description": "<p>订单失败时间</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "list.pay_callback_time",            "description": "<p>支付完成时间</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "list.order_callback_time",            "description": "<p>订单回调时间</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "list.order_callback_complete_time",            "description": "<p>订单回调完成时间</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "total",            "description": "<p>总页数</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "pageCurrent",            "description": "<p>当前页码</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "stat",            "description": "<p>统计数据,建议在页面动态生成</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n {\n   \"list\": [\n     {\n       \"money\": 9400,\n       \"amount\": \"100\",\n       \"dxqids\": \"8146039734\",\n       \"mobile\": \"18942529630\",\n       \"status\": \"充值失败\",\n       \"account\": {\n         \"valid\": 1,\n         \"cookie\": \"pin=nveci682185781; wskey=AAFYWJkBAEAFL-f97v1_a7IJxHa3bYeB-EBJyxhj9-thJaKVI1tMf9TPmhooqWA9vSdSMvcg5sLUFydNO2ZfkNnkm2RSItik; whwswswws=00\",\n         \"source\": \"xiaoafei\",\n         \"password\": \"ojijejaneb\",\n         \"username\": \"nveci682185781\",\n         \"pc_cookie\": \"pt_key=app_openAAFYVfvCADB4DZi87pnMAUqUtbSXIN8d3HzzqhsMc5t_hs4OV6AZm8HBU7xLdnB1DAaaKHkdwyI; pt_pin=nveci682185781; pwdt_id=nveci682185781; sid=4d1c6f60dd5fbe420fd8002b1ff1d8dw; guid=b52238fadaf58b777a0251ee58c56914a7509258bebdaf1fbaf6b25cf91f36bf; thor1=; wskey=AAFXz-aEAEDe3-g0O81BvyUqHh0DhB9HLCYY3W8b-Fnkl0vpVUzW4pjL4orYmCfg5vjhOu7GaNpM1-oW46MrkbRXMUkyvpon; pin=nveci682185781; uuid=586159291101182-282c137bf37b ;sid=4d1c6f60dd5fbe420fd8002b1ff1d8dw\",\n         \"account_id\": 594\n       },\n       \"partner\": {\n         \"code\": \"ZZ\",\n         \"name\": \"fbtest\",\n         \"enable\": 1,\n         \"secret\": \"0Y$$sTx0\",\n         \"balance\": 9999999,\n         \"order_timeout\": \"0\"\n       },\n       \"areaName\": \"湖南\",\n       \"callback\": \"http://192.168.3.113:3000/v1/api/callback\",\n       \"discount\": 5,\n       \"jd_price\": 94,\n       \"trade_no\": \"20161220103342872LYXEZZA00001\",\n       \"jd_order_id\": \"47781193057\",\n       \"pay_task_id\": \"6ff1f3feb57546cd9fd856985029cab9\",\n       \"providerName\": \"电信\",\n       \"order_timeout\": \"Tue Dec 20 2016 10:33:42 GMT+0800 (CST)0\",\n       \"partner_price\": 97,\n       \"callback_status\": \"回调成功\",\n       \"order_faild_time\": \"2016-12-20 11:52:47.403000\",\n       \"partner_order_id\": \"12321\",\n       \"pay_callback_time\": \"2016-12-20 11:31:29\",\n       \"order_handler_time\": \"2016-12-20 10:33:44.272000\",\n       \"order_request_time\": \"2016-12-20 10:33:42\",\n       \"order_callback_time\": \"2016-12-20 12:03:44\",\n       \"order_handler_complete_time\": \"2016-12-20 10:35:47.143000\",\n       \"order_callback_complete_time\": \"2016-12-20 12:03:44\"\n     },\n     ...\n   ],\n   \"total\": 8,\n   \"pageCurrent\": 1,\n   \"stat\": {\n     \"总金额\": 400,\n     \"对账金额\": 388\n   }\n }",          "type": "json"        }      ]    },    "examples": [      {        "title": "Example usage:",        "content": "curl -i /api/view/order?source=xiaoafei&status=%E6%89%80%E6%9C%89&from=2016-12-1&to=2016-12-20&page_index=0&page_size=30",        "type": "json"      }    ],    "filename": "api/view/order.js",    "groupTitle": "Order"  },  {    "type": "GET",    "url": "/order/status",    "title": "获取订单状态",    "name": "GET_ORDER_STATUS",    "version": "1.0.0",    "group": "Order",    "description": "<p>获取订单状态,只有管理员才调用</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n[\n     {\n       \"status\": \"\\\"充值成功\\\"\"\n     },\n     {\n       \"status\": \"\\\"下单失败\\\"\"\n     },\n     {\n       \"status\": \"\\\"充值失败\\\"\"\n     },\n     {\n       \"status\": \"\\\"正在下单\\\"\"\n     }\n ]",          "type": "json"        }      ]    },    "filename": "api/view/order.js",    "groupTitle": "Order"  },  {    "type": "GET",    "url": "/partner",    "title": "获取商户",    "name": "GET_PARTNER",    "version": "1.0.0",    "group": "Partner",    "description": "<p>获取所有商户</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "code",            "description": "<p>商户编码</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>商户名称</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "price",            "description": "<p>价格</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "enable",            "description": "<p>是否启用</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "secret",            "description": "<p>密钥</p>"          },          {            "group": "Success 200",            "type": "FLOAT",            "optional": false,            "field": "balance",            "description": "<p>余额</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "partner",            "description": "<p>是否为一级合作伙伴(一级合作伙伴账号才有)</p>"          },          {            "group": "Success 200",            "type": "String[]",            "optional": false,            "field": "source",            "description": "<p>账号来源(一级合作伙伴账号才有,才可以查看账号情况)</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n[\n {\n     \"_data\": \"{\\\"code\\\": \\\"AA\\\", \\\"name\\\": \\\"yichongbao_1213\\\", \\\"price\\\": {\\\"电信\\\": 97, \\\"移动\\\": 98, \\\"联通\\\": 98}, \\\"enable\\\": 1, \\\"secret\\\": \\\"d!GqE$Sz\\\", \\\"balance\\\": 99510, \\\"order_timeout\\\": \\\"600\\\"}\"\n },\n {\n     \"_data\": \"{\\\"code\\\": \\\"AB\\\", \\\"name\\\": \\\"huifuxinxi\\\", \\\"price\\\": {\\\"电信\\\": 98, \\\"移动\\\": 98, \\\"联通\\\": 98}, \\\"enable\\\": 1, \\\"secret\\\": \\\"3!hw3nAP\\\", \\\"balance\\\": 100000, \\\"order_timeout\\\": \\\"30\\\"}\"\n },\n {\n     \"_data\": \"{\\\"code\\\": \\\"ZZ\\\", \\\"name\\\": \\\"fbtest\\\", \\\"price\\\": {\\\"电信\\\": 97, \\\"移动\\\": 98, \\\"联通\\\": 98}, \\\"enable\\\": 1, \\\"secret\\\": \\\"0Y$$sTx0\\\", \\\"balance\\\": 99034, \\\"order_timeout\\\": \\\"0\\\"}\"\n },\n {\n     \"_data\": \"{\\\"name\\\": \\\"xianshang\\\", \\\"partner\\\": 1, \\\"source\\\": [\\\"xiaoafei\\\"]}\"\n }\n]",          "type": "json"        }      ]    },    "filename": "api/view/partner.js",    "groupTitle": "Partner"  },  {    "type": "GET",    "url": "/partner/{partner_name}",    "title": "根据商户名称获取商户",    "name": "GET_PARTNER",    "version": "1.0.0",    "group": "Partner",    "description": "<p>根据商户名称获取商户</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "code",            "description": "<p>商户编码</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>商户名称</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "price",            "description": "<p>价格</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "enable",            "description": "<p>是否启用</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "secret",            "description": "<p>密钥</p>"          },          {            "group": "Success 200",            "type": "Float",            "optional": false,            "field": "balance",            "description": "<p>余额</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "partner",            "description": "<p>是否为一级合作伙伴(一级合作伙伴账号才有)</p>"          },          {            "group": "Success 200",            "type": "String[]",            "optional": false,            "field": "source",            "description": "<p>账号来源(一级合作伙伴账号才有,才可以查看账号情况)</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n[\n {\n \"_data\": \"{\\\"code\\\": \\\"ZZ\\\", \\\"name\\\": \\\"fbtest\\\", \\\"price\\\": {\\\"电信\\\": 97, \\\"移动\\\": 98, \\\"联通\\\": 98}, \\\"enable\\\": 1, \\\"secret\\\": \\\"0Y$$sTx0\\\", \\\"balance\\\": 99034, \\\"order_timeout\\\": \\\"0\\\"}\"\n }\n]\nHTTP/1.1 200 OK\n[\n {\n \"_data\": \"{\\\"name\\\": \\\"xianshang\\\", \\\"partner\\\": 1, \\\"source\\\": [\\\"xiaoafei\\\"]}\"\n }\n]",          "type": "json"        }      ]    },    "filename": "api/view/partner.js",    "groupTitle": "Partner"  },  {    "type": "POST",    "url": "/callback/faild",    "title": "订单失败回调",    "name": "CALLBACK_FAILD",    "version": "1.0.0",    "group": "System",    "description": "<p>订单失败回调,调用之后,系统不会去同步订单状态,而是直接回调商户,请谨慎调用</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -d \"trade_no=1111\" -H \"Content-Type:application/x-www-form-urlencoded;charset=utf-8\" -i /api/view/system/callback/paysuccess",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>是否成功</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n}",          "type": "json"        }      ]    },    "filename": "api/view/system.js",    "groupTitle": "System"  },  {    "type": "POST",    "url": "/callback/paysuccess",    "title": "支付成功回调",    "name": "CALLBACK_PAYSUCCESS",    "version": "1.0.0",    "group": "System",    "description": "<p>支付成功回调,调用之后,系统会去同步订单状态并且给商户回调,当成功时会减少账户余额,请谨慎调用</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -d \"trade_no=1111\" -H \"Content-Type:application/x-www-form-urlencoded;charset=utf-8\" -i /api/view/system/callback/paysuccess",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>是否成功</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n}",          "type": "json"        }      ]    },    "filename": "api/view/system.js",    "groupTitle": "System"  },  {    "type": "POST",    "url": "/callback/success",    "title": "订单成功回调",    "name": "CALLBACK_SUCCESS",    "version": "1.0.0",    "group": "System",    "description": "<p>订单成功回调,调用之后,系统不会去同步订单状态,而是直接回调商户并减少商户余额,请谨慎调用</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -d \"trade_no=1111\" -H \"Content-Type:application/x-www-form-urlencoded;charset=utf-8\" -i /api/view/system/callback/paysuccess",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>是否成功</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n}",          "type": "json"        }      ]    },    "filename": "api/view/system.js",    "groupTitle": "System"  },  {    "type": "GET",    "url": "/queue",    "title": "获取队列信息",    "name": "GET_QUEUE",    "version": "1.0.0",    "group": "System",    "description": "<p>获取队列信息</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -i /api/view/system/queue",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"支付队列\": 0,\n  \"成功队列\": 0,\n  \"失败队列\": 0\n}",          "type": "json"        }      ]    },    "filename": "api/view/system.js",    "groupTitle": "System"  }] });
