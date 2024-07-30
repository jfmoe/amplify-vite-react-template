import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      ownerId: a.string().default(''),
      birthday: a.number().default(-28800),
      status: a.number().default(0),
      weight: a.number(),
      weightUnit: a.number.default('kg'),
      breed: a.string().default(''),
      sex: a.number().default(0),
      extInfo: a.string().default('{\"weightScale\":1}'),
      bindUser: a.string().default(''),
      heightUnit: a.string().default('cm'),
      category: a.string().default('xyj'),
      diseaseHistory: a.string().default(''),
      brandCode: a.string().default(''),
      contact: a.string().default(''),
      productId: a.string().default(''),
      type: a.number().default(1),
      devId: a.string().default(''),
      userType: a.number().default(21),
      uid: a.string().default(''),
      height: a.number.default(170),
      userTypeCode: a.string().default('user'),
      hipUnit: a.string().default(''),
      avatar: a.string().default(''),
      userRole: a.number().default(0),
      userName: a.string().default('user'),
    })
    .authorization((allow) => [allow.publicApiKey().to(["create", "update", "get", "list", "search", "listen", "sync"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 7,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
