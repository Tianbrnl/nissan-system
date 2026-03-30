import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(UserContext);
    if (loading) return <Loading />;
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}
