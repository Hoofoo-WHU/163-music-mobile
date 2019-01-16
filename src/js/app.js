{
  let EventHub = window.utils.EventHub

  $('#app>header .download').on('click', () => {
    window.open('https://github.com/Hoofoo-WHU/163-music-mobile')
  })

  $('#app .openApp').on('click', () => {
    window.open('https://github.com/Hoofoo-WHU')
  })

  window.app = {
    eventHub: new EventHub(),
    state: {
      set scrollTop(val) {
        $('body, html').scrollTop(val)
      }
    },
    TEMPLATES: {
      SONG_ITEM({ name, singer, album, sq, objectId, rank }) {
        return $(`
          <a href="./play?id=${objectId}" class="song-item">
            ${rank === undefined ? '' : `<div class="rank">${rank}</div>`}
            <main class="boder-bottom-1px light">
              <div class="info">
                <h2 class="line-clamp-1">${name}</h2>
                <p class="line-clamp-1">${sq ? '<i class="sq"></i>' : ''}${singer} - ${album}</p>
              </div>
              <div class="play"><i></i></div>
            </main>
          </a>`)
      }
    }
  }
}