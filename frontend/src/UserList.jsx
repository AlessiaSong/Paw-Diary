import React from "react"

const UserList = ({ users, updateUser, updateCallback }) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            // const response = await fetch(`http://18.140.54.37:5000/delete_user/${id}`, options)
            const response = await fetch(`http://127.0.0.1:5000/users/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
        {/* 标题已移至 App.jsx 的欢迎区域 */}
    </div>
}

export default UserList