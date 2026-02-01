/*************************
 * 1. ESTADO DA APLICAÇÃO
 *************************/

let tasks = []
let currentFilter = 'all' // all | pending | completed

/*************************
 * 2. ELEMENTOS DO DOM
 *************************/

const form = document.getElementById('form-task')
const inputTitle = document.getElementById('task-title')
const selectPriority = document.getElementById('task-priority')
const taskList = document.getElementById('task-list')
const filterButtons = document.querySelectorAll('.filters button')

loadTasks()
renderTasks()



/*************************
 * 3. EVENTOS
 *************************/

form.addEventListener('submit', handleSubmit)

taskList.addEventListener('click', event => {
  const button = event.target
  if (button.tagName !== 'BUTTON') return

  const id = Number(button.dataset.id)
  const action = button.dataset.action

  if (action === 'toggle') toggleTask(id)
  if (action === 'delete') deleteTask(id)
})



function handleSubmit(event) {
  event.preventDefault()

  const title = inputTitle.value.trim()
  const priority = selectPriority.value

 if (!title)  return 

  const newTask = {
    id: Date.now(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString().split('T')[0]
  }

  tasks.push(newTask)
  saveTasks()
  renderTasks()


  console.log(tasks)

  form.reset()
}

function handleTaskClick(event) {
  const button = event.target.closest('button')
  if (!button) return

  const taskId = Number(button.dataset.id)

  const task = tasks.find(t => t.id === taskId)
  if (!task) return

  task.completed = !task.completed
  saveTasks()
  renderTasks()
  
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter
    renderTasks()
  })
})


/*************************
 * 4. RENDER
 *************************/
function toggleTask(id) {
  const task = tasks.find(task => task.id === id)
  if (!task) return

  task.completed = !task.completed
  saveTasks()
  renderTasks()
}

function renderTasks() {
  taskList.innerHTML = ''

  let filteredTasks = tasks

  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed)
  }

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed)
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li')

    li.innerHTML = `
  <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">
    ${task.title} (${task.priority})
  </span>

  <div>
    <button data-action="toggle" data-id="${task.id}">
      ${task.completed ? 'Desfazer' : 'Concluir'}
    </button>

    <button data-action="delete" data-id="${task.id}">
      Excluir
    </button>
  </div>
`
li.classList.add(`priority-${task.priority}`)
if (task.completed) {
  li.classList.add('completed')
}


    taskList.appendChild(li)
  })
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks() {
  const storedTasks = localStorage.getItem('tasks')
  if (storedTasks) {
    tasks = JSON.parse(storedTasks)
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id)
  saveTasks()
  renderTasks()
}




