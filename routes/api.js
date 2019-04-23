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
            return key !== 'delete_password' && key !== 'reported';
          })
        }).slice(0, 3),
        replycount: doc.replies.length
      }));
      docArray.sort((a, b) => b.bumped_on - a.bumped_on);
      return res.status(200).json(docArray);
    });
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
      if (existingThread) return res.redirect(`/b/${board}/`);
      thread.save((err, newThread) => {
        if(err) next(err);
        return res.redirect(`/b/${board}/`);
      });
    });
  });
  
  app.put('/api/threads/:board', (req, res, next) => {
    const { board } = req.params;
    const { thread_id } = req.body;
    Thread.findOne({ board, _id: thread_id }, (err, thread) => {
      if(err) next(err);
      thread.reported = true;
      thread.markModified('reported');
      thread.save((err, updatedThread) => {
        if(err) next(err);
        return res.status(200).send('success');
      });
    });
  });
  
  app.delete('/api/threads/:board', (req, res, next) => {
    const { board } = req.params;
    const { thread_id, delete_password } = req.body;
    Thread.findOne({ board, _id: thread_id }, (err, board) => {
      if(err) next(err);
      if (board.delete_password !== delete_password) return res.send('incorrect password');
      board.deleteOne({ board, _id: thread_id }, (err, updatedBoard) => {
        if(err) next(err);
        return res.status(200).send('success');
      });
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
  });
  
  app.put('/api/replies/:board', (req, res, next) => {
    const { board } = req.params;
    const { thread_id, reply_id } = req.body;
    Thread.findOne({ board, _id: thread_id }, (err, thread) => {
      if(err) next(err);
      const replyIndex = thread.replies.findIndex(reply => reply._id == reply_id);
      const replyToUpdate = thread.replies[replyIndex];
      replyToUpdate.reported = true;
      thread.markModified('replies');
      thread.save((err, updatedThread) => {
        if(err) next(err);
        return res.status(200).send('success');
      });
    });
  });
  
  app.delete('/api/replies/:board', (req, res, next) => {
    const { board } = req.params;
    const { thread_id, reply_id, delete_password } = req.body;
    Thread.findOne({ board, _id: thread_id, }, (err, thread) => {
      if(err) next(err);
      const replyIndex = thread.replies.findIndex(reply => reply._id == reply_id);
      const replyToUpdate = thread.replies[replyIndex];
      if (replyToUpdate.delete_password === delete_password) {
        replyToUpdate.text = '[deleted]';
        thread.markModified('replies');
        thread.save((err, updatedThread) => {
          if(err) next(err);
          return res.status(200).send('success');
        });
      } else return res.status(200).send('incorrect password');
    });
  });
};