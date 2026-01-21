# Automatic Thermal Receipt Printing Setup Guide

This guide explains how to set up automatic receipt printing on an Epson TM-T20IV thermal printer connected to a Raspberry Pi.

## Overview

The system consists of two parts:

1. **Frontend**: Your existing React web application with print status tracking
2. **Backend**: Node.js service running on Raspberry Pi that monitors Firebase for new orders and automatically prints receipts

### How It Works

1. Customer places an order via the web app
2. Order is saved to Firebase Firestore
3. Raspberry Pi backend detects the new order in real-time
4. Receipt is formatted and automatically printed to the thermal printer
5. Print status is updated in Firebase and displayed in the admin panel

## Prerequisites

- Raspberry Pi (4B or later recommended)
- Epson TM-T20IV thermal printer with USB or Serial cable
- Node.js 18+ installed on Raspberry Pi
- Firebase project with Firestore database
- Network connection between Pi and cafe computer

## Installation Steps

### Step 1: Prepare Your Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click Settings (gear icon) → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Save the JSON file safely (you'll need the credentials)

### Step 2: Set Up Raspberry Pi

Follow the detailed guide at `/raspberry-pi-printer/INSTALLATION.md`:

```bash
# SSH into your Raspberry Pi
ssh pi@<raspberry-pi-ip>

# Clone or navigate to the project
cd /path/to/saray-kebap-cafe54/raspberry-pi-printer

# Copy environment template
cp .env.example .env

# Edit with your Firebase credentials
nano .env
```

Key environment variables to configure:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY` (from service account JSON)
- `FIREBASE_CLIENT_EMAIL`
- `PRINTER_TYPE` (usb or serial)

### Step 3: Test the Printer Connection

```bash
# Start the service
npm run dev

# In another terminal, test connectivity
curl http://localhost:3001/health

# Send a test print
curl -X POST http://localhost:3001/printer/test
```

You should see a test receipt print from your Epson printer!

### Step 4: Set Up Automatic Startup

Create a systemd service so the printer service starts automatically:

```bash
sudo nano /etc/systemd/system/saray-printer.service
```

Copy the service configuration from INSTALLATION.md, then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable saray-printer.service
sudo systemctl start saray-printer.service
```

### Step 5: Update Frontend Configuration (If Needed)

If your Raspberry Pi has a different IP address than localhost, update the backend URL in:

**File**: `src/services/FirebaseService.ts`

