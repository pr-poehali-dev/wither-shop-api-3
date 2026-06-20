import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const TG = 'https://t.me/yokioffical';

type Upgrade = { id: string; name: string; price: number; power: number; desc: string };
type Case = { id: string; name: string; price: number; emoji: string; desc: string };
type Donate = { id: string; name: string; price: number; emoji: string };

const upgrades: Upgrade[] = [
  { id: 'destroyer', name: 'Сокрушитель', price: 100, power: 5, desc: '+5 minecoin за клик' },
  { id: 'imperator', name: 'Imperator', price: 10000, power: 250, desc: '+250 minecoin за клик' },
];

const cases: Case[] = [
  { id: 'witherbox', name: 'WitherBox', price: 900, emoji: '💀', desc: 'Редкие предметы Wither' },
  { id: 'netherbox', name: 'NetherBox', price: 100000, emoji: '🔥', desc: 'Адские награды Nether' },
  { id: 'shulkerbox', name: 'ShulkerBox', price: 9807, emoji: '📦', desc: 'Эксклюзив Shulker' },
];

const donates: Donate[] = [
  { id: 'vip', name: 'VIP', price: 500, emoji: '⭐' },
  { id: 'premium', name: 'Premium', price: 2500, emoji: '👑' },
  { id: 'legend', name: 'Legend', price: 12000, emoji: '🛡️' },
  { id: 'wither', name: 'Wither God', price: 50000, emoji: '💀' },
];

type HistoryItem = { id: number; type: 'donate' | 'case'; name: string; price: number; time: string };

const fmt = (n: number) => n.toLocaleString('ru-RU');

const Index = () => {
  const [coins, setCoins] = useState(50);
  const [perClick, setPerClick] = useState(1);
  const [owned, setOwned] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const popId = useRef(0);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCoins((c) => c + perClick);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = popId.current++;
    setPops((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 700);
  };

  const buyUpgrade = (u: Upgrade) => {
    if (owned.includes(u.id) || coins < u.price) return;
    setCoins((c) => c - u.price);
    setPerClick((p) => p + u.power);
    setOwned((o) => [...o, u.id]);
  };

  const purchase = (type: 'donate' | 'case', name: string, price: number) => {
    if (coins < price) return;
    setCoins((c) => c - price);
    const time = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    setHistory((h) => [{ id: Date.now(), type, name, price, time }, ...h]);
    window.open(TG, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary grid place-items-center text-lg">💀</div>
            <span className="font-display text-xl font-bold tracking-wide">WITHERSHOP</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 font-display font-medium text-sm">
            <button onClick={() => scrollTo('home')} className="hover:text-primary transition-colors">ГЛАВНАЯ</button>
            <button onClick={() => scrollTo('clicker')} className="hover:text-primary transition-colors">КЛИКЕР</button>
            <button onClick={() => scrollTo('donates')} className="hover:text-primary transition-colors">ДОНАТЫ</button>
            <button onClick={() => scrollTo('cases')} className="hover:text-primary transition-colors">КЕЙСЫ</button>
            <button onClick={() => setProfileOpen(true)} className="hover:text-primary transition-colors">ПРОФИЛЬ</button>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-primary/15 px-3 py-1.5 rounded-full font-semibold text-sm">
              <span>🪙</span>{fmt(coins)}
            </div>
            <Button onClick={() => scrollTo('donates')} className="font-display font-bold tracking-wide hidden sm:flex">
              DONATE
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="minecoin-grid border-b border-border">
        <div className="container py-20 md:py-28 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/15 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            api withertime.gaming.free
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-5">
            ДОБЫВАЙ <span className="text-primary">MINECOIN</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Кликай, прокачивай кликер и открывай легендарные кейсы. Вся валюта майнкоин — у тебя в руках.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => scrollTo('clicker')} size="lg" className="font-display font-bold tracking-wide">
              <Icon name="MousePointerClick" size={18} className="mr-2" /> НАЧАТЬ КЛИКАТЬ
            </Button>
            <Button onClick={() => scrollTo('donates')} variant="outline" size="lg" className="font-display font-bold tracking-wide">
              DONATE
            </Button>
          </div>
        </div>
      </section>

      {/* CLICKER */}
      <section id="clicker" className="container py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold mb-2">КЛИКЕР</h2>
          <p className="text-muted-foreground">Добывай минткоин и прокачивай силу клика</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
          <div className="text-center">
            <div className="relative inline-block">
              <button
                onClick={click}
                className="relative w-52 h-52 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border-8 border-yellow-600 shadow-xl text-7xl grid place-items-center active:animate-coin-pop select-none hover:scale-105 transition-transform"
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
            <div className="mt-6 font-display text-3xl font-bold">{fmt(coins)} 🪙</div>
            <div className="text-muted-foreground text-sm mt-1">+{perClick} за клик</div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold">Прокачка кликера</h3>
            {upgrades.map((u) => {
              const bought = owned.includes(u.id);
              const canAfford = coins >= u.price;
              return (
                <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div>
                    <div className="font-display font-bold">{u.name}</div>
                    <div className="text-sm text-muted-foreground">{u.desc}</div>
                  </div>
                  <Button
                    onClick={() => buyUpgrade(u)}
                    disabled={bought || !canAfford}
                    className="font-semibold min-w-28"
                  >
                    {bought ? 'Куплено' : `${fmt(u.price)} 🪙`}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DONATES */}
      <section id="donates" className="bg-secondary/40 border-y border-border py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-2">ДОНАТЫ</h2>
            <p className="text-muted-foreground">Оплата майнкоинами. После покупки — напиши в Telegram</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {donates.map((d) => {
              const canAfford = coins >= d.price;
              return (
                <div key={d.id} className="p-6 rounded-2xl border border-border bg-card text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="text-5xl mb-3">{d.emoji}</div>
                  <div className="font-display text-xl font-bold mb-1">{d.name}</div>
                  <div className="text-muted-foreground text-sm mb-4">{fmt(d.price)} minecoin</div>
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
        </div>
      </section>

      {/* CASES */}
      <section id="cases" className="container py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold mb-2">КЕЙСЫ</h2>
          <p className="text-muted-foreground">Открой кейс и забери награду</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cases.map((c) => {
            const canAfford = coins >= c.price;
            return (
              <div key={c.id} className="p-8 rounded-2xl border-2 border-border bg-card text-center hover:border-primary hover:shadow-xl transition-all">
                <div className="text-6xl mb-4">{c.emoji}</div>
                <div className="font-display text-2xl font-bold mb-1">{c.name}</div>
                <div className="text-muted-foreground text-sm mb-1">{c.desc}</div>
                <div className="font-semibold mb-5">{fmt(c.price)} 🪙</div>
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
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <span>💀</span> WITHERSHOP
          </div>
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
            <div className="p-5 rounded-2xl bg-primary/15 mb-6">
              <div className="text-sm text-muted-foreground">Баланс</div>
              <div className="font-display text-3xl font-bold">{fmt(coins)} 🪙</div>
              <div className="text-sm text-muted-foreground mt-1">Сила клика: +{perClick}</div>
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
                      <div className="w-9 h-9 rounded-lg bg-secondary grid place-items-center">
                        {h.type === 'case' ? '📦' : '⭐'}
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
};

export default Index;
