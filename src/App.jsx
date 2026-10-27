import { useState } from 'react'
import './App.css'

const GAMES = [
  { name: 'Counter-Strike 2', genre: 'Шутер', online: 842, c: ['#f59e0b', '#7c2d12'] },
  { name: 'Dota 2', genre: 'MOBA', online: 530, c: ['#ef4444', '#450a0a'] },
  { name: 'Valorant', genre: 'Шутер', online: 410, c: ['#fb7185', '#4c0519'] },
  { name: 'League of Legends', genre: 'MOBA', online: 380, c: ['#38bdf8', '#082f49'] },
  { name: 'Apex Legends', genre: 'Battle Royale', online: 295, c: ['#f97316', '#431407'] },
  { name: 'Fortnite', genre: 'Battle Royale', online: 240, c: ['#a855f7', '#2e1065'] },
  { name: 'Rust', genre: 'Виживання', online: 188, c: ['#a16207', '#27272a'] },
  { name: 'Minecraft', genre: 'Виживання', online: 260, c: ['#22c55e', '#052e16'] },
]

const PLAYERS = [
  { nick: 'KyivWolf', level: 51, wr: 64, game: 'Dota 2' },
  { nick: 'Shadow', level: 42, wr: 61, game: 'CS2' },
  { nick: 'Viper_UA', level: 37, wr: 57, game: 'Valorant' },
  { nick: 'Nova', level: 29, wr: 53, game: 'Apex' },
  { nick: 'Blaze', level: 33, wr: 55, game: 'Minecraft' },
  { nick: 'Frost', level: 24, wr: 49, game: 'Fortnite' },
]

const LFG = [
  { nick: 'Shadow', game: 'Counter-Strike 2', note: 'Шукаю 2 гравців, Gold Nova+', need: 2 },
  { nick: 'Nova', game: 'Apex Legends', note: 'Потрібен третій у сквад', need: 1 },
  { nick: 'KyivWolf', game: 'Dota 2', note: 'Ранг Ancient, грати ввечері', need: 3 },
  { nick: 'Frost', game: 'Fortnite', note: 'Дуети, без токсиків', need: 1 },
]

const SESSIONS_INIT = [
  { id: 1, game: 'Counter-Strike 2', title: 'Змагальний 5x5', host: 'Shadow', cur: 7, max: 10 },
  { id: 2, game: 'Dota 2', title: 'Вечірня катка', host: 'KyivWolf', cur: 3, max: 10 },
  { id: 3, game: 'Minecraft', title: 'Спільне виживання', host: 'Blaze', cur: 4, max: 8 },
  { id: 4, game: 'Valorant', title: 'Рейтингова гра', host: 'Viper_UA', cur: 5, max: 5 },
]

const TABS = [
  ['games', 'Ігри'],
  ['sessions', 'Сесії'],
  ['team', 'Пошук команди'],
  ['players', 'Гравці'],
  ['rating', 'Рейтинг'],
]

