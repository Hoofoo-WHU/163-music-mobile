{
  let EventHub = window.utils.EventHub
  let Model = window.utils.Model
  window.app = {
    eventHub: new EventHub(),
    state: {
      set scrollTop(val) {
        $('body, html').scrollTop(val)
      }
    },
    TEMPLATES: {
      SONG_ITEM({ name, singer, album, sq, objectId }) {
        return $(`
          <a href="./play?id=${objectId}" class="song-item">
            <div class="info">
              <h2 class="line-clamp-1">${name}</h2>
              <p class="line-clamp-1">${sq ? '<i class="sq"></i>' : ''}${singer} - ${album}</p>
            </div>
            <div class="play"><i></i></div>
          </a>`)
      }
    }
  }
}