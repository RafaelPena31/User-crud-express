const { UserMethods } = require('../model/user');

module.exports = {
  create(request, response) {
    const { name, email, password } = request.body;

    try {
      UserMethods.create(name, email, password);
      return response.sendStatus(201);
    } catch (error) {
      console.log(error);
      return response.json({
        error: error.message || 'Could not create an user',
      });
    }
  },

  createMany(request, response) {
    const users = request.body;

    try {
      UserMethods.createMany(users);
    } catch (error) {
      return response.json({
        error: error.message || 'Could not create an user',
      });
    }
    return response.sendStatus(201);
  },

  delete(request, response) {
    const { id } = request.params;

    try {
      UserMethods.delete(id);
    } catch (error) {
      return response.json({
        error: error.message || 'Could not delete the user',
      });
    }
  },

  deleteMany(request, response) {
    const { minRange, maxRange } = request.body;

    const filters = {
      minRange,
      maxRange,
    };

    try {
      UserMethods.deleteMany(filters);
      return response.sendStatus(200);
    } catch (error) {
      return response.json({
        error: error.message || 'Could not delete many users',
      });
    }
  },

  update(request, response) {
    const { name, email, password } = request.body;
    const { id } = request.params;

    try {
      const user = UserMethods.update(id, name, email, password);
      return response.json(user);
    } catch (error) {
      console.log(error);
      return response.json({
        error: error.message || 'Could not update the user',
      });
    }
  },

  listUsers(request, response) {
    const listUsers = UserMethods.list();

    return response.json(listUsers);
  },

  login(request, response) {
    const { email, password } = request.body;

    try {
      const user = UserMethods.login(email, password);

      return response.json(user);
    } catch (error) {
      return response.json({
        error: error.message || 'Could not authenticate the user',
      });
    }
  },
};
