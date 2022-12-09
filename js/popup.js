/* global chrome, fetch, Audio */

// 域名前缀
const url = document.getElementById('url')
// Skype 访问令牌
const skypeToken = document.getElementById('skypeToken')
// 循环时间
const loopDelay = document.getElementById('loopDelay')
// 设置音量
const volumeValue = document.getElementById('setVolume')
// 自动回复的内容
const content = document.getElementById('content')

// 配置储存到内存中
url.addEventListener('change', () => {
  chrome.storage.local.set({ getUrl: url.value })
})
skypeToken.addEventListener('keyup', () => {
  chrome.storage.local.set({ getSkypeToken: skypeToken.value })
})
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
chrome.storage.local.get(['getUrl', 'getSkypeToken', 'getLoopDelay', 'getVolumeValue', 'getContent'], ({ getUrl, getSkypeToken, getLoopDelay, getVolumeValue, getContent }) => {
  url.value = getUrl
  skypeToken.value = getSkypeToken || ''
  loopDelay.value = getLoopDelay || ''
  volumeValue.value = getVolumeValue
  content.value = getContent || ''
})
