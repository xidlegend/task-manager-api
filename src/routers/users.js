const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp')

// - GET Profile
router.get('/user/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// - LOGOUT PROFILE
router.get('/user/logout', auth, async (req, res) => {
    try {
        // remove given token from user.tokens list
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })

        await req.user.save();
        res.send('LOGOUT SUCCESSFULL');
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// - LOGOUTALL PROFILE
router.get('/user/logoutAll', auth, async (req, res) => {
    try {
        // remove given token from user.tokens list
        req.user.tokens = []

        await req.user.save();
        res.send('Logged Out of All Devices!');
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// - GET AVATAR
router.get('/users/:id/avatar', async (req, res) => {
    try {
        console.log(req.params.id)
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('Not Found')
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

// - CREATE
router.post('/users', async (req, res) => {
    try {
        // create new user based on request body
        const user = new User(req.body);
        // generate and append token to user token array
        const token = await user.generateAuthToken();
        // send back the token and user
        res.status(201).send({ user, token })
    } catch (err) {
        console.log(err.message)
        res.status(400).send('BAD REQUEST');
    }
});

// - LOGIN 
router.post('/users/login', auth, async (req, res) => {
    try {
        // if user already authenticated - no need for login
        if (req.user) {
            const payload = {
                msg: 'Already Authenticated!',
                token: req.token
            }
            return res.send(payload);
        }

        // check user credentials
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // err if credentials invalid
        if (!user) {
            return res.status(400).send('Invalid Credentials')
        }

        // generate auth token
        const token = await user.generateAuthToken();
        // return auth token
        res.send({ user, token })

    } catch (err) {
        res.status(500).send(err.message)
    }

})

// - POST AVATAR
// upload instance
const upload = multer({
    // dest: 'avatars/', // folder, else -> req.file.buffer
    limits: {
        fielsSize: 1000000 // 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {

            return cb(new Error(`Only jpeg, jpg, and png supported`));
        }
        cb(undefined, true);
        // cb(new Error `File must be a pdf`) // Error returned
        // cb(undefined, true) // no error, upload true
        // cb(undefined, false) // no error, upload false - silent rejection
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        throw new Error('Please upload an image')
    }
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save()
    res.status(200).send();
});

// - PATCH USER
router.patch('/users/me', auth, async (req, res) => {
    // get required updates & check if updates are valid
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isvalidUpdates = updates.every(update => allowedUpdates.includes(update))
    if (!isvalidUpdates) {
        return res.status('400').send('Invalid Update Fields')
    }

    // update
    try {
        // replace each property with update 
        updates.forEach(update => req.user[update] = req.body[update])
        // save user (password gets hashed bts!)
        await req.user.save()
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err.message)
    }
})


// - DELETE USER
router.delete('/users/me', auth, async (req, res) => {
    try {
        // middleware removes corresponding tasks as well
        await req.user.remove()
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err)
    }
})


// - DELETE AVATAR
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})


//#region DEV ROUTES

// GET ALL
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
})


// // GET ByID
// router.get('/users/:id', async (req, res) => {
//     try {
//         const _id = req.params.id
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);

//     } catch (err) {
//         res.status(500).send(err);
//     }
// })

//#endregion


module.exports = router;