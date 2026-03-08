const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const BASE_JUMP_FORCE = -8;
const MAX_JUMP_FORCE = -14;
const SPEED = 4;
const GROUND_HEIGHT = 40;

const LEVELS = [
  {
    name: '平原试炼',
    startX: 50,
    flagX: 1700,
    wind: { strength: 0 },
    platforms: [
      { x: 0, y: 0, width: 2200, height: GROUND_HEIGHT },
      { x: 200, y: 120, width: 100, height: 20 },
      { x: 420, y: 180, width: 100, height: 20 },
      { x: 650, y: 120, width: 100, height: 20 },
      { x: 900, y: 180, width: 100, height: 20 },
      { x: 1150, y: 120, width: 120, height: 20 },
      { x: 1420, y: 180, width: 120, height: 20 }
    ],
    coins: [
      { x: 230, y: 90 },
      { x: 450, y: 150 },
      { x: 680, y: 90 },
      { x: 930, y: 150 },
      { x: 1180, y: 90 },
      { x: 1450, y: 150 }
    ]
  },
  {
    name: '云端跳跃',
    startX: 50,
    flagX: 2450,
    wind: { strength: 0 },
    platforms: [
      { x: 0, y: 0, width: 3200, height: GROUND_HEIGHT },
      { x: 360, y: 130, width: 110, height: 20, moving: true, moveRange: 120, moveSpeed: 0.011 },
      { x: 680, y: 220, width: 110, height: 20 },
      { x: 1030, y: 150, width: 110, height: 20, moving: true, moveRange: 140, moveSpeed: 0.009 },
      { x: 1420, y: 260, width: 120, height: 20 },
      { x: 1790, y: 180, width: 120, height: 20, moving: true, moveRange: 160, moveSpeed: 0.007 },
      { x: 2200, y: 290, width: 120, height: 20 }
    ],
    coins: [
      { x: 520, y: 120 },
      { x: 620, y: 170 },
      { x: 730, y: 205 },
      { x: 840, y: 220 },
      { x: 950, y: 205 },
      { x: 1060, y: 170 },
      { x: 1160, y: 120 },
      { x: 1930, y: 250 },
      { x: 2260, y: 340 }
    ]
  },
  {
    name: '风暴走廊',
    startX: 50,
    flagX: 2700,
    wind: { strength: 0, pulse: 0.0016, turbulence: true },
    platforms: [
      { x: 0, y: 0, width: 3400, height: GROUND_HEIGHT },
      { x: 380, y: 140, width: 110, height: 20 },
      { x: 760, y: 230, width: 110, height: 20, moving: true, moveRange: 90, moveSpeed: 0.008 },
      { x: 1160, y: 170, width: 110, height: 20 },
      { x: 1540, y: 280, width: 120, height: 20, moving: true, moveRange: 130, moveSpeed: 0.0065 },
      { x: 1980, y: 200, width: 120, height: 20 },
      { x: 2360, y: 310, width: 120, height: 20 }
    ],
    coins: [
      { x: 420, y: 110 },
      { x: 620, y: 160 },
      { x: 820, y: 205 },
      { x: 1030, y: 215 },
      { x: 1240, y: 145 },
      { x: 1460, y: 245 },
      { x: 1700, y: 320 },
      { x: 2080, y: 250 },
      { x: 2460, y: 360 }
    ],
    traps: [
      { type: 'spikes', x: 540, y: 0, width: 120, height: 40 },
      { type: 'spikes', x: 1320, y: 0, width: 140, height: 40 },
      { type: 'spikes', x: 2140, y: 0, width: 130, height: 40 },
      { type: 'saw', x: 950, y: 190, r: 18, amp: 65, speed: 0.0045 },
      { type: 'saw', x: 1840, y: 250, r: 20, amp: 80, speed: 0.0038 }
    ],
    gustZones: [
      { x: 700, width: 240, force: -0.2 },
      { x: 1600, width: 280, force: 0.24 },
      { x: 2280, width: 220, force: -0.26 }
    ]
  },
  {
    name: '怪物工厂',
    startX: 50,
    flagX: 2850,
    wind: { strength: 0 },
    platforms: [
      { x: 0, y: 0, width: 3600, height: GROUND_HEIGHT },
      { x: 500, y: 140, width: 120, height: 20 },
      { x: 880, y: 210, width: 120, height: 20 },
      { x: 1260, y: 150, width: 120, height: 20 },
      { x: 1660, y: 250, width: 120, height: 20 },
      { x: 2080, y: 180, width: 120, height: 20 },
      { x: 2500, y: 280, width: 120, height: 20 }
    ],
    coins: [
      { x: 540, y: 110 }, { x: 920, y: 180 }, { x: 1300, y: 120 },
      { x: 1700, y: 220 }, { x: 2120, y: 150 }, { x: 2540, y: 250 }
    ],
    enemies: [
      { x: 700, y: 0, w: 30, h: 28, hp: 2, patrol: 120, speed: 1.1 },
      { x: 1450, y: 0, w: 30, h: 28, hp: 2, patrol: 140, speed: 1.2 },
      { x: 1900, y: 0, w: 34, h: 30, hp: 3, patrol: 110, speed: 0.9 },
      { x: 2380, y: 0, w: 30, h: 28, hp: 2, patrol: 100, speed: 1.3 },
      { x: 2680, y: 0, w: 52, h: 46, hp: 12, patrol: 160, speed: 0.7, boss: true, shootEvery: 95 }
    ]
  },
  {
    name: '枪火防线',
    startX: 50,
    flagX: 4200,
    wind: { strength: 0 },
    platforms: [
      { x: 0, y: 0, width: 5000, height: GROUND_HEIGHT },
      { x: 480, y: 130, width: 120, height: 20 },
      { x: 920, y: 210, width: 120, height: 20 },
      { x: 1360, y: 150, width: 120, height: 20 },
      { x: 1820, y: 240, width: 120, height: 20 },
      { x: 2280, y: 170, width: 120, height: 20 },
      { x: 2740, y: 260, width: 120, height: 20 },
      { x: 3200, y: 190, width: 120, height: 20 },
      { x: 3560, y: 270, width: 120, height: 20 },
      { x: 3920, y: 210, width: 120, height: 20 }
    ],
    coins: [
      { x: 520, y: 100 }, { x: 960, y: 180 }, { x: 1400, y: 120 },
      { x: 1860, y: 210 }, { x: 2320, y: 140 }, { x: 2780, y: 230 },
      { x: 3240, y: 160 }, { x: 3600, y: 240 }, { x: 3960, y: 180 }
    ],
    shields: [
      { x: 760, y: 0, width: 70, height: 80, hp: 16 },
      { x: 1600, y: 0, width: 70, height: 80, hp: 16 },
      { x: 2480, y: 0, width: 70, height: 80, hp: 16 },
      { x: 3360, y: 0, width: 70, height: 80, hp: 18 }
    ],
    enemies: [
      { x: 620, y: 0, w: 30, h: 28, hp: 2, patrol: 90, speed: 1.0, shooter: true, shootEvery: 100 },
      { x: 1180, y: 0, w: 30, h: 28, hp: 2, patrol: 90, speed: 1.1, shooter: true, shootEvery: 95 },
      { x: 1720, y: 0, w: 30, h: 28, hp: 3, patrol: 110, speed: 1.0, shooter: true, shootEvery: 85 },
      { x: 2240, y: 0, w: 30, h: 28, hp: 3, patrol: 100, speed: 1.2, shooter: true, shootEvery: 80 },
      { x: 2860, y: 0, w: 42, h: 36, hp: 8, patrol: 120, speed: 0.8, shooter: true, shootEvery: 70 },
      { x: 3340, y: 0, w: 30, h: 28, hp: 3, patrol: 100, speed: 1.0, shooter: true, shootEvery: 78 },
      { x: 3800, y: 0, w: 34, h: 30, hp: 4, patrol: 130, speed: 0.9, shooter: true, shootEvery: 72 }
    ],
    repairPacks: [
      { x: 1680, y: 110, used: false, heal: 24 },
      { x: 3440, y: 110, used: false, heal: 28 }
    ]
  }
];

