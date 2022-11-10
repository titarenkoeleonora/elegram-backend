const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const auth = require('../middleware/auth');
const friendInvitationControllers = require('../controllers/friendInvitation/friendInvitationControllers')

const postFriendInvitationSchema = Joi.object({
  targetMailAddress: Joi.string().email().required(),
});

const inviteDecisionSchema = Joi.object({
  id: Joi.string().required(),
});

router.post(
  '/invite',
  auth,
  validator.body(postFriendInvitationSchema),
  friendInvitationControllers.controllers.inviteController,
);

router.post(
  '/accept',
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.controllers.acceptController,
);

router.post(
  '/reject',
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.controllers.rejectController,
);

module.exports = router;