import User from "./User.jsx"

function UsersList({ users, loggedInUser }) {
    function getLoggedInUser() {
        return loggedInUser ? loggedInUser : "none"
    }
    return (
        <div className="usersList">
            <hr/>
            <p>Logged in user: {getLoggedInUser()}</p>
            <p>(hint) Current Users: {users.join(', ')}</p>
            <hr/>
        </div>
    )
}

export default UsersList;
