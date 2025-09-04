
import React, { Component } from 'react'
import { Newsitem } from './Newsitem'   // ✅ default export fixed
import Spinner from './Spinner';
import PropTypes from 'prop-types'
const YOUR_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

console.log( "api keey:", YOUR_API_KEY);


export class News extends Component {
  articles = [
    {
      "source": { "id": "espn-cric-info", "name": "ESPN Cric Info" },
      "author": null,
      "title": "PCB hands Umar Akmal three-year ban from all cricket | ESPNcricinfo.com",
      "description": "Penalty after the batsman pleaded guilty to not reporting corrupt approaches | ESPNcricinfo.com",
      "url": "http://www.espncricinfo.com/story/_/id/29103103/pcb-hands-umar-akmal-three-year-ban-all-cricket",
      "urlToImage": "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1099495_800x450.jpg",
      "publishedAt": "2020-04-27T11:41:47Z",
      "content": "Umar Akmal's troubled cricket career has hit its biggest roadblock yet..."
    },
    {
      "source": { "id": "espn-cric-info", "name": "ESPN Cric Info" },
      "author": null,
      "title": "What we learned from watching the 1992 World Cup final in full again | ESPNcricinfo.com",
      "description": "Wides, lbw calls, swing - plenty of things were different in white-ball cricket back then | ESPNcricinfo.com",
      "url": "http://www.espncricinfo.com/story/_/id/28970907/learned-watching-1992-world-cup-final-full-again",
      "urlToImage": "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1219926_1296x729.jpg",
      "publishedAt": "2020-03-30T15:26:05Z",
      "content": "Last week, we at ESPNcricinfo did something we have been thinking..."
    }
  ]
  static defaultProps = {
    country : 'in',
    pageSize : 20,
    category : 'general',
    
  }

  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string,
  }

  constructor() {
    super();
    console.log("Hello I am a constructor from News component");
    this.state = {
      articles: this.articles,
      loading: false,
      page: 1
    }
  }

  async componentDidMount() {
    
   
  let url = `https://newsapi.org/v2/everything?q=${this.props.country}&page=1&pageSize=${this.props.pageSize}&apiKey=${YOUR_API_KEY}`;
    this.setState({ loading: true });

    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false });
  }

  handlePrevClick = async () => {
    console.log("Previous");
    let url = `https://newsapi.org/v2/everything?q=${this.props.country}&page=${this.state.page - 1}&pageSize=${this.props.pageSize}&apiKey=${YOUR_API_KEY}`;
    this.setState({ loading: true });

    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      page: this.state.page - 1,
      articles: parsedData.articles,
      loading: false
    });
  }

  handleNextClick = async () => {
    console.log("Next");

    if (this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)) {
      // do nothing
    } else {
      let url = `https://newsapi.org/v2/everything?q=${this.props.country}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}&apiKey=${YOUR_API_KEY}`;
      this.setState({ loading: true });

      let data = await fetch(url);
      let parsedData = await data.json();

      this.setState({
        page: this.state.page + 1,
        articles: parsedData.articles,
        loading: false
      });
    }
  }

  render() {
    return (
      <div className="container my-3">
        {this.state.loading && <Spinner />}
        <div className="row">
          {!this.state.loading && this.state.articles && this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <Newsitem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  imageUrl={element.urlToImage}
                  url={element.url} author={element.author} date={element.publishedAt}
                />
              </div>
            )
          })}
        </div>

        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>
            &larr; Previous
          </button>
          <button
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
            type="button" className="btn btn-dark" onClick={this.handleNextClick}>
            Next &rarr;
          </button>
        </div>
      </div>
    )
  }
}

export default News;
