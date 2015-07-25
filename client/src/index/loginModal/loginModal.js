var Input = ReactBootstrap.Input;

var Login = React.createClass({
  getInitialState: function () {
    return {showModal: true, errorMessage: 'testing', showLogin: true, showSignUp: false};
  },
  componentDidMount: function () {

  },
  handleNewPlaylistAttempt: function () {
    if (user.id === 0) {
      this.setState({showModal: true});
    }
  },
  close: function () {
    this.setState({showModal: false});
  },
  open: function () {
    this.setState({showModal: true});
  },
  loginUser: function () {
    var form = document.getElementById('loginForm');
    var data = {email: form[0].value, password: form[1].value};
    var that = this;
    $.ajax({url: server_uri + '/api/users/login',
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function (res) {
        app.get('user').set({
          email: res.email,
          id: res.id,
          password: res.password,
          oath: res.oath,
          display_name: res.display_name,
          icon: res.icon,
          current_playlist_id: res.current_playlist_id,
          created_at: res.create_at,
          updated_at: res.updated_at
        });
        // var loggedUser = new UserModel({
        // });
        // app.set('user', loggedUser);
        app.get('user').retrievePlaylists();
        that.setState({showModal: false});
      },
      error: function (res) {
        that.setState({errorMessage: res.statusText + ": " + res.responseText });
      }
    });
  },
  signupUser: function () {
    var form = document.getElementById('signupForm');
    var data = {displayName: form[0].value, email: form[1].value, password: form[2].value};
    var that = this;
    $.ajax({url: server_uri + '/api/users/signup',
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function (res) {
        user = res;
        that.setState({showModal: false});
      },
      error: function (res) {
        that.setState({errorMessage: res.statusText + ": " + res.responseText });
      }
    });
  },
  signUpClick: function () {
    this.setState({showLogin: false});
    this.setState({showSignUp: true});
  },
  loginClick: function () {
    this.setState({showLogin: true});
    this.setState({showSignUp: false});
  },
  showLoginForm: function () {
    return (
      <div id="loginFormContainer">
        <form id='loginForm'>
          <Input type='email' label='Email Address' placeholder='Enter email' required />
          <Input type='password' label='Password' placeholder='Enter password' required />
        </form>
        <Button id="userLoginButton" onClick={this.loginUser}>Log In</Button>
        <Button onClick={this.close}>Cancel</Button>
        <Button onClick={this.signUpClick}>Sign Up</Button>
      </div>
    );
  },
  showSignUpForm: function () {
    return (
      <div>
        <form id='signupForm'>
          <Input type='text' label='Display Name' placeholder='Enter name' required />
          <Input type='email' label='Email Address' placeholder='Enter email' required />
          <Input type='password' label='Password' placeholder='Enter password' required />
          <Input type='password' label='Re-enter Password' placeholder='Re-enter password' required />
        </form>
        <Button onClick={this.signupUser}>Sign Up</Button>
        <Button onClick={this.close}>Cancel</Button>
        <Button onClick={this.loginClick}>Log In</Button>
      </div>
    );
  },
  render: function () {
    var buttonStyle = {
      backgroundColor: 'grey',
      marginTop: '8px'
    };
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome to piTunes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { this.state.showLogin ? this.showLoginForm() : null }
            { this.state.showSignUp ? this.showSignUpForm() : null }
          </Modal.Body>
          <Modal.Footer>
            <span>{this.state.errorMessage}</span>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

var LoginModal = React.createClass({
  render: function () {
    return (
      <Login />
    );
  }
});