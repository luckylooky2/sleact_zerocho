# 1. 이미지 생성 : docker build -t react .
# 2. 컨테이너 생성 : docker run -p 3000:3000 -v $PWD:/app --name react react
# 3. 컨테이너 종료 : docker stop react
# 4. 컨테이너 다시 실행 : docker start -a react
# 5. 컨테이너 삭제 : docker rm react

FROM node:16
WORKDIR /app/backend
COPY backend/package.json .
RUN npm install
COPY backend .

EXPOSE 3095

CMD ["bash", "setup.sh"]
