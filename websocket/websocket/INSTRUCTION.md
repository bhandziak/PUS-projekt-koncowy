## Before starting backend open docker desktop and run:

`docker compose up -d`

this will start postgres db that is necessary for backend to exist


## How to test backend in postman

1. Open Postman
2. Click New -> WebSocket
3. To create connection:

   In "Enter Url" paste: ws://localhost:8080/chat and click connect
4. To send message after connection:

   In message paste something like this:

    `{ 
    "type": "HANDSHAKE", 
    "payload": 
    { 
        "action": "hello" 
    } 
} `
 
    and then click send