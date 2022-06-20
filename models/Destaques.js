var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var destaqueSchema = new Schema({
    titulo:String,
    image:String,
    categoria:String,
    conteudo:String,
    slug:String
},{collection:'destaques'})

var Destaques = mongoose.model('Destaques',destaqueSchema)

module.exports = Destaques;