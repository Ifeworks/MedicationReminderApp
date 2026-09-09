import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// API Endpoints
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (_req, res) => {
    res.send({ status: 'Online', service: 'PB DELICACIES API' });
});

export default app;