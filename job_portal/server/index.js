const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

const port = 3000;
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const sequelize = new Sequelize('neondb', 'neondb_owner', 'KSgALrk30VFJ', {
    host: 'ep-misty-star-a8x5sj4e.eastus2.azure.neon.tech',
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

// User model for job seekers or employers
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
});

// Job model for job postings
const Job = sequelize.define('Job', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    salary: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    postedBy: { type: DataTypes.INTEGER, allowNull: false } // Reference to User
});

// Application model for job applications
const Application = sequelize.define('Application', {
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
    jobId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Job, key: 'id' } },
    status: { type: DataTypes.ENUM('applied', 'interview', 'hired', 'rejected'), allowNull: false, defaultValue: 'applied' }
});

// Sync models with the database
sequelize.sync();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'abc', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User registration
app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPass });
        res.status(201).json({ message: 'User  created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// User login
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user.id }, 'abc', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error during login' });
    }
});

// Get all users
app.get('/user', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
});

// Get a specific user by ID
app.get('/user/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: ['id', 'username'] });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user' });
    }
});

// Update a user
app.put('/user/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        const user = await User.findByPk(id);
        if (user) {
            await user.update({ username });
            res.json(user);
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Create a new job posting
app.post('/jobs', authenticateToken, async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;
        const job = await Job.create({ title, description, company, location, salary, postedBy: req.user.userId });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Error creating job' });
    }
});

// Get all job postings
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.findAll();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving jobs' });
    }
});

// Get a specific job by ID
app.get('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findByPk(id);
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving the job' });
    }
});

// Apply for a job
app.post('/jobs/:id/apply', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const application = await Application.create({ userId: req.user.userId, jobId: id });
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: 'Error applying for job' });
    }
});

// Get applications for a specific job
app.get('/jobs/:id/applications', async (req, res) => {
    const { id } = req.params;
    try {
        const applications = await Application.findAll({ where: { jobId: id }, include: User });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving applications' });
    }
});

// Update application status
app.put('/applications/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const application = await Application.findByPk(id);
        if (application) {
            await application.update({ status });
            res.json(application);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating application status' });
    }
});

// Update a job posting
app.put('/jobs/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findByPk(id);
        if (job && job.postedBy === req.user.userId) {
            const { title, description, company, location, salary } = req.body;
            await job.update({ title, description, company, location, salary });
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating job' });
    }
});

// Delete a job posting
app.delete('/jobs/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findByPk(id);
        if (job && job.postedBy === req.user.userId) {
            await job.destroy();
            res.json({ message: 'Job deleted' });
        } else {
            res.status(404).json({ message: ' Job not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting job' });
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
