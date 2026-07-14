/* ==========================================
   TO-DO LIST APPLICATION - JAVASCRIPT
   ========================================== */

// ==========================================
// STATE MANAGEMENT
// ==========================================

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    init() {
        this.loadTodos();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Input events
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Action buttons
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());

        // Modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    // ==========================================
    // LOCAL STORAGE
    // ==========================================

    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
            alert('Unable to save todos. Storage might be full.');
        }
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('todos');
            this.todos = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading todos:', error);
            this.todos = [];
        }
    }

    // ==========================================
    // TODO OPERATIONS
    // ==========================================

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (!text) {
            input.focus();
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(newTodo);
        this.saveTodos();
        this.render();
        input.value = '';
        input.focus();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingId = id;
            this.showEditModal(todo);
        }
    }

    updateTodo(id, text, priority) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text.trim();
            todo.priority = priority;
            this.saveTodos();
            this.editingId = null;
            this.render();
        }
    }

    clearCompleted() {
        const completed = this.todos.filter(t => t.completed);
        if (completed.length === 0) {
            alert('No completed tasks to clear.');
            return;
        }

        if (confirm(`Clear ${completed.length} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
        }
    }

    clearAll() {
        if (this.todos.length === 0) {
            alert('No tasks to clear.');
            return;
        }

        if (confirm(`Clear all ${this.todos.length} task(s)? This cannot be undone.`)) {
            this.todos = [];
            this.saveTodos();
            this.render();
        }
    }

    // ==========================================
    // FILTERING
    // ==========================================

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    // ==========================================
    // STATISTICS
    // ==========================================

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('activeTasks').textContent = active;
        document.getElementById('completedTasks').textContent = completed;
    }

    // ==========================================
    // RENDERING
    // ==========================================

    render() {
        this.updateStats();
        this.renderTodos();
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filtered = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        filtered.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <div style="flex: 1;">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <span class="todo-priority ${todo.priority}">${todo.priority.toUpperCase()}</span>
                </div>
                <div class="todo-actions">
                    <button class="todo-action-btn edit-btn" data-id="${todo.id}" title="Edit">
                        ✏️
                    </button>
                    <button class="todo-action-btn delete-btn" data-id="${todo.id}" title="Delete">
                        🗑️
                    </button>
                </div>
            `;

            // Checkbox toggle
            todoItem.querySelector('.checkbox').addEventListener('change', () => {
                this.toggleTodo(todo.id);
            });

            // Edit button
            todoItem.querySelector('.edit-btn').addEventListener('click', () => {
                this.editTodo(todo.id);
            });

            // Delete button
            todoItem.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Delete this task?')) {
                    this.deleteTodo(todo.id);
                }
            });

            todoList.appendChild(todoItem);
        });
    }

    // ==========================================
    // MODAL OPERATIONS
    // ==========================================

    showEditModal(todo) {
        let modal = document.getElementById('editModal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'editModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">Edit Task</div>
                    <input type="text" id="editInput" class="modal-input" placeholder="Task text...">
                    <select id="prioritySelect" class="modal-select">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <div class="modal-buttons">
                        <button class="modal-btn modal-save-btn">Save</button>
                        <button class="modal-btn modal-cancel-btn">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.modal-save-btn').addEventListener('click', () => {
                const text = modal.querySelector('#editInput').value;
                const priority = modal.querySelector('#prioritySelect').value;
                if (text.trim()) {
                    this.updateTodo(this.editingId, text, priority);
                    this.closeModal();
                }
            });

            modal.querySelector('.modal-cancel-btn').addEventListener('click', () => {
                this.closeModal();
            });
        }

        modal.querySelector('#editInput').value = todo.text;
        modal.querySelector('#prioritySelect').value = todo.priority;
        modal.classList.add('show');
        modal.querySelector('#editInput').focus();
    }

    closeModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }

    // Escape to close modal
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c📋 Todo App Loaded!', 'font-size: 18px; font-weight: bold; color: #667eea;');
console.log('%cKeyboard Shortcuts:', 'font-size: 14px; color: #764ba2; font-weight: bold;');
console.log('%cCtrl/Cmd + K - Focus input', 'font-size: 12px; color: #666;');
console.log('%cEscape - Close modal', 'font-size: 12px; color: #666;');
console.log('%c✨ All your tasks are automatically saved!', 'font-size: 12px; color: #48bb78; font-style: italic;');
