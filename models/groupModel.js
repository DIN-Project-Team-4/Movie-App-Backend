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

  // Function to get all groups a user has joined
exports.getUserGroups = async (userId) => {
    const sql = `
      SELECT g.group_id, g.name, g.created_at, g.owners_id, g.group_description
      FROM "Group" AS g
      INNER JOIN "User_has_Group" AS ug ON g.group_id = ug.group_group_id
      WHERE ug.user_user_id = $1;
    `;
    const result = await queryDb(sql, [userId]); // Passing userId to the query
    return result.rows;
    };

// Fetch all members of a specific group by Group ID
exports.getMembersByGroupId = async (groupId) => {
    const sql = `
        SELECT u.user_id, u.username, u.email 
        FROM "User" u
        INNER JOIN "User_has_Group" ug ON u.user_id = ug.user_user_id
        WHERE ug.group_group_id = $1`;
    const result = await queryDb(sql, [groupId]);
    return result.rows;
};


// Create a group and add the owner to User_has_Group
exports.createGroup = async (name, ownerId, group_description) => {
  
      // Insert the new group
      const sqlGroup = `
        INSERT INTO "Group" (name, owners_id, group_description, created_at) 
        VALUES ($1, $2, $3, NOW()) 
        RETURNING *`;
      const groupResult = await queryDb(sqlGroup, [name, ownerId, group_description]);
      const newGroup = groupResult.rows[0];
  
      // Add the owner to the "User_has_Group" table
      const sqlUserHasGroup = `
        INSERT INTO "User_has_Group" (group_group_id, user_user_id, membership_id, joined_at) 
        VALUES ($1, $2, $3, NOW())`;
      await queryDb(sqlUserHasGroup, [newGroup.group_id, ownerId, 'owner']);
      return newGroup;
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
// Fetch messages for a specific group

exports.getMessagesByGroupId = async (groupId) => {
    const sql = `
        SELECT 
    m.group_id, 
    m.sender_id, 
    m.message, 
    m.timestamp, 
    u.username AS sender_name
    FROM messages m
    JOIN "User" u ON m.sender_id = u.user_id
    WHERE m.group_id = $1
    ORDER BY m.timestamp ASC;
    `;
    const result = await queryDb(sql, [groupId]);
    return result.rows;
};

exports.addMessage = async (groupId, senderId, message) => {
    // SQL-Abfrage für das Einfügen der Nachricht und gleichzeitiges Abrufen des Nutzernamens
    const sql = `
        INSERT INTO messages (group_id, sender_id, message, timestamp) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
        RETURNING *, 
                  (SELECT username FROM user WHERE user_id = $2) AS sender_name`; // Nutzername aus der Tabelle `users`

    const result = await queryDb(sql, [groupId, senderId, message]);
    return result.rows[0];
};

exports.getMembership = async (groupId, userId) => {
    const sql = `
        SELECT * FROM User_has_Group
        WHERE group_group_id = $1 AND user_user_id = $2;
    `;
    const result = await queryDb(sql, [groupId, userId]);
    return result.rows[0];
};

// Apply to join a group
exports.applyToGroup = async (groupId, userId) => {
    const sql = `
        INSERT INTO User_has_Group (group_group_id, user_user_id, group_requests, joined_at)
        VALUES ($1, $2, 'pending', NOW())
        RETURNING *;
    `;
    const result = await queryDb(sql, [groupId, userId]);
    return result.rows[0];
};
// Update membership status
exports.updateMembershipStatus = async (groupId, userId, status) => {
    const sql = `
        UPDATE User_has_Group
        SET group_requests = $3
        WHERE group_group_id = $1 AND user_user_id = $2
        RETURNING *;
    `;
    const result = await queryDb(sql, [groupId, userId, status]);
    return result.rows[0];
};
// Fetch all members of a specific group by Group ID
exports.getMembersByGroupId = async (groupId) => {
    const sql = `
        SELECT 
            u.user_id, 
            u.username, 
            u.email, 
            ug.group_requests AS status
        FROM 
            "User" u
        INNER JOIN 
            "User_has_Group" ug 
        ON 
            u.user_id = ug.user_user_id
        WHERE 
            ug.group_group_id = $1;
    `;
    const result = await queryDb(sql, [groupId]);
    return result.rows;
};
exports.getGroupName = async (groupId) => {
    const sql = `
        SELECT name FROM "Group" WHERE group_id = $1;
    `;
    const result = await queryDb(sql, [groupId]);
    return result.rows[0];
}



