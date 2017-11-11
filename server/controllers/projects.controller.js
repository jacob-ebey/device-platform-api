import User from '../models/user.model';
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
  User.get(req.user._id)
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

export default { get, getAll, addProject };
