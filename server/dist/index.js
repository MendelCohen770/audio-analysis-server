"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const openai_1 = __importDefault(require("openai"));
const http_1 = require("http");
dotenv_1.default.config();
const openai = new openai_1.default();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/chat", async (req, res) => {
    const text = req.body.text;
    if (!text) {
        const response = "המשתמש לא הזכיר חיות.";
        return res.status(400).json(response);
    }
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "אתה מזהה באילו חיות המשתמש הזכיר אם הוא אוהב או לא אוהב אותן, וענה בכמות מילים מינימלית. לדוגמא:המשתמש מאוד אוהב כלבים, המשתמש מחבב חתולים, המשתמש ממש שונא נחשים, המשתמש אין לו בעיה עם קופים."
                },
                {
                    role: "user",
                    content: text
                }
            ]
        });
        const response = completion.choices[0].message.content;
        res.status(200).json({ response });
    }
    catch (error) {
        console.error("Error in chat completion:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
