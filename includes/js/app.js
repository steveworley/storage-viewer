var parseOutput = function(info) {
  this.info = info;
  return this;
}

parseOutput.prototype.getLength = function(mixed) {
  var length = 0;
  for (var i in mixed.toString()) {
    length++;
  }
  return length;
}

parseOutput.prototype.render = function() {
  var storage = this.info.storage, content = [];

  // Storage info - this is where the markup will live.
  var si = jQuery('#storage-info');

  for (var property in storage) {
    var _, item = storage[property];

    try {
      _ = JSON.parse(item);
    } catch (e) {
      _ = item;
    }

    // Add the wrapper.
    content.push('<div class="storage-item">');
    // Add the title and remove link.
    content.push('<p class="storage-title"><strong>' + property + '</strong> <a href="#" data-key="' + property + '">remove</a></p>');
    if (typeof _ == 'string' || typeof _ == 'number' || typeof _ == 'boolean') {
      var length = typeof _ == 'boolean' ? '' : ', ' + this.getLength(_) + ' characters';
      content.push('<p class="storage-value">&nbsp;&nbsp;<em>(' + typeof _ + length + ')</em> <strong>' + _ + '</strong></p>');
    } else {
      content.push('<ul class="krumo-output">' + krumo(_) + '</ul>');
    }

    // Close the storage item row.
    content.push('</div>');
  }

  if (content.length == 0) {
    content.push('<h3 class="no-storage">This site is not storing any data.</h3>');
  }

  // Add the content to the storage output div.
  si.html(content.join(''));
}

jQuery(function() {
  var si = jQuery('#storage-info');

  si.on('click', '.krumo-parent', function() {
    jQuery(this).children('ul').toggle();
    return false;
  });

  si.on('click', '.storage-title a', function() {
    var key = jQuery(this).data('key');
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      /* ...and send a request for the DOM info... */
      chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'storage_view', subject: 'clear:' + key},
        function(info) {
          var po = new parseOutput(info);
          po.render();
        }
      );
    });
    return false;
  });

  si.on('focusout', '[contenteditable]', function() {
    var key = $(this).parents('.storage-item').find('.storage-title').text().replace('remove', ''),
        value = $(this).text();

    key = $.trim(key);

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'storage_view', subject: 'update::' + key + '::' + value},
        function(info) {
          new parseOutput(info).render();
        }
      );
    });
  })
});


/* Once the DOM is ready... */
window.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.executeScript(null, {file: "includes/js/content_script.js"});
  /* ...query for the active tab... */
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    /* ...and send a request for the DOM info... */
    chrome.tabs.sendMessage(
      tabs[0].id,
      {from: 'storage_view', subject: 'DOMInfo'},
      function(info) {
        new parseOutput(info).render();
      }
    );
  });
});

var krumo=function(e){this.level=0;var t=[];var n=function(e){if(typeof e=="number"){e=e.toString()}var t=0;for(var n in e){t++}return t};var r=function(e,t,n,r,i,s){var o="krumo"+(i>0?" krumo-parent":" krumo-top");n=n=="object"&&typeof s.length!="undefined"?"array":n;r+=n=="string"?" characters":" elements";if(n=="string"||n=="number"||n=="boolean"){r=n=="boolean"?"":", "+r;return'<li class="'+o+'"><div class="krumo-value krumo-'+n+'"><strong>'+e+"</strong> <em>("+n+r+")</em> <strong>"+t+"</strong></div></li>"}else{return'<li class="'+o+'"><div class="krumo-value krumo-'+n+'"><strong>'+e+"</strong> <em>("+n+", "+r+")</em></div>"+t+"</li>"}};for(var i in e){if(typeof e[i]!="object"){t.push(r(i,e[i],typeof e[i],n(e[i]),level))}else{var s=krumo(e[i]);t.push(r(i,"<ul>"+s+"</ul>",typeof e[i],n(e[i]),level,e[i]))}}level++;return t.join("")}
