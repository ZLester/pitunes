var React = require('react');
var Router = require('react-router');
var LandingPageContainer = require('../landingPage/landingPageContainer.js');
var RoomsView = require('../rooms/roomsContainer.js');
var AppContainer = require('../global/loginController.jsx');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var AppModel = require('../data/models/app.js');
var app = new AppModel();

var AppRouter = React.createClass({
  render: function() {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

var RouteNotFound = React.createClass({
  render: function () {
    return (
      <div>
        Not Found
      </div>
    );
  }
});

var LandingWrapper = React.createClass({
  render: function() {
    return ( <LandingPageContainer app={app} /> );
  }
});

var RoomsViewWrapper = React.createClass({
  render: function() {
    return ( <RoomsView app={app} /> );
  }
});

var RoomWrapper = React.createClass({
  render: function() {
    return ( <AppContainer app={app} room_id={this.props.params.room_id}/> );
  }
});

var routes = (
  <Route name='root' path="/" handler={AppRouter}>
    <DefaultRoute name='default' handler={LandingWrapper} />
     <Route name='rooms' path='rooms' handler={RoomsViewWrapper} />
    <Route name='room' path='room/:room_id' handler={RoomWrapper} />
    <NotFoundRoute name='notfound' handler={RouteNotFound} />
  </Route>
);
Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementsByClassName('AppContainer')[0]);
});