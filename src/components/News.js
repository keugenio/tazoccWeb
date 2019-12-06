import React, { Children } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Spinner, Card, CardColumns, Button, Modal, Col } from 'react-bootstrap';
import fbToken from './keys/facebookToken';
import moment from 'moment';
import { addReadArticle } from '../store/store';
import NewIcon from './NewIcon';

const ls = require('local-storage');

class News extends React.Component {
  state = {
    loading:false,
    images:[],
    showModal:false,
    currNewsTitle:'',
    currNewsBody:''
  }

  handleClose = () => this.setState({showModal:false});
  handleShow = (i) => {
    const {news} = this.props;

    // udate the read articles in the store, open the modal and update the current state's title and body to the selected article
    this.props.dispatch(addReadArticle(news[i].id))
    this.setState({
      showModal:true, 
      currNewsTitle:news[i].title.rendered,
      currNewsBody:news[i].content.rendered
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
    const {news} = this.props;

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
      const CardImg = ({index, src}) => {
        if (index==0)
          return (
            <Card.Img variant="top" src={src}></Card.Img>
          )
        return null
      }

      return (
        <React.Fragment>
          <div><p className="text-center text-white pageTitle">News</p></div>
          <CardColumns className="100%">
          {news.map((article, i)=>{

              // show the new Icon only if the current article id is NOT in the readNewsArticles arrray
              return (
                <Card key={i} body={true}>
                    <CardImg src={this.state.images[0] ? this.state.images[0].full_picture : null} index={i} />
                    <Card.Title className="d-flex row">
                      <Col md="8" xs={12}>
                        {this.convertTitle(article.title.rendered)}
                      </Col>
                      <Col md="auto" xs={0} />
                      <Col md="auto" sm={1}>
                        <NewIcon id={article.id} className="ml-auto"/>
                      </Col>
                    </Card.Title>
                    <Card.Subtitle>
                      {moment(article.date).format('MMM YYYY')}
                    </Card.Subtitle>
                    <Card.Body dangerouslySetInnerHTML={{__html:article.excerpt.rendered}}></Card.Body>
                    <Button variant="primary" onClick={()=>this.handleShow(i)}>More</Button>
                </Card>
              )             
            }
                     
          )}
          </CardColumns>
          <Modal  show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{this.convertTitle(this.state.currNewsTitle)}</Modal.Title>
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
