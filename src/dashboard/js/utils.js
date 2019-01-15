~function () {
  function formatFileSize(fileSize, idx = 0) {
    const units = ["B", "KB", "MB", "GB"]
    if (fileSize < 1024 || idx === units.length - 1) {
      return fileSize.toFixed(2) + units[idx]
    }
    return formatFileSize(fileSize / 1024, ++idx)
  }
  async function Song(file) {
    let song = {}
    let tags = await getMediaTag(file)
    song.type = file.name.replace(/^.+\./, '')
    song.name = tags.title
    song.singer = tags.artist
    song.album = tags.album
    song.cover = tags.picture
    song.size = formatFileSize(file.size)
    song.file = file
    return song
  }
  async function toSonglist(filelist) {
    let set = new Set([].map.call(filelist, async file => {
      let song = await Song(file)
      return song
    }))
    return Promise.all(set)
  }
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
  function getMediaTag(file) {
    return new Promise((resolve, reject) => {
      jsmediatags.read(file, {
        onSuccess: function (tag) {
          let res = {}
          res.title = tag.tags.title
          res.artist = tag.tags.artist
          res.album = tag.tags.album
          res.picture = new File([new Uint8Array(tag.tags.picture.data)], `name`, { type: tag.tags.picture.format })
          resolve(res)
        },
        onError: function (error) {
          reject(error)
        }
      })
    })
  }
  window.utils = {
    toSonglist,
    formatFileSize,
    getFileMD5,
    getMediaTag
  }
}()