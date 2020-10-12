const Mongoose = require('mongoose');

// Connect 'Mongoose' to mongo db
Mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});




/*
//#region Prototype Code

// ==== Create Users ==== //
// const Schema = Mongoose.Schema;
// const Validator = require('validator')

function createNewUser(users) {
    // Make a Schema
    const userSchema = new Schema ({
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if(!Validator.isEmail(value)) {
                    throw new Error("This Ain't a Fkin Email\n");
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: [8, 'Passoword needs to be 8 characters long'],
            validate(value) {
                if(value.includes('password')) {
                    throw new Error("Password cannot inlcude 'password'")
                }
            }
        },
        age: {
            type : Number,
            default : 0,
            trim : true,
            validate(val) {
                if (val < 0) {
                    throw new Error("You ain't fkin born yet")
                }
            }
        }
    })
    // Initiate a model
    const User = Mongoose.model('User', userSchema)

    users.forEach(usr => {
        // Create user from 'User' Model
        const user = new User ({
            name: usr.name,
            email: usr.email,
            password: usr.password,
            age: usr.age
        });
        // Save user
        user.save().then(res => {
            console.log('SAVED!!\n', res)
        }).catch(err => {
            console.log('OOPSIE!!\n', err)
        });
    });

}
// User Array
const users = [
    {
        name: '  Pete  Holmes  ',
        email: '  Petedavidson23@gmail.com ',
        password: 'thisisawesome!!',
        age: '17'
    },
    // {
    //     name: 'Dave',
    //     age: 21
    // },
    // {
    //     name: 'Geo',
    //     age: 17
    // },
    // {
    //     name: 'Hani',
    //     age: 23
    // }
]


// ==== Create tasks ==== //
function createNewTasks(tasks) {
    // Create new Schema
    const taskSchema = new Schema ({
        name: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    })
    const Task = Mongoose.model('tasks', taskSchema);
    // Process each instance in array
    tasks.forEach(entry => {
        // Create task instance
        const task = new Task ({
            name: entry.name,
            completed: entry.completed
        })
        // Save task instance
        task.save().then(res => {
            console.log('SAVED!!\n', res);
        }).catch(err => {
            console.log('OOPSIE!!\n', err);
        })
    });
}
// tasks array
const tasks = [
    {
        name: 'Clean Room',
        completed: true
    },
    {
        name: 'Get Groceries',
    },
    {
        name: 'Complete Project',
        completed: true
    },
    {
        name: 'Attend Class',
    }
]

// == MAIN == //
// createNewUser(users)
// createNewTasks(tasks);

//#endregion

*/