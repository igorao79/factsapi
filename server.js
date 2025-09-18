const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Хранилище истории пользователей (в памяти)
const userHistory = new Map();

// Загрузка фактов из файла
function loadFacts() {
    try {
        const factsPath = path.join(__dirname, 'facts.json');
        const factsData = fs.readFileSync(factsPath, 'utf8');
        const facts = JSON.parse(factsData);
        console.log(`✅ Загружено ${facts.length} фактов`);
        return facts;
    } catch (error) {
        console.error('❌ Ошибка при загрузке фактов:', error.message);
        return [];
    }
}

const facts = loadFacts();

// Получение случайного факта
app.get('/random-fact', (req, res) => {
    const userId = req.query.user_id;

    if (!userId) {
        return res.status(400).json({
            error: 'user_id is required'
        });
    }

    // Получаем историю пользователя
    if (!userHistory.has(userId)) {
        userHistory.set(userId, []);
    }

    const history = userHistory.get(userId);

    // Находим доступные факты (исключая последний)
    const availableFacts = facts.filter(fact => !history.includes(fact.id));

    let selectedFact;

    if (availableFacts.length === 0) {
        // Если все факты были показаны, сбрасываем историю
        userHistory.set(userId, []);
        selectedFact = facts[Math.floor(Math.random() * facts.length)];
    } else {
        // Выбираем случайный факт из доступных
        selectedFact = availableFacts[Math.floor(Math.random() * availableFacts.length)];
    }

    // Добавляем в историю
    history.push(selectedFact.id);

    // Ограничиваем историю до последних 10 фактов для экономии памяти
    if (history.length > 10) {
        history.shift();
    }

    res.json(selectedFact);
});

// Получение количества фактов
app.get('/facts/count', (req, res) => {
    res.json({
        total_facts: facts.length
    });
});

// Проверка здоровья сервиса
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        facts_loaded: facts.length,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Получение факта по ID
app.get('/fact/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const fact = facts.find(f => f.id === id);

    if (!fact) {
        return res.status(404).json({
            error: 'Fact not found'
        });
    }

    res.json(fact);
});

// Статистика API
app.get('/stats', (req, res) => {
    const totalUsers = userHistory.size;
    const totalRequests = Array.from(userHistory.values())
        .reduce((sum, history) => sum + history.length, 0);

    res.json({
        total_facts: facts.length,
        total_users: totalUsers,
        total_requests: totalRequests,
        facts_range: facts.length > 0 ? {
            min_id: Math.min(...facts.map(f => f.id)),
            max_id: Math.max(...facts.map(f => f.id))
        } : null
    });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// 404 обработчик
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Facts API запущен на порту ${PORT}`);
    console.log(`📊 Доступно ${facts.length} фактов`);
    console.log(`🌐 http://localhost:${PORT}`);
});

module.exports = app;