function AuthModal({ initialTab, onClose, onAuth }) {
  const [tab, setTab] = useState(initialTab)
  const [f, setF] = useState({ nick: '', email: '', pass: '', pass2: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const reg = tab === 'register'

  const submit = (e) => {
    e.preventDefault()
    if (!f.email || !f.pass || (reg && !f.nick)) return setErr('Заповніть усі поля')
    if (reg && f.pass !== f.pass2) return setErr('Паролі не співпадають')
    setErr('')
    setBusy(true)
    // заглушка замість запиту до сервера
    setTimeout(() => onAuth({ nick: reg ? f.nick : f.email.split('@')[0] }), 600)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <div className="tabs">
          <button className={!reg ? 'active' : ''} onClick={() => { setTab('login'); setErr('') }}>Вхід</button>
          <button className={reg ? 'active' : ''} onClick={() => { setTab('register'); setErr('') }}>Реєстрація</button>
        </div>
        <form className="form" onSubmit={submit}>
          {reg && <label>Нікнейм<input value={f.nick} onChange={set('nick')} /></label>}
          <label>Email<input type="email" value={f.email} onChange={set('email')} /></label>
          <label>Пароль<input type="password" value={f.pass} onChange={set('pass')} /></label>
          {reg && <label>Повторіть пароль<input type="password" value={f.pass2} onChange={set('pass2')} /></label>}
          {err && <div className="err">{err}</div>}
          <button className="btn primary" disabled={busy}>{busy ? 'Зачекайте...' : reg ? 'Створити акаунт' : 'Увійти'}</button>
        </form>
      </div>
    </div>
  )
}

function SessionModal({ game: g0, onClose, onCreate }) {
  const [game, setGame] = useState(g0 || GAMES[0].name)
  const [title, setTitle] = useState('')
  const [max, setMax] = useState(5)
  const submit = (e) => {
    e.preventDefault()
    if (title.trim()) onCreate({ game, title: title.trim(), max: Number(max) })
  }
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <h3>Нова ігрова сесія</h3>
        <form className="form" onSubmit={submit}>
          <label>Гра
            <select value={game} onChange={(e) => setGame(e.target.value)}>
              {GAMES.map((g) => <option key={g.name}>{g.name}</option>)}
            </select>
          </label>
          <label>Назва<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Вечірня катка" /></label>
          <label>Макс. гравців<input type="number" min="2" max="20" value={max} onChange={(e) => setMax(e.target.value)} /></label>
          <button className="btn primary">Створити</button>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('games')
  const [user, setUser] = useState(null)
  const [modal, setModal] = useState(null) // login | register | {session: gameName}
  const [sessions, setSessions] = useState(SESSIONS_INIT)
  const [joined, setJoined] = useState([])
  const [sent, setSent] = useState([])
  const [genre, setGenre] = useState('Усі')
  const [q, setQ] = useState('')

  const needAuth = (fn) => (user ? fn() : setModal('login'))
  const openSession = (game) => needAuth(() => setModal({ session: game || '' }))

  const join = (id) => needAuth(() => {
    if (joined.includes(id)) return
    setJoined([...joined, id])
    setSessions(sessions.map((s) => (s.id === id && s.cur < s.max ? { ...s, cur: s.cur + 1 } : s)))
  })

  const create = (d) => {
    setSessions([{ id: Date.now(), host: user.nick, cur: 1, ...d }, ...sessions])
    setModal(null)
    setTab('sessions')
  }

  const genres = ['Усі', ...new Set(GAMES.map((g) => g.genre))]
  const shown = GAMES.filter(
    (g) => (genre === 'Усі' || g.genre === genre) && g.name.toLowerCase().includes(q.toLowerCase()),
  )
  const totalOnline = GAMES.reduce((a, g) => a + g.online, 0)
  const rating = [...PLAYERS].sort((a, b) => b.level * b.wr - a.level * a.wr).map((p) => ({ ...p, pts: p.level * p.wr }))

  return (
    <>
      <header className="header">
        <div className="wrap">
          <div className="logo">GAME<span>CLUB</span></div>
          <div className="online-pill"><span className="dot" />{totalOnline.toLocaleString('uk-UA')}</div>
          <nav className="menu">
            {TABS.map(([k, label]) => (
              <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{label}</button>
            ))}
          </nav>
          <div className="auth">
            {user ? (
              <>
                <div className="me"><div className="ava">{user.nick[0].toUpperCase()}</div>{user.nick}</div>
                <button className="btn sm" onClick={() => setUser(null)}>Вийти</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => setModal('login')}>Увійти</button>
                <button className="btn primary" onClick={() => setModal('register')}>Реєстрація</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="promo">
          <span>🎉 Турнір вихідного дня! Створи сесію, збери команду й потрап у рейтинг.</span>
          <button className="btn primary sm" onClick={() => openSession()}>Створити сесію</button>
        </div>

        {tab === 'games' && (
          <>
            <h1>Бібліотека ігор</h1>
            <div className="toolbar">
              <div className="chips">
                {genres.map((g) => (
                  <button key={g} className={'chip' + (genre === g ? ' active' : '')} onClick={() => setGenre(g)}>
                    <b>{g === 'Усі' ? GAMES.length : GAMES.filter((x) => x.genre === g).length}</b>{g}
                  </button>
                ))}
              </div>
              <input className="search" placeholder="Пошук гри..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="cards">
              {shown.map((g) => (
                <div className="mode" key={g.name} style={{ background: `linear-gradient(135deg, ${g.c[0]}, ${g.c[1]})` }} onClick={() => openSession(g.name)}>
                  <span className="play">СТВОРИТИ СЕСІЮ</span>
                  <span className="letter">{g.name[0]}</span>
                  <h3>{g.name}</h3>
                  <small><span className="dot" />{g.online} у грі · {g.genre}</small>
                </div>
              ))}
            </div>
            {!shown.length && <div className="empty">Нічого не знайдено</div>}
          </>
        )}

        {tab === 'sessions' && (
          <>
            <div className="head-row"><h1>Ігрові сесії</h1><button className="btn primary" onClick={() => openSession()}>+ Створити</button></div>
            <div className="list">
              {sessions.map((s) => (
                <div className="row" key={s.id}>
                  <span className="badge">{s.game}</span>
                  <div className="grow"><b>{s.title}</b><br /><small>Хост: {s.host}</small></div>
                  <div className="bar"><i style={{ width: `${(s.cur / s.max) * 100}%` }} /></div>
                  <b>{s.cur}/{s.max}</b>
                  <button className="btn sm" disabled={joined.includes(s.id) || s.cur >= s.max} onClick={() => join(s.id)}>
                    {joined.includes(s.id) ? 'Ви в сесії' : s.cur >= s.max ? 'Повна' : 'Приєднатись'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'team' && (
          <>
            <h1>Пошук команди</h1>
            <div className="list">
              {LFG.map((t) => (
                <div className="row" key={t.nick}>
                  <div className="ava">{t.nick[0]}</div>
                  <div className="grow"><b>{t.nick}</b> <span className="badge">{t.game}</span><br /><small>{t.note}</small></div>
                  <small>Потрібно: {t.need}</small>
                  <button className="btn sm" disabled={sent.includes(t.nick)} onClick={() => needAuth(() => setSent([...sent, t.nick]))}>
                    {sent.includes(t.nick) ? 'Запит надіслано' : 'Приєднатись'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'players' && (
          <>
            <h1>Гравці</h1>
            <div className="players">
              {PLAYERS.map((p) => (
                <div className="pcard" key={p.nick}>
                  <div className="ava">{p.nick[0]}</div>
                  <b>{p.nick}</b>
                  <small>Рівень {p.level} · Winrate {p.wr}%</small>
                  <span className="badge">{p.game}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'rating' && (
          <>
            <h1>Рейтинг</h1>
            <div className="podium">
              {rating.slice(0, 3).map((p, i) => (
                <div className={'pod' + (i === 0 ? ' first' : '')} key={p.nick}>
                  <div className="medal">{['🥇', '🥈', '🥉'][i]}</div>
                  <b>{p.nick}</b><span>{p.pts} очок</span>
                </div>
              ))}
            </div>
            <table>
              <thead><tr><th>#</th><th>Гравець</th><th>Гра</th><th>Winrate</th><th>Очки</th></tr></thead>
              <tbody>
                {rating.map((p, i) => (
                  <tr key={p.nick}><td>{i + 1}</td><td>{p.nick}</td><td>{p.game}</td><td>{p.wr}%</td><td className="pts">{p.pts}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="wrap">
          <div><div className="logo">GAME<span>CLUB</span></div><div>© 2026 · навчальний проєкт</div></div>
          <div><h4>Клуб</h4>{TABS.slice(0, 3).map(([k, l]) => <div key={k}>{l}</div>)}</div>
          <div><h4>Спільнота</h4><div>Гравці</div><div>Рейтинг</div></div>
        </div>
      </footer>

      {(modal === 'login' || modal === 'register') && (
        <AuthModal initialTab={modal} onClose={() => setModal(null)} onAuth={(u) => { setUser(u); setModal(null) }} />
      )}
      {modal && modal.session !== undefined && (
        <SessionModal game={modal.session} onClose={() => setModal(null)} onCreate={create} />
      )}
    </>
  )
}
