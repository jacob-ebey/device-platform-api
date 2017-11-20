import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  addProject: {
    body: {
      name: Joi.string().required()
    }
  },

  deleteProject: {
    params: {
      id: Joi.string().required()
    }
  },

  addGatewayToProject: {
    params: {
      projectId: Joi.string().required(),
      gatewayId: Joi.string().required()
    }
  },

  addGateway: {
    body: {
      name: Joi.string().required()
    }
  },

  linkConfiguration: {
    params: {
      gatewayId: Joi.string().required(),
      configId: Joi.string().required()
    }
  },

  registerGateway: {
    body: {
      gatewayId: Joi.string().required(),
      registrationCode: Joi.string().required()
    }
  },

  unregisterGateway: {
    params: {
      id: Joi.string().required()
    }
  },

  getConfigForGateway: {
    params: {
      id: Joi.string().required()
    }
  },

  getLogsForConfiguration: {
    params: {
      id: Joi.string().required()
    }
  },

  addConfiguration: {
    body: {
      name: Joi.string().required()
    }
  },

  editConfiguration: {
    params: {
      id: Joi.string().required()
    },
    body: {
      name: Joi.string().required()
    }
  },

  addDevice: {
    body: {
      type: Joi.string().required(),
      mode: Joi.string().required(),
      address: Joi.string().required(),
      defaultValue: Joi.number(),
    }
  },

  addController: {
    body: {
      type: Joi.string().required()
    }
  }
};
