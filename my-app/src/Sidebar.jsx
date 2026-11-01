import { useEffect, useMemo, useState } from "react";
import "./Sidebar.css";

/* ---------- default menu (replace with your own via the `sections` prop) ---------- */
const DEFAULT_SECTIONS = [
  {
    title: "Menu",
    items: [
      { key: "dashboard", label: "Dashboard", icon: "home" },
      { key: "calendar", label: "Calendar", icon: "calendar" },
      {
        key: "documents", label: "Documents", icon: "folder",
        children: [
          { key: "inbox", label: "Inbox", icon: "box" },
          { key: "incoming", label: "Incoming", icon: "mail" },
          { key: "export", label: "Export", icon: "export" },
        ],
      },
      {
        key: "statistics", label: "Statistics", icon: "chart",
        children: [
          { key: "overview", label: "Overview", icon: "chart" },
          { key: "reports", label: "Reports", icon: "export" },
        ],
      },
      { key: "chat", label: "Chat", icon: "chat", badge: 5 },
    ],
  },
  {
    title: "Others",
    items: [
      { key: "info", label: "Info", icon: "info" },
      { key: "request", label: "Request", icon: "request" },
    ],
  },
];

/* ---------- icons ---------- */
const P = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />,
  calendar: (<><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>),
  folder: <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />,
  chart: <path d="M3 20h18M6 20v-7h3v7M10.5 20V5h3v15M15 20v-9h3v9" />,
  chat: (<><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M8 9.5h8M8 12.5h5" /></>),
  info: (<><circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" /></>),
  request: (<><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" /></>),
  box: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 8l8 5 8-5" /></>),
  export: <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5" />,
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>),
  sliders: <path d="M4 8h9M17 8h3M4 16h3M11 16h9M15 6v4M9 14v4" />,
  chevL: <path d="M14 6l-6 6 6 6" />,
  chevR: <path d="M10 6l6 6-6 6" />,
  sun: (<><circle cx="12" cy="12" r="3.6" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  dots: (<><circle cx="12" cy="5" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="12" cy="19" r="1.2" /></>),
};

function Icon({ name, size = 20, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name]}
    </svg>
  );
}

function Logo() {
  return (
    <svg className="sb__logo" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="#19b97a" />
      <path d="M8.5 18 13 13.5l4.5 4.5-4.5 4.5z" fill="#fff" />
      <path d="M18.5 18l4.5-4.5 4.5 4.5-4.5 4.5z" fill="#fff" />
    </svg>
  );
}

const cx = (...c) => c.filter(Boolean).join(" ");

