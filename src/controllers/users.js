import {
    getAllUsers
} from '../models/users.js';

async function buildUsersView(req, res, next) {
    try {
        const result = await getAllUsers();

        res.render('users', {
            title: 'Registered Users',
            users: result.rows
        });
    } catch (error) {
        next(error);
    }
}

export {
    buildUsersView
};