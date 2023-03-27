/* global chrome, fetch, Audio */

// 循环时间
const loopDelay = document.getElementById('loopDelay')
// 设置音量
const volumeValue = document.getElementById('setVolume')
// 自动回复的内容
const content = document.getElementById('content')
// 表格链接
const sheetUrl = document.getElementById('sheetUrl')
//状态
const status = document.getElementById('status')

// 将获取储存数据
loopDelay.addEventListener('keyup', () => {
  chrome.storage.local.set({ getLoopDelay: loopDelay.value })
})
volumeValue.addEventListener('input', () => {
  chrome.storage.local.set({ getVolumeValue: volumeValue.value })
})
content.addEventListener('keyup', () => {
  chrome.storage.local.set({ getContent: content.value })
})
sheetUrl.addEventListener('keyup', () => {
  chrome.storage.local.set({ getSheetUrl: sheetUrl.value })
})

document.getElementById('sendMessage').addEventListener('click', async () => {
  try {
    const sheetID = sheetUrl.value.replace(/.+\/d\/|\/.+/g, '')
    const json = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/skype!A2:D?key=AIzaSyD8toAK7am_TNK2qCQ9HfzCCftzlmnoY9I`).then(json => json.json())
    const queue = []
    for (const x of json.values) {
      // 有填写内容并且状态为TRUE
      if (x[0] !== '' && x[1] !== '' && x[2] === 'TRUE') queue.push([x[0], x[1]])
    }
    for (let i = 0; i < queue.length; i++) {
      await sendText(queue[i][0], queue[i][1])
      status.innerText = `已发送：${queue.length} / ${i + 1}`
      await delay()
    }
    status.innerText = '完成'
  } catch (error) {
    console.log(error)
    alert('表格链接格式错误')
  }
})

// 恢复设置的内容
chrome.storage.local.get(['getUrl', 'getSkypeToken', 'getLoopDelay', 'getVolumeValue', 'getContent', 'getSheetUrl'], ({ getLoopDelay, getVolumeValue, getContent, getSheetUrl }) => {
  loopDelay.value = getLoopDelay || ''
  volumeValue.value = getVolumeValue
  content.value = getContent || ''
  sheetUrl.value = getSheetUrl || ''
})

/**
 * @description 发送消息
 * @param {string} userID - 用户ID
 * @param {string} content - 内容
 * @param {string} getSkypeToken - 范围令牌
 */
async function sendText (userID, content) {
  const info = {
    clientmessageid: Math.random().toString().slice(2),
    content,
    messagetype: 'RichText',
    contenttype: 'text'
  }
  chrome.storage.local.get(['getUrl', 'getSkypeToken'], async ({ getUrl, getSkypeToken }) => {
    const json = await fetch(`https://${getUrl}client-s.gateway.messenger.live.com/v1/users/ME/conversations/${userID}/messages`, {
      headers: {
        authentication: 'skypetoken=' + getSkypeToken,
        'content-type': 'application/json'
      },
      body: JSON.stringify(info),
      method: 'POST',
    }).then(json => json.json())
    console.log(json)
  })
}

// 延迟
function delay () {
  return new Promise(resolve => {
    setTimeout(resolve, 1500)
  })
}
