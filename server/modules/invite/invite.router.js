const express = require('express');

const controller = require('./invite.controller');

const router = express.Router();

// calling a method for inserting all the values into the table

router.post('/send', (req, res) => {
  try {
    controller.createInvitation(req, res);
  } catch (err) {
    res.send({ error: 'Unexpected internal error occurred, please try later...!' });
  }
});

// calling a method for updating the status

router.patch('/action/:id', (req, res) => {
  try {
    controller.updateInvitation(req, res);
  } catch (err) {
    res.send({ error: 'Unexpected internal error occurred, please try later...!' });
  }
});

// calling a method for rejecting the status

router.delete('/rejected/:id', (req, res) => {
  try {
    controller.rejectedInviteRequest(req, res);
  } catch (err) {
    res.send({ error: 'Unexpected internal error occurred, please try later...!' });
  }
});

// calling the method for getting all values from the table

router.get('/lists', (req, res) => {
  try {
    controller.gettingMembers(req, res);
  } catch (err) {
    res.send({ error: 'Unexpected internal error occurred, please try later...!' });
  }
});

// calling the method for getting the values for the particular id

router.get('/:id', (req, res) => {
  try {
    controller.gettingMembersById(req, res);
  } catch (err) {
    res.send({ error: 'Unexpected internal error occurred, please try later...!' });
  }
});

module.exports = router;