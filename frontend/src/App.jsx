import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

// App component, the main component for the quiz application
function App() {
  // Variables for useState
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [highScores, setHighScores] = useState([]);
  const [leaderboardTopic, setLeaderboardTopic] = useState(null); // default topic is none


  // Function to fetch and show questions based on selected topic
  const showQuestions = async () => {
    const response = await fetch('/api/questions');
    const data = await response.json();

    if (!selectedTopic) {
      alert("select topic");
      return;
    }
    const filtered = data.filter(question => question.topic === selectedTopic);
    setAllQuestions(filtered);
    setCurrentQuestion(0);
    setScore(0);
    setQuizStarted(true);
    setQuizStartTime(Date.now());
  };


  // Function to handle answer clicks, updates score and the current question
  const handleAnswerClick = (answerId) => {
    const question = allQuestions[currentQuestion];
    if (Number(answerId) === Number(question.correct_answer)) {
      setScore(prev => prev + 1);
    }
    if (currentQuestion + 1 < allQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const finalScore = score + (Number(answerId) === Number(question.correct_answer) ? 1 : 0);
      alert(`Quiz done. Your score: ${finalScore} / ${allQuestions.length}`);
    }
  };

  const postUserData = async (username, highscore, topic, time) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, highscore, topic, time }),
    });
    const data = await response.json();
    console.log('User data saved:', data);
  };

  const handleEndQuiz = async () => {
    const timeTaken = Number(((Date.now() - quizStartTime) / 1000).toFixed(1));
    await postUserData(username, score, selectedTopic, timeTaken);

    if (!username) {
      alert("write username");
      return;
    }

    setQuizStarted(false);
    setAllQuestions([]);
    setSelectedTopic(null);
    setScore(0);
    setCurrentQuestion(0);
  };

  useEffect(() => {
    const fetchHighScores = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();

      const filtered = data.filter(user => user.topic === leaderboardTopic);

      const sorted = filtered
        .sort((a, b) => b.highscore - a.highscore || a.time - b.time)
        .slice(0, 10);

      setHighScores(sorted);
    };

    fetchHighScores();
  }, [leaderboardTopic, quizStarted]);


  return (
    <>

      <div>
        <a target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Tietovisa</h1>
      <hr />

      {!quizStarted && (
        <div className='card'>

          <div className="leaderboard">
            <h2>🏆 Top 10 High Scores</h2>
            {highScores.length === 0 ? (
              <p>Select a topic to see highscore/No highscore</p>
            ) : (
              <ol>
                {highScores.map((user, index) => (
                  <li key={index}>
                    <strong>{user.username}</strong> with <strong>{user.highscore}</strong> pts ({user.topic}, {user.time}s)
                  </li>
                ))}
              </ol>
            )}
          </div>
          <button onClick={() => { setSelectedTopic("FullStack"); setLeaderboardTopic("FullStack"); }}>Full Stack</button>
          <button onClick={() => { setSelectedTopic("Maths"); setLeaderboardTopic("Maths"); }}>Simple Maths</button>
          <button onClick={() => { setSelectedTopic("NBA"); setLeaderboardTopic("NBA"); }}>NBA</button>


          <div className="card">
            <button onClick={showQuestions}>Start quiz</button>
          </div>
        </div>
      )}

      {/* Quiz screen */}
      {quizStarted && allQuestions.length > 0 && (
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </form>

          <h2>Topic: {selectedTopic}</h2>
          <h3>Question {currentQuestion + 1}: {allQuestions[currentQuestion].question}</h3>

          {Object.entries(allQuestions[currentQuestion].answers).map(([answerId, answerText]) => (
            <button key={answerId} onClick={() => handleAnswerClick(answerId)}>
              {answerText}
            </button>
          ))}
          <p>Score: {score}</p>
          <button onClick={handleEndQuiz}>End Quiz</button>
        </div>
      )}
    </>
  );
}

export default App;
