// ! LOGIN / REGISTER PAGE

const switchLogin = document.querySelector('.switch-login')
const switchRegister = document.querySelector('.switch-register')
const switchBg = document.querySelector('.focus-bg')
const login = document.querySelector('.login')
const register = document.querySelector('.register')

switchLogin.addEventListener('click', () => {
    if(!switchLogin.classList.contains('auth-focus')){
        switchLogin.classList.add('auth-focus')
        switchLogin.classList.remove('auth-no-focus')
        switchRegister.classList.add('auth-no-focus')
        switchRegister.classList.remove('auth-focus')
        switchBg.classList.remove('focus-bg-right')
        switchBg.classList.add('focus-bg-left')
        login.classList.add('shown-auth')
        login.classList.remove('hidden-auth')
        register.classList.remove('shown-auth')
        register.classList.add('hidden-auth')
    }
})

switchRegister.addEventListener('click', () => {
    if(!switchRegister.classList.contains('auth-focus')){
        switchRegister.classList.add('auth-focus')
        switchRegister.classList.remove('auth-no-focus')
        switchLogin.classList.remove('auth-focus')
        switchLogin.classList.add('auth-no-focus')
        switchBg.classList.remove('focus-bg-left')
        switchBg.classList.add('focus-bg-right')
        register.classList.add('shown-auth')
        register.classList.remove('hidden-auth')
        login.classList.remove('shown-auth')
        login.classList.add('hidden-auth')
    }
})

// ! USER PAGE
const newTaskContainer = document.querySelector('.addNewTask')

document.querySelector('.add-new-task-btn').addEventListener('click', () => {
    newTaskContainer.classList.remove('hidden')
})

document.querySelector('.new-task-header button').addEventListener('click', () => {
    newTaskContainer.classList.add('hidden')
})


// ! CANCEL NEW TAG
const newTagContainer = document.querySelector('.new-tag')

document.querySelector('.cancel-new-tag').addEventListener('click', () => {
    newTagContainer.classList.add('hidden')
    console.log('hi')
})