# Qlik Sense io.Connect Channels Extension

A Qlik Sense visualization extension that enables publishing data to **io.Connect Browser channels** with a single click. Perfect for cross-application workflows and desktop interoperability scenarios.

## Features

✨ **Channel Publishing** - Publish data from Qlik to io.Connect channels  
🔄 **Real-time Integration** - Instant data sharing with other applications  
⚙️ **Configurable** - Customize channel names, gateway URLs, and display options  
🎨 **Professional UI** - Clean, responsive table design with visual feedback  
📊 **Full Data Support** - Handles dimensions and measures from hypercubes  
🔌 **Auto-connect** - Optional automatic connection to io.Connect gateway  

## Prerequisites

- **Qlik Cloud** or **Qlik Sense Enterprise**
- **io.Connect Browser** gateway running (typically on `http://localhost:8385`)
- Node.js 14+ (for building from source)

## Installation

### Quick Install (Pre-built)

1. Download `qlik-ioconnect-channels.zip` from releases
2. In Qlik Cloud Management Console:
   - Navigate to **Extensions**
   - Click **Add**
   - Upload the ZIP file
3. The extension is now available in your apps

### Build from Source

```bash
# Clone or download this repository
cd qlik-ioconnect-channels-extension

# Install dependencies
npm install

# Build the extension
npm run build

# Create distribution package
npm run package

# Find the ZIP file in ./release/qlik-ioconnect-channels.zip
```

## Configuration

### Gateway Settings

| Property | Description | Default |
|----------|-------------|---------|
| **Gateway URL** | io.Connect gateway endpoint | `http://localhost:8385` |
| **Channel Name** | Channel to publish data to | `QlikData` |
| **Auto-initialize** | Connect automatically on load | `true` |
| **Show Connection Status** | Display connection indicator | `true` |

### Display Settings

| Property | Description | Options |
|----------|-------------|---------|
| **Table Style** | Visual style of the table | Standard, Striped, Bordered |
| **Show Row Buttons** | Display publish buttons | true/false |
| **Button Label** | Text on publish buttons | "Publish" |

## Usage

### Basic Usage

1. **Add Extension** to your Qlik sheet
2. **Configure Dimensions & Measures** in the property panel
3. **Set Channel Name** in io.Connect settings
4. Click **Publish** on any row to send data to the channel

### Example: Publishing to Excel

```javascript
// In your Excel add-in or io.Connect-enabled app:
io.channels.subscribe('QlikData', (data) => {
  console.log('Received from Qlik:', data);
  
  // data.data contains your dimensions and measures
  // data.source = 'Qlik Sense'
  // data.timestamp = ISO timestamp
  
  // Process the data...
  insertDataToExcel(data.data);
});
```

### Data Structure

When you click "Publish", the extension sends data in this format:

```json
{
  "source": "Qlik Sense",
  "appName": "app-id-here",
  "timestamp": "2024-12-11T10:30:00.000Z",
  "rowIndex": 0,
  "data": {
    "Customer Name": {
      "text": "Acme Corp",
      "number": null,
      "elementNumber": 1
    },
    "Sales": {
      "text": "$125,000",
      "number": 125000
    }
  }
}
```

## Content Security Policy (Qlik Cloud)

To allow communication with io.Connect gateway, add these CSP rules in Qlik Cloud:

1. Go to **Management Console** → **Content Security Policy**
2. Add rule for your gateway domain:
   - **connect-src**: `http://localhost:8385` (or your gateway URL)
   - **ws-src**: `ws://localhost:8385` (for WebSocket)

## Development

### Project Structure

```
qlik-ioconnect-channels-extension/
├── src/
│   ├── main.js                      # Main extension code
│   ├── qlik-ioconnect-channels.css  # Styling
│   └── qlik-ioconnect-channels.qext # Manifest
├── dist/                            # Built files (generated)
├── release/                         # Packaged ZIP (generated)
├── scripts/
│   └── package.js                   # Packaging script
├── webpack.config.js                # Webpack configuration
└── package.json                     # Dependencies

```

### Available Scripts

```bash
npm run build       # Production build
npm run build:dev   # Development build
npm run watch       # Watch mode for development
npm run package     # Build + create ZIP
```

### Webpack Configuration

The extension uses **AMD module format** (required by Qlik Sense) and excludes Qlik-provided libraries (jQuery, qlik, angular) from the bundle.

## API Reference

### io.channels.publish()

```javascript
await io.channels.publish(data, channelName);
```

**Parameters:**
- `data` (Object): Data payload to publish
- `channelName` (String): Channel name to publish to

**Returns:** Promise that resolves when data is published

### Extension Methods

The extension automatically:
- Initializes io.Connect Browser connection
- Creates/joins channels as needed
- Handles connection errors gracefully
- Provides visual feedback on publish actions

## Use Cases

### Financial Services
- Push trade data from Qlik to Bloomberg Terminal
- Send analytics to Excel for further analysis
- Trigger workflows in CRM systems

### Healthcare
- Share patient metrics with EHR systems
- Publish dashboard data to reporting tools
- Integrate with clinical applications

### General Business
- Send KPIs to team dashboards
- Export selections to external databases
- Trigger notifications in Slack/Teams

## Troubleshooting

### Extension won't connect

**Problem**: Status shows "Not connected"

**Solutions**:
1. Verify io.Connect gateway is running
2. Check gateway URL in settings
3. Review browser console for errors
4. Ensure CSP rules are configured (Qlik Cloud)

### Publish button does nothing

**Problem**: Click doesn't send data

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify channel name is set
3. Test io.Connect connection separately
4. Confirm @interopio/browser version compatibility

### Data not received in other apps

**Problem**: Published but not received

**Solutions**:
1. Verify receiving app is subscribed to correct channel
2. Check channel name matches exactly (case-sensitive)
3. Confirm both apps use same io.Connect gateway
4. Test with io.Connect dev tools

## Advanced Configuration

### Custom Gateway Configuration

```javascript
// Edit src/main.js to add custom config:
const io = await IOBrowser({
  gateway: {
    location: 'https://your-gateway.com',
    ws: 'wss://your-gateway.com/websocket'
  },
  channels: {
    enabled: true
  },
  auth: {
    // Add authentication if needed
  }
});
```

### Multiple Channels

Modify the extension to publish to multiple channels based on data content:

```javascript
const channelName = data.Category === 'Sales' 
  ? 'SalesChannel' 
  : 'OperationsChannel';
  
await publishToChannel(ioInstance, channelName, payload);
```

## Version History

- **1.0.0** - Initial release
  - Channel publishing functionality
  - Configurable gateway and channel settings
  - Professional table UI with visual feedback

## Support

For issues specific to:
- **io.Connect Browser**: Contact interop.io support
- **Qlik Sense**: Check Qlik Community forums
- **This Extension**: Create an issue in the repository

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- [@interopio/browser](https://www.npmjs.com/package/@interopio/browser) - io.Connect Browser library
- [Webpack](https://webpack.js.org/) - Module bundler
- Qlik Sense Extension API

---

**Made by the interop.io team** 🚀
