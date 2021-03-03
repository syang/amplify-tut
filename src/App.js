import logo from './logo.svg';
import './App.css';
// import { useAuth0 } from '@auth0/auth0-react';
import Amplify, { Auth, Storage, Hub } from 'aws-amplify';
import React from 'react';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <StorageTest></StorageTest>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

class StorageTest extends React.Component {

  async upload() {
    var cred = await Auth.currentCredentials();

    console.log("Identity ID = " + cred.identityId);
    console.log(cred);

    const result = await Storage.put('test.txt', 'Protected Content', {
      level: 'protected',
      contentType: 'text/plain'
    });
  }
  state = { user: null, customState: null };

  componentDidMount() {

    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          this.upload()
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });


    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }
  // myfunction() {
  //   Auth.federatedSignIn(
  //     "moonlight-tutoring.us.auth0.com", // The Auth0 Domain,
  //     {
  //         token: idToken, // The id token from Auth0
  //         // expires_at means the timestamp when the token provided expires,
  //         // here we can derive it from the expiresIn parameter provided,
  //         // then convert its unit from second to millisecond, and add the current timestamp
  //         expires_at: exp * 1000 // the expiration timestamp
  //     },
  //     { 
  //         // the user object, you can put whatever property you get from the Auth0
  //         // for example:
  //         name, // the user name
  //         email, // Optional, the email address
  //         phoneNumber, // Optional, the phone number
  //     } 
  //   ).then(cred => {
  //       console.log(cred);
  //   });
  // }
  // <button onClick={() => this.myfunction()}>myspecial button</button> -->

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <button onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}>Open Facebook</button>
        <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Open Google</button>
        <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
        <button onClick={() => Auth.signOut()}>Sign Out </button>
      </div>
    );
  }
}

export default App;
