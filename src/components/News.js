import React, { Children } from 'react';
import axios from 'axios';
import { Spinner, Card, CardColumns, Button, Modal } from 'react-bootstrap';
import fbToken from './keys/facebookToken';

class News extends React.Component {
  state = {
    news:[],
    loading:true,
    images:[],
    showModal:false,
    currNewsTitle:'',
    currNewsBody:''
  }
  
  handleClose = () => this.setState({showModal:false});
  handleShow = (i) => {
    
    this.setState({
      showModal:true, 
      currNewsTitle:this.state.news[i].title.rendered,
      currNewsBody:this.state.news[i].content.rendered
    })
  }
    

  convertTitle = (title) => {
    let converted = title.replace("&#8211;", " - ");
    converted = converted.replace("&#8212;", " - ")
    converted = converted.replace("&#8220;", "'")
      return converted
  }

  componentDidMount() {
    // const appSecret = 'c82fa05a69e01ca1a109e252f0f580bb';
    // const appID = '315403461893554';
    // const shortToken = 'EAAEe25dOnbIBAENjbMAdmMyS193aZCsZBiLzKfDZBsWqng9ZAqdJc7MFU8YFtZCg9oYDPUokAy1MRuO8e68OnPNQHWCtPoEKUYcZAjoZBHBdWZAYVHiB3tDjoawt4Vl6rDnGKkQ65BChyIdeCGLZCQ0fZCea1nMaoNopWxY37IZBsoRyQy3lb24yXkXHZCUKvoHuuz4ED6wCOvZBHVFpDiDS6H6YUxdo9GUiE0NoZD';
    const permanentToken=fbToken.key;

    // axios.get(`https://graph.facebook.com/v2.10/oauth/access_token?grant_type=fb_exchange_token&client_id=${appID}&client_secret=${appSecret}&fb_exchange_token=${shortToken}'`)
    //   .then ( res => {
    //     const longlived = res.data.access_token;

    //     axios.get (`https://graph.facebook.com/v2.10/582285329/accounts?access_token=${longlived}`)
    //       .then (res => {
    //         console.log('res', res.data.data[0].access_token);
            
    //       })
    //   })
    axios.get(`http://tazocc.com/wp-json/wp/v2/posts`)
      .then(res => {
        const news = res.data;
        this.setState({ news, loading:false});
      })

    axios.get(`http://graph.facebook.com/tazocc?fields=posts{full_picture}&access_token=${permanentToken}`)
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
    const cardBody = document.createElement('div');

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
          {this.state.news.map((article, i)=>{
            if (i===0) {
              return (
                <Card key={i} body={true}>
                    <Card.Img variant="top" src={this.state.images[Math.floor(Math.random() * this.state.images.length) ].full_picture}></Card.Img>
                    <Card.Title>{this.convertTitle(article.title.rendered)}</Card.Title>
                    <Card.Body dangerouslySetInnerHTML={{__html:article.excerpt.rendered}}></Card.Body>
                    <Button variant="primary" onClick={()=>this.handleShow(i)}>More</Button>
                </Card>                
              )
            } else {
              return (
                <Card key={i} body={true}>
                    <Card.Title>{this.convertTitle(article.title.rendered)}</Card.Title>
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

export { News as default }

const fullScreenStyle = {
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  height:'100vh',
  width:'100vw'
}
