import express from "express";
import ServerlessHttp from "serverless-http";
import AWS, { AWSError, DynamoDB } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import {
  DeleteItemOutput,
  GetItemOutput,
  PutItemOutput,
  ScanOutput,
  UpdateItemOutput,
} from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json());

const EMPLOYEES_TABLE = process.env.EMPLOYEES_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

/**
 * @api {post} /employees Create an employee
 */
app.post("/employees", async (req, res) => {
  const { employeeId, employeeName, employeeAge, employeeRole } = req.body;

  if (checkFields(employeeId, employeeName, employeeAge, employeeRole))
    return generateResponse(res, 400, "Bad Request");

  try {
    const body = {
      uuid: uuid(),
      employeeId,
      employeeName,
      employeeAge,
      employeeRole,
    };

    await dynamoDb({
      method: "put",
      params: {
        Item: body,
      },
    });

    generateResponse(res, 200, body);
  } catch (e) {
    generateResponse(res, 500, "Could not create employee", e);
  }
});

/**
 * @api {delete} /employees/:id Deletes an employee
 */
app.delete("/employees/:uuid", async (req, res) => {
  try {
    const result = await dynamoDb({
      method: "delete",
      params: {
        Key: {
          uuid: req.params.uuid,
        },
        ReturnValues: "ALL_OLD"
      },
    });

    generateResponse(res, 200, result.Attributes);
  } catch (e) {
    generateResponse(res, 500, "Could not delete employee", e);
  }
});

/**
 * @api {get} /employees Get all employees
 */
app.get("/employees", async (req, res) => {
  try {
    const result = await dynamoDb({
      method: "scan",
      params: {},
    });

    generateResponse(res, 200, result.Items);
  } catch (e) {
    generateResponse(res, 500, "Could not get employees", e);
  }
});

/**
 * @api {get} /employees/:id Get an employee
 */
app.get("/employees/:uuid", async (req, res) => {
  try {
    const result = await dynamoDb({
      method: "get",
      params: {
        Key: {
          uuid: req.params.uuid,
        },
      },
    });

    generateResponse(res, 200, result.Item);
  } catch (e) {
    generateResponse(res, 500, "Could not get employee", e);
  }
});

/**
 * @api {put} /employees/:id Update an employee
 */
app.put("/employees/:uuid", async (req, res) => {
  const { employeeId, employeeName, employeeAge, employeeRole } = req.body;

  if (checkFields(employeeId, employeeName, employeeAge, employeeRole))
    return generateResponse(res, 400, "Bad Request");

  try {
    const result = await dynamoDb({
      method: "update",
      params: {
        Key: {
          uuid: req.params.uuid,
        },
        UpdateExpression:
          "set employeeId = :employeeId, employeeName = :employeeName, employeeAge = :employeeAge, employeeRole = :employeeRole",
        ExpressionAttributeValues: {
          ":employeeId": employeeId,
          ":employeeName": employeeName,
          ":employeeAge": employeeAge,
          ":employeeRole": employeeRole,
        },
        ReturnValues: "UPDATED_NEW",
      },
    });

    generateResponse(res, 200, result);
  } catch (e) {
    generateResponse(res, 500, "Could not update employee", e);
  }
});

/**
 * Listen all invalid routes
 */
app.all("*", (req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: `${req.path} not found`,
  });
});

export const handler = ServerlessHttp(app);

/**
 * Check if all fields are present
 */
const checkFields = (...body: any[]) => {
  return !body.some((x) => x !== null && x !== "");
};

/**
 * Generate response
 */
const generateResponse = (
  res: express.Response,
  statusCode: number,
  content: any,
  error?: any
) => {
  if (error) console.error(error);

  return res.status(statusCode).json({
    statusCode,
    message: content,
  });
};

/**
 * Makes easier to use dynamoDb
 */
async function dynamoDb<T extends DynamoDBParams>({
  method,
  params,
}: T): Promise<PromiseResult<DynamoDbReturnType<T>, AWSError>> {
  try {
    const result = await dynamoDbClient[method]({
      TableName: EMPLOYEES_TABLE,
      ...params,
    }).promise();

    return result as PromiseResult<DynamoDbReturnType<T>, AWSError>;
  } catch (e: any) {
    throw new Error(e);
  }
}

/**
 * Typescript stuff
 */
type Update = "update";
type Get = "get";
type Scan = "scan";
type Delete = "delete";
type Put = "put";

type DynamoDBMethod = Update | Get | Scan | Delete | Put;
type DynamoDBParams = { method: DynamoDBMethod; params: any };

type DynamoDbReturnType<T extends DynamoDBParams> = T["method"] extends Update
  ? UpdateItemOutput
  : T["method"] extends Get
  ? GetItemOutput
  : T["method"] extends Scan
  ? ScanOutput
  : T["method"] extends Delete
  ? DeleteItemOutput
  : T["method"] extends Put
  ? PutItemOutput
  : never;
