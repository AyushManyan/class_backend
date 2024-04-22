const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT ;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: '*'
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.error("Error connecting to mongodb"))

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

app.get('/user', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => console.error(err));
});

app.post('/user', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save();
    res.json({ message: 'user added' });

});


app.put('/user/:id', (req, res) => {
    const userId = req.params.id;
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
    };
    User.findByIdAndUpdate(userId,updateData,{new:true})
    .then(updateData => {
        if(!updateData){
            return res.status(404).send({message: 'user not found'});
        }
        res.send(updateData);
    })
    .catch(err => res.status(400).json({message: err.message}));
});



// delete a user from

app.delete('/user/:id', async(req, res) => {
    const userId = req.params.id;
    await User.deleteOne({_id: userId});
    res.json({ message: 'user deleted' });
});

app.listen(PORT);