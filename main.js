    import { fromEvent, Subject } from 'rxjs';
    import { switchMap, map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
    import React from 'react';
    import ReactDOM from 'react-dom';

    class AutoCompleteComponent extends React.Component {
        constructor(props) {
          super(props);
          this.cachedResults = {};
          this.subject = new Subject();
          this.cachedWikipediaSearch = this.cachedWikipediaSearch.bind(this);
          this.searchWikipedia = this.searchWikipedia.bind(this);

          this.subject.pipe(
            map((e) => e),
            filter(f => f.length < 3)
            ).subscribe(c =>
            document.getElementById('results').innerHTML = ''
          );
          this.subject.pipe(
            debounceTime(500),
            map((e) => e),
            filter(f => f.length >= 3),
            //distinctUntilChanged(),
            //switchMap(searchWikipedia),
            switchMap(this.cachedWikipediaSearch),
          ).subscribe( c => 
            document.getElementById('results').innerHTML = 
            c[1].map((v,i) => '<a class="result" target="_blank" href="' + c[3][i] + '">' + v + '</a>').join('')
          );
          this.state = {
            input: '',
          };
          
        }

        handleChange(event) {
          this.subject.next(event.target.value);
          //const value = event.target.value;
          //this.setState({
          //  input: value
          //});
        };
        searchWikipedia(term) {
          return $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
              action: 'opensearch',
              format: 'json',
              search: term
            }
          }).promise();
        }
        
        cachedWikipediaSearch(term) {
          let cachedResult = this.cachedResults[term];
  
          if (!cachedResult) {
              let result = this.searchWikipedia(term);
              this.cachedResults[term] = result;
              return result;
          }
          else {
              return Promise.resolve(cachedResult);
          }
        }
        render() {
          return (
            <div>
              <input  type="text" 
                      id="search-wikipedia-input" 
                      onChange={this.handleChange.bind(this)}>
              </input>
              <div id="results"></div>
            </div>
          );
        }
      }

    ReactDOM.render(<AutoCompleteComponent />, document.getElementById('root'));

    /*
      - Search Wikipedia using the input value
      - Should search without having to click a submit button, in other words without any extra user interaction,
        other than typing
      - Debounce user input for 500 ms
      - Search when input value's length is at least 3 chars
      - Make sure not to show any old results if search changed
      - Don't not send duplicate search requests
      - Bonus clear previous results when input's length < 3
      You have searchWikipedia function available (searchTerm -> Promise)
    */