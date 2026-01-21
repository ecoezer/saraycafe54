import { db } from './firebase-config.js';
import { ReceiptFormatter } from './receipt-formatter.js';

export class OrderMonitor {
  constructor(printerManager) {
    this.printerManager = printerManager;
    this.printedOrders = new Set();
    this.printQueue = [];
    this.isPrinting = false;
    this.maxRetries = 3;
    this.retryDelays = [1000, 3000, 5000];
  }

  start() {
    console.log('Starting order monitor...');
    this.setupRealtimeListener();
    this.setupCommandListener();
    this.startStatusUpdates();
  }

  setupRealtimeListener() {
    const unsubscribe = db
      .collection('orders')
      .orderBy('created_at', 'desc')
      .limit(100)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const order = {
                id: change.doc.id,
                ...change.doc.data()
              };

              if (!order.printed) {
                console.log(`New order received: ${order.id}`);
                this.addToQueue(order);
              }
            }
          });
        },
        (error) => {
          console.error('Error listening to orders:', error);
          setTimeout(() => this.setupRealtimeListener(), 5000);
        }
      );

    process.on('SIGINT', () => {
      unsubscribe();
      process.exit(0);
    });
  }

  addToQueue(order) {
    if (!this.printedOrders.has(order.id)) {
      this.printQueue.push({
        order,
        retryCount: 0
      });
      this.processPrintQueue();
    }
  }

  async processPrintQueue() {
    if (this.isPrinting || this.printQueue.length === 0) {
      return;
    }

    this.isPrinting = true;

    try {
      const printJob = this.printQueue.shift();
      await this.printOrder(printJob);
    } catch (error) {
      console.error('Error processing print queue:', error);
    } finally {
      this.isPrinting = false;

      if (this.printQueue.length > 0) {
        setTimeout(() => this.processPrintQueue(), 500);
      }
    }
  }

  async printOrder(printJob) {
    const { order, retryCount } = printJob;

    try {
      console.log(`Printing order ${order.id}...`);

      const formatter = new ReceiptFormatter();
      const receiptText = formatter.formatReceipt(order);

      await this.printerManager.printReceipt(receiptText);

      await db.collection('orders').doc(order.id).update({
        printed: true,
        print_timestamp: new Date(),
        print_retry_count: retryCount
      });

      this.printedOrders.add(order.id);
      console.log(`Order ${order.id} printed successfully`);
    } catch (error) {
      console.error(`Print error for order ${order.id}:`, error.message);

      if (retryCount < this.maxRetries) {
        const delay = this.retryDelays[retryCount];
        console.log(
          `Retrying order ${order.id} in ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`
        );

        setTimeout(() => {
          this.printQueue.push({
            order,
            retryCount: retryCount + 1
          });
          this.processPrintQueue();
        }, delay);
      } else {
        await db.collection('orders').doc(order.id).update({
          printed: false,
          print_error: error.message,
          print_retry_count: retryCount
        });

        console.error(`Failed to print order ${order.id} after ${this.maxRetries} retries`);
      }
    }
  }

  setupCommandListener() {
    console.log('Setting up Firebase command listener...');
    db.collection('printer_commands')
      .where('processed', '==', false)
      .onSnapshot(
        async (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const command = {
                id: change.doc.id,
                ...change.doc.data()
              };

              console.log(`Received command: ${command.command_type}`);

              try {
                if (command.command_type === 'reprint' && command.order_id) {
                  await this.reprintOrder(command.order_id);
                } else if (command.command_type === 'test') {
                  await this.printerManager.testPrint();
                }

                await db.collection('printer_commands').doc(command.id).update({
                  processed: true,
                  processed_at: new Date()
                });
              } catch (error) {
                console.error(`Error processing command ${command.id}:`, error.message);
              }
            }
          });
        },
        (error) => {
          console.error('Error listening to commands:', error);
          setTimeout(() => this.setupCommandListener(), 5000);
        }
      );
  }

  startStatusUpdates() {
    console.log('Starting periodic status updates to Firebase...');
    setInterval(async () => {
      try {
        const status = this.printerManager.getStatus();
        await db.collection('printer_status').doc('current').set({
          connected: status.isConnected,
          connection_type: status.type,
          last_update: new Date().toISOString(),
          queue_size: this.printQueue.length,
          total_printed_count: this.printedOrders.size
        });
      } catch (error) {
        console.error('Error updating printer status to Firebase:', error.message);
      }
    }, 10000);
  }

  async reprintOrder(orderId) {
    try {
      const orderDoc = await db.collection('orders').doc(orderId).get();

      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }

      const order = {
        id: orderDoc.id,
        ...orderDoc.data()
      };

      console.log(`Manual reprint requested for order ${orderId}`);

      await this.printOrder({
        order,
        retryCount: 0
      });
    } catch (error) {
      console.error(`Reprint error for order ${orderId}:`, error.message);
      throw error;
    }
  }
}
