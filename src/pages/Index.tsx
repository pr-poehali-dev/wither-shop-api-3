import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const TG = 'https://t.me/yokioffical';

type Page = 'home' | 'clicker' | 'donates' | 'cases';
type ClickUpgrade = { id: string; name: string; price: number; clickBonus: number; perSecBonus: number; emoji: string; desc: string };
type Privilege = { id: string; name: string; price: number; emoji: string; desc: string };
type Case = { id: string; name: string; price: number; emoji: string; desc: string };
type HistoryItem = { id: number; type: 'donate' | 'case' | 'upgrade'; name: string; price: number; time: string };

const clickUpgrades: ClickUpgrade[] = [
  { id: 'click10', name: 'Усиленный клик', price: 200, clickBonus: 10, perSecBonus: 0, emoji: '👆', desc: '+10 minecoin за каждый клик' },
  { id: 'auto20', name: 'Авто-добыча', price: 1500, clickBonus: 0, perSecBonus: 20, emoji: '⚙️', desc: '+20 minecoin в секунду автоматически' },
];

const privileges: Privilege[] = [
  { id: 'vip', name: 'VIP', price: 500, emoji: '⭐', desc: 'Базовая привилегия' },
  { id: 'destroyer', name: 'Сокрушитель', price: 100, emoji: '⚔️', desc: 'Привилегия Сокрушитель' },
  { id: 'legend', name: 'Legend', price: 12000, emoji: '🛡️', desc: 'Легендарный статус' },
  { id: 'imperator', name: 'Imperator', price: 10000, emoji: '👑', desc: 'Привилегия Imperator' },
  { id: 'wither', name: 'Wither God', price: 50000, emoji: '💀', desc: 'Высший ранг Wither' },
];

const cases: Case[] = [
  { id: 'witherbox', name: 'WitherBox', price: 900, emoji: '💀', desc: 'Редкие предметы Wither' },
  { id: 'netherbox', name: 'NetherBox', price: 100000, emoji: '🔥', desc: 'Адские награды Nether' },
  { id: 'shulkerbox', name: 'ShulkerBox', price: 9807, emoji: '📦', desc: 'Эксклюзив Shulker' },
];

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'ГЛАВНАЯ', icon: 'Home' },
  { id: 'clicker', label: 'КЛИКЕР', icon: 'MousePointerClick' },
  { id: 'donates', label: 'ДОНАТЫ', icon: 'Star' },
  { id: 'cases', label: 'КЕЙСЫ', icon: 'Package' },
];

