import express from 'express';
import cors from 'cors';
import routes from '../routes/index.js';
import errorHandler from '../middlewares/error.js';

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
    ]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.use(errorHandler);

export default app;