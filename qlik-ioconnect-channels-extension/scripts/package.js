const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Ensure dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Create release directory
const releaseDir = path.join(__dirname, '..', 'release');
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir);
}

// Output file
const outputPath = path.join(releaseDir, 'qlik-ioconnect-channels.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(`✓ Package created: ${outputPath}`);
  console.log(`  Total bytes: ${archive.pointer()}`);
  console.log('\nReady to upload to Qlik Cloud!');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add files to archive
console.log('Packaging extension...');

// Add main JS file
archive.file(path.join(distDir, 'qlik-ioconnect-channels.js'), {
  name: 'qlik-ioconnect-channels.js'
});

// Add CSS file
const cssPath = path.join(__dirname, '..', 'src', 'qlik-ioconnect-channels.css');
if (fs.existsSync(cssPath)) {
  archive.file(cssPath, {
    name: 'qlik-ioconnect-channels.css'
  });
}

// Add qext file
const qextPath = path.join(__dirname, '..', 'src', 'qlik-ioconnect-channels.qext');
if (fs.existsSync(qextPath)) {
  archive.file(qextPath, {
    name: 'qlik-ioconnect-channels.qext'
  });
}

archive.finalize();
