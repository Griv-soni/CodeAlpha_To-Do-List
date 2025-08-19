class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        this.currentFilter = 'all';
        
        // DOM Elements
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.activeTasks = document.getElementById('activeTasks');
        this.completedTasks = document.getElementById('completedTasks');
        
        // Initialize
        this.init();
    }
    
    init() {
        this.render();
        this.updateStats();
        
        // Event Listeners
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.render();
            });
        });
    }
    
    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;
        
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        this.tasks.unshift(newTask);
        this.saveToStorage();
        this.render();
        this.updateStats();
        
        this.taskInput.value = '';
        this.taskInput.focus();
    }
    
    toggleTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }
    
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }
    
    editTask(taskId, newText) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveToStorage();
            this.render();
        }
    }
    
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return [...this.tasks];
        }
    }
    
    updateStats() {
        this.totalTasks.textContent = this.tasks.length;
        this.activeTasks.textContent = this.tasks.filter(task => !task.completed).length;
        this.completedTasks.textContent = this.tasks.filter(task => task.completed).length;
    }
    
    saveToStorage() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }
    
    render() {
        const filteredTasks = this.getFilteredTasks();
        
        // Clear the task list
        this.taskList.innerHTML = '';
        
        // Show empty state if no tasks
        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        this.emptyState.style.display = 'none';
        
        // Create task items
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="task-checkbox">
                    <input 
                        type="checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onclick="todoApp.toggleTask(${task.id})"
                    >
                </div>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button 
                        class="edit-btn" 
                        onclick="todoApp.handleEdit(${task.id})"
                    >✏️ Edit</button>
                    <button 
                        class="delete-btn" 
                        onclick="todoApp.deleteTask(${task.id})"
                    >🗑️ Delete</button>
                </div>
            `;
            
            this.taskList.appendChild(taskItem);
        });
    }
    
    handleEdit(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) return;
        
        const newText = prompt('Edit task:', task.text);
        if (newText !== null) {
            this.editTask(taskId, newText);
        }
    }
}

// Initialize the app when DOM is loaded
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});
