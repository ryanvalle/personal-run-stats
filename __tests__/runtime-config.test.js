const fs = require('fs');
const path = require('path');

describe('Runtime Configuration', () => {
  describe('package.json', () => {
    it('should have engines.node requirement for Node 24 or higher', () => {
      const packageJsonPath = path.join(__dirname, '..', 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBeDefined();
      
      // Check that the engines.node field mentions "24" or ">=24"
      const nodeVersion = packageJson.engines.node;
      expect(nodeVersion).toMatch(/24/);
      expect(nodeVersion).toMatch(/>=24/);
    });
  });

  describe('.nvmrc', () => {
    it('should exist', () => {
      const nvmrcPath = path.join(__dirname, '..', '.nvmrc');
      expect(fs.existsSync(nvmrcPath)).toBe(true);
    });

    it('should contain version 24', () => {
      const nvmrcPath = path.join(__dirname, '..', '.nvmrc');
      const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf8').trim();
      
      // Check that the .nvmrc file starts with "24"
      expect(nvmrcContent).toMatch(/^24/);
    });
  });
});
