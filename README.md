PROGIS Map

[Открыть публичное демо](https://richbanker.github.io/PROGIS-Map/)


[![Просмотры README](https://vbr.nathanchung.dev/badge?page_id=Richbanker.PROGIS-Map&text=README_Views)](https://github.com/Richbanker/PROGIS-Map)

[Репозиторий — счётчик переходов](https://rebrand.ly/richbanker-progis)

Одностраничное веб-приложение на React + TypeScript с интерактивной картой на Leaflet. Поддерживает слои XYZ, WMS и WFS, обработку кликов по объектам, получение данных через GetFeatureInfo / GeoJSON, подсветку выбранных объектов, drag-and-drop порядок слоёв и всплывающие окна с атрибутами.

📦 Стек технологий

React, TypeScript, Vite, Tailwind CSS

react-leaflet, Leaflet

axios, Zustand

dnd-kit

ESLint, Prettier, Husky + lint-staged

Vitest

🚀 Запуск проекта

Установите Node.js 18+

Установите зависимости:

npm install


Запустите проект в режиме разработки:

npm run dev


Сборка и предпросмотр:

npm run build && npm run preview

⚙️ Конфигурация

Создайте файл .env в корне проекта (если используется Basic Auth):

VITE_WMS_USER=mo
VITE_WMS_PASS=mo


Пример конфигурации слоёв: src/config/layers.json

[
  {
    "id": "osm",
    "type": "xyz",
    "name": "OpenStreetMap",
    "url": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "visible": true
  },
  {
    "id": "countries",
    "type": "wms",
    "name": "Страны мира",
    "url": "https://demo.zulugis.ru/geoserver/wms",
    "layers": "ne:ne_10m_admin_0_countries",
    "version": "1.3.0",
    "visible": true
  }
]

🗺️ Основные возможности

Поддержка слоёв XYZ, WMS и WFS

Обработка кликов и получение атрибутов объектов

Popup с данными и копированием в JSON

Подсветка и центрирование выбранного объекта

Drag-and-drop порядок слоёв

Уведомления об ошибках

📁 Структура проекта
src/
  app/App.tsx
  components/MapView/
    MapView.tsx
    LayerControl.tsx
    FeaturePopup.tsx
  components/common/Spinner.tsx
  config/layers.json
  lib/ogc/wms.ts
  lib/ogc/wfs.ts
  state/selection.ts
  styles/index.css
  types/ogc.ts
  utils/leaflet.ts


💡 Проект демонстрирует навыки работы с геосервисами OGC (WMS/WFS), интеграцию с внешними API, работу с пространственными данными и построение интерактивных интерфейсов на React.