const state = {
  mode: 'play',
  level: 1,
  score: 0,
  playerHp: 100,
  victory: false,
  transitioning: false,
  message: '',
  messageUntil: 0,
  player: { x: 50, y: 0, width: 30, height: 30, vx: 0, vy: 0, grounded: false },
  platforms: [],
  coins: [],
  traps: [],
  gustZones: [],
  shields: [],
  repairPacks: [],
  enemies: [],
  projectiles: [],
  enemyProjectiles: [],
  keys: {},
  cameraX: 0,
  flagX: 1700,
  jumpCharge: 0,
  maxJumpCharge: 22,
  jumpPressedLastFrame: false,
  attackPressedLastFrame: false,
  critPressedLastFrame: false,
  attackCooldown: 0,
  critCooldown: 0,
  facing: 1,
  windNow: 0,
  windLabel: '无风'
};

let audioCtx = null;
function initAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTone(freq, duration, type = 'square') {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}
const sounds = {
  jump: () => playTone(400, 0.1, 'square'),
  coin: () => { playTone(800, 0.1, 'sine'); setTimeout(() => playTone(1200, 0.1, 'sine'), 50); },
  attack: () => playTone(520, 0.06, 'square'),
  crit: () => { playTone(300, 0.08, 'triangle'); setTimeout(() => playTone(620, 0.08, 'triangle'), 50); },
  enemyShot: () => playTone(260, 0.05, 'sawtooth'),
  hit: () => playTone(200, 0.08, 'sawtooth'),
  clear: () => { playTone(700, 0.08, 'square'); setTimeout(() => playTone(900, 0.08, 'square'), 80); setTimeout(() => playTone(1100, 0.15, 'square'), 160); },
  win: () => { playTone(600, 0.1, 'square'); setTimeout(() => playTone(800, 0.1, 'square'), 100); setTimeout(() => playTone(1000, 0.2, 'square'), 200); setTimeout(() => playTone(1200, 0.4, 'square'), 400); }
};

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = Math.min(window.innerHeight, 400);
  if (state.player.y <= 0 || Number.isNaN(state.player.y)) {
    state.player.y = canvas.height - GROUND_HEIGHT - state.player.height;
  }
}
window.addEventListener('resize', resize);
resize();

