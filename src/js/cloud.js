const bucket = '163-music-mobile-1256107964'
const region = 'ap-beijing'
const prefix = 'songs/'
function getAuthorizationFunction({ username, password }) {
  async function getAuthorization(options, callback) {
    try {
      let res = await axios.post('http://127.0.0.1:3000/sts', {
        username,
        password,
        bucket: options.Bucket,
        region: options.Region
      })
      callback({
        TmpSecretId: res.data.credentials.tmpSecretId,
        TmpSecretKey: res.data.credentials.tmpSecretKey,
        XCosSecurityToken: res.data.credentials.sessionToken,
        ExpiredTime: res.data.expiredTime
      })
    } catch (e) {
      console.error(e)
    }
  }
  return getAuthorization
}
let cos = new COS({
  getAuthorization: getAuthorizationFunction({ username: 'admin', password: 'wangshuo521' })
})

document.querySelector('#uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault()
  let file = this.querySelector('input[type="file"]').files[0]
  let md5 = await getFileMD5(file)
  cos.putObjectPromise({
    Bucket: bucket,
    Region: region,
    Key: `${prefix}${file.name}`,
    Body: file,
    onProgress: function (progressData) {
      console.dir(progressData);
    }
  }).then(data => {
    // 校验md5
    if (md5 === JSON.parse(data.ETag)) {
      console.log(`上传成功，地址为:${data.Location}`)
    }
  })
})

function getFileMD5(file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader()
    fileReader.addEventListener('loadend', function (e) {
      let result = e.target.result
      resolve(SparkMD5.ArrayBuffer.hash(result))
    })
    fileReader.readAsArrayBuffer(file)
  })
}