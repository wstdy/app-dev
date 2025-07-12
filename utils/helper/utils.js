export function isArray(value) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isNumber(value) {
  return !isNaN(Number(value));
}

export function isFunction(value) {
  return typeof value == 'function';
}

export function isString(value) {
  return typeof value == 'string';
}

export function isEmpty(value) {
  if (isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return value === '' || value === undefined || value === null;
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}

export function last(data) {
  if (isArray(data) || isString(data)) {
    return data[data.length - 1];
  }
}

export function cloneDeep(data) {
  var type = getObjType(data);
  var obj;
  if (type === 'array') {
      obj = [];
  } else if (type === 'object') {
      obj = {};
  } else {
      //不再具有下一层次
      return data;
  }
  if (type === 'array') {
      for (var i = 0, len = data.length; i < len; i++) {
          obj.push(cloneDeep(data[i]));
      }
  } else if (type === 'object') {
      for (var key in data) {
          obj[key] = cloneDeep(data[key]);
      }
  }
  return obj;
}
 
export function getObjType(obj){
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    // if (obj instanceof Element) {
    //     return 'element';
    // }
    return map[toString.call(obj)];
};
export function clone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

export function deepMerge(src, target) {
  let key;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function contains(parent, node) {
  while (node && (node = node.parentNode))
    if (node === parent) return true;
  return false;
}

export function orderBy(list, key) {
  return list.sort((a, b) => a[key] - b[key]);
}

export function deepTree(list) {
  const newList = [];
  const map = {};

  list.forEach((e) => (map[e.id] = e));

  list.forEach((e) => {
    const parent = map[e.parentId];

    if (parent) {
      (parent.children || (parent.children = [])).push(e);
    } else {
      newList.push(e);
    }
  });

  const fn = (list) => {
    list.map((e) => {
      if (e.children instanceof Array) {
        e.children = orderBy(e.children, 'orderNum');

        fn(e.children);
      }
    });
  };

  fn(newList);

  return orderBy(newList, 'orderNum');
}

export function revDeepTree(list = []) {
  const d = [];
  let id = 0;

  const deep = (list, parentId) => {
    list.forEach((e) => {
      if (!e.id) {
        e.id = id++;
      }

      e.parentId = parentId;

      d.push(e);

      if (e.children && isArray(e.children)) {
        deep(e.children, e.id);
      }
    });
  };

  deep(list || [], null);

  return d;
}

export function basename(path) {
  let index = path.lastIndexOf('/');
  index = index > -1 ? index : path.lastIndexOf('\\');
  if (index < 0) {
    return path;
  }
  return path.substring(index + 1);
}

export function isWxBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

/**
 * @description 如果value小于min，取min；如果value大于max，取max
 * @param {number} min
 * @param {number} max
 * @param {number} value
 */
export function range(min = 0, max = 0, value = 0) {
  return Math.max(min, Math.min(max, Number(value)));
}

/**
 * @description 根据字段去重 数组
 * @param {Array} arr 原数组
 * @param {string} field 字段
 */
export function uniqBy(arr = [], field = '') {
  const res = new Map();
  return arr.filter(item => !res.has(item[field]) && res.set(item[field], 1))
}

/* 如果没有下划线，不需要处理
如果有下划线，用下划线切割，第一个下划线左边的全部小写，后面的首字母大写，首字母后面的全部小写 */
export function camelCaseString(str) {
  if (!str) return;
  let camelCaseArr = str.split('_');
  if (camelCaseArr.length > 1) {
    camelCaseArr = camelCaseArr.map((item, index) => {
      const first = item.charAt(0);
      const exceptFirst = item.substring(1);
      return item
        .replace(exceptFirst, exceptFirst.toLowerCase())
        .replace(first, index ? first.toUpperCase() : first.toLowerCase());
    });
    return camelCaseArr.join('').replaceAll('_', '');
  } else {
    return str;
  }
}

export function sum(arr = []) {
  const sum = arr.reduce(function(prev, cur) {
    return prev + cur;
  }, 0);
  return sum
}

export function mean(arr = []) {
  return sum(arr) / arr.length
}

export function max(arr = []) {
  return Math.max(...arr)
}

export function min(arr = []) {
  return Math.min(...arr)
}

export function getCapitalizedMethod(num) {
  let val = ''
  if ((/(^[\-0-9][0-9]*(.[0-9]+)?)$/).test('' + num)) {
    let plusMinus = ''
    if (num < 0) plusMinus = '负'
    num = Math.abs(num);
    let NUM = new Array(
      "零",
      "壹",
      "贰",
      "叄",
      "肆",
      "伍",
      "陆",
      "柒",
      "捌",
      "玖",
      "拾"
    );
    let UNIT = new Array("", "拾", "佰", "仟", "万", "亿", "元", "");
    let splitNum = ("" + num).replace(/(^0*)/g, "").split("."),
      index = 0,
      numStr = "";
    for (let i = splitNum[0].length - 1; i >= 0; i--) {
      switch (index) {
        case 0:
          numStr = UNIT[7] + numStr;
          break;
        case 4:
          if (!new RegExp("0{4}//d{" + (splitNum[0].length - i - 1) + "}$").test(splitNum[0]))
            numStr = UNIT[4] + numStr;
          break;
        case 8:
          numStr = UNIT[5] + numStr;
          UNIT[7] = UNIT[5];
          index = 0;
          break;
      }
      if (index % 4 == 2 && splitNum[0].charAt(i + 2) != 0 && splitNum[0].charAt(i + 1) == 0)
        numStr = NUM[0] + numStr;
      if (splitNum[0].charAt(i) != 0) numStr = NUM[splitNum[0].charAt(i)] + UNIT[index % 4] + numStr;
      index++;
    }
    if (splitNum[0] == "") {
      numStr = NUM[0];
    }
    if (splitNum.length > 1) {
      let UNit2 = ['角', '分'];
      let roundNum = 2;
      // 加上小数部分(如果有小数部分)  保留两位小数
      numStr += UNIT[6];
      for (let i = 0; i < roundNum; i++) {
        let tempVal = splitNum[1].charAt(i) ? splitNum[1].charAt(i) : 0;
        numStr += NUM[tempVal] + UNit2[i];
      }
    } else {
      numStr += UNIT[6];
    }
    if (numStr == "一十") numStr = "十";
    if (numStr.match(/^一/) && numStr.length == 3) numStr = numStr.replace("一", "");
    val = plusMinus + numStr
  }
  return val;
}

export function timeToString(val, sym) {
  var date = new Date(val);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return y + sym + m + sym + d + ' ' + h + ':' + minute + ':' + second;
}

export default {
  getObjType
};