function loadLevel(levelNo) {
  const def = LEVELS[levelNo - 1];
  state.level = levelNo;
  state.platforms = def.platforms.map((p) => ({ ...p, baseX: p.x, lastX: p.x }));
  state.coins = def.coins.map((c) => ({ ...c, collected: false }));
  state.traps = (def.traps || []).map((t) => ({ ...t }));
  state.gustZones = (def.gustZones || []).map((g) => ({ ...g }));
  state.shields = (def.shields || []).map((s) => ({ ...s, maxHp: s.hp, alive: true }));
  state.repairPacks = (def.repairPacks || []).map((r) => ({ ...r, used: false }));
  state.enemies = (def.enemies || []).map((e) => ({ ...e, maxHp: e.hp, baseX: e.x, dir: -1, alive: true, shootTimer: 0, summonTimer: 0, phase2: false }));
  state.projectiles = [];
  state.enemyProjectiles = [];
  state.flagX = def.flagX;
  state.cameraX = 0;
  state.player.x = def.startX;
  state.player.y = canvas.height - GROUND_HEIGHT - state.player.height;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.grounded = true;
  state.transitioning = false;
  state.jumpCharge = 0;
  state.playerHp = 100;
  state.attackCooldown = 0;
  state.critCooldown = 0;
  state.attackPressedLastFrame = false;
  state.critPressedLastFrame = false;
  state.facing = 1;
  state.windNow = 0;
  state.windLabel = '无风';
}

window.addEventListener('keydown', (e) => { initAudio(); state.keys[e.key] = true; });
window.addEventListener('keyup', (e) => { state.keys[e.key] = false; });

const setupBtn = (id, key) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); initAudio(); state.keys[key] = true; });
  btn.addEventListener('pointerup', (e) => { e.preventDefault(); state.keys[key] = false; });
  btn.addEventListener('pointerleave', (e) => { e.preventDefault(); state.keys[key] = false; });
};
setupBtn('leftBtn', 'ArrowLeft');
setupBtn('rightBtn', 'ArrowRight');
setupBtn('jumpBtn', 'ArrowUp');
setupBtn('attackBtn', 'j');
setupBtn('critBtn', 'c');

