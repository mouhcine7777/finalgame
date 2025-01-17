import React, { useState, useEffect, useCallback } from 'react';

const styles = {
  gameContainer: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#1a202c',
    touchAction: 'none',
    userSelect: 'none',
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
  startScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  startButton: {
    width: '200px', // Reduced size
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
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
    color: 'white',
    fontSize: '3rem',
    fontWeight: '900',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.5)',
    cursor: 'ns-resize',
    userSelect: 'none',
    pointerEvents: 'auto',
  },
  timer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    fontSize: '4rem',
    fontWeight: '900',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.5)',
    top: '620px',
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
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
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
  }
};

const Game = () => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [spawnRate, setSpawnRate] = useState(600);
  const [logoSpawned, setLogoSpawned] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [scorePosition, setScorePosition] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setLogoSpawned(false);
    setItems([]);
    setSpeed(4);
    setSpawnRate(600);
  };

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

  const createItem = useCallback((type = null) => {
    const id = Math.random().toString(36);
    
    const patterns = ['straight', 'zigzag', 'sine', 'bounce'];
    const movePattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (!type) {
      type = Math.random() > 0.35 ? 'good' : 'bomb';
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
      phase: Math.random() * Math.PI * 2
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 15 && !logoSpawned && gameStarted && !gameOver) {
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

    const difficultyInterval = setInterval(() => {
      setSpeed(prev => {
        const speedIncrease = prev > 7 ? 0.3 : 0.5;
        return Math.min(prev + speedIncrease, 8.5);
      });
      setSpawnRate(prev => Math.max(prev - 75, 400));
    }, 3000);

    return () => clearInterval(difficultyInterval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const itemInterval = setInterval(() => {
      const rand = Math.random();
      const itemCount = rand > 0.6 ? 3 : rand > 0.3 ? 2 : 1;
      setItems(prev => [...prev, ...Array(itemCount).fill(null).map(() => createItem())]);
    }, spawnRate);

    const moveInterval = setInterval(() => {
      setItems(prev => {
        const newItems = prev
          .map(item => {
            let newLeft = parseFloat(item.left);
            const time = Date.now() / 1000;

            if (item.type !== 'logo') {
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
  }, [gameStarted, gameOver, createItem, speed, spawnRate]);

  const handleItemClick = (clickedItem, e) => {
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
    }
  };

  const renderItemContent = (type) => {
    switch(type) {
      case 'logo':
        return <img src="./logo.png" alt="logo" style={styles.logo} />;
      case 'good':
        return <img src="./heart.png" alt="heart" style={styles.itemImage} />;
      default:
        return '💣';
    }
  };

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
      
      {!gameStarted && !gameOver && (
        <div style={styles.startScreen}>
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
        {gameStarted && !gameOver && (
          <>
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
            <div style={styles.timer}>{timeLeft}s</div>
          </>
        )}

        {gameOver && (
          <div style={styles.gameOver} onClick={startGame}>
            {score}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;