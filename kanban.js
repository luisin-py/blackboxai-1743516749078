// Kanban Board Functionality
function initKanbanDragDrop() {
    const cards = document.querySelectorAll('.card');
    const columns = document.querySelectorAll('.kanban-column');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
        card.setAttribute('draggable', true);
    });
    
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });
    
    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function drop(e) {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);
        e.currentTarget.appendChild(card);
    }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.kanban-column')) {
        initKanbanDragDrop();
    }
});