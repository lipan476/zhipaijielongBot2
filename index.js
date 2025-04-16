require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 读取环境变量
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL; // 改用WEB_APP_URL更符合语义

console.log("🔍 服务器启动时读取的环境变量：");
console.log("BOT_TOKEN:", BOT_TOKEN ? "已加载 ✅" : "未定义 ❌");
console.log("WEB_APP_URL:", WEB_APP_URL);

if (!BOT_TOKEN) {
    console.error("❌ 错误: BOT_TOKEN 未定义，请检查环境变量！");
    process.exit(1);
}

app.use(express.json());

// ✅ 处理 Telegram Webhook
app.post('/webhook', async (req, res) => {
    console.log("📩 收到 Telegram 消息:", JSON.stringify(req.body, null, 2));

    if (!req.body || !req.body.message || !req.body.message.text) {
        console.error("❌ 错误: 收到的请求格式不正确");
        return res.sendStatus(400);
    }

    const message = req.body.message;
    const chatId = message.chat.id;

    //if (message.text === '/start') {
    if (message.text.startsWith('/start')) {
        //start tapps_App_Screen，/start tapps_New， /start tapps_recent
        
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        console.log(`🛠️ 正在向 Telegram 发送消息: ${url}`);

        try {
            const response = await axios.post(url, {
                chat_id: chatId,
                text: '🎮 Welcome to Solitaire Game! Click the button below to play:',
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Play Now 🎮",
                            web_app: { url: WEB_APP_URL } // 使用Web App方式打开
                        }]
                    ]
                }
            });

            console.log("✅ 发送成功:", response.data);
            res.sendStatus(200);
        } catch (error) {
            console.error("❌ 发送消息时出错:", error.response ? error.response.data : error.message);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(200);
    }
});

// ✅ 监听 `/`，避免 Vercel 404 错误
app.get('/', (req, res) => {
    res.send("🚀 Telegram Bot Server is running!");
});

// ✅ 启动服务器
app.listen(PORT, () => {
    console.log(`✅ 服务器运行在端口 ${PORT}`);
});