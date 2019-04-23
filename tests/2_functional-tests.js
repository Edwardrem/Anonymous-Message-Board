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
      test.skip('GET 10 bumped threads with 3 replies', done => {
        chai.request(server).get('/api/threads/general/')
      });
    });
    
    suite.skip('DELETE', () => {
      
    });
    
    suite.skip('PUT', () => {
      
    });
  });
  
  suite.skip('API ROUTING FOR /api/replies/:board', () => { 
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
