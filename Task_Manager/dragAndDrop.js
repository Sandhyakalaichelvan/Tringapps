const DragAndDropModule = (function() {
    let dragItem = null;

    function drag() {
        const card = document.querySelectorAll('.card');
        const columns = document.querySelectorAll('.column');

        card.forEach(card => {
            card.addEventListener('dragstart', dragStart);
            card.addEventListener('dragend', dragEnd);
        });

        columns.forEach(column => {
            column.addEventListener('dragover', dragOver);
            column.addEventListener('dragenter', dragEnter);
            column.addEventListener('dragleave', dragLeave);
            column.addEventListener('drop', dragDrop);
        });
    }

    function dragStart() {
        dragItem = this;
        setTimeout(() => (this.className = 'invisible'), 0);
    }

    function dragEnd() {
        this.className = 'card';
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter() {}

    function dragLeave() {}

    function dragDrop() {
        const targetColumnId = this.closest('.column').id;
        const taskId = dragItem.dataset.id;
    
        switch (targetColumnId) {
            case 'todo-column':
                updateTaskStatus(taskId, 'todo');
                break;
            case 'in-progress-column':
                updateTaskStatus(taskId, 'in-progress');
                break;
            case 'in-review-column':
                updateTaskStatus(taskId, 'in-review');
                break;
            case 'completed-column':
                updateTaskStatus(taskId, 'completed');
                break;
            default:
                break;
        }
        this.appendChild(dragItem);
           
        const statusElement = dragItem.querySelector('.status');
        statusElement.textContent = `Status: ${todos.find(task => task.id === parseInt(taskId)).status}`;
    
        console.log('drag dropped');
        console.log(targetColumnId)
        console.log(taskId)
        console.log(statusElement)
    }
    
    function updateTaskStatus(taskId, newStatus) {
        todos.forEach(task => {
            if (task.id === parseInt(taskId)) {
                task.status = newStatus;
            }
        });
        storeTodos(); 
    }
    return {
        drag: drag
    };
})();

function storeTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


function displayTodos() {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));

    storedTodos.forEach(todo => {
        const columnId = getColumnIdFromStatus(todo.status);
        const column = document.getElementById(columnId);

        if (column) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', todo.id);
            card.innerHTML = 
            ` <h3>${todo.title}</h3>
              <p>${todo.description}</p>
              <p class="status">Status: ${todo.status}</p>`; 
            column.appendChild(card); 
        }
    });    
    
    console.log(storedTodos)
}

function getColumnIdFromStatus(status) {
    switch (status) {
        case 'todo':
            return 'todo-column';
        case 'in-progress':
            return 'in-progress-column';
        case 'in-review':
            return 'in-review-column';
        case 'completed':
            return 'completed-column';
        default:
            return 'todo-column'; 
    }
}


function generateDraggableItems() {
    const cards = document.querySelectorAll('.card'); 
    cards.forEach(card => {
        card.setAttribute('draggable', 'true'); 
    });
}



const todos = [
    {
        "id": 1,
        "title": "Task 1",
        "description": "This is the description for Task 1.",
        "status": "todo"
    },
    {
        "id": 2,
        "title": "Task 2",
        "description": "This is the description for Task 2.",
        "status": "in-progress"
    },
    {
        "id": 3,
        "title": "Task 3",
        "description": "This is the description for Task 3.",
        "status": "in-review"
    },
    {
        "id": 4,
        "title": "Task 4",
        "description": "This is the description for Task 4.",
        "status": "completed"
    },
    {
        "id": 5,
        "title": "Task 5",
        "description": "This is the description for Task 4.",
        "status": "completed"
    },
    {
        "id": 6,
        "title": "Task 6",
        "description": "This is the description for Task 4.",
        "status": "todo"
    },
    {
        "id": 7,
        "title": "Task 7",
        "description": "This is the description for Task 4.",
        "status": "todo"
    }
];

window.onload = function() {
    storeTodos();
    displayTodos();
    DragAndDropModule.drag();
    generateDraggableItems();
};




