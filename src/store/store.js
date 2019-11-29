import { createStore, combineReducers, bindActionCreators } from 'redux'
import uuid from 'uuid';

/********* Calendar Events Actions and Reducer ************* */
// Events actions
const addCalendarEvent = ( { id=uuid(), title='', start=0, end=0 } ) => ({
  type: 'ADD_CALENDAR_EVENT',
  event:{
    id,
    title,
    start,
    end
  }
})

//create a events reducer
const eventsReducerDefault = [];
const eventsReducer = (state = eventsReducerDefault, action) => {
  switch (action.type) {
    case 'ADD_CALENDAR_EVENT':      
      // spread the current state and add the event passed which will overwrite with new values
      return [...state, action.event]
    default:
      return state;
  }
}
/********* News Actions and Reducer ************* */
const addNewsItem = ( { id=uuid(), content={}, excerpt={}, date=0 , title={} } ) => ({
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


/********* create a store by combining reducers ********************** */
//create store by assigning expenses reducer to expenses property using combineReducer
const store = createStore(
  combineReducers(
    { events:eventsReducer,
      news:newsReducer
    }
  ));
const unsubscribe = store.subscribe (()=>{
  console.log(store.getState())
})

store.dispatch(addCalendarEvent({start:23, title:'pepe title', start:123, end:456}))
store.dispatch(addNewsItem({
    date:132,
    content:{rendered:'pepe content'},
    excerpt:{rendered: 'pepe ...'},
    title:{rendered: 'Pepe title'}
  }
))


