# Build & Deployment Guide

## Prerequisites

Ensure you have:
- **Node.js 14+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- Access to **Qlik Cloud** Management Console OR **Qlik Sense Server**

## Build Process

### 1. Install Dependencies

```bash
cd qlik-ioconnect-channels-extension
npm install
```

This installs:
- `@interopio/browser` - The io.Connect library
- `webpack` - Module bundler
- `webpack-cli` - Webpack command-line interface
- `archiver` - For creating ZIP files

### 2. Build the Extension

```bash
# Production build (minified)
npm run build

# Development build (with source maps)
npm run build:dev

# Watch mode (auto-rebuild on changes)
npm run watch
```

**Output**: `dist/qlik-ioconnect-channels.js`

### 3. Create Distribution Package

```bash
npm run package
```

**Output**: `release/qlik-ioconnect-channels.zip`

This ZIP contains:
- `qlik-ioconnect-channels.js` - Bundled extension code
- `qlik-ioconnect-channels.css` - Styling
- `qlik-ioconnect-channels.qext` - Extension manifest

## What Webpack Does

The webpack build process:

1. **Bundles** @interopio/browser library with your extension code
2. **Compiles** ES6+ JavaScript to AMD format (required by Qlik)
3. **Excludes** Qlik-provided libraries (jquery, qlik, angular)
4. **Minifies** code for production
5. **Optimizes** bundle size

## Deployment Options

### Option A: Qlik Cloud

1. **Upload Extension**:
   ```
   Management Console → Extensions → Add
   → Upload release/qlik-ioconnect-channels.zip
   ```

2. **Configure CSP**:
   ```
   Management Console → Content Security Policy → Add
   Name: io.Connect Gateway
   connect-src: http://localhost:8385
   ```

3. **Use in Apps**:
   - Extension appears under "Custom objects"
   - Drag onto sheet and configure

### Option B: Qlik Sense Enterprise (Windows)

1. **Import via QMC**:
   ```
   QMC → Extensions → Import
   → Select release/qlik-ioconnect-channels.zip
   ```

2. **Alternative - Manual Install**:
   ```bash
   # Extract to extensions folder
   cd \\QlikShare\StaticContent\Extensions\
   unzip qlik-ioconnect-channels.zip -d qlik-ioconnect-channels
   ```

### Option C: Qlik Sense Desktop

1. **Extract to User Extensions**:
   ```
   Windows: C:\Users\[YourName]\Documents\Qlik\Sense\Extensions\
   Mac: ~/Library/Application Support/Qlik/Sense/Extensions/
   ```

2. **Folder Structure**:
   ```
   Extensions/
     └── qlik-ioconnect-channels/
         ├── qlik-ioconnect-channels.js
         ├── qlik-ioconnect-channels.css
         └── qlik-ioconnect-channels.qext
   ```

3. **Restart Qlik Sense Desktop**

## Development Workflow

### Making Changes

1. **Edit source files** in `src/`
2. **Run watch mode**: `npm run watch`
3. **Test in Qlik** (refresh browser to see changes)
4. **Build for production**: `npm run build` when ready

### Debugging

1. **Use browser DevTools** (F12)
2. **Check Console** for errors
3. **Network tab** for io.Connect connection issues
4. **Webpack source maps** (in dev build) for debugging

### Common Development Issues

**Issue**: Changes not appearing
- **Solution**: Clear browser cache, rebuild extension

**Issue**: "Module not found" error
- **Solution**: Run `npm install` again

**Issue**: Webpack errors
- **Solution**: Check webpack.config.js syntax

## Testing

### Test with Subscriber Page

1. Open `examples/subscriber.html` in browser
2. Configure gateway URL and channel name
3. Click "Connect"
4. Publish from Qlik → See data in subscriber

### Test io.Connect Connection

```javascript
// In browser console
IOBrowser({
  gateway: { location: 'http://localhost:8385' }
}).then(io => {
  console.log('Connected!', io.version);
});
```

## Versioning

Update version in three places:
1. `package.json` → "version"
2. `src/qlik-ioconnect-channels.qext` → "version"
3. Create git tag: `git tag v1.0.1`

## File Size Optimization

Current bundle size: ~200-300 KB (with @interopio/browser)

**To reduce**:
- Use tree-shaking (webpack does this)
- Lazy-load io.Connect only when needed
- Remove unused io.Connect features

## Troubleshooting Build Issues

### npm install fails

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Webpack build fails

```bash
# Check Node version
node --version  # Should be 14+

# Update webpack
npm update webpack webpack-cli
```

### ZIP creation fails

```bash
# Install archiver globally
npm install -g archiver

# Or use manual zip
cd dist
zip -r ../release/qlik-ioconnect-channels.zip *
```

## Production Checklist

Before deploying to production:

- [ ] Run `npm run build` (production build)
- [ ] Test in Qlik dev/test environment
- [ ] Verify io.Connect gateway is accessible
- [ ] Configure CSP rules (Qlik Cloud)
- [ ] Test with real data
- [ ] Document channel names and data structures
- [ ] Train users on how to use the extension
- [ ] Monitor console for errors

## Continuous Integration

Example GitHub Actions workflow:

```yaml
name: Build Extension
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
      - run: npm run package
      - uses: actions/upload-artifact@v2
        with:
          name: extension
          path: release/*.zip
```

## Support & Resources

- **Webpack**: https://webpack.js.org/
- **io.Connect**: https://docs.interop.io/
- **Qlik Extensions**: https://qlik.dev/

---

Built with ❤️ using modern web development tools
