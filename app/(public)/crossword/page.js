'use client';

import React, { useState, useEffect } from 'react';
import { Check, RotateCcw } from 'lucide-react';

const WordSearchGame = () => {
  // Konfiguracja gry
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

  const [config, setConfig] = useState(defaultConfig);
  const [showConfig, setShowConfig] = useState(false);

  // Słownik słów do znalezienia
  const dictionary = ['REACT', 'JAVASCRIPT', 'HTML', 'CSS', 'NODE', "PYTHON"];
  
  // Przechowywanie pozycji słów
  const [wordPositions, setWordPositions] = useState([]);

  // Generowanie planszy
  const generateGrid = () => {
    const size = config.gridSize;
    let attempts = 0;
    let grid;
    let positions;
    
    // Próbuj generować planszę aż wszystkie słowa zostaną umieszczone
    while (attempts < 50) {
      grid = Array(size).fill(null).map(() => 
        Array(size).fill(null).map(() => '_')
      );
      
      positions = [];
      let allPlaced = true;

      // Umieszczanie słów na planszy
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
        // Wypełnij puste miejsca losowymi literami
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
    
    // Jeśli nie udało się wygenerować, zwróć pustą siatkę
    console.error('Nie udało się wygenerować planszy');
    return Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );
  };

  const canPlaceWord = (grid, word, row, col, direction, size) => {
    const directions = [
      [0, 1],   // prawo
      [1, 0],   // dół
      [1, 1],   // przekątna prawo-dół
      [-1, 1],  // przekątna prawo-góra
      [0, -1],  // lewo
      [-1, 0],  // góra
      [-1, -1], // przekątna lewo-góra
      [1, -1]   // przekątna lewo-dół
    ];

    const [dRow, dCol] = directions[direction];
    
    // Sprawdź czy słowo mieści się w siatce
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (dRow * i);
      const newCol = col + (dCol * i);
      
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        return false;
      }
      
      // Sprawdź czy komórka jest pusta lub zawiera tę samą literę
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
    
    return {
      word,
      positions,
      direction
    };
  };

  const [grid, setGrid] = useState(() => generateGrid());
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (foundWords.length === dictionary.length) {
      setGameWon(true);
    }
  }, [foundWords]);

  const getCellKey = (row, col) => `${row}-${col}`;

  const handleMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row, col) => {
    if (!isSelecting) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    // Sprawdź czy ruch jest w linii prostej
    if (isInLine(selectedCells[0], { row, col })) {
      // Dodaj wszystkie komórki między pierwszą a obecną
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

    // Sprawdź czy zaznaczone litery tworzą słowo
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
      // Sprawdź wszystkie możliwe pozycje słowa na planszy
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
    setGrid(generateGrid());
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

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
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

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
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