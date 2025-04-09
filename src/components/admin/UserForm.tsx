import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slices/userSlice";

const UserForm: React.FC = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addUser({
        id: Date.now().toString(),
        name,
        email,
        role,
      })
    );
    setName("");
    setEmail("");
    setRole("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="developer">Developer</option>
        <option value="creator">Creator</option>
      </select>
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;
