// import { Mqtt as Protocol } from 'azure-iot-device-mqtt';
import { Client } from 'azure-event-hubs';
import config from '../../config/config';
import gateways from '../repos/gateways';

const client = Client.fromConnectionString(config.iotHubConnectionString);
const sockets = {};

const printError = (err) => {
  console.log(err.message);
};

const handleMessage = () => (message) => {
  if (message.body.deviceId && message.body.event === 'gatewayLog') {
    gateways.saveLog(message.body.deviceId, message)
      .then(() => {
        console.log(`GatewayLog: ${message.body.deviceId}`);
      })
      .catch(e => console.log(e));

    Object.keys(sockets).forEach((key) => {
      const socket = sockets[key];
      if (socket.gatewayId === message.deviceId) {
        socket.socket.send(JSON.stringify({
          event: 'gatewayLog',
          payload: message.body.payload
        }), (error) => {
          if (error) {
            socket.socket.close();
            delete sockets[key];
          }
        });
      }
    });
  }
};

client.open()
  .then(client.getPartitionIds.bind(client))
  .then(partitionIds =>
    gateways
      .getLastLog()
      .then((log) => {
        const startAfterOffset = log ? log.offset : undefined;
        return partitionIds.map(partitionId =>
          client
            .createReceiver('$Default', partitionId, { startAfterTime: startAfterOffset })
            .then((receiver) => {
              console.log(`Created partition receiver:  ${partitionId}`);
              receiver.on('errorReceived', printError);
              receiver.on('message', handleMessage(receiver));
            })
        );
      })
  )
  .catch(printError);

export default {
  monitorGateway(socket, user, { gatewayId }) {
    // eslint-disable-next-line no-console
    console.log(`Monitoring of ${gatewayId} requested by ${user.username}`);

    sockets[user._id] = {
      socket,
      gatewayId
    };
  },

  stopMonitorGateway(socket, user) {
    if (sockets[user._id]) {
      delete sockets[user._id];
    }
  }
};
