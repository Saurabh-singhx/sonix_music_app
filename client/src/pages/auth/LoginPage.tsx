import { useState } from "react"
import { useAuthStore } from "../../store/auth/auth.store";


const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginData);
  };

  if (isLoggingIn) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Logging in...
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-5"
      >
        <h2 className="text-xl font-semibold text-center">Login</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginData}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginData}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage