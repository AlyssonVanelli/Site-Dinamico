var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config();

mongoose.connect(`mongodb+srv://root:${process.env.passwordMongo}@cluster0.jxqoy.mongodb.net/AhavatChessed?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
    console.log('Conectado ao mongo')
}).catch(function(err){
    console.error(err.message);
})