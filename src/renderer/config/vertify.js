
let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z0-9]{2,6}$/
let reg1 = /^1[3-9][0-9]{9}$/
function regStr (str) {
  return reg.test(str) || reg1.test(str)
}

function supRegStr (str) {
  return reg.test(str) || reg1.test(str) || !str === ''
}

function pwTest (str) {
  if (str === undefined) {
    return false
  } else {
    if (str.length < 6) {
      return false
    } else {
      return true
    }
  }
}

let Vertify = {
  vertify: regStr,
  supVertify: supRegStr,
  pwTest: pwTest
}
export default Vertify
