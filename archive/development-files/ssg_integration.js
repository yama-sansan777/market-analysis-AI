const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

class SSGIntegration {
  constructor() {
    this.templatesDir = './templates';
    this.outputDir = './dist';
    this.dataDir = './_data';
  }

  // テンプレート読み込み
  loadTemplate(templateName) {
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(templateContent);
  }

  // データ読み込み
  loadData() {
    const dataPath = path.join(this.dataDir, 'reportData.json');
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    return null;
  }

  // アーカイブデータ読み込み
  loadArchiveData() {
    const archiveDir = './archive_data';
    const files = fs.readdirSync(archiveDir).filter(file => file.endsWith('.json'));
    
    return files.map(file => {
      const content = JSON.parse(fs.readFileSync(path.join(archiveDir, file), 'utf8'));
      const date = file.replace('.json', '');
      return {
        date: date,
        data: content
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // サイト生成
  async generateSite() {
    console.log('🏗️ 静的サイト生成中...');

    // 出力ディレクトリ作成
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // メインページ生成
    await this.generateMainPage();
    
    // アーカイブページ生成
    await this.generateArchivePages();
    
    // アセットコピー
    await this.copyAssets();

    console.log('✅ 静的サイト生成完了');
  }

  // メインページ生成
  async generateMainPage() {
    const template = this.loadTemplate('index');
    const data = this.loadData();
    
    if (!data) {
      console.warn('⚠️ データが見つかりません');
      return;
    }

    const html = template(data);
    const outputPath = path.join(this.outputDir, 'index.html');
    fs.writeFileSync(outputPath, html);
    
    console.log('📄 メインページ生成完了');
  }

  // アーカイブページ生成
  async generateArchivePages() {
    const template = this.loadTemplate('archive');
    const archiveData = this.loadArchiveData();
    
    // アーカイブディレクトリ作成
    const archiveDir = path.join(this.outputDir, 'archive');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // 各アーカイブページ生成
    for (const item of archiveData) {
      const html = template(item.data);
      const outputPath = path.join(archiveDir, `${item.date}.html`);
      fs.writeFileSync(outputPath, html);
    }
    
    console.log(`📚 ${archiveData.length}個のアーカイブページ生成完了`);
  }

  // アセットコピー
  async copyAssets() {
    const assetsDir = './assets';
    const outputAssetsDir = path.join(this.outputDir, 'assets');
    
    if (fs.existsSync(assetsDir)) {
      // ディレクトリコピー関数
      const copyDir = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const items = fs.readdirSync(src);
        for (const item of items) {
          const srcPath = path.join(src, item);
          const destPath = path.join(dest, item);
          
          if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      
      copyDir(assetsDir, outputAssetsDir);
      console.log('📁 アセットコピー完了');
    }
  }

  // サイトデプロイ
  async deploySite() {
    console.log('🚀 サイトデプロイ中...');
    
    // 実際のデプロイ処理（例：GitHub Pages、Netlify等）
    // ここでは例として、distディレクトリの内容を確認
    const files = fs.readdirSync(this.outputDir);
    console.log('📦 生成されたファイル:', files);
    
    console.log('✅ デプロイ完了');
  }
}

module.exports = SSGIntegration;