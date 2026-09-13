// const express = require('express');
// const morgan = require('morgan');
// const cors = require('cors');
// const prisma = require('./src/prisma');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(morgan('dev'));
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const successResponse = (res, data, statusCode = 200) => {
//   return res.status(statusCode).json({ success: true, data });
// };

// const errorResponse = (res, message, statusCode = 400) => {
//   return res.status(statusCode).json({ success: false, error: message });
// };

// app.get('/talabalar', async (req, res) => {
//   try {
//     const users = await prisma.talaba.findMany();
//     return successResponse(res, users);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// });

// app.get('/talabalar/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);

//     const user = await prisma.talaba.findUnique({
//       where: { id },
//       include: {
//         posts: true,
//         _count: {
//           select: { posts: true }
//         }
//       }
//     });

//     if (!user) {
//       return errorResponse(res, 'Foydalanuvchi topilmadi', 404);
//     }

//     return successResponse(res, user);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// });

// app.post('/talabalar', async (req, res) => {
//   try {
//     const { ism, email, password } = req.body;
//     if (!ism || !email || !password) {
//       return errorResponse(res, 'Name, email va password kiritilishi shart', 400);
//     }

//     const user = await prisma.talaba.create({
//       data: { ism, email, password }
//     });

//     return successResponse(res, user, 201);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// });

// app.get('/posts', async (req, res) => {
//   try {
//     const { published, sortBy } = req.query;

//     const where = {};
//     if (published !== undefined) {
//       where.published = published === 'true';
//     }

//     const allowedSortFields = ['createdAt', 'likes', 'viewCount'];
//     let orderBy = { createdAt: 'desc' };

//     if (sortBy && allowedSortFields.includes(sortBy)) {
//       orderBy = { [sortBy]: 'desc' };
//     }

//     const posts = await prisma.post.findMany({
//       where,
//       include: { author: true },
//       orderBy
//     });

//     return successResponse(res, posts);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// });

// app.post('/posts', async (req, res) => {
//   try {
//     const { title, content, authorId, published } = req.body;

//     if (!title || !content || !authorId) {
//       return errorResponse(res, 'Title, content va authorId kiritilishi shart', 400);
//     }

//     const post = await prisma.post.create({
//       data: {
//         title,
//         content,
//         authorId: parseInt(authorId),
//         published: published !== undefined ? published : false
//       }
//     });

//     return successResponse(res, post, 201);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// });

// app.put('/posts/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const { title, content, published, viewCount, likes, authorId } = req.body;

//     const data = {};
//     if (title !== undefined) data.title = title;
//     if (content !== undefined) data.content = content;
//     if (published !== undefined) data.published = published;
//     if (viewCount !== undefined) data.viewCount = viewCount;
//     if (likes !== undefined) data.likes = likes;
//     if (authorId !== undefined) data.authorId = parseInt(authorId);

//     const post = await prisma.post.update({
//       where: { id },
//       data
//     });

//     return successResponse(res, post);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// });

// app.delete('/posts/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);

//     const existingPost = await prisma.post.findUnique({ where: { id } });
//     if (!existingPost) {
//       return errorResponse(res, 'Post topilmadi', 404);
//     }

//     await prisma.post.delete({ where: { id } });
//     return successResponse(res, { message: `Post ${id} o'chirildi` });
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server ${PORT}-portda ishlamoqda`);
// });



const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const talabaRoutes = require('./src/routes/talaba.routes');
const postRoutes = require('./src/routes/post.routes');
const authRotes = require('./src/routes/auth.rautes');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/talabalar', talabaRoutes);
app.use('/posts', postRoutes);
app.use('/auth', authRotes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Blog API ishlamoqda' });
});

module.exports = app;