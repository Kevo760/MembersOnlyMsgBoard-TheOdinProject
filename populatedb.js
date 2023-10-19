const Post = require('./models/Post');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const users = [];


const createUser = async(index, username, password, status) => {
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        password: hashedPass,
        status,
    })

    await user.save()
    .then(savedDoc => {
        users[index] = savedDoc
    })
    .catch(err => console.log(err))

    console.log(`Added user: ${username}`)
}

const addUsers = async() => {
    await Promise.all([
        createUser(0, 'AshKetchup', 'odin1234', 'Basic'),
        createUser(1, 'JoeyWheeler', 'odin1234', 'Basic'),
        createUser(2, 'Itsuke', 'odin1234', 'Basic'),
        createUser(3, 'Takumi', 'odin1234', 'Basic'),
        createUser(4, 'LightYagami', 'odin1234', 'Basic'),
        createUser(5, 'AllMight', 'odin1234', 'Basic'),
        createUser(6, 'JDepp', 'odin1234', 'Basic'),
        createUser(7, 'NotTheAdmin', 'odinadmin1', 'Admin'),
    ])
}

const addPostData = async() => {
    await Post.insertMany([
        {
            user: users[0],
            message: 'I choose you!'
        },
        {
            user: users[1],
            message: 'Heart of the credit card'
        },
        {
            user: users[2],
            message: `Real racers don't have girlfriends!`
        },
        {
            user: users[3],
            message: 'GAS GAS GAS - MANUEL'
        },
        {
            user: users[4],
            message: 'Can I have your autograph?'
        },
        {
            user: users[5],
            message: 'You too can become a hero!'
        },
        {
            user: users[6],
            message: `People cry, not because they're weak. It's because they've been strong for too long.`
        },

    ])
}
