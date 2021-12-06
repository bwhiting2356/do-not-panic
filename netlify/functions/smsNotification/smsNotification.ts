import fetch from "node-fetch";
import querystring from 'querystring';
import { Handler } from '@netlify/functions'

 const TWILIO_URL =
  "https://todo-ron-ron-5347-dev.twil.io/functions/hello-world";

export const handler: Handler = async (event, context) => {
  

  const { phoneNumber } = querystring.parse(event.body);

  console.log('phoneNumber', phoneNumber);

  return fetch(TWILIO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber,
    }),
  })
  .then(() => ({ statusCode: 200, message: "SUCCESS"}))
  .catch((err) => ({ statusCode: 500, message: err }))
}
