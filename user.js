const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
	"Access-Control-Allow-Headers": "Content-Type",
};

module.exports.handler = async (event) => {
	const operationName = event.requestContext.operationName;
	const method = event.httpMethod;
	const body = event.body;
	const userid = event.pathParameters.userid;

	if (operationName === "getUser") {
		const user = await docClient.get({
			TableName: process.env.TABLE,
			Key: {userid},
		}).promise();

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
			body: JSON.stringify(user.Item),
		};
	}else if (operationName === "updateUser" ) {
		const user = JSON.parse(body);

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
			body: JSON.stringify({status: "OK"}),
		};
	}else if (operationName === "deleteUser") {
		await docClient.delete({
			TableName: process.env.TABLE,
			Key: {userid},
		}).promise();

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
			body: JSON.stringify({status: "OK"}),
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

