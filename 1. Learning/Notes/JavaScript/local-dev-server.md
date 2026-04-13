# Local Dev Server (Node.js)

## What it is
A small program that runs on your computer and acts like a web server, so you can open your HTML files in a browser the same way they'd work on the real internet.

## What I learned
You need this because browsers block certain features (like JS modules) when you just double-click an HTML file. Running a local server fixes that. Node.js can do this with just built-in tools — no extra installs needed.

## Example
```js
// server.js — the key part
const server = http.createServer((req, res) => {
  const filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url);
  // reads the file and sends it back to the browser
});

server.listen(8080);
// then open: http://localhost:8080
```

## Source
IRL-Quests project — server.js
