// controllers/groupController.js
const groupModel = require('../models/groupModel');

// Controller to create a new group
exports.createGroup = async (req, res) => {
    const { name, ownerId,group_description } = req.body;

    // Validate input
    if (!name || !ownerId) {
        return res.status(400).json({ error: "Group name and owner ID are required." });
    }

    try {
        // Check if the owner exists
        const owner = await groupModel.findUserById(ownerId);
        if (!owner) {
        return res.status(400).json({ error: `User with id ${ownerId} does not exist.` });
        }

        // Check if a group with the same name already exists
        const existingGroup = await groupModel.findGroupByName(name);
        if (existingGroup) {
            return res.status(400).json({ error: "Group name already exists." });
        }

        // Create the group
        const newGroup = await groupModel.createGroup(name, ownerId, group_description);


        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// New function to get all groups
exports.getAllGroups = async (req, res) => {
    try {
      // Call the model function to get all groups
      const groups = await groupModel.getAllGroups();
  
      // Return the groups in the response
      return res.status(200).json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      return res.status(500).json({ error: 'Failed to fetch groups' });
    }
  };

// Controller to fetch all groups a user has joined
exports.getGroupsByUser = async (req, res) => {
    const { userId } = req.params; // Extracting userId from route params
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' }); // Validation for userId
    }
  
    try {
      const groups = await groupModel.getUserGroups(userId); // Fetch groups using the model
      if (groups.length === 0) {
        return res.status(404).json({ message: 'No groups found for this user' });
      }
      return res.status(200).json(groups); // Send groups in response
    } catch (error) {
      console.error('Error fetching user groups:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
  };

// Controller to get members of a group by group ID
exports.getMembersByGroup = async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const members = await groupModel.getMembersByGroupId(groupId);
        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};


// Controller function to handle adding a member to a group
exports.addMember = async (req, res) => {
    const { groupId, userId} = req.params;
    const { membershipId } = req.body;

    try {
        // Check if all required fields are provided
        if (!groupId || !userId || !membershipId) {
            return res.status(400).json({ error: 'groupId, userId, and membershipId are required.' });
        }

        // Call the model function to add a member to the group
        const result = await groupModel.addMember(groupId, userId, membershipId);

        // Send a success response
        res.status(200).json(result);
    } catch (error) {
        // Send an error response in case of any issues
        res.status(500).json({ error: error.message });
    }
};

// Controller function to handle removing a user from a group
exports.removeMember = async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        // Check if all required fields are provided
        if (!groupId || !userId) {
            return res.status(400).json({ error: 'groupId and userId are required.' });
        }

        // Call the model function to remove the user from the group
        const result = await groupModel.removeMember(groupId, userId);

        // Send a success response
        res.status(200).json(result);
    } catch (error) {
        // Send an error response in case of any issues
        res.status(500).json({ error: error.message });
    }
};

// Controller to handle group deletion
exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;  // Extract group ID from URL parameter
  
    try {
      const deletedGroup = await groupModel.deleteGroupById(groupId);  // Call model function to delete the group
      res.status(200).json({ message: 'Group deleted successfully', group: deletedGroup });
    } catch (error) {
      console.error('Error deleting group:', error);
      res.status(500).json({ error: 'Failed to delete group' });
    }
  };

exports.leaveGroup = async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        const result = await groupModel.leaveGroupById(groupId, userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ error: 'Failed to leave group' });
    }
}

exports.getMessagesByGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const messages = await groupModel.getMessagesByGroupId(groupId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


// Controller to add a message to a group
exports.addMessageToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { senderId, message } = req.body;

    if (!senderId || !message) {
        return res.status(400).json({ error: 'Sender ID and message are required.' });
    }

    try {
        const newMessage = await groupModel.addMessage(groupId, senderId, message);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Failed to add message' });
    }
};
exports.updateMessage = async (req, res) => {
    const { groupId, messageId, userId, vote } = req.body;

    if (!groupId || !messageId || !userId || vote === undefined) {
        return res.status(400).json({ error: 'Group ID, Message ID, User ID, and vote are required.' });
    }

    try {
        const updatedMessage = await groupModel.updateMessageVote(groupId, messageId, userId, vote);
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Failed to update message' });
    }
};

exports.applyToJoinGroup = async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        return res.status(400).json({ error: 'Group ID and User ID are required.' });
    }

    try {
        const existingMembership = await groupModel.getMembership(groupId, userId);

        if (existingMembership) {
            return res.status(400).json({ error: 'User is already a member of this group.' });
        }
        
        const existingApplication = await groupModel.getApplication(groupId, userId);

        if (existingApplication) {
            return res.status(400).json({ error: 'Application already exists for this user and group.' });
        }
        const result = await groupModel.applyToGroup(groupId, userId);

        res.status(201).json({ message: 'Application submitted successfully', membership: result });
    } catch (error) {
        console.error('Error applying to join group:', error);
        res.status(500).json({ error: 'Failed to apply to join group.' });
    }
};

exports.rejectMember = async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        // Check if all required fields are provided
        if (!groupId || !userId) {
            return res.status(400).json({ error: 'groupId and userId are required.' });
        }

        // Call the model function to remove the user from the group
        const result = await groupModel.rejectMember(groupId, userId);

        // Send a success response
        res.status(200).json(result);
    } catch (error) {
        // Send an error response in case of any issues
        res.status(500).json({ error: error.message });
    }
};

// Controller to handle fetching all applications for a group
exports.getAllGroupApplications = async (req, res) => {
    const { groupId } = req.params;

    // Validate input
    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }

    try {
        // Fetch all applications for the specified group
        const applications = await groupModel.getAllApplicationsForGroup(groupId);

        if (applications.length === 0) {
            return res.status(404).json({ message: 'No applications found for this group.' });
        }

        res.status(200).json({ applications });
    } catch (error) {
        console.error('Error fetching group applications:', error);
        res.status(500).json({ error: 'Failed to fetch group applications.' });
    }
};


// Approve or reject a membership application
exports.reviewApplication = async (req, res) => {
    const { groupId, userId, status } = req.body;

    if (!groupId || !userId || !status) {
        return res.status(400).json({ error: 'Group ID, User ID, and status are required.' });
    }

    try {
        const result = await groupModel.updateMembershipStatus(groupId, userId, status);

        res.status(200).json({ message: `Application ${status}`, membership: result });
    } catch (error) {
        console.error('Error reviewing application:', error);
        res.status(500).json({ error: 'Failed to review application.' });
    }
};
exports.getGroupsName = async (req, res) => {
    const { groupId } = req.params;

    try {
        const groupName = await groupModel.getGroupName(groupId);
        res.status(200).json(groupName);
    } catch (error) {
        console.error('Error fetching group name:', error);
        res.status(500).json({ error: 'Failed to fetch group name' });
    }
}
 exports.addMovieSuggestions = async (req, res) => {
    const { groupId } = req.params;
    const { senderId, movieId, movieTitle } = req.body;

    if (!senderId || !movieId ) {
        return res.status(400).json({ error: 'Movie ID and User ID are required.' });
    }

    try {
        const result = await groupModel.addMovieSuggestions(groupId, senderId, movieId, movieTitle);
        res.status(201).json({ message: 'Movie suggestion added successfully', suggestion: result });
    } catch (error) {
        console.error('Error adding movie suggestion:', error);
        res.status(500).json({ error: 'Failed to add movie suggestion' });
    }
 }
exports.getMovieMessagesByGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const messages = await groupModel.getMovieMessagesByGroupId(groupId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};



