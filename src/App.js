import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    text: '',
    error: '',
    results: [],
    search: false,
    loading: false,
    emptyResult: false
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
        results: [],
        search: true,
        loading: false,
        emptyResult: false
      });
      this.search();
    }
  };

  fetchDataFake = async text => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          response: {
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
          },
          searchTerm: text
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
    // let results = await this.fetchDataFake(text);
    if (!this.state.loading || this.state.text !== results.searchTerm) return;
    this.setState({ loading: false });
    if (!results.response.query.search.length) {
      this.setState({
        emptyResult: true
      });
      return;
    }
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
      loading: false,
      emptyResult: false
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

  showEmptyMessage = () => {
    let { emptyResult } = this.state;
    if (!emptyResult) return null;
    return (
      <div className="error-container align-center">
        <p>No result found for your search term.</p>
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
              <p>{this.fixText(result.snippet)}</p>
            </div>
          </div>
        </a>
      );
    });
    return <div className="results-container">{list}</div>;
  };

  fixText = text => {
    return String(text)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/(<([^>]+)>)/gi, '');
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
        {this.showError()}
        {this.showResults()}
        {this.showloading()}
        {this.showEmptyMessage()}
      </div>
    );
  }
}

export default App;
