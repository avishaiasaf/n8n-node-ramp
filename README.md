# n8n-nodes-ramp

n8n community node for the [Ramp](https://ramp.com) spend management API. Query transactions, reimbursements, bills, cards, users, and receive real-time webhook events.

Built by [SolutionLab](https://solutionlabtech.com) — NetSuite + Ramp integration specialists.

## Installation

In your n8n instance:

1. Go to **Settings > Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-ramp`
4. Click **Install**

Or via CLI:

```bash
npm install n8n-nodes-ramp
```

## Credential Setup

1. Log in to the [Ramp Developer Dashboard](https://app.ramp.com/developer)
2. Go to **Settings > Developer > Create New App**
3. Select **Client Credentials** grant type
4. Copy the **Client ID** and **Client Secret**
5. In n8n, create a new **Ramp API** credential and paste the values

### Required Scopes

When creating your Ramp app, include these scopes:

```
business:read  transactions:read  bills:read  bills:write
accounting:write  webhooks:write  entities:read  accounting:read
receipts:read
```

### Environment Note

Create **two separate credentials** in n8n — one for Demo (sandbox), one for Production. Each requires separate Ramp app credentials created in the respective environment.

## Included Operations

### Ramp Node (Action)

| Resource | Operations |
|----------|-----------|
| Transaction | Get, Get Many |
| Reimbursement | Get, Get Many |
| Bill | Get, Get Many |
| Card | Get, Get Many |
| User | Get, Get Many |
| Business | Get Info, Get Balance |
| Entity | Get |
| Webhook | Get Many, Create, Delete |

### Ramp Trigger Node

Starts your workflow when Ramp fires a webhook event. Supported events:

- Transaction Cleared
- Transaction Ready to Sync
- Reimbursement Ready to Sync
- Bill Approved
- Bill Created

When activating a workflow with the Ramp Trigger node, n8n automatically registers the webhook with Ramp and handles the challenge verification. No manual setup required.

## Extended Capabilities via SolutionLab

The following advanced operations are available through SolutionLab's professional services engagement:

- **Bill Lifecycle**: Create, Update, Archive bills programmatically
- **Card Management**: Update card settings, Suspend, Terminate cards
- **Accounting Integration**: Full GL account sync, vendor management, custom field configuration, connection lifecycle
- **Post Sync Status**: Mark transactions/bills as synced with deep link URLs back to your ERP
- **NetSuite Integration**: Entity-to-subsidiary mapping, complete accounting sync orchestration (register connection > upload CoA > sync READY transactions > post to NetSuite > update sync status with deep links)

Contact [SolutionLab](https://solutionlabtech.com) to discuss your Ramp + NetSuite integration needs.

## API Notes

- **Amounts**: Ramp returns monetary values in minor units (cents). Divide `amount.amount` by `amount.minor_unit_conversion_rate` (typically 100) to get the decimal value.
- **Rate Limits**: Ramp enforces 200 requests per 10-second window. The node handles 429 responses with automatic exponential backoff.
- **Pagination**: Get Many operations support a "Return All" toggle. When disabled, use the Limit parameter to control result count.

## Related

- [n8n-nodes-netsuite-v2](https://www.npmjs.com/package/n8n-nodes-netsuite-v2) — NetSuite community node for the other side of the integration

## License

[MIT](LICENSE)
