var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
    titulo:String,
    image:String,
    categoria:String,
    conteudo:String,
    slug:String
},{collection:'posts'})

var Posts = mongoose.model('Posts',postsSchema)

module.exports = Posts;