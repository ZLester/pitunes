var YOUTUBE_API_KEY = 'AIzaSyA_ZnEUUw8uGbEdGfBXH296QX-1nnyeJnQ';

var app = new AppModel();

var AppContainer = React.createClass({
  render: function () {
    var style = {
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none'
    };

    return (
      <div style={style}>
        <LeftContainer model={app.get('user')}/>
        <CenterContainer />
        <RightContainer />
      </div>
    );
  }
});