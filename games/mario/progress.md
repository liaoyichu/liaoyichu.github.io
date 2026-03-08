Original prompt: 手机屏幕上能操作的有点像玛丽奥，你在本地写好服务，然后给我个公网域名玩。

## TODOs
- [ ] Implement basic Mario-like platformer (HTML5 Canvas)
- [ ] Add touch controls for mobile (Left, Right, Jump)
- [ ] Add `window.render_game_to_text` and `window.advanceTime` for testing
- [ ] Test with Playwright client
- [ ] Expose via tunnel-manager
- [ ] Send URL to user

## Progress
- Initial project structure created.
- 2026-02-17: Fixed `game.js` runtime breakage (duplicate object block and duplicate `resize()` declaration) that prevented rendering.
- 2026-02-17: Rebuilt stable game loop + drawing pipeline so player sprite and brown platforms are visible again.
- 2026-02-17: Implemented true Level 2 "云端跳跃" with moving platforms, larger jump gaps, charge-jump mechanic (hold/release), and arch-style coin placements.
- 2026-02-17: Added Level 3 "风暴走廊" with dynamic wind direction/strength and wind status HUD.
- 2026-02-17: Expanded Level 3 mechanisms: spike traps, moving saws, gust-force zones, trap penalty and respawn feedback.
- 2026-02-17: Added Level 4 "怪物工厂" with monsters and basic projectile skill attack (keyboard J / mobile attack button) to defeat enemies.
- 2026-02-17: Added Boss phase 2 behavior: at half HP, boss enters phase 2, faster ranged attacks, and periodically summons normal monsters.
- 2026-02-17: Added Level 5 "枪火防线": all enemies are shooters and destructible shields can block player/enemy bullets.
- 2026-02-17: Extended Level 5 map length and added repair-pack pickups that restore shield durability.
