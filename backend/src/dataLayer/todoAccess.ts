import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoUpdate } from '../models/TodoUpdate';
import { TodoItem } from '../models/TodoItem';

const XAWS = AWSXRay.captureAWS(AWS);


export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todoIndex = process.env.TODOS_ID_INDEX
        ) {}

    async createTodo(todo: TodoItem) {
        console.log('this.todosTable ', this.todosTable);

        const result = await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise();

        console.log('result ', result);
        return {
            result,
            todo
        }
    }

    async deleteTodo(userId, todoId: any) {
        const result = await this.docClient.delete({ TableName: this.todosTable, Key: { todoId, userId } }).promise();
        console.log('result ', result);

        return {
            todoId, 
            result
        }
    }

    async updateTodo(todoId, userId, todo: TodoUpdate) {
        const request = {
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            ProjectionExpression: '#c',
            ExpressionAttributeNames: {"#c": "name"},
            UpdateExpression: 'set #c=:a, dueDate=:b, done=:c',
            ExpressionAttributeValues: {
                ":a": todo.name,
                ":b": todo.dueDate,
                ":c": todo.done
            },
            ReturnValues: 'UPDATED_NEW'
        };

        const result = await this.docClient.update(request).promise();
        console.log('result ', result);

        return {
            todo, 
            result
        };
    }

    async getTodos(userId) {
        const result = await this.docClient.query({ 
            TableName: this.todosTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        console.log('result ', result);

        return {
            userId,
            result
        };
    }
} 

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance');
        return new XAWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient();
}  