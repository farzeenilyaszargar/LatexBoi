import fs from "node:fs/promises";

const targets = await fetch("http://127.0.0.1:9222/json").then((r) => r.json());
const target = targets.find((item) => item.type === "page" && item.url.includes("localhost:3022"));
if (!target) throw new Error("Could not find the local Unleaf tab");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const resolve = pending.get(message.id);
    pending.delete(message.id);
    resolve(message);
  }
});

const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++nextId;
  pending.set(id, resolve);
  socket.send(JSON.stringify({ id, method, params }));
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result?.result?.value;
};
const capture = async (file) => {
  const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await fs.writeFile(file, Buffer.from(result.result.data, "base64"));
};

await send("Page.enable");
await send("Runtime.enable");
await sleep(1800);
await fs.mkdir("/tmp/unleaf-demo", { recursive: true });

const original = await evaluate("document.querySelector('textarea')?.value || ''");
await capture("/tmp/unleaf-demo/initial.png");

const inserted = "\n\n% Typed live during the Unleaf demo.\n\\textbf{Live edit:} Bananas make research breaks better.\n";
const edited = original.replace("\\section{Introduction}", `${inserted}\n\\section{Introduction}`);
const escaped = JSON.stringify(edited);
await evaluate(`(() => { const el = document.querySelector('textarea'); if (!el) return false; const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set; setter.call(el, ${escaped}); el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'demo' })); el.focus(); el.setSelectionRange(${edited.length}, ${edited.length}); el.scrollTop = 0; return true; })()`);
await sleep(1400);
await capture("/tmp/unleaf-demo/edited.png");

await evaluate(`(() => { const el = document.querySelector('textarea'); if (!el) return false; const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set; setter.call(el, ${JSON.stringify(original)}); el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'deleteContentBackward', data: null })); return true; })()`);
await sleep(1200);
await capture("/tmp/unleaf-demo/final.png");

socket.close();
