var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var horariosSchema = new Schema({
    titulo:String,
    horario:String,
},{collection:'horarios'})

var Horarios = mongoose.model('Horarios',horariosSchema)

module.exports = Horarios;