import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ReactSession } from 'react-client-session';
import Projects from './Projects';
import Profile from './Profile';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Test from './Test';

class App extends React.Component {
  render () {
    ReactSession.setStoreType("localStorage");

    return(
      <BrowserRouter>
        <div>
            <Switch>
                {/*Test routes*/}
                <Route exact path="/" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/projects" component={Projects} />
                <Route exact path="/profile" component={Profile} />
                 
                {/*Real routes*/} 
                {/*<Route exact path="/" component={Login} />*/}
                {/*<Route exact path="/projects" component={Projects} />*/}
                {/*<Route exact path="/profile" component={Profile} />*/}
            </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
