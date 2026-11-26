# Hello Agent

This recipe models a minimal CoreBlow SDK integration that accepts an input message and returns a structured reply payload.

## Example Module

Save the following module as `hello-agent.mjs`:

```js
export function createReply(input) {
  const text = String(input ?? "").trim();
  return {
    product: "CoreBlow",
    ok: text.length > 0,
    reply: text.length > 0 ? `CoreBlow received: ${text}` : "CoreBlow needs input.",
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(createReply("hello"), null, 2));
}
```

## Run

```sh
node hello-agent.mjs
```

Expected output:

```json
{
  "product": "CoreBlow",
  "ok": true,
  "reply": "CoreBlow received: hello"
}
```
