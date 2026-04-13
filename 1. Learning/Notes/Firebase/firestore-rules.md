# Firestore Security Rules

## What it is
Rules you write that control who can read or write data in your database. Without these, anyone could read or delete all your data.

## What I learned
Rules live in `firestore.rules` and get deployed to Firebase. The logic checks things like: is the user logged in? Is this their own document? Is this the admin email?

You always need to think about two things:
1. What data needs to be protected?
2. Who should be allowed to touch it?

## Example
```js
// Only the user themselves (or admin) can read their own document
match /users/{userId} {
  allow read: if request.auth != null &&
    (request.auth.uid == userId ||
     request.auth.token.email == 'admin@example.com');
}
```

## Source
IRL-Quests project — firestore.rules
