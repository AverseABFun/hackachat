# API

All requests and responses(except when otherwise marked) are in JSON. All connections should be over HTTPS or WSS

## `/v1/status`

Request: `(empty)`

Example response: 
```json
{
    "status": "up",
    "build": {
        "time": "1970-01-01T00:00:00Z",
        "name": "dev-hackachatter-v0.1",
        "version": "0.1.0",
        "codename": "T-rex"
    }
}
```

## `/v1/chat/createMessage`

Example request:
```json
{
    "data": "jbkEmAXWtsgNuTenXWXLypu5XZpibFw3RYi4kK6PG4E5aiRMRTcuncHk1v2zIFaNWo99WsINl4kySQe45ZRiHYke8jtxe8gavJ38HzOLgl1gRrb5CBc4DqVBC0NUMhlJwKEXux2t/r4CKJ/sO4QuHPiltHxm4vY5jqIbt3NelLDQu9+OEQN7Wx2f97VwkPeGtptTQosBTOlvtiProVaFjtnMa7l2PpkZHJH+r4E34EC9LuVtviLGNZE1CtOTFaKj5Qfk7RSaq6gf2KwKx47Nog==",
    "channelId": "ac72e4ec-3f76-43c0-a8e0-621cfcb6425b",
    "userId": "6baf6f4b-6487-4f07-84b2-4a3a68098e23",
    "idToken": "NmJhZjZmNGItNjQ4Ny00ZjA3LTg0YjItNGEzYTY4MDk4ZTIzLDg2YTFlODI3LTAzNDUtNGQ0Yy1hNWViLTNmY2IxNjQ3NWJkODpiOTJlNmRjMy1iYTRmLTRkNjUtYWI4My1iMjA3YmY1Y2RlNDE7MmFhNDhjZTNkMTA3MTY5NGUzODE2YTFjYjUzZDgzZDA2MjMyYjQyOTQyMGVkNjBmMDE2ODVkOTBjMzllNjgyOWE4M2ViMmM2MWQzMWQ1ZGM4ZjFjMTMyZmUyZmM1YTc3NzQwYWUxNGY3Yzg0NzhjMTA1NGJkZjUwNmVhNzJkYTg",
    "mentioning": ["9e8b89a0-a141-4e22-904a-08488a56a6e5"]
}
```

Example response: 
```json
{
    "error": false,
    "code": -1,
    "messageId": "3e199b1a-219c-4810-9470-1fba7a75d2f4"
}
```

### The text format

It should be in markdown with any reserved characters replaced with `\(character)` and with mentions in the format `@{(userId)}`. Mentions should be shown in the format `@(username)`.

### The `idToken` format

Any occurance of `idToken` is in this format:
```js
base64url(userId+":"+interactionToken+";"+sha512hmac(data=username+salt, hmac=password+salt2))
```
where each user id and the interaction token are UUIDs

## `/v1/wss`

All messages and responses should be followed by `\EOF` and that string should NOT be in any json. The recommended way to scrub it is to replace it with `\\EOF`.

Clientpoll:
```json
{
    "type": "poll",
    "endpoint": "/status"
}
```

Serverpoll response:
```json
{
    "status": "up",
    "build": {
        "time": "1970-01-01T00:00:00Z",
        "name": "dev-hackachatter-v0.1",
        "version": "0.1.0",
        "codename": "T-rex"
    }
}
```

Serverpoll:
```json
{
    "event": "kick",
    "id": "93ea35dd-ccc6-4b79-a0d5-596118538542",
    "blacklist": true
}
```