Change:
```typescript
const apiUrl = `http://localhost:3001/orders/${orderId}/reprint`;
```

To:
```typescript
const apiUrl = `http://192.168.x.x:3001/orders/${orderId}/reprint`;
```

Then rebuild:
```bash
npm run build
```

## Admin Features

### Printer Status Panel

The admin dashboard now displays:
- Printer connection status (Connected/Disconnected)
- Connection type (USB/Serial)
- Last status check time
- Test print button

### Print Status Indicators

Each order in the history shows:
- **Green "Gedruckt"** badge: Order successfully printed
- **Red "Fehler"** badge: Print failed (you can retry)
- Timestamp when order was printed

### Reprint Button

Click the printer icon on any order to manually send it to print again.

## API Endpoints

The Raspberry Pi backend provides these endpoints:

### Get Health Status
```
GET http://localhost:3001/health
```

### Check Printer Status
```
GET http://localhost:3001/printer/status
```

Response:
```json
{
  "isConnected": true,
  "type": "usb",
  "timestamp": "2024-01-21T12:30:45.123Z"
}
```

### Connect to Printer
```
POST http://localhost:3001/printer/connect
```

### Send Test Print
```
POST http://localhost:3001/printer/test
```

### Reprint an Order
```
POST http://localhost:3001/orders/{orderId}/reprint
```

### Check Print Queue Status
```
GET http://localhost:3001/queue/status
```

Response:
```json
{
  "queueSize": 2,
  "isPrinting": false,
  "printedOrdersCount": 145
}
```

## Firebase Database Schema

Print-related fields added to each order:

```
orders/{orderId}
├── customer_name: string
├── customer_phone: string
├── delivery_address: string
├── items: array
├── total_amount: number
├── created_at: timestamp
├── printed: boolean          // NEW
├── print_timestamp: timestamp // NEW
├── print_retry_count: number // NEW
└── print_error: string       // NEW (if failed)
```

## Automatic Print Behavior

### When an Order is Received

1. Raspberry Pi detects new order instantly
2. Formats receipt with:
   - Order number and timestamp
   - Customer name, phone, address
   - Itemized list with prices
   - Special instructions/notes
   - Order total
3. Sends ESC/POS commands to thermal printer
4. Paper automatically cuts after each receipt
5. Updates Firebase with `printed: true`

### Error Handling

If printing fails:
1. Automatically retries up to 3 times with delays
2. Updates Firebase with error message
3. Shows "Fehler" badge in admin panel
4. You can manually reprint by clicking the printer icon

### Duplicate Prevention

The system tracks printed orders to prevent:
- Reprinting the same order twice
- Printing corrupted/incomplete orders
- Race conditions from network delays

## Troubleshooting

### Printer Not Printing

1. Check printer is powered on and paper loaded
2. Verify USB/Serial connection
3. Run diagnostic:
   ```bash
   curl http://localhost:3001/printer/status
   ```

### "Connection Refused" Error

1. Verify Raspberry Pi service is running:
   ```bash
   sudo systemctl status saray-printer.service
   ```

2. Check the service logs:
   ```bash
   sudo journalctl -u saray-printer.service -f
   ```

### Firebase Authentication Failed

1. Verify credentials in `.env`:
   - Project ID is correct
   - Private key has all newlines properly escaped
   - Client email matches your service account

2. Test Firebase connection:
   ```bash
   npm run dev
   # Watch console for Firebase connection messages
   ```

### Print Quality Issues

Adjust thermal print density in `.env`:
```
PRINT_DENSITY=0.8
```

Range: 0.5 (light) to 1.0 (dark)

## Monitoring

### View Service Logs

```bash
sudo journalctl -u saray-printer.service -n 100 -f
```

### Check Queue Status

Orders waiting to print:
```bash
curl http://localhost:3001/queue/status
```

### Monitor CPU/Memory

```bash
htop
```

The printer service is lightweight and should use <5% CPU when idle.

## Maintenance

### Update the Printer Service

```bash
cd /path/to/raspberry-pi-printer
git pull
npm install
sudo systemctl restart saray-printer.service
```

### Restart Service

```bash
sudo systemctl restart saray-printer.service
```

### Stop Service Temporarily

```bash
sudo systemctl stop saray-printer.service
```

### Check Service Auto-Start

```bash
sudo systemctl is-enabled saray-printer.service
```

## Performance Notes

- Print queue processes one order at a time
- Each receipt takes 2-5 seconds to print
- System handles multiple simultaneous orders gracefully
- Automatic paper cut after each receipt
- No data loss if service crashes (queue persists in Firebase)

## Production Deployment

Before going live, verify:

1. ✓ Printer physically connected and powered on
2. ✓ Firebase credentials configured
3. ✓ Service auto-starts on Raspberry Pi reboot
4. ✓ Test receipts print correctly
5. ✓ Admin panel shows printer status
6. ✓ Manual reprint works from admin dashboard
7. ✓ Error notifications appear for failed prints
8. ✓ Network connectivity is stable

## Support

For issues, check:

1. **Service logs**: `sudo journalctl -u saray-printer.service`
2. **Printer connection**: `curl http://localhost:3001/health`
3. **Firebase access**: Verify credentials in `.env`
4. **Network**: Verify Raspberry Pi can reach your Firebase project

## File Structure

```
raspberry-pi-printer/
├── src/
│   ├── index.js           # Main service entry point
│   ├── firebase-config.js # Firebase initialization
│   ├── printer-manager.js # Printer connection/printing logic
│   ├── receipt-formatter.js # Receipt text formatting
│   └── order-monitor.js   # Firebase listener & print queue
├── .env.example           # Environment variables template
├── package.json           # Node dependencies
├── INSTALLATION.md        # Detailed setup guide
└── README.md             # Overview
```

## Next Steps

1. Follow INSTALLATION.md for detailed Raspberry Pi setup
2. Configure Firebase credentials in .env
3. Test printer connection with curl
4. Set up systemd service for auto-start
5. Monitor logs as orders come in
6. Adjust print settings if needed

You're all set! Orders will now print automatically the moment they're placed.
