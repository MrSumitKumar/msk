import { useAuth } from '../AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
