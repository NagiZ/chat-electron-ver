export default function (win) {
  const electron = require('electron')
  const {ipcMain} = electron

  // 最大化，最小化，缩放许可, 关闭
  ipcMain.on('min', e => {
    win.minimize()
  })

  ipcMain.on('max', e => {
    if (win.isMaximized()) {
      win.unmaximize()
      e.sender.send('sMax', 'm')
    } else {
      win.maximize()
      e.sender.send('sMax', 'um')
    }
  })

  ipcMain.on('resizable', (e, tag) => {
    if (tag === 1) {
      win.setResizable(true)
      win.setSize(720, 568)
      win.setMaximizable(true)
    } else {
      win.setResizable(true)
      win.setSize(720, 568)
      win.setMaximizable(true)
    }
  })

  ipcMain.on('close', e => {
    win.close()
  })
}
