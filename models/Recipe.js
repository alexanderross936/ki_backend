var mongoose = require('mongoose');
require('./User');

var Schema = mongoose.Schema;

var RecipeSchema = new Schema({ 
User: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
Title: {
    type: String
},
Ingredients: {
    type: String
},
Amounts: {
    type: String
},
Types: {
    type: String
},
Directions: {
    type: String
}});

module.exports = Recipe = mongoose.model('Recipe', RecipeSchema);