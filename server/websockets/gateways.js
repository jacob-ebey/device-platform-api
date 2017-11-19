const intervals = {};

export default {
  monitorGateway(socket, user, { gatewayId }) {
    // eslint-disable-next-line no-console
    console.log(`Monitoring of ${gatewayId} requested by ${user.username}`);

    if (intervals[user._id]) {
      // eslint-disable-next-line no-console
      console.log(`Terminating old interval for ${user.username}`);
      clearInterval(intervals[user._id]);
      intervals[user._id] = undefined;
    }

    const interval = setInterval(() => {
      const data = {
        event: 'gatewayLog',
        payload: {
          time: Date.now(),
          data: { sensor: 1, value: 'rofl' }
        }
      };

      socket.send(JSON.stringify(data), (error) => {
        if (error) {
          clearInterval(interval);
          intervals[user._id] = undefined;
        }
      });
    }, 5000);

    intervals[user._id] = interval;
  },

  stopMonitorGateway(socket, user) {
    if (intervals[user._id]) {
      // eslint-disable-next-line no-console
      console.log(`Stopping interval for ${user.username}`);
      clearInterval(intervals[user._id]);
      intervals[user._id] = undefined;
    }
  }
};
