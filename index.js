const express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session');
const multer = require('multer');
require ('./config/db')
require('dotenv').config();

const path = require('path');

const app = express();

const Destaques = require('./models/Destaques.js')
const Posts = require('./models/Posts.js')
const Estudos = require('./models/Estudos.js')
const Noticias = require('./models/Noticias.js')
const Horarios = require('./models/Horarios.js')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images') 
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg") 
    }
})

const upload = multer({
    storage:storage
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

        Horarios.find({}).sort({'_id': 1}).exec(function(err,horarios){
            horarios = horarios.map(function(val){
                return {
                    titulo: val.titulo,
                    horario: val.horario,
                }
            })

        res.render('home', {posts:posts,destaques:destaques,ultimas:ultimas,noticias:noticias,horarios:horarios})
        
        })})})})})
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
})});

app.get('/noticias',(req,res)=>{
    
    Noticias.find({}).sort({'_id': -1}).exec(function(err,noticias){
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
})});

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
                url: val.url,
                categoria: val.categoria,
            }
        })
        
        res.render('estudos',{estudos:estudos});
    })
})

app.get('/faleconosco',(req,res)=>{
    res.render('faleConosco');
})

var usuarios = [
    {
        email: process.env.user,
        password: process.env.secret
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

        Noticias.find({}).sort({'_id': -1}).exec(function(err,noticias){
            noticias = noticias.map(function(val){
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

            res.render('admin-painel', {posts:posts,destaques:destaques,estudos:estudos,noticias:noticias})

        })
    })
})
})

    }
})

app.post('/admin/destaque',upload.single("image_destaque"), (req,res)=>{
    Destaques.create({
        titulo:req.body.titulo_destaque,
        image:req.file.filename,
        categoria:req.body.categoria_destaque,
        conteudo:req.body.conteudo_destaque,
        slug:req.body.slug_destaque,
    })
    res.redirect('/admin')
})

app.get('/admin/destaque/:id',upload.single("image_destaque"), (req,res)=>{
    Destaques.findOneAndUpdate({id: req.params._id},{new:true},function(err,resposta){

        if(resposta != null){
            res.render('editDestaques',{destaque:resposta});
        }else{
            res.redirect('/')
        }

    })
})

app.post('/admin/destaques/atualizar/:id',upload.single("image_destaque"), async (req, res)=>{
    try {
        const id = req.params.id;
        const updates = {
            id:req.params.id,
            titulo:req.body.titulo_destaque,
            image:req.file.filename,
            categoria:req.body.categoria_destaque,
            conteudo:req.body.conteudo_destaque,
            slug:req.body.slug_destaque
        };
        const options = {new:true} ;
        const result = await Destaques.findByIdAndUpdate(id,updates, options);
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
})

app.post('/admin/posts',upload.single("image_post"), (req,res)=>{
    Posts.create({
        titulo:req.body.titulo_post,
        image:req.file.filename,
        categoria:req.body.categoria_post,
        conteudo:req.body.conteudo_post,
        slug:req.body.slug_post,
    })
    res.redirect('/admin')
})

app.get('/admin/posts/:id',upload.single("image_post"), (req,res)=>{
    Posts.findOneAndUpdate({id: req.params._id},{new:true},function(err,resposta){

        if(resposta != null){
            res.render('editPost',{posts:resposta});
        }else{
            res.redirect('/')
        }

    })
})

app.post('/admin/posts/atualizar/:id',upload.single("image_post"), async (req, res)=>{
    try {
        const id = req.params.id;
        const updates = {
            id:req.params.id,
            titulo:req.body.titulo_post,
            image:req.file.filename,
            categoria:req.body.categoria_post,
            conteudo:req.body.conteudo_post,
            slug:req.body.slug_post
        };
        const options = {new:true} ;
        const result = await Posts.findByIdAndUpdate(id,updates, options);
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
})

app.post('/admin/noticia',upload.single("image_noticia"), (req,res)=>{
    Noticias.create({
        titulo:req.body.titulo_noticia,
        image:req.file.filename,
        categoria:req.body.categoria_noticia,
        conteudo:req.body.conteudo_noticia,
        slug:req.body.slug_noticia,
    })
    res.redirect('/admin')
})

app.get('/admin/noticia/:id',upload.single("image_noticia"), (req,res)=>{
    Noticias.findOneAndUpdate({id: req.params._id},{new:true},function(err,resposta){

        if(resposta != null){
            res.render('editNoticia',{noticias:resposta});
        }else{
            res.redirect('/')
        }

    })
})

app.post('/admin/noticia/atualizar/:id',upload.single("image_noticia"), async (req, res)=>{
    try {
        const id = req.params.id;
        const updates = {
            id:req.params.id,
            titulo:req.body.titulo_noticia,
            image:req.file.filename,
            categoria:req.body.categoria_noticia,
            conteudo:req.body.conteudo_noticia,
            slug:req.body.slug_noticia
        };
        const options = {new:true} ;
        const result = await Noticias.findByIdAndUpdate(id,updates, options);
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
})

app.post('/admin/estudo',upload.single("image_estudo"), (req,res)=>{
    Estudos.create({
        titulo:req.body.titulo_estudo,
        image:req.file.filename,
        categoria:req.body.categoria_estudo,
        conteudo:req.body.conteudo_estudo,
        url:req.body.url_estudo,
    })
    res.redirect('/admin')
})

app.get('/admin/estudo/:id',upload.single("image_estudo"), (req,res)=>{
    Estudos.findOneAndUpdate({id: req.params._id},{new:true},function(err,resposta){

        if(resposta != null){
            res.render('editEstudo',{estudos:resposta});
        }else{
            res.redirect('/')
        }

    })
})

app.post('/admin/estudo/atualizar/:id',upload.single("image_estudo"), async (req, res)=>{
    try {
        const id = req.params.id;
        const updates = {
            id:req.params.id,
            titulo:req.body.titulo_estudo,
            image:req.file.filename,
            categoria:req.body.categoria_estudo,
            conteudo:req.body.conteudo_estudo,
            url:req.body.url_estudo
        };
        const options = {new:true} ;
        const result = await Estudos.findByIdAndUpdate(id,updates, options);
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
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

app.get('/admin/deletar/noticias/:id', (req, res)=>{
    Noticias.deleteOne({_id:req.params.id}).then(function(){
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