# GreenLog

GreenLog is a PWA to help my girlfriend and I take better care of our plant babies.

## Tech Stack
- [API Server](/api/)
  - [Fastify](https://www.fastify.io/)
  - [Typescript](https://www.typescriptlang.org/)
  - [Prisma ORM](https://www.prisma.io/)
  - [PostgreSQL](https://www.postgresql.org/)
- [Web Application](/app/)
  - [React](https://reactjs.org/) / [Next.js](https://nextjs.org/)
  - [Typescript](https://www.typescriptlang.org/)
  - [TailwindCSS](https://tailwindcss.com/)

## Requirements
- Node > 14.0
- Typescript
- PostgreSQL DB

## API Environment Variables
Include in api/.env

| Variable Name | Type   |
|---------------|--------|
| API_PORT      | number |
| DATABASE_URL  | string |
| NODE_ENV      | string |
| JWT_SECRET    | string |
| SALT_ROUNDS   | number |

## Installation/Setup
```bash
# API
cd api
yarn # npm i

# APP (Next.js)
cd app
yarn # npm i
```

## Start Application
```bash
cd api
yarn dev # npm run dev

cd app
yarn dev # npm run dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

View the [Project Board](https://github.com/users/devinsharpe/projects/2) to see where this project is headed in the future

## Authors
- [Devin Sharpe](https://github.com/devinsharpe)

## License
[MIT](https://choosealicense.com/licenses/mit/)