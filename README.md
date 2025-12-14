1. Cài dependencies
npm install

2. Tạo file .env
DATABASE_URL="mysql://root:password@localhost:3307/db_capstone"
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=5h

3. Generate Prisma & chạy server
npm run build
npm run dev

API DOCUMENTATION
Swagger UI: http://localhost:5000/docs
Base URL: http://localhost:5000/api/pinterest

API ENDPOINTS

AUTH
POST   /auth/register        Register
POST   /auth/login           Login

IMAGE
GET    /image/list           Get all images
GET    /image/search         Search images
GET    /image/image-info/:id Image detail
POST   /image/create         Upload image
DELETE /image/delete/:id     Delete image

COMMENT & SAVE
GET    /image/comment/:id    Get comments
POST   /image/comment        Create comment
GET    /image/save/:id       Check saved
POST   /image/save/:id       Save / Unsave

USER
GET    /user                 User info
GET    /user/images-saved    Saved images
GET    /user/images-created Created images
PUT    /user/update          Update profile
