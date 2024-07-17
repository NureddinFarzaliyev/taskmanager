const BASE_URL = 'http://localhost:3000'

// ! REGISTER

// post user data to database or fetch an error
const registerUser = (username, password) => {
    fetch(`${BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify({
            "username": username,
            "password": password
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json()).then(data => registerStatus(data))
}

// event listener to register
document.querySelector('#register_btn').addEventListener('click', () => {
    const username = document.querySelector('#register_username').value
    const password = document.querySelector('#register_password').value
    registerUser(username, password)
    document.querySelector('#register_btn').textContent = "Loading..."
    document.querySelector('#register_btn').disabled = true
})

// catch errors and assign them to html elements
const registerStatus = (data) => {
    console.log(data)

    document.querySelector('#register_password').value = '';
    document.querySelector('#register_btn').textContent = 'Register'
    document.querySelector('#register_btn').disabled = false

    const registerStatus = document.querySelector('#register_status')

    if(data === false){
        registerStatus.textContent = "Username Already Exists"
    }else{
        registerStatus.textContent = "Registered Successfully. Please Login."
    }
}


// ! LOGIN
// check if user credentials are matching with database
const loginUser = (username, password) => {
    fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({
            "username": username,
            "password": password
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json()).then(data => loginFront(data, username))
}

const loginFront = (data, username) => {
    if(data === true){ // login credentials are correct
        getUserData(username);
    }else{ // login credentials are false (status are being written on html element)
        document.querySelector('#login_status').textContent = data;
        document.querySelector('#login_btn').textContent = 'Login'
        document.querySelector('#login_btn').disabled = false;
    }
}

// add event listener to login button
document.querySelector('#login_btn').addEventListener('click', async () => {
    const username = document.querySelector('#login_username').value
    const password = document.querySelector('#login_password').value
    loginUser(username, password)
    document.querySelector('#login_btn').disabled = true;
    document.querySelector('#login_btn').textContent = 'Loading...'
    document.querySelector('#login_status').textContent = ''
})

// ! LOAD USER PAGE AFTER SUCCESSFUL LOGIN

const getUserData = (username) => {
    fetch(`${BASE_URL}/users/${username}`)
    .then(response => response.json())
    .then(data => loadUserPage(data))   
}

let userTags = []
let user_id = ''
let username = ''

// load user page after correct login
const loadUserPage = (data) => {
    // get user id
    user_id = data._id
    username = data.username
    console.log("Load User Page for: ", data)

    userTags = data.tags

    // disable login screen and enable user screen
    document.querySelector('.auth').style.display = 'none';
    document.querySelector('.user').classList.remove('hidden')


    // username
    document.querySelector('.username').textContent = `Welcome, ${data.username}!`

    // tasks
    const tasks = data.tasks.reverse()

    tasks.forEach(task => {
        displayTasks(task.taskName, task.taskDue, task.taskDescription, task.taskTags, data.tasks.length - data.tasks.indexOf(task) - 1)
    })
    
    // tags
}

// function to create and display tasks on html
const displayTasks = (name, due, description, tags, id) => {
    const task = document.createElement('div')
    task.classList.add('task')

    const taskHeader = document.createElement('div')
    taskHeader.classList.add('task-header')

    // task name
    const nameItem = document.createElement('h1')
    nameItem.textContent = name
    nameItem.classList.add('task-name')
    taskHeader.appendChild(nameItem)

    // button to delete task
    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = '<img src="./assets/delete.png" alt="Delete">'
    deleteButton.classList.add('delete-task-btn')
    taskHeader.appendChild(deleteButton)

    task.appendChild(taskHeader)

    deleteButton.addEventListener('click', () => {
        console.log(`task index ${id} is gonna be deleted`)
        deleteTask(id)
    })
    
    // task Tags container
    const tagsContainer = document.createElement('div')
    tagsContainer.classList.add('tags-container')
    task.appendChild(tagsContainer)
    
    if(tags){
        tags.forEach(tag => {
            if(tag){
                const tagItem = document.createElement('div')
                tagItem.textContent = tag.tagName
                tagItem.style.backgroundColor = tag.tagColor
                tagItem.classList.add('task-tag')

                const deleteTagBtn = document.createElement('button')
                deleteTagBtn.textContent = 'X'
                deleteTagBtn.addEventListener('click', () => {
                    deleteTagFromTask(tags.indexOf(tag), id)
                })

                tagItem.appendChild(deleteTagBtn)
                tagsContainer.appendChild(tagItem)
            }
        })
    }

    // button to open all tags list
    const addTagBtn = document.createElement('button')
    addTagBtn.textContent = '+'
    addTagBtn.addEventListener('click', () => { 
        allTagsList.classList.toggle('hidden')
    })
    tagsContainer.appendChild(addTagBtn)
    
    document.querySelector('.tasks-container').appendChild(task)

    // list contains all tags 
    const allTagsList = document.createElement('div')
    allTagsList.classList.add('all-tags-list')
    allTagsList.classList.add('hidden')
    userTags.forEach(userTag => {
        // if(!tags.find(e => e.tagName === userTag.tagName)){
        const tagDiv = document.createElement('div')

        const tagImg = document.createElement('img')
        tagImg.setAttribute('src', "./assets/tag.png")
        tagImg.setAttribute('alt', " ")
        tagDiv.appendChild(tagImg)

        const tagBtn = document.createElement('button')
        tagBtn.textContent = userTag.tagName
        tagBtn.style.color = userTag.tagColor
        tagBtn.addEventListener('click', () => {
            addTagToTask(userTags.indexOf(userTag), id)
        })
        tagDiv.appendChild(tagBtn)

        const tagDelBtn = document.createElement('button')
        tagDelBtn.classList.add('usertag-delete-button')
        tagDelBtn.textContent = 'X'
        tagDelBtn.addEventListener('click', () => {
            deleteUserTag(userTags.indexOf(userTag))
        })
        tagDiv.appendChild(tagDelBtn)

        allTagsList.appendChild(tagDiv)
        allTagsList.classList.add('hidden')
        // }
    })
    task.appendChild(allTagsList)    

    
    // description
    const descriptionItem = document.createElement('div')
    descriptionItem.textContent = description
    descriptionItem.classList.add('description-text')
    task.appendChild(descriptionItem)
    
    // due
    const taskDate = new Date(due)
    const currentDate = new Date()

    const remainingTime = findRemainingTime(taskDate, currentDate)

    const dueItem = document.createElement('div')
    dueItem.classList.add('due-container')
    dueItem.innerHTML = `<img src="./assets/due.png" height="20" alt=" "/> <p> Due to: ${due} </p>`
    
    const remainingItem = document.createElement('span')
    remainingItem.textContent = `(${remainingTime})`;
    switch (remainingTime) {
        case "Today":
            remainingItem.classList.add('today')
            break;
        case "Overdue":
            remainingItem.classList.add('overdue')
            break;
        default:
            remainingItem.classList.add('due-span')
    }

    dueItem.appendChild(remainingItem)
    task.appendChild(dueItem)
}

const findRemainingTime = (taskDate, currentDate) => {
    if(taskDate.getDate() == currentDate.getDate()){
        return 'Today'
    }else if(taskDate < currentDate){
        console.log(taskDate.getTime(), currentDate.getTime())
        return 'Overdue'
    }else{
        const timeDiff = taskDate - currentDate
        const days = Math.ceil(timeDiff / 1000 / 60 / 60 / 24)
        return `${days} days remaining`
    }
}

// ! ADDING NEW TASKS

// update tasks html
const updateTasks = () => {
    document.querySelector('.tasks-loading').classList.toggle('hidden')
    document.querySelector('.tasks-container').textContent = ''
    document.querySelector('.update-tasks').disabled = true;
    
    setTimeout(() => {
        document.querySelector('.tasks-loading').classList.toggle('hidden');
        document.querySelector('.update-tasks').disabled = false;
        getUserData(username)
    }, 850)
}

document.querySelector('.update-tasks').addEventListener('click', updateTasks)

// posting new task to database
const postNewTask = (name, description, due, id) => {
    fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            "taskName": name,
            "taskDescription": description,
            "taskDue": due,
            "taskTags": []
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(updateTasks)
}

document.querySelector('.add-task-button').addEventListener('click', () => {
    const name = document.querySelector('.new-task-name')
    const due = document.querySelector('.new-task-due')
    const description = document.querySelector('.new-task-description')
    // Name value must be given
    if(name.value == ''){
        document.querySelector('.new-task-alert').textContent = 'Task name must be declared.'
        setTimeout(() => {
            document.querySelector('.new-task-alert').textContent = ''
        }, 2000)
    }else{
        postNewTask(name.value, description.value, due.value, user_id)
    }
    console.log(user_id)
    name.value = ''; due.value = ''; description.value = '';
    document.querySelector('.addNewTask').classList.add('hidden')
})

// ! DELETING TASKS

const deleteTask = (id) => {
    fetch(`${BASE_URL}/tasks/delete/${user_id}/`, {
        method: "PUT",
        body: JSON.stringify({
            "deletedTaskId": id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(updateTasks())
}

// ! ADDING / DELETING TAG TO / FROM TASK

const addTagToTask = (tagId, taskId) => {
    fetch(`${BASE_URL}/tasks/tags/add/${user_id}`, {
        method: "PUT",
        body: JSON.stringify({
            "addTagTo": taskId,
            "addedTag": tagId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(updateTasks())
}

const deleteTagFromTask = (tagId, taskId) => {
    fetch(`${BASE_URL}/tasks/tags/delete/${user_id}`, {
        method: "PUT",
        body: JSON.stringify({
            "deleteTagFrom": taskId,
            "deletedTag": tagId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(updateTasks())
}
// ! DELETING USERTAG

const deleteUserTag = (tagId) => {
    fetch(`${BASE_URL}/users/tags/delete/${user_id}`, {
        method: "PUT",
        body: JSON.stringify({
            "deletedTagId": tagId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(updateTasks)
}

// ! CREATING NEW USERTAG
// button to create new user tag
document.querySelector('.new-tag-btn').addEventListener('click', () => {
    document.querySelector('.new-tag').classList.remove('hidden')
})

document.querySelector('.add-new-tag').addEventListener('click', () => {
    const newTagName = document.querySelector('#new-tag-name').value
    const newTagColor = document.querySelector('#new-tag-color').value
    console.log('button clicked')

    createNewUserTag(newTagName, newTagColor)

    document.querySelector('.new-tag').classList.add('hidden')
})

const createNewUserTag = (name, color) => {
    console.log("new tag sent to database")
    fetch(`${BASE_URL}/users/tags/add/${user_id}`, {
        method: "PUT",
        body: JSON.stringify({
                "tagName": name,
                "tagColor": color
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(updateTasks())
}
