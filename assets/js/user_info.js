$(function () {
  let form = layui.form
  let layer = layui.layer

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return alert('昵称长度必须在1~6个字符之间')
      }
    }
  })

  // 调用
  initUserInfo()

  // 初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }
        console.log(res)
        // 给表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })

  // 监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面函数
        window.parent.getUserInfo()
      }
    })
  })
})