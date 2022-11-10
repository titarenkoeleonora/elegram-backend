const friendsUpdates = require('../../socketHandlers/updates/friends');
const FriendInvitation = require("../../models/friendInvitation");

const rejectController = async (request, response) => {
  try {
    const { id } = request.body;

    const { userId } = request.user;

    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    friendsUpdates.updateFriendsPendingInvitations(userId);

    return response.status(200).send('Invitation succesfully rejected.');
  } catch (error) {
    console.log(error);
    return response.status(500).send('Something went wrong!');
  }
};

module.exports = rejectController;