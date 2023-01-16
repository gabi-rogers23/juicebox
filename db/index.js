const { Client } = require("pg"); // imports the pg module

const client = new Client("postgres://localhost:5432/juicebox-dev");

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, name, location) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      INSERT INTO posts("authorId", title, content) 
      VALUES($1, $2, $3)  
      RETURNING *;
    `,
      [authorId, title, content]
    );

    return post;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, name, location, active FROM users;`
  );

  return rows;
}

async function getAllPosts() {
  const { rows } = await client.query(
    `SELECT id, "authorId", title, content, active FROM posts;`
  );

  return rows;
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${userId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows } = await client.query(`
    SELECT * FROM users
    WHERE "id"=${userId};
    `);

    if (rows.length === 0) {
      return null;
    } else {
      // delete the 'password' key from the returned object
      const user = rows[0];
      user.password = null;
      // get their posts (use getPostsByUser)
      // then add the posts to the user object with key 'posts'
      user.posts = await getPostsByUser(userId);
      // return the user object
      return user;
    }
  } catch (error) {
    console.log("Get User by Id Failed")
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [authorId],
    } = await client.query(
      `
      UPDATE posts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return authorId;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  createUser,
  getAllUsers,
  updateUser,
  createPost,
  getAllPosts,
  updatePost,
  getUserById,
};
