import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { updateAttachmentUrl } from '../../businessLogic/todos';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('http');

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const bucketName = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const userId = getUserId(event);
  const url = getUploadUrl(todoId);
  const attachmentUrl = `https://${process.env.ATTACHMENTS_S3_BUCKET}.s3.amazonaws.com/${todoId}.png`;

  try {
    const result = await updateAttachmentUrl(userId, todoId, attachmentUrl);
    console.log('update attachments url result ', result);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  } catch (e) {
    logger.error('An error occurred updating an attachmentUrl', { error: e });
  }


}

function getUploadUrl(todoId: string) {
  logger.info('generating signed url...');
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `${todoId}.png`,
    Expires: urlExpiration
  })
}
