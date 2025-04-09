import React, { useEffect } from "react";
import { fetchUsers, deleteUser } from "../../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";

interface UserTableProps {
  canDelete: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ canDelete }) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId: string) => {
    if (canDelete) dispatch(deleteUser(userId));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button>Edit</button>
                {canDelete && (
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
