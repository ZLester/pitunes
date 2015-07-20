var db = require('../schema');
var Timer = require('./timer');
var _ = require('lodash');

var Users = require('../collections/users');

var Room = db.Model.extend({
  tableName: 'Rooms',
  hasTimestamps: true,

  initialize: function() {
    this.users = new Users(); //bookshelf Users collection
    this.djQueue = []; //array of bookshelf User models
    this.currentMedia = null; //bookshelf Media model
    this.mediaTimeElapsed = 0;  //seconds elapsed on currentMedia
    this.mediaTimer = null;  //Timer object
    this.sockets = null;
  },

  setSocket: function(socket) {
    this.sockets = socket;
  },

  playMedia: function() {
    if (this.mediaTimer) {
      this.mediaTimer.stop();
      this.mediaTimer = null;
    }

    if (this.djQueue[0] && this.djQueue[0].getCurrentPlaylist()) {
      var dj = this.djQueue[0];
      var playlist = dj.getCurrentPlaylist();
      this.currentMedia = playlist.getCurrentMedia();
      this.currentMedia.incrementPlayCount()
      .then(function(data) {
        console.log('incrementing media index');
        playlist.incrementCurrentMediaIndex();
      });

      console.log('play from current media: ',this.currentMedia.get('youtube_id'));

      this.sockets.in(this.get('id')).emit("media status", {
        videoId: this.currentMedia.get('youtube_id'),
        startSeconds:0,
        status:'start'
      });
      var onFire = function(elapsedTime){
        this.sockets.in(this.get('id')).emit("media status", {
          videoId: this.currentMedia.get('youtube_id'),
          startSeconds:elapsedTime,
          status:'update'
        });
      };
      var onComplete = function(){
        this.sockets.in(this.get('id')).emit("media status", {
          videoId: '',
          startSeconds:0,
          status:'stop'
        });
        this.dequeueDJ();
        this.playMedia();
      };
      var timerIncrement = 3000;
      var mediaDuration = 3 * 60; //seconds XXX replace this with media duration (YOUTUBE?)
      this.mediaTimer = new Timer(onFire.bind(this),onComplete.bind(this),timerIncrement, mediaDuration);
      this.mediaTimer.start();
    } else {
      console.log('stop media for no DJ');

      console.log('dj: ', this.djQueue[0]);

      this.sockets.in(this.get('id')).emit("media status", {
        videoId: '',
        startSeconds:0,
        status:'stop'
      });
    }
  },

  toJSON: function() {
    return _.extend((new db.Model()).toJSON.call(this), {
      users: this.users && this.users.toJSON(),
      djQueue: this.djQueue.length && this.djQueue.map(function(user) {user.toJSON();}),
      currentMedia: this.currentMedia && this.currentMedia.makeJSON(),
      mediaTimeElapsed: this.mediaTimeElapsed
    },this);
  },

  enqueueDJ: function(user_id, sockets) {
    this.sockets = sockets;
    var user = this.users.get(user_id);
    this.djQueue.push(user);
    if (this.djQueue.length === 1) {
      this.playMedia();
    }
  },

  dequeueDJ: function() {
    this.djQueue.push(this.djQueue.shift());
  },

  removeDJFromQueue: function(user_id) {
    var popDJ;
    var queueIndex;

    for (var i = 0; i < this.djQueue.length; i++) {
      var dj = this.djQueue[i];
      if (user_id === dj.get('id')) {
        popDJ = dj;
        queueIndex = i;
        break;
      }
    }

    if (queueIndex !== undefined) {
      this.djQueue.splice(queueIndex,1);
    }
    console.log('removed DJ index: ', queueIndex);

    if (queueIndex === 0) {
      this.playMedia();
    }

    return popDJ;
  },

  addUser: function(user) {
    console.log('user to add: ', user.cid);
    this.users.add(user);
  },

  removeUser: function(user_id) {
    var popUser = this.users.get(user_id);
    this.users.remove(popUser);
    return popUser;
  },

  getUser: function(user_id) {
    return this.users.get(user_id);
  }
});

module.exports = Room;
