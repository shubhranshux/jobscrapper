import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, UserCircle, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/history', icon: History, label: 'Applications' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`hidden lg:flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-surface-200 transition-all duration-300 ease-in-out`}>
      {/* Toggle */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* AI Badge */}
      {!collapsed && (
        <div className="p-4 m-3 mb-4 rounded-xl bg-primary-50 border border-primary-100">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-bold text-primary-700 tracking-wide uppercase">AI Powered</span>
          </div>
          <p className="text-xs font-medium text-surface-500">Smart job matching, skill analysis & career insights</p>
        </div>
      )}
    </aside>
  );
}
