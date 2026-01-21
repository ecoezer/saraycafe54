import Escpos from 'escpos';
import dotenv from 'dotenv';
import usb from 'usb';
import SerialPort from 'serialport';

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
        const device = usb.findByIds(
          parseInt(process.env.PRINTER_VENDOR_ID || '0x04b8', 16),
          parseInt(process.env.PRINTER_PRODUCT_ID || '0x0202', 16)
        );

        if (!device) {
          reject(new Error('Epson TM-T20IV printer not found on USB'));
          return;
        }

        const options = {
          width: parseInt(process.env.PRINT_WIDTH) || 80,
          encoding: 'UTF8'
        };

        this.printer = new Escpos.USB(device, options);
        this.printer.open((error) => {
          if (error) {
            reject(new Error('Failed to open USB printer: ' + error.message));
          } else {
            this.isConnected = true;
            console.log('USB Printer connected successfully');
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  connectSerial() {
    return new Promise((resolve, reject) => {
      try {
        const port = new SerialPort.SerialPort({
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

  async printReceipt(receiptText) {
    if (!this.isConnected || !this.printer) {
      throw new Error('Printer not connected');
    }

    try {
      await this.ensureConnected();
    } catch (error) {
      throw new Error(`Printer connection check failed: ${error.message}`);
    }

    return new Promise((resolve, reject) => {
      try {
        const timeout = setTimeout(() => {
          reject(new Error('Print operation timed out'));
        }, this.connectionTimeout);

        this.printer
          .align('ct')
          .text('')
          .text(receiptText)
          .text('')
          .cut()
          .execute(() => {
            clearTimeout(timeout);
            resolve();
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async ensureConnected() {
    if (!this.isConnected || !this.printer) {
      throw new Error('Printer is not connected');
    }

    return Promise.resolve();
  }

  async testPrint() {
    if (!this.isConnected || !this.printer) {
      throw new Error('Printer not connected');
    }

    return new Promise((resolve, reject) => {
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
  }

  disconnect() {
    if (this.printer) {
      try {
        this.printer.close();
        this.isConnected = false;
        console.log('Printer disconnected');
      } catch (error) {
        console.error('Error disconnecting printer:', error);
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
