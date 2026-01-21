# System Architecture - Saray Kebap Cafe54

## CRITICAL ARCHITECTURAL DECISIONS

### 1. Database: Firebase Only (Permanent, Non-Negotiable)
**This project uses Firebase Firestore as its PERMANENT database layer. Do not propose migrating to Supabase, MongoDB, PostgreSQL, or any other database.**

**Rationale:**
- Orders are stored in Firebase Firestore
- Real-time listeners required for order updates
- Raspberry Pi backend reads/writes to Firebase
- No alternative database solutions will be considered

---

## System Topology

```
┌─────────────────────────┐
│   Netlify Frontend      │
│   (React App)           │
│   - Admin Dashboard     │
│   - Menu/Orders         │
└────────────┬────────────┘
             │ (HTTPS)
             │ Reads/Writes
             ▼
┌─────────────────────────┐
│  Firebase Firestore     │
│  - orders collection    │
│  - printer_commands     │
│  - printer_status       │
└────────────▲────────────┘
             │ (Real-time listeners)
             │ Reads/Writes
┌────────────┴────────────┐
│  Raspberry Pi Backend   │
│  - Monitors orders      │
│  - Listens for commands │
│  - Updates status       │
│  - Prints receipts      │
└────────────┬────────────┘
             │ (USB)
             ▼
┌─────────────────────────┐
│  Thermal Printer        │
│  (Epson TM-T20IV)       │
│  USB Connected          │
└─────────────────────────┘
```

---

## Architecture Constraints

### Deployment Locations
- **Frontend**: Deployed on Netlify (cloud)
- **Database**: Firebase Firestore (cloud)
- **Backend**: Runs on Raspberry Pi (local store network)
- **Printer**: USB connected to Raspberry Pi (local store)

### Communication Pattern
- **No direct HTTP calls** from Netlify frontend to Raspberry Pi
- **All communication** goes through Firebase Firestore
- **Real-time listeners** (not polling) for instant updates
- **Message queue** in Firebase for printer commands

### Printer Configuration
- **Single USB printer** connected to Raspberry Pi
- **No multi-location support** (future expansion not planned)
- **Epson TM-T20IV** thermal printer (ESC/POS protocol)
- **Local network only** (store location)

---

## Real-Time Communication Flow

### Order Placement
1. Customer places order via Netlify frontend
2. Order saved to Firebase `orders` collection
3. Raspberry Pi listener detects new order instantly
4. Receipt formatted and printed automatically
5. Print status updated in Firebase `printer_status`
6. Admin dashboard updates in real-time

### Reprint Functionality
1. Admin clicks reprint button in Netlify dashboard
2. Frontend writes command to Firebase `printer_commands` collection
3. Raspberry Pi listener detects command instantly
4. Command executed (reprint or test print)
5. Status updated in `printer_status` document
6. Frontend updates in real-time (not polling)

### Printer Status Updates
- Status updated every print cycle
- Real-time listeners on frontend (no 30-second polling)
- Connection status, queue size, last print time all tracked
- Auto-cleanup of processed commands (TTL-based)

---

## Firebase Collections Schema

### `orders` Collection
```
{
  id: "order123",
  customer_name: string,
  customer_phone: string,
  delivery_address: string,
  items: OrderItem[],
  total_amount: number,
  created_at: timestamp,

  // Print Status Fields
  printed: boolean,
  print_timestamp: timestamp,
  print_retry_count: number,
  print_error: string,
  reprint_requested_at: timestamp,
  reprint_status: "pending" | "processing" | "complete"
}
```

### `printer_commands` Collection
```
{
  id: "cmd_xyz",
  command_type: "reprint" | "test" | "status",
  order_id: string (optional),
  created_at: timestamp,
  processed: boolean,
  processed_at: timestamp,
  ttl_expires_at: timestamp (auto-cleanup after 24 hours)
}
```

### `printer_status` Document (Singleton)
```
{
  connected: boolean,
  connection_type: "usb" | "serial",
  last_update: timestamp,
  last_print_time: timestamp,
  queue_size: number,
  total_printed_count: number,
  current_error: string,
  health_check: {
    uptime: number,
    memory_usage: number,
    cpu_usage: number
  }
}
```

---

## Frontend Architecture

### Components with Real-Time Listeners
- **PrinterStatus**: Listens to `printer_status` document
- **AdminOrderHistory**: Listens to `orders` collection changes
- **OrderForm**: Listens to order status updates

### Removed
- No `fetch()` calls to `http://localhost:3001`
- No polling mechanisms (30-second or otherwise)
- No direct Raspberry Pi communication

---

## Raspberry Pi Backend Architecture

### Removed
- ~~HTTP Express endpoints~~ (except health check for local debugging)
- ~~CORS configuration~~ (not needed for Firebase)
- ~~Direct API connections from frontend~~ (Firebase replaces this)

### Added
- Firestore listener for `printer_commands` collection
- Periodic status updates to `printer_status` document
- Real-time order monitoring (unchanged)
- Command execution engine

---

## Environment Configuration

### Required Variables (Firebase Only)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Raspberry Pi Variables
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `PRINTER_TYPE` (usb or serial)

---

## Real-Time Implementation Details

### Latency
- Order detection: <100ms
- Reprint command: <100ms
- Status update: <100ms
- User sees updates instantly (no 30-second delays)

### Benefits vs Polling
| Aspect | Real-Time | Polling (30s) |
|--------|-----------|---------------|
| Latency | <100ms | up to 30s |
| Server Load | Lower | Higher |
| User Experience | Instant | Stale data |
| Network Traffic | Changes only | Constant |
| Reprint Response | 1-2 seconds | Wait 30s+ |

---

## Security Considerations

### Firebase Rules
- Orders readable by authenticated users only
- Printer commands writable by admin users only
- Printer status readable by admin users only
- Automatic TTL cleanup for old commands

### No Exposed Endpoints
- Printer is not exposed on internet
- Raspberry Pi only communicates with Firebase
- No port forwarding required
- No VPN needed for admin access

---

## Future Expansion (Out of Scope)
The following are explicitly NOT planned for this system:
- Multi-location printer support
- Multiple printers per location
- Supabase or alternative database migration
- Print server API for external integration
- Webhook delivery system

This project has a single, focused scope: one store, one printer, Firebase database.

---

## Development Guidelines

### When Adding Features
1. Use Firebase as the communication layer
2. Implement real-time listeners (not polling)
3. Never hardcode `localhost:3001`
4. Never suggest database changes
5. Never bypass Firebase for direct backend calls

### Common Mistakes to Avoid
- ❌ Fetching from `http://localhost:3001`
- ❌ Using 30-second polling instead of real-time
- ❌ Storing critical data outside Firebase
- ❌ Direct Raspberry Pi API calls from frontend
- ❌ Suggesting Supabase migration

---

## References
- PRINTER_SETUP.md - Printer installation guide
- SETUP_INSTRUCTIONS.md - Project setup
- README.md - Project overview
