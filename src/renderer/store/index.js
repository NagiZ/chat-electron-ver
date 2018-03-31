import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'qs'
import storage from './storage'
const apiLocation = 'http://api.otaku.chat/'
const picLocation = 'http://api.otaku.chat/pic/'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user_info: {
      name: '',
      token: '',
      ws_token: '',
      avatar: '',
      id: null,
      phone: ''
    },
    room_info: {
      user_list: {},
      messages_list: []
    },
    current_room_id: null,
    social_circle: [],
    ws: null
  },
  getters: {
    getUserInfo: state => state.user_info,
    getRoomInfo: state => state.room_info,
    getMsgListById: (state, getters) => (id) => {
      var value = state.room_info.messages_list.find(v => v.channel_id === id)
      if (!value) {
        return
      }
      return value.messages
    },
    getUnreadById: (state, getters) => (id) => {
      var value = state.room_info.messages_list.find(v => v.channel_id === id)
      if (!value) {
        return
      }
      return value.unread
    },
    getInfoById: (state, getters) => (id) => {
      var value = state.social_circle.find(v => v.channel_id === id)
      if (!value) {
        return
      }
      var sA = '他/她隐藏了此信息'
      var ct = new Date(1000 * value.create_time)
      var dt = new Date(1000 * value.date_time)
      var result = {
        basic: {
          'Name': value.name,
          'Channel With You': value.channel_id,
          'Id': value.id,
          'Two Way': value.two_way,
          'Date Time': dt.toLocaleDateString(),
          'Create Time': ct.toLocaleDateString() === 'Invalid Date' ? sA : ct.toLocaleDateString(),
          'Phone Number': value.phone || sA,
          'User Type': value.type || sA
        },
        info_in: value.info_in,
        avatar: value.avatar
      }
      return result
    },
    getCurRoomId: state => state.current_room_id,
    getWebSocket: state => state.ws,
    getSocialCircle: state => state.social_circle,
    getFirstMessage: state => {
      state.social_circle.forEach(v => {
        // var ml = state.room_info.messages_list.find(r => r.channel_id === v.channel_id)
      })
    }
  },
  mutations: {
    setUserInfo (state, data) {
      try {
        state.user_info.token = data.user_token
        state.user_info.id = data.id
        state.user_info.ws_token = data.ws_token
      } catch (err) {
        console.log(err)
      }
    },
    setUsername (state, data) {
      try {
        state.user_info.name = data
      } catch (err) {
        console.log(err)
      }
    },
    setCurRoomId (state, data) {
      state.current_room_id = data.id
    },
    setAvatar (state, data) {
      try {
        state.user_info.avatar = picLocation + data
      } catch (err) {
        console.log(err)
      }
    },
    renderFriendList (state, data) {
      if (data.length === 0) {
        return
      }
      try {
        data.forEach((v, i) => {
          // info_in: whether show infos about who you chatting to or not
          var vUser = Object.assign({}, v, {messages: [], unread: 0, info_in: false})
          vUser.avatar = picLocation + vUser.avatar
          state.social_circle.push(vUser)
          state.room_info.messages_list.push({channel_id: v.channel_id, messages: [], unread: 0})
        })
      } catch (err) {
        console.log(err)
      }
    },
    connectWs (state, data) {
      state.ws = new WebSocket('ws://173.254.200.108:2333')
      var ws = state.ws
      ws.onopen = function () {
        var loginMsg = {
          method: 'login',
          data: {
            user_token: data.data.user_token,
            ws_token: data.data.ws_token,
            id: data.data.id
          }
        }
        ws.send(JSON.stringify(loginMsg), (err) => {
          console.log(err)
        })
      }
      ws.onmessage = function (message) {
        if (message.data.method === 'logoutErr') {
          console.log(message.data)
          return
        }
        var msgdata = JSON.parse(message.data)
        console.log(msgdata)
        if (msgdata.method === 'sendMessage' || msgdata.method === 'sendImg') {
          msgdata.data.avatar = picLocation + msgdata.data.avatar
          var channelIn = state.room_info.messages_list.find(v => v.channel_id === msgdata.data.channel_id)
          msgdata.data.type = 1
          // 单向
          var oneWay = state.social_circle.find(v => v.channel_id === msgdata.data.channel_id)
          if (!channelIn || !oneWay) {
            channelIn = {
              channel_id: msgdata.data.channel_id,
              messages: [],
              unread: 0
            }
            state.room_info.messages_list.push(channelIn)
            oneWay = {
              name: msgdata.data.name,
              channel_id: msgdata.data.channel_id,
              id: msgdata.data.id,
              avatar: msgdata.data.avatar,
              messages: [],
              unread: 0,
              info_in: false
            }
            console.log(oneWay)
            state.social_circle.unshift(oneWay)
          }
          if (channelIn.channel_id !== state.current_room_id) {
            console.log('暂时不在此频道！')
            channelIn.unread++
            oneWay.unread++
          }
          channelIn.messages.push(msgdata)
          oneWay.messages.push(msgdata)
          state.social_circle.splice(state.social_circle.indexOf(oneWay), 1)
          state.social_circle.unshift(oneWay)
        }
        console.log(ws.readyState)
        setTimeout(function () {
          console.log(ws.readyState)
        }, 5000)
      }
      ws.onclose = function () {
        console.log('closing')
      }
    },
    closeWs (state) {
      try {
        if (state.ws !== null) {
          state.ws.terminate()
        }
      } catch (err) {
        console.log(err)
      } finally {
        state.ws = null
      }
    },
    addMessages (state, data) {
      console.log(data)
      var targetList = state.room_info.messages_list.find(v => v.channel_id === data.data.channel_id)
      var tarUser = state.social_circle.find(v => v.channel_id === data.data.channel_id)
      console.log(targetList)
      tarUser.messages.push(data)
      targetList.messages.push(data)
      state.social_circle.splice(state.social_circle.indexOf(tarUser), 1)
      state.social_circle.unshift(tarUser)
    },
    // show infos about who you chatting to
    showToInfo (state, data) {
      var tarUser = state.social_circle.find(v => v.channel_id === data.channel_id)
      state.social_circle.forEach(v => {
        v.info_in = false
      })
      switch (data.show_tag) {
        case 1:
          tarUser.info_in = true
          break
        case 0:
          tarUser.info_in = false
          break
        default: break
      }
    }
  },
  actions: {
    async sign (ctx, data) {
      var result = {}
      var loginData = qs.stringify({
        'phone': data.phone.trim(),
        'password': data.password.trim()
        // 'captcha': data.captcha
      })
      return axios.post(apiLocation + 'user/login', loginData).then((response) => {
        console.log(response.data)
        if (response.data.code === 200) {
          var rdata = response.data
          ctx.state.user_info.token = rdata.data.user_token
          ctx.commit('setUserInfo', rdata.data)
          ctx.commit('connectWs', {sData: data, data: rdata.data})
          result = {
            status: 200,
            message: 'Login Successfully!'
          }
        } else {
          result = {
            status: 400,
            message: response.data.message
          }
        }
        return result
      }).catch((err) => {
        console.log(err)
      })
    },
    async register (ctx, data) {
      var result = {}
      var registerData = qs.stringify({
        'phone': data.phone.trim(),
        'password': data.password.trim()
        // 'captcha': data.captcha
      })
      return axios.post(apiLocation + 'user/register', registerData).then((response) => {
        console.log(response)
        if (response.data.code === 200) {
          var rdata = response.data
          ctx.state.user_info.token = rdata.data.user_token
          ctx.commit('setUserInfo', rdata.data)
          ctx.commit('connectWs', {sData: data, data: rdata.data})
          result = {
            status: 200,
            message: 'Reagist Successfully!'
          }
        } else {
          result = {
            status: 555,
            message: 'Error: ' + response.data.message
          }
        }
        return result
      }).catch((err) => {
        console.log(err)
      })
    },
    async autoSign (ctx, data) {
      storage.setInfo(data.phone, data.password)
    },
    async getHostInfo (ctx) {
      return axios.post(apiLocation + 'user/get_my_info', qs.stringify({
        user_token: ctx.state.user_info.token
      })).then((response) => {
        if (response.data.code === 200) {
          var ui = response.data.data.info
          ctx.state.user_info.name = ui.name
          ctx.state.user_info.id = ui.id
          ctx.state.user_info.phone = ui.phone
          ctx.state.user_info.avatar = picLocation + ui.avatar
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    async getMyFriends (ctx, obj) {
      return axios.post(apiLocation + 'user/my_friends', qs.stringify({
        user_token: ctx.state.user_info.token
      })).then((response) => {
        ctx.commit('renderFriendList', response.data.data.list)
      }).catch((err) => {
        console.log(err)
      })
    },
    // tobe modify
    async getMyChannel (ctx, obj) {
      return axios.post(apiLocation + 'channel/my_channel_list', qs.stringify({
        user_token: ctx.state.user_info.token
      })).then((response) => {
        response.data.data.list.forEach(v => {
          v.messages = []
          v.unread = 0
          v.info_in = false
          v.channel_id = v.id
          ctx.state.social_circle.push(v)
          ctx.state.room_info.messages_list.push({channel_id: v.channel_id, messages: [], unread: 0})
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    async logout (ctx, obj) {
      var ws = ctx.state.ws
      if (ws) {
        var logoutMsg = {
          method: 'logout'
        }
        console.log(logoutMsg)
        ws.send(JSON.stringify(logoutMsg), (err) => {
          console.log(err)
        })
      }
    },
    getInChannel (ctx, data) {
      ctx.commit('setCurRoomId', data)
      var tarMsgList = ctx.state.room_info.messages_list.find(v => v.channel_id === data.id)
      var tarUser = ctx.state.social_circle.find(v => v.channel_id === data.id)
      // 设置vue对象的chatto属性, 可以在vuex中设置一个属性替代？
      data.obj.chatTo = {
        name: tarUser.name,
        avatar: tarUser.avatar
      }
      data.obj.avatarShow = true
      tarMsgList.unread = 0
      tarUser.unread = 0
      data.obj.$router.push('/index/room/' + tarUser.id)
    },
    async addFriend (ctx, data) {
      return axios.post(apiLocation + 'user/add_friend', qs.stringify({
        id: data.newId,
        user_token: ctx.state.user_info.token
      })).then((response) => {
        if (response.data.code === 200) {
          return {
            status: 200,
            message: 'Success!'
          }
        } else {
          return {
            status: 555,
            message: 'Failed'
          }
        }
      }).catch((err) => {
        console.log(err)
        return {
          status: 999,
          message: 'UNKNOWN ERROR!'
        }
      })
    },
    // user actions ====> userinfos change
    async changeName (ctx, data) {
      return axios.post(apiLocation + 'user/change_name', qs.stringify({
        name: data.new_name,
        user_token: ctx.state.user_info.token
      })).then(response => {
        if (response.data.code === 200) {
          ctx.commit('setUsername', data.new_name)
          return true
        } else {
          return false
        }
      }).catch(err => {
        console.log(err)
        return false
      })
    },
    async changeAvatar (ctx, data) {
      console.log(data.data.get('avatar'))
      data.data.append('user_token', ctx.state.user_info.token)
      var config = {
        headers: {
          'Content-Type': 'multiple/form-data'
        }
      }
      return axios.post(apiLocation + 'user/change_avatar', data.data, config).then(response => {
        console.log(response)
        if (response.data.code === 200) {
          return {
            status: 'success'
          }
        } else {
          return {
            status: 'failed'
          }
        }
      }).catch(err => {
        console.log(err)
        return {
          status: 'Error'
        }
      })
    },
    addToMsgList (ctx, data) {
      data.data.type = 0
      ctx.commit('addMessages', data)
    },
    async sendImg (ctx, data) {
      console.log(data.data.get('file'))
      data.data.append('user_token', ctx.state.user_info.token)
      var config = {
        headers: {
          'Content-Type': 'multiple/form-data'
        }
      }
      return axios.post(apiLocation + 'channel/uploadPic', data.data, config).then(response => {
        if (response.data.code === 200) {
          var ap = response.data.data
          return {
            path: ap.path,
            fpath: ap.fpath,
            apath: ap.apath
          }
        } else {
          alert('发送失败!')
        }
      }).catch(err => {
        console.log(err)
        alert('发送失败！')
      })
    },
    async createChannel (ctx, data) {
      return axios.post(apiLocation + 'channel/create_normal_channel', qs.stringify({
        user_token: ctx.state.user_info.token,
        name: data.newId
      })).then(response => {
        if (response.data.code === 200) {
          return {
            status: 200,
            message: `Create Channel ${data.name} successfully!`
          }
        } else {
          return {
            status: 555,
            message: 'Failed!'
          }
        }
      }).catch(err => {
        console.log(err)
        return {
          status: 999,
          message: 'UNKNOWN ERROR!'
        }
      })
    }
  }
})

export default store
