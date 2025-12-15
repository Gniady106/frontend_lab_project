'use client';

import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Save, Upload } from 'lucide-react';
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const WordSearchGame = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const defaultConfig = {
    gridSize: 10,
    backgroundColor: '#ffffff',
    cellColor: '#f0f0f0',
    textColor: '#000000',
    selectedColor: '#3b82f6',
    foundColor: '#10b981',
    lineWidth: 3,
    fontSize: 20,
    fontFamily: 'Arial'
  };

  const dictionary = ['REACT', 'JAVASCRIPT', 'HTML', 'CSS', 'NODE', 'PYTHON'];


  const [config, setConfig] = useState(defaultConfig);
  const [showConfig, setShowConfig] = useState(false);
  const [wordPositions, setWordPositions] = useState([]);
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [initialized, setInitialized] = useState(false);

 
  const canPlaceWord = (grid, word, row, col, direction, size) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    const [dRow, dCol] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (dRow * i);
      const newCol = col + (dCol * i);
      
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        return false;
      }
      
      const currentCell = grid[newRow][newCol];
      if (currentCell !== '_' && currentCell !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    const [dRow, dCol] = directions[direction];
    const positions = [];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (dRow * i);
      const newCol = col + (dCol * i);
      grid[newRow][newCol] = word[i];
      positions.push({ row: newRow, col: newCol });
    }
    
    return { word, positions, direction };
  };

  const generateGrid = () => {
    const size = config.gridSize;
    let attempts = 0;
    let grid;
    let positions;
    
    while (attempts < 50) {
      grid = Array(size).fill(null).map(() => 
        Array(size).fill(null).map(() => '_')
      );
      
      positions = [];
      let allPlaced = true;

      for (const word of dictionary) {
        let placed = false;
        let wordAttempts = 0;
        
        while (!placed && wordAttempts < 200) {
          const direction = Math.floor(Math.random() * 8);
          const row = Math.floor(Math.random() * size);
          const col = Math.floor(Math.random() * size);
          
          if (canPlaceWord(grid, word, row, col, direction, size)) {
            const wordPos = placeWord(grid, word, row, col, direction);
            positions.push(wordPos);
            placed = true;
          }
          wordAttempts++;
        }
        
        if (!placed) {
          allPlaced = false;
          break;
        }
      }
      
      if (allPlaced) {
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (grid[i][j] === '_') {
              grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
          }
        }
        setWordPositions(positions);
        return grid;
      }
      
      attempts++;
    }
    
    console.error('Nie udało się wygenerować planszy');
    return Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );
  };


 const saveGameState = async () => {
  if (!user) return;

  try {
    setSaveStatus('Zapisywanie...');

   
    const flatGrid = grid.map(row => row.join(''));

    const gameState = {
      grid: flatGrid,
      foundWords,
      wordPositions,
      config,
      gameWon,
      lastSaved: new Date().toISOString(),
      userId: user.uid
    };

    await setDoc(doc(db, 'wordSearchGames', user.uid), gameState);
    setSaveStatus('Zapisano! ✓');
    setTimeout(() => setSaveStatus(''), 2000);
  } catch (error) {
    console.error('Błąd zapisu:', error);
    setSaveStatus('Błąd zapisu ✗');
    setTimeout(() => setSaveStatus(''), 2000);
  }
};

 
const loadGameState = async () => {
  if (!user) return;

  try {
    const docRef = doc(db, 'wordSearchGames', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

    
      const restoredGrid = (data.grid || []).map(rowStr => rowStr.split(''));

      setGrid(restoredGrid);
      setFoundWords(data.foundWords || []);
      setWordPositions(data.wordPositions || []);
      setConfig(data.config || defaultConfig);
      setGameWon(data.gameWon || false);
      console.log('Wczytano zapisany stan gry');
    } else {
      
      setGrid(generateGrid());
    }
    setInitialized(true);
  } catch (error) {
    console.error('Błąd wczytywania:', error);
    setGrid(generateGrid());
    setInitialized(true);
  }
};


 
  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/signin?returnUrl=/crossword');
    }
  }, [user, loading, router]);


  useEffect(() => {
    if (user && !initialized) {
      loadGameState();
    }
  }, [user, initialized]);

  // Auto-zapis po każdej zmianie foundWords
  useEffect(() => {
    if (user && foundWords.length > 0 && initialized) {
      saveGameState();
    }
  }, [foundWords]);

  // Sprawdź czy gra wygrana
  useEffect(() => {
    if (foundWords.length === dictionary.length && foundWords.length > 0) {
      setGameWon(true);
    }
  }, [foundWords]);

  // Pokaż loader podczas ładowania
  if (loading || !user || !initialized) {
    return <p className="text-center mt-20">Ładowanie...</p>;
  }

  const getCellKey = (row, col) => `${row}-${col}`;

  const handleMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row, col) => {
    if (!isSelecting) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    if (isInLine(selectedCells[0], { row, col })) {
      const cellsBetween = getCellsBetween(selectedCells[0], { row, col });
      setSelectedCells(cellsBetween);
    }
  };

  const isInLine = (start, end) => {
    const rowDiff = Math.abs(end.row - start.row);
    const colDiff = Math.abs(end.col - start.col);
    
    return rowDiff === 0 || colDiff === 0 || rowDiff === colDiff;
  };

  const getCellsBetween = (start, end) => {
    const cells = [];
    const rowStep = end.row === start.row ? 0 : (end.row - start.row) / Math.abs(end.row - start.row);
    const colStep = end.col === start.col ? 0 : (end.col - start.col) / Math.abs(end.col - start.col);
    const steps = Math.max(Math.abs(end.row - start.row), Math.abs(end.col - start.col));

    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: start.row + (rowStep * i),
        col: start.col + (colStep * i)
      });
    }

    return cells;
  };

  const handleMouseUp = () => {
    setIsSelecting(false);

    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reverseWord = word.split('').reverse().join('');

    if (dictionary.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
    } else if (dictionary.includes(reverseWord) && !foundWords.includes(reverseWord)) {
      setFoundWords([...foundWords, reverseWord]);
    } else {
      setSelectedCells([]);
    }
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellFound = (row, col) => {
    return foundWords.some(word => {
      return checkIfCellInWord(row, col, word);
    });
  };

  const checkIfCellInWord = (row, col, word) => {
    const size = config.gridSize;
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    for (let startRow = 0; startRow < size; startRow++) {
      for (let startCol = 0; startCol < size; startCol++) {
        for (const [dRow, dCol] of directions) {
          let matches = true;
          let containsCell = false;

          for (let i = 0; i < word.length; i++) {
            const newRow = startRow + (dRow * i);
            const newCol = startCol + (dCol * i);

            if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
              matches = false;
              break;
            }

            if (grid[newRow][newCol] !== word[i]) {
              matches = false;
              break;
            }

            if (newRow === row && newCol === col) {
              containsCell = true;
            }
          }

          if (matches && containsCell) return true;
        }
      }
    }

    return false;
  };

  const resetGame = () => {
    setSelectedCells([]);
    setFoundWords([]);
    setGameWon(false);
    const newGrid = generateGrid();
    setGrid(newGrid);
    if (user) {
      saveGameState();
    }
  };

  const getCellStyle = (row, col) => {
    const base = {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid #ddd`,
      cursor: 'pointer',
      userSelect: 'none',
      fontSize: `${config.fontSize}px`,
      fontFamily: config.fontFamily,
      color: config.textColor,
      backgroundColor: config.cellColor,
      transition: 'all 0.2s'
    };

    if (isCellFound(row, col)) {
      return {
        ...base,
        backgroundColor: config.foundColor,
        color: '#ffffff',
        fontWeight: 'bold'
      };
    }

    if (isCellSelected(row, col)) {
      return {
        ...base,
        backgroundColor: config.selectedColor,
        color: '#ffffff',
        fontWeight: 'bold'
      };
    }

    return base;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: config.backgroundColor, minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: config.textColor }}>Gra Wykreślanka</h1>

        {saveStatus && (
          <div style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: saveStatus.includes('✓') ? '#10b981' : saveStatus.includes('✗') ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '6px',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            {saveStatus}
          </div>
        )}

        {gameWon && (
          <div style={{ 
            backgroundColor: config.foundColor, 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            <div><Check size={40} style={{ marginBottom: '10px', display: 'inline-block'}} /> Gratulacje! Znalazłeś wszystkie słowa!</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4576ffff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {showConfig ? 'Ukryj konfigurację' : 'Pokaż konfigurację'}
          </button>

          <button 
            onClick={saveGameState}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={20} />
            Zapisz grę
          </button>

          <button 
            onClick={loadGameState}
            style={{
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Upload size={20} />
            Wczytaj grę
          </button>
        </div>

        {showConfig && (
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            color: '#111827',
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Kolor komórek:
              </label>
              <input 
                type="color" 
                value={config.cellColor}
                onChange={(e) => setConfig({...config, cellColor: e.target.value})}
                style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Kolor zaznaczenia:
              </label>
              <input 
                type="color" 
                value={config.selectedColor}
                onChange={(e) => setConfig({...config, selectedColor: e.target.value})}
                style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Kolor znalezionych:
              </label>
              <input 
                type="color" 
                value={config.foundColor}
                onChange={(e) => setConfig({...config, foundColor: e.target.value})}
                style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
          <div>
            <h2 style={{ color: config.textColor }}>Plansza</h2>
            <div 
              style={{ 
                display: 'inline-grid',
                gridTemplateColumns: `repeat(${config.gridSize}, 40px)`,
                gap: '3px',
                backgroundColor: '#ddd',
                padding: '2px',
                borderRadius: '8px'
              }}
              onMouseLeave={() => {
                if (isSelecting) {
                  handleMouseUp();
                }
              }}
            >
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={getCellKey(rowIndex, colIndex)}
                    style={getCellStyle(rowIndex, colIndex)}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {cell}
                  </div>
                ))
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: config.textColor }}>Słowa do znalezienia</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {dictionary.map((word, index) => (
                <li 
                  key={index}
                  style={{
                    padding: '10px',
                    marginBottom: '8px',
                    backgroundColor: foundWords.includes(word) ? config.foundColor : '#f3f4f6',
                    color: foundWords.includes(word) ? 'white' : config.textColor,
                    borderRadius: '6px',
                    textDecoration: foundWords.includes(word) ? 'line-through' : 'none',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {foundWords.includes(word) && <Check size={20} />}
                  {word}
                </li>
              ))}
            </ul>

            <div style={{ 
              marginBottom: '8px', 
              padding: '15px', 
              backgroundColor: '#e0e7ff', 
              borderRadius: '6px',
              color: '#1e40af'
            }}>
              <strong>Znaleziono: {foundWords.length} / {dictionary.length}</strong>
            </div>
            
            <button 
              onClick={resetGame}
              style={{
                padding: '15px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%'
              }}
            >
              <RotateCcw size={20} />
              Nowa gra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearchGame;