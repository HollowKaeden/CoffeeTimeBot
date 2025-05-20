
# Coffee Shop Mini App (Frontend)

Это клиентская часть Telegram Mini App для заказа кофе с добавками. Приложение реализовано на React с использованием Telegram WebApp API и взаимодействует с backend-сервисом через REST API.

## 📌 Репозиторий клиента

[Coffee Shop Backend](https://github.com/HollowKaeden/CoffeeTimeBotAPI)

## 🌐 Демо

Запустить мини-приложение можно по ссылке:  
[Telegram-бот](https://t.me/coffee_time_nt_bot)

## 🎯 Возможности

- Просмотр ассортимента кофе и доступных добавок.  
- Формирование заказа с выбором напитков и добавок.
- Отправка заказа на сервер.  
- Просмотр истории собственных заказов.  
- Авторизация через Telegram WebApp `initData`.  

## ⚙️ Используемые технологии

- React с функциональными компонентами и хуками.  
- Telegram WebApp API для интеграции с Telegram.  
- Bootstrap 5 — для стилизации интерфейса.  
- React Router для маршрутизации по страницам.  
- Axios для сетевых запросов к backend.

## 🚀 Быстрый старт

### Клонирование репозитория

```bash
git clone git@github.com:HollowKaeden/CoffeeTimeBot.git
cd CoffeeTimeBot
```

### Настройка подключения к backend

Создайте файл `.env` в корневой папке проекта и укажите там адрес вашего backend API:

```env
REACT_APP_BACKEND_URL=https://адрес_вашего_бэкенда/api/v1/
```

Этот URL будет использоваться для всех API-запросов приложения.

### Деплой

Далее необходимо развернуть frontend на удобном вам хостинге и настроить MiniApp через BotFather, указав URL сайта

