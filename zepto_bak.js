/**
 * Created by caixiaojia on 2018/1/25.
 */
var Cai = (function() {
  var $,
    zepto = {},
    emptyArray = [],
    document = window.document,
    slice = emptyArray.slice,
    simpleSelectorRE = /^[\w-]*$/

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0;i < len;i ++) {
      this[i] = dom[i]
    }
    this.selector = selector|| ''
    this.length = len
  }
  
  zepto.isZ = function (object) {
    return object instanceof Zepto.Z
  }
  
  zepto.qsa = function (element, selector) {
    var found,
      maybeID = selector[0] == '#',
      maybeClass = !maybeID && selector[0] == '.',
      nameOnly = maybeID || maybeClass ? selector.splice(1) : selector,
      isSimple = simpleSelectorRE.test(nameOnly)

    if (element.getElementById && maybeID) {
      found = element.getElementById(nameOnly) ? [found] : []
    } else if (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) {
      found = []
    } else if (!maybeID && element.getElementsByClassName){
      if (maybeClass) {
        found = slice.call(element.getElementsByClassName(nameOnly))
      } else {
        found = slice.call(element.getElementsByTagName(nameOnly))
      }
    } else {
      found = slice.call(element.querySelectorAll(selector))
    }
    return found
  }

  zepto.Z = function (dom, selector) {
    return new Z(dom, selector)
  }

  zepto.init = function (selector, context) {
    var dom
    if (!selector) {
      return zepto.Z()
    }
    else if (typeof selector === 'string') {
      selector = selector.trim()
      if (selector[0] === '<') {

      } else if (context != undefined) {
        return $(context).find(selector)
      } else {
        dom = zepto.qsa(document, selector)
      }
    }
    
    return zepto.Z(dom, selector)
  }

  $ = function (selector, context) {
    return zepto.init(selector, context)
  }

  $.fn = {
    constructor: zepto.Z,
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,
    get: function (idx) {
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    }
    // concat: function () {
    // }
  }

  Z.prototype = $.fn

  return $
})()

window.Cai = Cai
window.$$ === undefined && (window.$$ = Cai)
