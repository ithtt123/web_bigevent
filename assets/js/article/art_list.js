$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage

  // 定义美化一个过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    const y = dt.getFullYear()
    const mm = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const h = (dt.getHours() + '').padStart(2, '0')
    const m = (dt.getMinutes() + '').padStart(2, '0')
    const s = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${mm}-${d} ${h}:${m}:${s}`

  }

  // 定义一个查询对象，请求数据时，发送到服务器
  let q = {
    pagenum: 1,//页码值,默认请求第一页,
    pagesize: 2, //每页显示多少条数据,默认两条,
    cate_id: '',//文章分类的 Id,
    state: '', //文章的状态
  }

  // 调用
  initTable()
  initCate()

  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类失败！')
        }
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 重新渲染ui结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单数据
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()

    // 给p对象中，对应的属性复制
    q.cate_id = cate_id
    q.state = state

    // 调用
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页切换时，触发jump回调
      // 通过first判断哪种方式触发的jump
      // 如果first是true就是点击触发，反之是调用render触发的
      jump: function (obj, first) {
        // 把最新的页码复制到q属性里面
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) {
          initTable()
        }
      }
    })
  }

  // 为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的长度
    let len = $('.btn-delete').length
    // console.log(ok)
    // 获取到文章id
    let id = $(this).attr('data-id')
    // 询问是否删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success(res) {
          if (res.status !== 0) {
            return layer.msg('文章删除失败！')
          }
          layer.msg('文章删除成功！')
          // 判断剩余数据，如果没有数据，则页码值-1，再重新调用initTable
          if (len === 1) {
            // 页码值最小是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index)
    })
  })


})
