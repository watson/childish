'use strict';

var test = require('tape');
var levelup = require('levelup');
var memdown = require('memdown');
var childish = require('./');

var dbi = 0;

test('should be able to check when a value isn\'t present', function (t) {
  var db = childish(levelup('/db'+dbi++, { db: memdown }));
  var key = 'p1/c1';
  db.ok(key, function (err, ok) {
    t.error(err);
    t.notOk(ok);
    t.end();
  });
});

test('should be able to store and check a key', function (t) {
  var db = childish(levelup('/db'+dbi++, { db: memdown }));
  var key = 'p1/c1';
  db.put(key, function (err) {
    t.error(err);
    db.ok(key, function (err, ok) {
      t.error(err);
      t.ok(ok);
      t.end();
    });
  });
});

test('should be able to delete a key', function (t) {
  var db = childish(levelup('/db'+dbi++, { db: memdown }));
  var key = 'p1/c1';
  db.put(key, function (err) {
    t.error(err);
    db.del(key, function (err) {
      t.error(err);
      db.ok(key, function (err, ok) {
        t.error(err);
        t.notOk(ok);
        t.end();
      });
    });
  });
});

test('should be able to stream a list of children', function (t) {
  var db = childish(levelup('/db'+dbi++, { db: memdown }));
  var key = 'p1/c1';
  db.put('p1/c1', function (err) {
    t.error(err);
    db.put('p1/c2', function (err) {
      t.error(err);
      db.put('p2/c3', function (err) {
        t.error(err);
        var nodes = [];
        db.children('p1')
          .on('data', nodes.push.bind(nodes))
          .on('end', function () {
            t.deepEqual(nodes, ['c1','c2']);
            t.end();
          });
      });
    });
  });
});

test('should be able to stream a list of parents', function (t) {
  var db = childish(levelup('/db'+dbi++, { db: memdown }));
  var key = 'p1/c1';
  db.put('p1/c1', function (err) {
    t.error(err);
    db.put('p1/c2', function (err) {
      t.error(err);
      db.put('p2/c1', function (err) {
        t.error(err);
        var nodes = [];
        db.parents('c1')
          .on('data', nodes.push.bind(nodes))
          .on('end', function () {
            t.deepEqual(nodes, ['p1','p2']);
            t.end();
          });
      });
    });
  });
});
