import _ from 'lodash'

if (!_.isEmpty({})) throw new Error('teste')

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green!!!!!!!')
  })
})

chrome.commands.onCommand.addListener((shortcut) => {
  console.log('lets reload')
  console.log(shortcut)
  if (shortcut.includes('+M')) {
    chrome.runtime.reload()
  }
})
