import React from 'react'
import { connect } from 'react-redux'
import bgImage from '../bgImages/bg_home_1.jpg';
import JoinUs from './JoinUs';
import moment from 'moment';
import "babel-polyfill";
import { Modal, Button, Row } from 'react-bootstrap';
import waiting_img from '../images/canoe_3.jpg';
import flyer from '../images/taz2020flyer.png';

const thisYear = (new Date()).getFullYear();    
const start = new Date("1/1/" + thisYear);
const beginningOfThisYear = moment(start.valueOf()).toISOString();
const ls = require('local-storage');

class Home extends React.Component {
  constructor(){
    super();
    this.state = {
      show:true,
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

  handleClose = () => {this.setState({show: false}); };
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

      <Modal show={this.state.show} onHide={this.handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center">

        <div className="card" style={{width: "50vw"}}>
          <img className="card-img-top" src={bgImage}/>
          <div className="card-body" style={{background:"#FF8800"}}>
            <h5 className="card-title">Covid-19</h5>
            <p className="card-text">We are now accepting new memberships!  We are offering OC6 practices for fully vaccinated paddlers and OC1 practices for non-vaccinated paddlers. All paddlers will continue with masks mandates any time not on the water as they are required by the city of Tempe.  Contact TAZ for more information.</p>
            <p className="card-text"><small className="text-muted">Last updated April 2021</small></p>
          </div>
        </div>  

        </Modal.Body>
      </Modal>
      </React.Fragment>
    )
  }
}

export default connect()(Home);