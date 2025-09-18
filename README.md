# API Случайных Интересных Фактов (Node.js версия)

Это REST API на Node.js/Express для получения случайных интересных фактов без повторений подряд.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск сервера
```bash
# Режим разработки
npm run dev

# Production режим
npm start
```

Сервер запустится на `http://localhost:3000`

## 📡 API Эндпоинты

### Получение случайного факта
```
GET /random-fact?user_id=12345
```

**Пример ответа:**
```json
{
  "id": 42,
  "text": "В среднем человек за всю жизнь тратит на поцелуи 2 недели."
}
```

### Получение факта по ID
```
GET /fact/42
```

### Получение количества фактов
```
GET /facts/count
```

**Ответ:**
```json
{
  "total_facts": 245
}
```

### Проверка здоровья сервиса
```
GET /health
```

**Ответ:**
```json
{
  "status": "ok",
  "facts_loaded": 245,
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Статистика API
```
GET /stats
```

**Ответ:**
```json
{
  "total_facts": 245,
  "total_users": 15,
  "total_requests": 234,
  "facts_range": {
    "min_id": 1,
    "max_id": 245
  }
}
```

## 💡 Особенности

- ✅ **Предотвращение повторений**: Один и тот же факт не повторяется подряд для пользователя
- ✅ **CORS поддержка**: Можно вызывать с любого домена
- ✅ **Автоматический сброс**: Когда все факты показаны, история сбрасывается
- ✅ **Экономия памяти**: Хранится только последние 10 фактов на пользователя
- ✅ **Подробная статистика**: Мониторинг использования API

## 🛠 Использование в коде

### JavaScript (Fetch API)
```javascript
// Получение случайного факта
async function getRandomFact(userId) {
    try {
        const response = await fetch(`http://localhost:3000/random-fact?user_id=${userId}`);
        const fact = await response.json();

        if (response.ok) {
            console.log(`Факт #${fact.id}: ${fact.text}`);
            return fact;
        } else {
            console.error('Ошибка:', fact.error);
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
}

// Использование
getRandomFact('user123');
```

### JavaScript (Axios)
```javascript
const axios = require('axios');

async function getRandomFact(userId) {
    try {
        const response = await axios.get(`http://localhost:3000/random-fact?user_id=${userId}`);
        console.log(`Факт #${response.data.id}: ${response.data.text}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:', error.response?.data || error.message);
    }
}
```

### Python
```python
import requests

def get_random_fact(user_id):
    try:
        response = requests.get(f'http://localhost:3000/random-fact?user_id={user_id}')
        response.raise_for_status()
        fact = response.json()
        print(f"Факт #{fact['id']}: {fact['text']}")
        return fact
    except requests.RequestException as e:
        print(f"Ошибка: {e}")
        return None

# Использование
fact = get_random_fact('user123')
```

### cURL
```bash
# Случайный факт
curl "http://localhost:3000/random-fact?user_id=user123"

# Проверка здоровья
curl "http://localhost:3000/health"

# Количество фактов
curl "http://localhost:3000/facts/count"

# Факт по ID
curl "http://localhost:3000/fact/42"

# Статистика
curl "http://localhost:3000/stats"
```

## 🚀 Развертывание

Проект готов к развертыванию на [Render.com](https://render.com) для публичного доступа.

### Быстрое развертывание:
1. Зарегистрируйтесь на [render.com](https://render.com)
2. Создайте новый **Web Service**
3. Подключите этот Git репозиторий
4. Render автоматически обнаружит настройки из `package.json` и `Procfile`

📖 **Подробная инструкция:** [RENDER_DEPLOY.md](RENDER_DEPLOY.md)

## 🏗 Структура проекта

```
facts-api-nodejs/
├── server.js           # Основной файл сервера
├── facts.json          # База данных фактов (245 фактов)
├── package.json        # Зависимости и скрипты
├── Procfile           # Настройки для Render
├── .gitignore         # Исключаемые файлы Git
├── test_api.js        # Скрипт для тестирования
├── quick_test.js      # Быстрый тест API
├── RENDER_DEPLOY.md   # Инструкция по развертыванию
└── README.md          # Эта документация
```

## 📊 Статистика

- **Всего фактов:** 245
- **Диапазон ID:** 1-245
- **Язык:** Node.js
- **Фреймворк:** Express.js
- **Поддержка повторений:** ✅

## 🚀 Развертывание

### На Render.com
1. Создайте аккаунт на [render.com](https://render.com)
2. Создайте новый **Web Service**
3. Подключите ваш Git репозиторий
4. Настройки:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### На Heroku
```bash
# Создайте Procfile
echo "web: npm start" > Procfile

# Установите переменную PORT
# Heroku автоматически установит PORT
```

### На VPS
```bash
# Используйте PM2 для управления процессом
npm install -g pm2
pm2 start server.js --name "facts-api"
pm2 startup
pm2 save
```

## 🔧 Настройка

### Переменные окружения
```bash
PORT=3000  # Порт сервера (по умолчанию 3000)
```

### Кастомизация
- Измените `facts.json` для добавления новых фактов
- Модифицируйте логику в `server.js` для дополнительных функций
- Добавьте middleware для аутентификации, rate limiting и т.д.

## 🐛 Устранение неполадок

### Ошибка: "facts.json not found"
```bash
# Убедитесь, что файл существует
ls -la facts.json

# Проверьте права доступа
chmod 644 facts.json
```

### Ошибка: "Port already in use"
```bash
# Найдите процесс, использующий порт
lsof -i :3000

# Или используйте другой порт
PORT=3001 npm start
```

### Ошибка: "Cannot read property 'length' of undefined"
```bash
# Проверьте корректность facts.json
node -e "console.log(JSON.parse(require('fs').readFileSync('facts.json', 'utf8')).length)"
```

## 🔄 API vs Python версия

| Функция | Node.js | Python |
|---------|---------|---------|
| Скорость запуска | ⚡ Быстрее | 🐌 Медленнее |
| Память | 💾 Меньше | 📈 Больше |
| Развертывание | 🟢 Проще | 🟡 Сложнее |
| Экосистема | 📚 Огромная | 📖 Большая |
| Типизация | ❌ Нет | ✅ Доступна |

## 🤝 Contributing

1. Fork проект
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект создан для образовательных целей. MIT License.
