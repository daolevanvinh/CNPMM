let mongooes = require('mongoose')
let schema = mongooes.Schema

let list_product_with_type = new schema({
  _id: schema.Types.ObjectId,
  product: [{ type: schema.Types.ObjectId, ref: 'product' }],
  product_type_id: { type: schema.Types.ObjectId, ref: 'product_type' },
}, { collection: 'list_product_with_type' }) 

module.exports = mongooes.model('list_product_with_type', list_product_with_type)