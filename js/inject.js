
const scriptStr = `
// 初始化界面
function init () {
  const body = document.querySelector('body')
  // 按钮 CSS 样式
  const style = 'top:30px;left:150px;auto;z-index:1;position:fixed;width:80px;height:30px;color:white;'
  // 插入开始按钮
  const startButton = document.createElement('button')
  startButton.setAttribute('id', 'startBtn')
  startButton.setAttribute('style', style + 'background:green;')
  const startNode = document.createTextNode('开始')
  startButton.appendChild(startNode)
  body.appendChild(startButton)
  // 插入停止按钮
  const stopButton = document.createElement('button')
  stopButton.setAttribute('id', 'stopBtn')
  stopButton.setAttribute('style', style + 'background:red;display:none;')
  const stopNode = document.createTextNode('停止')
  stopButton.appendChild(stopNode)
  body.appendChild(stopButton)
}
init()

/**
 * @description 延迟
 * @param {string} userID - 用户ID
 */
function delay (sec) {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 * sec)
  })
}

/**
 * @description 发送数据到后台
 * @param {Array} data - 数据
 */
function send (data) {
  new Promise((resolve) => {
    chrome.runtime.sendMessage('${chrome.runtime.id}', data,
      res => {
        resolve(res)
      } // End res
    ) // End sendMessage
  })
}

// 延迟秒数
const delaySec = document.getElementsByClassName('initInfo')[0].id

let autoScan

// 扫描页面
async function scanPage () {
  let index = 0
  // 获取聊天列表
  const getList = document.querySelectorAll('div[role="button"]')
  for (const x of getList) {
    // 获取信息
    const getDetail = x.ariaLabel
    // 判断发消息的个人用户，并且最后一条不是自动回复
    if (getDetail.includes('条新消息') && !getDetail.includes('多人会话')) {
      // 点击进入页面
      x.querySelectorAll('div[role="none"]')[6].click()
      await delay(1)
      // 点击个人资料
      document.querySelector('button[role="button"][aria-label="管理组设置"]').click()
      await delay(1)
      // 获取ID
      const userID = document.querySelector('button[role="button"][aria-label^="Skype 用户名"]').ariaLabel.split(', ')[1]
      // 发送消息
      send(['sendText', '8:' + userID])
      index++
    } // End if
  } // Endi for of
  // 有新消息的时候播放声音
  if (index) send(['ding'])
}

// 获取按钮
const start = document.getElementById('startBtn')
const end = document.getElementById('stopBtn')

// 开始循环
start.addEventListener('click', function () {
  start.style.display = 'none'
  end.style.display = ''
  autoScan = setInterval(function () {
    scanPage()
  }, 1000 * delaySec)
})

// 停止循环
document.getElementById('stopBtn').addEventListener('click', function () {
  end.style.display = 'none'
  start.style.display = ''
  clearInterval(autoScan)
})
`

const script = document.createElement('script')
const node = document.createTextNode(scriptStr)
script.appendChild(node)
document.getElementsByTagName('body')[0].appendChild(script)
