require('dotenv').config();
const axios = require('axios');
const { queryDb } = require('../repository/queryDatabase');

const tmdbToken = process.env.TMDB_ACCESS_TOKEN;

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

exports.leaveGroupById = async (groupId, userId) => {
    try {
        const sql = `DELETE FROM "User_has_Group" WHERE group_group_id = $1 AND user_user_id = $2`;
        const result = await queryDb(sql, [groupId, userId]);
        if (result.rowCount === 0) {
            throw new Error('User not found in the group');
        }
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
// Fetch messages for a specific group

exports.getMessagesByGroupId = async (groupId) => {
    const sql = `
        SELECT 
            m.group_id, 
            m.sender_id, 
            m.message, 
            m.timestamp, 
            m.message_id,
            u.username AS sender_name,
            COALESCE(SUM(mv.votes), 0) AS total_votes
        FROM messages m
        JOIN "User" u ON m.sender_id = u.user_id
        LEFT JOIN messagevotes mv ON m.group_id = mv.group_id AND m.message_id = mv.message_id
        WHERE m.group_id = $1
        GROUP BY m.group_id, m.sender_id, m.message, m.timestamp, m.message_id, u.username
        ORDER BY m.timestamp ASC;
    `;
    const result = await queryDb(sql, [groupId]);
    return result.rows;
};

exports.addMessage = async (groupId, senderId, message) => {

    const sql = `
        INSERT INTO messages (group_id, sender_id, message, timestamp,type) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'message') 
        RETURNING *, 
                  (SELECT u.username FROM "User" u WHERE u.user_id = $2) AS sender_name`;

    const result = await queryDb(sql, [groupId, senderId, message]);
    return result.rows[0];
};


exports.updateMessageVote = async (groupId, messageId, userId, vote) => {
    // Fetch the current vote for the message by the voter
    const fetchSql = `
        SELECT votes
        FROM messagevotes
        WHERE group_id = $1 AND message_id = $2 AND user_id = $3;
    `;
    const fetchResult = await queryDb(fetchSql, [groupId, messageId, userId]);
    const currentVote = fetchResult.rows[0]?.votes || 0;

    const newVote = currentVote === vote ? 0 : vote; // Toggle vote

    // Update or insert the vote in the messagevotes table
    const upsertSql = `
        INSERT INTO messagevotes (group_id, message_id, user_id, timestamp, votes)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
        ON CONFLICT (group_id, message_id, user_id)
        DO UPDATE SET votes = $4, timestamp = CURRENT_TIMESTAMP
        RETURNING *;
    `;
    const upsertResult = await queryDb(upsertSql, [groupId, messageId, userId, newVote]);

    // Query to get the total votes
    const totalVotesSql = `
        SELECT SUM(votes) AS total_votes
        FROM messagevotes
        WHERE group_id = $1 AND message_id = $2;
    `;
    const totalVotesResult = await queryDb(totalVotesSql, [groupId, messageId]);

    return {
        updatedVote: upsertResult.rows[0],
        totalVotes: totalVotesResult.rows[0].total_votes
    };
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
            ug.group_requests AS status,
            CASE 
                WHEN g.owners_id = u.user_id THEN true 
                ELSE false 
            END AS is_owner
        FROM 
            "User" u
        INNER JOIN 
            "User_has_Group" ug 
        ON 
            u.user_id = ug.user_user_id
        INNER JOIN
            "Group" g
        ON
            g.group_id = ug.group_group_id
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
exports.addMovieSuggestions = async (groupId, senderId, movieId, movieTitle) => {
    // Fetch movie details from TMDB API
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
    const tmdbResponse = await axios.get(tmdbUrl, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbToken}`,
        },
    });

    const posterPath = tmdbResponse.data.poster_path;

    const sql = `
        INSERT INTO messages (group_id, sender_id, message, timestamp, type, poster_path, movie_id)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'movie', $4, $5)
        RETURNING *,
                  (SELECT u.username FROM "User" u WHERE u.user_id = $2) AS sender_name;
    `;
    const result = await queryDb(sql, [groupId, senderId, movieTitle,posterPath, movieId ]);
    return result.rows[0];
};
exports.getMovieMessagesByGroupId = async (groupId) => {
    const sql = `
        SELECT 
            m.group_id, 
            m.sender_id, 
            m.message, 
            m.timestamp, 
            m.message_id,
            m.poster_path,
            m.type,
            u.username AS sender_name,
            COALESCE(SUM(mv.votes), 0) AS total_votes
        FROM messages m
        JOIN "User" u ON m.sender_id = u.user_id
        LEFT JOIN messagevotes mv ON m.group_id = mv.group_id AND m.message_id = mv.message_id
        WHERE m.group_id = $1 AND m.type = 'movie'
        GROUP BY m.group_id, m.sender_id, m.message, m.timestamp, m.message_id, u.username, m.poster_path, m.type
        ORDER BY m.timestamp ASC;
    `;
    const result = await queryDb(sql, [groupId]);
    return result.rows;
};




