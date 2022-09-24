$(function () {
  let layer = layui.layer
  let form = layui.form
  // 调用
  initArtCateList()

  // 获取文章分类列表 
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }


  // 添加按钮的点击事件
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理形式，给表单绑定提交事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 关闭弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理形式，给编辑按钮绑定提交事件
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success(res) {
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理形式，给编辑绑定提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('修改分类失败！')
        }
        initArtCateList()
        layer.msg('修改分类成功！')
        // 关闭弹出层
        layer.close(indexEdit)

      }
    })
  })


  // 通过代理形式，给删除按钮绑定提交事件
  // let indexEdit = null
  $('tbody').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }

          layer.msg('删除分类成功！')
          // 关闭弹出层
          layer.close(index)
          initArtCateList()
        }
      })
      layer.close(index)
    })
  })
})