const logger = require('../../logger');
const toolService = require('../../api/v1/modules/tools/tools.controller');
const config = require('../../appconfig/index');

const {events: events } = config;

module.exports = function (eventMessage) {
  logger.debug('Got a new community event message: ', eventMessage);
  logger.debug(eventMessage.type);
  if (eventMessage.event === events.addtool) {
    logger.debug(eventMessage.tools);
    toolService.postTools(eventMessage.tools, eventMessage.domain, (err, res) => {
      if (res) {
        logger.debug('insde the tool');
      }
      if (err) {
        logger.debug('error');
      }
    });
  }
  if (eventMessage.type === 'deletetool') {
    logger.debug('delete', eventMessage);
    toolService.deleteTool(eventMessage.domain, (err) => {
      logger.debug('insde delete');
    });
  }
};
