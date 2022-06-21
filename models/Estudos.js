var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estudosSchema = new Schema({
    titulo:String,
    image:String,
    categoria:String,
    conteudo:String,
    url:String
},{collection:'estudos'})

var Estudos = mongoose.model('Estudos',estudosSchema)

module.exports = Estudos;