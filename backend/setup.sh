#! /bin/bash

sleep 10

npx sequelize db:create # 스키마 생성
npx sequelize db:seed:all # 더미 데이터 넣기
exec npm run dev