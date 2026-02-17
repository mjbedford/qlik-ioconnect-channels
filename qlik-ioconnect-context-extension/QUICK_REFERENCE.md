# ⚡ Quick Reference Card

## Build Commands (Copy-Paste Ready)

```bash
# Initial setup (first time only)
npm install

# Build extension
npm run build

# Create distribution ZIP
npm run package

# Watch mode (auto-rebuild on save)
npm run watch
```

## ✅ Fixed Issues

- ❌ **babel-loader error** → ✅ **FIXED** (removed from webpack config)
- ❌ **Module not found** → ✅ **FIXED** (cleaned up dependencies)

## 📦 What You Get

After `npm run package`, you'll have:
```
release/qlik-ioconnect-channels.zip  ← Upload this to Qlik Cloud
```

## 🚀 Deploy to Qlik Cloud

1. **Upload**: Management Console → Extensions → Add → Select ZIP
2. **Configure CSP**: Add `http://localhost:8385` to connect-src
3. **Use**: Add "io.Connect Channels Publisher" to your sheet
4. **Test**: Click "Publish" on any row!

## 🔌 io.Connect Integration

### Extension publishes:
```javascript
await io.channels.publish({
  source: "Qlik Sense",
  timestamp: "2024-12-11T10:30:00Z",
  data: {
    "Customer": { text: "Acme Corp", number: null },
    "Sales": { text: "$125K", number: 125000 }
  }
}, "QlikData");
```

### Other apps subscribe:
```javascript
io.channels.subscribe('QlikData', (data) => {
  console.log('Got data from Qlik!', data);
});
```

## 📝 Configuration Options

In Qlik property panel:

| Setting | Default | Purpose |
|---------|---------|---------|
| Gateway URL | `http://localhost:8385` | io.Connect gateway |
| Channel Name | `QlikData` | Channel to publish to |
| Auto-initialize | ✅ | Connect on load |
| Table Style | Standard | Visual theme |
| Button Label | "Publish" | Button text |

## 🧪 Test Setup

1. Start io.Connect gateway
2. Open `examples/subscriber.html` in browser
3. Click "Connect"
4. In Qlik, add extension and click "Publish"
5. See data appear in subscriber! 🎉

## 📂 Project Structure

```
qlik-ioconnect-channels-extension/
├── src/
│   ├── main.js              ← Extension logic
│   ├── *.css                ← Styling
│   └── *.qext               ← Manifest
├── dist/                     ← Build output
├── release/                  ← ZIP package
├── package.json              ← Dependencies
├── webpack.config.js         ← Build config
├── README.md                 ← Full docs
├── QUICKSTART.md             ← 5-min guide
├── TROUBLESHOOTING.md        ← Common issues
└── examples/subscriber.html  ← Test page
```

## 🆘 Common Issues

**Build fails?**
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

**Extension doesn't appear in Qlik?**
- Refresh browser
- Check ZIP contains 3 files (.js, .css, .qext)

**Can't connect to io.Connect?**
- Verify gateway is running: `curl http://localhost:8385`
- Add gateway URL to Qlik CSP settings

**Data not publishing?**
- Check browser console for errors
- Verify channel name in extension settings
- Test with subscriber.html example

## 📚 Documentation Files

- **README.md** - Complete documentation
- **QUICKSTART.md** - 5-minute setup
- **BUILD.md** - Detailed build guide
- **TROUBLESHOOTING.md** - Common errors (← Check here first!)
- **PROJECT_STRUCTURE.txt** - Overview

## 💡 Pro Tips

1. Use **watch mode** (`npm run watch`) during development
2. Test with **subscriber.html** before deploying
3. Set **different channel names** for different data types
4. Check **browser console** for connection status
5. Read **TROUBLESHOOTING.md** if you hit issues

## ✨ Features

✅ One-click data publishing to io.Connect channels  
✅ Auto-connect to gateway  
✅ Visual feedback on actions  
✅ Configurable channel names  
✅ Professional table UI  
✅ Connection status indicator  
✅ Full dimension & measure support  

---

**Ready to build? Run:**
```bash
npm install && npm run build && npm run package
```

**Need help? Check:**
- TROUBLESHOOTING.md (for build errors)
- QUICKSTART.md (for setup)
- README.md (for full docs)

🚀 **Built for interop.io**
