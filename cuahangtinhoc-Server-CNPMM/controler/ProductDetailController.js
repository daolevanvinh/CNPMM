let Product = require('../model/Product');

exports.productDetail = function(req, res) {
    let id = req.query.id;
    Product.findOne({id: id}).populate('product_category_id').exec(function(err,list){
        res.json(list);
    })
}
