export class ReceiptFormatter {
  constructor(width = 42) {
    this.width = width;
    this.lines = [];
  }

  addLine(text = '', align = 'left') {
    if (!text) {
      this.lines.push('');
      return;
    }

    const trimmed = text.toString().substring(0, this.width);

    if (align === 'center') {
      const spaces = Math.max(0, Math.floor((this.width - trimmed.length) / 2));
      this.lines.push(' '.repeat(spaces) + trimmed);
    } else if (align === 'right') {
      const spaces = Math.max(0, this.width - trimmed.length);
      this.lines.push(' '.repeat(spaces) + trimmed);
    } else {
      this.lines.push(trimmed);
    }
  }

  addSeparator(char = '-') {
    this.lines.push(char.repeat(this.width));
  }

  addColumns(col1, col2, col3 = null) {
    if (col3) {
      const c1 = col1.substring(0, 12).padEnd(12);
      const c2 = col2.substring(0, 15).padEnd(15);
      const c3 = col3.substring(0, 15);
      this.lines.push((c1 + c2 + c3).substring(0, this.width));
    } else {
      const c1 = col1.substring(0, 25).padEnd(25);
      const c2 = col2.substring(0, 17);
      this.lines.push((c1 + c2).substring(0, this.width));
    }
  }

  formatReceipt(order) {
    this.lines = [];

    this.addLine('', 'center');
    this.addLine('SARAY KEBAP CAFE 54', 'center');
    this.addLine('', 'center');
    this.addSeparator('=');

    this.addLine('Order #' + order.id?.substring(0, 8).toUpperCase(), 'center');

    const date = this.formatDate(order.created_at);
    this.addLine(date, 'center');
    this.addSeparator('=');

    this.addLine('');
    this.addLine('CUSTOMER INFO:');
    this.addLine(order.customer_name);
    this.addLine('Tel: ' + order.customer_phone);
    this.addLine('');
    this.addLine('DELIVERY ADDRESS:');
    this.addWrappedLines(order.delivery_address, this.width - 2);

    this.addLine('');
    this.addSeparator('-');
    this.addLine('');

    this.addLine('ITEMS:', 'left');
    this.addLine('');

    for (const item of order.items) {
      const itemLine = `${item.quantity}x Nr.${item.menuItemNumber} ${item.name}`;
      this.addWrappedLines(itemLine, this.width - 2);

      const priceStr = item.totalPrice.toFixed(2).replace('.', ',') + ' EUR';
      const price = '  ' + priceStr;
      this.lines[this.lines.length - 1] += ' '.repeat(
        Math.max(0, this.width - this.lines[this.lines.length - 1].length - priceStr.length)
      ) + priceStr;

      if (item.selectedSize) {
        this.addLine('  Size: ' + item.selectedSize.name);
      }
      if (item.selectedPastaType) {
        this.addLine('  Pasta: ' + item.selectedPastaType);
      }
      if (item.selectedSauce) {
        this.addLine('  Sauce: ' + item.selectedSauce);
      }
      if (item.selectedSideDish) {
        this.addLine('  Side: ' + item.selectedSideDish);
      }
      if (item.selectedIngredients?.length > 0) {
        this.addLine('  + ' + item.selectedIngredients.join(', '));
      }
      if (item.selectedExtras?.length > 0) {
        this.addLine('  + ' + item.selectedExtras.join(', '));
      }
      if (item.selectedExclusions?.length > 0) {
        this.addLine('  - ' + item.selectedExclusions.join(', '));
      }
      this.addLine('');
    }

    if (order.notes) {
      this.addSeparator('-');
      this.addLine('NOTES:');
      this.addWrappedLines(order.notes, this.width - 2);
      this.addLine('');
    }

    this.addSeparator('=');
    this.addLine('');

    const totalStr = 'TOTAL: ' + order.total_amount.toFixed(2).replace('.', ',') + ' EUR';
    this.addLine(totalStr, 'center');

    this.addLine('');
    this.addLine('Thank you for your order!', 'center');
    this.addLine('Vielen Dank!', 'center');
    this.addLine('');
    this.addSeparator('=');
    this.addLine('');

    return this.lines.join('\n');
  }

  addWrappedLines(text, maxWidth) {
    const words = text.split(' ');
    let currentLine = '  ';

    for (const word of words) {
      if ((currentLine + word).length > maxWidth) {
        if (currentLine.trim()) {
          this.addLine(currentLine);
        }
        currentLine = '  ' + word;
      } else {
        currentLine += (currentLine.length === 2 ? '' : ' ') + word;
      }
    }

    if (currentLine.trim()) {
      this.addLine(currentLine);
    }
  }

  formatDate(timestamp) {
    let date;

    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getLines() {
    return this.lines;
  }

  getText() {
    return this.lines.join('\n');
  }
}
