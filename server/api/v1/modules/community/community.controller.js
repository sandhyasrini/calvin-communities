const async = require('async');

const _ = require('lodash');

const logger = require('../../../../logger');

const communityService = require('./community.service');

const templateController = require('../communitytemplates/communitytemplate.controller');

const membershipController = require('../communitymembership/communitymembership.controller');

const toolsController = require('../communitytools/communitytools.controller');

const roleController = require('../communityrole/communityrole.controller');

const counterController = require('../communitiescounter/counter.controller');

const registerPublisherService = require('../../../../common/kafkaPublisher');

/**
 * Get For all communities,
 *
 * GET REQUEST
 *
 *
 */
function getAllCommunities(done) {
  communityService.getAllCommunities(done);
}


/**
 * Used with POST Request, to get the template details
 *
 *
 *
 */
function getTemplateDetails(community) {
    // loading specified template
  const status = 'Active'; // initially the community will be active by default
  const templateDetails = templateController.getTemplateOfTemplateName(community.template);
  if (templateDetails.length !== 1) {
    return -1;
  }

  const templateRoles = [];
  templateDetails[0].roleActions.forEach((data) => {
    templateRoles.push(data.role);
  });

    // CommunityCreation Data
  const com = [
    community.domain.toLowerCase(), community.name, community.purpose,
    templateRoles,
    status, community.template,
    (community.tags).concat(templateDetails[0].tags),
    community.owner, community.description,
    community.visibility,
    community.owner, community.owner,
  ];
  logger.debug(com);
    // Adding admin as a member, data for addMembers
  const members = {
    username: community.owner,
    role: 'Owner',
  };

    // getting tools data from specified template for addTools
  const tools = [];
  templateDetails[0].tools.forEach((element) => {
    const toolsobject = {
      toolId: element.toolId,
      actions: element.actions,
      activityEvents: element.activityEvents,
    };
    tools.push(toolsobject);
  });

    // getting roles data from specified template
  const roles = [];
  templateDetails[0].roleActions.forEach((element) => {
    element.toolsActions.forEach((data) => {
      const rolesobject = {
        role: element.role,
        toolId: data.toolId,
        actions: data.actions,
      };
      roles.push(rolesobject);
    });
  });
    // returning all data in single array
  const values = [];
  values.push(com);
  values.push(members);
  values.push(tools);
  values.push(roles);
  return values;
}

/**
 * POST For adding new community,
 * POST REQUEST
 *
 *
 */
function addCommunity(community, done) {
  let values;
  if (_.has(community, 'name') &&
        _.has(community, 'domain') &&
        _.has(community, 'owner') &&
        _.has(community, 'template') &&
        _.has(community, 'purpose') &&
        _.gt(community.tags.length, 0) &&
        !_.isEmpty(community.name) &&
        !_.isEmpty(community.owner) &&
        !_.isEmpty(community.template) &&
        !_.isEmpty(community.purpose) &&
        (
            _.isEqual(community.visibility, 'Public') ||
            _.isEqual(community.visibility, 'Private') ||
            _.isEqual(community.visibility, 'Moderated')
        )
    ) {
    values = getTemplateDetails(community);
  } else return done('Wrong Data Inputs', null);

  if (values === -1) {
    return done('no template found');
  }

  return async.parallel([
    communityService.addCommunity.bind(null, values[0]),
    membershipController.addMembersToCommunity.bind(null,
                community.domain.toLowerCase(), [values[1]]),
    toolsController.postTools.bind(null, values[2], community.domain.toLowerCase()),
    roleController.postCommunityRoles.bind(null, community.domain.toLowerCase(), values[3]),

  ],
        (err, result) => {
          if (err) return done(err);
          publishMessageToTopic(community.domain);
          return done(undefined, result[0]);
        });
}

/**
 * Get For specific communities,
 * GET REQUEST
 *
 */
function getCommunity(domainName, counter, done) {
  if (counter) {
    async.parallel([
      communityService.getCommunity.bind(null, domainName.toLowerCase()),
      counterController.getcounter.bind(null, domainName.toLowerCase()),
    ], (err, result) => {
      if (err) return done(err);
      /* eslint-disable no-param-reassign*/
      if (!_.isEmpty(result[1])) {
        result[0][0].invitations = result[1][0].invitations;
        result[0][0].members = result[1][0].members;
        result[0][0].requests = result[1][0].requests;
        result[0][0].tools = result[1][0].tools;
      }
      /* eslint-disable no-param-reassign*/
      return done(undefined, result[0]);
        // result[0].push(counts);
    });
  } else {
    communityService.getCommunity(domainName.toLowerCase(), done);
  }
}

/**
 * PATCH For specific communities,
 * PATCH REQUEST
 *
 */
function updateCommunity(domainName, community, done) {
  if (_.has(community, 'name') &&
        _.has(community, 'updatedby') &&
        _.gt(community.tags.length, 0) &&
        !_.isEmpty(community.updatedby) &&
        (
            _.isEqual(community.status, 'Active') ||
            _.isEqual(community.status, 'Inactive')
        ) &&
        (
            _.isEqual(community.visibility, 'Public') ||
            _.isEqual(community.visibility, 'Private') ||
            _.isEqual(community.visibility, 'Moderated')
        )
    ) {
    const param = [community.name, community.avatar, community.description, community.visibility,
      community.tags, community.updatedby, community.status, domainName.toLowerCase(),
    ];

    return communityService.updateCommunity(param, done);
  }
  return done('Wrong Data Inputs', null);
}

function publishMessageToTopic(dataFromBody) {
  let message = { domain: dataFromURI };
  message= JSON.stringify(message);
  registerPublisherService.publishToTopic('topic1', message, (err, res) => {
    if (err) {
      console.log("error occured", err);
    } else {
      console.log("result is", res);
    }
  });
}

module.exports = {
  getAllCommunities,
  addCommunity,
  getCommunity,
  updateCommunity,

};
