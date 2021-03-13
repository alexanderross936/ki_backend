var mongoose = require('mongoose');
require('./User');

var Schema = mongoose.Schema;

var IngredientSchema = new Schema({ 
User: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
Ingredient: {
    type: String
},
Type: {
    type: String
},
Amount: {
    type: Number
},
tbs: {
    type: Number,
    default: function(){
        if(this.Type === 'tsp'){
            return this.Amount*.333;
        } else if(this.Type === 'tbs'){
            return this.Amount*1;
        } else if(this.Type === 'floz'){
            return this.Amount*2;
        } else if (this.Type === 'cup'){
            return this.Amount*16;
        } else if (this.Type === 'ml'){
            return this.Amount*.0676;
        } else if (this.Type === 'L'){
            return this.Amount*67.628;
        } else {
            return 0;
        }
    }
},
tsp: {
    type: Number,
    default: function(){
        if(this.Type === 'tsp'){
            return this.Amount*1;
        } else if(this.Type === 'tbs'){
            return this.Amount*3;
        } else if(this.Type === 'floz'){
            return this.Amount*6;
        } else if (this.Type === 'cup'){
            return this.Amount*48;
        } else if (this.Type === 'ml'){
            return this.Amount*.203;
        } else if (this.Type === 'L'){
            return this.Amount*202.884;
        } else {
            return 0;
        }
    }
},
floz: {
    type: Number,
    default: function(){
        if(this.Type === 'tsp'){
            return this.Amount*.167;
        } else if(this.Type === 'tbs'){
            return this.Amount/2;
        } else if(this.Type === 'floz'){
            return this.Amount*1;
        } else if (this.Type === 'cup'){
            return this.Amount*8;
        } else if (this.Type === 'ml'){
            return this.Amount*.033814;
        } else if (this.Type === 'L'){
            return this.Amount*.029;
        } else {
           return 0;
        }
    }
},
cup: {
    type: Number,
    default: function(){
        if(this.Type === 'tsp'){
            return this.Amount*.0208;
        } else if(this.Type === 'tbs'){
            return this.Amount*.0625;
        } else if(this.Type === 'floz'){
            return this.Amount*.125;
        } else if (this.Type === 'cup'){
            return this.Amount*1;
        } else if (this.Type === 'ml'){
            return this.Amount*.00423;
        } else if (this.Type === 'L'){
            return this.Amount*4.226;
        } else {
            return 0;
        }
    }
},
ml: { type: Number,
    default: function(){
    if(this.Type === 'tsp'){
        return this.Amount*5.91;
    } else if(this.Type === 'tbs'){
        return this.Amount*17.78;
    } else if(this.Type === 'floz'){
        return this.Amount*29.57;
    } else if (this.Type === 'cup'){
        return this.Amount*236.58;
    } else if (this.Type === 'ml'){
        return this.Amount*1;
    } else if (this.Type === 'L'){
        return this.Amount*1000;
    } else {
        return 0;
    }
}
},
L: { type: Number,
    default: function(){
    if(this.Type === 'tsp'){
        return this.Amount*.00591;
    } else if(this.Type === 'tbs'){
        return this.Amount*.01778;
    } else if(this.Type === 'floz'){
        return this.Amount*.02957;
    } else if (this.Type === 'cup'){
        return this.Amount*.236;
    } else if (this.Type === 'ml'){
        return this.Amount*.001;
    } else if (this.Type === 'L'){
        return this.Amount*1;
    } else {
        return 0;
    }
}
},
oz: { type: Number,
    default: function(){
    if(this.Type === 'oz'){
        return this.Amount*1;
    } else if(this.Type === 'lb') {
        return this.Amount*16
    } else if(this.Type === 'g'){
        return this.Amount*.0353
    }
    else {
        return 0;
    }
}
},
lb: { type: Number,
    default: function(){
    if(this.Type === 'oz'){
        return this.Amount*.0625;
    } else if(this.Type === 'lb') {
        return this.Amount*1
    } else if(this.Type === 'g'){
        return this.Amount*.0022
    }
    else {
        return 0;
    }
}
},
g: { type: Number,
    default: function(){
    if(this.Type === 'oz'){
        return this.Amount*1;
    } else if(this.Type === 'lb') {
        return this.Amount*453.592
    } else if(this.Type === 'g'){
        return this.Amount*.0353
    }
    else {
        return 0;
    }
}
}
})

// IngredientSchema.pre('save', function(next){
//     if(this.Type === 'tbs'){
//         this.tbs = 1*this.Amount;
//         this.tsp = this.Amount/3;
//         this.floz = this.Amount*2;
//     }
//     if(this.Type === 'tsp'){
//         this.tbs = this.Amount*3;
//         this.tsp = this.Amount*1;
//         this.floz = this.Amount*6;
//     }
//     if(this.Type === 'floz'){
//         this.floz = this.Amount*1;
//         this.tbs = this.Amount/2;
//         this.tsp = this.Amount/6;
//     }
//     next();
// })

module.exports = Ingredient = mongoose.model('Ingredient', IngredientSchema);