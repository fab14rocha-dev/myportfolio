# Firestore — Real-Time Data (onSnapshot)

## What it is
Firestore is Firebase's database. `onSnapshot` is a special listener that updates your app automatically whenever the data in the database changes — no page refresh needed.

## What I learned
This is what makes the app feel live. Instead of asking "give me the data once", you're saying "keep watching this and tell me every time it changes". Great for things like player progress that needs to stay in sync.

## Example
```js
const userRef = doc(db, 'users', userId);

onSnapshot(userRef, (snapshot) => {
  const data = snapshot.data();
  // runs every time this user's data changes in the database
  renderPlayerStats(data);
});
```

## Source
IRL-Quests project — js/game.js
