$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })
})

/* layui中获取form对象 */
let form = layui.form
let layer = layui.layer
form.verify({
  pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

  repwd: function (value) {
    let pwd = $('.reg-box [name=password]').val()
    if (pwd !== value) {
      return '两次密码不一致'
    }
  }
})

//监听注册提交事件
$('#form_reg').on('submit', function (e) {
  e.preventDefault()
  let data ={
    username: $('#form_reg [name=username]').val(),
    password: $('#form_reg [name=password]').val()
  }
  $.ajax({
    method: 'POST',
    url: '/api/reguser',
    data,
    success(res){
      if(res.status !== 0){
        return layer.msg(res.message)
      }
      layer.msg('注册成功!')
      $('#link_login').click()
    }
  })
})

//监听登录提交事件
$('#form_login').on('submit', function (e) {
  e.preventDefault()

  $.ajax({
    method: 'POST',
    url: '/api/login',
    data: $(this).serialize(),
    success(res){
      if(res.status !== 0){
        return layer.msg('登录失败!')
      }
      layer.msg('登录成功!')
      
      localStorage.setItem('token',res.token)
      location.href = 'index.html'
    }
  })
})