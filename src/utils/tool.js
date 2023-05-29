import axios from 'axios'
let ls = localStorage;
export default {
  expire: 30 * 60 * 1000,
  setCache(key, val) {
    let cache = JSON.stringify(val)
    ls.setItem(key, cache)

    let keyTime = (new Date).getTime()
    ls.setItem(key + '_time', keyTime)
  },
  getCache(key, forceOrExpire) {//第二个参数为boolean值的时候，true返回localStorage的数据。当第二参数为毫秒数的时候，为localStorage数据的过期时间,undefine为默认30分钟
    let val = ls.getItem(key)
    if (val) {
      val = JSON.parse(val)
      let checkTime = +ls.getItem(key + '_time')
      let expire = typeof forceOrExpire === 'boolean' ? forceOrExpire : ((new Date).getTime() - checkTime < (forceOrExpire || this.expire));
      return expire ? val : ''
    } else {
      return ''
    }
  },
  clearCache(key) {
    ls.removeItem(key)
    ls.removeItem(key + '_time')
  },
  preload(config) {
    let _imgArr =config.list
    let loader = new PxLoader();
    for (let index = 0; index < _imgArr.length; index++) {
      const img = _imgArr[index].src;
      loader.addImage(img);
    }

    loader.addProgressListener((e)=>{
      let percent = ~~((e.completedCount / e.totalCount)*100)
      config.progress && config.progress(percent)
    })

    loader.addCompletionListener(()=>{
      config.success &&  config.success()
    });

    loader.start();
  },
  parseURL(url) {
    // let _url = location.hash?location.hash.split('#')[1]: location.href
    let a = document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.host,
      hostname: a.hostname,
      port: a.port,
      query: a.search,
      params: (() => {
        let ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s;
        for (; i < len; i++) {
          if (!seg[i]) {
            continue;
          }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    };
  },
  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  //埋点
  uploadPoint() {
    let body = document.querySelector('html');
    body.addEventListener('click', (e) => {
      this.dispatch(e)
    }, false)
  },
  getTarget(e) {
    let target = null;
    let eleArray = Array.from(e.path || e.composedPath());
    for (let index = 0; index < eleArray.length; index++) {
      const element = eleArray[index];
      if (element.dataset && element.dataset.points) {
        target = element
        break;
      }
    }
    return target
  },
  _parse(data) {
    if (data.indexOf("{") != -1 && data.indexOf("}") != -1) {
      return (new Function("return " + data))()
    } else {
      return data
    }
  },
  dispatch(e) {
    const path = e.path || e.composedPath();
    if (path && path.length) {
      let target = this.getTarget(e);
      if (target) {
        let data = this._parse(target.dataset.points);
        data = data.split(',');
        console.log('埋点的数据为：', ['_trackEvent', ...data])
        window._czc && window._czc.push(['_trackEvent', ...data]);
      }
    }
  },
  save2upc(base64){
    // 注意需要反向代理
    let upcUrl = (process.env.NODE_ENV == 'development' ? '/upc' : 'https://upc.pconline.com.cn') + '/upload_quick_base64.jsp?referer=http://www.pconline.com.cn/'
    return new Promise((resolve, reject) => {
      return axios({
        method: 'post',
        url: upcUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 简化post请求
        },
        data: {
          application: 'baby_tryout',
          readExif: 'no',
          keepSrc: 'no',
          data: base64
        },
        transformRequest: [function (data,headers) {  // 对数据对象进行字符串转化
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }

          return ret
        }],
      }).then((data) => {
        let res = data.data,
          code = res.retCode;
        if (code === 0) {
          let imgUrl = res.files[0].url
          resolve && resolve(imgUrl)
        } else {
          console.log(data);
          reject && reject()
        }
      }).catch((err) => {
        console.log(err.message)
        reject && reject()
      })
    })
  },
  img2base64(config, cb) {
    if (!config.src) {
      console.log('请检查图片是否正确传入');
      return;
    }
    return new Promise((cb,rej) => {
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      let img = new Image()
      img.src = config.src

      img.onload = () => {
        let max = 1000
        if (img.width > max) {
          let radio = max / (img.width)
          canvas.width = max
          canvas.height = (img.height) * radio
        } else {
          canvas.width = img.width
          canvas.height = img.height
        }
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        // let imgBase64 = canvas.toDataURL(this.imgType, config.quality || 0.6)
        let imgBase64 = canvas.toDataURL('image/jpeg', config.quality || 0.6)
        cb && cb(imgBase64)
        console.log('压缩完毕');

        img.remove();
        canvas.remove()
      }
    })
  },
}