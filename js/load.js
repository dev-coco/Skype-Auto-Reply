// 将变量设置到页面
chrome.storage.local.get(['getLoopDelay'], ({ getLoopDelay }) => {
  const body = document.querySelector('body')
  const para = document.createElement('div')
  para.setAttribute('class', 'initInfo')
  para.setAttribute('id', getLoopDelay)
  body.appendChild(para)
})
