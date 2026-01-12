# Qlik io.Connect Integration

This repository contains Qlik extensions and resources for integrating Qlik Sense with **io.Connect Browser**, enabling seamless data sharing and interoperability between Qlik and other desktop applications.

## Overview

The io.Connect integration allows Qlik Sense to participate in cross-application workflows by publishing data to channels that other applications can subscribe to. This enables powerful scenarios like:

- Publishing analytics data from Qlik to Excel for further analysis
- Triggering workflows in CRM systems based on Qlik insights
- Sharing KPIs with team dashboards and notification systems
- Integrating Qlik with Bloomberg Terminal, EHR systems, and other enterprise applications

## Repository Contents

### Qlik io.Connect Channels Extension

The main extension that enables Qlik Sense to publish data to io.Connect channels.

**Location**: [`qlik-ioconnect-channels-extension/`](./qlik-ioconnect-channels-extension)

**Key Features**:
- Single-click data publishing from Qlik visualizations
- Configurable channel names and gateway URLs
- Real-time integration with io.Connect-enabled applications
- Professional UI with visual feedback
- Support for dimensions and measures from hypercubes

[View detailed documentation →](./qlik-ioconnect-channels-extension/README.md)

### Sample Data Files

Test data files for development and demonstration purposes:

- `files/quick-test-data.csv` - Quick test dataset
- `files/sample-sales-data.csv` - Sample sales data
- `files/trading-data.csv` - Sample trading/financial data

## Quick Start

### Installation

1. Download the latest release ZIP from the [releases page](../../releases)
2. Install in Qlik Cloud Management Console:
   - Navigate to **Extensions**
   - Click **Add** and upload the ZIP file
3. Add the extension to your Qlik app sheet

### Basic Usage

```javascript
// 1. Add the extension to your Qlik sheet
// 2. Configure dimensions and measures
// 3. Set the channel name in properties
// 4. Click "Publish" to send data to io.Connect

// In your receiving application:
io.channels.subscribe('QlikData', (data) => {
  console.log('Received from Qlik:', data);
  // Process the data...
});
```

## Prerequisites

- **Qlik Cloud** or **Qlik Sense Enterprise**
- **io.Connect Browser** gateway running
- Node.js 14+ (for building from source)

## Building from Source

```bash
# Navigate to the extension directory
cd qlik-ioconnect-channels-extension

# Install dependencies
npm install

# Build the extension
npm run build

# Create distribution package
npm run package
```

The packaged extension will be in `qlik-ioconnect-channels-extension/release/qlik-ioconnect-channels.zip`

## Documentation

- [Extension README](./qlik-ioconnect-channels-extension/README.md) - Full extension documentation
- [Quick Start Guide](./qlik-ioconnect-channels-extension/QUICKSTART.md) - Get started quickly
- [Build Instructions](./qlik-ioconnect-channels-extension/BUILD.md) - Detailed build process
- [Troubleshooting](./qlik-ioconnect-channels-extension/TROUBLESHOOTING.md) - Common issues and solutions
- [Quick Reference](./qlik-ioconnect-channels-extension/QUICK_REFERENCE.md) - Command and API reference

## Use Cases

### Financial Services
- Push trade data from Qlik to trading platforms
- Send analytics to Excel for further analysis
- Trigger workflows based on market conditions

### Healthcare
- Share patient metrics with EHR systems
- Publish dashboard data to clinical applications
- Integrate with reporting tools

### General Business
- Send KPIs to team dashboards
- Export selections to external databases
- Trigger notifications in Slack/Teams

## Architecture

```
Qlik Sense App
    ↓ (publishes data)
io.Connect Browser Gateway
    ↓ (channels)
Other Applications (Excel, CRM, etc.)
```

The extension uses io.Connect Browser's channels API to enable publish-subscribe messaging between applications on the same desktop or network.

## Content Security Policy

When using Qlik Cloud, configure CSP rules to allow communication with the io.Connect gateway:

1. Go to **Management Console** → **Content Security Policy**
2. Add rules:
   - **connect-src**: `http://localhost:8385` (or your gateway URL)
   - **ws-src**: `ws://localhost:8385` (for WebSocket connections)

## Support

- **Extension Issues**: [Create an issue](../../issues) in this repository
- **io.Connect Browser**: Contact [interop.io support](https://interop.io)
- **Qlik Sense**: Check [Qlik Community forums](https://community.qlik.com)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- [@interopio/browser](https://www.npmjs.com/package/@interopio/browser) - io.Connect Browser library
- [Webpack](https://webpack.js.org/) - Module bundler
- Qlik Sense Extension API

---

**Made with interop.io** 🚀
