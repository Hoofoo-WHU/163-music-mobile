{
  let eventBus = window.app.eventBus
  let view = {
    init(controller, model) {
      this.controller = controller
      this.controller.init(this, model)
      this.bindEvent()
    },
    el: $('#musicList'),
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
    }
  }
  let model = {
    uploadMusic() {

    }
  }
  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
    }
  }
  view.init(controller, model)
}