const express = require('express');

const membershipCtrl = require('./communityMembership.controller');

const router = express.Router();

/*
 * Effective URI of the API is POST /community/member/role
 *
 * API for Adding
 *
 * URL Parameter
 *  - User Name: specify a specific user name, to get their details
 *
 */

router.post('/community/member/role', (req, res) => {
  try {
    const values = req.body;
    membershipCtrl.addMemberToCommunity(values, (err) => {
      if (err) {
        console.log('Error in membershipCtrl.addMemberToCommunity error :', err);
        return res.status(500).send({ error: 'Error in operation, please try later..!' });
      }
      return res.send('Added');
    });
  } catch (err) {
    console.log('Unexpected error in inserting values ', err);
    res.status(500).send({ error: 'Unexpected error occurred, please try again...!' });
  }
});

/*
 * Effective URI of the API is GET /member/:username/communities/role
 *
 * API for returning all Details of a specified user in All communities
 *
 * URL Parameter
 *  - User Name: specify a specific user name, to get their details
 *
 */

router.get('/member/:username/communities', (req, res) => {
  try {
    const userName = req.params.username;
    membershipCtrl.getParticularMemberDetailInCommunities(userName, (err, results) => {
      if (err) {
        console.log('Error in membershipCtrl.getParticularMemberDetailInCommunities error: ', err);
        return res.status(500).send({ error: 'Error in operation, please try later..!' });
      }
      return res.send(results);
    });
  } catch (err) {
    console.log('Unexpected error in fetching community roles ', err);
    res.status(500).send({ error: 'Unexpected error occurred, please try again...!' });
  }
});

/*
 * Effective URI of the API is GET /member/:domain/communities/role
 *
 * API for returning all Details of a members in a specified Community
 *
 * URL Parameter
 *  -  domain: specify a specific Community Name, to get their details
 *
 */

router.get('/community/:domain/members', (req, res) => {
  try {
    const domainName = req.params.domain;
    membershipCtrl.getParticularCommunityMemberDetails(domainName, (err, results) => {
      if (err) {
        console.log('Error in membershipCtrl.getParticularCommunityMemberDetails error: ', err);
        return res.status(500).send({ error: 'Error in operation, please try later..!' });
      }
      return res.send(results);
    });
  } catch (err) {
    console.log('Unexpected error in fetching community roles ', err);
    res.status(500).send({ error: 'Unexpected error occurred, please try again...!' });
  }
});

/*
 * Effective URI of the API is PATCH /member/:username/community/:domain/role
 *
 * API for Updating role to a Member for a Community
 * URL Parameter
 *  - username:specify a specific user name and domain :specify a community to update role
 *
 */

router.patch('/member/:username/community/:domain/role', (req, res) => {
  try {
    const params = {
      userName: req.params.username,
      domainName: req.params.domain,
    };
    const memberRole = req.body.role;
    membershipCtrl.modifyRoleOfMemberFromCommunity(params, memberRole, (err) => {
      if (err) {
        console.log('Error in membershipCtrl.modifyRoleOfMemberFromCommunity error: ', err);
        return res.status(500).send({ error: 'Error in operation, please try later..!' });
      }
      return res.send();
    });
  } catch (err) {
    console.log('Unexpected error in fetching community roles ', err);
    res.status(500).send({ error: 'Unexpected error occurred, please try again...!' });
  }
});

/*
 * Effective URI of the API is Delete /remove/member/:username/community/:domain/role
 *
 * API Deleting a Member from the Community
 * URL Parameter
 *  - username:  specify a specific user name and domain : specify a community to delete a member
 *
 */

router.delete('/community/:domain/removemember/:username', (req, res) => {
  try {
    const params = {
      userName: req.params.username,
      domainName: req.params.domain,
    };
    membershipCtrl.removeMemberFromCommunity(params, (err) => {
      if (err) {
        console.log('Error in membershipCtrl.removeMemberFromCommunity error: ', err);
        return res.status(500).send({ error: 'Error in operation, please try later..!' });
      }
      return res.send();
    });
  } catch (err) {
    console.log('Unexpected error in fetching community roles ', err);
    res.status(500).send({ error: 'Unexpected error occurred, please try again...!' });
  }
});

module.exports = router;