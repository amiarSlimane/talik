const express = require('express');
const AppError = require('../../utils/appError');
const router = express.Router();

module.exports = (param) => {
  const { users } = param;




  router.post('/signup', async (req, res , next) => {
    console.log('/signup .');
    try {
      let result = await users.signup(req);
      console.log('signup', result )
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  })
  router.post('/login', async (req, res, next) => {

    try {
      let result = await users.login(req);
      console.log('login result ', result);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  })
  router.get('/logout', async (req, res, next) => {

    try {
      let result = await users.logout(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });

  router.post('/forgotPassword', async (req, res, next) => {

    try {
      let result = await users.forgotPassword(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });
  router.patch('/resetPassword/:token', async (req, res, next) => {

    try {
      let result = await users.resetPassword(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });


  router.patch('/updateMyPassword', async (req, res, next) => {

    try {
      let result = await users.updateMyPassword(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });

  router.get('/me', async (req, res , next) => {

    try {
      let result = await users.getMe(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });

  router.patch('/updateMe', async (req, res , next) => {

    try {
      let result = await users.updateMe(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });
  router.delete('/deleteMe', async (req, res , next) => {

    try {
      let result = await users.deleteMe(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });


  router.delete('/:userId', async (req, res , next) => {

    try {
      let result = await users.deleteOneUser(req);
      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });



  router.get('/', async (req, res, next) => {
    console.log('getAllusers....');
    try {
      let result = await users.getAllusers(req);
    console.log('getAllusers.... result ',result);

      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });

  router.get('/:userId', async (req, res , next) => {

    try {
      const userId = req.params.userId;
      let result = await users.getOneUser(req, userId);
      console.log('result', result);

      return res.status(result.statusCode).json(result.data);
    } catch (err) {
      return next(new AppError(err, 400));
    }

  });







  return router;

}