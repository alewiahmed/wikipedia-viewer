import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    text: '',
    search: false
  };

  inputChanged = e => {
    this.setState({
      text: e.target.value
    });
  };

  submit = e => {
    let { text } = this.state;
    e.preventDefault();
    if (text !== '') {
      this.setState({
        search: true
      });
    }
  };

  reset = () => {
    this.setState({ search: false });
  };
  render() {
    let { search } = this.state;
    let appClass = search ? ' justify-to-top' : '';
    return (
      <div className={'App' + appClass}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://en.wikipedia.org/wiki/Special:Random"
        >
          Click here for a random article
        </a>
        <div className="form-container">
          <form
            className="inputbox"
            onReset={this.reset}
            onSubmit={this.submit}
            onChange={this.inputChanged}
          >
            <input required="required" />
            <button className="del" type="reset" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
