const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const sequelize = new Sequelize('neondb', 'neondb_owner', 'RI26ATlzmwMu', {
  host: 'ep-jolly-scene-a17kttvn.ap-southeast-1.aws.neon.tech',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// User model
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'instructor'), allowNull: false },
});

// Course model
const Course = sequelize.define('Course', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  instructorId: { type: DataTypes.INTEGER, allowNull: false },
});

// Discussion Post model
const DiscussionPost = sequelize.define('DiscussionPost', {
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  courseId: { type: DataTypes.INTEGER, allowNull: false },
});

// Sync database
sequelize.sync();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'learning_platform_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes for authentication
app.post('/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id, role: user.role }, 'learning_platform_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Course management (only accessible by instructors)
app.post('/courses', authenticateToken, async (req, res) => {
  if (req.user.role !== 'instructor') return res.sendStatus(403);
  const { title, description } = req.body;
  try {
    const course = await Course.create({ title, description, instructorId: req.user.userId });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error creating course' });
  }
});

app.get('/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Discussion Forum (accessible by both students and instructors)
app.post('/discussion/:courseId', authenticateToken, async (req, res) => {
  const { courseId } = req.params;
  const { content } = req.body;
  try {
    const post = await DiscussionPost.create({ content, userId: req.user.userId, courseId });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error posting message' });
  }
});

app.get('/discussion/:courseId', authenticateToken, async (req, res) => {
  const { courseId } = req.params;
  try {
    const posts = await DiscussionPost.findAll({ where: { courseId } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching discussion posts' });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
