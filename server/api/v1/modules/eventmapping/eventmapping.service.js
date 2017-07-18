const model = require('cassandra-driver');
const _ = require('lodash');
const connectionString = require('../../../../config').connectionString;
const logger = require('../../../../logger');

const COMMUNITY_TOOL_EVENT_MAP = 'communitytooleventmap';

// Connecting to cassandra
const client = new model.Client({
  contactPoints: [connectionString.contact],
  protocolOptions: { port: connectionString.port },
  keyspace: connectionString.keyspace,
});

function getToolEventMapping(data, done) {
  const query = `select * from ${COMMUNITY_TOOL_EVENT_MAP} \
  where domain = '${data.domain}' and toolid = '${data.toolid}' and eventid = '${data.event}' `;
  client.execute(query, (err, result) => {
    if (err) { logger.error('Error posting event details', err); return done([500, 'Unexpected error occured']); }
    if (result.rows) {
      return done(undefined, result.rows[0]);
    }
    return null;
  });
}

function getToolMapping(details, done) {
  const query = `select * from ${COMMUNITY_TOOL_EVENT_MAP} \
  where domain = '${details.domain}' and toolid = '${details.toolid}' `;
  const events = [];
  client.execute(query, (err, result) => {
    if (err) { logger.error('Error posting event details', err); return done([500, 'Unexpected error occured']); }
    if (!_.isEmpty(result.rows)) {
      let data;
      if (result.rows.length === 1) data = [result.rows];
      else data = result.rows;

      data.forEach((index) => {
        events.push({
          eventid: index.eventid,
          eventname: index.eventname,
          eventdescription: index.eventdecription,
          communityactivityevent: index.communityactivityevent,
          metadata: index.metadada,
        });
      });
      return done(undefined, { domain: data[0].domain, toolid: data[0].toolid, events });
    }
    return done(undefined, result.rows);
  });
}

function postEventMapping(queries, existscheck, done) {
  if (_.isEmpty(existscheck)) {
    client.batch(queries, (err) => {
      if (err) { logger.error('Error posting event details', err); return done([500, 'Unexpected error occured']); }
      if (!err) { return done(undefined, 'data posted'); }
      return null;
    });
  } else return done([400, 'Tool Already mapped with this community']);
}

function updateEventMapping(queries, existscheck, done) {
  if (!_.isEmpty(existscheck)) {
    client.batch(queries, { prepare: true }, (err) => {
      if (err) { logger.error('Error updating event details', err); return done([500, 'Unexpected error occured']); }
      if (!err) { return done(undefined, 'data patched'); }
      return null;
    });
  } else return done([400, 'Please map the tool to community first']);
}


module.exports = {
  getToolMapping,
  getToolEventMapping,
  postEventMapping,
  updateEventMapping,
};