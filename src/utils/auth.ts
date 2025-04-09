// import jwtDecode from "jwt-decode";
// import { AuthState } from "../redux/slices/authSlice";

// export const isAuthenticated = (): boolean => {
//   const token = localStorage.getItem("token");
//   if (!token) return false;

//   try {
//     const decoded: AuthState = jwtDecode(token);
//     return !!decoded;
//   } catch (error) {
//     return false;
//   }
// };

// export const getRole = (): string => {
//   const token = localStorage.getItem("token");
//   if (!token) return "guest";

//   try {
//     const decoded: AuthState = jwtDecode(token);
//     return decoded.role || "guest";
//   } catch (error) {
//     return "guest";
//   }
// };

export const Auth = (): any => {};
