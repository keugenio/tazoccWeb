import React from 'react'
import { connect } from 'react-redux'
import bgImage from '../bgImages/bg_home_1.jpg';
import {Button} from 'react-bootstrap';
import JoinUs from './JoinUs';
import moment from 'moment';
import "babel-polyfill";

const thisYear = (new Date()).getFullYear();    
const start = new Date("1/1/" + thisYear);
const beginningOfThisYear = moment(start.valueOf()).toISOString();
const ls = require('local-storage');

class Home extends React.Component {
  constructor(){
    super();
    this.state = {
      show:false,
      showSpinner: true
    }
  }
  async componentDidMount() {
    // get wordpress articles
    // await axios.get(`http://tazocc.com/wp-json/wp/v2/posts?after=${beginningOfThisYear}`)  
    // await fetch(`http://tazocc.com/wp-json/wp/v2/posts?per_page=10`)       
    //   .then(res => {
    //     const newNews = res.data;
    //     this.setState({ showSpinner:false});

    //     // get locally stored articles
    //     const localStorageArray = ls('news') ? ls('news') : [];
    //     let newArticless= [];
        
    //     // if there were no previous articles, locally store all the articles that were returned from the axios call
    //     if (localStorageArray.length<=0){
    //       newArticless = [...newNews];
    //       console.log("loading all news for the first time");
    //     } else {
    //       // else filter OUT all old articles from the new ones
    //       newArticless = newNews.filter((article)=>(
    //         !localStorageArray.find(ls => ls.id=== article.id)
    //       ))
    //     }
    //     // if there are any new articles to add, add them to local storage and the store
    //     if (newArticless.length>0) {
    //       ls.set('news', [...localStorageArray, ...newArticless]);        
    //       this.props.dispatch(setNewsArticles([...localStorageArray, ...newArticless]))  
    //     } else { // else just add locally read articles ids to the store
    //       this.props.dispatch(setNewsArticles([...localStorageArray]))  
    //     }

    //   })
  }

  handleClose = () => {this.setState({show: false})};
  handleShow = () => {this.setState({show: true})};
  
  render(){
    return(
      <React.Fragment>
      <div className="container-fluid homepage">
        <div className="offset-lg-1 offset-sm-0 title">Team Arizona</div>
        <div className="text-wrapper offset-1 animated-words display-3 sub-title">
            <span> Outrigger Canoe Club</span>
            <span> Ohana</span>
            <span> Outrigger Voyagers</span>
            <span> Outrigger Racers</span>
            <span>Lives Aloha</span>
        </div>    
        <img src={bgImage} className="fullsize-bg-image"></img>
        <div className="homepageButtons">
          <Button className="join" href="#joinUs">join us</Button>
        </div>
      </div>
      <div><JoinUs/></div>
      </React.Fragment>
    )
  }
}

export default connect()(Home);