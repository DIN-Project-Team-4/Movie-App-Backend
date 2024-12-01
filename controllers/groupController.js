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
    const groupId = req.params.groupId; // Get the group ID from the request parameters

    try {
        const members = await groupModel.getMembersByGroupId(groupId);
        if (members.length === 0) {
            return res.status(404).json({ message: 'No members found for this group' });
        }
        return res.status(200).json(members); // Return the members list
    } catch (error) {
        console.error('Error fetching group members:', error);
        return res.status(500).json({ error: 'Failed to fetch group members' });
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