import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    text: '',
    error: '',
    results: [],
    search: false,
    loading: false
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
        let json = await response.json();
        return { response: json, searchTerm: text };
      } else {
        throw new Error('Something went wrong.');
      }
    } catch (e) {
      return { ok: false, error: e };
    }
  };

  search = async () => {
    let { text } = this.state;
    this.setState({ loading: true });
    let results = await this.fetchData(text);
    if (!this.state.loading || this.state.text !== results.searchTerm) return;
    console.log(results);
    this.setState({ loading: false });
    if (results.error) {
      this.setState({ error: 'Something went wrong.' });
      return;
    }
    this.setState({
      results: results.response.query.search
    });
  };

  reset = () => {
    this.setState({
      text: '',
      error: '',
      results: [],
      search: false,
      loading: false
    });
  };

  showloading = () => {
    let { loading } = this.state;
    if (!loading) return null;
    return (
      <div className="spinner">
        <div className="cube1" />
        <div className="cube2" />
      </div>
    );
  };

  showError = () => {
    let { error } = this.state;
    if (error === '') return null;
    return (
      <div className="error-container">
        <span className="error-sign">!</span>
        <p>{error}</p>
      </div>
    );
  };

  showResults = () => {
    let { results } = this.state;
    if (!results.length) return null;
    let list = results.map((result, index) => {
      return (
        <a
          key={index}
          target="_blank"
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
            result.title
          )}`}
        >
          <div className="single-result">
            <div>
              <h4 className="title">{result.title}</h4>
              <p>{result.snippet}</p>
            </div>
          </div>
        </a>
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
        {this.showloading()}
        {this.showError()}
      </div>
    );
  }
}

export default App;
