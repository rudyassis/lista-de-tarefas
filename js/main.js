// objeto principal da aplicação
const Main = {      

    tasks: [], // array que armazena as tarefas

    // função responsável por iniciar tudo, ela 'chama' todas as outras funções.
    init: function() {
        // a palavra 'this' informa que a função esta dentro do objeto (Main)
        // chamando a funções
        this.cacheSelectors()  
        this.bindEvents()           
        this.getStoraged() // obtendo tudo que está armazenado          
        this.buildTasks() // constroi as tasks
    },

    // função responsável em selecionar elementos do html e colocar numa variável
    cacheSelectors: function() {
        // selecionando as classes '.check' e colocando dentro da variavel disponibilizando em toda as outras funções
        // o '$' serve para toda variavel que armazena um elemento HTML(boa prática)
        this.$checkButtons = document.querySelectorAll('.check') // botão de check tarefa concluida
        this.$inputTask = document.querySelector('#inputTask') // texto adicionado no input
        this.$list = document.querySelector('#list') // lista de tarefas
        this.$removeButtons = document.querySelectorAll('.remove') // botão remover tarefa
    },

    // função responsável por adicionar eventos (onclick, teclas, etc...)
    bindEvents: function() {
        // adicionado o objeto 'Main' que é referenciado por 'this' numa variavel
        const self = this
        // percorre o array e adiciona um evento de click
        this.$checkButtons.forEach(function(button) {
            button.onclick = self.Events.checkButton_click
        })
        // onkeypress = quando apertar uma tecla
        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this) // .bind conecta o 'this' daqui pra fora

        this.$removeButtons.forEach(function(button) {
            button.onclick = self.Events.removeButton_click.bind(self) // joga o 'this/self' para ser acessado fora e remover
        })
    },

    getStoraged: function() {
        const tasks = localStorage.getItem('tasks') // responsavel por fazer o get e armazenar no array 'tasks'

        // if para checar caso ainda não tenha nada no localStorage então devemos salvar um array vazio
        if(tasks) {
            this.tasks = JSON.parse(tasks) // pega os itens e joga no array 'tasks' como objeto
        } else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }
    },

    // função que retorna a string (li)
    getTaskHtml: function(task) {
        return `
            <li>
                <div class="check"></div>
                <label class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    insertHTML: function(element, htmlString) {
        element.innerHTML += htmlString
    
        this.cacheSelectors()
        this.bindEvents()
    },

    buildTasks: function() {
        let html = ''
        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html

        this.cacheSelectors() // chamamos novamente as funções
        this.bindEvents()
    },

    // Propriedade do objeto que armazena as funções de eventos (organização)
    Events: {
        // função de click
        checkButton_click: function(e) { // utilizamos o 'e' para relacionar evento
            const li = e.target.parentElement // jogando dentro de uma variavel o evento 'parentElement'
            const isDone = li.classList.contains('done') // adiciona a classe 'done' a 'li'
            // se for 'true' ele remove o sinal, senao adiciona o sinal
            if(isDone) {
                li.classList.remove('done')

            }else {
                li.classList.add('done')
            }

        },
        // função de adicionar uma tarefa nova
        inputTask_keypress: function(e) {
            const key = e.key // variavel recebe a tecla 'Enter' (confirmar a tarefa)
            const value = e.target.value // variavel recebe o valor digitado pelo usuario (nova tarefa)
            const isDone = false
            // se a tecla digitada for 'Enter' ele adiciona a tarefa
            if(key === 'Enter') {
                const taskHtml = this.getTaskHtml(value, isDone)
                
                this.insertHTML(this.$list, taskHtml) // adiciona a li com a tarefa nova

                e.target.value = '' // limpa o input depois que adicionamos

                // chamamos as funções para selecionar os inputs novamente(cacheSelectors) e para adicionar novamente os eventos (bindEvents)
                //this.cacheSelectors()
                //this.bindEvents()

                const savedTasks = localStorage.getItem('tasks') // pega as tarefas salvas
                const savedTasksArr = JSON.parse(savedTasks) // transforma em objeto
                const arrTasks = [
                    { task: value, done: isDone },    // criamos um array para salvar os valores em JSON
                    ...savedTasksArr,
                ]

                const jsonTasks = JSON.stringify(arrTasks)

                this.tasks = arrTasks
                localStorage.setItem('tasks', jsonTasks) // seleciona as tarefas e passa para JSON
            }
        },
        // função de remover o botão de delete
        removeButton_click: function(e) {
            const li = e.target.parentElement // jogando dentro de uma variavel o evento 'parentElement'
            const value = li.dataset['task'] // item que foi clicado para remover

            console.log(this.tasks)

            const newTasksState = this.tasks.filter(item => {
                console.log(item.task, value)
                return item.task !== value // percorre a lista de tasks
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState)) // salva o novo array dentro do objeto
            this.tasks = newTasksState

            li.classList.add('removed') // deleta a tarefa

            setTimeout(function() {
                li.classList.add('hidden') // some com a tarefa (imagem)
            },300)
        }
    }
}


Main.init()