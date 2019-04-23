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

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('API ROUTING FOR /api/threads/:board', () => {
    let threadId;
    suite('POST', () => {
      test('Redirect after creating a board', done => {
        chai.request(server).post('/api/threads/general/').send({
          text: 'test',
          delete_password: 'password'
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.redirects[0].slice(-11), '/b/general/');
          done();
        });
      });
    });
    
    suite('GET', () => {
      test('GET 10 bumped threads with 3 replies', done => {
        chai.request(server).get('/api/threads/general/').end((err, res) => {
          threadId = res.body[0]._id;
          console.log(threadId);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isArray(res.body[0].replies);
          assert.isAtMost(res.body.length, 10);
          assert.isAtMost(res.body[0].replies.length, 3);
          done();
        });
      });
    });
    
    suite('DELETE', () => {
      test('DELETE a board with the incorrect delete_password', done => {
        chai.request(server).delete('/api.threads/general/').send({
          thread_id: threadId,
          delete_password: 'wrongPassword'
        }).end((err, res) => {
          console.log(res.text);
          // assert.equal(res.status, 200);
          // assert.eqaul(res.text, 'incorrect password');
          done();
        });
      });
    });
    
    suite.skip('PUT', () => {
      
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', () => { 
    let replyId, deletePassword;
    suite.skip('POST', () => {
      
    });
    
    suite.skip('GET', () => {
      
    });
    
    suite.skip('PUT', () => {
      
    });
    
    suite.skip('DELETE', () => {
      
    });
  });
});
