import request from 'superagent'
import moment from 'moment';
import GoogleCalendarAPIKey from './components/keys/googleCalendarKey'
const CALENDAR_ID = 'teamazoutrigger@gmail.com'
const API_KEY = GoogleCalendarAPIKey.key
let url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&maxResults=1000&singleEvents=true`
console.log(url);

export function getEvents (callback) {
  request
    .get(url)
    .end((err, resp) => {
      if (!err) {
        const events = []
        let sDate = null
        let eDate = null        

        JSON.parse(resp.text).items.map((event) => {
          console.log(event);
          
          if (event.start && event.start.date){
            sDate = new Date(event.start.date)
          }
          if (event.start && event.start.dateTime){
            sDate = new Date(event.start.dateTime)
          } 
          if (event.end && event.end.date){
            eDate = new Date(event.end.date)
          }
          if (event.end && event.end.dateTime){
            eDate = new Date(event.end.dateTime)
          }                    
          events.push({
            id:event.id,
            start: sDate,
            end: eDate,
            title: event.summary,
          })     
          // if (moment(sDate).isAfter('2019-9-1')){
          //   console.log(event,event.summary);
            
          // }     
        })        
        callback(events)
      }
    })
}