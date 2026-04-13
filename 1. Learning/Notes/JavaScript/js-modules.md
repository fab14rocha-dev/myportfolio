# JS Modules (import / export)

## What it is
A way to split your JavaScript across multiple files and share code between them. Instead of one giant file, each file handles one job.

## What I learned
You use `import` to bring in code from another file, and `export` to make code available to other files. The browser needs `type="module"` on the script tag to allow this.

## Example
```js
// firebase-config.js — exporting
export const auth = ...;
export const db = ...;

// game.js — importing
import { auth, db } from './firebase-config.js';
```

## Source
IRL-Quests project — js/game.js, js/firebase-config.js
