import { createStore, combineReducers, bindActionCreators } from 'redux'
import uuid from 'uuid';
const ls=require('local-storage');

/********* Calendar Events Actions and Reducer ************* */
// Events actions
export const addCalendarEvent = ( { id=uuid(), title='', start=0, end=0 } ) => ({
  type: 'ADD_CALENDAR_EVENT',
  event:{
    id,
    title,
    start,
    end
  }
})

export const setCalendarEvents = (events) => ({
  type: 'SET_CALENDAR_EVENTS',
  events
})

//create a events reducer
const eventsReducerDefault = [];
const eventsReducer = (state = eventsReducerDefault, action) => {
  switch (action.type) {
    case 'ADD_CALENDAR_EVENT':            
      // spread the current state and add the event passed which will overwrite with new values
      return [...state, action.event]
    case 'SET_CALENDAR_EVENTS':
      return [...action.events]
    default:
      return state;
  }
}

/********* News Actions and Reducer ************* */
export const addNewsItem = ( { id=uuid(), content={}, excerpt={}, date=0 , title={} } ) => ({
  type: 'ADD_NEWS_ITEM',
  article:{
    id,
    content,
    excerpt,
    date, 
    title
  }
})

// create a news reducer
const newsReducerDefault = []
const newsReducer = (state = newsReducerDefault, action) => {
  switch (action.type) {
    case 'ADD_NEWS_ITEM':      
      return [...state, action.article]
    default:
      return state;
  }
}

/********* LocalStorage Actions and Reducer ************* */
// localStorage actions
export const setReadNews = (localNewsStorage) => ({
  type:'SET_READ_NEWS',
  localNewsStorage
})
export const addReadArticle = (articleID) => ({
  type:'ADD_READ_ARTICLE',
  articleID
})
export const resetReadArticles = () => ({
  type:'RESET_READ_ARTICLES'
})
// create a locaStorage reducer
const localNewsStorageReducer = (state = {localNewsStorage:[]}, action) => {
  switch (action.type) {
    case 'SET_READ_NEWS':
      // add all article IDs to local storage
      ls('readNews', action.localNewsStorage);
      return {localNewsStorage:action.localNewsStorage};
    case 'ADD_READ_ARTICLE':
      // "append" read articleID to localstorage. don't mutate
      ls('readNews', [...state.localNewsStorage, action.articleID]);
      return {localNewsStorage:[...state.localNewsStorage, action.articleID]};
    case 'RESET_READ_ARTICLES':
      ls('readNews', []);
      return {localNewsStorage:[]};
    default:
      return state;
  }
}

/********* create a store by combining reducers ********************** */
//create store by assigning expenses reducer to expenses property using combineReducer
const tazStore = createStore(
  combineReducers(
    { events:eventsReducer,
      news:newsReducer,
      localStorage:localNewsStorageReducer
    }
  ));
// const unsubscribe = store.subscribe (()=>{
//   console.log(store.getState())
// })

// store.dispatch(addCalendarEvent({start:23, title:'pepe title', start:123, end:456}))
// store.dispatch(addNewsItem({
//     date:132,
//     content:{rendered:'pepe content'},
//     excerpt:{rendered: 'pepe ...'},
//     title:{rendered: 'Pepe title'}
//   }
// ))
// store.dispatch(setReadNews([123,234,345,456]))
// store.dispatch(addReadArticle(567))
// store.dispatch(resetReadArticles())

export default () => {
  const tazStore = createStore(
    combineReducers(
      { events:eventsReducer,
        news:newsReducer,
        localStorage:localNewsStorageReducer
      }
    ));
    return tazStore
}

