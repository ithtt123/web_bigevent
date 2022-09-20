$.ajaxPrefilter(function (options) {
  // 统一设置根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
  // console.log(options.url)
  // 统一设置headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载complete无论成功还是失败都会调用这个函数
  options.complete = function (res) {
    console.log(res)
    // responseJSON可以拿到服务器响应的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 强制清空本地存储toktn
      localStorage.removeItem('token')
      // 强制跳转页面到login
      location.href = 'login.html'
    }
  }
})