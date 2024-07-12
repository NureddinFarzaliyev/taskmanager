const mongoose = require('mongoose')

const taskSchema = mongoose.Schema(
    {
    user_id: {
        type: Number,
        required: true
    },
    task_name: {
        type: String,
        required: true
    },
    task_description: {
        type: String,
        required: true
    },
    task_due: {
        type: String,
        required: true
    },
    task_tags: {
        type: Array,
        required: true
    }
    }
)

const Task = mongoose.model('Task', taskSchema)
module.exports = Task;