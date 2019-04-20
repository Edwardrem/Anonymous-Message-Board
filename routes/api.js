'use strict';

const mongo = require('mongodb');
const mongoose = require('mongoose');
const mongooseConfig = require('../config/mongoose_config');
const { CONNECTION_STRING } = process.env;
const { expect } = require('chai');
const { Thread } = require('../models/Thread');
const { ObjectId } = require('mongodb');

mongoose.connect(CONNECTION_STRING, mongooseConfig);

const db = mongoose.connection;

module.exports = app => {
  app.get('/api/threads/:board', (req, res, next) => {
    const { board } = req.params;
    Thread.find({ board }, '-delete_password -reported', { limit: 10 }, (err, docs) => {
      if(err) next(err);
      let docArray = [];
      Object.fromEntries = arr => { 
        return Object.assign({}, ...arr.map(([k, v]) => { 
          return ({ [k]: v });
        })); 
      }
      Object.filter = (obj, predicate) => { 
        return Object.fromEntries(Object.entries(obj).filter(predicate));
      }
      docs.forEach(doc => docArray.push({
        _id: doc._id,
        text: doc.text,
        created_on: doc.created_on,
        bumped_on: doc.bumped_on,
        replies: doc.replies.map(reply => {
          return Object.filter(reply, ([key, value]) => { 
            return key !== 'reported' && key !== 'delete_password';
          })
        }).slice(0, 3),
        replycount: doc.replies.length
      }));
      docArray.sort((a, b) => b.bumped_on - a.bumped_on);
      return res.status(200).json(docArray);
    });
    /*
    
    I can GET an array of the most recent 10 bumped threads on 
    the board with only the most recent 3 replies from 
    /api/threads/{board}. The reported and delete_passwords fields will not be sent.   
    
    GET '/api/threads/:board'
    [
      display 10 threads sorted by bumped_on in Descending order (newest at top) -variable
      each thread will only display 3 replies sorted in the same fashion
      omit the fields: '-delete_password, -reported'
    ]
    
    */
  });
  
  app.post('/api/threads/:board', (req, res, next) => {
    const { board } = req.params;
    const { text, delete_password } = req.body;
    const thread = new Thread({
      board,
      text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password,
      replies: []
    });
    Thread.findOne({ board, text }, (err, existingThread) => {
      if(err) next(err);
      if (existingThread) return res.redirect(`/api/threads/${board}`);
      
      thread.save((err, newThread) => {
        if(err) next(err);
        return res.redirect(`/api/threads/${board}`);
      });
    });
  });
  
  app.put('/api/threads/:board', (req, res, next) => {
    const { board } = req.params;
    const { thread_id } = req.body;
    Thread.findByIdAndUpdate({ board, _id: thread_id }, { reported: true }, (err, thread) => {
      if(err) next(err);
      if (thread.reported === true) return res.status(200).send('success')
    });
  });
  
  app.delete('/api/threads/:board', (req, res, next) => {
    const { board } = req.params;
    const { thread_id, delete_password } = req.body;
    Thread.deleteOne({ board, _id: thread_id, delete_password }, (err, updatedBoard) => {
      if(err) next(err);
      if (updatedBoard.deletedCount === 1) return res.status(200).send('success');
      return res.send('incorrect password');
    });
  });
    
  app.get('/api/replies/:board', (req, res, next) => {
    const { board } = req.params;
    const { thread_id } = req.query;
    Thread.findOne({ board, _id: thread_id }, '-delete_password -reported', (err, thread) =>{
      if(err) next(err);
      return res.status(200).json(thread);
    });
  });
  
  app.post('/api/replies/:board', (req, res, next) => {
    const { board } = req.params;
    const { text, delete_password, thread_id } = req.body;
    const rightNow = new Date();
    Thread.findOne({ board, _id: thread_id }, '-delete_password -reported', (err, thread) => {
      if(err) next(err);
      if ((thread.replies.filter(reply => reply.text === text).length > 0)) {
        return res.redirect(`/b/${board}/${thread_id}`);
      }
      thread.replies.push({ 
        _id: new ObjectId(),
        text,
        created_on: rightNow,
        delete_password,
        reported: false
      })
      thread.bumped_on = rightNow;
      thread.replies.sort((a, b) => b.created_on - a.created_on);
      thread.save((err, updatedThread) => {
        if(err) next(err);
        return res.redirect(`/b/${board}/${thread_id}`);
      });
    });
    /*
    
    I can POST a reply to a thread on a specific board by passing 
    form data text, delete_password, & thread_id to /api/replies/{board} 
    and it will also update the bumped_on date to the 
    comments date.(Recomend res.redirect to thread page 
    /b/{board}/{thread_id}) In the thread's 'replies' array will be 
    saved _id, text, created_on, delete_password, & reported.
    
    POST '/api/replies/:board'
    adding a reply to a thread
    .send({ text, delete_password, thread_id })
    thread's bumped_on will be updated to the date this reply was made
    route should res.redirect to thread page `/b/${board}/${thread_id})`
    replies Array consists of:
     {
       _id: new ObjectId();,
       text: { type: String },
       created_on: { type: Date },
       delete_password: { type: String },
       reported: { type: Boolean, default: false }
     }
    
    */
  });
  
  app.put('/api/replies/:board', (req, res, next) => {
    /*
    
    I can report a reply and change it's reported value to true by 
    sending a PUT request to /api/replies/{board} and pass along the 
    thread_id & reply_id. (Text response will be 'success')
    
    PUT '/api/replies/:board'
    .send({ thread_id, reply_id })
    reported will be updated to true
    res.status(200).send('success')
    
    */
  });
  
  app.delete('/api/replies/:board', (req, res, next) => {
    /*
    
    I can delete a post(just changing the text to '[deleted]') if I 
    send a DELETE request to /api/replies/{board} and pass along the 
    thread_id, reply_id, & delete_password. (Text response will be 
    'incorrect password' or 'success')
    
    DELETE '/api/replies/:board'
    .send({ thread_id, reply_id, delete_password })
    the reply's text field will be updated to equal: [deleted]
    res.status(400).send('incorrect password'); || res.status(200).send('success')
    
    */
  });
};