function updateMovingPlatforms(nowMs) {
  state.platforms.forEach((plat) => {
    if (!plat.moving) return;
    plat.lastX = plat.x;
    plat.x = plat.baseX + Math.sin(nowMs * plat.moveSpeed) * plat.moveRange;
  });
}

function update() {
  if (state.victory || state.transitioning) return;

  const p = state.player;
  const jumpPressed = !!(state.keys['ArrowUp'] || state.keys.w || state.keys[' ']);

  if (state.keys['ArrowLeft'] || state.keys.a) p.vx = -SPEED;
  else if (state.keys['ArrowRight'] || state.keys.d) p.vx = SPEED;
  else p.vx = 0;
  if (p.vx < 0) state.facing = -1;
  else if (p.vx > 0) state.facing = 1;

  // Charge jump: hold jump while grounded, release to launch
  if (p.grounded && jumpPressed) {
    state.jumpCharge = Math.min(state.maxJumpCharge, state.jumpCharge + 1);
  }
  if (p.grounded && state.jumpPressedLastFrame && !jumpPressed) {
    const t = state.jumpCharge / state.maxJumpCharge;
    p.vy = BASE_JUMP_FORCE + (MAX_JUMP_FORCE - BASE_JUMP_FORCE) * t;
    p.grounded = false;
    state.jumpCharge = 0;
    sounds.jump();
  }
  if (!p.grounded && !jumpPressed) {
    state.jumpCharge = 0;
  }
  state.jumpPressedLastFrame = jumpPressed;

  const attackPressed = !!(state.keys.j || state.keys.J || state.keys.k || state.keys.x || state.keys.X);
  const critPressed = !!(state.keys.c || state.keys.C || state.keys.v || state.keys.V);
  if (state.attackCooldown > 0) state.attackCooldown -= 1;
  if (state.critCooldown > 0) state.critCooldown -= 1;
  if (attackPressed && !state.attackPressedLastFrame && state.attackCooldown <= 0) {
    state.projectiles.push({
      x: p.x + p.width / 2 + state.facing * 12,
      y: p.y + p.height / 2,
      vx: state.facing * 9,
      life: 55,
      r: 6,
      damage: 1,
      crit: false
    });
    state.attackCooldown = 14;
    sounds.attack();
  }
  if (critPressed && !state.critPressedLastFrame && state.critCooldown <= 0) {
    state.projectiles.push({
      x: p.x + p.width / 2 + state.facing * 12,
      y: p.y + p.height / 2,
      vx: state.facing * 11,
      life: 65,
      r: 9,
      damage: 4,
      crit: true
    });
    state.critCooldown = 600; // ~10s at 60fps
    sounds.crit();
    state.message = '暴击就绪已释放！';
    state.messageUntil = Date.now() + 700;
  }
  state.attackPressedLastFrame = attackPressed;
  state.critPressedLastFrame = critPressed;

  const now = Date.now();
  updateMovingPlatforms(now);

  const levelDef = LEVELS[state.level - 1];
  if (levelDef.wind) {
    const pulse = levelDef.wind.pulse || 0;
    if (levelDef.wind.turbulence) {
      state.windNow = Math.sin(now * (pulse * 1.3)) * 0.38 + Math.sin(now * (pulse * 3.7)) * 0.22;
    } else {
      state.windNow = (levelDef.wind.strength || 0) + Math.sin(now * pulse) * 0.08;
    }
  } else {
    state.windNow = 0;
  }
  if (state.windNow > 0.05) state.windLabel = '→ 顺风';
  else if (state.windNow < -0.05) state.windLabel = '← 逆风';
  else state.windLabel = '↔ 乱流';

  p.vy += GRAVITY;
  p.x += p.vx;
  p.x += state.windNow;
  state.gustZones.forEach((z) => {
    if (p.x + p.width > z.x && p.x < z.x + z.width) p.x += z.force;
  });
  p.y += p.vy;

  p.grounded = false;
  let carryDx = 0;
  state.platforms.forEach((plat) => {
    const platY = canvas.height - plat.y - plat.height;
    if (
      p.x < plat.x + plat.width &&
      p.x + p.width > plat.x &&
      p.y + p.height >= platY &&
      p.y + p.height <= platY + Math.max(p.vy, 0) + 10
    ) {
      p.y = platY - p.height;
      p.vy = 0;
      p.grounded = true;
      if (plat.moving) carryDx = (plat.x - (plat.lastX ?? plat.x));
    }
  });
  if (p.grounded && carryDx !== 0) {
    p.x += carryDx;
  }

  state.coins.forEach((coin) => {
    const coinY = canvas.height - coin.y - 20;
    if (!coin.collected && p.x < coin.x + 20 && p.x + p.width > coin.x && p.y < coinY + 20 && p.y + p.height > coinY) {
      coin.collected = true;
      state.score += 10;
      sounds.coin();
    }
  });

  state.enemies.forEach((e) => {
    if (!e.alive) return;
    e.x += e.speed * e.dir;
    if (e.x < e.baseX - e.patrol || e.x > e.baseX + e.patrol) e.dir *= -1;
    e.y = canvas.height - GROUND_HEIGHT - e.h;

    if (e.boss) {
      if (!e.phase2 && e.hp <= Math.ceil(e.maxHp / 2)) {
        e.phase2 = true;
        state.message = 'Boss 二阶段：开始召唤小怪！';
        state.messageUntil = Date.now() + 1200;
      }

      if (e.phase2) {
        e.summonTimer += 1;
        if (e.summonTimer >= 240) {
          e.summonTimer = 0;
          state.enemies.push({
            x: e.x + (Math.random() > 0.5 ? -60 : 60),
            y: 0,
            w: 28,
            h: 26,
            hp: 1,
            maxHp: 1,
            patrol: 70,
            speed: 1.4,
            baseX: e.x,
            dir: Math.random() > 0.5 ? 1 : -1,
            alive: true,
            shootTimer: 0,
            summonTimer: 0,
            phase2: false,
            summoned: true
          });
          state.message = 'Boss 召唤了小怪！';
          state.messageUntil = Date.now() + 700;
        }
      }
    }

    if (e.boss || e.shooter) {
      e.shootTimer += 1;
      const shootGap = e.boss && e.phase2 ? Math.max(45, (e.shootEvery || 100) - 30) : (e.shootEvery || 100);
      if (e.shootTimer >= shootGap) {
        e.shootTimer = 0;
        const ex = e.x + e.w / 2;
        const ey = e.y + e.h / 2;
        const px = p.x + p.width / 2;
        const py = p.y + p.height / 2;
        const dx = px - ex;
        const dy = py - ey;
        const len = Math.max(1, Math.hypot(dx, dy));
        state.enemyProjectiles.push({ x: ex, y: ey, vx: (dx / len) * 4.5, vy: (dy / len) * 4.5, life: 140, r: 7 });
        sounds.enemyShot();
      }
    }

    if (p.x + p.width > e.x && p.x < e.x + e.w && p.y + p.height > e.y && p.y < e.y + e.h) {
      p.x = Math.max(50, state.cameraX + 50);
      p.y = canvas.height - GROUND_HEIGHT - p.height;
      p.vx = 0;
      p.vy = 0;
      p.grounded = true;
      state.score = Math.max(0, state.score - 15);
      state.message = '被怪物撞到 -15 分';
      state.messageUntil = Date.now() + 900;
      sounds.hit();
    }
  });

  state.projectiles.forEach((shot) => {
    shot.x += shot.vx;
    shot.life -= 1;

    state.shields.forEach((b) => {
      if (!b.alive || shot.life <= 0) return;
      const by = canvas.height - b.y - b.height;
      if (shot.x + shot.r > b.x && shot.x - shot.r < b.x + b.width && shot.y + shot.r > by && shot.y - shot.r < by + b.height) {
        shot.life = 0;
        b.hp -= shot.crit ? 2 : 1;
        if (b.hp <= 0) b.alive = false;
      }
    });

    state.enemies.forEach((e) => {
      if (!e.alive || shot.life <= 0) return;
      if (shot.x + shot.r > e.x && shot.x - shot.r < e.x + e.w && shot.y + shot.r > e.y && shot.y - shot.r < e.y + e.h) {
        e.hp -= (shot.damage || 1);
        shot.life = 0;
        if (e.hp <= 0) {
          e.alive = false;
          state.score += e.boss ? 120 : 30;
          state.message = e.boss ? '怪物王被击败 +120 分' : '怪物击败 +30 分';
          state.messageUntil = Date.now() + 900;
        }
      }
    });
  });
  state.projectiles = state.projectiles.filter((s) => s.life > 0 && s.x > -100 && s.x < state.flagX + 500);

  state.enemyProjectiles.forEach((b) => {
    b.x += b.vx;
    b.y += b.vy;
    b.life -= 1;

    state.shields.forEach((wall) => {
      if (!wall.alive || b.life <= 0) return;
      const wy = canvas.height - wall.y - wall.height;
      if (b.x + b.r > wall.x && b.x - b.r < wall.x + wall.width && b.y + b.r > wy && b.y - b.r < wy + wall.height) {
        b.life = 0;
        wall.hp -= 1;
        if (wall.hp <= 0) wall.alive = false;
      }
    });

    if (b.life > 0 && b.x + b.r > p.x && b.x - b.r < p.x + p.width && b.y + b.r > p.y && b.y - b.r < p.y + p.height) {
      b.life = 0;
      state.playerHp = Math.max(0, state.playerHp - 4);
      state.message = `被远程命中 -4% 血量（${state.playerHp}%）`;
      state.messageUntil = Date.now() + 700;
      sounds.hit();

      if (state.playerHp <= 0) {
        p.x = Math.max(50, state.cameraX + 50);
        p.y = canvas.height - GROUND_HEIGHT - p.height;
        p.vx = 0;
        p.vy = 0;
        p.grounded = true;
        state.playerHp = 100;
        state.score = Math.max(0, state.score - 40);
        state.message = '血量归零，已复活（-40分）';
        state.messageUntil = Date.now() + 1000;
      }
    }
  });
  state.enemyProjectiles = state.enemyProjectiles.filter((b) => b.life > 0);

  state.repairPacks.forEach((rp) => {
    if (rp.used) return;
    const ry = canvas.height - rp.y - 24;
    if (p.x + p.width > rp.x && p.x < rp.x + 24 && p.y + p.height > ry && p.y < ry + 24) {
      rp.used = true;
      const before = state.playerHp;
      state.playerHp = Math.min(100, state.playerHp + (rp.heal || 24));
      if (state.playerHp > before) {
        state.message = `拾取医疗包：血量恢复到 ${state.playerHp}%`;
      } else {
        state.message = '医疗包已拾取（当前满血）';
      }
      state.messageUntil = Date.now() + 900;
    }
  });

  let hitTrap = false;
  state.traps.forEach((trap) => {
    if (trap.type === 'spikes') {
      const tx = trap.x;
      const ty = canvas.height - trap.y - trap.height;
      const tipBandTop = ty - 6;
      if (
        p.x + p.width > tx + 2 &&
        p.x < tx + trap.width - 2 &&
        p.y + p.height > tipBandTop &&
        p.y < ty + trap.height
      ) {
        hitTrap = true;
      }
    } else if (trap.type === 'saw') {
      const sx = trap.x + Math.sin(Date.now() * trap.speed) * trap.amp;
      const sy = canvas.height - trap.y;
      const px = p.x + p.width / 2;
      const py = p.y + p.height / 2;
      const dist = Math.hypot(px - sx, py - sy);
      if (dist < trap.r + Math.min(p.width, p.height) * 0.35) hitTrap = true;
    }
  });

  if (hitTrap) {
    p.x = Math.max(50, state.cameraX + 50);
    p.y = canvas.height - GROUND_HEIGHT - p.height;
    p.vx = 0;
    p.vy = 0;
    p.grounded = true;
    state.jumpCharge = 0;
    state.score = Math.max(0, state.score - 20);
    state.message = '踩中机关 -20 分';
    state.messageUntil = Date.now() + 900;
  }

  if (p.x > state.flagX) {
    state.transitioning = true;
    if (state.level < LEVELS.length) {
      sounds.clear();
      state.message = `进入第 ${state.level + 1} 关：${LEVELS[state.level].name}`;
      state.messageUntil = Date.now() + 1800;
      setTimeout(() => loadLevel(state.level + 1), 950);
    } else {
      state.victory = true;
      sounds.win();
      state.message = '通关成功！';
      state.messageUntil = Date.now() + 2500;
    }
  }

  if (p.x < 0) p.x = 0;

  if (p.y > canvas.height + 220) {
    p.x = Math.max(50, state.cameraX + 50);
    p.y = canvas.height - GROUND_HEIGHT - p.height;
    p.vx = 0;
    p.vy = 0;
    p.grounded = true;
    state.jumpCharge = 0;
  }

  state.cameraX = Math.max(0, p.x - canvas.width / 3);
}

