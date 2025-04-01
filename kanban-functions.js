// Kanban Board Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize board
    initKanbanBoard();
    
    // Add Card button
    const addBtn = document.querySelector('.add-card-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addNewCard);
    }
});

function initKanbanBoard() {
    const cards = document.querySelectorAll('.card');
    const columns = document.querySelectorAll('.kanban-column');
    
    // Make existing cards draggable
    cards.forEach(card => {
        makeCardDraggable(card);
    });
    
    // Setup columns as drop targets
    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            e.currentTarget.classList.add('bg-blue-50');
        });
        
        column.addEventListener('dragleave', e => {
            e.currentTarget.classList.remove('bg-blue-50');
        });
        
        column.addEventListener('drop', e => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-blue-50');
            const cardId = e.dataTransfer.getData('text/plain');
            const card = document.getElementById(cardId);
            const cardsContainer = e.currentTarget.querySelector('.space-y-4') || e.currentTarget;
            
            if (card && cardsContainer) {
                cardsContainer.appendChild(card);
                updateCardCounts();
            }
        });
    });
}

function makeCardDraggable(card) {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('opacity-50', 'border-blue-300');
    });
    card.addEventListener('dragend', e => {
        e.target.classList.remove('opacity-50', 'border-blue-300');
    });
}

function addNewCard() {
    const cardId = 'card-' + Date.now();
    const newCard = document.createElement('div');
    newCard.id = cardId;
    newCard.className = 'card bg-white border border-gray-200 rounded-lg p-4 cursor-move mb-4';
    newCard.innerHTML = `
        <div class="flex justify-between items-start">
            <h3 class="text-sm font-medium text-gray-900" contenteditable>New Task</h3>
            <div class="flex space-x-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Task</span>
            </div>
        </div>
        <p class="mt-1 text-xs text-gray-500" contenteditable>Click to edit</p>
        <div class="mt-3 flex items-center">
            <div class="flex-shrink-0">
                <div class="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
                    Y
                </div>
            </div>
            <div class="ml-2 text-xs text-gray-500">Assigned to You</div>
        </div>
    `;
    
    const todoColumn = document.querySelector('#todo-column .space-y-4');
    if (todoColumn) {
        todoColumn.appendChild(newCard);
        makeCardDraggable(newCard);
        updateCardCounts();
    }
}

function updateCardCounts() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        const count = column.querySelectorAll('.card').length;
        const counter = column.querySelector('.items-count');
        if (counter) {
            counter.textContent = count;
        }
    });
}
