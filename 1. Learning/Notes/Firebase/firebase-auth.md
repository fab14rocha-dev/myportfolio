# Firebase Auth

## What it is
A free service from Google that handles user login for you — no need to build your own login system. Supports email/password, Google login, and more.

## What I learned
`onAuthStateChanged` is the key function. It watches for login/logout and runs your code whenever the user's state changes. Always use this instead of checking auth once — the user's session can change at any time.

You can also check if the user verified their email with `user.emailVerified`, and send a verification email with `sendEmailVerification(user)`.

## Example
```js
onAuthStateChanged(auth, (user) => {
  if (user) {
    // user is logged in
    console.log(user.email);
  } else {
    // user is logged out — redirect to login
    window.location.href = 'login.html';
  }
});
```

## Source
IRL-Quests project — js/game.js, js/login.js
