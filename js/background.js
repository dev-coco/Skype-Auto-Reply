// 点击插件加载 JS
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(tab.id, {
    file: 'js/inject.js'
  })
})

// 获取原生请求的 Header 参数
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const headers = details.requestHeaders
    try {
      // 获取链接前缀
      chrome.storage.local.set({ getUrl: details.url.match(/(?<=https:\/\/).*?(?=client)/g)[0] })
      headers.forEach(list => {
        // 获取 token
        if (list.name === 'Authentication') chrome.storage.local.set({ getSkypeToken: list.value.replace(/.+=/g, '') })
      })
    } catch {}
    return { requestHeaders: headers }
  },
  { urls: ['https://*.gateway.messenger.live.com/*'] },
  ['blocking', 'requestHeaders']
)

// 后台监听器
chrome.runtime.onMessageExternal.addListener((msg, sender, response) => {
  // 获取存在内存的数据
  chrome.storage.local.get(['getVolumeValue', 'getContent', 'getSkypeToken', 'getUrl'], ({ getVolumeValue, getContent, getSkypeToken, getUrl }) => {
    if (msg[0] === 'ding') {
      // 音频
      const audio = new Audio('data:audio/mpeg;base64,8yTEAAfQAdgBQwAAqBA4DgIBhYPggCGXPqBAMf8Mf/ygIAg78QHPiQ4XB9X1GPP/8yTEAwewzsgBkTgAWa5PqAxh98uOMA4bhXyHDKsn/jqWfK7/6Wf+Xe0GotAIkZ3/8yTEBwlJiu25xygCBoSzM4LAtNbbTqDwBSt/xjmM5TT/MUq//////6lGqkBFvpv/8yTEBAcwpsAAFlBgtFiMqF10m8IWPFAsguMp7Sbm4Elf///+ZiMIj4iMkEj4+d3/8yTECgn4jsgAAF4IaPssq6Q4HsSVRTwdPpagyHSR5upQKkVkXaq07f8jE2EgnHH/8yTEBQhpRt5YCZpgx+0FCOmaE4/1c4BlA/G19lt/+/SDP////O/8j0IW2ahYQYX/8yTEBgkhQvJeUAtiwAHJjzWVtxgNWPRNX8Mxsvobon/8qKn/+Fu//Z/+mgAFanb/8yTEBAco3uJYAgpusUUYXs8pdtyh4CgIBl6tXRv/lFf/4l//XQA0DNthnA8jF13/8yTECgdw3q24AoRsW7CwBjtzk0dSt014QOcCV9/0f6W7NN/mQU06mVDuyKmSEuD/8yTEDwdg2owAC9pECuMMfTbdXov/+Um///6lDnhkkkERuhUA3P7P1CgDQiz7EAf/8yTEFAdohsW4Acw2JZvrE3Q7f7f8ggBkBI9hVQS3Z4x6+VDcLf1M1VE+30JEj3L/8yTEGQfI3qG4AlRkWLitOd/0VQ0A5JBFh5Ze1eNCQb/OWqFLq9SXhQRBUbNDvb//8yTEHAdQ3rEYA0pi5JUAqD3IACAMp66NygOBf801n1b/5QeVIBqMOs+5A3gOe3D/8yTEIQbw2q2YAY5iPcGgYel+r6ABA+XxdQ92Vv/oHs2ed9+QAKn9wBjgY4jWor7/8yTEKAdA3qW4Ak5EqB0Ag6lORiKzpZv/QMakQvWn//rVn/AH')
      // 调节音量
      audio.volume = getVolumeValue / 100
      // 播放声音
      audio.play()
    } else if (msg[0] === 'sendText') {
      // 发送消息
      sendText(msg[1], getContent, getSkypeToken, getUrl)
    } // End if
  }) // End storage
  return true
})

/**
 * @description 发送消息
 * @param {string} userID - 用户ID
 * @param {string} content - 内容
 * @param {string} getSkypeToken - 范围令牌
 */
function sendText (userID, content, getSkypeToken, getUrl) {
  const info = {
    clientmessageid: Math.random().toString().slice(2),
    content,
    messagetype: 'RichText',
    contenttype: 'text'
  }
  fetch(`https://${getUrl}client-s.gateway.messenger.live.com/v1/users/ME/conversations/${userID}/messages`, {
    headers: {
      authentication: 'skypetoken=' + getSkypeToken,
      'content-type': 'application/json'
    },
    body: JSON.stringify(info),
    method: 'POST',
  }).then(json=>json.json())
}
