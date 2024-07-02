# Setup Project

- Create .env file

```bash
PORT=5500
DATABASE_URL="mysql://root:root@127.0.0.1:3306/belajar_typescript_restful_api"
```

- Install all dependencies

```bash
npm install
```

- Sync schema prisma models to database

```bash
  npx prisma migrate dev
```

- Import prisma client to node modules

```bash
  npx prisma generate
```

- Compile typescript files to javascript

```bash
tsc
```

- OR

```bash
npm run build
```

- Run compiled/builded javascript project

```bash
node dist/main.js
```

- OR

```bash
npm run start
```