const fmt = (n: number) => n.toLocaleString('ru-RU');

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [coins, setCoins] = useState(50);
  const [perClick, setPerClick] = useState(1);
  const [perSec, setPerSec] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const popId = useRef(0);

  // Пассивный доход
  useEffect(() => {
    if (perSec === 0) return;
    const t = setInterval(() => setCoins((c) => c + perSec), 1000);
    return () => clearInterval(t);
  }, [perSec]);

  const go = (p: Page) => { setPage(p); window.scrollTo({ top: 0 }); };

  const addHistory = (type: HistoryItem['type'], name: string, price: number) => {
    const time = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    setHistory((h) => [{ id: Date.now(), type, name, price, time }, ...h]);
  };

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCoins((c) => c + perClick);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = popId.current++;
    setPops((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 700);
  };

  const buyClickUpgrade = (u: ClickUpgrade) => {
    if (owned.includes(u.id) || coins < u.price) return;
    setCoins((c) => c - u.price);
    setPerClick((p) => p + u.clickBonus);
    setPerSec((p) => p + u.perSecBonus);
    setOwned((o) => [...o, u.id]);
    addHistory('upgrade', u.name, u.price);
  };

  const purchase = (type: 'donate' | 'case', name: string, price: number) => {
    if (coins < price) return;
    setCoins((c) => c - price);
    addHistory(type, name, price);
    window.open(TG, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => go('home')} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary grid place-items-center text-lg">💀</div>
            <span className="font-display text-xl font-bold tracking-wide">WITHERSHOP</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`px-4 py-2 rounded-lg font-display font-semibold text-sm transition-colors ${
                  page === n.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-primary/15 px-3 py-1.5 rounded-full font-semibold text-sm">
              🪙 {fmt(coins)}
            </div>
            <button
              onClick={() => setProfileOpen(true)}
              className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/70 grid place-items-center transition-colors"
            >
              <Icon name="User" size={18} />
            </button>
          </div>
        </div>
        {/* mobile nav */}
        <div className="md:hidden flex border-t border-border">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`flex-1 py-2 text-xs font-display font-semibold transition-colors flex flex-col items-center gap-0.5 ${
                page === n.id ? 'text-primary border-t-2 border-primary -mt-px' : 'text-muted-foreground'
              }`}
            >
              <Icon name={n.icon} size={16} />
              {n.label}
            </button>
          ))}
        </div>
      </header>

      {/* PAGE: HOME */}
      {page === 'home' && (
        <main className="flex-1">
          <section className="minecoin-grid border-b border-border">
            <div className="container py-24 md:py-36 text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/15 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                api withertime.gaming.free
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-5">
                ДОБЫВАЙ <span className="text-primary">MINECOIN</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                Кликай, прокачивай кликер и открывай легендарные кейсы. Вся валюта майнкоин — у тебя в руках.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => go('clicker')} size="lg" className="font-display font-bold tracking-wide">
                  <Icon name="MousePointerClick" size={18} className="mr-2" /> НАЧАТЬ КЛИКАТЬ
                </Button>
                <Button onClick={() => go('donates')} variant="outline" size="lg" className="font-display font-bold tracking-wide">
                  DONATE
                </Button>
              </div>
            </div>
          </section>

          <section className="container py-16">
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: 'MousePointerClick', title: 'Кликер', desc: 'Добывай minecoin кликами и прокачивай силу', page: 'clicker' as Page },
                { icon: 'Star', title: 'Донаты', desc: 'Привилегии: VIP, Сокрушитель, Imperator и другие', page: 'donates' as Page },
                { icon: 'Package', title: 'Кейсы', desc: 'WitherBox, NetherBox, ShulkerBox', page: 'cases' as Page },
              ].map((c) => (
                <button
                  key={c.page}
                  onClick={() => go(c.page)}
                  className="p-6 rounded-2xl border-2 border-border bg-card text-left hover:border-primary hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 grid place-items-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <Icon name={c.icon} size={24} />
                  </div>
                  <div className="font-display text-lg font-bold mb-1">{c.title}</div>
                  <div className="text-sm text-muted-foreground">{c.desc}</div>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* PAGE: CLICKER */}
      {page === 'clicker' && (
        <main className="flex-1 container py-16 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-2">КЛИКЕР</h2>
            <p className="text-muted-foreground">Кликай по монете и копи minecoin</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-14 items-center max-w-4xl mx-auto">
            {/* Coin */}
            <div className="text-center">
              <div className="relative inline-block">
                <button
                  onClick={click}
                  className="relative w-56 h-56 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border-8 border-yellow-600 shadow-2xl text-8xl grid place-items-center active:scale-95 transition-transform select-none hover:scale-105"
                >
                  🪙
                  {pops.map((p) => (
                    <span
                      key={p.id}
                      className="absolute pointer-events-none font-display font-bold text-2xl text-yellow-700 animate-float-up"
                      style={{ left: p.x, top: p.y }}
                    >
                      +{perClick}
                    </span>
                  ))}
                </button>
              </div>
              <div className="mt-8 font-display text-4xl font-bold">{fmt(coins)} 🪙</div>
              <div className="flex items-center justify-center gap-4 mt-2 text-muted-foreground text-sm">
                <span>+{perClick} за клик</span>
                {perSec > 0 && <span className="text-green-600 font-semibold">+{perSec}/сек ⚙️</span>}
              </div>
            </div>

            {/* Upgrades */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">Улучшения клика</h3>
              {clickUpgrades.map((u) => {
                const bought = owned.includes(u.id);
                const canAfford = coins >= u.price;
                return (
                  <div key={u.id} className={`p-5 rounded-2xl border-2 transition-all ${bought ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{u.emoji}</span>
                        <div>
                          <div className="font-display font-bold">{u.name}</div>
                          <div className="text-sm text-muted-foreground">{u.desc}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => buyClickUpgrade(u)}
                        disabled={bought || !canAfford}
                        className="font-display font-bold tracking-wide shrink-0"
                      >
                        {bought ? '✅' : `${fmt(u.price)} 🪙`}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* PAGE: DONATES */}
      {page === 'donates' && (
        <main className="flex-1 container py-16 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-2">ДОНАТЫ</h2>
            <p className="text-muted-foreground">Выбери раздел доната</p>
          </div>
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => go('privileges')}
              className="p-8 rounded-2xl border-2 border-border bg-card text-center hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="text-6xl mb-4">👑</div>
              <div className="font-display text-2xl font-bold mb-2">Привилегии</div>
              <div className="text-muted-foreground text-sm">VIP, Сокрушитель, Imperator и другие ранги</div>
            </button>
            <button
              onClick={() => go('cases')}
              className="p-8 rounded-2xl border-2 border-border bg-card text-center hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="text-6xl mb-4">📦</div>
              <div className="font-display text-2xl font-bold mb-2">Кейсы</div>
              <div className="text-muted-foreground text-sm">WitherBox, NetherBox, ShulkerBox</div>
            </button>
          </div>
        </main>
      )}

      {/* PAGE: PRIVILEGES */}
      {page === 'privileges' && (
        <main className="flex-1 container py-16 animate-fade-in">
          <div className="flex items-center gap-3 mb-10 max-w-4xl mx-auto">
            <button onClick={() => go('donates')} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div>
              <h2 className="font-display text-3xl font-bold">Привилегии</h2>
              <p className="text-muted-foreground text-sm">После покупки — напиши в Telegram @yokioffical</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {privileges.map((d) => {
              const canAfford = coins >= d.price;
              return (
                <div key={d.id} className="p-6 rounded-2xl border border-border bg-card text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="text-5xl mb-3">{d.emoji}</div>
                  <div className="font-display text-xl font-bold mb-1">{d.name}</div>
                  <div className="text-muted-foreground text-sm mb-1">{d.desc}</div>
                  <div className="font-semibold text-sm mb-4">{fmt(d.price)} minecoin</div>
                  <Button
                    onClick={() => purchase('donate', d.name, d.price)}
                    disabled={!canAfford}
                    className="w-full font-display font-bold tracking-wide"
                  >
                    {canAfford ? 'КУПИТЬ' : 'НЕ ХВАТАЕТ'}
                  </Button>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* PAGE: CASES */}
      {page === 'cases' && (
        <main className="flex-1 container py-16 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-2">КЕЙСЫ</h2>
            <p className="text-muted-foreground">Открой кейс и забери награду</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {cases.map((c) => {
              const canAfford = coins >= c.price;
              return (
                <div key={c.id} className="p-8 rounded-2xl border-2 border-border bg-card text-center hover:border-primary hover:shadow-xl transition-all">
                  <div className="text-6xl mb-4">{c.emoji}</div>
                  <div className="font-display text-2xl font-bold mb-1">{c.name}</div>
                  <div className="text-muted-foreground text-sm mb-1">{c.desc}</div>
                  <div className="font-semibold mb-6">{fmt(c.price)} 🪙</div>
                  <Button
                    onClick={() => purchase('case', c.name, c.price)}
                    disabled={!canAfford}
                    className="w-full font-display font-bold tracking-wide"
                  >
                    {canAfford ? 'ОТКРЫТЬ КЕЙС' : 'НЕ ХВАТАЕТ'}
                  </Button>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <button onClick={() => go('home')} className="flex items-center gap-2 font-display font-bold text-foreground">
            💀 WITHERSHOP
          </button>
          <div>api withertime.gaming.free</div>
          <a href={TG} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Icon name="Send" size={16} /> @yokioffical
          </a>
        </div>
      </footer>

      {/* PROFILE DRAWER */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setProfileOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-bold">ПРОФИЛЬ</h3>
              <button onClick={() => setProfileOpen(false)} className="p-2 hover:bg-secondary rounded-lg">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-5 rounded-2xl bg-primary/15 mb-6 space-y-1">
              <div className="text-sm text-muted-foreground">Баланс</div>
              <div className="font-display text-3xl font-bold">{fmt(coins)} 🪙</div>
              <div className="text-sm text-muted-foreground">За клик: +{perClick}</div>
              {perSec > 0 && <div className="text-sm text-green-600 font-semibold">Авто: +{perSec}/сек</div>}
            </div>
            <h4 className="font-display font-bold mb-3">История покупок</h4>
            {history.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <Icon name="ScrollText" size={32} className="mx-auto mb-2 opacity-50" />
                Пока нет покупок
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary grid place-items-center text-lg">
                        {h.type === 'case' ? '📦' : h.type === 'upgrade' ? '⚡' : '⭐'}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{h.name}</div>
                        <div className="text-xs text-muted-foreground">{h.time}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-sm">-{fmt(h.price)} 🪙</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}