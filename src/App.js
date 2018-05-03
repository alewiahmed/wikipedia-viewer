import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    text: '',
    result: [],
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
      this.search();
    }
  };

  fetchData = async text => {
    const URL = `http://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&prop=extracts&srsearch=${text}`;
    try {
      const fetchResult = fetch(URL);
      const response = await fetchResult;
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Something went wrong.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  search = async () => {
    let { text } = this.state;
    let result = await this.fetchData(text);
    this.setState({
      result: result.query.search
    });
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
