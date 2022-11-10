const friendsUpdates = require('../../socketHandlers/updates/friends');
const FriendInvitation = require("../../models/friendInvitation");
const User = require('../../models/user');

const acceptController = async (request, response) => {
  try {
    const { id } = request.body;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return response.status(401).send('Error occured. Please try again.');
    }

    const { senderId, receiverId } = invitation;

    const sender = await User.findById(senderId);
    sender.friends = [...sender.friends, receiverId];

    const receiver = await User.findById(receiverId);
    receiver.friends = [...receiver.friends, senderId];

    await sender.save();
    await receiver.save();

    await FriendInvitation.findByIdAndDelete(id);
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());

    return response.status(200).send('Friend successfuly added.');
  } catch (error) {
    console.log(error);
    return response.status(500).send('Something went wrong!');
  }
};

module.exports = acceptController;