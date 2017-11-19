import jwt from 'jsonwebtoken';

import monitorGateway from './monitorGateway';

export default {
  handleMessage(token, socket) {
    const user = jwt.decode(token);

    if (!user) {
      socket.close();
      return () => {};
    }

    return (message) => {
      if (message) {
        const data = JSON.parse(message);

        switch (data.event) {
          case 'monitorGateway': {
            monitorGateway(socket, user, data);
            break;
          }
          default: {
            break;
          }
        }
      }
    };
  }
};
