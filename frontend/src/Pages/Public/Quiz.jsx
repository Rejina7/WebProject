import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiCall from "../../Utils/api";
import "../../css/quiz.css";

const quizData = {
  Science: [
    {
      id: 1,
      question: "What is the chemical symbol for Gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
    },
    {
      id: 2,
      question: "What is the smallest planet in our solar system?",
      options: ["Venus", "Mercury", "Mars", "Earth"],
      correct: 1,
    },
    {
      id: 3,
      question: "How many bones are in the human body?",
      options: ["186", "206", "226", "246"],
      correct: 1,
    },
    {
      id: 4,
      question: "What is the speed of light?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "100,000 km/s"],
      correct: 0,
    },
    {
      id: 5,
      question: "What gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correct: 2,
    },
    {
      id: 6,
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correct: 2,
    },
    {
      id: 7,
      question: "How many chambers does the human heart have?",
      options: ["2", "3", "4", "5"],
      correct: 2,
    },
    {
      id: 8,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
      correct: 2,
    },
    {
      id: 9,
      question: "What planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
    },
    {
      id: 10,
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "O2", "H2O2"],
      correct: 0,
    },
    {
      id: 11,
      question: "How long does it take for light from the Sun to reach Earth?",
      options: ["8 minutes", "8 seconds", "8 hours", "8 days"],
      correct: 0,
    },
    {
      id: 12,
      question: "What is the most abundant element in the universe?",
      options: ["Oxygen", "Carbon", "Hydrogen", "Helium"],
      correct: 2,
    },
    {
      id: 13,
      question: "What force keeps us on the ground?",
      options: ["Magnetism", "Gravity", "Friction", "Inertia"],
      correct: 1,
    },
    {
      id: 14,
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Brain", "Liver", "Skin"],
      correct: 3,
    },
    {
      id: 15,
      question: "What is the boiling point of water at sea level?",
      options: ["90°C", "100°C", "110°C", "120°C"],
      correct: 1,
    },
  ],
  IT: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
      correct: 0,
    },
    {
      id: 2,
      question: "Which language is known as the language of the web?",
      options: ["Python", "JavaScript", "Java", "C++"],
      correct: 1,
    },
    {
      id: 3,
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      correct: 1,
    },
    {
      id: 4,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correct: 2,
    },
    {
      id: 5,
      question: "What does API stand for?",
      options: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Programming Interface"],
      correct: 0,
    },
    {
      id: 6,
      question: "Which database is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      correct: 2,
    },
    {
      id: 7,
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
      correct: 0,
    },
    {
      id: 8,
      question: "Which protocol is used for secure web browsing?",
      options: ["HTTP", "FTP", "HTTPS", "SMTP"],
      correct: 2,
    },
    {
      id: 9,
      question: "What is the default port for HTTP?",
      options: ["21", "22", "80", "443"],
      correct: 2,
    },
    {
      id: 10,
      question: "What does RAM stand for?",
      options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Real Access Memory"],
      correct: 0,
    },
    {
      id: 11,
      question: "Which programming language is known for AI and Machine Learning?",
      options: ["Java", "Python", "C#", "Ruby"],
      correct: 1,
    },
    {
      id: 12,
      question: "What does JSON stand for?",
      options: ["JavaScript Object Notation", "Java Source Object Notation", "JavaScript Oriented Notation", "Java Standard Object Notation"],
      correct: 0,
    },
    {
      id: 13,
      question: "Which company developed JavaScript?",
      options: ["Microsoft", "Netscape", "Google", "Apple"],
      correct: 1,
    },
    {
      id: 14,
      question: "What is the purpose of Git?",
      options: ["Database Management", "Version Control", "Web Hosting", "Code Compilation"],
      correct: 1,
    },
    {
      id: 15,
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"],
      correct: 0,
    },
  ],
  Geography: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
    },
    {
      id: 2,
      question: "Which is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      correct: 1,
    },
    {
      id: 3,
      question: "What is the largest country by area?",
      options: ["Canada", "Russia", "United States", "China"],
      correct: 1,
    },
    {
      id: 4,
      question: "Which continent is the largest?",
      options: ["Africa", "Europe", "Asia", "North America"],
      correct: 2,
    },
    {
      id: 5,
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correct: 1,
    },
    {
      id: 6,
      question: "Which ocean is the largest?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correct: 3,
    },
    {
      id: 7,
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correct: 2,
    },
    {
      id: 8,
      question: "Which desert is the largest in the world?",
      options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
      correct: 3,
    },
    {
      id: 9,
      question: "What is the tallest mountain in the world?",
      options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
      correct: 1,
    },
    {
      id: 10,
      question: "Which country has the most population?",
      options: ["United States", "Indonesia", "India", "China"],
      correct: 2,
    },
    {
      id: 11,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      correct: 2,
    },
    {
      id: 12,
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "South Korea", "Japan", "Thailand"],
      correct: 2,
    },
    {
      id: 13,
      question: "What is the largest island in the world?",
      options: ["Madagascar", "Greenland", "New Guinea", "Borneo"],
      correct: 1,
    },
    {
      id: 14,
      question: "Which river flows through Egypt?",
      options: ["Amazon", "Nile", "Tigris", "Euphrates"],
      correct: 1,
    },
    {
      id: 15,
      question: "What is the capital of Canada?",
      options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
      correct: 3,
    },
  ],
  "Stranger Things": [
    {
      id: 1,
      question: "In which year does the first season of Stranger Things take place?",
      options: ["1982", "1983", "1984", "1985"],
      correct: 1,
    },
    {
      id: 2,
      question: "What is the name of the alternate dimension in Stranger Things?",
      options: ["The Void", "The Upside Down", "The Shadow Realm", "The Dark World"],
      correct: 1,
    },
    {
      id: 3,
      question: "Who is the main protagonist of Stranger Things?",
      options: ["Mike Wheeler", "Eleven", "Dustin Henderson", "Lucas Sinclair"],
      correct: 1,
    },
    {
      id: 4,
      question: "What does Eleven use her powers for primarily?",
      options: ["Teleportation", "Telekinesis", "Mind reading", "Super strength"],
      correct: 1,
    },
    {
      id: 5,
      question: "In what town does Stranger Things take place?",
      options: ["Hawkins", "Roanoke", "Derry", "Castle Rock"],
      correct: 0,
    },
    {
      id: 6,
      question: "What is the name of the monster in the first season?",
      options: ["The Demogorgon", "The Demodog", "The Shadow", "The Creature"],
      correct: 0,
    },
    {
      id: 7,
      question: "Which character has telekinetic powers and can speak through lights?",
      options: ["Max Mayfield", "Eleven", "Mike Wheeler", "Dustin Henderson"],
      correct: 1,
    },
    {
      id: 8,
      question: "What is Joyce Byers' job in the series?",
      options: ["Waitress", "Nurse", "Teacher", "Manager at a diner"],
      correct: 0,
    },
    {
      id: 9,
      question: "What does the Demogorgon feed on?",
      options: ["Animals", "Humans", "Energy", "Both animals and humans"],
      correct: 3,
    },
    {
      id: 10,
      question: "Who is Eleven's adoptive sister introduced in Season 2?",
      options: ["Max Mayfield", "Robin Buckley", "Kali", "Heather Holloway"],
      correct: 2,
    },
    {
      id: 11,
      question: "What is the name of the high school in Hawkins?",
      options: ["Hawkins High School", "Hawkins Central High", "Roane High School", "Riverdale High"],
      correct: 0,
    },
    {
      id: 12,
      question: "In Season 3, where do the kids work during summer?",
      options: ["Movie theater", "Ice cream shop", "Arcade", "Amusement park"],
      correct: 1,
    },
    {
      id: 13,
      question: "What is the Russian project called in Season 3?",
      options: ["Project Mind", "Mind Flayer", "Hawkins Lab", "Project Intrusion"],
      correct: 3,
    },
    {
      id: 14,
      question: "Who is Max's older brother?",
      options: ["Billy Hargrove", "Jason Carver", "Tommy H.", "Tyler"],
      correct: 0,
    },
    {
      id: 15,
      question: "What year does Season 4 take place in?",
      options: ["1985", "1986", "1987", "1988"],
      correct: 2,
    },
  ],
  Entertainment: [
    {
      id: 1,
      question: "Which movie features the line 'You can't handle the truth!'?",
      options: ["A Few Good Men", "Top Gun", "Jerry Maguire", "Scream"],
      correct: 0,
    },
    {
      id: 2,
      question: "What is Forrest Gump's favorite snack?",
      options: ["Chocolates", "Pizza", "Popcorn", "Ice cream"],
      correct: 0,
    },
    {
      id: 3,
      question: "In The Office, what is Jim's favorite prank?",
      options: ["Calling him 'Dwight'", "Putting his stapler in Jello", "Copying his outfit", "Stapler in aspic"],
      correct: 1,
    },
    {
      id: 4,
      question: "What is the name of the cafe in Friends?",
      options: ["The Coffee House", "Central Perk", "Java Junction", "Friends Cafe"],
      correct: 1,
    },
    {
      id: 5,
      question: "How many Infinity Stones are there in the MCU?",
      options: ["4", "5", "6", "7"],
      correct: 2,
    },
    {
      id: 6,
      question: "What superhero wears red and blue?",
      options: ["Superman", "Spider-Man", "Flash", "Captain America"],
      correct: 1,
    },
    {
      id: 7,
      question: "In which movie does Ryan Gosling not speak for 16 minutes?",
      options: ["La La Land", "Drive", "Crazy, Stupid, Love", "The Notebook"],
      correct: 1,
    },
    {
      id: 8,
      question: "What is the most watched TV show of all time?",
      options: ["Game of Thrones", "The Office", "Friends", "Breaking Bad"],
      correct: 2,
    },
    {
      id: 9,
      question: "Which actor played Iron Man?",
      options: ["Chris Evans", "Robert Downey Jr.", "Tom Hardy", "Mark Ruffalo"],
      correct: 1,
    },
    {
      id: 10,
      question: "What is Deadpool known for?",
      options: ["Being serious", "Sarcasm and jokes", "Long monologues", "Silence"],
      correct: 1,
    },
    {
      id: 11,
      question: "In Harry Potter, what is Dumbledore's weakness?",
      options: ["Magic", "Wizards", "Candy", "Youth"],
      correct: 2,
    },
    {
      id: 12,
      question: "What did Chandler do for a living in Friends?",
      options: ["Architect", "Statistical analysis", "Chef", "Furniture sales"],
      correct: 1,
    },
    {
      id: 13,
      question: "Which movie has the catchphrase 'Why so serious'?",
      options: ["Batman Begins", "The Dark Knight", "The Dark Knight Rises", "Batman v Superman"],
      correct: 1,
    },
    {
      id: 14,
      question: "What is the most expensive movie ever made?",
      options: ["Avatar 2", "Pirates of the Caribbean 3", "Avengers Endgame", "Star Wars Episode VII"],
      correct: 0,
    },
    {
      id: 15,
      question: "In The Big Bang Theory, what is Sheldon's favorite number?",
      options: ["7", "42", "73", "12"],
      correct: 2,
    },
  ],
};

