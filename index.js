'use strict';

var afterAll = require('after-all');

module.exports = function (db) {
  return new Childish(db);
};

var Childish = function (db) {
  this._db = db;
};

Childish.prototype.ok = function (key, callback) {
  this._db.get('1/'+key, function (err, val) {
    if (!err) callback(null, true);
    else if (err.name === 'NotFoundError') callback(null, false);
    else callback(err);
  });
};

Childish.prototype.put = function (key, callback) {
  var next = afterAll(callback);
  var parts = key.split('/');
  this._db.put('1/'+key, parts[1], next());
  this._db.put('2/'+reverse(key), parts[0], next());
};

Childish.prototype.del = function (key, callback) {
  var next = afterAll(callback);
  this._db.del('1/'+key, next());
  this._db.del('2/'+reverse(key), next());
};

Childish.prototype._streamIndex = function (index, key) {
  key = index+'/'+key+'/';
  return this._db.createValueStream({ gte: key, lte: key+'\xFF' });
};

Childish.prototype.children = function (parent) {
  return this._streamIndex(1, parent);
};

Childish.prototype.parents = function (child) {
  return this._streamIndex(2, child);
};

var reverse = function (key) {
  return key.split('/').reverse('/').join('/');
};
