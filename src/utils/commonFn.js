// 判断当前操作系统及app版本
export const APPSYS = () => {
  let s;
  const u = navigator.userAgent;
  const v = navigator.appVersion;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isAndroid) {
    s = 'Android';
  } else if (isIOS) {
    s = 'IOS';
  } else {
    s = 'Android';
  }
  return {
    v,
    s,
  };
};

/** 判空方法 */
export const notNull = (obj) => {
  if (obj === null) {
    return false;
  } if (obj === undefined) {
    return false;
  } if (obj === 'undefined') {
    return false;
  } if (obj === '') {
    return false;
  } if (obj === '[]') {
    return false;
  } if (obj === '{}') {
    return false;
  } if (obj === {}) {
    return false;
  } if (obj === []) {
    return false;
  }
  return true;
};

// 从url截取参数
export const getParamsFromUrl = (arg = '') => {
  const url = window.location.href;
  let result = '';
  let arr;
  if (url.indexOf('?') <= 0) { // 路径没有参数,返回空 ''
    return result;
  }
  let paramsString = url.split('?')[1];
  if (paramsString) {
    const paramsObj = {};
    if (paramsString.indexOf('&amp;') > 0) {
      paramsString = paramsString.indexOf('#/') > -1 ? paramsString.replace(/#\//g, '&amp;') : paramsString;
      paramsString.split('&amp;').forEach((item) => {
        arr = item.split('=');
        paramsObj[arr[0]] = arr[1];
      });
    } else {
      paramsString = paramsString.indexOf('#/') > -1 ? paramsString.replace(/#\//g, '&') : paramsString;
      paramsString.split('&').forEach((item) => {
        arr = item.split('=');
        paramsObj[arr[0]] = arr[1];
      });
    }
    if (arg && paramsObj[arg]) {
      result = paramsObj[arg];
    } else {
      console.log('查询的参数不存在');
    }
  }
  return result;
};
/** 获取移动端设备
 *1：Android；2：ios
 */
export const isMobile = () => {
  if (/android/i.test(navigator.userAgent) || /adr/i.test(navigator.userAgent)) {
    return 1;
  } if (/iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)) {
    return 2;
  }
  return 1;
};
