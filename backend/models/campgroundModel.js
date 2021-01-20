const mongoose = require('mongoose');
const reviewModel = require('./reviewModel');
const Schema = mongoose.Schema;



const CampgroundSchema = new Schema({
    title : {
        type: String,
        required: true,
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            
        },
        coordinates: {
            type: [Number],
            
        }
    },
    price : {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.`
    },
    location: {
        type: String,
        required: true
    },
    image:{
        type: [String],
        required: true,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete',async (campground) => {
    if(campground){
        await reviewModel.deleteMany({_id: {$in : campground.reviews}})
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema)