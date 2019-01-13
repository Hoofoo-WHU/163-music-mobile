{
  let eventBus = window.app.eventBus
  let http = window.app.http
  let view = {
    init(controller, model) {
      this.controller = controller
      this.controller.init(this, model)
      this.controller.getMusicList()
      this.bindEvent()
    },
    el: $('#musicList'),
    tempate: {
      songRow({ name, singer, type, size, url }) {
        return $(`
        <tr>
          <td>${name}</td>
          <td>${singer}</td>
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
      eventBus.on('musiclist.show', () => {
        this.show()
      })
      eventBus.on('musiclist.hide', () => {
        this.hide()
      })
    },
    show() {
      this.el.addClass('active')
    },
    hide() {
      this.el.removeClass('active')
    },
    renderMusicList(musiclist) {
      let tbody = this.el.find('main tbody')
      tbody.html('')
      musiclist.forEach(song => {
        let $row = this.tempate.songRow(song)
        let $a = $('<a href="javascript:;">下载</a>').on('click', () => {
          eventBus.emit('downloadmusic', `${song.md5}.${song.type}`)
        })
        $row.find('.actions').append($a)
        tbody.append($row)
      })
    }
  }

  let model = {
    musiclist: {
      set(musiclist) {
        this.musiclist = musiclist
      },
      get() {
        return this.musiclist
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
    }
  }
  view.init(controller, model)
}