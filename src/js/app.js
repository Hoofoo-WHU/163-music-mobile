{
  let EventHub = window.utils.EventHub
  let Model = window.utils.Model
  window.app = {
    eventHub: new EventHub(),
    state: new Model({
      data: {},
      methods: {}
    })
  }
}