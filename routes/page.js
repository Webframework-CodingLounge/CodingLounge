const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn, async (req, res) => {
    try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('profile', {
      title: 'profile',
      posts: posts,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입' });
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', { title: '로그인' });
});

router.get('/post', (req, res) => {
  res.render('post', { title: 'post' });
});

router.get('/insert', isLoggedIn, (req, res) => {
  console.log("insert 호출");
  res.render('insert', { title: '글 작성' });
});

router.get('/profileupdate', (req, res) => {
  res.render('profileupdate', { title: '개인정보수정' });
});

router.get('/follow', (req, res) => {
  res.render('follow', { title: '팔로우&팔로잉 한 유저 글 확인' });
});

// router.get('/:id/followPost', async(req, res) => {
//   // select * from posts INNER JOIN follow on posts.UserId = follow.followingId 
//   // where follow.followingId in(select followingId from follow where followerId = 'test1');
//   console.log(db.sequelize.models.Follow);
//   // console.log(followPosts);

//   res.render('main', {
//     title: 'prj-name',
//   //  posts: followPosts,
//   });
// });

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include:[
        {
          model: User,
          attributes: ['id', 'nick'],
        },
    ],
      order: [['createdAt', 'DESC']],
    });
    // posts = await posts.getHashtags();
    // const hashtag = await Hashtag.findOne({ where: { title: query} });
    // let posts = [];
    // if (hashtag) {
    //   posts = await hashtag.getPosts({ include: [{ model: User }] });
    // }

    res.render('main', {
      title: 'prj-name',
      posts: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
///:hash
router.get('/hashtag/:hash', async (req, res, next) => {
  const query = req.params.hash;
  console.log("hashtag req:"+query);
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query} });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `Q&A`,
      posts: posts,
    });
  } catch (error) {
    
    console.error(error);
    return next(error);
  }
});

router.get('/search', async (req, res, next) => {
  const item = req.query.item;
  try {
    const posts = await Post.findAll({ 
      where: {
        post_title: {
          [Op.like] :"%"+item+"%"
        }
      },
      order: [['createdAt', 'DESC']],
    });

    return res.render('main', {
      title: `Q&A`,
      posts: posts,
    });
  } catch (error) {
    
    console.error(error);
    return next(error);
  }
});

module.exports = router;
