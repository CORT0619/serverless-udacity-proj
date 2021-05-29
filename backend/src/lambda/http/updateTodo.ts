import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { updateTodo } from '../../businessLogic/todos';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {
    const result = await updateTodo(todoId, userId, updatedTodo);
    console.log('result ', result);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        updatedTodo
      })
    }
  } catch (e) {
    logger.error('An error occurred updating a todo', { error: e });

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: e
      })
    }
  }
}
