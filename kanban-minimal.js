// Implementação mínima do Kanban
document.addEventListener('DOMContentLoaded', function() {
  // Tornar cards arrastáveis
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.draggable = true;
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', e.target.id);
    });
  });

  // Configurar zonas de drop
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach(column => {
    column.addEventListener('dragover', e => e.preventDefault());
    column.addEventListener('drop', e => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData('text/plain');
      const card = document.getElementById(cardId);
      if (card) {
        e.currentTarget.appendChild(card);
      }
    });
  });

  // Modal para adicionar novo card
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-bold mb-4">Adicionar Novo Card</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" id="card-title" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tags (separadas por vírgula)</label>
          <input type="text" id="card-tags" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea id="card-desc" class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button id="cancel-card" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
          <button id="save-card" class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">Salvar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Botão Add Card
  document.querySelector('.add-card-btn')?.addEventListener('click', function() {
    modal.classList.remove('hidden');
  });

  // Cancelar adição
  document.getElementById('cancel-card')?.addEventListener('click', function() {
    modal.classList.add('hidden');
  });

  // Salvar novo card
  document.getElementById('save-card')?.addEventListener('click', function() {
    const title = document.getElementById('card-title').value;
    const tags = document.getElementById('card-tags').value;
    const description = document.getElementById('card-desc').value;
    
    if (!title) return;
    
    const cardId = 'card-' + Date.now();
    const newCard = document.createElement('div');
    newCard.id = cardId;
    newCard.className = 'card bg-white border border-gray-200 rounded-lg p-4 mb-4';
    
    // Formatando as tags
    const tagsHtml = tags.split(',').map(tag => 
      `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">${tag.trim()}</span>`
    ).join('');
    
    newCard.innerHTML = `
      <div class="flex justify-between items-start">
        <h3 class="text-sm font-medium text-gray-900">${title}</h3>
        <div class="flex flex-wrap">${tagsHtml}</div>
      </div>
      <p class="mt-2 text-xs text-gray-500">${description || 'Sem descrição'}</p>
      <div class="mt-3 flex items-center">
        <div class="flex-shrink-0">
          <div class="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
            Y
          </div>
        </div>
        <div class="ml-2 text-xs text-gray-500">Assigned to You</div>
      </div>
    `;
    
    newCard.draggable = true;
    document.querySelector('#todo-column').appendChild(newCard);
    modal.classList.add('hidden');
    
    // Resetar formulário
    document.getElementById('card-title').value = '';
    document.getElementById('card-tags').value = '';
    document.getElementById('card-desc').value = '';
  });
});