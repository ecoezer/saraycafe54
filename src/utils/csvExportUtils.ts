import type { OrderData } from '../services/FirebaseService';

interface CSVRow {
  [key: string]: string | number;
}

const escapeCsvField = (field: string | number | null | undefined): string => {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const formatDateGerman = (timestamp: any): string => {
  if (!timestamp) return '';
  let date: Date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getOrderType = (deliveryAddress: string): string => {
  return deliveryAddress === 'Abholung' ? 'Abholung' : 'Lieferung';
};

export const generateDetailedOrdersCSV = (orders: OrderData[]): Blob => {
  const headers = [
    'Order Date',
    'Customer Name',
    'Phone',
    'Delivery Address',
    'Order Type',
    'Item Number',
    'Item Name',
    'Item Quantity',
    'Item Price (€)',
    'Total Amount (€)',
    'Device Type',
    'Browser Info',
  ];

  const rows: CSVRow[] = [];

  orders.forEach((order) => {
    order.items.forEach((item) => {
      rows.push({
        'Order Date': formatDateGerman(order.created_at),
        'Customer Name': escapeCsvField(order.customer_name),
        'Phone': escapeCsvField(order.customer_phone),
        'Delivery Address': escapeCsvField(order.delivery_address),
        'Order Type': getOrderType(order.delivery_address),
        'Item Number': item.menuItemNumber,
        'Item Name': escapeCsvField(item.name),
        'Item Quantity': item.quantity,
        'Item Price (€)': (item.totalPrice / item.quantity).toFixed(2),
        'Total Amount (€)': order.total_amount.toFixed(2),
        'Device Type': order.device_type || '',
        'Browser Info': escapeCsvField(order.browser_info || ''),
      });
    });
  });

  const csvContent = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvField(row[header])).join(',')
    ),
  ].join('\n');

  return new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const downloadCSV = (blob: Blob, filename: string): void => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getExportFilename = (timePeriod: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `orders-${timePeriod}-${timestamp}.csv`;
};
