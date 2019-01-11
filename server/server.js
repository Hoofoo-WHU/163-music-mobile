const STS = require('qcloud-cos-sts')
const bodyParser = require('body-parser')
const express = require('express')
const config = require('./cos.config') // 配置文件


// // 创建临时密钥服务
var app = express()
app.use(bodyParser.json())

// 支持跨域访问
app.all('*', function (req, res, next) {
  res.header('Content-Type', 'application/json')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'origin,accept,content-type')
  if (req.method.toUpperCase() === 'OPTIONS') {
    res.end()
  } else {
    next()
  }
})


// 格式一：临时密钥接口
app.post('/sts', function (req, res, next) {
  // 判断用户信息
  console.log(req.body)
  if (req.body.username !== config.username || req.body.password !== config.password) {
    res.statusCode = 403
    res.end()
    return
  }
  // 获取临时密钥
  const LongBucketName = config.bucket
  const ShortBucketName = LongBucketName.substr(0, LongBucketName.lastIndexOf('-'))
  const AppId = LongBucketName.substr(LongBucketName.lastIndexOf('-') + 1)
  const policy = {
    'version': '2.0',
    'statement': [{
      'action': config.allowActions,
      'effect': 'allow',
      'principal': { 'qcs': [''] },
      'resource': [
        `qcs::cos:${config.region}:uid/${AppId}:prefix//${AppId}/${ShortBucketName}/${config.allowPrefix}`
      ]
    }]
  }
  const startTime = Math.round(Date.now() / 1000)
  STS.getCredential({
    secretId: config.secretId,
    secretKey: config.secretKey,
    proxy: config.proxy,
    durationSeconds: config.durationSeconds,
    policy: policy,
  }, function (err, tempKeys) {
    var result = JSON.stringify(err || tempKeys) || ''
    result.startTime = startTime
    res.send(result)
  })
})


app.all('*', function (req, res, next) {
  res.statusCode = 404
  res.send('404 Not Found')
})

// 启动签名服务
app.listen(3000)
console.log('app is listening at http://127.0.0.1:3000')