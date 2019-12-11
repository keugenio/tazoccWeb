import { createStore, combineReducers } from 'redux'
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
export const setNewsArticles = ( articles ) => ({
  type: 'SET_NEWS_ARTICLES',
  articles
})
// create a news reducer
const newsReducerDefault = ls('news') || []
const newsReducer = (state = newsReducerDefault, action) => {
  switch (action.type) {
    case 'SET_NEWS_ARTICLES':
      return [...action.articles];
    default:
      return state;
  }
}

/********* Read Articles Actions and Reducer ************* */
// read Articles actions
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
const readNewsDefault = (ls('readNews')? ls('readNews'): []);
// const amountUnreadDefault = ls('news').length-(ls('readNews')? ls('readNews').length:0);
const amountUnreadDefault = 0;
const readNewsArticlesReducer = (state = {readNews:readNewsDefault, amountUnread:amountUnreadDefault}, action) => {
  switch (action.type) {
    case 'SET_READ_NEWS':
      return {readNews:[...action.localNewsStorage], amountUnread:action.localNewsStorage.length}
    case 'ADD_READ_ARTICLE':
      // "append" read articleID to localstorage. don't mutate
      ls.set('readNews', [...state.readNews, action.articleID]);
      return {readNews:[...state.readNews, action.articleID], amountUnread: state.amountUnread-1};
    case 'RESET_READ_ARTICLES':
      ls('readNews', []);
      return {readNews:[], amountUnread:0};
    default:
      return state;
  }
}

/***  Authenticated User Actions and Reducer  ****/
export const setUserName = (userName) => ({
  type: 'SET_USER_NAME',
  userName
})
export const setUserID = (userID) => ({
  type:'SET_USER_ID',
  userID
})
export const setUserImage = (image) => ({
  type:'SET_USER_IMAGE',
  image
})
export const logUserOut = () => ({
  type: 'LOG_USER_OUT'
})
const authenticatedUserReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_NAME':
      return {...state, userName: action.userName}
    case 'SET_USER_ID':
      return {...state, userID:action.userID }
    case 'SET_USER_IMAGE':      
      return {...state, image:action.image}
    case 'LOG_USER_OUT':  
      return {}
    default:
      return state;
  }
}

/*******  All paddlers Action and Reducer ******/
export const setAllPaddlers = (allPaddlersArray) => ({
  type:'SET_PADDLERS',
  allPaddlersArray
})
export const addNewPaddler = (newPaddler) => ({
  type:'ADD_PADDLER',
  newPaddler
})
const allPaddlersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_PADDLERS':
      return [...action.allPaddlersArray]
      case 'ADD_PADDLER':
          return [...state, action.newPaddler]      
    default:
      return state;
  }
}

/*******  selected Paddler Action and Reducer ******/
export const setSelectedPaddler = (paddler) => ({
  type:'SET_SELECTED_PADDLER',
  paddler
})
const selectedPaddlerReducer = ( state = '', action ) => {
  switch (action.type) {
    case 'SET_SELECTED_PADDLER':
      return action.paddler;
    default:
      return state;
  }
}

/******* enable edit of selected Paddler  *******/
export const editSelectedPaddler = (editState) => ({
  type:'EDIT_SELECTED_PADDLER',
  editState
})
const selectedPaddlerEditableReducer = ( state=true, action ) => {
  switch (action.type) {
    case 'EDIT_SELECTED_PADDLER':
      return action.editState;
    default:
      return state;
  }
}
/********* create a store by combining reducers ********************** */
//create store by assigning expenses reducer to expenses property using combineReducer

export default () => {
  const tazStore = createStore(
    combineReducers(
      { user:authenticatedUserReducer,
        events: eventsReducer,
        news: newsReducer,
        readNewsArticles: readNewsArticlesReducer,
        selectedPaddler: selectedPaddlerReducer,
        paddlers: allPaddlersReducer,
        selectedPaddlerEditable: selectedPaddlerEditableReducer
      }
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return tazStore
}

