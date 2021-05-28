import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos';
import { getUserId } from '../utils';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let result;
  const todoId = event.pathParameters.todoId;
  console.log('todoId ', todoId);

  const userId = getUserId(event);

  try {
    result = await deleteTodo(userId, todoId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        msg: `Todo ${result} deleted successfully!`
      })
    }
    
  } catch (e) {
    console.log('error: ', e);

    return {
      statusCode: 404,
      body: JSON.stringify({
        msg: 'An error has occurred. Todo deletion unsuccessful.',
        error: e
      })
    }
  }
}
