import { useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'

export default function DashboardPage({ theme, onThemeChange }) {
  const navigate = useNavigate()

  return (
    <div className="dashboard-layout">
      <Sidebar
        brand="Savion"
        defaultActive="dashboard"
        defaultTheme={theme}
        user={{ name: 'Abhay Pratap Singh', email: 'abhay@savion.app' }}
        onNavigate={(key) => {
          if (key === 'dashboard') navigate('/dashboard')
        }}
        onThemeChange={onThemeChange}
        onUserMenu={() => navigate('/auth')}
      />
      <main className="dashboard">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">OVERVIEW</p>
            <h1>Welcome back, Abhay</h1>
            <p className="dashboard__subtitle">Here’s what’s happening with your workspace today.</p>
          </div>
          <button className="dashboard__signout" type="button" onClick={() => navigate('/auth')}>
            Sign out
          </button>
        </header>

        <section className="dashboard__metrics" aria-label="Workspace summary">
          <article className="metric-card">
            <span className="metric-card__label">Active projects</span>
            <strong>12</strong>
            <span className="metric-card__detail">Across your workspace</span>
          </article>
          <article className="metric-card">
            <span className="metric-card__label">Tasks completed</span>
            <strong>84</strong>
            <span className="metric-card__detail">+12 this week</span>
          </article>
          <article className="metric-card">
            <span className="metric-card__label">Team members</span>
            <strong>8</strong>
            <span className="metric-card__detail">2 active today</span>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel__heading">
            <div>
              <p className="dashboard__eyebrow">YOUR WORKSPACE</p>
              <h2>Recent projects</h2>
            </div>
            <button className="dashboard__text-button" type="button">View all</button>
          </div>
          <div className="project-list">
            <article className="project-row">
              <span className="project-row__icon">B</span>
              <div className="project-row__info">
                <strong>Brand refresh</strong>
                <span>Updated 2 hours ago</span>
              </div>
              <span className="project-row__status">In progress</span>
            </article>
            <article className="project-row">
              <span className="project-row__icon project-row__icon--gold">W</span>
              <div className="project-row__info">
                <strong>Website launch</strong>
                <span>Updated yesterday</span>
              </div>
              <span className="project-row__status project-row__status--complete">On track</span>
            </article>
            <article className="project-row">
              <span className="project-row__icon project-row__icon--blue">M</span>
              <div className="project-row__info">
                <strong>Marketing plan</strong>
                <span>Updated 3 days ago</span>
              </div>
              <span className="project-row__status">In progress</span>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
