## Capstone Pinterest Backend 

### Link deploy (Render)
- Swagger: https://capstone-express-orm-f2d6.onrender.com/docs
- API base: https://capstone-express-orm-f2d6.onrender.com/api/pinterest

### Video demo (YouTube)
- https://www.youtube.com/watch?v=hXy0N0kQ7MA

### Chạy local nhanh
```bash
npm install

# .env 
DATABASE_URL="mysql://root:password@localhost:3307/db_capstone"
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=5h

npm run build
npm run dev
# Swagger: http://localhost:5000/docs
# API base: http://localhost:5000/api/pinterest
```

### API chính
- Auth: 
  - POST /auth/register
  - POST /auth/login
- Image:
  - GET /image/list
  - GET /image/search?searchText=...
  - GET /image/image-info/:id
  - POST /image/create (form-data: file, imageName)
  - DELETE /image/delete/:id
- Comment & Save:
  - GET /image/comment/:id
  - POST /image/comment
  - GET /image/save/:id
  - POST /image/save/:id
- User:
  - GET /user
  - GET /user/images-saved
  - GET /user/images-created
  - PUT /user/update
