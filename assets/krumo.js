
var krumo = function(mixed) {
  this.level = 0;
  var elements = [];
  var l = function(mixed) {
    if (typeof mixed == 'number') {
      mixed = mixed.toString();
    }
    var l = 0;
    for (var i in mixed) {
      l++
    }
    return l;
  }

  var create_element = function(property, value, type, length, level, before) {
    var classes = "krumo" + ((level > 0) ? ' krumo-parent' : ' krumo-top');

    type = (type == 'object' && typeof before.length != 'undefined') ? 'array' : type;
    length += type == 'string' ? ' characters' : ' elements';

    if (type == 'string' || type == 'number' || type == 'boolean') {
      length = type == 'boolean' ? '' : ', ' + length;
      return '<li class="' + classes + '"><div class="krumo-value krumo-' + type + '"><strong>' + property + '</strong> <em>(' + type + length + ')</em> <strong>' + value + '</strong></div></li>';
    } else {
      return '<li class="' + classes + '"><div class="krumo-value krumo-' + type + '"><strong>' + property + '</strong> <em>(' + type + ', ' + length + ')</em></div>' + value + '</li>';
    }
  }

  for (var i in mixed) {
    if (typeof mixed[i] != 'object') {
      elements.push(create_element(i, mixed[i], typeof mixed[i], l(mixed[i]), level));
    } else {
      var temp = krumo(mixed[i]);
      elements.push(create_element(i, '<ul>' + temp + '</ul>', typeof mixed[i], l(mixed[i]), level, mixed[i]));
    }
  }

  level++;
  return elements.join('');
}
