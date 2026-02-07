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
  History: [
    {
      id: 1,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
      correct: 1,
    },
    {
      id: 2,
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correct: 2,
    },
    {
      id: 3,
      question: "Who was the first woman to win a Nobel Prize?",
      options: ["Marie Curie", "Mother Teresa", "Jane Addams", "Dorothy Hodgkin"],
      correct: 0,
    },
    {
      id: 4,
      question: "What ancient wonder was located in Alexandria?",
      options: ["Hanging Gardens", "Colossus of Rhodes", "Lighthouse", "Statue of Zeus"],
      correct: 2,
    },
    {
      id: 5,
      question: "Who painted the Mona Lisa?",
      options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
      correct: 1,
    },
    {
      id: 6,
      question: "In which year did the Berlin Wall fall?",
      options: ["1987", "1988", "1989", "1990"],
      correct: 2,
    },
    {
      id: 7,
      question: "Who was the first emperor of Rome?",
      options: ["Julius Caesar", "Augustus", "Nero", "Caligula"],
      correct: 1,
    },
    {
      id: 8,
      question: "What year did Christopher Columbus reach the Americas?",
      options: ["1492", "1493", "1491", "1490"],
      correct: 0,
    },
    {
      id: 9,
      question: "Who wrote the Declaration of Independence?",
      options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "John Adams"],
      correct: 2,
    },
    {
      id: 10,
      question: "Which empire built Machu Picchu?",
      options: ["Aztec", "Maya", "Inca", "Olmec"],
      correct: 2,
    },
    {
      id: 11,
      question: "Who was the British Prime Minister during most of WWII?",
      options: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Anthony Eden"],
      correct: 1,
    },
    {
      id: 12,
      question: "In what year did the Titanic sink?",
      options: ["1910", "1911", "1912", "1913"],
      correct: 2,
    },
    {
      id: 13,
      question: "Who was the longest-reigning British monarch before Elizabeth II?",
      options: ["Victoria", "George III", "Edward VII", "George V"],
      correct: 0,
    },
    {
      id: 14,
      question: "What was the capital of the Byzantine Empire?",
      options: ["Rome", "Athens", "Constantinople", "Alexandria"],
      correct: 2,
    },
    {
      id: 15,
      question: "Who was assassinated in 1865 at Ford's Theatre?",
      options: ["Abraham Lincoln", "James Garfield", "William McKinley", "John F. Kennedy"],
      correct: 0,
    },
  ],
  Space: [
    {
      id: 1,
      question: "What is the largest planet in our solar system?",
      options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
      correct: 1,
    },
    {
      id: 2,
      question: "How many moons does Mars have?",
      options: ["1", "2", "3", "4"],
      correct: 1,
    },
    {
      id: 3,
      question: "What is the name of our galaxy?",
      options: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"],
      correct: 1,
    },
    {
      id: 4,
      question: "Who was the first human to walk on the Moon?",
      options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Alan Shepard"],
      correct: 1,
    },
    {
      id: 5,
      question: "What is the closest star to Earth?",
      options: ["Alpha Centauri", "Proxima Centauri", "The Sun", "Sirius"],
      correct: 2,
    },
    {
      id: 6,
      question: "How long does it take light from the Sun to reach Earth?",
      options: ["8 minutes", "8 seconds", "8 hours", "8 days"],
      correct: 0,
    },
    {
      id: 7,
      question: "What planet is known for its rings?",
      options: ["Jupiter", "Uranus", "Saturn", "Neptune"],
      correct: 2,
    },
    {
      id: 8,
      question: "What is a group of stars called?",
      options: ["Cluster", "Constellation", "Galaxy", "Nebula"],
      correct: 1,
    },
    {
      id: 9,
      question: "Which planet is the hottest in our solar system?",
      options: ["Mercury", "Venus", "Mars", "Jupiter"],
      correct: 1,
    },
    {
      id: 10,
      question: "What year did humans first land on the Moon?",
      options: ["1967", "1968", "1969", "1970"],
      correct: 2,
    },
    {
      id: 11,
      question: "What is the Great Red Spot on Jupiter?",
      options: ["A volcano", "A storm", "A crater", "An ocean"],
      correct: 1,
    },
    {
      id: 12,
      question: "How many planets are in our solar system?",
      options: ["7", "8", "9", "10"],
      correct: 1,
    },
    {
      id: 13,
      question: "What is the name of Mars' largest moon?",
      options: ["Phobos", "Deimos", "Titan", "Europa"],
      correct: 0,
    },
    {
      id: 14,
      question: "What is the coldest planet in our solar system?",
      options: ["Neptune", "Uranus", "Pluto", "Saturn"],
      correct: 1,
    },
    {
      id: 15,
      question: "What is the International Space Station?",
      options: ["A satellite", "A space station", "A telescope", "A rocket"],
      correct: 1,
    },
  ],
  "General Knowledge": [
    {
      id: 1,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      correct: 2,
    },
    {
      id: 2,
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
    {
      id: 3,
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correct: 1,
    },
    {
      id: 4,
      question: "What year did the internet become available to the public?",
      options: ["1989", "1991", "1993", "1995"],
      correct: 1,
    },
    {
      id: 5,
      question: "What is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      correct: 1,
    },
    {
      id: 6,
      question: "How many sides does a hexagon have?",
      options: ["5", "6", "7", "8"],
      correct: 1,
    },
    {
      id: 7,
      question: "What is the currency of Japan?",
      options: ["Yuan", "Won", "Yen", "Ringgit"],
      correct: 2,
    },
    {
      id: 8,
      question: "Who invented the telephone?",
      options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Benjamin Franklin"],
      correct: 2,
    },
    {
      id: 9,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
    },
    {
      id: 10,
      question: "How many colors are in a rainbow?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
    {
      id: 11,
      question: "What is the tallest mountain in the world?",
      options: ["K2", "Mount Everest", "Kangchenjunga", "Kilimanjaro"],
      correct: 1,
    },
    {
      id: 12,
      question: "What language is spoken in Brazil?",
      options: ["Spanish", "Portuguese", "French", "Italian"],
      correct: 1,
    },
    {
      id: 13,
      question: "How many teeth does an adult human have?",
      options: ["28", "30", "32", "34"],
      correct: 2,
    },
    {
      id: 14,
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correct: 2,
    },
    {
      id: 15,
      question: "What is the largest desert in the world?",
      options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
      correct: 3,
    },
  ],
  "Stranger Things": [
    {
      id: 1,
      question: "What is Eleven's real name?",
      options: ["Jane", "Joyce", "Jennifer", "Jessica"],
      correct: 0,
    },
    {
      id: 2,
      question: "What is the name of the alternate dimension?",
      options: ["The Shadow Realm", "The Upside Down", "The Dark Place", "The Void"],
      correct: 1,
    },
    {
      id: 3,
      question: "What game do the kids play in Mike's basement?",
      options: ["Chess", "Monopoly", "Dungeons & Dragons", "Risk"],
      correct: 2,
    },
    {
      id: 4,
      question: "What is Will's favorite song?",
      options: ["Should I Stay or Should I Go", "Every Breath You Take", "Africa", "Take On Me"],
      correct: 0,
    },
    {
      id: 5,
      question: "Where does the show take place?",
      options: ["Hawkins, Indiana", "Hawkins, Illinois", "Riverside, Indiana", "Greendale, Indiana"],
      correct: 0,
    },
    {
      id: 6,
      question: "What is the name of Steve's workplace in Season 3?",
      options: ["Starcourt Mall", "Scoops Ahoy", "Family Video", "The Arcade"],
      correct: 1,
    },
    {
      id: 7,
      question: "Who is Eleven's 'Papa'?",
      options: ["Dr. Brenner", "Jim Hopper", "Dr. Owens", "Lonnie Byers"],
      correct: 0,
    },
    {
      id: 8,
      question: "What year does Season 1 take place?",
      options: ["1982", "1983", "1984", "1985"],
      correct: 1,
    },
    {
      id: 9,
      question: "What is the name of Dustin's girlfriend?",
      options: ["Sally", "Suzie", "Sarah", "Stacy"],
      correct: 1,
    },
    {
      id: 10,
      question: "What company does Joyce work for in Season 1?",
      options: ["Melvald's", "RadioShack", "Hawkins Lab", "Bradley's"],
      correct: 0,
    },
    {
      id: 11,
      question: "What are Eleven's favorite foods?",
      options: ["Pizza and Ice Cream", "Burgers and Fries", "Eggos and Candy", "Donuts and Coffee"],
      correct: 2,
    },
    {
      id: 12,
      question: "What is Max's last name?",
      options: ["Miller", "Mayfield", "Martin", "Morrison"],
      correct: 1,
    },
    {
      id: 13,
      question: "What creature attacks Barb at Steve's pool?",
      options: ["The Mind Flayer", "The Demogorgon", "A Demodog", "The Shadow Monster"],
      correct: 1,
    },
    {
      id: 14,
      question: "What is Bob Newby's nickname?",
      options: ["Bob the Builder", "Brave Bob", "Bob the Brain", "Bob the Superhero"],
      correct: 2,
    },
    {
      id: 15,
      question: "What mall does Season 3 revolve around?",
      options: ["Riverside Mall", "Starcourt Mall", "Hawkins Plaza", "The Marketplace"],
      correct: 1,
    },
  ],
  Math: [
    {
      id: 1,
      question: "What is 12 x 12?",
      options: ["124", "144", "154", "164"],
      correct: 1,
    },
    {
      id: 2,
      question: "What is the value of Pi (approximately)?",
      options: ["3.14", "3.41", "2.14", "4.13"],
      correct: 0,
    },
    {
      id: 3,
      question: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
      correct: 2,
    },
    {
      id: 4,
      question: "What is 15% of 200?",
      options: ["20", "25", "30", "35"],
      correct: 2,
    },
    {
      id: 5,
      question: "What is the sum of angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correct: 1,
    },
    {
      id: 6,
      question: "What is 7^2?",
      options: ["14", "21", "49", "56"],
      correct: 2,
    },
    {
      id: 7,
      question: "What is the next prime number after 7?",
      options: ["8", "9", "10", "11"],
      correct: 3,
    },
    {
      id: 8,
      question: "What is 1/4 as a decimal?",
      options: ["0.25", "0.5", "0.75", "1.0"],
      correct: 0,
    },
    {
      id: 9,
      question: "How many edges does a cube have?",
      options: ["6", "8", "10", "12"],
      correct: 3,
    },
    {
      id: 10,
      question: "What is 9 x 8?",
      options: ["63", "72", "81", "90"],
      correct: 1,
    },
    {
      id: 11,
      question: "What is the area of a square with side length 5?",
      options: ["10", "20", "25", "50"],
      correct: 2,
    },
    {
      id: 12,
      question: "What is 100 ÷ 4?",
      options: ["20", "25", "30", "35"],
      correct: 1,
    },
    {
      id: 13,
      question: "What is the perimeter of a rectangle with length 8 and width 3?",
      options: ["11", "16", "22", "24"],
      correct: 2,
    },
    {
      id: 14,
      question: "What is 2^5?",
      options: ["10", "16", "32", "64"],
      correct: 2,
    },
    {
      id: 15,
      question: "What is the least common multiple of 4 and 6?",
      options: ["8", "10", "12", "24"],
      correct: 2,
    },
  ],
  Sports: [
    {
      id: 1,
      question: "How many players are on a soccer team?",
      options: ["9", "10", "11", "12"],
      correct: 2,
    },
    {
      id: 2,
      question: "What sport is known as 'The Beautiful Game'?",
      options: ["Basketball", "Soccer", "Tennis", "Baseball"],
      correct: 1,
    },
    {
      id: 3,
      question: "How many points is a touchdown worth in American football?",
      options: ["3", "6", "7", "8"],
      correct: 1,
    },
    {
      id: 4,
      question: "Which country won the FIFA World Cup in 2018?",
      options: ["Brazil", "Germany", "France", "Argentina"],
      correct: 2,
    },
    {
      id: 5,
      question: "How many rings on the Olympic flag?",
      options: ["4", "5", "6", "7"],
      correct: 1,
    },
    {
      id: 6,
      question: "What is the national sport of Canada?",
      options: ["Ice Hockey", "Lacrosse", "Baseball", "Basketball"],
      correct: 1,
    },
    {
      id: 7,
      question: "In tennis, what is a score of zero called?",
      options: ["Nil", "Love", "Zero", "Duck"],
      correct: 1,
    },
    {
      id: 8,
      question: "How long is a marathon?",
      options: ["26.2 miles", "24.2 miles", "28.2 miles", "30 miles"],
      correct: 0,
    },
    {
      id: 9,
      question: "What sport does Serena Williams play?",
      options: ["Golf", "Tennis", "Badminton", "Volleyball"],
      correct: 1,
    },
    {
      id: 10,
      question: "Which NBA team has won the most championships?",
      options: ["Lakers", "Bulls", "Celtics", "Warriors"],
      correct: 2,
    },
    {
      id: 11,
      question: "What is the diameter of a basketball hoop in inches?",
      options: ["16", "18", "20", "22"],
      correct: 1,
    },
    {
      id: 12,
      question: "Which country hosted the 2016 Summer Olympics?",
      options: ["China", "UK", "Brazil", "Russia"],
      correct: 2,
    },
    {
      id: 13,
      question: "In golf, what is one stroke under par called?",
      options: ["Eagle", "Birdie", "Bogey", "Albatross"],
      correct: 1,
    },
    {
      id: 14,
      question: "How many players are on a basketball team on the court?",
      options: ["4", "5", "6", "7"],
      correct: 1,
    },
    {
      id: 15,
      question: "Who is known as 'The Greatest' in boxing?",
      options: ["Mike Tyson", "Floyd Mayweather", "Muhammad Ali", "Joe Frazier"],
      correct: 2,
    },
  ],
  Music: [
    {
      id: 1,
      question: "Who is known as the 'King of Pop'?",
      options: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"],
      correct: 1,
    },
    {
      id: 2,
      question: "What instrument has 88 keys?",
      options: ["Guitar", "Violin", "Piano", "Organ"],
      correct: 2,
    },
    {
      id: 3,
      question: "Which band wrote 'Bohemian Rhapsody'?",
      options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"],
      correct: 2,
    },
    {
      id: 4,
      question: "How many strings does a standard guitar have?",
      options: ["4", "5", "6", "7"],
      correct: 2,
    },
    {
      id: 5,
      question: "Who sang 'Purple Rain'?",
      options: ["David Bowie", "Prince", "George Michael", "Elton John"],
      correct: 1,
    },
    {
      id: 6,
      question: "What is the highest female singing voice?",
      options: ["Alto", "Mezzo-soprano", "Soprano", "Contralto"],
      correct: 2,
    },
    {
      id: 7,
      question: "Which classical composer was deaf?",
      options: ["Mozart", "Bach", "Beethoven", "Chopin"],
      correct: 2,
    },
    {
      id: 8,
      question: "What year did The Beatles break up?",
      options: ["1968", "1969", "1970", "1971"],
      correct: 2,
    },
    {
      id: 9,
      question: "Who is the lead singer of U2?",
      options: ["Bono", "The Edge", "Sting", "John Lennon"],
      correct: 0,
    },
    {
      id: 10,
      question: "What is the term for a group of four musicians?",
      options: ["Trio", "Quartet", "Quintet", "Ensemble"],
      correct: 1,
    },
    {
      id: 11,
      question: "Which instrument is Yo-Yo Ma famous for playing?",
      options: ["Violin", "Piano", "Cello", "Flute"],
      correct: 2,
    },
    {
      id: 12,
      question: "What does 'forte' mean in music?",
      options: ["Soft", "Loud", "Fast", "Slow"],
      correct: 1,
    },
    {
      id: 13,
      question: "Who wrote the Four Seasons?",
      options: ["Mozart", "Vivaldi", "Bach", "Handel"],
      correct: 1,
    },
    {
      id: 14,
      question: "What is the lowest male singing voice?",
      options: ["Tenor", "Baritone", "Bass", "Alto"],
      correct: 2,
    },
    {
      id: 15,
      question: "Which music streaming service was launched first?",
      options: ["Apple Music", "Spotify", "Tidal", "Pandora"],
      correct: 3,
    },
  ],
  Art: [
    {
      id: 1,
      question: "Who painted the Sistine Chapel ceiling?",
      options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
      correct: 1,
    },
    {
      id: 2,
      question: "What art movement is Salvador Dalí associated with?",
      options: ["Cubism", "Impressionism", "Surrealism", "Abstract"],
      correct: 2,
    },
    {
      id: 3,
      question: "In which museum is the Mona Lisa displayed?",
      options: ["The Met", "The Louvre", "Uffizi Gallery", "Prado"],
      correct: 1,
    },
    {
      id: 4,
      question: "Who painted 'The Starry Night'?",
      options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Edvard Munch"],
      correct: 1,
    },
    {
      id: 5,
      question: "What is the primary color that is NOT red or blue?",
      options: ["Green", "Yellow", "Orange", "Purple"],
      correct: 1,
    },
    {
      id: 6,
      question: "Who sculpted 'The Thinker'?",
      options: ["Michelangelo", "Rodin", "Bernini", "Donatello"],
      correct: 1,
    },
    {
      id: 7,
      question: "What famous painting was stolen from the Louvre in 1911?",
      options: ["The Scream", "Girl with a Pearl Earring", "Mona Lisa", "The Birth of Venus"],
      correct: 2,
    },
    {
      id: 8,
      question: "Who painted 'Guernica'?",
      options: ["Salvador Dalí", "Pablo Picasso", "Joan Miró", "Henri Matisse"],
      correct: 1,
    },
    {
      id: 9,
      question: "What technique involves small dots of color?",
      options: ["Impressionism", "Pointillism", "Cubism", "Fauvism"],
      correct: 1,
    },
    {
      id: 10,
      question: "Who painted 'The Birth of Venus'?",
      options: ["Raphael", "Botticelli", "Titian", "Caravaggio"],
      correct: 1,
    },
    {
      id: 11,
      question: "What is the art of beautiful handwriting called?",
      options: ["Typography", "Calligraphy", "Penmanship", "Lettering"],
      correct: 1,
    },
    {
      id: 12,
      question: "Who painted 'The Girl with a Pearl Earring'?",
      options: ["Rembrandt", "Vermeer", "Rubens", "Van Dyck"],
      correct: 1,
    },
    {
      id: 13,
      question: "What color do you get when you mix red and yellow?",
      options: ["Purple", "Green", "Orange", "Brown"],
      correct: 2,
    },
    {
      id: 14,
      question: "What is a painting done on wet plaster called?",
      options: ["Fresco", "Mural", "Canvas", "Tempera"],
      correct: 0,
    },
    {
      id: 15,
      question: "Who painted 'The Scream'?",
      options: ["Vincent van Gogh", "Edvard Munch", "Gustav Klimt", "Egon Schiele"],
      correct: 1,
    },
  ],
  Literature: [
    {
      id: 1,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correct: 1,
    },
    {
      id: 2,
      question: "What is the first book in the Harry Potter series?",
      options: ["Chamber of Secrets", "Prisoner of Azkaban", "Philosopher's Stone", "Goblet of Fire"],
      correct: 2,
    },
    {
      id: 3,
      question: "Who wrote '1984'?",
      options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"],
      correct: 1,
    },
    {
      id: 4,
      question: "What is the name of Sherlock Holmes' assistant?",
      options: ["Dr. Watson", "Inspector Lestrade", "Mycroft", "Moriarty"],
      correct: 0,
    },
    {
      id: 5,
      question: "Who wrote 'Pride and Prejudice'?",
      options: ["Emily Brontë", "Charlotte Brontë", "Jane Austen", "George Eliot"],
      correct: 2,
    },
    {
      id: 6,
      question: "In which book would you find the character Atticus Finch?",
      options: ["The Great Gatsby", "To Kill a Mockingbird", "Of Mice and Men", "The Catcher in the Rye"],
      correct: 1,
    },
    {
      id: 7,
      question: "Who wrote 'The Great Gatsby'?",
      options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"],
      correct: 1,
    },
    {
      id: 8,
      question: "What is the name of the hobbit in 'The Lord of the Rings'?",
      options: ["Bilbo", "Frodo", "Sam", "Merry"],
      correct: 1,
    },
    {
      id: 9,
      question: "Who wrote 'Moby Dick'?",
      options: ["Mark Twain", "Herman Melville", "Nathaniel Hawthorne", "Edgar Allan Poe"],
      correct: 1,
    },
    {
      id: 10,
      question: "What dystopian novel features 'Big Brother'?",
      options: ["Brave New World", "Fahrenheit 451", "1984", "The Handmaid's Tale"],
      correct: 2,
    },
    {
      id: 11,
      question: "Who wrote 'The Catcher in the Rye'?",
      options: ["J.D. Salinger", "Jack Kerouac", "Allen Ginsberg", "William S. Burroughs"],
      correct: 0,
    },
    {
      id: 12,
      question: "What is Dr. Seuss's real name?",
      options: ["Theodore Geisel", "Theodor Seuss", "Ted Seuss", "Thomas Geisel"],
      correct: 0,
    },
    {
      id: 13,
      question: "Who wrote 'Frankenstein'?",
      options: ["Bram Stoker", "Mary Shelley", "Edgar Allan Poe", "H.P. Lovecraft"],
      correct: 1,
    },
    {
      id: 14,
      question: "In which book series would you find Katniss Everdeen?",
      options: ["Divergent", "The Maze Runner", "The Hunger Games", "Twilight"],
      correct: 2,
    },
    {
      id: 15,
      question: "Who wrote 'The Chronicles of Narnia'?",
      options: ["J.R.R. Tolkien", "C.S. Lewis", "Philip Pullman", "Roald Dahl"],
      correct: 1,
    },
  ],
  Technology: [
    {
      id: 1,
      question: "Who is the founder of Microsoft?",
      options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"],
      correct: 1,
    },
    {
      id: 2,
      question: "What does 'HTTP' stand for?",
      options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Tech Protocol", "Home Text Transfer Protocol"],
      correct: 0,
    },
    {
      id: 3,
      question: "Which company created the iPhone?",
      options: ["Samsung", "Google", "Apple", "Nokia"],
      correct: 2,
    },
    {
      id: 4,
      question: "What year was Facebook founded?",
      options: ["2003", "2004", "2005", "2006"],
      correct: 1,
    },
    {
      id: 5,
      question: "What does 'AI' stand for?",
      options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Active Intelligence"],
      correct: 1,
    },
    {
      id: 6,
      question: "Who founded Tesla Motors?",
      options: ["Elon Musk", "Jeff Bezos", "Steve Jobs", "Bill Gates"],
      correct: 0,
    },
    {
      id: 7,
      question: "What does 'VR' stand for?",
      options: ["Video Reality", "Virtual Reality", "Visual Reality", "Verified Reality"],
      correct: 1,
    },
    {
      id: 8,
      question: "Which programming language is known for web development?",
      options: ["Python", "JavaScript", "C++", "Swift"],
      correct: 1,
    },
    {
      id: 9,
      question: "What is the name of Amazon's virtual assistant?",
      options: ["Cortana", "Siri", "Alexa", "Google Assistant"],
      correct: 2,
    },
    {
      id: 10,
      question: "What does 'USB' stand for?",
      options: ["Universal Serial Bus", "Uniform System Bus", "United Serial Bus", "Universal System Bus"],
      correct: 0,
    },
    {
      id: 11,
      question: "Which company developed Android?",
      options: ["Apple", "Microsoft", "Google", "Samsung"],
      correct: 2,
    },
    {
      id: 12,
      question: "What is the main circuit board of a computer called?",
      options: ["CPU", "Motherboard", "GPU", "Hard Drive"],
      correct: 1,
    },
    {
      id: 13,
      question: "What does 'GPU' stand for?",
      options: ["General Processing Unit", "Graphics Processing Unit", "Gaming Processing Unit", "Global Processing Unit"],
      correct: 1,
    },
    {
      id: 14,
      question: "Which social media platform limits posts to 280 characters?",
      options: ["Facebook", "Instagram", "Twitter/X", "LinkedIn"],
      correct: 2,
    },
    {
      id: 15,
      question: "What is the name of Apple's operating system for Mac?",
      options: ["iOS", "Windows", "macOS", "Linux"],
      correct: 2,
    },
  ],
  Nature: [
    {
      id: 1,
      question: "What is the largest land animal?",
      options: ["Giraffe", "Elephant", "Rhino", "Hippo"],
      correct: 1,
    },
    {
      id: 2,
      question: "How many legs does a spider have?",
      options: ["6", "8", "10", "12"],
      correct: 1,
    },
    {
      id: 3,
      question: "What is the fastest land animal?",
      options: ["Lion", "Cheetah", "Leopard", "Gazelle"],
      correct: 1,
    },
    {
      id: 4,
      question: "What is the largest type of whale?",
      options: ["Humpback Whale", "Orca", "Blue Whale", "Sperm Whale"],
      correct: 2,
    },
    {
      id: 5,
      question: "What do pandas primarily eat?",
      options: ["Fish", "Bamboo", "Meat", "Fruits"],
      correct: 1,
    },
    {
      id: 6,
      question: "How many hearts does an octopus have?",
      options: ["1", "2", "3", "4"],
      correct: 2,
    },
    {
      id: 7,
      question: "What is a baby kangaroo called?",
      options: ["Cub", "Joey", "Kit", "Pup"],
      correct: 1,
    },
    {
      id: 8,
      question: "Which bird is known for its ability to mimic human speech?",
      options: ["Eagle", "Parrot", "Owl", "Crow"],
      correct: 1,
    },
    {
      id: 9,
      question: "What is the tallest tree species?",
      options: ["Oak", "Pine", "Redwood", "Sequoia"],
      correct: 3,
    },
    {
      id: 10,
      question: "How long can a snail sleep?",
      options: ["1 week", "1 month", "3 months", "3 years"],
      correct: 3,
    },
    {
      id: 11,
      question: "What is the only mammal capable of true flight?",
      options: ["Flying Squirrel", "Bat", "Sugar Glider", "Flying Lemur"],
      correct: 1,
    },
    {
      id: 12,
      question: "What is the largest species of bear?",
      options: ["Grizzly Bear", "Black Bear", "Polar Bear", "Kodiak Bear"],
      correct: 2,
    },
    {
      id: 13,
      question: "How many chambers does a human heart have?",
      options: ["2", "3", "4", "5"],
      correct: 2,
    },
    {
      id: 14,
      question: "What is the world's largest flower?",
      options: ["Sunflower", "Rafflesia", "Lotus", "Rose"],
      correct: 1,
    },
    {
      id: 15,
      question: "What type of animal is a Komodo dragon?",
      options: ["Snake", "Lizard", "Crocodile", "Dinosaur"],
      correct: 1,
    },
  ],
  Food: [
    {
      id: 1,
      question: "What is sushi traditionally wrapped in?",
      options: ["Lettuce", "Seaweed", "Rice Paper", "Banana Leaf"],
      correct: 1,
    },
    {
      id: 2,
      question: "What is the main ingredient in guacamole?",
      options: ["Tomato", "Avocado", "Lime", "Onion"],
      correct: 1,
    },
    {
      id: 3,
      question: "Which country is the origin of pizza?",
      options: ["France", "Greece", "Italy", "Spain"],
      correct: 2,
    },
    {
      id: 4,
      question: "What is the most expensive spice by weight?",
      options: ["Vanilla", "Saffron", "Cardamom", "Cinnamon"],
      correct: 1,
    },
    {
      id: 5,
      question: "What type of pasta is shaped like little ears?",
      options: ["Penne", "Fusilli", "Orecchiette", "Farfalle"],
      correct: 2,
    },
    {
      id: 6,
      question: "What is the main ingredient in hummus?",
      options: ["Lentils", "Black Beans", "Chickpeas", "Peas"],
      correct: 2,
    },
    {
      id: 7,
      question: "Which fruit has seeds on the outside?",
      options: ["Raspberry", "Strawberry", "Blackberry", "Blueberry"],
      correct: 1,
    },
    {
      id: 8,
      question: "What is the hottest part of a chili pepper?",
      options: ["Skin", "Seeds", "Flesh", "Stem"],
      correct: 1,
    },
    {
      id: 9,
      question: "What is tofu made from?",
      options: ["Rice", "Wheat", "Soy", "Corn"],
      correct: 2,
    },
    {
      id: 10,
      question: "Which nut is used to make marzipan?",
      options: ["Walnut", "Cashew", "Almond", "Peanut"],
      correct: 2,
    },
    {
      id: 11,
      question: "What is the main ingredient in traditional Japanese miso soup?",
      options: ["Seaweed", "Fish", "Soybean Paste", "Rice"],
      correct: 2,
    },
    {
      id: 12,
      question: "Which country invented ice cream?",
      options: ["Italy", "France", "China", "USA"],
      correct: 2,
    },
    {
      id: 13,
      question: "What type of food is a 'Granny Smith'?",
      options: ["Potato", "Tomato", "Apple", "Pear"],
      correct: 2,
    },
    {
      id: 14,
      question: "What is the main ingredient in a traditional Greek moussaka?",
      options: ["Potato", "Eggplant", "Zucchini", "Tomato"],
      correct: 1,
    },
    {
      id: 15,
      question: "What does 'al dente' mean when cooking pasta?",
      options: ["Very soft", "Firm to the bite", "Overcooked", "Raw"],
      correct: 1,
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
    const fallbackQuestions = quizData[decodedCategory] || quizData.Science;
    const originalQuestions = dbQuestions.length > 0 ? dbQuestions : fallbackQuestions;
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
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [dbQuestions, setDbQuestions] = useState([]);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const bgMusicRef = useRef(null);
  const [emojiReaction, setEmojiReaction] = useState(null);

  const questions = useMemo(() => prepareQuestions(), [decodedCategory, dbQuestions]);

  const question = questions[currentQuestion];

  useEffect(() => {
    let isMounted = true;

    const loadQuizId = async () => {
      try {
        const quizzesResponse = await apiCall("GET", "/quizzes");
        const quiz = quizzesResponse.quizzes?.find((q) => q.category === decodedCategory);
        if (isMounted) {
          setQuizId(quiz?.id || null);
        }
      } catch (error) {
        console.error("Error loading quiz info:", error);
      }
    };

    loadQuizId();

    return () => {
      isMounted = false;
    };
  }, [decodedCategory]);

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
      
      // Store in window for Dashboard to access
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
      
      // Store in window for Dashboard to access
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

    if (index === question.correctAnswer) {
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
        
        console.log("✅ Quiz submission response:", response);
        console.log("🎯 Quiz result saved successfully!");
        console.log("📊 Result ID:", response.result?.id);
      } else {
        console.error("❌ No user found in localStorage");
      }

      // Data is stored in backend database only, no localStorage backup needed
      
    } catch (error) {
      console.error("Error submitting quiz result:", error);
    } finally {
      // Stop music and navigate back - Dashboard will fetch fresh data from backend
      stopMusic();
      // Small delay to ensure music stops before navigating
      setTimeout(() => {
        navigate("/dashboard");
      }, 200);
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedbackSubmitting || feedbackSubmitted) return;

    const trimmedComment = feedbackComment.trim();
    if (!trimmedComment) {
      setFeedbackStatus({ type: "error", message: "Please write your feedback first." });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      setFeedbackStatus({ type: "error", message: "Please log in to submit feedback." });
      return;
    }

    try {
      setFeedbackSubmitting(true);
      setFeedbackStatus(null);

      await apiCall("POST", "/feedback", {
        data: {
          userId: user.id,
          quizId,
          category: decodedCategory,
          title: `${decodedCategory} Quiz`,
          totalQuestions: questions.length,
          comment: trimmedComment,
        },
      });

      setFeedbackSubmitted(true);
      setFeedbackStatus({ type: "success", message: "Thanks for your feedback!" });
    } catch (error) {
      setFeedbackStatus({ type: "error", message: error.message || "Failed to submit feedback." });
    } finally {
      setFeedbackSubmitting(false);
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
          <div className="feedback-card">
            <h3>Share your feedback</h3>
            <textarea
              className="feedback-input"
              placeholder="What did you think about this quiz?"
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              disabled={feedbackSubmitted}
              rows={4}
            />
            {feedbackStatus && (
              <p className={`feedback-status ${feedbackStatus.type}`}>
                {feedbackStatus.message}
              </p>
            )}
            <button
              className="feedback-submit-btn"
              onClick={handleSubmitFeedback}
              disabled={feedbackSubmitting || feedbackSubmitted}
            >
              {feedbackSubmitted ? "Feedback Submitted" : feedbackSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          <button className="restart-btn" onClick={restartQuiz}>
            Exit 
  
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
            navigate("/dashboard");
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
                  ? index === question.correctAnswer
                    ? "correct"
                    : "incorrect"
                  : ""
              } ${answered && index === question.correctAnswer ? "show-correct" : ""}`}
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
