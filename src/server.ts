import express, { Application } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import blogRouter from './routes/blog.route';

import { initializeDatabase } from './setupDatabase';

dotenv.config();

const app: Application = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

initializeDatabase()
    .then(() => {
        console.log('Database setup complete.');
        app.use('/auth', authRouter);
        app.use('/blogs', blogRouter);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to set up database:', error);
    });
