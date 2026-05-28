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
    "timestamp": "1779963665"
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
    "timestamp": "1779963665"
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
   "timestamp": "1779963665"
   }
   }
 `

### auth/login

`{
   "type": "AUTH",
   "payload": {
   "action": "login",
   "data": {
   "username": "andrzej",
   "password": "12345"
   }
   },
   "meta": {
   "version": "1.0.0",
   "packet_id": "123e4567-e89b-12d3-a456-426614174000",
   "timestamp": "1779963665"
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
    "timestamp": "1779963665"
  }
}
`

### room/list

`
{
  "type": "ROOM",
  "payload": {
    "action": "list",
    "data": null
  },
  "token": "TUTAJ_WKLEJ_SWOJ_ACCESS_TOKEN",
  "meta": {
    "version": "1.0.0",
    "packet_id": "a1b2c3d4-1234-5678-90ab-cdef12345678",
    "timestamp": 1779963665
  }
}
`

### room/create

`
{
  "type": "ROOM",
  "payload": {
    "action": "create",
    "data": {
      "name": "Programowanie w Springu",
      "description": "Pokój do dyskusji o backendzie"
    }
  },
  "token": "TUTAJ_WKLEJ_SWOJ_ACCESS_TOKEN_ADMINA",
  "meta": {
    "version": "1.0.0",
    "packet_id": "f5e6d7c8-9012-3456-78ab-cdef90123456",
    "timestamp": 1779963665
  }
}
`