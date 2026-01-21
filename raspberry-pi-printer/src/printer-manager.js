import Escpos from 'escpos';
import dotenv from 'dotenv';
import usb from 'usb';
import { SerialPort } from 'serialport';

dotenv.config();

export class PrinterManager {
  constructor() {
    this.printer = null;
    this.isConnected = false;
    this.printerType = process.env.PRINTER_TYPE || 'usb';
    this.connectionTimeout = parseInt(process.env.PRINT_TIMEOUT) || 10000;
  }

  async connect() {
    try {
      if (this.printerType === 'usb') {
        return await this.connectUSB();
      } else if (this.printerType === 'serial') {
        return await this.connectSerial();
      }
    } catch (error) {
      console.error('Printer connection error:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  connectUSB() {
    return new Promise((resolve, reject) => {
      try {
        const vendorId = parseInt(process.env.PRINTER_VENDOR_ID || '0x04b8', 16);
        const productId = parseInt(process.env.PRINTER_PRODUCT_ID || '0x0202', 16);

        console.log(`Searching for USB printer: VID=${vendorId.toString(16)}, PID=${productId.toString(16)}`);

        const device = usb.findByIds(vendorId, productId);

        if (!device) {
          reject(new Error(`Epson TM-T20IV printer not found on USB (VID:${vendorId.toString(16)}, PID:${productId.toString(16)})`));
          return;
        }

        const options = {
          width: parseInt(process.env.PRINT_WIDTH) || 80,
          encoding: 'UTF8'
        };

        this.printer = new Escpos.USB(device, options);
        this.printer.open((error) => {
          if (error) {
            console.error('USB device open error:', error);
            reject(new Error('Failed to open USB printer: ' + error.message));
          } else {
            this.isConnected = true;
            console.log('USB Printer connected successfully');
            resolve();
          }
        });
      } catch (error) {
        console.error('USB connection error:', error);
        reject(error);
      }
    });
  }

  connectSerial() {
    return new Promise((resolve, reject) => {
      try {
        const port = new SerialPort({
          path: process.env.PRINTER_SERIAL_PORT || '/dev/ttyUSB0',
          baudRate: parseInt(process.env.PRINTER_BAUD_RATE) || 9600,
          dataBits: 8,
          stopBits: 1,
          parity: 'none',
          flowControl: false,
          autoOpen: false
        });

        port.open((error) => {
          if (error) {
            reject(new Error('Failed to open serial port: ' + error.message));
          } else {
            const options = {
              width: parseInt(process.env.PRINT_WIDTH) || 80,
              encoding: 'UTF8'
            };

            this.printer = new Escpos.Serial(port, options);
            this.isConnected = true;
            console.log('Serial Printer connected successfully');
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async printReceipt(receiptText, boldLines = new Set()) {
    let printSuccess = false;

    try {
      if (!this.isConnected || !this.printer) {
        await this.reconnect();
      }

      await this.ensureConnected();

      await new Promise((resolve, reject) => {
        try {
          const timeout = setTimeout(() => {
            reject(new Error('Print operation timed out'));
          }, this.connectionTimeout);

          const lines = receiptText.split('\n');
          const printChain = this.printer.align('ct').text('');

          lines.forEach((line, index) => {
            if (boldLines.has(index)) {
              printChain.bold(true).text(line).bold(false);
            } else {
              printChain.text(line);
            }
          });

          printChain
            .text('')
            .cut()
            .execute(() => {
              clearTimeout(timeout);
              printSuccess = true;
              resolve();
            });
        } catch (error) {
          reject(error);
        }
      });

      await this.resetAfterPrint();
    } catch (error) {
      throw new Error(`Print operation failed: ${error.message}`);
    }
  }

  async ensureConnected() {
    if (!this.isConnected || !this.printer) {
      throw new Error('Printer is not connected');
    }

    return Promise.resolve();
  }

  async reconnect() {
    console.log('Attempting to reconnect to printer...');
    this.disconnect();

    await new Promise(resolve => setTimeout(resolve, 500));

    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        await this.connect();
        console.log('Printer reconnected successfully');
        return;
      } catch (error) {
        retries++;
        if (retries < maxRetries) {
          const delay = 500 * Math.pow(2, retries - 1);
          console.warn(`Reconnection attempt ${retries} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw new Error(`Failed to reconnect after ${maxRetries} attempts: ${error.message}`);
        }
      }
    }
  }

  async resetAfterPrint() {
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          this.disconnect();
          resolve();
        }, 300);
      });

      console.log('Printer connection closed and reset');
    } catch (error) {
      console.warn('Error during printer reset:', error.message);
    }
  }

  async testPrint() {
    try {
      if (!this.isConnected || !this.printer) {
        await this.reconnect();
      }

      await new Promise((resolve, reject) => {
        try {
          const testReceipt = `
TEST RECEIPT
SARAY KEBAP CAFE 54

Printer Status: OK
Connection: ${this.printerType.toUpperCase()}
Encoding: UTF-8

Test successful!

          `.trim();

          this.printer
            .align('ct')
            .text(testReceipt)
            .text('')
            .cut()
            .execute(() => {
              resolve();
            });
        } catch (error) {
          reject(error);
        }
      });

      await this.resetAfterPrint();
    } catch (error) {
      throw new Error(`Test print failed: ${error.message}`);
    }
  }

  disconnect() {
    if (this.printer) {
      try {
        if (this.printer.close && typeof this.printer.close === 'function') {
          this.printer.close();
        }
        this.isConnected = false;
        this.printer = null;
        console.log('Printer disconnected');
      } catch (error) {
        console.error('Error disconnecting printer:', error);
        this.printer = null;
      }
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      type: this.printerType,
      timestamp: new Date().toISOString()
    };
  }
}
