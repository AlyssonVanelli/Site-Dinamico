var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noticiasSchema = new Schema({
    titulo:String,
    image:String,
    categoria:String,
    conteudo:String,
    slug:String
},{collection:'noticias'})

var Noticias = mongoose.model('Noticias',noticiasSchema)

module.exports = Noticias;