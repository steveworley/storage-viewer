/* Inform the backgrund page that
 * this tab should have a page-action */
chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
});

/* Listen for message from the storage_view */
chrome.runtime.onMessage.addListener(function(msg, sender, response) {

  if ((msg.from == 'storage_view') && msg.subject.indexOf('clear') > -1) {
    var key = msg.subject.replace('clear:', '');
    window.localStorage.removeItem(key);
    response( { storage: window.localStorage } );
    return;
  }

  if ((msg.from == 'storage_view') && msg.subject.indexOf('update') > -1) {
    var key = msg.subject.split('::')[1], value = msg.subject.split('::')[2];
    window.localStorage.setItem(key, JSON.parse(value));
    response( { storage: window.localStorage } );
    return;
  }

  if ((msg.from === 'storage_view') && (msg.subject === 'DOMInfo')) {
    response( { storage: window.localStorage } );
    return;
  }
});
