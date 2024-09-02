import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, Pressable } from 'react-native';
import Snackbar from 'react-native-snackbar';
import Icons from './components/icons';
import React, { useState, useEffect } from 'react';
import Sound from 'react-native-sound';

// Initialize sounds
const winSound = new Sound(require('../assets/win.mp3'), (error) => {
  if (error) console.log('Failed to load the win sound', error);
});

const drawSound = new Sound(require('../assets/draw.mp3'), (error) => {
  if (error) console.log('Failed to load the draw sound', error);
});

// Utility function to play sound
const playSound = (sound: Sound) => {
  sound.play((success) => {
    if (!success) {
      console.log('Sound playback failed');
    }
  });
};

export default function App(): JSX.Element {
  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string>('');
  const [gameState, setGameState] = useState<string[]>(new Array(9).fill('empty', 0, 9));

  const reloadGame = () => {
    setIsCross(false);
    setGameWinner('');
    setGameState(new Array(9).fill('empty', 0, 9));
  };

  useEffect(() => {
    checkIsWinner();
  }, [gameState]);

  const checkIsWinner = () => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (gameState[a] === gameState[b] && gameState[a] === gameState[c] && gameState[a] !== 'empty') {
        setGameWinner(`${gameState[a]} won the game!`);
        playSound(winSound);
        return;
      }
    }

    if (!gameState.includes('empty')) {
      setGameWinner('It\'s a draw! ⏳');
      playSound(drawSound);
    }
  };

  const onChangeIcon = (itemNumber: number) => {
    if (gameWinner) {
      return Snackbar.show({
        text: gameWinner,
        backgroundColor: '#000000',
        textColor: '#ffffff',
      });
    }

    if (gameState[itemNumber] === 'empty') {
      const newGameState = [...gameState];
      newGameState[itemNumber] = isCross ? 'cross' : 'circle';
      setGameState(newGameState);
      setIsCross(!isCross);
      checkIsWinner();
    } else {
      Snackbar.show({
        text: 'Cell is already occupied!',
        backgroundColor: 'red',
        textColor: '#fff',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"#2C3335"} />
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>❌ Tic Tac Toe ⭕</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.turnText}>
          {gameWinner ? gameWinner : `Player ${isCross ? '❌' : '⭕'}'s Turn`}
        </Text>
      </View>
      <View style={styles.boardContainer}>
        <FlatList
          numColumns={3}
          data={gameState}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              onPress={() => onChangeIcon(index)}
              style={[styles.cell, { backgroundColor: item !== 'empty' ? '#DAE0E2' : '#53E0BC' }]}
            >
              <Icons name={item} />
            </Pressable>
          )}
        />
      </View>
      <View style={styles.reloadContainer}>
        <Pressable style={styles.reloadButton} onPress={reloadGame}>
          <Text style={styles.reloadText}>
            {gameWinner ? 'Start New Game' : 'Reload Game'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3335",
  },
  logoContainer: {
    backgroundColor: "#1C1C1C",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  logoText: {
    color: "#FFf",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  userInfo: {
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  turnText: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "600",
  },
  boardContainer: {
    paddingVertical: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  reloadContainer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  reloadButton: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  reloadText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1C",
    letterSpacing: 1,
  }
});
