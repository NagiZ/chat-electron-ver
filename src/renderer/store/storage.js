const storage = window.localStorage

function setInfo (key, value) {
  var date = new Date()
  var data = {}
  data.expire = date.getTime() + 1000 * 60 * 60 * 24 * 30
  data.password = value
  data = JSON.stringify(data)
  storage.setItem(key, data)
}

function getInfo (key) {
  var value = storage.getItem(key)
  if (!value) {
    return
  }
  var result = JSON.parse(value)
  var date = new Date().getTime()
  if (result.expire < date) {
    return undefined
  } else {
    return result.password
  }
}

let storageModule = {
  setInfo: setInfo,
  getInfo: getInfo
}

export default storageModule
