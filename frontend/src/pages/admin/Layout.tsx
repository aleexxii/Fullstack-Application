import { Link } from "react-router-dom"

const Layout: React.FC<{children : React.ReactNode}> = ({children}) => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <nav className="w-64 bg-gray-800 text-white flex flex-col p-5">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              to="/dashboard"
              className={`block px-4 py-2 rounded ${
                location.pathname === "/admin"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/user-list"
              className={`block px-4 py-2 rounded ${
                location.pathname === "/admin/users"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              Users
            </Link>
          </li>
          
        </ul>
      </nav>

      
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">{children}</main>
    </div>
  )
}

export default Layout