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
  "payload": {
    "action": "hello"
  },
  "meta": {
    "version": "1.0.0",
    "packet_id": "123e4567-e89b-12d3-a456-426614174000",
    "timestamp": "2026-05-26T11:26:50.9531269"
  }
} `
 
    and then click send

## ENDPOINTS
### handshake/hello

` {
  "type": "HANDSHAKE",
  "payload": {
    "action": "hello"
  },
  "meta": {
    "version": "1.0.0",
    "packet_id": "123e4567-e89b-12d3-a456-426614174000",
    "timestamp": "2026-05-26T11:26:50.9531269"
  }
}`

### auth/register

`{
   "type": "AUTH",
   "payload": {
   "action": "register",
   "data": {
   "username": "testuser",
   "password": "SuperSecretPassword123"
   }
   },
   "meta": {
   "version": "1.0.0",
   "packet_id": "123e4567-e89b-12d3-a456-426614174000",
   "timestamp": "2026-05-26T11:26:50.9531269"
   }
   }
 `

### auth/login

`{
   "type": "AUTH",
   "payload": {
   "action": "login",
   "data": {
   "username": "testuser",
   "password": "SuperSecretPassword123"
   }
   },
   "meta": {
   "version": "1.0.0",
   "packet_id": "123e4567-e89b-12d3-a456-426614174000",
   "timestamp": "2026-05-26T11:26:50.9531269"
   }
   }
 `

### auth/refresh_token

`
{
  "type": "AUTH",
  "payload": {
    "action": "refresh_token",
    "data": {
      "refreshToken": "TUTAJ_WKLEJ_SWOJ_REFRESH_TOKEN"
    }
  },
  "token": "wyekspirowany_access_token_albo_puste_pole",
  "meta": {
    "version": "1.0.0",
    "packet_id": "848b3075-8bd4-49c0-994c-8bbbb7257000",
    "timestamp": "2026-05-26T11:26:50.9531269"
  }
}
`