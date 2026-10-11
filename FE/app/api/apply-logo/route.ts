import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { demoId } = await req.json();

    const demoFiles: Record<string, string> = {
      demo1: 'demo1-transparent.png',
      demo2: 'demo2-darkmode-contrast.png',
      demo3: 'demo3-dark-glass-badge.png',
      demo4: 'demo4-heritage-gold.png',
    };

    const fileName = demoFiles[demoId];
    if (!fileName) {
      return NextResponse.json({ error: 'Invalid demo ID' }, { status: 400 });
    }

    const projectRoot = path.resolve(process.cwd(), '..');
    const fePublic = path.resolve(process.cwd(), 'public');
    const demoFilePath = path.join(fePublic, 'logo-demos', fileName);

    if (!fs.existsSync(demoFilePath)) {
      return NextResponse.json({ error: 'Demo file not found' }, { status: 404 });
    }

    const data = fs.readFileSync(demoFilePath);

    // Copy to all active logo destinations
    const dests = [
      path.join(fePublic, 'Logo CH1.png'),
      path.join(fePublic, 'logo-ch1.png'),
      path.join(fePublic, 'landing-pages', 'Logo CH1.png'),
      path.join(fePublic, 'landing-pages', 'logo-ch1.png'),
      path.join(projectRoot, 'image', 'Logo CH1.png'),
    ];

    dests.forEach((dest) => {
      try {
        fs.writeFileSync(dest, data);
      } catch (err) {
        console.warn('Failed to write to', dest, err);
      }
    });

    return NextResponse.json({ success: true, appliedDemo: demoId });
  } catch (err) {
    console.error('Error applying logo:', err);
    return NextResponse.json({ error: 'Failed to apply logo' }, { status: 500 });
  }
}
