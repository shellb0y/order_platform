FROM daocloud.io/library/node:7.0
WORKDIR /usr/local/src/order_platform
ENTRYPOINT ["/bin/bash","-c","npm install && node --harmony bin/www"]
EXPOSE 3000