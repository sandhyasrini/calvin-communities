const model = require('cassandra-driver');
const connectionString = require('../../../../config');

const COMMUNITY_ROLE_TABLE = "communityroles";

const client = new model.Client({
  contactPoints: [connectionString.contact],
  protocolOptions: { port: connectionString.port },
  keyspace: connectionString.keyspace,
});

function getCommunityRoles(domainName, done) {
  const query = `SELECT * FROM ${COMMUNITY_ROLE_TABLE} WHERE domain = '${domainName}'`;// SORT BY domainname, role`;

  return client.execute(query, (err, results) => { console.log(results);
    if(!err) {
      done(err, results.rows);
    } else {
      done(err, undefined);
    }
  });
}

function postCommunityRoles(postedData, done) {
  const query = `INSERT INTO ${COMMUNITY_ROLE_TABLE} (domain, role, actions, toolid) VALUES ( ? , ? , ? , ? )`;// SORT BY domainname, role`;
  console.log("Inside post method");
  return client.execute(query, postedData, { hints: ['text', 'text', 'map', 'text'] }, (err, results) => {
    if(!err) {
      done(err, results.rows);
    } else {
      done(err, undefined);
    }
  });
}

function patchCommunityRoles(values, done) {
  const query = (`UPDATE ${COMMUNITY_ROLE_TABLE} SET actions = actions + ?, toolid = ? where domain = ? AND role=?`);// SORT BY domainname, role`;
  console.log("Patch Executing ");
  return client.execute(query, values, { hints: ['map', 'text', 'text','text'] }, (err, results) => {
    if(!err) {
      done(err, results.rows);
    } else {
      done(err, undefined);
    }
  });
}

/*function getcommunityrole(callback) {
  const query = ('select * from communityroles');
  return client.execute(query, (err, result) => {
    callback(err, result);
  });
}

function postcommunityrole(data, callback) {
  const query = ('INSERT INTO communityroles (domain,actions,role) VALUES (?, ?, ?)');
  const param = [data.domain, data.actions, data.role];
  return client.execute(query, param, { hints: ['text', 'map', 'text'] }, (err) => {
    callback(err);
  });
}

function patchcommunityrole(data, value, callback) {
  const query = ('UPDATE communityroles SET actions=actions+ ? where domain=? AND role=?');
  const param = [data.actions, value.domain, value.role];
  return client.execute(query, param, { hints: ['map', 'text', 'text'] }, (err) => {
    callback(err);
  });
}*/

module.exports = {
  getCommunityRoles,
  postCommunityRoles,
  patchCommunityRoles
  /*getcommunityrole,
  postcommunityrole,
  patchcommunityrole*/ };
