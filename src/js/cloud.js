let bucket = '163-music-mobile-1256107964'
let region = 'ap-beijing'
let prefix = 'songs/'
var cos = new COS({
  SecretId: 'AKID0vbALLO6Soy05RJengJbio3Rp91ndbZz',
  SecretKey: '9Vu6F5Hzp3tLbccKrDRQckNfheS36wu2',
})
cos.headBucketPromise({ Bucket: bucket, Region: region })
  .then(data => {
    console.log(data)
  }, err => {
    console.log(err)
  })

~async function () {
  try {
    let data = await cos.getBucketPromise({ Bucket: bucket, Region: region, Prefix: prefix, Delimiter: '/' })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}()



~async function () {
  try {
    let data = await cos.listObjectVersionsPromise({ Bucket: bucket, Region: region, Prefix: prefix })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}()

~async function () {
  try {
    let data = await cos.deleteBucketPromise({ Bucket: bucket, Region: region })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}()


~async function () {
  try {
    let data = await cos.getBucketAclPromise({ Bucket: bucket, Region: region })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}()