{
  const eventBus = window.app.eventBus
  const utils = window.utils
  let http = {
    init() {
      this.bucket = '163-music-mobile-1256107964'
      this.region = 'ap-beijing'
      this.prefix = 'songs/'
      this.cos = new COS({
        getAuthorization: this.getAuthorizationFunction({ username: 'admin', password: 'wangshuo521' })
      })
      this.bindEvent()
    },
    async uploadMusic(songlist) {
      songlist.forEach(async song => {
        let md5 = await utils.getFileMD5(song.file)
        this.cos.putObjectPromise({
          Bucket: this.bucket,
          Region: this.region,
          Key: `${this.prefix}${md5}.${song.type}`,
          Body: song.file,
          onProgress: function (progressData) {
            console.dir(progressData);
          }
        }).then(data => {
          if (md5 === JSON.parse(data.ETag)) {
            console.log(`上传成功，地址为:${data.Location}`)
          }
          console.log('上传成功')
        }).catch(e => {
          console.log(e)
        })
      })
    }, bindEvent() {
      eventBus.on('uploadmusic', (musiclist) => {
        this.uploadMusic(musiclist)
      })
    },
    getAuthorizationFunction({ username, password }) {
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
  }
  http.init()
  window.cos = http.cos
}

    // let musicListElement = document.querySelector('#musicList')

    // ~async function () {
    //   try {
    //     let data = await cos.getBucketPromise({
    //       Bucket: bucket,
    //       Region: region,
    //       Prefix: prefix,
    //       Delimiter: '/'
    //     })
    //     data.Contents.filter(val => val.Key !== prefix).forEach(async val => {
    //       let res = await cos.getObjectUrlPromise({
    //         Bucket: bucket,
    //         Region: region,
    //         Key: val.Key,
    //         Sign: false
    //       })
    //       val.Url = res.Url
    //       let li = document.createElement('li')
    //       li.innerText = JSON.stringify(val)
    //       musicListElement.querySelector('ol').appendChild(li)
    //     })
    //   } catch (e) {
    //     console.error('获取音乐列表失败', e)
    //   }
    // }()