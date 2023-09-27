import { test, expect } from '@playwright/test'

import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, createTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'

import data from "./fixtures/tasks.json"

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})

test.describe('cadastro', () => {
    test('deve poder cadastrar uma nova tarefa', async function ({ request }) {

        const task = data.success as TaskModel

        await deleteTaskByHelper(request, task.name)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('Não deve permitir tarefa duplicada', async function ({ request }) {

        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await createTask(request, task)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('Campo obrigatório', async function () {

        const task = data.required as TaskModel

        await tasksPage.go()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualiação', () => {
    test('Deve concluir uma tarefa', async function ({ request }) {

        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await createTask(request, task)

        await tasksPage.go()

        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', () => {
    test('Deve apagar uma tarefa', async function ({ request }) {

        const task = data.delete as TaskModel

        await deleteTaskByHelper(request, task.name)
        await createTask(request, task)

        await tasksPage.go()

        await tasksPage.go()
        await tasksPage.delete(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})