Clientpoll:
```json
{
    "type": "poll",
    "endpoint": "/createMessage",
    "data": "jbkEmAXWtsgNuTenXWXLypu5XZpibFw3RYi4kK6PG4E5aiRMRTcuncHk1v2zIFaNWo99WsINl4kySQe45ZRiHYke8jtxe8gavJ38HzOLgl1gRrb5CBc4DqVBC0NUMhlJwKEXux2t/r4CKJ/sO4QuHPiltHxm4vY5jqIbt3NelLDQu9+OEQN7Wx2f97VwkPeGtptTQosBTOlvtiProVaFjtnMa7l2PpkZHJH+r4E34EC9LuVtviLGNZE1CtOTFaKj5Qfk7RSaq6gf2KwKx47Nog==",
    "channelId": "ac72e4ec-3f76-43c0-a8e0-621cfcb6425b",
    "userId": "6baf6f4b-6487-4f07-84b2-4a3a68098e23",
    "idToken": "NmJhZjZmNGItNjQ4Ny00ZjA3LTg0YjItNGEzYTY4MDk4ZTIzLDg2YTFlODI3LTAzNDUtNGQ0Yy1hNWViLTNmY2IxNjQ3NWJkODpiOTJlNmRjMy1iYTRmLTRkNjUtYWI4My1iMjA3YmY1Y2RlNDE7MmFhNDhjZTNkMTA3MTY5NGUzODE2YTFjYjUzZDgzZDA2MjMyYjQyOTQyMGVkNjBmMDE2ODVkOTBjMzllNjgyOWE4M2ViMmM2MWQzMWQ1ZGM4ZjFjMTMyZmUyZmM1YTc3NzQwYWUxNGY3Yzg0NzhjMTA1NGJkZjUwNmVhNzJkYTg",
    "mentioning": ["9e8b89a0-a141-4e22-904a-08488a56a6e5"]
}
```
(see `/chat/createMessage`)

Serverpoll response:
(see `/chat/createMessage`)


```json
{
    "type": "poll",
    "endpoint": "/recieveMessages",
    "userId": "6baf6f4b-6487-4f07-84b2-4a3a68098e23",
    "idToken": "NmJhZjZmNGItNjQ4Ny00ZjA3LTg0YjItNGEzYTY4MDk4ZTIzLDg2YTFlODI3LTAzNDUtNGQ0Yy1hNWViLTNmY2IxNjQ3NWJkODpiOTJlNmRjMy1iYTRmLTRkNjUtYWI4My1iMjA3YmY1Y2RlNDE7MmFhNDhjZTNkMTA3MTY5NGUzODE2YTFjYjUzZDgzZDA2MjMyYjQyOTQyMGVkNjBmMDE2ODVkOTBjMzllNjgyOWE4M2ViMmM2MWQzMWQ1ZGM4ZjFjMTMyZmUyZmM1YTc3NzQwYWUxNGY3Yzg0NzhjMTA1NGJkZjUwNmVhNzJkYTg",
    "lastPollId": "6bd9599b-b84e-4e4c-957b-ba4e956f8aa6"
}
```

If this is the first poll, then the `lastPollId` should be `00000000-0000-0000-0000-000000000000`. Also, on the occurance of a mention(which will be triggered by the client sending the message) the serverpoll should be autosent.

Serverpoll response:
```json
{
    "newSinceLastPoll": true,
    "messages": [
        {
            "channelId": "ac72e4ec-3f76-43c0-a8e0-621cfcb6425b",
            "messageId": "9d2069b9-fea3-488b-93dd-fdd63b59afa7",
            "data": "jbkEmAXWtsgNuTenXWXLypu5XZpibFw3RYi4kK6PG4E5aiRMRTcuncHk1v2zIFaNWo99WsINl4kySQe45ZRiHYke8jtxe8gavJ38HzOLgl1gRrb5CBc4DqVBC0NUMhlJwKEXux2t/r4CKJ/sO4QuHPiltHxm4vY5jqIbt3NelLDQu9+OEQN7Wx2f97VwkPeGtptTQosBTOlvtiProVaFjtnMa7l2PpkZHJH+r4E34EC9LuVtviLGNZE1CtOTFaKj5Qfk7RSaq6gf2KwKx47Nog==",
            "unencrypted": false
        }
    ],
    "pollId": "60db338b-617a-431b-88d3-2bcb2cb5ba36"
}
```

### The messages.data format

```js
aes256(JSON.stringify({
    "message": messageContent,
    "user": sentUserId,
    "repliedTo": messageRepliedTo || "00000000-0000-0000-0000-000000000000"
}), cipherMode="GCM", tagLen=128, keySize=256, key=secretChannelKey.replaceAll("-", ""), iv=vectorGenerator(messageId, secretChannelKey))
```

