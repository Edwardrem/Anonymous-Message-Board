/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert } = chai;
const server = require('../server');
const deletePassword = 'password';
let threadId, replyId;

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('API ROUTING FOR /api/threads/:board', () => {
    suite('POST', () => {
      test('Redirect after creating a board', done => {
        chai.request(server).post('/api/threads/general/').send({
          text: 'test',
          delete_password: deletePassword
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.match(res.redirects[0], /\/b/general/\/);
          done();
        });
      });
    });
    
    suite('GET', () => {
      test('Receive 10 bumped threads with 3 replies', done => {
        chai.request(server).get('/api/threads/general/').end((err, res) => {
          threadId = res.body[0]._id;
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isArray(res.body[0].replies);
          assert.isAtMost(res.body.length, 10);
          assert.isAtMost(res.body[0].replies.length, 3);
          done();
        });
      });
    });
    
    suite('PUT', () => {
      test('Report a board', done => {
        chai.request(server).put('/api/threads/general').send({
          thread_id: threadId
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('DELETE', () => {
      test('Attempt to delete a board with an incorrect delete_password', done => {
        chai.request(server).delete('/api/threads/general/').send({
          thread_id: threadId,
          delete_password: 'wrongPassword'
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('Succeed in deleting a board with the correct delete_password', done => {
        chai.request(server).delete('/api/threads/general').send({
          thread_id: threadId,
          delete_password: deletePassword
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', () => {
    suite('TEST SETUP', () => {
      test('Create board for following test to use', done => {
        chai.request(server).post('/api/threads/general/').send({
          text: 'test',
          delete_password: deletePassword
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.redirects[0].slice(-11), '/b/general/');
          done();
        });
      });
      
      test('Obtain newly created board\'s thread_id', done => {
        chai.request(server).get('/api/threads/general/').end((err, res) => {
          threadId = res.body[0]._id;
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isArray(res.body[0].replies);
          assert.isAtMost(res.body.length, 10);
          assert.isAtMost(res.body[0].replies.length, 3);
          done();
        });
      });
    });
    
    suite('POST', () => {
      test('Redirect after creating a reply', done => {
        chai.request(server).post('/api/replies/general').send({
          text: 'Tech',
          thread_id: threadId,
          delete_password: deletePassword
        }).end((err, res) => {
          console.log(res.redirects[0]);
          assert.equal(res.status, 200);
          done();
          // res.redirect(`/b/${board}/${thread_id}`);
        });
      });
    });
    
    suite.skip('GET', () => {
      
    });
    
    suite.skip('PUT', () => {
      
    });
               
    suite.skip('DELETE', () => {
      
    });
  });
});
