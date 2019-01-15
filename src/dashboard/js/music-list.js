{
  let eventBus = window.app.eventBus
  let http = window.app.http
  let view = {
    init(controller, model) {
      this.scrollTop = 0
      this.controller = controller
      this.controller.init(this, model)
      this.controller.getMusicList()
      this.bindEvent()
    },
    el: $('#musicList'),
    tempate: {
      songRow({ name, singer, type, size, url, album }) {
        return $(`
        <tr>
          <td>${name}</td>
          <td>${singer}</td>
          <td>${album || '未知'}</td>
          <td>${type}</td>
          <td>${size}</td>
          <td>
            <div class="actions">
              <a href="//${url}" target="_blank">播放</a>
            </div>
          </td>
        </tr>
        `)
      }
    },
    bindEvent() {
      this.el.on('click', '.actions .uploadMusic', () => {
        eventBus.emit('showupload')
      })
      eventBus.on('musiclist.add', (song) => {
        this.controller.addSong(song)
      })
      eventBus.on('musiclist.show', () => {
        this.show()
      })
      eventBus.on('musiclist.hide', () => {
        this.hide()
      })
      eventBus.on('musiclist.remove', (song) => {
        this.controller.removeSong(song)
      })
    },
    show() {
      this.el.addClass('active')
      this.el.parent().scrollTop(this.scrollTop)
    },
    hide() {
      this.scrollTop = this.el.parent().scrollTop()
      this.el.removeClass('active')
    },
    renderMusicList(musiclist) {
      let tbody = this.el.find('main tbody')
      tbody.html('')
      musiclist.forEach(song => {
        let $row = this.tempate.songRow(song)
        let $a = $('<a href="javascript:;">下载</a>').on('click', () => {
          this.controller.download(song)
        })
        let $d = $('<a href="javascript:;">删除</a>').on('click', () => {
          this.controller.remove(song)
        })
        $row.find('.actions').append($a, $d)
        tbody.append($row)
      })
    }
  }

  let model = {
    musiclist: {
      set(musiclist) {
        this.musiclist = new Set(musiclist)
      },
      get() {
        return this.musiclist
      },
      add(song) {
        this.musiclist.add(song)
      },
      remove(song) {
        this.musiclist.delete(song)
      }
    }
  }

  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
    },
    async getMusicList() {
      let musiclist = await http.getMusicList()
      this.model.musiclist.set(musiclist)
      this.view.renderMusicList(this.model.musiclist.get())
    },
    download(song) {
      eventBus.emit('downloadmusic', `${song.md5}.${song.type}`)
    },
    addSong(song) {
      this.model.musiclist.add(song)
      this.view.renderMusicList(this.model.musiclist.get())
    },
    removeSong(song) {
      this.model.musiclist.remove(song)
      this.view.renderMusicList(this.model.musiclist.get())
    },
    remove(song) {
      http.removeSong(song)
    }
  }
  view.init(controller, model)
}