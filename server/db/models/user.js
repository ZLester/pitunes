var db = require('../schema');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');

var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'Users',
  hasTimestamps: true,

  initialize: function(){
    this.on('creating', this.hashPassword);
  },

  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(err, isMatch);
    });
  },

  hashPassword: function(callback){
    var hashPromise = Promise.promisify(bcrypt.hash);
    return hashPromise(this.get('password'), 10).bind(this)
    .then(function(hash) {
      return this.set('password', hash);
    })
    .catch(function(err) {console.error('hashing error:', err);});
  },

  getCurrentPlaylist:Promise.promisify(function(callback) {
    this.retrieveCurrentPlaylist().then(function(playlist) {
      if (!playlist) return callback(new Error('playlist not found (get current playlist)'));
      callback(null, playlist);
    })
    .catch(function(err) {callback(err);});
  }),

  setCurrentPlaylist:Promise.promisify(function(playlist_ID, callback) {
    this.set('current_playlist_id', playlist_ID);
    this.save().then(function(playlist) {
      if (!playlist) return callback(new Error('playlist not found (set current playlist)'));
      callback(null, playlist);
    })
    .catch(function(err) {callback(err);});
  }),

  retrieveCurrentPlaylist: Promise.promisify(function(callback){
    var Playlist = require('./playlist');
    if (this.get('current_playlist_id') === 0) return callback(null, 0); //send back 0 which indicates no playlist but not an error
    new Playlist({
      id:this.get('current_playlist_id')
    }).fetch()
    .then(function(found) {
      if (!found) return callback(new Error('media playlist not found'));
      console.log('retrieved current playlist : ', found.get('id'));
      callback(null,found);
    })
    .catch(function(err) {callback(err);});
  }),

  //relationship
  playlists: function() {
    var Playlist = require('./playlist');
    return this.hasMany(Playlist, 'user_id');
  },

  retrieveAllPlaylists: function(callback) {
    this.playlists().fetch(
      { withRelated: ['medias'],
        required: true })
    .then( function(found) {
      if (!found) return callback(new Error('User playlists not found'));
      else {
        callback(null, found);
      }
    })
    .catch(function(err) {callback(err);});
  }
});

module.exports = User;
