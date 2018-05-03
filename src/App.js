import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Special:Random"
          >
            Click here for a random article
          </a>
        </div>
        <div className="form-container">
          <form className="inputbox">
            <input required="required" />
            <button className="del" type="reset" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
