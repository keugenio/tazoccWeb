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
export const setAmountUnread = (amountUnread) => ({
  type:'SET_AMOUNT_UNREAD',
  amountUnread
})
export const addReadArticle = (articleID) => ({
  type:'ADD_READ_ARTICLE',
  articleID
})
export const resetReadArticles = () => ({
  type:'RESET_READ_ARTICLES'
})
export const setLoggedInUserReadNews = (readNewsArray) => ({
  type: 'SET_LOGGED_IN_USER_READ_NEWS',
  readNewsArray
})
// create a locaStorage reducer
const readNewsDefault = (ls('readNews')? ls('readNews'): []);
const amountUnreadDefault = 0;
const readNewsArticlesReducer = (state = {readNews:readNewsDefault, amountUnread:amountUnreadDefault}, action) => {
  switch (action.type) {
    case 'SET_LOGGED_IN_USER_READ_NEWS':
      return {...state, readNews:action.readNewsArray}
    case 'SET_READ_NEWS':
      return {readNews:[...action.localNewsStorage], amountUnread:action.localNewsStorage.length};
    case 'SET_AMOUNT_UNREAD':
      return {readNews:[...state.readNews], amountUnread:action.amountUnread}
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
export const setUserRole = (role) =>({
  type:'SET_USER_ROLE', role
})
export const setSCORAInfo = (scoraInfo) => ({
  type: 'SET_SCORA_INFO',
  scoraInfo
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
    case 'SET_USER_ROLE':
      return {...state, role:action.role}
    case 'SET_SCORA_INFO':
      return { ...state, ...action.scoraInfo}
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

/****** races Action and Reducer ********** */
export const addRace = (race) => ({
  type: 'ADD_RACE',
  race
})
export const updateRace = (race) => ({
  type: 'UPDATE_RACE',
  race
})
const racesReducer = ( state=[], action ) => {
  switch (action.type) {
    case 'ADD_RACE':
        const sortedRaces = [...state, action.race];
        sortedRaces.sort(function(a, b){return a.date - b.date});      
      return sortedRaces ;
    case 'UPDATE_RACE':
      //filter out the previous race from state and add the updated race to the state
      const filteredRaces = state.filter( race=> race.id !== action.race.id)
      const updatedRaces = [...filteredRaces, action.race];
      updatedRaces.sort(function(a, b){return a.date - b.date});
      return updatedRaces 
    default:
      return state;
  }
}
/****** races to Paddlers Action and Reducer *********/
export const addRaceToPaddler = (race) => ({  
  type: 'ADD_RACE_TO_PADDLER',
  race
})
export const removeRaceForPaddler = (raceID) => ({
  type: 'REMOVE_RACE_FOR_PADDLER',
  raceID
})
export const setRacesPaddlerSignedUpFor = (races) => ({
  type: 'SET_RACES_PADDLER_SIGNED_UP_FOR',
  races
})
export const clearRacesPaddlerSignedUpFor = () => ({
  type: 'CLEAR_RACES_PADDLER_SIGNED_UP_FOR'
})
const racesPaddlerSignedUpForReducer = ( state=[], action ) =>{
  switch (action.type) {
    case 'ADD_RACE_TO_PADDLER':     
      return [...state, action.race]
    case 'REMOVE_RACE_FOR_PADDLER':
      const filtered = state.filter(race=>race.raceID !== action.raceID);
      return filtered;
    case 'SET_RACES_PADDLER_SIGNED_UP_FOR':
      return [...action.races]
    case 'CLEAR_RACES_PADDLER_SIGNED_UP_FOR':
      return [];
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
        selectedPaddlerEditable: selectedPaddlerEditableReducer,
        races: racesReducer,
        racesPaddlerSignedUpFor: racesPaddlerSignedUpForReducer
      }
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return tazStore
}