/* ---------- component ---------- */
export default function Sidebar({
  sections = DEFAULT_SECTIONS,
  brand = "Doclines",
  user = { name: "Abdullaev Rustam", email: "rustam@gmail.com", avatar: "" },
  defaultActive = "inbox",
  defaultCollapsed = false,
  defaultTheme = "light",
  onNavigate,
  onThemeChange,
  onUserMenu,
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [active, setActive] = useState(defaultActive);
  const [openGroup, setOpenGroup] = useState(() =>
    sections.flatMap((s) => s.items).find((i) => i.children?.some((c) => c.key === defaultActive))?.key ?? null
  );
  const [flyout, setFlyout] = useState(null);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(defaultTheme);

  const q = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      sections
        .map((s) => ({
          ...s,
          items: s.items.filter(
            (i) => !q || i.label.toLowerCase().includes(q) || i.children?.some((c) => c.label.toLowerCase().includes(q))
          ),
        }))
        .filter((s) => s.items.length),
    [sections, q]
  );

  // Close the flyout on outside click or Escape.
  useEffect(() => {
    if (!flyout) return;
    const onDown = (e) => { if (!e.target.closest?.("[data-flyout-root]")) setFlyout(null); };
    const onKey = (e) => { if (e.key === "Escape") setFlyout(null); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [flyout]);

  const select = (key) => {
    setActive(key);
    setFlyout(null);
    onNavigate?.(key);
  };

  const changeTheme = (next) => {
    setTheme(next);
    onThemeChange?.(next);
  };

  const branchActive = (item) => item.children?.some((c) => c.key === active);

  /* ----- expanded rows ----- */
  const renderRow = (item) => {
    if (!item.children) {
      return (
        <li key={item.key}>
          <button
            type="button"
            className={cx("nav__item", active === item.key && "is-active")}
            aria-current={active === item.key ? "page" : undefined}
            onClick={() => select(item.key)}
          >
            <Icon name={item.icon} />
            <span className="nav__label">{item.label}</span>
            {item.badge ? <span className="badge">{item.badge}</span> : null}
          </button>
        </li>
      );
    }

    const open = q ? true : openGroup === item.key;
    return (
      <li key={item.key}>
        <button
          type="button"
          className={cx("nav__item", branchActive(item) && "is-branch", open && "is-open")}
          aria-expanded={open}
          onClick={() => setOpenGroup(open ? null : item.key)}
        >
          <Icon name={item.icon} />
          <span className="nav__label">{item.label}</span>
          <Icon name="chevR" size={18} className="nav__chev" />
        </button>
        <div className="tree-wrap" data-open={open}>
          <ul className="tree">
            {item.children.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  className={cx("nav__item", active === c.key && "is-active")}
                  aria-current={active === c.key ? "page" : undefined}
                  onClick={() => select(c.key)}
                >
                  <Icon name={c.icon} size={18} />
                  <span className="nav__label">{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  };

  /* ----- collapsed rail cells ----- */
  const renderCell = (item) => {
    const hasKids = Boolean(item.children);
    const lit = hasKids ? branchActive(item) : active === item.key;
    const isFlyoutOpen = flyout === item.key;

    return (
      <li key={item.key} className="rail__cell" data-flyout-root={hasKids ? "" : undefined}>
        <button
          type="button"
          className={cx("rail__btn", !hasKids && lit && "is-active", hasKids && lit && "is-branch")}
          aria-label={item.label}
          aria-haspopup={hasKids ? "menu" : undefined}
          aria-expanded={hasKids ? isFlyoutOpen : undefined}
          aria-current={!hasKids && lit ? "page" : undefined}
          onClick={() => (hasKids ? setFlyout(isFlyoutOpen ? null : item.key) : select(item.key))}
        >
          <Icon name={item.icon} />
          {item.badge ? <span className="dot" /> : null}
        </button>

        {!isFlyoutOpen && <span className="tip" role="tooltip">{item.label}</span>}

        {hasKids && isFlyoutOpen && (
          <div className="flyout">
            <ul className="flyout__card" role="menu">
              {item.children.map((c) => (
                <li key={c.key} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className={cx("nav__item", active === c.key && "is-active")}
                    onClick={() => select(c.key)}
                  >
                    <Icon name={c.icon} size={18} />
                    <span className="nav__label">{c.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <aside className={cx("sb", collapsed && "sb--collapsed")} data-theme={theme} aria-label="Main navigation">
      <button
        type="button"
        className="sb__toggle"
        onClick={() => { setCollapsed((c) => !c); setFlyout(null); }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        <Icon name={collapsed ? "chevR" : "chevL"} size={16} />
      </button>

      <header className="sb__brand">
        <Logo />
        {!collapsed && <span className="sb__name">{brand}</span>}
      </header>

      {collapsed ? (
        <button type="button" className="search-icon" aria-label="Search" onClick={() => setCollapsed(false)}>
          <Icon name="search" />
        </button>
      ) : (
        <div className="search">
          <Icon name="search" className="search__icon" />
          <input
            type="search"
            placeholder="Search"
            aria-label="Search menu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="search__filter" aria-label="Filters">
            <Icon name="sliders" size={16} />
          </button>
        </div>
      )}

      <nav className="sb__nav">
        {visible.map((section) => (
          <div key={section.title} className="sb__section">
            <p className="sb__label">{section.title}</p>
            <ul className={collapsed ? "rail" : "nav"}>
              {section.items.map(collapsed ? renderCell : renderRow)}
            </ul>
          </div>
        ))}
        {!visible.length && <p className="sb__empty">No menu items match “{query}”.</p>}
      </nav>

      <div className="sb__footer">
        <div className="theme" role="group" aria-label="Theme">
          <button type="button" className={cx(theme === "light" && "is-on")} aria-pressed={theme === "light"}
            onClick={() => changeTheme("light")} aria-label="Light theme">
            <Icon name="sun" size={18} />
            {!collapsed && <span>Light</span>}
          </button>
          <button type="button" className={cx(theme === "dark" && "is-on")} aria-pressed={theme === "dark"}
            onClick={() => changeTheme("dark")} aria-label="Dark theme">
            <Icon name="moon" size={18} />
            {!collapsed && <span>Dark</span>}
          </button>
        </div>

        <div className="user">
          {user.avatar ? (
            <img className="user__avatar" src={user.avatar} alt="" />
          ) : (
            <span className="user__avatar user__avatar--initials" aria-hidden="true">{initials}</span>
          )}
          {!collapsed && (
            <>
              <div className="user__meta">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <button type="button" className="user__menu" aria-label="Account menu" onClick={onUserMenu}>
                <Icon name="dots" size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
