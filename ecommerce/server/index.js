const express= require('express');
const bodyparser=require('body-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {Sequelize , DataTypes}=require('sequelize');

const port=3000;
const app=express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

const sequelize=new Sequelize('neondb', 'neondb_owner', 'KSgALrk30VFJ',{ host:'ep-misty-star-a8x5sj4e.eastus2.azure.neon.tech',dialect:'postgres',dialectOptions:{ssl:{require:true, rejectUnauthorized: false}}});

const User=sequelize.define('User',{
    username:{type:DataTypes.STRING, allowNull:false, unique: false},
    password:{type:DataTypes.STRING, allowNull: false}
});

const Product=sequelize.define('Product',{
    pname:{type:DataTypes.STRING, allowNull:false},
    description:{type:DataTypes.TEXT, allowNull: true},
    price:{type:DataTypes.DECIMAL(10,2), allowNull:false},
    stock:{type: DataTypes.INTEGER, allowNull:false, defaultValue:0}
});

sequelize.sync();

const authenticateToken=(req, res, next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token,'abc',(err, user)=>{if (err) return res.sendStatus(403);
        req.user=user;
        next();
    });
};

app.post('/auth/register', async (req,res)=>{
    try{
        const {username, password}=req.body;
        const hashedpass=await bcrypt.hash(password,10);
        const user=await User.create({username, password:hashedpass});
        res.status(201).json({message:'user created successfully'});
    } catch (error){
        res.status(500).json({error :'error cant create user'});
    }
});

app.post('/auth/login', async (req,res)=>{
    try{
        const{username, password}=req.body;
        const user=await User.findOne({where :{username}});
        if (user && await bcrypt.compare(password, user.password)){
            const token=jwt.sign({userId: user.id},'abc',{expiresIn:'1h'});
            res.json({token});
        }else{
            res.status(401).json({error : 'invalid password'});
        }
    }catch (error){
        res.status(500).json({error: 'error during login'});
    }
});

app.get('/user', authenticateToken, async(req,res)=>{
    try{
        const users= await User.findAll();
        res.json(users);
    }catch (err){
        res.status(500).json({error: 'error retriving users'});
    }
});

app.get('/user/:id', authenticateToken, async(req,res)=>{
    try{
        const user=await User.findByPk(req.params.id,{attributes: ['id', 'username']});
        if (user){
            res.json(user);
        }else{
            res.status(404).json({message:'user not found'});
        }
    }catch(error){
        res.status(500).json({error: 'error retriving user'});
    }
});

app.put('/user/:id', authenticateToken, async(req,res)=>{
    try{
    const {id}=req.params;
    const {username}=req.body;
    const user=await User.findByPk(id);
    if (user){
        await user.update({username});
        res.json(user);
    }else {
        res.status(404).json({message : 'user not found'});
    }
    }catch (error) {
        res.status(500).json({error : 'error updating'});
    }
});

app.post('/products', authenticateToken, async(req,res)=>{
    try{
    const {pname, description, price, stock}=req.body;
    const product=await Product.create({pname, description, price, stock});
    res.status(201).json(product);
    }catch (error){
        res.status(500).json({error: 'error creating products'});
    }
});

app.get('/products', authenticateToken, async (req,res)=>{
    try{
        const products=await Product.findAll();
        res.json(products);
    }catch (error){
        res.status(500).json({error: 'error retriving the products'});
    }
});

app.get('/products/:id', authenticateToken, async (req,res)=>{
    const {id}=req.params;
    try{
        const product = await Product.findByPk(id);
        if (product){
            res.json(product);
        }else{
            res.status(404).json({message: 'product not found'});
        }
    }catch (error){
        res.status(500).json({error :'error retriving the product'});
    }
});

app.put('/products/:id', authenticateToken, async (req,res)=> {
    try{
        const {id} = req.params;
        const {pname, description, price, stock}= req.body;
        const product = await Product.findByPk(id);
        if (product){
            await product.update({pname,description,price,stock});
            res.json(product);
        }else{
            res.status(404).json({message: 'product not found'});
        }
    }catch (error){
        res.status(500).json({error: 'error retriving the products'});
    }
});

app.delete('/products/:id', authenticateToken, async (req, res)=>{
    try{
        const {id}=req.params;
        const product = await Product.findByPk(id);
        if (product){
            await product.destroy();
            res.json({message: 'product deleted '});
        }else{
            res.status(404).json({message: 'product not found'});
        }
    }catch (error){
        res.status(500).json({error: 'error deleting product'});
    }
});

app.listen(port, ()=>{
    console.log(`app running on port ${port}.`)
})
