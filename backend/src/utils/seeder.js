require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { ROLES, TASK_STATUS } = require('../constants');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});

  // Create users
  const admin = await User.create({
    name: 'Alice Admin',
    email: 'admin@taskmanager.com',
    password: 'admin123',
    role: ROLES.ADMIN,
  });

  const member1 = await User.create({
    name: 'Bob Developer',
    email: 'bob@taskmanager.com',
    password: 'member123',
    role: ROLES.MEMBER,
  });

  const member2 = await User.create({
    name: 'Carol Designer',
    email: 'carol@taskmanager.com',
    password: 'member123',
    role: ROLES.MEMBER,
  });

  console.log('✅ Users created');

  // Create projects
  const project1 = await Project.create({
    name: 'E-Commerce Platform',
    description: 'Building a full-stack e-commerce platform with React and Node.js',
    createdBy: admin._id,
    members: [admin._id, member1._id, member2._id],
  });

  const project2 = await Project.create({
    name: 'Mobile App Redesign',
    description: 'Redesigning the mobile app UI/UX for better user experience',
    createdBy: admin._id,
    members: [admin._id, member2._id],
  });

  const project3 = await Project.create({
    name: 'API Integration',
    description: 'Integrating third-party payment APIs and webhook systems',
    createdBy: admin._id,
    members: [admin._id, member1._id],
  });

  console.log('✅ Projects created');

  const now = new Date();
  const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const farFuture = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  // Tasks for Project 1
  await Task.create([
    {
      title: 'Setup project structure',
      description: 'Initialize the React and Node.js project with proper folder structure',
      projectId: project1._id,
      assignedTo: member1._id,
      status: TASK_STATUS.DONE,
      dueDate: pastDate,
      createdBy: admin._id,
    },
    {
      title: 'Design product listing page',
      description: 'Create responsive product listing with filters and search',
      projectId: project1._id,
      assignedTo: member2._id,
      status: TASK_STATUS.IN_PROGRESS,
      dueDate: futureDate,
      createdBy: admin._id,
    },
    {
      title: 'Implement shopping cart',
      description: 'Build cart functionality with local storage persistence',
      projectId: project1._id,
      assignedTo: member1._id,
      status: TASK_STATUS.TODO,
      dueDate: farFuture,
      createdBy: admin._id,
    },
    {
      title: 'Payment gateway integration',
      description: 'Integrate Stripe payment processing',
      projectId: project1._id,
      assignedTo: member1._id,
      status: TASK_STATUS.TODO,
      dueDate: pastDate, // Overdue
      createdBy: admin._id,
    },
    {
      title: 'User authentication flow',
      description: 'Implement login/signup with email verification',
      projectId: project1._id,
      assignedTo: member2._id,
      status: TASK_STATUS.IN_PROGRESS,
      dueDate: pastDate, // Overdue
      createdBy: admin._id,
    },
  ]);

  // Tasks for Project 2
  await Task.create([
    {
      title: 'User research and wireframes',
      description: 'Conduct user interviews and create wireframes',
      projectId: project2._id,
      assignedTo: member2._id,
      status: TASK_STATUS.DONE,
      dueDate: pastDate,
      createdBy: admin._id,
    },
    {
      title: 'Design system creation',
      description: 'Build component library and design tokens',
      projectId: project2._id,
      assignedTo: member2._id,
      status: TASK_STATUS.IN_PROGRESS,
      dueDate: futureDate,
      createdBy: admin._id,
    },
    {
      title: 'Prototype testing',
      description: 'A/B test new designs with user focus groups',
      projectId: project2._id,
      assignedTo: member2._id,
      status: TASK_STATUS.TODO,
      dueDate: farFuture,
      createdBy: admin._id,
    },
  ]);

  // Tasks for Project 3
  await Task.create([
    {
      title: 'Research payment API providers',
      description: 'Evaluate Stripe, Razorpay, and PayPal APIs',
      projectId: project3._id,
      assignedTo: member1._id,
      status: TASK_STATUS.DONE,
      dueDate: pastDate,
      createdBy: admin._id,
    },
    {
      title: 'Implement webhook handlers',
      description: 'Build secure webhook endpoints for payment events',
      projectId: project3._id,
      assignedTo: member1._id,
      status: TASK_STATUS.TODO,
      dueDate: pastDate, // Overdue
      createdBy: admin._id,
    },
  ]);

  console.log('✅ Tasks created');
  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📧 Login credentials:');
  console.log('   Admin:  admin@taskmanager.com  / admin123');
  console.log('   Member: bob@taskmanager.com    / member123');
  console.log('   Member: carol@taskmanager.com  / member123');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
