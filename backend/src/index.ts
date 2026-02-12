import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './middleware/logger';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Import all module routes
import authRoutes from './modules/auth/auth.routes';
import aiRouterRoutes from './modules/ai-router/aiRouter.routes';
import aiRoutingEngineRoutes from './modules/ai-routing-engine/aiRoutingEngine.routes';
import cloudRoutes from './modules/cloud/cloud.routes';
import domainRoutes from './modules/domains/domain.routes';
import hostingRoutes from './modules/hosting/hosting.routes';
import workflowRoutes from './modules/workflows/workflow.routes';
import uiBuilderRoutes from './modules/ui-builder/uiBuilder.routes';
import aiIdeRoutes from './modules/ai-ide/aiIde.routes';
import billingRoutes from './modules/billing/billing.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// Global middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);
app.use(rateLimiter);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Mount all module routes under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRouterRoutes);
app.use('/api/v1/ai/routing', aiRoutingEngineRoutes);
app.use('/api/v1/cloud', cloudRoutes);
app.use('/api/v1/domains', domainRoutes);
app.use('/api/v1/hosting', hostingRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/builder', uiBuilderRoutes);
app.use('/api/v1/ai-ide', aiIdeRoutes);
app.use('/api/v1/billing', billingRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server] Masidy backend running on http://localhost:${PORT}`);
});
