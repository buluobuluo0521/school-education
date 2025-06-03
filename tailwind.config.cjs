// 需要添加自定义CSS路径到content配置项
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/Index/css/app.css" // 添加这一行
  ],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // 可根据需求选择主题
  }
};
  