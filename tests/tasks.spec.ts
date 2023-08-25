import { test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, createTask } from './support/helpers'
import { TaskPage } from './support/pages/tasks'

test('deve poder cadastrar uma nova tarefa', async function( { page, request } ) {

    const task: TaskModel = {
        name: 'Ler um livro de TypeScript',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    
    const tasksPage : TaskPage = new TaskPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)
})

test('Não deve permitir tarefa duplicada', async function( { page, request } ) {

    const task: TaskModel = {
        name: 'Comprar Ketchup',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    await createTask(request, task)

    const tasksPage : TaskPage = new TaskPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')
})