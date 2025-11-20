"use client"
import { useEffect, useState, useRef } from "react"

// 角色定义
const HEROES = {
  warrior: { name: '剑士', emoji: '⚔️', color: '#FF6B6B', skill: '重击', skillDesc: '造成双倍伤害' },
  mage: { name: '法师', emoji: '🔮', color: '#9C27B0', skill: '魔法盾', skillDesc: '抵挡一次伤害' },
  archer: { name: '弓箭手', emoji: '🏹', color: '#4CAF50', skill: '连射', skillDesc: '额外获得经验' },
  knight: { name: '骑士', emoji: '🛡️', color: '#2196F3', skill: '坚守', skillDesc: '恢复生命值' },
}

// 怪物定义
const MONSTERS = [
  { name: '史莱姆', emoji: '🟢', hp: 30, attack: 5, exp: 20, gold: 10 },
  { name: '哥布林', emoji: '👺', hp: 50, attack: 8, exp: 35, gold: 20 },
  { name: '骷髅兵', emoji: '💀', hp: 70, attack: 10, exp: 50, gold: 30 },
  { name: '狼人', emoji: '🐺', hp: 100, attack: 15, exp: 80, gold: 50 },
  { name: '石像鬼', emoji: '🗿', hp: 120, attack: 18, exp: 100, gold: 65 },
  { name: '暗影骑士', emoji: '🦇', hp: 150, attack: 22, exp: 130, gold: 80 },
  { name: '火焰巨人', emoji: '🔥', hp: 200, attack: 28, exp: 180, gold: 100 },
  { name: '冰霜巨龙', emoji: '🐉', hp: 300, attack: 35, exp: 300, gold: 200 },
]

// 场景定义
const SCENES = [
  { name: '新手草原', bg: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)', monsters: [0, 1] },
  { name: '幽暗森林', bg: 'linear-gradient(180deg, #4A5568 0%, #2D3748 100%)', monsters: [1, 2] },
  { name: '骷髅墓地', bg: 'linear-gradient(180deg, #553C9A 0%, #44337A 100%)', monsters: [2, 3] },
  { name: '火山熔岩', bg: 'linear-gradient(180deg, #F56565 0%, #C53030 100%)', monsters: [3, 4, 5] },
  { name: '冰封雪山', bg: 'linear-gradient(180deg, #BEE3F8 0%, #90CDF4 100%)', monsters: [4, 5, 6] },
  { name: '魔王城堡', bg: 'linear-gradient(180deg, #1A202C 0%, #2D3748 100%)', monsters: [5, 6, 7] },
]

// 成就定义
const ACHIEVEMENTS = [
  { id: 'first_win', name: '初战告捷', desc: '击败第一只怪物', icon: '🏅' },
  { id: 'streak_5', name: '连击大师', desc: '连续答对5题', icon: '⚡' },
  { id: 'streak_10', name: '连击传说', desc: '连续答对10题', icon: '🌟' },
  { id: 'level_5', name: '冒险新星', desc: '达到5级', icon: '⭐' },
  { id: 'level_10', name: '勇者之路', desc: '达到10级', icon: '🌠' },
  { id: 'gold_100', name: '小有积蓄', desc: '累计获得100金币', icon: '💰' },
  { id: 'gold_500', name: '财富满满', desc: '累计获得500金币', icon: '👑' },
  { id: 'boss_defeat', name: '屠龙勇士', desc: '击败冰霜巨龙', icon: '🏆' },
]

type Props = {
  total: number
  current: number
  status?: "idle" | "correct" | "wrong"
  currentQuestion?: string
  onAnswerSubmit?: (answer: string) => void
  showVictory?: boolean
  questionCategory?: string
  questionDifficulty?: number
  questionPoints?: number
}

