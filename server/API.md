# API

All requests and responses(except when otherwise marked) are in JSON. All connections should be over HTTPS or WSS

## `/status`

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

## `/chat/createMessage`

Example request:
```json
{
    "text": "Hello there, fine sir! ",
    "userId": "6baf6f4b-6487-4f07-84b2-4a3a68098e23",
    "idToken": "NmJhZjZmNGItNjQ4Ny00ZjA3LTg0YjItNGEzYTY4MDk4ZTIzLDg2YTFlODI3LTAzNDUtNGQ0Yy1hNWViLTNmY2IxNjQ3NWJkODpiOTJlNmRjMy1iYTRmLTRkNjUtYWI4My1iMjA3YmY1Y2RlNDE7MmFhNDhjZTNkMTA3MTY5NGUzODE2YTFjYjUzZDgzZDA2MjMyYjQyOTQyMGVkNjBmMDE2ODVkOTBjMzllNjgyOWE4M2ViMmM2MWQzMWQ1ZGM4ZjFjMTMyZmUyZmM1YTc3NzQwYWUxNGY3Yzg0NzhjMTA1NGJkZjUwNmVhNzJkYTg"
}
```

Example response: 
```json
{
    "error": false,
    "code": -1
}
```

### The `idToken` format

Any occurance of `idToken` is in this format:
```js
base64url(userIds.join(",")+":"+interactionToken+";"+sha512hmac(data=username+salt, hmac=password+salt2))
```
where each user id and the interaction token are UUIDs

## `/wss`

All messages and responses should be followed by `\EOF` and that string should NOT be in any json. The recommended way to scrub it is to replace it with `\\EOF`.

List of valid messages:

```json
{
    "type": "poll",
    "endpoint": "/status"
}
```

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


```json
{
    "type": "poll",
    "endpoint": "/recieveMessages",
    "userId": "6baf6f4b-6487-4f07-84b2-4a3a68098e23",
    "idToken": "NmJhZjZmNGItNjQ4Ny00ZjA3LTg0YjItNGEzYTY4MDk4ZTIzLDg2YTFlODI3LTAzNDUtNGQ0Yy1hNWViLTNmY2IxNjQ3NWJkODpiOTJlNmRjMy1iYTRmLTRkNjUtYWI4My1iMjA3YmY1Y2RlNDE7MmFhNDhjZTNkMTA3MTY5NGUzODE2YTFjYjUzZDgzZDA2MjMyYjQyOTQyMGVkNjBmMDE2ODVkOTBjMzllNjgyOWE4M2ViMmM2MWQzMWQ1ZGM4ZjFjMTMyZmUyZmM1YTc3NzQwYWUxNGY3Yzg0NzhjMTA1NGJkZjUwNmVhNzJkYTg",
    "lastPollId": "6bd9599b-b84e-4e4c-957b-ba4e956f8aa6"
}
```

If this is the first poll, then the `lastPollId` should be `00000000-0000-0000-0000-000000000000`.

Example response:
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
}), cipherMode="GCM", tagLen=128, keySize=256, key=secretChannelKey.replaceAll("-", ""), iv=vectorGenerator(messageId, channelKey))
```

Note: UNDER NO CIRCUMSTANCES SHOULD THE `secretChannelKey` BECOME KNOWN TO THE SERVER. ALL ENCRYPTION AND DECRYPTION SHOULD ONLY BE DONE ON THE CLIENT.

The `vectorGenerator` should be implemented like this:
```js
var result = []
for (var i = 0; i<=16; i++) {
    result.push(String.fromCharCode(random(seed=messageId+secretChannelKey+"+"+i, range=96)+20))
}
result = result.join("")
return result
```

The `random` function should be an implementation of [GRC's UHE PRNG](https://www.grc.com/otg/uheprng.htm) due to its high entropy and arbitary seed. The `"+"+i` part of the code is added to make each digit have a different seed and thus a different output. Due to this, GRC's UHE PRNG is more like a hash function then a PRNG, but that's besides the point

The server can also send unencrypted messages, but due to the high security(hopefully) the server cannot read sent messages. Unencrypted messages just have all of the fields in encrypted data `unencrypted: true`. Also, the user field should always be `00000000-0000-0000-0000-000000000000` as ONLY the server should create unencrypted messages, and the client should allow disabling showing unencrypted messages. An example would be:
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

The `channelPerms` field should be a UUID representing a certain permission level from the list below, and should be unique to each channel and attempt. One way to generate this is to take the channel id and attempt id and put it into the two inputs of a UUID version 5. For example, with the info above, it produces `7c5536f8-18ae-5b2f-9de2-f35100db00c2`.

- `OWNER`: The permission with the most power. Can delete and regenerate the channel key(and thus kicking everyone) plus all the powers of the permissions below it. (note: there can be only one owner and if someone else somehow manages to attempt to join with owner permissions then they should be immideatly downgraded to `GUEST`).
- `ADMIN`: Can change the name of the channel and create new invites of all permission levels except for `OWNER`. They can also kick anybody.

The `channelPermAuthUser`