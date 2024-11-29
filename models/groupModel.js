const { queryDb } = require('../repository/queryDatabase');

// Function to check if a group with the given name already exists
exports.findGroupByName = async (name) => {
    const sql = 'SELECT * FROM "Group" WHERE name = $1';
    const result = await queryDb(sql, [name]);
    return result.rows[0];
};

// Function to check if a user exists by ID
exports.findUserById = async (userId) => {
    const sql = 'SELECT * FROM "User" WHERE user_id = $1';
    const result = await queryDb(sql, [userId]);
    return result.rows[0];
};

// Function to get all groups
exports.getAllGroups = async () => {
    const sql = `
      SELECT * FROM "Group";
    `;
  
    const result = await queryDb(sql);
    return result.rows; // Return an array of all groups
  };

// Fetch all members of a specific group by Group ID
exports.getMembersByGroupId = async (groupId) => {
    const sql = `
        SELECT 
            "User".user_id, 
            "User".username, 
            "User".email
        FROM 
            "User_has_Group" AS ug
        JOIN 
            "User"
        ON 
            ug.user_user_id = "User".user_id
        WHERE 
            ug.group_group_id = $1;

    `;

    try {
        const result = await queryDb(sql, [groupId]);
        return result.rows; // Return the rows containing user details
    } catch (error) {
        throw error;
    }
};

// Function to create a new group
exports.createGroup = async (name, ownerId, group_description) => {
    // Check if the ownerId exists in the "User" table
    const owner = await exports.findUserById(ownerId);
    if (!owner) {
        throw new Error(`User with id ${ownerId} does not exist.`);
    }
    const sql = `INSERT INTO "Group" (name, owners_id, group_description, created_at) 
             VALUES ($1, $2, $3, NOW()) 
             RETURNING *`;
    const result = await queryDb(sql, [name, ownerId, group_description]);
    return result.rows[0];
};


// Model function to add a member to a group
exports.addMember = async (groupId, userId, membershipId) => {
    try {
        // SQL query to insert a new member into the User_has_Group table
        const sql = `INSERT INTO "User_has_Group" (group_group_id, user_user_id, membership_id, joined_at) 
                     VALUES ($1, $2, $3, NOW())`;

        // Execute the query with the provided parameters
        await queryDb(sql, [groupId, userId, membershipId]);

        // Return a success message if the operation was successful
        return { message: 'Member added to group successfully!' };
    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error adding member to group:', error);
        throw new Error('Failed to add member to group.');
    }
};

// Model function to remove a user from a group
exports.removeMember = async (groupId, userId) => {
    try {
        // SQL query to delete a user from the User_has_Group table
        const sql = `DELETE FROM "User_has_Group" WHERE group_group_id = $1 AND user_user_id = $2`;

        // Execute the query with the provided parameters
        const result = await queryDb(sql, [groupId, userId]);

        // If no rows were affected, return an error message
        if (result.rowCount === 0) {
            throw new Error('User not found in the group.');
        }

        // Return a success message if the operation was successful
        return { message: 'User removed from group successfully!' };
    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error removing user from group:', error);
        throw new Error('Failed to remove user from group.');
    }
};

// Function to delete a group from the database by its ID
exports.deleteGroupById = async (groupId) => {
    try {
      const sql = `DELETE FROM "Group" WHERE group_id = $1`;  // SQL query to delete the group
      const result = await queryDb(sql, [groupId]);
  
      if (result.rowCount === 0) {
        throw new Error('Group not found');
      }
      return result.rows[0];  // Return the deleted group info
    } catch (error) {
      throw error;  // Propagate error to be handled by controller
    }
  };