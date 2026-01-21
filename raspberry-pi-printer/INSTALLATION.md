# Raspberry Pi Printer Service Installation Guide

## Prerequisites

- Raspberry Pi (4B or newer recommended)
- Epson TM-T20IV thermal printer
- USB or Serial connection to the printer
- Node.js 18+ installed on Raspberry Pi
- Access to your Firebase project credentials

## Step 1: System Setup

### Update System Packages
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### Install Node.js (if not already installed)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install CUPS and Printer Drivers
```bash
sudo apt-get install -y cups libcups2-dev
sudo usermod -a -G lpadmin pi
```

### Install Python Dependencies (for USB support)
```bash
sudo apt-get install -y python3-pip libusb-1.0-0-dev libhidapi-dev
pip3 install pyusb
```

## Step 2: Configure Printer Connection

### For USB Connection:
1. Connect the Epson TM-T20IV to the Raspberry Pi via USB
2. Verify connection:
```bash
lsusb
```
Look for an Epson device (typically `04b8:0202`)

3. Set permissions:
```bash
sudo nano /etc/udev/rules.d/10-local-epson.rules
```

Add this line:
```
SUBSYSTEMS=="usb", ATTRS{idVendor}=="04b8", ATTRS{idProduct}=="0202", MODE="0666"
```

4. Reload udev rules:
```bash
sudo udevadm control --reload
sudo udevadm trigger
```

### For Serial Connection:
1. Connect the printer to the Raspberry Pi serial port
2. Verify connection:
```bash
ls -la /dev/ttyUSB*
```

3. Set permissions:
```bash
sudo usermod -a -G dialout $USER
```

## Step 3: Install Printer Service

### Navigate to Project Directory
```bash
cd /path/to/saray-kebap-cafe54
cd raspberry-pi-printer
```

### Install Dependencies
```bash
npm install
```

### Create Environment File
```bash
cp .env.example .env
```

### Configure Environment Variables
Edit the `.env` file with your settings:
```bash
nano .env
```

Required variables:
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key (from service account JSON)
- `FIREBASE_CLIENT_EMAIL`: Your Firebase service account email

Optional variables:
- `PRINTER_TYPE`: "usb" or "serial" (default: "usb")
- `PRINTER_VENDOR_ID`: USB vendor ID (default: 0x04b8 for Epson)
- `PRINTER_PRODUCT_ID`: USB product ID (default: 0x0202 for TM-T20IV)
- `PRINTER_SERIAL_PORT`: Serial port path (default: /dev/ttyUSB0)
- `PRINTER_BAUD_RATE`: Serial baud rate (default: 9600)
- `PORT`: Backend service port (default: 3001)

## Step 4: Test the Service

### Run in Development Mode
```bash
npm run dev
```

The service should output:
```
Printer service running on http://0.0.0.0:3001
```

### Test Printer Connection
```bash
curl http://localhost:3001/health
```

You should see the printer status JSON response.

### Verify Firebase Connection

Check that the service is writing to Firebase:
1. Open [Firebase Console](https://console.firebase.google.com)
2. Navigate to Firestore Database
3. Look for `printer_status/current` document with printer connection info

## Step 5: Create Systemd Service

### Create Service File
```bash
sudo nano /etc/systemd/system/saray-printer.service
```

Add the following:
```ini
[Unit]
Description=Saray Kebap Printer Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/projects/saray-kebap-cafe54/raspberry-pi-printer
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
RestartSec=10
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable saray-printer.service
sudo systemctl start saray-printer.service
```

### Check Service Status
```bash
sudo systemctl status saray-printer.service
```

### View Service Logs
```bash
sudo journalctl -u saray-printer.service -f
```

## Step 6: Frontend Configuration (Firebase Only)

The frontend communicates with this service entirely through Firebase Firestore:

- **No HTTP endpoints** to configure on the frontend
- **Firebase listeners** monitor printer status in real-time
- **Commands** are sent via Firebase collections (reprint, test print)

No frontend code changes are needed. Simply ensure:
1. Frontend has Firebase credentials in `.env`
2. Raspberry Pi service has Firebase credentials in `.env`
3. Both services connect to the same Firebase project

See ARCHITECTURE.md for complete details on the real-time communication flow.

## Troubleshooting

### Printer Not Found
```bash
# Check USB device
lsusb

# Check dmesg for USB errors
dmesg | grep -i epson
```

### Permission Denied Errors
```bash
# Check device permissions
ls -la /dev/usb*
ls -la /dev/lp*

# Fix permissions
sudo chmod 666 /dev/usb/lp0
```

### Service Not Starting
```bash
# Check logs
sudo journalctl -u saray-printer.service -n 50

# Check Node.js
node --version

# Check npm packages
npm list
```

### Firebase Authentication Issues
- Verify your service account JSON credentials
- Check that the private key is properly escaped in .env file
- Ensure Firebase project ID matches exactly

### Print Quality Issues
Adjust these settings in `.env`:
- `PRINT_DENSITY`: 0.5 - 1.0 (default: 0.8)
- `PRINT_WIDTH`: 80 or 40 (depends on paper width)

## API Endpoints

### Health Check
```
GET /health
```

### Printer Status
```
GET /printer/status
```

### Connect to Printer
```
POST /printer/connect
```

### Send Test Print
```
POST /printer/test
```

### Reprint Order
```
POST /orders/:orderId/reprint
```

### Queue Status
```
GET /queue/status
```

## Maintenance

### Update Service Code
```bash
cd /path/to/saray-kebap-cafe54/raspberry-pi-printer
git pull
npm install
sudo systemctl restart saray-printer.service
```

### Check Disk Space
```bash
df -h
```

### Monitor Resource Usage
```bash
top
# or
htop
```

## Production Checklist

- [ ] Printer connection tested and working
- [ ] Firebase credentials configured
- [ ] Service starts automatically on boot
- [ ] Logs are accessible for debugging
- [ ] Network connectivity stable
- [ ] Test orders print successfully
- [ ] Manual reprint functionality works
- [ ] Admin panel shows printer status
- [ ] Error handling working properly
