const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdates = require('../../socketHandlers/updates/friends')

const inviteController = async (request, response) => {
  const { targetMailAddress } = request.body;

  const { userId, mail } = request.user;

  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return response
      .status(409)
      .send('Sorry. You cannot be friend with yourself.');
  }

  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });

  if (!targetUser) {
    return response
      .status(404)
      .send(`We cannot find user with ${targetMailAddress} e-mail.`);
  }

  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceived) {
    return response
      .status(409)
      .send(`Invitation has been already send.`);
  }

  const usersAlreadyFriends = targetUser.friends
    .find(friendId => friendId.toString() === userId.toLowerCase());

  if (usersAlreadyFriends) {
    return response
      .status(409)
      .send(`Freind already added.`);
  }

  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  })

  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  return response.status(201).send('Invitation has been sent');
};

module.exports = inviteController;