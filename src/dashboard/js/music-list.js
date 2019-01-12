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
    }
  }
  let model = {
    upload(xxx) {
      console.log(xxx)
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