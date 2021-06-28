const crypto = require('crypto');

const UserData = [];

const UserMethods = {
  create: (name, email, password) => {
    if (UserData.find((user) => user.email == email)) {
      throw new Error('User already exists');
    }

    const userId = crypto.randomUUID();
    const salt = crypto.randomBytes(8).toString('hex');

    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) {
        throw new Error(err);
      }

      UserData.push({
        id: userId,
        name,
        email,
        password,
        hashedPassword: `${derivedKey.toString('hex')}`,
        salt,
        accessKey: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  },
  search: (condition) => {
    const selectedUsers = UserData.filter(
      (user) =>
        user.name.toLowerCase().indexOf(condition.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(condition.toLowerCase()) !== -1
    );

    return selectedUsers;
  },
  update: (id, name, email, password) => {
    const selectedUser = UserData.find((user) => user.id === id);
    if (selectedUser && selectedUser.accessKey) {
      crypto.scrypt(
        selectedUser.password,
        selectedUser.salt,
        32,
        (err, derivedKey) => {
          if (err) {
            throw new Error(err);
          }
          selectedUser.name = name;
          selectedUser.email = email;
          selectedUser.password = password;
          selectedUser.hashedPassword = `${derivedKey.toString('hex')}`;

          selectedUser.updatedAt = new Date().toISOString();

          return selectedUser;
        }
      );
    } else {
      throw new Error('User does not exists or user is not authenticated');
    }
  },
  login: (email, password) => {
    const selectedUser = UserData.find((user) => user.email === email);

    crypto.scrypt(password, selectedUser.salt, 32, (err, derivedKey) => {
      if (err) {
        throw new Error(err);
      }
      if (selectedUser.hashedPassword == derivedKey.toString('hex')) {
        selectedUser.accessKey = crypto.randomBytes(8).toString('hex');
        return selectedUser;
      }
    });
  },
  delete: (id) => {
    const selectedUser = UserData.find((user) => user.id === id);

    if (selectedUser && selectedUser.accessKey) {
      const itemIndex = UserData.indexOf(selectedUser);

      UserData.splice(itemIndex, 1);
    }

    throw new Error('Error in user authentication');
  },
  list: () => {
    return UserData;
  },
  createMany: (users) => {
    users.map((user) => {
      if (UserData.find((userData) => userData.email === user.email)) {
        throw new Error('User already exists');
      }

      const userId = crypto.randomUUID();
      const salt = crypto.randomBytes(8).toString('hex');

      crypto.scrypt(user.password, salt, 32, (err, derivedKey) => {
        if (err) {
          throw new Error(err);
        }

        UserData.push({
          id: userId,
          name: user.name,
          email: user.email,
          password: user.password,
          hashedPassword: `${salt}:${derivedKey.toString('hex')}`,
          salt,
          accessKey: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    });

    return;
  },
  deleteMany: (idRange = undefined) => {
    if (idRange) {
      let { minRange, maxRange } = idRange;

      if (minRange >= 0 && minRange < maxRange && maxRange > 0 && maxRange) {
        while (minRange <= maxRange) {
          const arrayItem = UserData.indexOf(minRange);

          if (arrayItem) {
            UserData.splice(arrayItem, 1);
          }

          minRange++;
        }
      }
    } else {
      UserData = [];
    }
  },
};

module.exports = { UserMethods };