The `message` field should be in UTF-8; however, all control characters should be kept except for the null character and any that might break things in the server or client, which are up to the server and client to decide. The only control characters that have to be allowed are unicode seperators and Cc control codes(except for the previously mentioned null character), minus any deprecated characters.

Note: UNDER NO CIRCUMSTANCES SHOULD THE `secretChannelKey` BECOME KNOWN TO THE SERVER. ALL ENCRYPTION AND DECRYPTION SHOULD ONLY BE DONE ON THE CLIENT.

The `vectorGenerator` should be implemented like this:
```js
return random_seed.create(messageId+secretChannelKey).string(16)
```

The random function should be an implementation of [GRC's UHE PRNG](https://www.grc.com/otg/uheprng.htm) due to its high entropy and arbitary seed. An example encryptor is in `encryption.js`.

The server can also send unencrypted messages, but due to the high security(hopefully) the server cannot read sent messages. Unencrypted messages just have all of the fields in encrypted data `unencrypted: true`. Also, the user field should always be `00000000-0000-0000-0000-000000000000` as ONLY the server should create unencrypted messages(except for commands, described further down), and the client should allow disabling showing unencrypted messages. An example would be:
```json
{
    "newSinceLastPoll": true,
    "messages": [
        {
            "channelId": "ac72e4ec-3f76-43c0-a8e0-621cfcb6425b",
            "message": "Someone joined the channel!",
            "user": "00000000-0000-0000-0000-000000000000",
            "repliedTo": "00000000-0000-0000-0000-000000000000",
            "id": "6810f957-129e-4a40-94f3-975b6f91ecb6",
            "unencrypted": true
        }
    ],
    "pollId": "60db338b-617a-431b-88d3-2bcb2cb5ba36"
}
```

## Joining channels

Each channel is identified with a channel block in this format:

```js
base64url(JSON.stringify({
    "channelId": "ac72e4ec-3f76-43c0-a8e0-621cfcb6425b",
    "channelName": "test-channel",
    "secretChannelKey": "00c02a9a-91eb-4dcf-8693-1c14802590b2",
    "_info_not_for_apps": "Anybody looking at this: DO NOT SHARE THE CHANNEL KEY. THIS IS WHAT IS USED TO ENCRYPT YOUR MESSAGES AND IT SHOULD NOT BE SHARED OR CHANGED.",
    "channelPerms": "7c5536f8-18ae-5b2f-9de2-f35100db00c2",
    "channelPermAuthUser": "1286a6b5-af27-446f-89a5-42f61388e060",
    "attemptId": "b3712fb2-1db4-48d5-9a2d-b10795ffc63e"
}))
```

The `_info_not_for_apps` field should be kept the same as it is in this example, as it provides info to anybody trying to understand it.

The `channelPerms` field should be a UUID representing a certain permission level from the list below, and should be unique to each channel and attempt. One way to generate this is to take the channel id and attempt id and put it into the two inputs of a UUID version 5. For example, with the info above, it produces `7c5536f8-18ae-5b2f-9de2-f35100db00c2`. Every permission level also has all of the permissions below it. 

- `OWNER`: The permission with the most power. Can delete and regenerate the channel key(and thus kicking everyone). (note: there can be only one owner and if someone else somehow manages to attempt to join with owner permissions then they should be immideatly downgraded to `VIEWER`).
- `ADMIN`: Can change the name of the channel and create new invites of all permission levels except for `OWNER` and `ADMIN`. They can also kick or ban anybody(when kicking someone, the server should broadcast a message to the user being kicked telling them that, however when banning someone the server should broadcast a message to all clients blacklisting the user and should not serve messages to them).
- `MODERATOR`: Can delete any message and mention everybody at once with `@all`.
- `MEMBER`: Can post, delete, and edit their own messages. Can also create invites. This is the first permission level that should not be auto-kicked.
- `GUEST`: Can post, delete, and edit their own messages which are also autodeleted after 4 hours(this is the responsibility of the server to send out the delete serverpoll and remove it from any pending clientpolls). They should by default be kicked after 48 hours.
- `VIEWER`: Can only view messages and do nothing else. They should by default be kicked after 24 hours.
- `FROZEN`: Like `VIEWER`, but is not kicked and is instead set to `MEMBER` after a delat. A user should be put into `FROZEN` after a `MODERATOR` or higher runs the command `/freeze @{(user)} delay:(delay)`. The delay should be represented with a number followed by one of: `m` for minute, `h` for hour, `d` for day, `w` for week, and `M` for month. The maximum delay should be `12M`.
- `BLINDED`: Like `FROZEN` but the user cannot see anything. The command should be `/blind @{(user)} delay:(delay)`. The delay should be in the same format as above.

The `channelPermAuthUser` field should contain a user id with a permission level higher then the target permission and this is used with the `channelPerms` field to authorize a certain permission level.

Triggering kicks and bans should be done with commands in the format:
```json
{
    "channelId": "ac72e4ec-3f76-43c0-a8e0-621cfcb6425b",
    "messageId": "4417956c-83e0-4fbf-926a-0a235ce38dab",
    "unencrypted": true,
    "command": true,
    "message": "/ban @{450caaa1-5697-41eb-a394-956c84c90061} reason:\"because i felt like it\"",
    "user": "996f7da7-9a99-42ab-be62-c84d1738892c",
    "repliedTo": "00000000-0000-0000-0000-000000000000"
}
```

And the server should then trigger a serverpoll response back only for the user running the command, and optionally for the target.
```json
{
    "channelId": "ac72e4ec-3f76-43c0-a8e0-621cfcb6425b",
    "message": "@{450caaa1-5697-41eb-a394-956c84c90061} has been banned by @{996f7da7-9a99-42ab-be62-c84d1738892c} for the reason: \"because i felt like it\"",
    "user": "00000000-0000-0000-0000-000000000000",
    "repliedTo": "4417956c-83e0-4fbf-926a-0a235ce38dab",
    "id": "e14b8472-d9ba-4dad-970a-9deadc27d149",
    "unencrypted": true
}
```

## Command descriptions
If any argument is invalid, the server should just send a private message to the sending user with the content `Invalid argument (argument name).` or if there is an invalid command with the content `Invalid command (attempted command).`

- `/ban (user) reason:"(reason)"`
This should create a public message with the content `@{(target)} has been banned by @{(person who banned)} for the reason: \"(reason)\"`, as well as sending out a serverpoll to all clients to ignore all messages from them. The server should also then ignore any clientpolls or requests from banned users.

- `/kick (user) reason:"(reason)"`
This should create a public message with the content `@{(target)} has been kicked by @{(person who kicked)} for the reason: \"(reason)\"`, as well as sending out a serverpoll to the kicked client to erase data from them. Because this relies on the clients cooperation, this is more easily bypassed. If anybody has any ideas to make this less ephemeral, please create a PR!

- `/freeze (user) delay:(delay) reason:"(reason)"`
This should create a public message with the content `@{(target)} has been freezed by @{(person who freezed)} for the reason: \"(reason)\"`, as well as changing the targets permission level to `FROZEN` and changing it back after the delay. The delay system is explained above. During the `FROZEN` state, the server should send a serverpoll with the content below and ignore all clientpolls or requests to create a message, edit a message, or delete a message with error 1.
```json
{
    "type": "permissionChange",
    "to": "FROZEN",
    "duration": "(delay)"
}
```

- `/blind (user) delay:(delay) reason:"(reason)"`
This should create a public message with the content `@{(target)} has been blinded by @{(person who blinded)} for the reason: \"(reason)\"`, as well as changing the targets permission level to `BLINDED` and changing it back after the delay. The delay system is explained above. During the `BLINDED` state, the server should send a serverpoll with the content below and ignore all clientpolls or requests to create a message, edit a message, delete a message, or clientpoll messages with error 2. All serverpoll mentions should be batched and sent at once at the end of the `BLINDED` state.
```json
{
    "type": "permissionChange",
    "to": "BLINDED",
    "duration": "(delay)"
}
```

- `/permissions set (user) level:(level)`
This should both trigger a server poll described below and set the current permissions for the user as well as creating a message only to the sending user with the content `@{(target)} now has permission level (level).` and a different one to only the target user with the content `You now have permission level (level).`
```json
{
    "type": "permissionChange",
    "to": "(level)"
}
```

- `/permissions get (user)`
The user field is optional and defaults to the sending user. This should trigger a message only to the sending user with the name of the current permission of the target user.
