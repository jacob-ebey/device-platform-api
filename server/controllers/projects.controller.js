import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import Gateway from '../models/gateway.model';
import Project from '../models/project.model';

/**
 * Get a specific project
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function get(req, res, next) {
  Project.get(req.params.id)
    .then((project) => {
      res.json(project);
    })
    .catch(e => next(e));
}

/**
 * Gets all projects for a user
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getAll(req, res, next) {
  User.getProjects(req.user._id, (error, projects) => {
    if (error) {
      return next(error);
    }

    return res.json(projects);
  });
}

/**
 * Create a new project
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addProject(req, res, next) {
  User.get(req.user._id, 'ownedProjects')
    .then((user) => {
      const project = new Project({
        name: req.body.name,
        ownedBy: req.user._id
      });

      project.save()
        .then((savedProject) => {
          user.ownedProjects.push(savedProject._id);

          user.save()
            .then(() => {
              res.json(savedProject);
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

/**
 * Create a gateway to a project
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addGatewayToProject(req, res, next) {
  Project.get(req.params.projectId)
    .then((project) => {
      Gateway.get(req.params.gatewayId)
        .then((gateway) => {
          project.gateways.push(gateway._id);

          project.save()
            .then(() => {
              res.json(gateway);
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

/**
 * Delete a project
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deleteProject(req, res, next) {
  Project
    .findById(req.params.id)
    .exec()
    .then((project) => {
      if (String(project.ownedBy) === String(req.user._id)) {
        project.remove()
          .then(() => {
            res.json(true);
          })
          .catch(e => next(e));
      } else {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        next(err);
      }
    })
    .catch(e => next(e));
}

export default { get, getAll, addProject, addGatewayToProject, deleteProject };
