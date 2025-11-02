const fs = require('fs');
const path = require('path');

describe('Node.js 24 Upgrade Validation', () => {
  const rootDir = path.join(__dirname, '..');

  describe('package.json', () => {
    let packageJson;

    beforeAll(() => {
      const packageJsonPath = path.join(rootDir, 'package.json');
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      packageJson = JSON.parse(packageJsonContent);
    });

    it('should have engines field defined', () => {
      expect(packageJson.engines).toBeDefined();
    });

    it('should specify Node.js 24 in engines.node field', () => {
      expect(packageJson.engines.node).toBeDefined();
      expect(packageJson.engines.node).toMatch(/24/);
    });

    it('should require Node.js >= 24.0.0', () => {
      expect(packageJson.engines.node).toBe('>=24.0.0');
    });
  });

  describe('.nvmrc', () => {
    it('should exist', () => {
      const nvmrcPath = path.join(rootDir, '.nvmrc');
      expect(fs.existsSync(nvmrcPath)).toBe(true);
    });

    it('should contain Node.js version 24', () => {
      const nvmrcPath = path.join(rootDir, '.nvmrc');
      const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf8').trim();
      expect(nvmrcContent).toMatch(/^24/);
    });
  });

  describe('nvmrc (alternative file)', () => {
    it('should exist', () => {
      const nvmrcPath = path.join(rootDir, 'nvmrc');
      expect(fs.existsSync(nvmrcPath)).toBe(true);
    });

    it('should contain Node.js version 24', () => {
      const nvmrcPath = path.join(rootDir, 'nvmrc');
      const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf8').trim();
      expect(nvmrcContent).toMatch(/^24/);
    });
  });
});
