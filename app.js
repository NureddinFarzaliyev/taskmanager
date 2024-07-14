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
})

// catch errors and assign them to html elements
const registerStatus = (data) => {
    console.log(data)

    document.querySelector('#register_password').value = '';
    document.querySelector('#register_btn').textContent = 'Register'

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
    }
}

// add event listener to login button
document.querySelector('#login_btn').addEventListener('click', async () => {
    const username = document.querySelector('#login_username').value
    const password = document.querySelector('#login_password').value
    loginUser(username, password)
    document.querySelector('#login_btn').textContent = 'Loading...'
    document.querySelector('#login_status').textContent = ''
})

// ! LOAD USER PAGE AFTER SUCCESSFUL LOGIN

const getUserData = (username) => {
    fetch(`${BASE_URL}/users/${username}`)
    .then(response => response.json())
    .then(data => loadUserPage(data))   
}

// load user page after correct login
const loadUserPage = (data) => {
    // get user id
    const user_id = data._id

    // disable login screen
    document.querySelector('.auth').style.display = 'none';

    // add user data to frontend

    // username
    document.querySelector('.user').textContent = `Username: ${data.username}`

    // tasks



    // tags
}


// const createNewTask = (name, due, tags) => {
//     const tasksContainer = document.querySelector('.tasks')

//     const nameItem = document.createElement('p')
//     nameItem.textContent = name
//     nameItem.classList.add('task-name')
//     tasksContainer.appendChild(nameItem)

//     const descriptionItem = document.createElement('div')


// }