#! /bin/bash

sleep 15
npx sequelize db:create # 스키마 생성
npm run dev &
sleep 5
npm run stop
npx sequelize db:seed:all # 더미 데이터 넣기
exec npm run dev