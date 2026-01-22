const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function rawList() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const fetch = require('node-fetch');
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            console.log("Found models (filtered):");
            const models = data.models.map(m => m.name).filter(n => n.includes('gemini') && n.includes('flash'));
            console.log(models.join('\n'));

            console.log("\nPro models:");
            const pro = data.models.map(m => m.name).filter(n => n.includes('gemini') && n.includes('pro'));
            console.log(pro.join('\n'));
        } else {
            console.log("No models found or error:", JSON.stringify(data));
        }
    } catch (e) {
        console.error(e);
    }
}

rawList();
