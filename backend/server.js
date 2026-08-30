const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routers/auth');
const eventsRouter = require('./routers/events');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);

const PORT = process.env.PORT || 1324;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
