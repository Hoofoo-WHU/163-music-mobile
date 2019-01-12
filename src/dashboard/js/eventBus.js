{
  let events = {}
  window.app.eventBus = {
    on(name, callback) {
      if (events[name]) {
        events[name].add(callback)
      } else {
        events[name] = new Set([callback])
      }
    },
    remove(name, callback) {
      if (events[name]) {
        events[name].delete(callback)
      }
    },
    emit(name, options, self) {
      if (events[name]) {
        events[name].forEach((callback) => {
          callback.call(self, options)
        })
      }
    }
  }
}