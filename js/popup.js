/* global chrome, fetch, Audio */

// 循环时间
const loopDelay = document.getElementById('loopDelay')
// 设置音量
const volumeValue = document.getElementById('setVolume')
// 自动回复的内容
const content = document.getElementById('content')

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

// 恢复设置的内容
chrome.storage.local.get(['getUrl', 'getSkypeToken', 'getLoopDelay', 'getVolumeValue', 'getContent'], ({ getLoopDelay, getVolumeValue, getContent }) => {
  loopDelay.value = getLoopDelay || ''
  volumeValue.value = getVolumeValue
  content.value = getContent || ''
})
