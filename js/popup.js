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
      const index = i % 10
      if (index == 0 && i != 0) await delay(80000)
      await sendText(queue[i][0], queue[i][1])
      status.innerText = `已发送：${i + 1} / ${queue.length}`
      await delay(2000)
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
function delay (time = 1500) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

// emotions
async function batchAtmosphere (url, keys) {
  keys = keys || ['laugh', '1f603_grinningfacewithbigeyes', 'happyeyes', '1f601_beamingfacewithsmilingeyes', 'xd', 'rofl', 'smile', 'wink', 'smileeyes', 'angel', 'inlove', 'hearteyes', 'stareyes', 'tongueout', '1f61b_facewithtongue', 'winktongueout', '1f917_huggingface', 'giggle', '1f920_facewithcowboyhat', 'party', 'cool', 'nerdy', '1f9d0_facewithmonocle', 'smilerobot', 'smilecat', '1f639_catwithtearsofjoy', 'hearteyescat', '1f63d_kissingcat', '1f640_wearycat', 'hearnoevil', '1f49d_heartwithribbon', 'sparklingheart', 'growingheart', '1f493_beatingheart', '1f49e_revolvinghearts', 'twohearts', '1f49f_heartdecoration', '2763_heartexclamation', 'heart', 'heartorange', 'heartyellow', 'heartgreen', 'heartblue', 'heartpurple', 'heartbrown', 'heartblack', 'heartwhite', '1f4af_hundredpointssymbol', '1f4a5_collisionsymbol', '1f4ab_dizzysymbol', 'like', 'happyface', 'blush', 'relieved', 'mmm', 'sun', 'loveearth', 'happy', 'nod', 'idea', 'talk', 'learn', 'headphones', 'selfie', 'aokijump', 'heston', 'xmascwl', 'festiveparty', 'rudolfsurprise', 'rudolfidea', '1f44b_wavinghand', '1f91a_raisedbackofhand', '1f590_handwithfingerssplayed', '270b_raisedhand', 'vulcansalute', 'ok', 'victory', 'crossedfingers', '1f91f_loveyougesture', '1f918_signofthehorns', 'yes', '1f44a_oncomingfist', 'clappinghandsskype', 'handsinair', '1f450_openhands', '1f932_palmsuptogether', 'handshake', 'praying', 'hi', 'rock', 'fingerscrossed', 'listening', 'xmasyes', 'fistbump', '1f646_persongesturingok', 'man_gesturing_ok', 'womangesturingok', 'person_tipping_hand', 'man_tipping_hand', 'womantippinghand', 'happy_person_raising_one_hand', 'man_raising_hand', 'womanraisinghand', 'runner', 'gottarun', 'running', 'monkey', 'dog', '1f9ae_guidedog', '1f415_200d_1f9ba_servicedog', 'cat', 'lion', '1f42f_tigerface', 'reindeer', '1f42e_cowface', '1f437_pigface', '1f40f_ram', 'lamb', '1f410_goat', '1f42a_dromedarycamel', '1f42b_bactriancamel', '1f992_giraffe', 'elephant', '1f42d_mouseface', '1f439_hamsterface', 'hedgehoghug', '1f43b_bearface', 'koala', 'panda', '1f423_hatchingchick', '1f424_babychick', '1f425_frontfacingbabychick', '1f426_bird', 'penguin', '1f54a_doveofpeace', '1f986_duck', '1f9a2_swan', '1f989_owl', '1f438_frogface', 'fish', 'tropicalfish', 'bee', 'cherryblossom', '1f33a_hibiscus', 'sunflower', 'flower', 'tulip', 'seedling', 'evergreentree', 'deciduoustree', 'cactus', '1f33e_earofrice', '1f33f_herb', '2618_shamrock', 'goodluck', '1f341_mapleleaf', '1f342_fallenleaf', 'fallingleaf', 'penguinkiss', 'hug', 'racoon', 'seal', 'stingray', 'orangutanwave', 'monkeygiggle', 'smilemonkey', 'hearteyesmonkey', 'laughmonkey', 'heidy', 'acorn', 'hungrycat', 'snowangel', 'snegovik', 'gingerkeepfit', 'porg', 'mistletoe', 'grapes', '1f348_melon', 'watermelon', 'orange', 'lemon', 'banana', 'pineapple', '1f96d_mango', 'apple', '1f34f_greenapple', '1f350_pear', 'peach', 'cherries', 'strawberry', '1f95d_kiwifruit', '1f345_tomato', '1f965_coconut', '1f955_carrot', '1f33d_earofmaize', '1f336_hotpepper', '1f952_cucumber', '1f96c_leafygreen', '1f966_broccoli', '1f9c4_garlic', '1f9c5_onion', '1f344_mushroom', '1f95c_peanuts', '1f330_chestnut', '1f35e_bread', 'croissant', '1f956_baguettebread', '1f968_pretzel', '1f96f_bagel', '1f95e_pancake', '1f9c7_waffle', 'cheese', '1f356_meatonbone', 'chickenleg', '1f969_cutofmeat', '1f953_bacon', 'burger', 'fries', 'pizza', '1f32d_hotdog', '1f96a_sandwich', '1f32e_taco', '1f32f_burrito', '1f959_stuffedflatbread', '1f9c6_falafel', '1f95a_egg', '1f373_cooking', '1f958_shallowpanoffood', '1f372_potoffood', '1f963_bowlwithspoon', '1f957_greensalad', '1f37f_popcorn', '1f9c8_butter', '1f9c2_salt', '1f96b_cannedfood', '1f371_bentobox', '1f358_ricecracker', '1f359_riceball', '1f35a_cookedrice', '1f35b_curryandrice', 'noodles', '1f35d_spaghetti', '1f360_roastedsweetpotato', '1f362_oden', '1f363_sushi', '1f364_friedshrimp', '1f365_fishcakewithswirldesign', '1f96e_mooncake', '1f361_dango', '1f95f_dumpling', '1f960_fortunecookie', '1f961_takeoutbox', '1f366_softicecream', '1f367_shavedice', '1f368_icecream', '1f369_doughnut', 'cookies', 'cake', 'cakeslice', 'cupcake', 'pie', '1f36b_chocolatebar', '1f36c_candy', '1f36d_lollipop', '1f36e_custard', '1f36f_honeypot', '1f37c_babybottle', '1f95b_milkglass', '1f9ca_icecube', '2600_sunwithrays', 'star', '1f31f_glowingstar', 'fire', 'xmastree', 'fireworks', 'sparkler', '2728_sparkles', '1f388_balloon', '1f389_partypopper', '1f38a_confettiball', '1f380_ribbon', 'gift', 'trophy', 'goldmedal', 'diamond', '1f4f7_camera', 'camera', 'windturbine', 'tumbleweed', '1f505_lowbrightnesssymbol', '1f506_highbrightnesssymbol', '2705_whiteheavycheckmark', '2611_ballotboxwithcheck', '2714_heavycheckmark']
  for (let i = 0; i < keys.length; i++) {
    const index = i % 10
    if (index == 0 && i != 0) await delay(80000)
    await atmosphere(url, keys[i])
    await delay(2000)
  }
}

async function atmosphere (url, key) {
  const emotions = { key }
  const obj = { emotions }
  chrome.storage.local.get(['getUrl', 'getSkypeToken'], async ({ getUrl, getSkypeToken }) => {
    const json = await fetch(url, {
      headers: {
        authentication: 'skypetoken=' + getSkypeToken,
        'content-type': 'application/json'
      },
      body: JSON.stringify(obj),
      method: 'PUT',
    }).then(text => text.text())
    console.log(json)
  })
}

