# Wrapper for API payment system Antrpay

## How to use

```ts
import { Antrpay } from 'antrpay'

const PUBLIC_KEY = 'public_key'
const SECRET_KEY = 'secret_key'

const instance = new Antrpay({
  publicKey: PUBLIC_KEY,
  secretKey: SECRET_KEY,
})

const invoice = await instance.createPaymentForm({ ... })
```
