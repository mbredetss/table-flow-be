import 'dotenv/config';
import server from './server/index.js';
import process from 'process';

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`server listening to http://localhost:${port}`);
});