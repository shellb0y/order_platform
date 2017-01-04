手机充值后台管理说明文档
====================

概述
---
本项目是由我们和另外的合作伙伴向第三方提供手机号码充值服务.其中第三方统称商户. 
大概流程:商户向我们提供的API接口提交订单,我们接收订单后利用京东账号和优惠券去下单和支付 
对账流程:商户采用预付款或由我们垫资,双方财务定期核实结算 

后台功能说明
---------- 

#### 入口:[op.yikao666.cn][1] JD订单管理-手机充值 

**账号列表页:**可以根据账号状态、来源、时间查询账号信息.同时还会统计出账号相关数据. 
**订单列表页:**可以根据订单状态、商户、关键字、时间来查询订单信息 
> **统计金额说明:** 

> - 总金额:所有订单的面值总和,列表中充值面额的总和.目前系统只支持100的面额充值. 
> - 应付金额:商户应付金额,列表中价格列的总和.不同商户不同运营商的价格有可能不一样. 
> - 实付金额:我们使用实际支付金额总和,列表中订单交易金额的总和.  

> **列表项说明:** 

> - 订单交易金额:京东订单交易金额,以分为单位
> - 订单金额:同订单交易金额,以元为单位,这是程序计算出来的金额,正常情况下应该和订单交易金额相等 
> - 价格:商户应付价格 
> - 账号用户名/账号密码:京东账号,可以登录后查询订单状态
> - 状态/回调状态:订单的状态与商户回调的状态 
> - 交易号/支付ID:正常每个订单都会有唯一的一个交易号.当支付后,则会生成一个唯一的支付ID 

> **队列说明:** 

> - 支付队列:存放已经下单成功的订单 
> - 成功队列:存放已经充值成功等待回调的订单 
> - 失败队列:存放充值失败等待等待回调的订单 
> - 异常订单:存放处理异常的订单,当此队列不为空时应立即通知开发人员 

> **回调按钮说明:** 

> - 支付成功回调按钮:当点击时,系统会去京东同步状态并且回调.使用场景:当系统订单状态是`已支付待人工核实`状态或者其他情况需要同步状态并且回调商户时可以使用. 
> - 订单成功回调:与上面支付成功回调一样,只不过省略了同步状态这一步骤.使用场景:当确定订单已经是`充值成功`状态,但没有回调给商户或者回调失败时可以使用. 
> - 订单失败回调:同上面订单成功回调一样,不同步状态,只回调商户.使用场景:当系统未回调或者超时时可以使用.

**账号上传:**根据固定格式批量导入账号 

**暂时监控项** 
----------
- 手动回调超时订单 
- 检查充值成功订单数与成功使用账号数量是否相等,各种金额是否正确
- 商户余额是否正确 

[1]:http://op.yikao666.cn