import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import bgImage from '../bgImages/bg_home.jpg';
import {Modal, Button} from 'react-bootstrap';
import EmailUs from './EmailUs';
import JoinUs from './JoinUs';
import moment from 'moment';
import "babel-polyfill";
import { setNewsArticles } from '../store/store';

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
    await axios.get(`http://tazocc.com/wp-json/wp/v2/posts?after=${beginningOfThisYear}`)   
      .then(res => {
        const newNews = res.data;
        this.setState({ showSpinner:false});

        // get locally stored articles
        const localStorageArray = ls('news') ? ls('news') : [];
        let newArticless= [];
        
        // if there were no previous articles, locally store all the articles that were returned from the axios call
        if (localStorageArray.length<=0){
          newArticless = [...newNews];
          console.log("loading all news for the first time");
        } else {
          // else filter OUT all old articles from the new ones
          newArticless = newNews.filter((article)=>(
            !localStorageArray.find(ls => ls.id=== article.id)
          ))
        }
        // if there are any new articles to add, add them to local storage and the store
        if (newArticless.length>0) {
          ls.set('news', [...localStorageArray, ...newArticless]);        
          this.props.dispatch(setNewsArticles([...localStorageArray, ...newArticless]))  
        } else { // else just add locally read articles ids to the store
          this.props.dispatch(setNewsArticles([...localStorageArray]))  
        }
      })
  }

  handleClose = () => {this.setState({show: false})};
  handleShow = () => {this.setState({show: true})};
  
  render(){
    return(
      <React.Fragment>
      <div className="container-fluid homepage">
        <div className="offset-1 title">Team Arizona</div>
        <div className="text-wrapper offset-1 animated-words display-3 sub-title mt-4f">
            <span>Outrigger Canoe Club</span>
            <span>Ohana</span>
            <span>Outrigger Voyagers</span>
            <span>Outrigger Racers</span>
            <span>Lives Aloha</span>
        </div>    
        <img src={bgImage} className="fullsize-bg-image"></img>
        <div className="homepageButtons">
          <Button className="join" href="#joinUs">join us</Button>
          <Button variant="primary" onClick={this.handleShow} className="join">
            Contact TAZ
          </Button>
        </div>
  
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Contact TAZ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EmailUs />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>      
      </div>
      <div><JoinUs/></div>
      </React.Fragment>
    )
  }
}

export default connect()(Home);