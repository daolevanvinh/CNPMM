let Order = require('../model/Order');
let Product = require('../model/Product')

exports.customerOrder = function (req, res) {
  order = new Order(req.query);
  var today = new Date();
  order.id = order._id;
  order.time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  order.total_price = req.query.total_price
  order.customer = req.query.customer._id
  order.address = req.query.address
  order.status = '5de0765d2373de2fc465aa27'
  let productList = JSON.parse(req.query.productList)
  for (let i = 0; i < productList.length; i++) {
    order.product_list.push(productList[i]._id);
    order.ProductCount.push(productList[i].count)
  }
  order.save(function (err, or) {
    if (!err && or) {
      res.json({ msg: 'Đặt hàng thành công', RequestSuccess: true })
    }
  })
}