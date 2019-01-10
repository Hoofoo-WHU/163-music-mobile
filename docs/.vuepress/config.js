let fs = require('fs')
function sidebarGenerator(ctx) {
  return ['/', ...fs.readdirSync(ctx.sourceDir)
    .filter(fn => /\w+.md$/.test(fn) && fn !== 'README.md')
    .map(fn => fn.slice(0, -3))]
}
module.exports = (ctx) => {
  return {
    title: '临时博客',
    dest: './docs',
    base: '/163-music-mobile/docs/',
    themeConfig: {
      sidebar: sidebarGenerator(ctx)
    }
  }
}