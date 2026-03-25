# n8n-nodes-ramp

[![npm version](https://img.shields.io/npm/v/n8n-nodes-ramp.svg)](https://www.npmjs.com/package/n8n-nodes-ramp)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-ramp.svg)](https://www.npmjs.com/package/n8n-nodes-ramp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-ff6d5a.svg)](https://docs.n8n.io/integrations/community-nodes/)
[![Built by SolutionLab](https://img.shields.io/badge/Built%20by-SolutionLab-0077B5.svg)](https://solutionlabtech.com)

A production-grade n8n community node for the **[Ramp](https://ramp.com)** spend management platform, built by **[SolutionLab](https://solutionlabtech.com)** ([Avishai Asaf](https://www.linkedin.com/in/avishaiasaf/)). Query transactions, bills, receipts, reimbursements, and 13 more resources. Receive real-time webhook events with HMAC signature verification. Upload bill attachments. Zero manual token management.

**17 resources. 30+ operations. Real-time triggers. Attachment uploads. Automatic pagination.**

---

## Why This Node?

Integrating Ramp into n8n workflows typically means chaining HTTP Request nodes with manual OAuth token handling, pagination loops, and webhook verification code. This creates fragile automations that break silently.

This node was built by SolutionLab to solve three specific production bottlenecks:

### Fully Automated OAuth

Client Credentials flow with automatic token acquisition on every request. No browser login, no token refresh logic, no manual intervention. Configure your Client ID and Secret once - the node handles everything from there.

### Comprehensive API Coverage

17 resources covering the full Ramp API surface: transactions, bills (with attachment uploads), receipts, reimbursements, cards, users, departments, locations, merchants, vendors, entities, memos, limits, cashbacks, transfers, webhooks, and business info. Each resource supports automatic cursor-based pagination via the "Return All" toggle.

### Production-Grade Reliability

Rate limit handling with automatic exponential backoff on 429 responses (Ramp enforces 200 requests per 10-second window). HMAC-SHA256 webhook signature verification using the raw request body. Challenge handshake auto-verification on webhook registration. Structured error parsing instead of raw HTTP status codes.

---

## Enterprise Features

### Transaction Operations

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve a transaction by ID with optional merchant data |
| **Get Many** | List transactions with filters: sync status, date range, department |

### Bill Operations

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve a bill by ID |
| **Get Many** | List bills with filters: sync status, approval status, vendor |
| **Upload Attachment** | Upload a file attachment to a finalized bill (multipart) |
| **Upload Draft Attachment** | Upload a file attachment to a draft bill (multipart) |

Attachment uploads accept any binary data from upstream nodes (HTTP Request, Read Binary File, etc.) and support INVOICE and OTHER attachment types.

### Receipt Operations

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve a receipt by ID (includes receipt URL for download) |
| **Get Many** | List receipts with filters: user, transaction, date range |

### Organizational Resources

| Resource | Operations | API Endpoint |
|----------|-----------|--------------|
| **Department** | Get, Get Many | `/departments` |
| **Location** | Get, Get Many | `/locations` |
| **User** | Get, Get Many | `/users` |
| **Entity** | Get | `/entities` |
| **Merchant** | Get, Get Many | `/merchants` |
| **Vendor** | Get, Get Many | `/accounting/vendors` |

### Financial Resources

| Resource | Operations | API Endpoint |
|----------|-----------|--------------|
| **Reimbursement** | Get, Get Many | `/reimbursements` |
| **Card** | Get, Get Many | `/cards` |
| **Limit** | Get, Get Many | `/limits` |
| **Cashback** | Get Many | `/cashbacks` |
| **Transfer** | Get, Get Many | `/transfers` |
| **Memo** | Get, Get Many | `/memos` |
| **Business** | Get Info, Get Balance | `/business` |

### Webhook Management

| Operation | Description |
|-----------|-------------|
| **Create** | Register a new webhook endpoint with event type selection |
| **Get Many** | List all registered webhooks |
| **Delete** | Remove a webhook registration |

### Ramp Trigger Node

The **Ramp Trigger** node starts your workflow when Ramp fires a webhook event. No manual webhook setup required - n8n handles registration, challenge verification, and HMAC signature validation automatically.

| Event | Description |
|-------|-------------|
| **Transaction Cleared** | Card transaction has cleared |
| **Transaction Ready to Sync** | Transaction is ready for ERP sync |
| **Reimbursement Ready to Sync** | Reimbursement approved and ready for ERP sync |
| **Bill Approved** | Bill has been approved for payment |
| **Bill Created** | New bill has been created |

**Security:** Every incoming webhook payload is verified using HMAC-SHA256 with the secret provided at webhook registration. Invalid signatures are rejected with a 401 response.

### Platform Capabilities

- **Automatic Pagination** - Enable "Return All" on any Get Many operation to automatically follow Ramp's cursor-based pagination until all records are retrieved.
- **Rate Limit Handling** - Automatic exponential backoff on 429 responses with up to 3 retries. Ramp enforces 200 requests per 10-second window.
- **Dual Environment** - Switch between Demo (sandbox) and Production environments via credential configuration. Each environment requires separate Ramp app credentials.
- **Structured Errors** - API error responses are parsed and surfaced as readable messages instead of raw HTTP status codes.

---

## Installation

### Community Nodes (Recommended)

1. In n8n, go to **Settings > Community Nodes**
2. Enter `n8n-nodes-ramp`
3. Click **Install**
4. Restart n8n if prompted

### Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-ramp
```

Then restart n8n.

> **Multi-instance deployments:** If running n8n with separate main and worker processes (queue mode), install the package on **all instances** - both main and workers. Workers without the package will throw "Unrecognized node type" errors.

---

## Credential Setup

1. Log in to the [Ramp Developer Dashboard](https://app.ramp.com/developer) (or [Demo Dashboard](https://demo.ramp.com/developer) for sandbox)
2. Go to **Settings > Developer > Create New App**
3. Select **Client Credentials** grant type
4. Copy the **Client ID** and **Client Secret**
5. In n8n, create a new **Ramp API** credential and paste the values

### Required Scopes

When creating your Ramp app, include these scopes:

| Scope | Used By |
|-------|---------|
| `business:read` | Business Info, Business Balance |
| `transactions:read` | Transactions |
| `bills:read` | Bills (Get, Get Many) |
| `bills:write` | Bill Attachment Uploads |
| `receipts:read` | Receipts |
| `entities:read` | Entities |
| `accounting:read` | Vendors (Accounting) |
| `accounting:write` | Accounting sync operations |
| `webhooks:write` | Webhook management, Trigger node |
| `departments:read` | Departments |
| `locations:read` | Locations |
| `merchants:read` | Merchants |
| `limits:read` | Spending Limits |
| `transfers:read` | Transfers |
| `cashbacks:read` | Cashbacks |
| `memos:read` | Memos |

### Environment Note

Create **two separate credentials** in n8n - one for Demo (sandbox), one for Production. Each requires separate Ramp app credentials created in the respective environment.

### Testing the Connection

Click **Test** in the n8n credential form. The test performs a full token exchange and calls `GET /business` to verify the credentials and scopes are configured correctly.

---

## Usage

### Querying Transactions

Select **Resource: Transaction** and **Operation: Get Many**. Enable filters to narrow results:

- **Sync Status**: SYNC_READY, SYNCED, or NOT_SYNCED
- **Date Range**: From Date and To Date
- **Department**: Filter by department ID

Enable **Return All** to automatically paginate through all matching transactions.

### Uploading Bill Attachments

Select **Resource: Bill** and **Operation: Upload Attachment**.

1. Provide the **Bill ID** of the finalized bill
2. Set **Binary Property** to the name of the binary property containing your file (default: `data`)
3. Choose **Attachment Type**: INVOICE or OTHER

The file data comes from any upstream node that produces binary output (HTTP Request downloading a file, Read Binary File, etc.).

> **Note:** Only one INVOICE-type attachment is allowed per bill. Use OTHER for additional documents.

### Fetching Receipts

Select **Resource: Receipt** and **Operation: Get**. The response includes a `receipt_url` field - use an HTTP Request node to download the actual receipt file if needed.

### Real-Time Webhook Triggers

Add a **Ramp Trigger** node as the first node in your workflow:

1. Select the **Event Types** to listen for
2. Activate the workflow

n8n automatically registers the webhook with Ramp, handles the challenge verification handshake, and validates HMAC signatures on every incoming event. When you deactivate the workflow, the webhook is automatically cleaned up.

---

## Common Workflow Examples

These are popular workflows built with this connector. For implementation help, [contact SolutionLab](https://solutionlabtech.com).

**Ramp Transactions to NetSuite Vendor Bills**
Use the Ramp Trigger (Transaction Ready to Sync) to capture cleared transactions, fetch receipt attachments, map accounting fields via data-table-driven transformation, and create vendor bills in NetSuite with line items and file attachments.

**Ramp Bills to NetSuite with Attachments**
Trigger on Bill Approved, fetch the bill details and attachments, transform to NetSuite journal entry or vendor bill format, and post with the original invoice PDF attached.

**Multi-Entity Transaction Routing**
For organizations with multiple Ramp entities mapped to NetSuite subsidiaries, route transactions to the correct subsidiary based on entity-to-subsidiary mapping tables.

**Receipt Automation Pipeline**
Poll for new transactions, fetch associated receipts, download receipt files, and attach them to corresponding records in your ERP or document management system.

**Daily Sync Status Reconciliation**
Schedule a daily workflow to query all SYNC_READY transactions and reimbursements, post them to your ERP, then update Ramp sync status with deep link URLs back to the created records.

---

## Professional Services & Support

This node is developed and maintained by **[SolutionLab](https://solutionlabtech.com)**, a team that specializes in Ramp + NetSuite integrations, n8n workflow automation, and SuiteScript development.

### Free vs Professional

| Capability | Free (this connector) | Professional (SolutionLab) |
|---|---|---|
| Transaction, Bill, Receipt querying | Included | - |
| Bill attachment uploads | Included | - |
| All 17 resources with pagination | Included | - |
| Real-time webhook triggers with HMAC | Included | - |
| Department, Location, Vendor lookups | Included | - |
| Ramp to NetSuite transaction sync | - | End-to-end orchestration with field mapping |
| Multi-entity to multi-subsidiary routing | - | Entity-subsidiary mapping and GL configuration |
| Data-table-driven field transformation | - | Dynamic mapping tables for accounting fields |
| Receipt-to-ERP attachment pipeline | - | Download, convert, and attach to NetSuite records |
| Sync status posting with deep links | - | Mark synced in Ramp with URLs back to ERP records |
| GL account and vendor sync | - | Full chart of accounts upload and vendor matching |
| Custom accounting field configuration | - | Ramp accounting connection lifecycle management |

### What We Build

- **Ramp to NetSuite end-to-end accounting sync** - Transaction capture, field mapping, vendor bill creation, payment posting, and sync status updates - all automated
- **Multi-entity / multi-subsidiary routing** - Transactions from different Ramp entities automatically routed to the correct NetSuite subsidiary with proper GL coding
- **Data-table-driven transformation engine** - Configurable mapping tables that business users can update without touching workflow code
- **Receipt and attachment automation** - Automatic receipt fetching, file conversion, and attachment to ERP records
- **Real-time webhook to ERP posting** - Sub-minute latency from Ramp event to NetSuite record creation with HMAC security

### Contact

**[Book a consultation](https://solutionlabtech.com)** | [avishai@solutionlabtech.com](mailto:avishai@solutionlabtech.com) | [LinkedIn](https://www.linkedin.com/in/avishaiasaf/)

---

## API Notes

- **Amounts**: Ramp returns monetary values in minor units (cents). Divide `amount.amount` by `amount.minor_unit_conversion_rate` (typically 100) to get the decimal value.
- **Rate Limits**: Ramp enforces 200 requests per 10-second window. The node handles 429 responses with automatic exponential backoff (up to 3 retries).
- **Pagination**: Get Many operations support a "Return All" toggle. When disabled, use the Limit parameter to control result count. Ramp uses cursor-based pagination internally.
- **Environments**: Demo API (`demo-api.ramp.com`) and Production API (`api.ramp.com`) are completely separate. Credentials from one environment do not work in the other.

---

## Related

- **[n8n-nodes-netsuite-v2](https://www.npmjs.com/package/n8n-nodes-netsuite-v2)** - NetSuite community node by SolutionLab. Together with this Ramp connector, they form a complete Ramp + NetSuite integration platform.

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| **Scopes not allowed for this client** | Ramp app missing required scopes | Add all required scopes in the Ramp Developer Dashboard and recreate the app |
| **Connection failed: 403** | Invalid credentials or scopes | Verify Client ID/Secret match the correct environment (Demo vs Production) |
| **Unrecognized node type: rampTrigger** | Workers missing the community node | Install `n8n-nodes-ramp` on all n8n instances (main + workers) |
| **No output data returned (Trigger)** | HMAC signature verification failing | Deactivate and reactivate the workflow to re-register the webhook with a fresh secret |
| **429 Too Many Requests** | Rate limit exceeded despite backoff | Reduce workflow concurrency or add Wait nodes between API calls |
| **Invalid webhook signature** | Webhook secret mismatch | Deactivate the workflow, wait 30 seconds, then reactivate to register a new webhook |
| **INVOICE attachment already exists** | Duplicate invoice upload attempt | Use attachment type OTHER for additional documents, or delete the existing invoice first |

---

## Contributing

```bash
git clone https://github.com/avishaiasaf/n8n-node-ramp.git
cd n8n-node-ramp
npm install
npm run build
```

Submit issues and pull requests via [GitHub](https://github.com/avishaiasaf/n8n-node-ramp).

---

## License

[MIT](LICENSE)
