const API_URL = 'https://meu-link-hub-api.onrender.com/api/links';

// Seleciona os elementos do HTML
const form = document.getElementById('add-link-form');
const linkList = document.getElementById('link-list');
const loadingMessage = document.getElementById('loading-message');

// Função principal: Carrega os links da API e exibe na tela
async function carregarLinks() {
    linkList.innerHTML = ''; 
    loadingMessage.style.display = 'block'; 

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar links.');

        const links = await response.json();

        if (links.length === 0) {
            loadingMessage.innerText = 'Nenhum link salvo ainda.';
            return;
        }

        loadingMessage.style.display = 'none'; 

        // Cria um card para cada link
        links.forEach(link => {
            const card = document.createElement('div');
            card.className = 'link-card';
            card.innerHTML = `
                <div class="link-card-content">
                    <h3>${link.title}</h3>
                    <p>${link.description || ''}</p>
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.url}</a>
                </div>
                <div class="link-card-actions">
                    <button class="btn-delete" data-id="${link.id}">Excluir</button>
                </div>
            `;
            linkList.appendChild(card);
        });

    } catch (error) {
        loadingMessage.innerText = 'Falha ao carregar links.';
        console.error(error);
    }
}

// Função para Adicionar um novo link
async function adicionarLink(event) {
    event.preventDefault(); 

    // Pega os valores do formulário
    const title = document.getElementById('link-title').value;
    const url = document.getElementById('link-url').value;
    const description = document.getElementById('link-desc').value;

    const novoLink = { title, url, description };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoLink),
        });

        if (!response.ok) throw new Error('Erro ao salvar link.');

        form.reset();
        carregarLinks();

    } catch (error) {
        console.error(error);
        alert('Falha ao salvar o link.');
    }
}

// Função para Deletar um link
async function deletarLink(event) {
    if (!event.target.classList.contains('btn-delete')) {
        return;
    }

    const linkId = event.target.getAttribute('data-id');

    if (!confirm('Tem certeza que deseja excluir este link?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${linkId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Erro ao deletar link.');

        // Recarrega a lista
        carregarLinks();

    } catch (error) {
        console.error(error);
        alert('Falha ao deletar o link.');
    }
}


document.addEventListener('DOMContentLoaded', carregarLinks);

form.addEventListener('submit', adicionarLink);

linkList.addEventListener('click', deletarLink);