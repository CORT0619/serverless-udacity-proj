import * as uuid from 'uuid'
import { TodoAccess } from "../dataLayer/todoAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();

export async function getAllTodos(userId) {
    return await (await todoAccess.getTodos(userId)).result;
}


export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string, attachmentUrl?): Promise<TodoItem> {
    const itemId = uuid.v4();

    const request: TodoItem = {
        userId,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    };

    if (attachmentUrl) {
        request.attachmentUrl = attachmentUrl;
    }

    const result = await todoAccess.createTodo(request);
    return result.todo;
}

export async function deleteTodo(userId, todoId: string) {
    const result = await todoAccess.deleteTodo(userId, todoId);
    return (await result).todoId;
}

export async function updateTodo(todoId, userId, todo: UpdateTodoRequest) {
    const result = await todoAccess.updateTodo(todoId, userId, todo);
    return result.todo;
}

export async function updateAttachmentUrl(userId, todoId, attachmentUrl) {
    return await todoAccess.updateAttachmentUrl(userId, todoId, attachmentUrl);
}