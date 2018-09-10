module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  baseUrl: process.env.NODE_ENV === 'production' ? '' : '/',
  css: {
    sourceMap: true
  }
}