export function MathClimbingGame({
  total,
  current,
  status = "idle",
  currentQuestion = "",
  onAnswerSubmit,
  showVictory = false,
  questionCategory = "",
  questionDifficulty = 1,
  questionPoints = 10
}: Props) {
  // 游戏状态
  const [answer, setAnswer] = useState("")
  const [phase, setPhase] = useState<'select' | 'battle' | 'victory'>('select')
  const [selectedHero, setSelectedHero] = useState<keyof typeof HEROES>('warrior')
  const [currentScene, setCurrentScene] = useState(0)

  // 玩家状态
  const [playerHp, setPlayerHp] = useState(100)
  const [maxHp, setMaxHp] = useState(100)
  const [level, setLevel] = useState(1)
  const [exp, setExp] = useState(0)
  const [gold, setGold] = useState(0)
  const [totalGold, setTotalGold] = useState(0)
  const [skillPoints, setSkillPoints] = useState(0)
  const [streak, setStreak] = useState(0)

  // 怪物状态
  const [monsterIndex, setMonsterIndex] = useState(0)
  const [monsterHp, setMonsterHp] = useState(30)
  const [monsterMaxHp, setMonsterMaxHp] = useState(30)
  const [monstersDefeated, setMonstersDefeated] = useState(0)

  // 动画状态
  const [playerAnim, setPlayerAnim] = useState<'idle' | 'attack' | 'hurt' | 'skill'>('idle')
  const [monsterAnim, setMonsterAnim] = useState<'idle' | 'hurt' | 'attack' | 'death'>('idle')
  const [showDamage, setShowDamage] = useState<{ player?: number; monster?: number } | null>(null)
  const [showExpGain, setShowExpGain] = useState(0)
  const [showGoldGain, setShowGoldGain] = useState(0)

  // 成就
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  // 消息日志
  const [battleLog, setBattleLog] = useState<string[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 计算升级所需经验
  const expToLevel = (lv: number) => lv * 50 + 50

  // 计算攻击力
  const getAttack = () => 10 + level * 3 + (selectedHero === 'warrior' && skillPoints > 0 ? 10 : 0)

  // 生成怪物
  const spawnMonster = () => {
    const scene = SCENES[currentScene]
    const possibleMonsters = scene.monsters
    const idx = possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)]
    const monster = MONSTERS[idx]

    setMonsterIndex(idx)
    setMonsterHp(monster.hp)
    setMonsterMaxHp(monster.hp)
    setMonsterAnim('idle')
    addLog(`遭遇了 ${monster.emoji} ${monster.name}！`)
  }

  // 添加日志
  const addLog = (msg: string) => {
    setBattleLog(prev => [...prev.slice(-4), msg])
  }

  // 检查成就
  const checkAchievement = (id: string) => {
    if (!achievements.includes(id)) {
      setAchievements(prev => [...prev, id])
      setNewAchievement(id)
      setTimeout(() => setNewAchievement(null), 3000)
    }
  }

  // 开始游戏
  const startGame = () => {
    setPhase('battle')
    setPlayerHp(100)
    setMaxHp(100)
    setLevel(1)
    setExp(0)
    setGold(0)
    setStreak(0)
    setMonstersDefeated(0)
    setBattleLog([])
    spawnMonster()
    addLog(`${HEROES[selectedHero].emoji} ${HEROES[selectedHero].name} 开始冒险！`)
  }

  // 处理答题
  const handleSubmit = () => {
    if (answer.trim() && onAnswerSubmit) {
      onAnswerSubmit(answer.trim())
      setAnswer("")
    }
  }

  // 玩家攻击
  const playerAttack = () => {
    setPlayerAnim('attack')
    setTimeout(() => setPlayerAnim('idle'), 300)

    let damage = getAttack()
    // 暴击判定
    if (streak >= 3 && Math.random() > 0.7) {
      damage *= 2
      addLog('暴击！')
    }

    const newHp = Math.max(0, monsterHp - damage)
    setMonsterHp(newHp)
    setMonsterAnim('hurt')
    setShowDamage({ monster: damage })

    setTimeout(() => {
      setMonsterAnim('idle')
      setShowDamage(null)
    }, 500)

    addLog(`造成 ${damage} 点伤害！`)

    // 检查怪物是否死亡
    if (newHp <= 0) {
      setMonsterAnim('death')
      const monster = MONSTERS[monsterIndex]
      const expGain = monster.exp
      const goldGain = monster.gold

      setShowExpGain(expGain)
      setShowGoldGain(goldGain)
      setTimeout(() => {
        setShowExpGain(0)
        setShowGoldGain(0)
      }, 1500)

      // 增加经验和金币
      setExp(prev => {
        const newExp = prev + expGain
        const needed = expToLevel(level)
        if (newExp >= needed) {
          setLevel(lv => lv + 1)
          setMaxHp(hp => hp + 20)
          setPlayerHp(hp => Math.min(hp + 50, maxHp + 20))
          setSkillPoints(sp => sp + 1)
          addLog(`升级到 Lv.${level + 1}！`)

          // 检查等级成就
          if (level + 1 >= 5) checkAchievement('level_5')
          if (level + 1 >= 10) checkAchievement('level_10')

          return newExp - needed
        }
        return newExp
      })

      setGold(g => g + goldGain)
      setTotalGold(g => {
        const newTotal = g + goldGain
        if (newTotal >= 100) checkAchievement('gold_100')
        if (newTotal >= 500) checkAchievement('gold_500')
        return newTotal
      })

      setMonstersDefeated(m => m + 1)
      addLog(`击败了 ${monster.emoji} ${monster.name}！获得 ${expGain} 经验，${goldGain} 金币`)

      // 检查成就
      if (monstersDefeated === 0) checkAchievement('first_win')
      if (monsterIndex === 7) checkAchievement('boss_defeat')

      // 生成新怪物
      setTimeout(() => spawnMonster(), 1500)
    }
  }

  // 怪物攻击
  const monsterAttack = () => {
    const monster = MONSTERS[monsterIndex]
    let damage = monster.attack

    // 法师护盾
    if (selectedHero === 'mage' && skillPoints > 0 && Math.random() > 0.5) {
      damage = 0
      addLog('魔法盾抵挡了攻击！')
    }

    setMonsterAnim('attack')
    setTimeout(() => setMonsterAnim('idle'), 300)

    if (damage > 0) {
      setPlayerAnim('hurt')
      setShowDamage({ player: damage })
      setPlayerHp(hp => Math.max(0, hp - damage))
      addLog(`受到 ${damage} 点伤害！`)

      setTimeout(() => {
        setPlayerAnim('idle')
        setShowDamage(null)
      }, 500)
    }

    // 骑士恢复
    if (selectedHero === 'knight' && skillPoints > 0) {
      const heal = 5
      setPlayerHp(hp => Math.min(maxHp, hp + heal))
      addLog(`骑士恢复 ${heal} 生命值`)
    }
  }

  // 处理答题结果
  useEffect(() => {
    if (phase !== 'battle') return

    if (status === 'correct') {
      setStreak(s => s + 1)
      playerAttack()

      // 检查连击成就
      if (streak + 1 >= 5) checkAchievement('streak_5')
      if (streak + 1 >= 10) checkAchievement('streak_10')

      // 弓箭手额外经验
      if (selectedHero === 'archer' && skillPoints > 0) {
        setExp(e => e + 10)
      }
    } else if (status === 'wrong') {
      setStreak(0)
      monsterAttack()
    }
  }, [status])

  // 检查游戏结束
  useEffect(() => {
    if (playerHp <= 0) {
      addLog('勇士倒下了...')
      setTimeout(() => setPhase('victory'), 1500)
    }
  }, [playerHp])

  // 检查通关
  useEffect(() => {
    if (showVictory && phase === 'battle') {
      setPhase('victory')
    }
  }, [showVictory])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const monster = MONSTERS[monsterIndex]
  const hero = HEROES[selectedHero]
  const scene = SCENES[currentScene]

  // 角色选择界面
  if (phase === 'select') {
    return (
      <div style={{
        padding: '30px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        color: 'white',
        minHeight: '500px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>
          选择你的英雄
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {(Object.keys(HEROES) as Array<keyof typeof HEROES>).map(key => {
            const h = HEROES[key]
            return (
              <button
                key={key}
                onClick={() => setSelectedHero(key)}
                style={{
                  padding: '20px',
                  background: selectedHero === key ? h.color : 'rgba(255,255,255,0.1)',
                  border: selectedHero === key ? '3px solid white' : '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  color: 'white',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{h.emoji}</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{h.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
                  技能: {h.skill}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.6 }}>
                  {h.skillDesc}
                </div>
              </button>
            )
          })}
        </div>

        {/* 场景选择 */}
        <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>选择冒险场景</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '30px'
        }}>
          {SCENES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentScene(idx)}
              style={{
                padding: '12px',
                background: currentScene === idx ? s.bg : 'rgba(255,255,255,0.1)',
                border: currentScene === idx ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '12px'
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <button
          onClick={startGame}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '20px',
            fontWeight: 'bold',
            background: hero.color,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: `0 4px 20px ${hero.color}80`
          }}
        >
          开始冒险！
        </button>
      </div>
    )
  }

  // 结算界面
  if (phase === 'victory') {
    return (
      <div style={{
        padding: '30px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        color: 'white',
        textAlign: 'center',
        minHeight: '500px'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>
          {playerHp > 0 ? '🎉' : '💀'}
        </div>
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>
          {playerHp > 0 ? '冒险成功！' : '勇士倒下了'}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          margin: '30px 0'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px' }}>⚔️</div>
            <div style={{ fontWeight: 'bold' }}>{monstersDefeated}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>击败怪物</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px' }}>📊</div>
            <div style={{ fontWeight: 'bold' }}>Lv.{level}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>最终等级</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px' }}>💰</div>
            <div style={{ fontWeight: 'bold' }}>{totalGold}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>获得金币</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px' }}>🏆</div>
            <div style={{ fontWeight: 'bold' }}>{achievements.length}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>解锁成就</div>
          </div>
        </div>

        {achievements.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>获得成就</h3>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {achievements.map(id => {
                const ach = ACHIEVEMENTS.find(a => a.id === id)
                return ach ? (
                  <span key={id} title={ach.desc} style={{
                    fontSize: '24px',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}>
                    {ach.icon}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => setPhase('select')}
          style={{
            padding: '14px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: hero.color,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          再次冒险
        </button>
      </div>
    )
  }

  // 战斗界面
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '600px',
      background: scene.bg,
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      {/* 顶部状态栏 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '15px',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        {/* 玩家状态 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '24px' }}>{hero.emoji}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Lv.{level} {hero.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '12px' }}>❤️</span>
              <div style={{
                width: '80px',
                height: '8px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(playerHp / maxHp) * 100}%`,
                  height: '100%',
                  background: playerHp > maxHp * 0.3 ? '#4CAF50' : '#f44336',
                  transition: 'width 0.3s'
                }} />
              </div>
              <span style={{ fontSize: '10px' }}>{playerHp}/{maxHp}</span>
            </div>
          </div>
        </div>

        {/* 游戏信息 */}
        <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
          <span>💰 {gold}</span>
          <span>⚔️ {monstersDefeated}</span>
          {streak > 0 && <span style={{ color: '#FFD700' }}>🔥 {streak}</span>}
        </div>
      </div>

      {/* 经验条 */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '15px',
        right: '15px',
        height: '6px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '3px'
      }}>
        <div style={{
          width: `${(exp / expToLevel(level)) * 100}%`,
          height: '100%',
          background: '#FFD700',
          borderRadius: '3px',
          transition: 'width 0.5s'
        }} />
      </div>

      {/* 战斗区域 */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: 0,
        right: 0,
        height: '250px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 50px'
      }}>
        {/* 玩家 */}
        <div style={{
          textAlign: 'center',
          transform: playerAnim === 'attack' ? 'translateX(50px)' :
                     playerAnim === 'hurt' ? 'translateX(-20px)' : 'none',
          transition: 'transform 0.2s'
        }}>
          <div style={{
            fontSize: '60px',
            filter: playerAnim === 'hurt' ? 'brightness(2)' : 'none',
            animation: playerAnim === 'skill' ? 'pulse 0.5s' : 'none'
          }}>
            {hero.emoji}
          </div>
          {showDamage?.player && (
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#f44336',
              fontWeight: 'bold',
              fontSize: '20px',
              animation: 'floatUp 1s'
            }}>
              -{showDamage.player}
            </div>
          )}
        </div>

        {/* VS */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          VS
        </div>

        {/* 怪物 */}
        <div style={{
          textAlign: 'center',
          transform: monsterAnim === 'attack' ? 'translateX(-50px)' :
                     monsterAnim === 'hurt' ? 'translateX(20px)' : 'none',
          opacity: monsterAnim === 'death' ? 0.3 : 1,
          transition: 'all 0.3s'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '14px', color: 'white', marginBottom: '5px' }}>
              {monster.emoji} {monster.name}
            </div>
            <div style={{
              width: '100px',
              height: '8px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '4px',
              margin: '0 auto'
            }}>
              <div style={{
                width: `${(monsterHp / monsterMaxHp) * 100}%`,
                height: '100%',
                background: '#f44336',
                borderRadius: '4px',
                transition: 'width 0.3s'
              }} />
            </div>
            <div style={{ fontSize: '10px', color: 'white' }}>{monsterHp}/{monsterMaxHp}</div>
          </div>
          <div style={{
            fontSize: '60px',
            filter: monsterAnim === 'hurt' ? 'brightness(2)' : 'none'
          }}>
            {monster.emoji}
          </div>
          {showDamage?.monster && (
            <div style={{
              color: '#FFD700',
              fontWeight: 'bold',
              fontSize: '20px',
              animation: 'floatUp 1s'
            }}>
              -{showDamage.monster}
            </div>
          )}
        </div>
      </div>

      {/* 获得经验/金币提示 */}
      {(showExpGain > 0 || showGoldGain > 0) && (
        <div style={{
          position: 'absolute',
          top: '200px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          animation: 'floatUp 1.5s'
        }}>
          {showExpGain > 0 && <div style={{ color: '#FFD700', fontWeight: 'bold' }}>+{showExpGain} EXP</div>}
          {showGoldGain > 0 && <div style={{ color: '#FFD700', fontWeight: 'bold' }}>+{showGoldGain} 金币</div>}
        </div>
      )}

      {/* 战斗日志 */}
      <div style={{
        position: 'absolute',
        top: '360px',
        left: '15px',
        right: '15px',
        height: '60px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '8px',
        padding: '8px 12px',
        overflow: 'hidden'
      }}>
        {battleLog.slice(-3).map((log, idx) => (
          <div key={idx} style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2px'
          }}>
            {log}
          </div>
        ))}
      </div>

      {/* 题目面板 */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '15px',
        right: '15px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
      }}>
        {/* 题目分类和难度 */}
        {questionCategory && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '12px'
          }}>
            <span style={{ color: hero.color, fontWeight: 'bold' }}>{questionCategory}</span>
            <span style={{ color: '#666' }}>
              {'⭐'.repeat(questionDifficulty)} | +{questionPoints}分
            </span>
          </div>
        )}

        {/* 题目 */}
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '15px',
          color: '#333',
          minHeight: '40px'
        }}>
          {currentQuestion || '准备战斗！'}
        </div>

        {/* 输入框 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入答案攻击怪物"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '16px',
              border: `2px solid ${status === 'correct' ? '#4CAF50' : status === 'wrong' ? '#f44336' : '#ddd'}`,
              borderRadius: '8px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              background: hero.color,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: answer.trim() ? 'pointer' : 'not-allowed',
              opacity: answer.trim() ? 1 : 0.5
            }}
          >
            攻击！
          </button>
        </div>
      </div>

      {/* 成就提示 */}
      {newAchievement && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.9)',
          padding: '20px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          animation: 'scaleIn 0.5s',
          zIndex: 100
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>
            {ACHIEVEMENTS.find(a => a.id === newAchievement)?.icon}
          </div>
          <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '16px' }}>
            成就解锁！
          </div>
          <div style={{ color: 'white', fontSize: '14px' }}>
            {ACHIEVEMENTS.find(a => a.id === newAchievement)?.name}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes floatUp {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-30px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes scaleIn {
          from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
