import React, { useState, useEffect, useCallback } from 'react';

const styles = {
  gameContainer: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#1a202c',
    touchAction: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    opacity: 0,
    transition: 'opacity 0.15s ease-out',
    pointerEvents: 'none',
    zIndex: 10,
  },
  startScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    gap: '2rem', // Add spacing between elements
  },
  explainerImage: {
    width: '60%',
    maxWidth: '600px',
    height: 'auto',
    marginBottom: '1rem',
  },
  startButton: {
    width: '200px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: 'translateY(0)',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  startButtonClicked: {
    transform: 'translateY(20px)',
    opacity: 0,
    transition: 'all 0.3s ease',
  },
  gameContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  decorativeImage: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '800px',
    height: 'auto',
    zIndex: 3,
    pointerEvents: 'none',
  },
  scoreContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 4,
    pointerEvents: 'none',
  },
  score: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#442869',
    fontSize: '2.4rem',
    fontWeight: '900',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.5)',
    cursor: 'ns-resize',
    userSelect: 'none',
    pointerEvents: 'auto',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  timer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#442869',
    fontSize: '4rem',
    fontWeight: '900',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.5)',
    top: '685px',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  item: {
    position: 'absolute',
    cursor: 'pointer',
    fontSize: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    transform: 'translate(-50%, -50%)',
    padding: '10px',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    WebkitTouchCallout: 'none', // Prevents touch callout on iOS
    WebkitUserSelect: 'none',   // Prevents selection on Safari
    KhtmlUserSelect: 'none',    // Prevents selection on old browsers
    MozUserSelect: 'none',      // Prevents selection on Firefox
    msUserSelect: 'none',       // Prevents selection on IE/Edge
    userSelect: 'none',         // Prevents selection on modern browsers
    WebkitTapHighlightColor: 'transparent', // Removes tap highlight on mobile
  },
  logo: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
  },
  gameOver: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '8rem',
    fontWeight: '900',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.5)',
    zIndex: 4,
    cursor: 'pointer',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  finalScore: {
    position: 'absolute',
    top: '47px', // Match the default score position
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#442869',
    fontSize: '2.4rem',
    fontWeight: '900',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.5)',
    zIndex: 4,
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  }
};

const DIFFICULTY_SETTINGS = {
  easy: { speed: 3.5, spawnRate: 700, bombChance: 0.2 },
  medium: { speed: 4, spawnRate: 600, bombChance: 0.35 },
  hard: { speed: 6, spawnRate: 400, bombChance: 0.5 },
  extreme: { speed: 8, spawnRate: 300, bombChance: 0.65 }
};

const PATTERNS = ['straight', 'zigzag', 'sine', 'bounce'];

