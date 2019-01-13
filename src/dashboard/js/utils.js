~function () {
  function formatFileSize(fileSize, idx = 0) {
    const units = ["B", "KB", "MB", "GB"]
    if (fileSize < 1024 || idx === units.length - 1) {
      return fileSize.toFixed(2) + units[idx]
    }
    return formatFileSize(fileSize / 1024, ++idx)
  }
  function Song(file) {
    let matches = file.name.match(/^(.+)\.(\w+)$/)
    this.type = matches[2]
    let namemach = matches[1] && matches[1].split('-', 2)
    this.name = namemach[1] || namemach[0]
    this.singer = namemach[0]
    this.size = formatFileSize(file.size)
    this.file = file
  }
  function toSonglist(filelist) {
    return new Set([].map.call(filelist, file => new Song(file)))
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
  window.utils = {
    toSonglist,
    formatFileSize,
    getFileMD5
  }
}()