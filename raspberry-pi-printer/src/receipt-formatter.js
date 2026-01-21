export class ReceiptFormatter {
  constructor(width = 42) {
    this.width = width;
    this.lines = [];
    this.boldLines = new Set();
  }

  addLine(text = '', align = 'center', isBold = false) {
    if (!text) {
      this.lines.push('');
      return;
    }

    const trimmed = text.toString().substring(0, this.width);

    if (align === 'center') {
      const spaces = Math.max(0, Math.floor((this.width - trimmed.length) / 2));
      const line = ' '.repeat(spaces) + trimmed;
      this.lines.push(line);
    } else if (align === 'right') {
      const spaces = Math.max(0, this.width - trimmed.length);
      this.lines.push(' '.repeat(spaces) + trimmed);
    } else {
      this.lines.push(trimmed);
    }

    if (isBold) {
      this.boldLines.add(this.lines.length - 1);
    }
  }

  addSeparator(char = '-') {
    this.lines.push(char.repeat(this.width));
  }

  formatReceipt(order) {
    this.lines = [];
    this.boldLines = new Set();

    this.addLine('', 'center');
    this.addLine('SARAY KEBAP CAFE 54', 'center', true);
    this.addLine('', 'center');
    this.addSeparator('=');

    this.addLine('Bestellung #' + order.id?.substring(0, 8).toUpperCase(), 'center', true);

    const date = this.formatDate(order.created_at);
    this.addLine(date, 'center');
    this.addSeparator('=');

    this.addLine('');
    this.addLine('KUNDENINFORMATION:', 'center', true);
    this.addLine(order.customer_name, 'center', true);
    this.addLine('Tel: ' + order.customer_phone, 'center', true);
    this.addLine('');
    this.addLine('LIEFERADRESSE:', 'center', true);
    this.addWrappedLines(order.delivery_address, this.width - 2, true);

    this.addLine('');
    this.addSeparator('-');
    this.addLine('');

    this.addLine('ARTIKEL:', 'center', true);
    this.addLine('');

    for (const item of order.items) {
      const itemLine = `${item.quantity}x Nr.${item.menuItemNumber} ${item.name}`;
      this.addWrappedLines(itemLine, this.width - 2, false);

      const priceStr = item.totalPrice.toFixed(2).replace('.', ',') + ' EUR';
      this.lines[this.lines.length - 1] = this.lines[this.lines.length - 1] + ' '.repeat(
        Math.max(0, this.width - this.lines[this.lines.length - 1].length - priceStr.length)
      ) + priceStr;

      if (item.selectedSize) {
        this.addLine('  Größe: ' + item.selectedSize.name, 'left');
      }
      if (item.selectedPastaType) {
        this.addLine('  Pasta: ' + item.selectedPastaType, 'left');
      }
      if (item.selectedSauce) {
        this.addLine('  Soße: ' + item.selectedSauce, 'left');
      }
      if (item.selectedSideDish) {
        this.addLine('  Beilage: ' + item.selectedSideDish, 'left');
      }
      if (item.selectedIngredients?.length > 0) {
        for (const ingredient of item.selectedIngredients) {
          this.addLine('  + ' + ingredient, 'left');
        }
      }
      if (item.selectedExtras?.length > 0) {
        for (const extra of item.selectedExtras) {
          this.addLine('  + ' + extra, 'left');
        }
      }
      if (item.selectedExclusions?.length > 0) {
        for (const exclusion of item.selectedExclusions) {
          this.addLine('  - ' + exclusion, 'left');
        }
      }
      this.addLine('');
    }

    if (order.notes) {
      this.addSeparator('-');
      this.addLine('NOTIZEN:', 'center', true);
      this.addWrappedLines(order.notes, this.width - 2, false);
      this.addLine('');
    }

    this.addSeparator('=');
    this.addLine('');

    const totalStr = 'GESAMT: ' + order.total_amount.toFixed(2).replace('.', ',') + ' EUR';
    this.addLine(totalStr, 'center', true);

    this.addLine('');
    this.addLine('Danke für Ihre Bestellung!', 'center');
    this.addLine('', 'center');
    this.addSeparator('=');
    this.addLine('');

    return this.lines.join('\n');
  }

  addWrappedLines(text, maxWidth, isBold = false) {
    const words = text.split(' ');
    let currentLine = '  ';

    for (const word of words) {
      if ((currentLine + word).length > maxWidth) {
        if (currentLine.trim()) {
          this.addLine(currentLine, 'left', isBold);
        }
        currentLine = '  ' + word;
      } else {
        currentLine += (currentLine.length === 2 ? '' : ' ') + word;
      }
    }

    if (currentLine.trim()) {
      this.addLine(currentLine, 'left', isBold);
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
