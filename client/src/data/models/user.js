//A Backbone model for the user who is logged in
var UserModel = Backbone.Model.extend({
  defaults: {
    email: null,
    id: 0,
    password: null,
    oath: null,
    display_name: "Anonymous" + Math.floor(Math.random() * 1000),
    icon: null,
    location: null,
    playlists: new PlaylistsCollection(),
    current_playlist_id: null,
    current_playlist: null,
    created_at: null,
    updated_at: null
  },
  retrievePlaylists: function () {
    var source = 'http://' + document.domain + ':3000/api/users/' + this.get('id') + '/playlists';
    var playlistsCollection =  new PlaylistsCollection();
    var context = this;
    $.get(source, function (res) {
      res.forEach(function (jsonPlaylist) {
        var playlist = new PlaylistModel();
        for (var key in jsonPlaylist) {
          if (key === 'medias') {
            var medias = new MediasCollection(jsonPlaylist.medias);
            playlist.set('medias', medias);
          } else {
            playlist.set(key, jsonPlaylist[key]);
          }
        }
        playlistsCollection.add(playlist);
      });
    }).done(function () {
      context.set('playlists', playlistsCollection);
      var curPlaylistInd = context.get('current_playlist_id');
      if (curPlaylistInd !== 0) {
        context.set('current_playlist', playlistsCollection.get(curPlaylistInd));
      } else {
        context.set('current_playlist', new PlaylistModel());
      }
    }).fail(function () {
      console.log('GET request to ' + source + ' failed.');
    });
  },
  savePlaylist: function () {

  },

});