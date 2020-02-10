chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });

  // new chrome.declarativeContent.ShowPageAction()
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  //   chrome.declarativeContent.onPageChanged.addRules([{
  //     conditions: [],
  //         actions: [new chrome.declarativeContent.ShowPageAction()]
  //   }]);
  // });
});