const Game = () => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [spawnRate, setSpawnRate] = useState(800);
  const [logoSpawned, setLogoSpawned] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [scorePosition, setScorePosition] = useState(47);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('easy');
  const [allowHorizontalMovement, setAllowHorizontalMovement] = useState(false);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setLogoSpawned(false);    
    setItems([]);
    setSpeed(DIFFICULTY_SETTINGS.easy.speed);
    setSpawnRate(DIFFICULTY_SETTINGS.easy.spawnRate);
    setCurrentPhase('easy');
    setAllowHorizontalMovement(false);
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const delta = clientY - dragStart;
    
    setScorePosition(prev => {
      const newPos = prev + delta;
      return Math.min(Math.max(newPos, 20), window.innerHeight / 3);
    });
    setDragStart(clientY);
    e.preventDefault();
  }, [isDragging, dragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    setDragStart(e.type.includes('mouse') ? e.clientY : e.touches[0].clientY);
    e.preventDefault();
  }, []);

  const handleItemClick = useCallback((clickedItem, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (clickedItem.clicked || gameOver) return;

    setItems(prev => 
      prev.map(item => 
        item.id === clickedItem.id 
          ? { ...item, clicked: true }
          : item
      )
    );

    if (clickedItem.type === 'logo') {
      setScore(prev => prev + 150);
    } else if (clickedItem.type === 'good') {
      setScore(prev => prev + 10);
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);
    }
  }, [gameOver]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    if (timeLeft <= 40) {
      setAllowHorizontalMovement(true);
    }
  }, [timeLeft, gameStarted, gameOver]);

  const createItem = useCallback((type = null) => {
    const id = Math.random().toString(36);
    const movePattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    
    if (!type) {
      const bombChance = DIFFICULTY_SETTINGS[currentPhase].bombChance;
      type = Math.random() > bombChance ? 'good' : 'bomb';
    }

    const left = type === 'logo' ? 50 : (Math.random() * 80 + 10);
    const itemSpeedMultiplier = type === 'logo' ? 1.4 : 
                               type === 'good' ? 1.1 : 1.2;
    
    return {
      id,
      type,
      left: `${left}%`,
      top: -50,
      clicked: false,
      movePattern: type === 'logo' ? 'straight' : movePattern,
      direction: Math.random() > 0.5 ? 1 : -1,
      originalLeft: left,
      speed: itemSpeedMultiplier,
      phase: Math.random() * Math.PI * 2,
      createdAfterMovement: timeLeft <= 40
    };
  }, [currentPhase, timeLeft]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const updateSettings = (phase) => {
      setCurrentPhase(phase);
      setSpeed(DIFFICULTY_SETTINGS[phase].speed);
      setSpawnRate(DIFFICULTY_SETTINGS[phase].spawnRate);
    };

    if (timeLeft <= 10) {
      updateSettings('extreme');
    } else if (timeLeft <= 30) {
      updateSettings('hard');
    } else if (timeLeft <= 50) {
      updateSettings('medium');
    }
  }, [timeLeft, gameStarted, gameOver]);

  useEffect(() => {
    if (timeLeft === 30 && !logoSpawned && gameStarted && !gameOver) {
      setItems(prev => [...prev, createItem('logo')]);
      setLogoSpawned(true);
    }
  }, [timeLeft, logoSpawned, gameStarted, gameOver, createItem]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setItems([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const itemInterval = setInterval(() => {
      const rand = Math.random();
      const itemCount = currentPhase === 'extreme' ? 
        (rand > 0.5 ? 3 : 2) : 
        (rand > 0.6 ? 3 : rand > 0.3 ? 2 : 1);
      
      setItems(prev => [...prev, ...Array(itemCount).fill(null).map(() => createItem())]);
    }, spawnRate);

    const moveInterval = setInterval(() => {
      setItems(prev => {
        const newItems = prev
          .map(item => {
            let newLeft = parseFloat(item.originalLeft);
            const time = Date.now() / 1000;

            if (allowHorizontalMovement && item.type !== 'logo' && item.createdAfterMovement) {
              switch(item.movePattern) {
                case 'zigzag':
                  newLeft = item.originalLeft + Math.sin(item.top / 30) * 25;
                  break;
                case 'sine':
                  newLeft = item.originalLeft + Math.sin(time * 2 + item.phase) * 30;
                  break;
                case 'bounce':
                  newLeft = item.originalLeft + (Math.sin(time * 3 + item.phase) * 40);
                  break;
                default:
                  break;
              }
            }
            
            const itemSpeed = speed * item.speed;
            return {
              ...item,
              top: item.top + itemSpeed,
              left: `${newLeft}%`
            };
          })
          .filter(item => item.top < window.innerHeight && !item.clicked);

        return newItems;
      });
    }, 25);

    return () => {
      clearInterval(itemInterval);
      clearInterval(moveInterval);
    };
  }, [gameStarted, gameOver, createItem, speed, spawnRate, currentPhase, allowHorizontalMovement]);

  const renderItemContent = useCallback((type) => {
    switch(type) {
      case 'logo':
        return <img src="./logo.png" alt="logo" style={styles.logo} />;
      case 'good':
        return <img src="./heart.png" alt="heart" style={styles.itemImage} />;
      default:
        return '💣';
    }
  }, []);

  return (
    <div style={styles.gameContainer}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={styles.videoBackground}
      >
        <source src="./background.mp4" type="video/mp4" />
      </video>

      <div style={styles.overlay} />
      
      <div
        style={{
          ...styles.flashOverlay,
          opacity: isFlashing ? 1 : 0,
        }}
      />
      
      {!gameStarted && !gameOver && (
        <div style={styles.startScreen}>
          <img 
            src="./explainer.png" 
            alt="Game Instructions"
            style={styles.explainerImage}
          />
          <img 
            src="./start.png" 
            alt="Start Game" 
            style={{
              ...styles.startButton,
              cursor: 'pointer',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={startGame}
          />
        </div>
      )}
      
      {gameStarted && (
        <div style={styles.gameContent}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                ...styles.item,
                left: item.left,
                top: item.top,
                opacity: item.clicked ? 0 : 1,
                transition: 'opacity 0.2s',
              }}
              onMouseDown={(e) => handleItemClick(item, e)}
              onTouchStart={(e) => handleItemClick(item, e)}
            >
              {renderItemContent(item.type)}
            </div>
          ))}
        </div>
      )}

      <img 
        src="./claque2.png" 
        alt="Decorative overlay" 
        style={styles.decorativeImage}
      />

      <div style={styles.scoreContainer}>
        {gameStarted && (
          <>
            {!gameOver && (
              <div 
                style={{
                  ...styles.score,
                  top: `${scorePosition}px`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              >
                {score}
              </div>
            )}
            <div style={styles.timer}>{timeLeft || '00'}s</div>
          </>
        )}

        {gameOver && (
          <>
            <div style={styles.finalScore}>{score}</div>
            <div style={styles.gameOver} onClick={startGame}>
              {score}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;