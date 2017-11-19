import jwt from 'jsonwebtoken';

import gateways from './gateways';

export default {
  handleMessage(token, socket) {
    return (message) => {
      if (message) {
        const data = JSON.parse(message);

        const user = jwt.decode(data.token);

        if (user && user._id) {
          switch (data.event) {
            case 'monitorGateway': {
              gateways.monitorGateway(socket, user, data);
              break;
            }
            case 'stopMonitorGateway': {
              gateways.stopMonitorGateway(socket, user, data);
              break;
            }
            default: {
              break;
            }
          }
        }
      }
    };
  }
};
