const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { errorHandler, notFound } = require('./middleware/error');
const { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } = require('./config');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const path = require('path');

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({ windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false });
app.use('/api', limiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Swagger docs
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'Production-ready Notes App backend API documentation',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [path.join(__dirname, './docs/openapi.yaml')],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 and error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
