# Measurements Dashboard — Angular 20 + Material 20

Latest Angular & Material, wired to your .NET API:

**Auth**
- `POST /api/account/login` → `{ Token, Expiration }`
- `POST /api/account/change-password`

**Series**
- `GET /api/series`, `GET /api/series/{id}`, `POST /api/series`, `PUT /api/series/{id}`

**Measurements**
- `GET /api/measurement` (paged, filters)
- `GET /api/measurement/{id}`
- `POST /api/measurement`
- `PUT /api/measurement/{id}`
- `DELETE /api/measurement/{id}`
- `GET /api/measurement/export` (printable HTML)

## Run
```bash
npm i
npm start
```
Set API URL in `src/environments/environment*.ts`.

## Notes
- Click table row → highlights corresponding point on chart.
- Print uses backend export (opens `/api/measurement/export?...`), with `/print` client fallback.
- Series admin supports create & update; your API has no DELETE for series.
- Uses Angular standalone components and Material 20 theming.
- Node 18/20/22 supported. If you see `ENOTEMPTY rename`, close IDE, remove `node_modules` & `package-lock.json`, run `npm cache clean --force`, then `npm i`.