function drawPlayer(x, y, w, h) {
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'white';
  ctx.fillRect(x + 5, y + 5, 8, 8);
  ctx.fillRect(x + 17, y + 5, 8, 8);
  ctx.fillStyle = 'black';
  const eyeOffset = state.player.vx > 0 ? 4 : state.player.vx < 0 ? 0 : 2;
  ctx.fillRect(x + 5 + eyeOffset, y + 7, 4, 4);
  ctx.fillRect(x + 17 + eyeOffset, y + 7, 4, 4);
  ctx.fillRect(x + 8, y + 18, 14, 4);
}

function drawFlag(flagX) {
  const floorY = canvas.height - GROUND_HEIGHT;
  ctx.fillStyle = '#aaa';
  ctx.fillRect(flagX, floorY - 200, 5, 200);
  ctx.beginPath();
  ctx.arc(flagX + 2.5, floorY - 200, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'gold';
  ctx.fill();
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(flagX + 5, floorY - 190);
  ctx.lineTo(flagX + 45, floorY - 170);
  ctx.lineTo(flagX + 5, floorY - 150);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-state.cameraX, 0);

  state.platforms.forEach((plat) => {
    ctx.fillStyle = plat.moving ? '#a0522d' : '#8b4513';
    ctx.fillRect(plat.x, canvas.height - plat.y - plat.height, plat.width, plat.height);
  });

  // Gust zones (visual hint)
  state.gustZones.forEach((z) => {
    ctx.fillStyle = z.force > 0 ? 'rgba(80,180,255,0.16)' : 'rgba(255,120,120,0.16)';
    ctx.fillRect(z.x, canvas.height - 220, z.width, 180);
  });

  // Shields
  state.shields.forEach((s) => {
    if (!s.alive) return;
    const sy = canvas.height - s.y - s.height;
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(s.x, sy, s.width, s.height);
    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(s.x + 6, sy + 8, Math.max(8, (s.width - 12) * (s.hp / Math.max(1, s.maxHp))), 6);
  });

  // Medical packs
  state.repairPacks.forEach((rp) => {
    if (rp.used) return;
    const ry = canvas.height - rp.y - 24;
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(rp.x, ry, 24, 24);
    ctx.fillStyle = 'white';
    ctx.fillRect(rp.x + 10, ry + 4, 4, 16);
    ctx.fillRect(rp.x + 4, ry + 10, 16, 4);
  });

  // Traps
  state.traps.forEach((trap) => {
    if (trap.type === 'spikes') {
      const baseY = canvas.height - trap.y;
      const spikeCount = Math.max(3, Math.floor(trap.width / 18));
      const spikeW = trap.width / spikeCount;
      ctx.fillStyle = '#cfd8dc';
      for (let i = 0; i < spikeCount; i += 1) {
        const x = trap.x + i * spikeW;
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x + spikeW / 2, baseY - trap.height);
        ctx.lineTo(x + spikeW, baseY);
        ctx.closePath();
        ctx.fill();
      }
    } else if (trap.type === 'saw') {
      const sx = trap.x + Math.sin(Date.now() * trap.speed) * trap.amp;
      const sy = canvas.height - trap.y;
      ctx.fillStyle = '#b0bec5';
      ctx.beginPath();
      ctx.arc(sx, sy, trap.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#455a64';
      ctx.beginPath();
      ctx.arc(sx, sy, trap.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = '#ffd700';
  state.coins.forEach((coin) => {
    if (!coin.collected) {
      ctx.beginPath();
      ctx.arc(coin.x + 10, canvas.height - coin.y - 10, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  state.enemies.forEach((e) => {
    if (!e.alive) return;
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(e.x + 4, e.y + 6, 6, 6);
    ctx.fillRect(e.x + e.w - 10, e.y + 6, 6, 6);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(e.x, e.y - 6, (e.w * e.hp) / Math.max(1, e.maxHp), 4);
  });

  state.projectiles.forEach((shot) => {
    ctx.fillStyle = shot.crit ? '#ffeb3b' : '#90caf9';
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#ff7043';
  state.enemyProjectiles.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  drawFlag(state.flagX);
  drawPlayer(state.player.x, state.player.y, state.player.width, state.player.height);

  ctx.restore();

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${state.score}`, 20, 30);
  ctx.fillText(`Level: ${state.level}`, 20, 60);
  ctx.fillText(`HP: ${state.playerHp}%`, 20, 90);
  const critSec = Math.ceil(state.critCooldown / 60);
  ctx.font = '14px Arial';
  ctx.fillText(`暴击CD: ${critSec > 0 ? critSec + 's' : '就绪'}`, 20, 112);

  ctx.font = '14px Arial';
  if (state.level === 2) {
    ctx.fillText('Level 2: 云端跳跃（按住↑蓄力，松开起跳）', 20, 104);
  } else if (state.level === 3) {
    ctx.fillText(`Level 3: 风暴走廊（风向: ${state.windLabel}，注意机关）`, 20, 104);
  } else if (state.level === 4) {
    ctx.fillText('Level 4: 怪物工厂（J普攻 / C暴击）', 20, 104);
  } else if (state.level === 5) {
    ctx.fillText('Level 5: 枪火防线（全员有枪，挡板可挡子弹+医疗包）', 20, 130);
  }

  if (Date.now() < state.messageUntil) {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(canvas.width / 2 - 190, 80, 380, 44);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px Arial';
    ctx.fillText(state.message, canvas.width / 2, 110);
    ctx.textAlign = 'left';
  }

  if (state.victory) {
    ctx.fillStyle = 'gold';
    ctx.textAlign = 'center';
    ctx.font = 'bold 42px Arial';
    ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = 'white';
    ctx.font = '22px Arial';
    ctx.fillText(`Final Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 18);
    ctx.textAlign = 'left';
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loadLevel(1);
requestAnimationFrame(loop);

window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) update();
  draw();
};

window.render_game_to_text = () =>
  JSON.stringify({
    coordinateSystem: 'origin at top-left; +x right, +y down',
    level: state.level,
    levelName: LEVELS[state.level - 1].name,
    player: {
      x: state.player.x,
      y: state.player.y,
      vx: state.player.vx,
      vy: state.player.vy,
      grounded: state.player.grounded,
      jumpCharge: state.jumpCharge
    },
    score: state.score,
    flagX: state.flagX,
    cameraX: state.cameraX,
    movingPlatforms: state.platforms.filter((p) => p.moving).map((p) => ({ x: p.x, y: p.y, range: p.moveRange })),
    trapCount: state.traps.length,
    gustZones: state.gustZones,
    windNow: state.windNow,
    windLabel: state.windLabel,
    enemiesAlive: state.enemies.filter((e) => e.alive).length,
    enemyProjectileCount: state.enemyProjectiles.length,
    playerHp: state.playerHp,
    shieldCount: state.shields.filter((s) => s.alive).length,
    medicalPacksLeft: state.repairPacks.filter((r) => !r.used).length,
    projectileCount: state.projectiles.length,
    critCooldownFrames: state.critCooldown,
    coinsRemaining: state.coins.filter((c) => !c.collected).length,
    victory: state.victory
  });