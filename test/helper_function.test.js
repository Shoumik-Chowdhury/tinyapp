const { assert } = require('chai');

const { getUserByEmail } = require('../helper_function.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
  it('should return false if email does not exist', function() {
    const user = getUserByEmail("abcd@example.com", testUsers)
    const expectedUserID = false;
    assert.equal(user, expectedUserID);
  });
  it('should return false if input email empty', function() {
    const user = getUserByEmail("", testUsers)
    const expectedUserID = false;
    assert.equal(user, expectedUserID);
  });
  it('should return false if input email undefined', function() {
    const user = getUserByEmail(undefined, testUsers)
    const expectedUserID = false;
    assert.equal(user, expectedUserID);
  });
});