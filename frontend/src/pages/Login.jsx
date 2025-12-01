export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter password"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
