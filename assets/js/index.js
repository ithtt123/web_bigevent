$(function () {
  // 调用函数，获取基本信息
  getUserInfo()
  let layer = layui.layer

  // 点击按钮实现退出功能
  $('#btnLogoot').on('click', function () {
    // console.log('ok')
    layer.confirm('确认退出登录', { icon: 3, title: '提示' },
      function (index) {
        //do something
        // 清空本地存储toktn
        localStorage.removeItem('token')
        // 跳转页面到login
        location.href = 'login.html'

        layer.close(index)
      })
  })
})

// 获取信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success(res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取信息失败')
      }
      // console.log(res)
      // 调用renderAvatar渲染用户头像
      renderAvatar(res.data)
    }
  })
}

// 渲染用户头像
function renderAvatar(user) {
  // 获取用户名称
  let name = user.nickname || user.username
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 渲染用户头像
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}