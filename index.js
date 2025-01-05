// Seleciona o formulário, o campo de input do título da tarefa, e a lista de tarefas
const form = document.querySelector('#todo-form');
const taskTitleInput = document.querySelector('#task-title-input');
const todoListUl = document.querySelector('#todo-list');

let tasks = []; // Array para armazenar as tarefas, cada uma com título e estado (feita ou não)

// Função para renderizar uma tarefa no HTML
function renderTaskOnHTML(taskTitle, done = false) {
    const li = document.createElement('li'); // Cria um elemento de lista

    // Cria um checkbox para marcar a tarefa como feita ou não
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox'); // Define o tipo como checkbox
    input.addEventListener('change', (event) => {
        const liToToggle = event.target.parentElement; // Obtém o elemento <li> pai do checkbox
        const spanToToggle = liToToggle.querySelector('span'); // Obtém o <span> dentro do <li>
        const done = event.target.checked; // Verifica se o checkbox está marcado

        // Altera o estilo do texto dependendo se a tarefa está feita ou não
        spanToToggle.style.textDecoration = done ? 'line-through' : 'none';

        // Atualiza o estado da tarefa no array de tarefas
        tasks = tasks.map(t => {
            if (t.title === spanToToggle.textContent) {
                return {
                    title: t.title,
                    done: !t.done,
                };
            }
            return t;
        });

        // Salva as tarefas atualizadas no localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    input.checked = done; // Define o estado inicial do checkbox

    // Cria um <span> para mostrar o título da tarefa
    const span = document.createElement('span');
    span.textContent = taskTitle;
    if (done) {
        span.style.textDecoration = 'line-through'; // Marca como feita se necessário
    }

    // Cria um botão para remover a tarefa
    const button = document.createElement('button');
    button.textContent = 'Remover';
    button.addEventListener('click', (event) => {
        const liToRemove = event.target.parentElement; // Obtém o <li> pai do botão
        const titleToRemove = liToRemove.querySelector('span').textContent; // Obtém o título da tarefa

        // Remove a tarefa do array de tarefas
        tasks = tasks.filter(t => t.title !== titleToRemove);

        // Remove a tarefa do DOM
        todoListUl.removeChild(liToRemove);

        // Atualiza o localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    // Adiciona o checkbox, o título e o botão ao <li>
    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(button);

    // Adiciona o <li> à lista de tarefas no HTML
    todoListUl.appendChild(li);
}

// Executa ao carregar a página, recupera as tarefas do localStorage e as renderiza
window.onload = () => {
    const tasksOnLocalStorage = localStorage.getItem('tasks');

    if (!tasksOnLocalStorage) return; // Se não houver tarefas salvas, sai da função

    tasks = JSON.parse(tasksOnLocalStorage); // Converte o JSON para um array de tarefas

    // Renderiza cada tarefa salva
    tasks.forEach(t => {
        renderTaskOnHTML(t.title, t.done);
    });

    console.log(tasksOnLocalStorage); // Loga as tarefas recuperadas no console
};

// Adiciona um ouvinte de evento ao formulário para tratar o envio de novas tarefas
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o comportamento padrão de recarregar a página ao submeter o formulário

    const taskTitle = taskTitleInput.value; // Obtém o valor do input do título da tarefa

    if (taskTitle.length < 3) { // Verifica se o título tem pelo menos 3 caracteres
        alert('Seu produto precisa ter pelo menos 3 caracteres');
        return;
    }

    // Adiciona uma nova tarefa ao array de tarefas
    tasks.push({
        title: taskTitle,
        done: false,
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Salva as tarefas atualizadas no localStorage

    // Renderiza a nova tarefa no HTML
    renderTaskOnHTML(taskTitle);

    taskTitleInput.value = ''; // Limpa o campo de input após adicionar a tarefa
});
