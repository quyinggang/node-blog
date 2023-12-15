const path = require('node:path')

module.exports = {
  getStaticPath: () => {
    return path.join(__dirname, '..', 'public')
  }
}
