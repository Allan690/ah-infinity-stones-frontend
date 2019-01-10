import React, { Component } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import store from './redux/store';
import Articles from './components/Articles/Articles';


class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <div className="App">
            <Articles />
          </div>
      </Provider>
      
    );
  }
}

export default App;
