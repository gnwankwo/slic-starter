'use strict'

const Uuid = require('uuid')
const { dynamoDocClient } = require('../../lib/aws')

const tableName = 'checklists'

module.exports = {
  create,
  update,
  remove,
  get,
  list
}

async function create({ userId, name }) {
  const item = {
    userId,
    name,
    entries: {},
    listId: Uuid.v4(),
    createdAt: Date.now()
  }
  await dynamoDocClient()
    .put({
      TableName: tableName,
      Item: item
    })
    .promise()
  return item
}

async function update({ listId, userId, name = null }) {
  //Test condition for name=null??
  const updatedAt = Date.now()
  await dynamoDocClient()
    .update({
      TableName: tableName,
      Key: { userId, listId },
      UpdateExpression: 'SET name = :name, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':name': name,
        ':updatedAt': updatedAt
      }
    })
    .promise()
}

async function remove({ listId, userId }) {
  await dynamoDocClient()
    .delete({
      TableName: tableName,
      Key: { userId, listId }
    })
    .promise()
}

async function get({ listId, userId }) {
  return (await dynamoDocClient()
    .get({
      TableName: tableName,
      Key: { userId, listId }
    })
    .promise()).Item
}

async function list({ userId }) {
  return (await dynamoDocClient()
    .query({
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()).Items
}
