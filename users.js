const crypto = require("crypto");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
	"Access-Control-Allow-Headers": "Content-Type",
};

module.exports.handler = async (event) => {
	console.log(event);
	const operationName = event.requestContext.operationName;
	const method = event.httpMethod;
	const body = event.body;

	if (operationName === "listUsers") {
		const items = await docClient.scan({
			TableName: process.env.TABLE,
		}).promise();

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
			body: JSON.stringify(items.Items),
		};
	}else if (operationName === "createUser") {
		const user = JSON.parse(body);
		const userid = crypto.randomBytes(16).toString("hex");

		await docClient.put({
			TableName: process.env.TABLE,
			Item: {
				...user,
				userid,
			},
		}).promise();
		
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
			body: JSON.stringify({userid}),
		};
	}else if (method === "OPTIONS") {
		return {
			statusCode: 200,
			headers: {
				...corsHeaders,
			}
		};
	}
};

