import React, { Children } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Spinner, Card, CardColumns, Button, Modal } from 'react-bootstrap';
import fbToken from './keys/facebookToken';
import moment from 'moment';
import TAZStore, { setNewsArticles, addReadArticle, setReadNews } from '../store/store';
const thisYear = (new Date()).getFullYear();    
const start = new Date("1/1/" + thisYear);
const beginningOfThisYear = moment(start.valueOf()).toISOString();
const ls = require('local-storage');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class News extends React.Component {
  state = {
    loading:true,
    images:[],
    showModal:false,
    currNewsTitle:'',
    currNewsBody:''
  }

  handleClose = () => this.setState({showModal:false});
  handleShow = (i) => {
    const {news} = this.props;

    this.props.dispatch(addReadArticle(news[i].id))
    this.setState({
      showModal:true, 
      currNewsTitle:this.props.news[i].title.rendered,
      currNewsBody:this.props.news[i].content.rendered
    })
  }
    
  // parse the title and replace the iso numbers back to normal characters
  convertTitle = (title) => {
    let converted = title.replace("&#8211;", " - ");
    converted = converted.replace("&#8212;", " - ")
    converted = converted.replace("&#8220;", "'")
      return converted
  }

  async componentDidMount() {
    const permanentToken=fbToken.key;
    // set up the store with news articles from local storage to render quickly
    this.props.dispatch(setNewsArticles(ls('articles')))
    this.props.dispatch(setReadNews(ls('readNews')))

    // get wordpress articles
    await axios.get(`http://tazocc.com/wp-json/wp/v2/posts?after=${beginningOfThisYear}`)   
      .then(res => {
        const newNews = res.data;
        this.setState({ loading:false});

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
        }        
        
      })

    // get facebook pictures 
    await axios.get(`http://graph.facebook.com/tazocc?fields=posts{full_picture}&access_token=${permanentToken}`)
    .then(res => {      
      var filtered = [];
      for (var i = 0; i < res.data.posts.data.length; i++) {
          if (res.data.posts.data[i].full_picture!= null) {            
              filtered.push(res.data.posts.data[i]);
          }
      }
      this.setState({images:filtered})
    })
    
  }
  
  render(){
    //const cardBody = document.createElement('div');
    const {news, readNewsArticles} =  this.props;
    const NewIcon = ({id}) => {
      const show = !readNewsArticles.includes(id)
      if (show) 
        return (
          <div className="text-warning ml-auto">
            new
            <FontAwesomeIcon icon="star"/>
          </div>
        )
      return null
    }

    if (this.state.loading)
      return (
        <div className='container-fluid' style={fullScreenStyle}>          
          <Spinner animation="border" role="status" className='spinner' >
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    else {
      const cbody = ({children}) => (`<div>${this.state.news[0].excerpt.rendered}</div>`)
      return (
        <React.Fragment>
          <div><p className="text-center text-white pageTitle">News</p></div>
          <CardColumns className="100%"> 
          {news.map((article, i)=>{
            if (i===0) {
              return (
                <Card key={i} body={true}>
                    <Card.Img variant="top" src={this.state.images[0] ? this.state.images[0].full_picture : null}></Card.Img>
                    <Card.Title>{this.convertTitle(article.title.rendered)}</Card.Title>
                    <Card.Subtitle>{moment(article.date).format('MMM YYYY')} </Card.Subtitle>
                    <Card.Body dangerouslySetInnerHTML={{__html:article.excerpt.rendered}}></Card.Body>
                    <Button variant="primary" onClick={()=>this.handleShow(i)}>More</Button>
                </Card>                
              )
            } else {
              // show the new Icon only if the current article id is NOT in the readNewsArticles arrray
              return (
                <Card key={i} body={true}>
                    <Card.Title className="d-flex">
                      {this.convertTitle(article.title.rendered)}
                      <NewIcon id={article.id} className="ml-auto"/>
                    </Card.Title>
                    <Card.Subtitle>
                      {moment(article.date).format('MMM YYYY')}
                    </Card.Subtitle>
                    <Card.Body dangerouslySetInnerHTML={{__html:article.excerpt.rendered}}></Card.Body>
                    <Button variant="primary" onClick={()=>this.handleShow(i)}>More</Button>
                </Card>
              )             
            }
          }            
          )}
          </CardColumns>
          <Modal  show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{this.state.currNewsTitle}</Modal.Title>
              </Modal.Header>

              <Modal.Body dangerouslySetInnerHTML={{__html:this.state.currNewsBody}}>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary"  onClick={this.handleClose}>Close</Button>
              </Modal.Footer>
          </Modal>
        </React.Fragment>
      )
    }
  }
}


const MapStateToProps = ({news, readNewsArticles}) => ({
  news: news,
  readNewsArticles:readNewsArticles
})

export default connect(MapStateToProps)(News)

const fullScreenStyle = {
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  height:'100vh',
  width:'100vw'
}
