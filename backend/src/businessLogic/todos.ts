import * as uuid from 'uuid'
import { TodoAccess } from "../dataLayer/todoAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();

export async function getAllTodos(userId) {
    return await (await todoAccess.getTodos(userId)).result;
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const itemId = uuid.v4();

    // const attachmentUrl = true; // work on this

    let request: TodoItem = {
        userId,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    };

    // if (attachmentUrl) {
    //     request.attachmentUrl = ''; // need to get the url
    // }
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