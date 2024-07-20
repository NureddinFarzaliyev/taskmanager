// ! LOGIN / REGISTER PAGE

const switchLogin = document.querySelector('.switch-login')
const switchRegister = document.querySelector('.switch-register')
const switchBg = document.querySelector('.focus-bg')
const login = document.querySelector('.login')
const register = document.querySelector('.register')

switchLogin.addEventListener('click', () => {
    if(!switchLogin.classList.contains('auth-focus')){
        changeActiveStyle('auth-focus', switchLogin, switchRegister)
        changeActiveStyle('auth-no-focus', switchRegister, switchLogin)
        changeActiveStyle('shown-auth', login, register)
        changeActiveStyle('hidden-auth', register, login)
        switchBg.classList.remove('focus-bg-right')
        switchBg.classList.add('focus-bg-left')
    }
})

switchRegister.addEventListener('click', () => {
    if(!switchRegister.classList.contains('auth-focus')){
        changeActiveStyle('auth-focus', switchRegister, switchLogin)
        changeActiveStyle('auth-no-focus', switchLogin, switchRegister)
        changeActiveStyle('shown-auth', register, login)
        changeActiveStyle('hidden-auth', login, register)
        switchBg.classList.remove('focus-bg-left')
        switchBg.classList.add('focus-bg-right')
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
})

// ! SORT BY TIME

const alltasksBtn = document.querySelector('.all-tasks-btn');
const overdueBtn = document.querySelector('.overdue-btn');
const todayBtn = document.querySelector('.today-btn');

const showAllTasks = () => {
    const tasks = document.querySelectorAll('.task')
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].classList.remove('hidden-bs')
    }
}

const showAllTasksHBT = () => {
    const tasks = document.querySelectorAll('.task')
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].classList.remove('hidden')
    }
}

document.querySelector('.update-tasks').addEventListener('click', () => {
    changeActiveStyle('time-sort-active', alltasksBtn, todayBtn, overdueBtn)
    showAllTasks()
    showAllTasksHBT()
})

const changeActiveStyle = (classname, add, ...remove) => {
    remove.forEach(item => {
        item.classList.remove(classname)
    })
    add.classList.add(classname)
}

alltasksBtn.addEventListener('click', () => {
    if(!alltasksBtn.classList.contains("time-sort-active")){
        changeActiveStyle('time-sort-active', alltasksBtn, todayBtn, overdueBtn)
        if(document.querySelector('.usertag-active')) document.querySelector('.usertag-active').classList.remove('usertag-active')
        showAllTasks()
        showAllTasksHBT()
    }
})

overdueBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task')
    const dues = document.querySelectorAll('.due-container span')

    if(!overdueBtn.classList.contains("time-sort-active")){
        changeActiveStyle('time-sort-active', overdueBtn, todayBtn, alltasksBtn)
        showAllTasks();

        for (let i = 0; i < dues.length; i++) {
            if(!dues[i].classList.contains("overdue")){
                tasks[i].classList.add('hidden-bs')
            }
            
        }
    }
})

todayBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task')
    const dues = document.querySelectorAll('.due-container span')
    
    if(!todayBtn.classList.contains("time-sort-active")){
        changeActiveStyle('time-sort-active', todayBtn, overdueBtn, alltasksBtn)
        showAllTasks();

        for (let i = 0; i < dues.length; i++) {
            if(!dues[i].classList.contains("today")){
                tasks[i].classList.add('hidden-bs')
            }
            
        }
    }
})