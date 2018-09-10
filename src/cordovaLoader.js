export default function loadCordova (cb) {
  appendCordovaScript()
  document.addEventListener('deviceready', () => {
    cb()
  })
}

function appendCordovaScript () {
  const hasAlready = document.URL.indexOf('http') !== 0 || window.hasOwnProperty('cordova')
  if (hasAlready) {
    return
  }
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = getCordovaUrl()
  document.head.appendChild(script)
}

function getCordovaUrl () {
  const params = window.location.search.substr(1).split('&')
  // default platform is browser
  const platform = params.reduce((p, kv) => {
    const split = kv.split('=')
    return split[0] === '_cp' ? split[1] : p
  }, 'browser')
  return `cordova/${platform}/platform_www/cordova.js`
}
