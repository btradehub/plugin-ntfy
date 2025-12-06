# 📢 NTFY Notifications for Trading Strategies

This plugin enables **real-time push notifications** from your trading strategy using **[ntfy.sh](https://ntfy.sh/)** — a lightweight publish/subscribe notification service.

Use it for:
- Trade executions (entry/exit)
- Risk alerts (stop loss, liquidation)
- Trend or indicator signal triggers
- Any custom strategy alert

> ⚠️ Notifications are **only sent in live modes** (ignored in backtests).

---

## 🚀 Setup

Enable the plugin in your strategy:

```js
function setup() {
  trader.require("ntfy", {
    log: true, // (Optional) Log notification events. Default: true
    server: 'https://your-custom-ntfy-server.com' // (Optional) Custom ntfy server. Default: official ntfy.sh
  });

  // Configuration is optional — defaults will be used
  trader.require("ntfy");
}
````

### Configuration Options

| Option   | Type         | Default                 | Description                     |
| -------- | ------------ | ----------------------- | ------------------------------- |
| `log`    | boolean      | `true`                  | Logs notification send attempts |
| `server` | string (URL) | Official ntfy.sh server | For self-hosted ntfy            |

You may omit the config object entirely if defaults are fine.

---

## 📩 Sending Notifications

Inside your strategy logic:

```js
async function update() {
  if (/* condition */) {
    const result = await plugin.ntfy.send('topic-name', "Test notification 🥳");

    // OR with optional ntfy headers (see ntfy docs)
    const result2 = await plugin.ntfy.send('topic-name', "My message", {
      'Tags': 'computer,+1',
      'Icon': 'https://example.com/icon.png'
    });
  }
}
```

---

## ⚠️ Network Access Requirements

This plugin requires network access to communicate with **ntfy.sh**.

- You **must enable** network permission for this plugin from the **Plugins** page.
- By default, only the official `ntfy.sh` domain is allowed.

If you use a **custom ntfy server** (via the `server` option), you **must update** your plugin’s `manifest.json` to include the correct network origin — otherwise requests will be blocked.

Example manifest entry:
```json
    "network": {
      "origins": [
        "https://ntfy.sh",
        "https://your-custom-ntfy-server.com"
      ]
    }
````

This network origin policy is enforced **for security reasons** — to ensure plugins can only make requests to safe and explicitly-approved domains.

> Without correct permissions and allowed origins, notifications **will not be sent**.

---

## 🔁 Return Value (Async, Never Throws)

`.send()` is asynchronous and always resolves — it **never throws** exceptions.

✔ Success response:

```js
{
  success: true,
  response: { /* ntfy response */ }
}
```

❌ Failure response:

```js
{
  success: false,
  error: "Description of what went wrong"
}
```

Example check:

```js
const { success, error } = await plugin.ntfy.send("alerts", "Order executed!");

if (!success) {
  log("Notification failed:", error);
}
```

---

## ⚡ Non-Blocking Usage (Fire-and-Forget)

If you **don’t need** to confirm success, just call without `await`:

```js
// Does not block strategy execution
plugin.ntfy.send("alerts", "New signal!");
```

| Style      | Behavior               | Recommended for                 |
| ---------- | ---------------------- | ------------------------------- |
| `await`    | Waits for server reply | Debugging / confirmation needed |
| No `await` | Continues immediately  | High-speed strategy loops ✔     |

---

## 🧪 Testing

Subscribe to a topic in:

* Mobile app 📱
* Browser 🌐
* Desktop app 💻

Then trigger a message:

```js
plugin.ntfy.send("alerts", "Hello from my bot!");
```

You should receive a push notification instantly.

---

## 🏁 Summary

| Feature                    | Status               |
| -------------------------- | -------------------- |
| Live trading notifications | ✔️                   |
| Async send API             | ✔️                   |
| Never throws               | ✔️                   |
| Fire-and-forget mode       | ✔️                   |
| Custom ntfy server         | ✔️                   |
| Logs enabled by default    | ✔️                   |
| Notifications in backtest  | ❌ Disabled by design |

---

### 📚 Learn More

🔗 Official ntfy.sh documentation: [https://ntfy.sh](https://ntfy.sh)
📌 Header options: priority, tags, icon, click action, attachments & more
