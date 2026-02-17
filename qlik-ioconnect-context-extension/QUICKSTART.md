# Quick Start Guide

## 5-Minute Setup

### Step 1: Build the Extension

```bash
# Clone/download the project
cd qlik-ioconnect-channels-extension

# Install dependencies (one-time)
npm install

# Build the extension
npm run build

# Create the ZIP package
npm run package
```

You'll find `qlik-ioconnect-channels.zip` in the `./release/` folder.

### Step 2: Upload to Qlik Cloud

1. Log into **Qlik Cloud Management Console**
2. Navigate to **Extensions** (in the left sidebar)
3. Click **Add** button
4. Upload `qlik-ioconnect-channels.zip`
5. Extension is now available! ✓

### Step 3: Configure Content Security Policy (CSP)

1. In Management Console, go to **Content Security Policy**
2. Click **Add** to create a new rule
3. Configure the rule:
   - **Name**: io.Connect Gateway
   - **connect-src**: Add `http://localhost:8385` (or your gateway URL)
   - **script-src**: Add `http://localhost:8385`
4. Click **Create**

### Step 4: Add Extension to Your App

1. Open a Qlik Sense app
2. Edit a sheet
3. In the left panel, scroll to **Custom objects**
4. Drag **io.Connect Channels Publisher** onto your sheet
5. Configure dimensions and measures as usual

### Step 5: Configure the Extension

In the properties panel (right side):

**Data:**
- Add at least 1 measure (e.g., Sales)
- Optionally add dimensions (e.g., Customer, Product)

**io.Connect Settings:**
- **Gateway URL**: `http://localhost:8385` (or your gateway)
- **Channel Name**: `QlikData` (or choose your own)
- **Auto-initialize**: ✓ (enabled)

**Display Settings:**
- Choose your preferred table style
- Keep "Show Row Buttons" enabled

### Step 6: Test It!

1. Make sure **io.Connect gateway is running** on your machine
2. Open the test subscriber page:
   - Open `examples/subscriber.html` in a browser
   - Click **Connect**
3. In Qlik Sense, click **Publish** on any row
4. Watch the data appear in the subscriber page! 🎉

## Testing Without Building

If you want to test quickly without webpack:

1. Use a CDN version of @interopio/browser
2. Create a simple HTML page that loads the library
3. Manually include the CSS and JS files

## Common Issues

### "Failed to connect to io.Connect"

**Solution**: Ensure the gateway is running:
```bash
# Check if gateway is accessible
curl http://localhost:8385/health
```

### "Extension not showing in Qlik"

**Solution**: 
- Refresh your browser
- Check that the ZIP contains all required files
- Verify the .qext file is valid JSON

### "CSP blocked the request"

**Solution**: Add your gateway URL to Content Security Policy (see Step 3)

## Next Steps

- **Customize the channel name** for different data types
- **Subscribe to channels** in other applications
- **Create workflows** that respond to published data
- **Build dashboards** that receive updates from Qlik

## Example Use Cases

### 1. Excel Integration
```javascript
// In Excel add-in
io.channels.subscribe('QlikData', (data) => {
  Excel.run(context => {
    // Insert data into worksheet
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    // ... populate cells with data.data
  });
});
```

### 2. Real-time Dashboard
```javascript
// In separate web app
io.channels.subscribe('QlikData', (data) => {
  updateChart(data.data);
  showNotification(`New data: ${data.data.Sales.text}`);
});
```

### 3. CRM Integration
```javascript
// In Salesforce Lightning Component
io.channels.subscribe('QlikData', (data) => {
  const customerId = data.data['Customer ID'].text;
  openCustomerRecord(customerId);
});
```

## Support

Need help? Check:
- 📖 [Full README](README.md)
- 🔧 [io.Connect Documentation](https://docs.interop.io)
- 💬 [Qlik Community](https://community.qlik.com)

---

**Happy integrating!** 🚀