export default function Quiz() {
  const { category } = useParams();
  const navigate = useNavigate();
  
  // Decode category name and find matching quiz data
  const decodedCategory = decodeURIComponent(category);
  
  // Function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to shuffle questions and their options
  const prepareQuestions = () => {
    const originalQuestions = quizData[decodedCategory] || quizData.Science;
    // Shuffle the questions array
    const shuffledQuestions = shuffleArray(originalQuestions);
    
    // For each question, shuffle the options but track correct answer
    return shuffledQuestions.map(q => {
      const optionsWithIndex = q.options.map((opt, idx) => ({
        text: opt,
        originalIndex: idx
      }));
      const shuffledOptions = shuffleArray(optionsWithIndex);
      
      // Find new index of correct answer
      const correctAnswerNewIndex = shuffledOptions.findIndex(opt => opt.originalIndex === q.correct);
      
      return {
        ...q,
        options: shuffledOptions.map(opt => opt.text),
        correctAnswer: correctAnswerNewIndex
      };
    });
  };
  
  const questions = useMemo(() => prepareQuestions(), [decodedCategory]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const bgMusicRef = useRef(null);
  const [emojiReaction, setEmojiReaction] = useState(null);

  const question = questions[currentQuestion];

  // Function to stop music immediately
  const stopMusic = () => {
    console.log('stopMusic called - stopping all audio');
    
    // Stop all audio elements on the page
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.remove();
        console.log('Removed audio element');
      } catch (e) {
        console.log('Error removing audio:', e.message);
      }
    });
    
    // Specifically stop Stranger Things audio by ID
    const strangerThingsAudio = document.getElementById('stranger-things-audio');
    if (strangerThingsAudio) {
      try {
        strangerThingsAudio.pause();
        strangerThingsAudio.currentTime = 0;
        strangerThingsAudio.src = '';
        strangerThingsAudio.remove();
        console.log('Explicitly stopped Stranger Things audio');
      } catch (e) {
        console.log('Error stopping Stranger Things audio:', e);
      }
    }
    
    // Stop bgMusicRef audio
    if (bgMusicRef.current) {
      try {
        // Stop audio element (Stranger Things)
        if (bgMusicRef.current.audioElement) {
          const audio = bgMusicRef.current.audioElement;
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
          audio.remove();
          console.log('Stopped and removed bgMusicRef audio element');
        }
        
        // Stop oscillators (fallback for Stranger Things or other quizzes)
        const { oscillator, oscillator1, oscillator2, oscillator3, oscillator4, gainNode, audioContext } = bgMusicRef.current;
        
        if (gainNode && audioContext) {
          try {
            // Immediately set gain to 0
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            
            // Stop all oscillators immediately
            try {
              if (oscillator) oscillator.stop();
              if (oscillator1) oscillator1.stop();
              if (oscillator2) oscillator2.stop();
              if (oscillator3) oscillator3.stop();
              if (oscillator4) oscillator4.stop();
              console.log('Oscillators stopped');
            } catch (e) {
              console.log('Oscillators already stopped');
            }
            
            // Close audio context
            if (audioContext.state !== 'closed') {
              audioContext.close();
              console.log('AudioContext closed');
            }
          } catch (e) {
            console.log('Error with audioContext:', e);
          }
        }
        
        bgMusicRef.current = null;
        console.log('All music stopped successfully');
      } catch (e) {
        console.error('Error in stopMusic:', e);
      }
    }
    
    // Clear global audio context
    if (window.audioContextInstance && window.audioContextInstance.state !== 'closed') {
      try {
        window.audioContextInstance.close();
        console.log('Global AudioContext closed');
      } catch (e) {
        console.log('Error closing global AudioContext:', e);
      }
    }
    window.audioContextInstance = null;
  };

  // Background music - starts when quiz begins
  useEffect(() => {
    const startBackgroundMusic = () => {
      // Check if this is Stranger Things quiz
      if (decodedCategory === "Stranger Things") {
        // Use Web Audio API synth instead of HTML5 audio for better control
        // This ensures it stops properly like other quizzes
        playStrangerThingsTheme();
        console.log('Started Stranger Things theme (Web Audio API)');
        return;
      }

      // Default ambient music for other categories
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume();
      
      // Store in window for Homepage to access
      window.audioContextInstance = audioContext;

      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      const oscillator4 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator3.connect(gainNode);
      oscillator4.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Relaxing ambient music - lower, calming frequencies
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      oscillator3.type = 'sine';
      oscillator4.type = 'triangle';
      
      // Pentatonic scale for relaxing sound (C-D-E-G-A)
      oscillator1.frequency.setValueAtTime(130.81, audioContext.currentTime); // C3
      oscillator2.frequency.setValueAtTime(164.81, audioContext.currentTime); // E3
      oscillator3.frequency.setValueAtTime(196.00, audioContext.currentTime); // G3
      oscillator4.frequency.setValueAtTime(220.00, audioContext.currentTime); // A3
      
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime); // Very soft volume

      oscillator1.start();
      oscillator2.start();
      oscillator3.start();
      oscillator4.start();

      bgMusicRef.current = { oscillator1, oscillator2, oscillator3, oscillator4, gainNode, audioContext };
    };

    const playStrangerThingsTheme = () => {
      // Stranger Things theme-inspired synth
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume();
      
      // Store in window for Homepage to access
      window.audioContextInstance = audioContext;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start();

      bgMusicRef.current = { oscillator, gainNode, audioContext };
    };

    startBackgroundMusic();

    return () => {
      if (bgMusicRef.current) {
        try {
          // Check if it's an audio element (Stranger Things)
          if (bgMusicRef.current.audioElement) {
            bgMusicRef.current.audioElement.pause();
            bgMusicRef.current.audioElement.currentTime = 0;
            bgMusicRef.current.audioElement.src = '';
            bgMusicRef.current.audioElement = null;
          } else {
            // Otherwise it's Web Audio API oscillators
            const { oscillator1, oscillator2, oscillator3, oscillator4, gainNode, audioContext } = bgMusicRef.current;
            
            if (gainNode && audioContext) {
              // Fade out the volume
              gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
              
              // Stop oscillators
              setTimeout(() => {
                try {
                  oscillator1 && oscillator1.stop();
                  oscillator2 && oscillator2.stop();
                  oscillator3 && oscillator3.stop();
                  oscillator4 && oscillator4.stop();
                } catch (e) {
                  console.log('Oscillator already stopped');
                }
              }, 200);
            }
          }
          
          bgMusicRef.current = null;
        } catch (e) {
          console.log('Music cleanup:', e);
        }
      }
    };
  }, [decodedCategory]);

  // Stop music when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      console.log('Component unmounting, stopping music...');
      stopMusic();
    };
  }, []);

  // Sound effects using Web Audio API
  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'correct') {
      // Celebration sound - ascending tones
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'wrong') {
      // Wrong sound - descending tone
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'warning') {
      // Warning sound - beep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    }
  };

  // Timer effect
  useEffect(() => {
    if (answered || quizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 15;
        }
        // Play warning sound and show nervous emoji when 3 seconds remain
        if (prev === 4) {
          playSound('warning');
          setEmojiReaction('😰');
          setTimeout(() => setEmojiReaction(null), 1500);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered, quizComplete]);

  const handleTimeout = () => {
    setAnswered(true);
    setShowWrong(true);
    playSound('wrong');
    setEmojiReaction('😢');
    setTimeout(() => {
      setEmojiReaction(null);
      nextQuestion();
    }, 2000);
  };

  const handleAnswer = (index) => {
    if (answered) return;

    setSelectedOption(index);
    setAnswered(true);

    if (index === question.correct) {
      setScore(score + 1);
      setShowCelebration(true);
      playSound('correct');
      setEmojiReaction('🎉');
      setTimeout(() => {
        setEmojiReaction('😄');
      }, 500);
      setTimeout(() => {
        setEmojiReaction(null);
        nextQuestion();
      }, 2500);
    } else {
      setShowWrong(true);
      playSound('wrong');
      setEmojiReaction('😢');
      setTimeout(() => {
        setEmojiReaction(null);
        nextQuestion();
      }, 2000);
    }
  };

  const nextQuestion = () => {
    setShowCelebration(false);
    setShowWrong(false);
    setSelectedOption(null);
    setTimeLeft(15);
    setAnswered(false);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = async () => {
    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      console.log("User from localStorage:", user);
      
      if (user && user.id) {
        // Get quiz ID from database (we need to find the quiz by category)
        const quizzesResponse = await apiCall("GET", "/quizzes");
        const quiz = quizzesResponse.quizzes?.find(q => q.category === decodedCategory);
        
        console.log("Found quiz:", quiz);
        console.log("Quiz category:", decodedCategory);
        
        const percentageScore = Math.round((score / questions.length) * 100);
        const isPassed = percentageScore >= 60; // Assuming 60% is passing score
        
        const submitData = {
          userId: user.id,
          quizId: quiz ? quiz.id : null,
          category: decodedCategory,
          title: `${decodedCategory} Quiz`,
          score: score * 10, // Convert to points (assuming each question is worth 10 points)
          totalQuestions: questions.length,
          correctAnswers: score,
          timeTaken: null,
          isPassed: isPassed
        };
        
        console.log("Submitting quiz result:", submitData);
        
        // Submit quiz result to backend
        const response = await apiCall("POST", "/quizzes/submit", { data: submitData });
        
        console.log("Quiz submission response:", response);
      } else {
        console.error("No user found in localStorage");
      }

      // Data is stored in backend database only, no localStorage backup needed
      
    } catch (error) {
      console.error("Error submitting quiz result:", error);
    } finally {
      // Stop music and navigate back - Homepage will fetch fresh data from backend
      stopMusic();
      // Small delay to ensure music stops before navigating
      setTimeout(() => {
        navigate("/home");
      }, 200);
    }
  };

  if (quizComplete) {
    return (
      <div className="quiz-container">
        <div className="quiz-complete">
          <h1>Quiz Complete! 🎉</h1>
          <div className="final-score">
            <h2>Your Score</h2>
            <div className="score-display">{score}/{questions.length}</div>
            <p className="percentage">{Math.round((score / questions.length) * 100)}%</p>
          </div>
          <button className="restart-btn" onClick={restartQuiz}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Confetti Animation */}
      {showCelebration && <div className="confetti"></div>}
      {showWrong && <div className="wrong-animation"></div>}
      
      {/* Emoji Reactions */}
      {emojiReaction && (
        <div className="emoji-reaction" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '5rem',
          zIndex: 1001
        }}>
          {emojiReaction}
        </div>
      )}

      <div className="quiz-header">
        <h2 
          onClick={() => {
            // Stop music before navigating
            if (bgMusicRef.current) {
              try {
                const { oscillator1, oscillator2, oscillator3, oscillator4, gainNode } = bgMusicRef.current;
                gainNode.gain.setValueAtTime(0, 0);
                oscillator1.stop();
                oscillator2.stop();
                oscillator3.stop();
                oscillator4.stop();
                bgMusicRef.current = null;
              } catch (e) {
                console.log('Stop music:', e);
              }
            }
            stopMusic();
            navigate("/home");
          }} 
          style={{ cursor: 'pointer' }}
        >
          {decodedCategory} Quiz
        </h2>
        <div className="quiz-progress">
          Question {currentQuestion + 1}/{questions.length}
        </div>
      </div>

      <div className="quiz-content">
        {/* Timer */}
        <div className={`timer ${timeLeft <= 5 ? "warning" : ""}`}>
          <div className="timer-circle">
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Question */}
        <div className="question-box">
          <h3>{question.question}</h3>
        </div>

        {/* Options */}
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedOption === index
                  ? index === question.correct
                    ? "correct"
                    : "incorrect"
                  : ""
              } ${answered && index === question.correct ? "show-correct" : ""}`}
              onClick={() => handleAnswer(index)}
              disabled={answered}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {/* Score Bar */}
        <div className="score-bar">
          <span>Score: {score}/{questions.length}</span>
        </div>
      </div>
    </div>
  );
}
