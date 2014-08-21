# Childish

Childish is an opinionated
[LevelUP](https://github.com/rvagg/node-levelup) abstraction that stores
and operate on keys in the form of `parent/child`.

Besides giving you a way to store and delete these keys, you can query
for the existence of a key using `.ok(key)` get a list of all children
of a given parent using `.children(parent)` or a list of all parents
using `.parents(child)`.

Notice that there are no values associated with the keys. This is just a
database for storing parent-child relationships using a hierarchical key
structure.

You can use any [LevelDOWN](https://github.com/rvagg/node-leveldown/)
compatible datastore you like as your backend. Here are a few popular
once:

- [LevelDOWN](https://github.com/rvagg/node-leveldown/) - Doh!
- [MemDOWN](https://github.com/rvagg/memdown/) - A drop-in replacement
  for LevelDOWN that works in memory only
- [MongoDOWN](https://github.com/watson/mongodown) - MongoDB backend for
  LevelUP
- [SQLDown](https://github.com/calvinmetcalf/SQLdown) - sql backend for levelup
- [mysqlDOWN](https://github.com/kesla/mysqldown) - An drop-in
  replacement for LevelDOWN that works in mysql

[![Build Status](https://travis-ci.org/watson/childish.png)](https://travis-ci.org/watson/childish)

## Installation

```
npm install childish
```

## Example

```javascript
var levelup = require('level');
var db = require('childish')(levelup('/tmp/my-db'));

db.put('admin/odin', function (err) {
  db.put('moderator/odin', function (err) {
    db.put('moderator/thor', function (err) {
      db.ok('admin/odin', function (err, ok) {
        if (ok) console.log('Odin is an admin');
      });

      console.log('The follwoing users are admins:');
      db.children('admin').pipe(console.log);

      console.log('Odin have the following permissions:');
      db.parents('odin').pipe(console.log);
    });
  });
});
```

## API

- `db.put(key, callback)` - Register a key (key format: `parent/child`)
- `db.ok(key, callback)` - Check if a key exists (key format: `parent/child`)
- `db.del(key, callback)` - Remove a key (key format: `parent/child`)
- `db.children(parent)` - Get a stream of all children for `parent`
- `db.parents(child)` - Get a stream of all parents for `child`

## License

MIT
