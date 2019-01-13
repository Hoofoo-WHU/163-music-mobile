{
  let eventBus = window.app.eventBus
  let view = {
    el: $('#userManage'),
    init(controller, model) {
      this.controller = controller
      this.controller.init(this, model)
      this.bindEvent()
    },
    bindEvent() {
      eventBus.on('usermanage.show', () => {
        this.show()
      })
      eventBus.on('usermanage.hide', () => {
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

  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
    }
  }
  view.init(controller, model)
}