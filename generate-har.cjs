const fs = require('fs');
const path = require('path');

const browserHeaders = [
  { "name": "Accept", "value": "*/*" },
  { "name": "Accept-Language", "value": "en-US" },
  { "name": "Origin", "value": "http://localhost:4000" },
  { "name": "Referer", "value": "http://localhost:4000/" }
];

const harData = {
  "log": {
    "version": "1.2",
    "creator": { "name": "Playwright", "version": "1.44.0" },
    "entries": [
      {
        "request": {
          "method": "GET",
          "url": "https://education-services.ru",
          "headers": [...browserHeaders]
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "headers": [{ "name": "content-type", "value": "application/json" }],
          "content": {
            "mimeType": "application/json",
            "text": JSON.stringify({
              "success": true,
              "data": [
                { "_id": "643d69a5c3f7b9001cfa093c", "name": "Краторная булка N-200i", "type": "bun", "price": 1255, "proteins": 80, "fat": 24, "carbohydrates": 53, "calories": 420, "image": "", "image_mobile": "", "image_large": "" },
                { "_id": "643d69a5c3f7b9001cfa0941", "name": "Биокотлета из марсианской Магнолии", "type": "main", "price": 424, "proteins": 420, "fat": 142, "carbohydrates": 242, "calories": 4242, "image": "", "image_mobile": "", "image_large": "" }
              ]
            })
          }
        }
      },
      {
        "request": {
          "method": "GET",
          "url": "https://education-services.ru",
          "headers": [
            ...browserHeaders,
            { "name": "Authorization", "value": "Bearer mock-valid-access-token" },
            { "name": "authorization", "value": "Bearer mock-valid-access-token" }
          ]
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "headers": [{ "name": "content-type", "value": "application/json" }],
          "content": {
            "mimeType": "application/json",
            "text": JSON.stringify({
              "success": true,
              "user": { "email": "tester@mail.ru", "name": "Tester" }
            })
          }
        }
      },
      {
        "request": {
          "method": "POST",
          "url": "https://education-services.ru",
          "headers": [
            ...browserHeaders,
            { "name": "Content-Type", "value": "application/json;charset=utf-8" },
            { "name": "content-type", "value": "application/json;charset=utf-8" },
            { "name": "Authorization", "value": "Bearer mock-valid-access-token" },
            { "name": "authorization", "value": "Bearer mock-valid-access-token" }
          ]
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "headers": [{ "name": "content-type", "value": "application/json" }],
          "content": {
            "mimeType": "application/json",
            "text": JSON.stringify({
              "success": true,
              "name": "Краторный био-марсианский бургер",
              "order": { "number": 77432 }
            })
          }
        }
      }
    ]
  }
};

const dir = path.join(__dirname, 'tests', 'hars');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'api.har'), JSON.stringify(harData, null, 2));
console.log('Автономный файл api.har успешно сгенерирован под старую версию Playwright!');