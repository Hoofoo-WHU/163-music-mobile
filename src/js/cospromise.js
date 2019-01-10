COS.prototype.headBucketPromise = function (option) {
  return new Promise((resolve, reject) => {
    this.headBucket(option, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

COS.prototype.getBucketPromise = function (option) {
  return new Promise((resolve, reject) => {
    this.getBucket(option, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

COS.prototype.listObjectVersionsPromise = function (option) {
  return new Promise((resolve, reject) => {
    this.listObjectVersions(option, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

COS.prototype.deleteBucketPromise = function (option) {
  return new Promise((resolve, reject) => {
    this.deleteBucket(option, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}


COS.prototype.getBucketAclPromise = function (option) {
  return new Promise((resolve, reject) => {
    this.getBucketAcl(option, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}