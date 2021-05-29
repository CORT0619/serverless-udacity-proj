import 'source-map-support/register'
import { getAllTodos } from '../../businessLogic/todos';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  console.log('userId ', userId);

  try {
    const result = await getAllTodos(userId);
    console.log('getGroups results ', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items: result.Items })
    }
  } catch (err) {
    logger.error('an error occurred retrieving todos ', { error: err });

    return {
      statusCode: 404,
      body: JSON.stringify({
        msg: 'An error has occurred.',
        error: err
      })
    }
  }
}
