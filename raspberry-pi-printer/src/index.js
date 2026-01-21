import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrinterManager } from './printer-manager.js';
import { OrderMonitor } from './order-monitor.js';

dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let printerManager;
let orderMonitor;

async function initializeServices() {
  try {
    console.log('Initializing printer manager...');
    printerManager = new PrinterManager();

    try {
      await printerManager.connect();
    } catch (error) {
      console.warn('Initial printer connection failed, will retry:', error.message);
    }

    console.log('Initializing order monitor...');
    orderMonitor = new OrderMonitor(printerManager);
    orderMonitor.start();

    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}

app.get('/health', (req, res) => {
  const status = {
    service: 'running',
    printer: printerManager?.getStatus() || { isConnected: false },
    timestamp: new Date().toISOString()
  };
  res.json(status);
});

app.get('/printer/status', (req, res) => {
  if (!printerManager) {
    return res.status(503).json({ error: 'Printer not initialized' });
  }

  res.json(printerManager.getStatus());
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, process.env.HOST || '0.0.0.0', async () => {
  console.log(`Printer service running on http://0.0.0.0:${PORT}`);
  await initializeServices();
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  printerManager?.disconnect();
  process.exit(0);
});
