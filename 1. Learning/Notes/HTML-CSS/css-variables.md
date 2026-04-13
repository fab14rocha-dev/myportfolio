# CSS Variables (Custom Properties)

## What it is
A way to store values (like colors or sizes) in one place and reuse them across your whole stylesheet. Change it once, updates everywhere.

## What I learned
You define variables inside `:root {}` at the top of your CSS using `--name: value`. Then use them anywhere with `var(--name)`. Makes it much easier to keep a consistent design and change things later.

## Example
```css
:root {
  --gold:   #f59e0b;
  --bg:     #0a0a14;
  --text:   #e2e8f0;
}

body {
  background: var(--bg);
  color: var(--text);
}

h1 {
  color: var(--gold);
}
```

## Source
IRL-Quests project — index.html styles
