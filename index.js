const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var session = require('express-session');
const fileupload = require('express-fileupload');

const path = require('path');

const app = express();

const Destaques = require('./models/Destaques.js')
const Posts = require('./models/Posts.js')
const Estudos = require('./models/Estudos.js')
const Noticias = require('./models/Noticias.js')

mongoose.connect('mongodb+srv://root:gJHaNhSGnj32vYwy@cluster0.jxqoy.mongodb.net/AhavatChessed?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
    console.log('Conectado ao mongo')
}).catch(function(err){
    console.error(err.message);
})

app.use(session({
    secret: 't8027ut802wyut82wuy',
    cookie: {maxAge: 60000}
}))

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/',(req,res)=>{
    
    if(req.query.busca == null){
        Posts.find({}).sort({'_id': -1}).limit(6).exec(function(err,posts){
            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    image: val.image,
                    conteudo: val.conteudo,
                    conteudoCurto: val.conteudo.substr(0,100),
                    slug: val.slug,
                    categoria: val.categoria,
                }
            })

        Destaques.find({}).sort({'_id': -1}).exec(function(err,destaques){
            destaques = destaques.map(function(val){
                return {
                    titulo: val.titulo,
                    image: val.image,
                    conteudo: val.conteudo,
                    conteudoCurto: val.conteudo.substr(0,100),
                    slug: val.slug,
                    categoria: val.categoria,
                }
            })

            Posts.find({}).sort({'_id': -1}).limit(3).exec(function(err,ultimas){
                ultimas = ultimas.map(function(val){
                    return {
                        titulo: val.titulo,
                        image: val.image,
                        conteudo: val.conteudo,
                        conteudoCurto: val.conteudo.substr(0,100),
                        slug: val.slug,
                        categoria: val.categoria,
                    }
                })

            Noticias.find({}).sort({'_id': -1}).limit(6).exec(function(err,noticias){
                noticias = noticias.map(function(val){
                    return {
                        titulo: val.titulo,
                        image: val.image,
                        conteudo: val.conteudo,
                        conteudoCurto: val.conteudo.substr(0,100),
                        slug: val.slug,
                        categoria: val.categoria,
                    }
                })

            res.render('home', {posts:posts,destaques:destaques,ultimas:ultimas,noticias:noticias})

        })

        })

        })
        })
    }else{

        Posts.find({titulo: {$regex: req.query.busca,$options:"i"}},function(err,posts){
            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0,100),
                    image: val.image,
                    slug: val.slug,
                    categoria: val.categoria,
                }
        })
            res.render('busca',{posts:posts,contagem:posts.length});
        })
    }

  
});

app.get('/postagens',(req,res)=>{
    
    if(req.query.busca == null){
        Posts.find({}).sort({'_id': -1}).exec(function(err,posts){
            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    image: val.image,
                    conteudo: val.conteudo,
                    conteudoCurto: val.conteudo.substr(0,100),
                    slug: val.slug,
                    categoria: val.categoria,
                }
            })
            res.render('postagens',{posts:posts});
        })
}});

app.get('/noticias',(req,res)=>{
    
    if(req.query.busca == null){
        Noticias.find({}).sort({'_id': -1}).limit(6).exec(function(err,noticias){
            noticias = noticias.map(function(val){
                return {
                    titulo: val.titulo,
                    image: val.image,
                    conteudo: val.conteudo,
                    conteudoCurto: val.conteudo.substr(0,100),
                    slug: val.slug,
                    categoria: val.categoria,
                }
            })
            res.render('noticias',{noticias:noticias});
        })
}});

app.get('/contribua',(req,res)=>{
    res.render('contribua',{});
})

app.get('/sobre',(req,res)=>{
    res.render('sobre',{});
})

app.get('/estudos',(req,res)=>{
    Estudos.find({}).sort({'_id': -1}).exec(function(err,estudos){
        estudos = estudos.map(function(val){
            return {
                titulo: val.titulo,
                image: val.image,
                conteudo: val.conteudo,
                conteudoCurto: val.conteudo.substr(0,100),
                slug: val.slug,
                categoria: val.categoria,
            }
        })
        
        res.render('estudos',{estudos:estudos});
    })
})

var usuarios = [
    {
        email: 'Admin@hotmail.com',
        password: 'gJHaNhSGnj32vYwy'
    }
]

app.post('/admin', (req,res) =>{
    usuarios.map(function(val){
        if(val.email == req.body.email && val.password == req.body.password){
            req.session.email = 'admin';
        }
    })
    res.redirect('/admin')
})

app.get('/admin',(req,res)=>{
    if(req.session.email == null){
        res.render('admin-login')
    }else{
        Posts.find({}).sort({'_id': -1}).exec(function(err,posts){
            posts = posts.map(function(val){
                return {
                    id: val._id,
                    titulo: val.titulo,
                }
            })

        Destaques.find({}).sort({'_id': -1}).exec(function(err,destaques){
            destaques = destaques.map(function(val){
                return {
                    id: val._id,
                    titulo: val.titulo,
                }
            })

        Estudos.find({}).sort({'_id': -1}).exec(function(err,estudos){
            estudos = estudos.map(function(val){
                return {
                    id: val._id,
                    titulo: val.titulo,
                }
            })

            res.render('admin-painel', {posts:posts,destaques:destaques,estudos:estudos})

        })
    })
})

    }
})

app.post('/admin/destaque', (req,res)=>{
    Destaques.create({
        titulo:req.body.titulo_destaque,
        //image:req.body.image_destaque,
        categoria:req.body.categoria_destaque,
        conteudo:req.body.conteudo_destaque,
        slug:req.body.slug_destaque,
    })
    res.redirect('/admin')
})

app.post('/admin/noticia', (req,res)=>{
    Posts.create({
        titulo:req.body.titulo_noticia,
        //image:req.body.image_noticia,
        categoria:req.body.categoria_noticia,
        conteudo:req.body.conteudo_noticia,
        slug:req.body.slug_noticia,
    })
    res.redirect('/admin')})

app.post('/admin/estudo', (req,res)=>{
    Estudos.create({
        titulo:req.body.titulo_estudo,
        //image:req.body.image_estudo,
        categoria:req.body.categoria_estudo,
        conteudo:req.body.conteudo_estudo,
        slug:req.body.slug_estudo,
    })
    res.redirect('/admin')
})

app.get('/admin/deletar/destaques/:id', (req, res)=>{
    Destaques.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin')
    })
})

app.get('/admin/deletar/posts/:id', (req, res)=>{
    Posts.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin')
    })
})


app.get('/admin/deletar/estudos/:id', (req, res)=>{
    Estudos.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin')
    })
})


app.get('/:slug',(req,res)=>{
    Posts.findOneAndUpdate({slug: req.params.slug},{new:true},function(err,resposta){

        if(resposta != null){

            Posts.find({}).sort({'_id': -1}).limit(3).exec(function(err,ultimas){
                ultimas = ultimas.map(function(val){
                    return {
                        titulo: val.titulo,
                        image: val.image,
                        conteudo: val.conteudo,
                        conteudoCurto: val.conteudo.substr(0,100),
                        slug: val.slug,
                        categoria: val.categoria,
                    }
                })
            
                res.render('single',{noticia:resposta,ultimas:ultimas});
        
            })

        }else{
            res.redirect('/')
        }

    })

})

app.listen(5000,()=>{
    console.log('server rodando!');
})