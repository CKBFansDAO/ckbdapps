/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        content: '1024px',
      },
    },
    // ...
    lineClamp: {
      2: '2', // 设置最大显示的行数
      // 可根据需要添加更多的行数配置
    },

  },
  variants: {
    extend: {
      lineClamp: ['responsive'], // 扩展 lineClamp 变体
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // 引入 line-clamp 插件
    // ...
  ],
}
