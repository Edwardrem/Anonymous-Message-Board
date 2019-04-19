'use strict';

const { expect } = require('chai');

module.exports = app => {
  app.get('/api/threads/:board', (req, res, next) => {
  
  });
  
  app.post('/api/threads/:board', (req, res, next) => {
  
  });
  
  app.put('/api/threads/:board', (req, res, next) => {
  
  });
  
  app.delete('/api/threads/:board', (req, res, next) => {
  
  });
    
  app.get('/api/replies/:board', (req, res, next) => {
  
  });
  
  app.post('/api/replies/:board', (req, res, next) => {
  
  });
  
  app.put('/api/replies/:board', (req, res, next) => {
  
  });
  
  app.delete('/api/replies/:board', (req, res, next) => {
  
  });
};

/*

'/api/threads/:board'
'/api/replies/:board'


I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.   

  GET '/api/threads/:board'
  [
    // display 10 threads sorted by bumped_on in Descending order (newest at top)
    // each thread will only display 3 replies sorted in the same fashion
    // omit the fields: '-delete_password, -reported'
  ]


I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.
(Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).

  POST '/api/threads/:board'
  // route should res.redirect to board page `/b/${board}`
  // .send( { text, delete_password })
  // thread document will contain: 
       {
         _id: // could be the native document_id,
         text: { type: String },
         created_on(date&time): { type: Date },
         bumped_on(date&time initializes to equal created_on: { type: Date },
         reported: { type: Boolean },
         delete_password: { type: String },
         replies: { type: Array } 
       }
    
   
   
I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success') 

  PUT '/api/threads/:board'
  // .send({ thread_id })
  // thread's reported field will be updated to true
  // res.status(200).send('success');



I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')

  DELETE '/api/threads/:board'
  // .send({ thread_id, delete_password })
  // remove this thread from ${baord}'s database of threads
  // res.status(400).send('incorrect password'); || res.status(200).send('success')



I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.

  GET '/api/replies/:board'
  // url looks like: /api/replies/{board}?thread_id={thread_id}
  // .query({ thread_id })
  // return ALL replies from corresponding thread
  // omit the fields: '-delete_password, -reported'



I can POST a reply to a thread on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.

POST '/api/replies/:board'
// adding a reply to a thread
// .send({ text, delete_password, thread_id })
// route should res.redirect to thread page `/b/${board}/${thread_id})`



I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')



I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')

*/