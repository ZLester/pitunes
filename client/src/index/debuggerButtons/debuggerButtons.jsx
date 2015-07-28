var React = require('react');

var server_uri = 'http://' + document.domain + ':3000',
  socket = io(server_uri);

var app = require('../../roomComponents/loginController.jsx');

var DebuggerButtonSimVideoDesync = React.createClass({
  handleClick: function () { 
    setVideoTime(3);
  },
  render: function () {
    return (
      <button onClick={this.handleClick}>Sim Desync</button>
    );
  }
});

var DebuggerButtonJoinRoom = React.createClass({
  handleClick: function () {
    socket.emit('user room join', { user: app.get('user').attributes, room: 1 })
    app.get('current_room').set('id', 1);
  },
  render: function () {
    return (
      <button onClick={this.handleClick}>Join Room</button>
    );
  }
});

var DebuggerButtonLeaveRoom = React.createClass({
  handleClick: function () {
    socket.emit('user room leave', { user: app.get('user').attributes, room: 1 })
  },
  render: function () {
    return (
      <button onClick={this.handleClick}>Leave Room</button>
    );
  }
});

var DebuggerButtons = React.createClass({
  render: function() {
    var style = {
      right: '30%',
      top: '10%',
      height: '100%',
      position: 'absolute'
    };
    return (
        <div style={style}>
          <DebuggerButtonSimVideoDesync />
          <DebuggerButtonJoinRoom />
          <DebuggerButtonLeaveRoom />
        </div>
    );
  }
});

module.exports = DebuggerButtons;