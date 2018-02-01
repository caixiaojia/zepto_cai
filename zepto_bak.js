/**
 * Created by caixiaojia on 2018/1/25.
 */
var Cai = (function() {
  var $,
    zepto = {},
    emptyArray = [],
    document = window.document,
    slice = emptyArray.slice,
    concat = emptyArray.concat,
    every = emptyArray.every,
    simpleSelectorRE = /^[\w-]*$/,
    class2type={},
    toString=class2type.toString

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0;i < len;i ++) {
      this[i] = dom[i]
    }
    this.selector = selector|| ''
    this.length = len
  }

  function likeArray(obj) {
    var length = !!obj && 'length' in obj && obj.length,
      type = $.type(obj)
    return 'function' != type && ('array' == type || length === 0 || (typeof length == 'number' && length > 0 && (length - 1) in obj))
  }

  function flatten(array) {
    return array.length > 0 ? $.fn.concat.apply([], array) : array
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

  zepto.isZ = function (object) {
    return object instanceof Z
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

  zepto.matches = function (elements, selector) {
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
    slice: slice,
    get: function (idx) {
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function () {
      return this.get()
    },
    concat: function () {
      var i, value, args = []
      for (i = 0; i < arguments.length; i ++ ) {
        value = arguments[i]
        args[i] = zepto.isZ(value) ? value.toArray() : value
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
    },
    map: function (fn) {
      return $($.map(this, function (el, i) {
        return fn.call(el, i , el)
      }))
    },
    ready: function (callback) {
      if (document.readyState === 'complete' || (document.readyState !=='loading' && !document.documentElement.doScroll)) {
        setTimeout(function () {
          callback($)
        }, 0)
      } else {
        var handler = function () {
          document.removeEventListener('DOMContentLoaded', handler, false)
          window.removeEventListener('load', handler, false)
          callback($)
        }
      }
      document.addEventListener('DOMContentLoaded', handler, false)
      window.addEventListener('load', handler, false)
    },
    size: function () {
      return this.length
    },
    each: function (callback) {
      every.call(this, function (el, index) {
        return callback(el, index)!== false
      })
      return this
    },
    remove: function () {
      this.each(function () {
        if (this.parentNode != null) {
          this.parentNode.removeChild(this)
        }
      })
    },
    filter: function () {
      
    }

  }


  "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (item, index, arr) {
    class2type[ "[object " + item + "]" ] = item.toLowerCase()
  })

  $.type = function (obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  $.map = function (elements, callback) {
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0;i < elements.length; i ++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      } else {
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    }
    return flatten(values)
  }

  $.isFunction =  function (value) {
    return $.type(value) == 'function'
  }

  zepto.Z.prototype = Z.prototype = $.fn

  return $
})()

window.Cai = Cai
window.$$ === undefined && (window.$$ = Cai)
