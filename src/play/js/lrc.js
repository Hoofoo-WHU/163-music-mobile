window.Lrc = class {
  constructor(lrctxt) {
    this.lrctxt = lrctxt
    this.reg = /\[([\d:\.]+)\](.+)/g
  }
  next() {
    let matches = this.reg.exec(this.lrctxt)
    if (matches) {
      let time = matches[1].split(':')
      return { time: time[0] * 60 + (+time[1]), text: matches[2].trim() }
    }
    return null
  }
  behind() {
    let res = []
    let i = null
    while (i = this.next()) {
      res.push(i)
    }
    return res
  }
}

window.lrctxt = "[by:drugswithoutlove]\n[tool:歌词滚动姬 (lrc-maker.github.io)]\r\n[00:00.488] 我是个大盗贼\r\n[00:02.586] 什么也不怕\r\n[00:05.468] 生活多自在\r\n[00:08.048] 成天乐哈哈\r\n[00:37.781] 绿色的森林里\r\n[00:40.701] 有草也有花\r\n[00:44.081] 没有告密者\r\n[00:47.359] 也没有警察\r\n[00:50.625] 我是个大盗贼\r\n[00:53.891] 我什么也不怕\r\n[00:57.188] 生活多自在\r\n[01:00.543] 成天乐哈哈\r\n[01:17.031] 我有胡椒枪\r\n[01:20.247] 还有胡椒面\r\n[01:23.498] 我不怕告密者\r\n[01:26.810] 也不怕警察\r\n[01:30.062] 我是个大盗贼\r\n[01:33.290] 什么也不怕\r\n[01:36.604] 生活多自在\r\n[01:39.819] 成天乐哈哈\r\n[02:22.024] 卡车和集装箱\r\n[02:25.894] 还有伐木工\r\n[02:29.230] 吃掉了大森林\r\n[02:32.438] 要拆掉我的家\r\n[02:35.793] 我是个大盗贼\r\n[02:39.021] 什么也不怕\r\n[02:42.272] 我不怕告密者\r\n[02:45.505] 也不怕警察\r\n[03:15.216] 坦克和烟雾弹\r\n[03:18.566] 还有机关枪 啪！啪！\r\n[03:21.854] 没收了我的枪\r\n[03:25.178] 拆了我的家\r\n[03:28.379] 我是个大盗贼\r\n[03:31.593] 我什么也不怕\r\n[03:34.988] 我只要大森林\r\n[03:38.087] 还有我的家\r\n[03:54.764] 我是个大盗贼\r\n[03:57.834] 我什么也不怕\r\n[04:01.281] 我不怕告密者\r\n[04:04.381] 也不怕警察 来呀！\r\n[04:33.517] 我是个大盗贼\r\n[04:37.003] 什么也不怕\r\n[04:40.507] 生活多自在\r\n[04:44.346] 成天乐哈哈"