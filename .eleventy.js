module.exports = function(eleventyConfig) {
  // JSONファイルを静的ファイルとしてコピー
  eleventyConfig.addPassthroughCopy("live_data");
  eleventyConfig.addPassthroughCopy("archive_data");
  eleventyConfig.addPassthroughCopy("translations");
  
  // 静的アセットをそのままコピー
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("lang.js");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("image");
  
  // JSONデータファイルを監視対象に追加（開発時の自動リロード用）
  eleventyConfig.addWatchTarget("./live_data/");
  eleventyConfig.addWatchTarget("./archive_data/");
  eleventyConfig.addWatchTarget("./translations/");
  
  // Nunjucksテンプレートエンジンを使用
  eleventyConfig.setTemplateFormats([
    "md",
    "njk",
    "html",
    "liquid"
  ]);
  
  // HTMLを美化
  eleventyConfig.setDataDeepMerge(true);
  
  // 多言語対応のためのフィルター
  eleventyConfig.addFilter("lang", function(data, lang) {
    return data.languages && data.languages[lang] ? data.languages[lang] : data;
  });
  
  // 日付フォーマットフィルター
  eleventyConfig.addFilter("dateFormat", function(date, format) {
    const moment = require('moment');
    return moment(date).format(format);
  });
  
  return {
    // 入力ディレクトリ
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    
    // テンプレートエンジン設定
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};