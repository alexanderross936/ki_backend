const express = require('express');
var cors = require('cors')
const bcrypt = require('bcrypt')
const config = require('config')
const { check, validationResult } = require("express-validator");
var mongoose = require('mongoose');
// var mongoDB = 'mongodb://127.0.0.1/one_database';

const jwt = require('jsonwebtoken');
require('./models/Ingredient')
require('./models/Recipe')
require('./models/User')
require('./config/default.json')
const auth = require('./auth')
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Ingredient = require('./models/Ingredient');
var connectDB = require('./config/db')
require('./config/default.json')

connectDB()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/user', auth, async(req, res) => {
    try {
        const user = (await User.findById(req.user.id)).isSelected('-password');
        res.json(user);
    }   catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/register', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please put valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
]
, 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;
    
    try {
// See if user exists
let user = await User.findOne({ email });

        if(user){
    return res.status(400).json({ errors: [{ msg: 'User already exists' }]});

}


user = new User({
    name,
    email,
    password
})

// encrypt password using bcrypt

const salt = await bcrypt.genSalt(10);

user.password = await bcrypt.hash(password, salt);

await user.save();

const payload = {
    user: {
        id: user.id
    }
}

jwt.sign(
    payload, 
    config.get('jwtSecret'),
    { expiresIn: 360000 },
    (err, token) => {
        if(err) throw err;
        res.json({ token });
    });
// return jsonwebtoken

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');

    }

    console.log(req.body);



})

app.post('/login', 
[
    check('email', 'Please put valid email').isEmail(),
    check('password', 'Password is required')
    .exists()
]
, 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;
    
    try {
// See if user exists
let user = await User.findOne({ email });

        if(!user){
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }]});

}

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
    return res.status(400)
    .json({ errors: [{ msg: 'Invalid credentials'}] })
}


const payload = {
    user: {
        id: user.id
    }
}

jwt.sign(payload, 
    config.get('jwtSecret'),
    { expiresIn: 360000 },
    (err, token) => {
        if(err) throw err;
        res.json({ token });
    });
// return jsonwebtoken

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');

    }

    console.log(req.body);



})

 app.get('/recipes', auth, (req, res) => {
     const user = req.user.id
    Recipe.find({User: user}, function(err, recipes){
        let RecipeMap = {};

        recipes.forEach(function(recipe){
        RecipeMap[recipe._id] = recipe;            
        });

    res.send(RecipeMap);
    });
});

app.get('/', auth, (req, res) => {
    const user = req.user.id;
    Ingredient.find({User: user}, function(err, ingredients){
        let IngredientMap = {};

        ingredients.forEach(function(ingredient){
        IngredientMap[ingredient._id] = ingredient;            
        });

    res.send(IngredientMap);
    });
});

app.get("/recipe/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        res.send(recipe)
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error.')
    }

  })

  app.get("/sum", auth, (req, res) => {
    const user = req.user.id;
    Ingredient.find({User: user}, function(err, ingredients){
        let IngredientMap = {};

        ingredients.forEach(function(ingredient){
        IngredientMap[ingredient._id] = ingredient;            
        });

    res.send(IngredientMap);
    });

    });
    // Ingredient.findById(user).aggregate(
    //   [
    //     {
    //       $group: 
    //         {"_id":{"Ingredient": "$Ingredient"},
    //         "floz" : {
    //             $sum : "$floz"
    //         },
    //         "cup" : {
    //             $sum : "$cup"
    //         },
    //         "tsp" : {
    //             $sum : "$tsp"
    //         },
    //         "tbs" : {
    //             $sum : "$tbs"
    //         },
    //         "ml" : {
    //             $sum : "$ml"
    //         },
    //         "L" : {
    //             $sum : "$cup"
    //         },
    //       }
    //     }
    //   ],
    //   function(err, result) {
    //     if (err) {
    //       res.send(err);
    //     } else {
    //       res.json(result);
    //     }
    //   }
    // );
  

app.post('/use_recipe', auth, async(req, res) => {

    try {
        const user= await User.findById(req.user.id).select('-password');   

        const newIngredient = new Ingredient({
            Ingredient: req.body.Ingredient,
            Type: req.body.Type,
            Amount: req.body.Amount,
            User: user
        });
        
        const ingredient = await newIngredient.save();

        res.json(ingredient);
        console.log(req.body)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.')
    }

    

})



app.post('/add_ingredient', auth, async(req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newIngredient = new Ingredient({
            Ingredient: req.body.ingredient,
            Type: req.body.type,
            Amount: req.body.amount,
            User: user
        });
        
        const ingredient = await newIngredient.save();

        res.json(ingredient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.')
    }


})

app.post('/add_recipe', auth, async(req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newRecipe = new Recipe({
            Title: req.body.title,
            Ingredients: req.body.ingredients,
            Amounts: req.body.amounts,
            Types: req.body.types,
            Directions: req.body.directions,
            User: user
        });
        
        const recipe = await newRecipe.save();

        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.')
    }


})

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

app.listen(process.env.PORT || 4000, () => {
    console.log('App listening on PORT 4000')
})