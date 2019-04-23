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

suite.skip('Functional Tests', () => {
  suite.skip('API ROUTING FOR /api/threads/:board', () => {
    suite.skip('POST', () => {
      chai.request(server).get('/api/threads/general/').send({
        text: 'general',
        delete_password: 'password'
      }).end((err, res) => {
        console.log(res);
      });
    });
    
    suite.skip('GET', () => {
      
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
