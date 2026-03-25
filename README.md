# Triage Backend

This backend is prepared for:

- local development with PostgreSQL and local file storage
- Vercel deployment with Neon PostgreSQL
- explicit database migrations instead of `sequelize.sync()`

## Environment variables

Copy `.env.example` and set the values you need.

Required:

- `DATABASE_URL`
- `JWT_SECRET_KEY`

Recommended for Vercel:

- `FILE_STORAGE=blob`
- `BLOB_ACCESS=private`
- `BLOB_READ_WRITE_TOKEN`
- `CORS_ORIGIN`

## Local development

```bash
npm install
npm run db:migrate
npm run dev
```

## Production deployment

1. Create a Neon database and set `DATABASE_URL` in Vercel.
2. Configure file storage:
   Set `FILE_STORAGE=blob` and add `BLOB_READ_WRITE_TOKEN`.
3. Run migrations against the production database:

```bash
npm install
npm run db:migrate
```

4. Deploy to Vercel.

## Notes

- The app now exports an Express handler for Vercel from `api/index.js`.
- Files are served through `/api/files/:filename`.
- File retrieval is protected by JWT auth.
- The default upload limit is `4 MB` via `MAX_UPLOAD_SIZE_BYTES`. If you need larger uploads on Vercel, direct-to-Blob uploads from the frontend are the safer path.
