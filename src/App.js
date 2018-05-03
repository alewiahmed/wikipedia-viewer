import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    text: '',
    results: [],
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

  fetchDataFake = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          batchcomplete: '',
          query: {
            searchinfo: {
              totalhits: 2,
              suggestion: 'alawi',
              suggestionsnippet: '<em>alawi</em>'
            },
            search: [
              {
                ns: 0,
                title: 'Alawi (disambiguation)',
                pageid: 27755921,
                size: 1478,
                wordcount: 189,
                snippet:
                  'Alawi (Arabic: علوي‎), also <span class="searchmatch">Alewi</span>, Alevi, Alavi, Alawid, or Alawite (French: Alaouite), means &quot;of or related to Ali&quot;, the Prophet Muhammad\'s nephew. It',
                timestamp: '2018-02-17T08:43:55Z'
              },
              {
                ns: 0,
                title: '27 May 2013 Baghdad bombings',
                pageid: 39524639,
                size: 11225,
                wordcount: 1092,
                snippet:
                  'in Abu Saida and Zab injured two civilians and a Sahwa member.   Kareem <span class="searchmatch">Alewi</span>, a member of the Iraqi Parliament representing the National Iraqi Alliance',
                timestamp: '2017-06-30T13:01:49Z'
              }
            ]
          }
        });
      }, 3000);
    });
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
    let results = await this.fetchDataFake();
    // let results = await this.fetchData(text);
    console.log(results);
    this.setState({
      results: results.query.search
    });
  };

  reset = () => {
    this.setState({ search: false, results: [], text: '' });
  };

  showResults = () => {
    let { results } = this.state;
    if (!results.length) return null;
    let list = results.map((result, index) => {
      return (
        <div className="single-result" key={index}>
          <div>
            <h4 className="title">{result.title}</h4>
            <p>{result.snippet}</p>
          </div>
        </div>
      );
    });
    return <div className="results-container">{list}</div>;
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
        {this.showResults()}
      </div>
    );
  }
}

export default App;
