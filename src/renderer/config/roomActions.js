// // add message to message-list/area and then scroll
// // @toAdd: {message, type, from}
// function addMessage (list, toAdd, boxEle, scrollEle) {
//   var stp = getHeight(boxEle) > scrollEle.height() ? getHeight(boxEle) : scrollEle.height()
//   // list.push(toAdd)
//   scrollEle.animate({
//     scrollTop: stp
//   })
// }

// finger out height of all message items box
function getHeight (ele, scrollEle) {
  var heightArray = [].map.call(ele, function (v, i) {
    return v.offsetHeight + 20
  })
  var totalHeight = heightArray.reduce(function (prev, curv, i) {
    return prev + curv
  }, 0)
  var h = totalHeight > scrollEle.height() ? totalHeight : scrollEle.height()
  return h
}

function imgTrans (clipData, e) {
  var types = clipData.types
  if (!types.find(v => v === 'Files')) {
    return
  }
  var data = {}
  // var url = ''
  for (var i = 0; i < types.length; i++) {
    if (types[i] === 'Files') {
      data = clipData.items[i].getAsFile()
    }
    // if (types[i] === 'text/plain') {
    //   clipData.items[i].getAsString(function (s) {
    //     var reg = /file:\/\/\/[^"]*/
    //     url = reg.exec(s)[0]
    //   })
    // }
  }
  if (!data) {
    return
  }
  var fd = new FormData()
  // console.log(clipData.items[0])
  // console.log(data)
  fd.append('file', data)
  return fd
}
// function imgTrans (clipData, e) {
//   console.log(clipData)
//   var types = clipData.types
//    for( var i = 0 ; i < types.length; i++ ){
//     clipData.items[i].getAsString( (s) => {
//       if (s) {
//         e.innerHTML = s
//       }
//       console.log(s)
//     })
//     if( types[i] === 'Files' ){
//         console.log(i)
//         console.log(clipData.items[i])
//         console.log(clipData.items[i].getAsFile())
//         // break;
//     }
//   }
//   if (clipData.items[0].kind !== 'file' || clipData.items[0].type.substr(0, 5) !== 'image') {
//     return false
//   }
//   var fd = new FormData()
//   var data = clipData.items[0].getAsFile()
//   // console.log(clipData.items[0])
//   // console.log(data)
//   fd.append('file', data)
//   return fd
// }

var roomActions = {
  getHeight: getHeight,
  imgTrans: imgTrans
}
export default roomActions
