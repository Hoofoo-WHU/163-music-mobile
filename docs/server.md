# 秘钥分发server

```shell
npm run server
```

3000端口

## 配置文件

```js
module.exports.default = {
  secretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  secretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  proxy: '',
  durationSeconds: 1800,
  bucket: 'test-1250000000',
  region: 'ap-guangzhou',
  allowPrefix: '_ALLOW_DIR_/*',
  // 密钥的权限列表
  allowActions: [
    // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
    // 简单上传
    'name/cos:PutObject',
    // 分片上传
    'name/cos:InitiateMultipartUpload',
    'name/cos:ListMultipartUploads',
    'name/cos:ListParts',
    'name/cos:UploadPart',
    'name/cos:CompleteMultipartUpload'
  ],
}
```

