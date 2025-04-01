// Implementação completa do Kanban com modal
document.addEventListener('DOMContentLoaded', function() {
  // Configuração robusta do drag and drop
  function setupDragAndDrop() {
    const cards = document.querySelectorAll('.card');
    const columns = document.querySelectorAll('.kanban-column');
 
    cards.forEach(card => {
      card.draggable = true;
      card.addEventListener('dragstart', handleDragStart);
    });
 
    columns.forEach(column => {
      column.addEventListener('dragover', handleDragOver);
      column.addEventListener('dragleave', handleDragLeave);
      column.addEventListener('drop', handleDrop);
    });
  }
 
  let draggedCardId = null;
 
  function handleDragStart(e) {
    draggedCardId = e.target.id;
    e.dataTransfer.setData('text/plain', draggedCardId);
    e.target.classList.add('dragging');
  }
 
  function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drop-zone-active');
  }
 
  function handleDragLeave(e) {
    e.currentTarget.classList.remove('drop-zone-active');
  }
 
  function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-zone-active');
 
    if (draggedCardId) {
      const card = document.getElementById(draggedCardId);
      const targetColumn = e.currentTarget;
 
      // Garante que o card não seja anexado ao mesmo elemento que o iniciou
      if (card && !targetColumn.contains(card) && targetColumn.classList.contains('kanban-column')) {
        targetColumn.appendChild(card);
        updateColumnCounters();
      }
 
      // Remove a classe dragging após o drop
      if (card) {
        card.classList.remove('dragging');
      }
      draggedCardId = null; // Limpa o ID do card arrastado
    }
  }
 
  function updateColumnCounters() {
    document.querySelectorAll('.kanban-column').forEach(column => {
      const counter = column.querySelector('span.bg-gray-100, span.bg-blue-100, span.bg-green-100');
      if (counter) {
        const count = column.querySelectorAll('.card').length;
        counter.textContent = count;
      }
    });
  }
 
  // Configura inicialmente
  setupDragAndDrop();
  updateColumnCounters();
 
  // Modal para novo card
  const modalHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50" id="card-modal">
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-bold mb-4">Novo Card</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Título*</label>
            <input type="text" id="card-title" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required>
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
    </div>
  `;
 
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = document.getElementById('card-modal');
  const openModalButton = document.querySelector('button.bg-blue-600') ||
                           document.querySelector('button:contains("Adicionar Card")');
 
  console.log('Botão Add Card encontrado:', openModalButton);
 
  if (openModalButton) {
    openModalButton.addEventListener('click', () => {
      console.log('Botão Add Card clicado');
      if (modal) {
        modal.classList.remove('hidden');
        console.log('Modal aberto com sucesso');
      } else {
        console.error('Modal não encontrado');
      }
    });
  } else {
    console.error('Botão Add Card não encontrado - verifique o seletor CSS');
  }
 
  // Fechar modal
  document.getElementById('cancel-card')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    currentEditingCard = null;
    document.querySelector('#card-modal h3').textContent = 'Novo Card';
  });

  let currentEditingCard = null;

  // Função para editar card
  function editCard(card) {
    currentEditingCard = card;
    const title = card.querySelector('h3').textContent;
    const desc = card.querySelector('p').textContent;
    const tags = [...card.querySelectorAll('span[class*="bg-"]')].map(tag => tag.textContent).join(', ');

    document.getElementById('card-title').value = title;
    document.getElementById('card-desc').value = desc === 'Sem descrição' ? '' : desc;
    document.getElementById('card-tags').value = tags;
    document.querySelector('#card-modal h3').textContent = 'Editar Card';
    modal.classList.remove('hidden');
  }

  // Função para abrir modal de edição
  function openEditModal(card) {
    currentEditingCard = card;
    const modal = document.getElementById('card-modal');
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const tags = [...card.querySelectorAll('span')].map(span => span.textContent).join(', ');

    document.getElementById('card-title').value = title;
    document.getElementById('card-desc').value = description === 'Sem descrição' ? '' : description;
    document.getElementById('card-tags').value = tags;
    
    modal.classList.remove('hidden');
    document.querySelector('#card-modal h3').textContent = 'Editar Card';
  }

  // Salvar card (criação ou edição)
  document.getElementById('save-card')?.addEventListener('click', () => {
    const title = document.getElementById('card-title').value.trim();
    if (!title) return alert('Título é obrigatório!');

    const tags = document.getElementById('card-tags').value;
    const description = document.getElementById('card-desc').value;

    if (currentEditingCard) {
      // Editar card existente
      currentEditingCard.querySelector('h3').textContent = title;
      currentEditingCard.querySelector('p').textContent = description || 'Sem descrição';
      
      const tagsContainer = currentEditingCard.querySelector('.flex.flex-wrap');
      tagsContainer.innerHTML = tags ? tags.split(',').map(tag =>
        `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">${tag.trim()}</span>`
      ).join('') : '';
      
      currentEditingCard = null;
    } else {
      // Criar novo card
      const cardId = 'card-' + Date.now();
      const newCard = document.createElement('div');
      newCard.id = cardId;
      newCard.className = 'card bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm cursor-grab';
      newCard.draggable = true;
 
    const tagsHTML = tags ? tags.split(',').map(tag =>
      `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">${tag.trim()}</span>`
    ).join('') : '';
 
    newCard.innerHTML = `
      <div class="flex justify-between items-start">
        <h3 class="text-sm font-medium text-gray-900">${title}</h3>
        <div class="flex flex-wrap">${tagsHTML}</div>
      </div>
      <p class="mt-2 text-xs text-gray-500">${description || 'Sem descrição'}</p>
      <div class="mt-3 flex items-center">
        <div class="flex-shrink-0">
          <div class="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
            U
          </div>
        </div>
        <div class="ml-2 text-xs text-gray-500">Criado por Você</div>
      </div>
    `;
 
    document.querySelector('#todo-column').appendChild(newCard);
    modal.classList.add('hidden');
 
    // Reset form
    document.getElementById('card-title').value = '';
    document.getElementById('card-tags').value = '';
    document.getElementById('card-desc').value = '';
 
    // Reconfigurar drag and drop após adicionar um novo card
    setupDragAndDrop();
    updateColumnCounters();
  });
 
  // Inicializa o drag and drop ao carregar a página
  setupDragAndDrop();
  updateColumnCounters();
 });