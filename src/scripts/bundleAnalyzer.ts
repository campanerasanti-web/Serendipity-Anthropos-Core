/**
 * Bundle Size Analyzer
 * Tracks JavaScript bundle size and dependencies
 */

import * as fs from 'fs';
import * as path from 'path';

interface BundleAnalysis {
  totalSize: number;
  gzipSize: number;
  chunks: Array<{ name: string; size: number; gzipSize: number }>;
  timestamp: string;
}

const BUNDLE_ANALYSIS_FILE = 'bundle-analysis.json';
const BUNDLE_SIZE_LIMIT = 500 * 1024; // 500KB threshold
const GZIP_SIZE_LIMIT = 150 * 1024; // 150KB gzip threshold

export const analyzeBundle = async (): Promise<BundleAnalysis> => {
  console.log('\n📦 Analyzing bundle size...\n');

  const distDir = './dist';
  let totalSize = 0;
  let gzipSize = 0;
  const chunks: BundleAnalysis['chunks'] = [];

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run: npm run build');
    process.exit(1);
  }

  // Analyze all .js files
  const jsFiles = fs.readdirSync(distDir).filter((f) => f.endsWith('.js'));

  for (const file of jsFiles) {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    totalSize += size;

    // Approximate gzip size (usually ~30% of original)
    const approximateGzip = Math.ceil(size * 0.3);
    gzipSize += approximateGzip;

    chunks.push({
      name: file,
      size,
      gzipSize: approximateGzip,
    });

    console.log(`📄 ${file}`);
    console.log(`   Size: ${(size / 1024).toFixed(1)}KB`);
    console.log(`   Gzip: ~${(approximateGzip / 1024).toFixed(1)}KB`);
  }

  const analysis: BundleAnalysis = {
    totalSize,
    gzipSize,
    chunks: chunks.sort((a, b) => b.size - a.size),
    timestamp: new Date().toISOString(),
  };

  // Save analysis
  fs.writeFileSync(BUNDLE_ANALYSIS_FILE, JSON.stringify(analysis, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 BUNDLE ANALYSIS RESULTS:\n`);
  console.log(`  Total Size: ${(totalSize / 1024).toFixed(1)}KB`);
  console.log(`  Gzip Size: ~${(gzipSize / 1024).toFixed(1)}KB`);
  console.log(`  Files: ${jsFiles.length}`);
  console.log(`  Timestamp: ${analysis.timestamp}\n`);

  // Warnings
  if (totalSize > BUNDLE_SIZE_LIMIT) {
    console.warn(`⚠️  Bundle size exceeds threshold: ${(totalSize / 1024).toFixed(1)}KB > ${(BUNDLE_SIZE_LIMIT / 1024).toFixed(1)}KB`);
  }

  if (gzipSize > GZIP_SIZE_LIMIT) {
    console.warn(`⚠️  Gzip size exceeds threshold: ${(gzipSize / 1024).toFixed(1)}KB > ${(GZIP_SIZE_LIMIT / 1024).toFixed(1)}KB`);
  }

  console.log('\n✅ Analysis saved to bundle-analysis.json\n');

  return analysis;
};

export const compareBundles = () => {
  if (!fs.existsSync(BUNDLE_ANALYSIS_FILE)) {
    console.log('ℹ️  No previous analysis found');
    return;
  }

  const previous: BundleAnalysis = JSON.parse(
    fs.readFileSync(BUNDLE_ANALYSIS_FILE, 'utf-8')
  );

  console.log('\n📈 BUNDLE COMPARISON:\n');
  console.log(`Previous: ${(previous.totalSize / 1024).toFixed(1)}KB`);
  console.log(`Timestamp: ${previous.timestamp}`);
};

if (require.main === module) {
  analyzeBundle()
    .then(() => compareBundles())
    .catch((err) => {
      console.error('Bundle analysis failed:', err);
      process.exit(1);
    });
}
