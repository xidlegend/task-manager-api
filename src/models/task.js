const { ObjectID, ObjectId } = require('mongodb');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Create new Schema 
const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User' // model name referenced
    }
});
const Task = Mongoose.model('Task', taskSchema);

module.exports = Task;
