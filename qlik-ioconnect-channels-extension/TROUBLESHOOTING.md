# Build Troubleshooting Guide

## Common Build Errors & Fixes

### ❌ Error: Module not found: Error: Can't resolve 'babel-loader'

**Cause**: Webpack config referenced babel-loader but it wasn't in package.json

**✅ FIXED**: Updated webpack.config.js to remove babel-loader requirement

**If you still see this error**:
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

---

### ❌ Error: Cannot find module 'archiver'

**Cause**: archiver is needed for the packaging script

**Fix**:
```bash
npm install archiver --save-dev
npm run package
```

---

### ❌ Error: Entry module not found

**Cause**: Webpack can't find src/main.js

**Fix**:
```bash
# Make sure you're in the right directory
pwd  # Should show: .../qlik-ioconnect-channels-extension

# Check file exists
ls -la src/main.js

# If missing, you may need to re-extract the ZIP
```

---

### ❌ Error: Cannot find module '@interopio/browser'

**Cause**: Dependencies not installed

**Fix**:
```bash
npm install
# Wait for installation to complete
npm run build
```

---

### ❌ Build succeeds but extension doesn't work in Qlik

**Cause**: CSS file not included in package

**Fix**:
```bash
# Verify CSS file exists
ls -la src/qlik-ioconnect-channels.css

# Rebuild package
npm run package

# Check the ZIP contains all 3 files:
unzip -l release/qlik-ioconnect-channels.zip
# Should show:
#   qlik-ioconnect-channels.js
#   qlik-ioconnect-channels.css
#   qlik-ioconnect-channels.qext
```

---

## Step-by-Step Clean Build

If nothing works, start fresh:

```bash
# 1. Clean everything
rm -rf node_modules package-lock.json dist release

# 2. Install dependencies
npm install

# 3. Verify installation
npm list --depth=0
# Should show:
#   @interopio/browser@3.x.x
#   archiver@6.x.x
#   webpack@5.x.x
#   webpack-cli@5.x.x

# 4. Build
npm run build

# 5. Check output
ls -lh dist/qlik-ioconnect-channels.js
# Should show a file around 200-300 KB

# 6. Package
npm run package

# 7. Verify package
ls -lh release/qlik-ioconnect-channels.zip
unzip -l release/qlik-ioconnect-channels.zip
```

---

## Node Version Issues

**Error**: Various webpack errors about syntax

**Fix**: Update Node.js to version 14 or higher

```bash
# Check version
node --version

# Should be v14.0.0 or higher
# If not, download from: https://nodejs.org/
```

---

## Webpack Mode Warnings

**Warning**: "The 'mode' option has not been set"

**This is harmless**, but to fix:
```bash
# Use explicit mode flags
npm run build        # Uses --mode production
npm run build:dev    # Uses --mode development
```

---

## Permission Errors (Windows)

**Error**: EPERM: operation not permitted

**Fix**: Run as administrator or:
```bash
# Close any programs that might have files open
# (Qlik Sense Desktop, IDEs, etc.)

# Then retry
npm run build
```

---

## Permission Errors (Mac/Linux)

**Error**: EACCES: permission denied

**Fix**:
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Then retry
npm run build
```

---

## Network/Firewall Issues

**Error**: Error: connect ETIMEDOUT while installing

**Fix**:
```bash
# Use different registry
npm config set registry https://registry.npmjs.org/

# Or use a VPN if behind corporate firewall
# Then retry
npm install
```

---

## Quick Verification After Build

Run this to verify everything is working:

```bash
# 1. Check build output exists
test -f dist/qlik-ioconnect-channels.js && echo "✓ JS built" || echo "✗ JS missing"

# 2. Check file size is reasonable
SIZE=$(wc -c < dist/qlik-ioconnect-channels.js)
if [ $SIZE -gt 50000 ]; then
  echo "✓ Build size OK: $SIZE bytes"
else
  echo "✗ Build too small: $SIZE bytes"
fi

# 3. Check package created
test -f release/qlik-ioconnect-channels.zip && echo "✓ ZIP created" || echo "✗ ZIP missing"

# 4. Check ZIP contents
echo "ZIP contents:"
unzip -l release/qlik-ioconnect-channels.zip
```

---

## Still Having Issues?

1. **Check the main.js file**: Make sure `import IOBrowser from '@interopio/browser';` is at the top
2. **Verify webpack.config.js**: Should have `type: 'amd'` in library config
3. **Check package.json**: Should have @interopio/browser in dependencies
4. **Try manual build**:
   ```bash
   npx webpack --mode production --config webpack.config.js
   ```

---

## Getting Help

If you're still stuck:
1. Check the error message carefully
2. Look at the full stack trace
3. Check webpack.config.js matches the version in this guide
4. Verify Node.js version: `node --version`
5. Check npm version: `npm --version`

---

## Success Checklist

✅ `npm install` completes without errors  
✅ `dist/qlik-ioconnect-channels.js` exists after build  
✅ File size is 200-300 KB  
✅ `npm run package` creates ZIP  
✅ ZIP contains 3 files (.js, .css, .qext)  
✅ Extension installs in Qlik without errors  

---

Built with ❤️ for interop.io
