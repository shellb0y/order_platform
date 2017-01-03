#!/usr/bin/env bash
#curl -i -X POST \
#-H "Content-type:application/json" \
#-H "charset:utf-8" \
#-H "Accept: text/plain" \
#-d '{"cost":0,"data":["明枫芝辉馨星----cnm2016*----re59xnt8----pin=%E6%98%8E%E6%9E%AB%E8%8A%9D%E8%BE%89%E9%A6%A8%E6%98%9F; wskey=AAFYYg9OAFABS5B4jyVZhyWZ58-02ttCiWIk0Sv69VLnHdiAtvtEQVJkqbjPhFU4O837wSyP7QByDS6NIuInMnnRnywlmPNHnNkm527-xlmopKtWkpFO_g; whwswswws=; uuid=010254432301522-FEC4168C048C",
#"戴枝昭耿芸育lrX6----cnm2016*----qq345678----pin=%E6%88%B4%E6%9E%9D%E6%98%AD%E8%80%BF%E8%8A%B8%E8%82%B2lrX6; wskey=AAFYYg9PAFA1B1-FVsNRfCcbA1xCaU9_xDo1yPdHbjS90zNNdbqsz_0utNf5N-PxFfqG5V-OWzSqgSj97-JJcZJYEQ_A7d3zF2jkm3m7Wj4ZLSonvMXmJQ; whwswswws=; uuid=010185182301363-8C5E01E137BF;"]}'\
# http://139.199.65.115:3000/api/view/account

curl -X POST -d "trade_no=20161227162725190VOGCZZA00002" \
-H "Content-Type:application/x-www-form-urlencoded;charset=utf-8" -i http://localhost:3000/api/view/system/callback/faild