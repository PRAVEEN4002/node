const express=require('express');
const app=express();
const port=process.env.PORT||4002;
const mongo=require('mongodb');

const mongourl='mongodb+srv://mistore:mistore4002@cluster0.2bfat.mongodb.net/mistore?retryWrites=true&w=majority';
let db;
const MongoClient=mongo.MongoClient;
const cors=require('cors');
const bodyParser=require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`server is running on ${port}`)
})
app.get('/',(req,res)=>{
    res.send('health is ok');
})
//images route
app.get('/images',(req,res)=>{
    var condition={}
    var condition1={}
    if(req.query.name&req.query.color1){
        condition1={Img1:Boolean(req.query.color1)}
        condition={Name:req.query.name}
    }
    else  if(req.query.name&req.query.color2){
        condition1={Img2:Boolean(req.query.color2)}
        condition={Name:req.query.name}
    }
    else  if(req.query.name&req.query.color3){
        condition1={Img3:Boolean(req.query.color3)}
        condition={Name:req.query.name}
    }
    else if(req.query.name){
        condition={Name:req.query.name}
    }
    db.collection('images').find(condition).project(condition1).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//mobilels main page route
//mobilels main page route
app.get('/mobiles',(req,res)=>{
    var condition={}
    var sort={Id:-1}
     if(req.query.Brand&&req.query.sort){
         condition={Brand:req.query.Brand}
         sort={Id:Number(req.query.sort)}
     }
    db.collection('mobiles').find(condition).sort(sort).toArray((err,result)=>{
         if(err) throw err;
         res.send(result)
    })
})
//carousel
app.get('/Carousel',(req,res)=>{
    
    db.collection('Carousel').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
// app.post('/add',(req,res)=>{
// User.create({
//         Name:req.body.Name,
//         Model:req.body.Model,
//         Color:req.body.Color,
//         Price:req.body.Price,
//         Quantity:req.body.Quantity
//     },(err,user)=>{
//         if(err) res.send('error while adding item to cart')
//         res.status(200).send('added to cart succesfully')
//     })
// })
app.post('/add',(req,res)=>{
    db.collection('Cart').insert({
        UserName:req.body.UserName,
        GoogleId:req.body.GoogleId,
        Name:req.body.Name,
        Model:req.body.Model,
        Color:req.body.Color,
        Price:req.body.Price,
        Image:req.body.Image,
        Quantity:req.body.Quantity
    },(err,user)=>{
        if(err) res.send('error while adding item to cart')
        res.status(200).send('added to cart succesfully')
    }
    )
})
app.get('/CartItems',(req,res)=>{
    var condition={}
    if(req.query.GoogleId){
        condition={GoogleId:req.query.GoogleId}
    }else    if(req.query.Name&&req.query.GoogleId){
        //   condition={$and:[{"type.mealtype":req.query.mealtype},{city:req.query.city}]}
        condition={$and:[{Name:req.query.Name},{GoogleId:req.query.GoogleId}]}
    }
    
    db.collection('Cart').find(condition).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
app.delete('/removeItem',(req,res)=>{
      var id=mongo.ObjectID(req.body._id)
    db.collection('Cart').remove({_id:id},(err,result)=>{
        if(err) throw err;
        res.send('items removed suceesfully')
    })
})

// app.post('/register',(req,res) => {
//     var hashpassword = bcrypt.hashSync(req.body.password);
//     User.create({
//         name:req.body.name,
//         email:req.body.email,
//         password:hashpassword,
//         role:req.body.role?req.body.role:'user'
//     },(err,user) => {
//         if(err) res.send('Error');
//         res.status(200).send("Register Success")
//     })
// });


MongoClient.connect(mongourl,(err,connection)=>{
        if(err) throw err;
        db=connection.db('mistore');
})

