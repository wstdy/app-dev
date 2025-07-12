export function compEval(str) {
    if (str === null) {
      return "";
    }
    if (typeof str != "string") {
      str = str + "";
    }
    let multObj = str.match(/\(([^\(\\)]*?)\)/g); //匹配括号
    while (null != multObj) {
      let content = multObj[0] + "";
      let result = simpleEval(content.substr(1, content.length - 2));
      str = str.replace(multObj[0], result);
      multObj = str.match(/\(([^\(\\)]*?)\)/g);
    }
    return simpleEval(str);
  }
  function simpleEval(str) {
    if (str === null) {
      return "";
    }
    if (typeof str != "string") {
      str = str + "";
    }
    let valueArray = []; //值数组
    let markArray = []; //符号数组
    let tempValue = "";
    let ch = str.split("");
    let isOper = false;
    for (let i = 0; i < ch.length; i++) {
      if (ch[i] == "+" || ch[i] == "-" || ch[i] == "*" || ch[i] == "/") {
        let dv = tempValue * 1;
        if (isOper) {
          let value = valueArray.pop();
          let mark = markArray.pop();
          dv = simpleTwoEval(mark, value, dv);
        }
        valueArray.push(dv);
        markArray.push(ch[i]);

        tempValue = "";
        isOper = false;
        if (ch[i] == "*" || ch[i] == "/") isOper = true;
      } else {
        tempValue += ch[i] + "";
        if (i == ch.length - 1) {
          let dv = tempValue * 1;
          if (isOper) {
            let dv1 = valueArray.pop();
            let mark = markArray.pop();
            dv = simpleTwoEval(mark, dv1, tempValue);
          }
          valueArray.push(dv);
        }
      }
    }
    valueArray = reverseArray(valueArray);
    markArray = reverseArray(markArray);
    while (valueArray.length > 1) {
      let v1 = valueArray.pop();
      let v2 = valueArray.pop();
      let mark = markArray.pop();
      valueArray.push(simpleTwoEval(mark, v1, v2));
    } 
    return valueArray[0];
  }

  function simpleTwoEval(mark, value1, value2) {
    if (mark == "+") {
      return value1 + value2;
    } else if (mark == "-") {
      return value1 - value2;
    } else if (mark == "*") {
      return value1 * value2;
    } else if (mark == "/") {
      return value1 / value2;
    }
    return 0;
  }

  function reverseArray(oldArray) {
    let newArray = [];
    let size = oldArray.length;
    for (let i = 0; i < size; i++) {
      newArray.push(oldArray.pop());
    }
    return newArray;
  }