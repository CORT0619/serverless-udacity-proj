import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos';
import { getUserId } from '../utils';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let attachmentUrl: string;
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const userId = getUserId(event);

  if (JSON.parse(event.body).attachmentUrl) {
    attachmentUrl = JSON.parse(event.body).attachmentUrl;
  }

  try {
    const createdTodo = await createTodo(newTodo, userId, attachmentUrl);
    console.log('createdTodo ', createdTodo);
  
    const item = createdTodo;
    delete item.userId;
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item
      })
    }
  } catch (e) {
    logger.error('Error creating todo: ', { error: e });

    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: `error creating todo: ${e}`
      })
    }
  }
}
