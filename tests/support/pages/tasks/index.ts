import { Page, expect } from "@playwright/test"
import { TaskModel } from "../../../fixtures/task.model"

export class TaskPage {

    readonly page: Page

    constructor (page: Page) {
        this.page = page
    }

    async go () {
        await this.page.goto('http://localhost:8080')
    }

    async create(task: TaskModel) {
        const inputNewTask = this.page.locator('input[placeholder$="new Task"]')
        await inputNewTask.fill(task.name)
        await this.page.click('css=button >> text=Create')
    }

    async shouldHaveText(taskName: string) {
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    async alertHaveText(text: string) {
        const target = this.page.locator('.swal2-html-container')
        await expect(target).toHaveText(text)
    }
}