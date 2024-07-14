require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') 
const cors = require('cors')

app.use(express.json())
app.use(cors())

const port = 3000
app.listen(port, () => {
    console.log('server is running on port', port)
})

// connecting mongodb to post to collection named "taskmanagercollection"
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@taskmanager.s4ho5gv.mongodb.net/taskmanagercollection?retryWrites=true&w=majority&appName=taskmanager`)
.then(() => {console.log('connected to database')})
.catch(() => {console.log('error in db connection')})

app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send('Hello World')
})

// ! USER AUTHENTICATION

// Schema for user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: {
        type: Array,
        required: true
    },
    tags: {
        type: Array,
        required: true
    }
});

// Constructor for user
const User = mongoose.model('User', userSchema)

// post request to add new user to db
app.post('/users', async (req, res) => {
    try {
        // checking if username already exists
        const existingUser = await User.findOne({username: req.body.username});
        if(existingUser){
            return(res.send(JSON.stringify(false)))
        }
        
        // hashing password to make it safe
        const hash = await bcrypt.hash(req.body.password, 10);

        // creating user and saving to database
        const user = new User({
            username: req.body.username,
            password: hash,
            tasks: [],
            tags: []
        })

        await user.save()

        res.status(201)
        res.send(JSON.stringify(`New user - ${req.body.username} is created `))

        console.log(`${user.username} sent to database`)

    } catch (error) {
        res.status(500)
        res.send(error.message)
    }  
})

// User login request with password and username 
app.post('/users/login/', async (req, res) => {
    try {
        // finding corresponding password for specified username
        const userPassword = await User.findOne({username: req.body.username})

        if(userPassword){
            const isCorrect = await bcrypt.compare(req.body.password, userPassword.password)

            if(isCorrect){
                res.status(200)
                res.send(JSON.stringify(true))
            }else{
                res.status(500)
                res.send(JSON.stringify('Invalid Password'))
            }
            
        }else{
            res.status(500)
            res.send(JSON.stringify('Invalid Username')) 
        }
    } catch (error) {
        res.send(error)
    }
})

// ! TASK / TAG MANAGEMENT

// adding new task
class TaskClass{
    constructor(taskName, taskDescription, taskDue, taskTags){
        this.taskName = taskName,
        this.taskDescripton = taskDescription,
        this.taskDue = taskDue,
        this.taskTags = taskTags
    }
}

app.put('/tasks/:user_id', async (req, res) => {
    try {
        // adding task to array
        const newTask = new TaskClass(req.body.taskName, req.body.taskDescription, req.body.taskDue, req.body.taskTags)

        await User.updateOne({_id: req.params.user_id}, {$push: { tasks: newTask }})

        res.status(201)
        res.send(JSON.stringify(`New Task - ${req.body.taskName} is added to user ${req.params.user_id}`))

    } catch (error) {
        res.send(error)
    }
})

// deleting task
app.put('/tasks/delete/:user_id/', async (req, res) => {
    try {
        const wantedUser = await User.findOne({"_id": req.params.user_id})
        let tasks = wantedUser.tasks
        tasks.splice(req.body.deletedTaskId, 1) // deleting task according to index number
        
        await User.updateOne({"_id": req.params.user_id}, {"tasks": tasks}) // updating tasks

        res.status(200)
        res.send(`Task is deleted from ${req.params.user_id}`)  
    } catch (error) {
        res.send(error)
    }
})

// adding new user tag
class Tag{
    constructor(tagName, tagColor){
        this.tagName = tagName,
        this.tagColor = tagColor
    }
}

app.put('/users/tags/:user_id', async (req, res) => {
    try {
        const newTag = new Tag(req.body.tagName, req.body.tagColor)
        await User.updateOne({_id: req.params.user_id,}, {$push: {tags: newTag}})
        res.status(201)
        res.send(`New tag - ${req.body.tagName} is added to user ${req.params.user_id}`)
    } catch (error) {
        res.send(error)
    }
})

// deleting user tag
app.put('/users/tags/delete/:user_id' , async (req, res) => {
    try {
        const wantedUser = await User.findOne({"_id": req.params.user_id})
        let tags = wantedUser.tags
        tags.splice(req.body.deletedTagId, 1)
        await User.updateOne({"_id": req.params.user_id}, {"tags": tags})

        res.status(200)
        res.send(`Tag is deleted from user ${req.params.user_id}`)
    } catch (error) {
        res.send(error)
    }
})

// adding tag to task
app.put('/tasks/tags/add/:user_id', async (req, res) => {
    try {
        const user = await User.findOne({"_id": req.params.user_id})
        const addedTag = await user.tags[req.body.addedTag]

        let userTasks = user.tasks 
        let taskTags = userTasks[req.body.addTagTo].taskTags 
        taskTags.push(addedTag) 

        await User.updateOne({"_id": req.params.user_id}, {"tasks": userTasks})
        res.status(200)
        res.send(`Tag is added to task (User ${req.params.user_id})`)
    } catch (error) {
        res.send(error)
    }
})

// deleting tag from task
app.put('/tasks/tags/delete/:user_id', async (req, res) => {
    try {
        const user = await User.findOne({"_id": req.params.user_id})

        let userTasks = user.tasks 
        let taskTags = userTasks[req.body.deleteTagFrom].taskTags 
        taskTags.splice(req.body.deletedTag) 

        await User.updateOne({"_id": req.params.user_id}, {"tasks": userTasks})
        res.status(200)
        res.send(`Tag is deleted from task (User ${req.params.user_id})`)
    } catch (error) {
        res.send(error)
    }
})

// ! FETCH USER DATA

app.get('/users/:username', async (req, res) => {
    try {
        const userData = await User.findOne({"username": req.params.username})
        res.status(200)
        res.send(userData)

    } catch (error) {
        res.send(error)
    }
})