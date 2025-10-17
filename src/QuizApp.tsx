import React, { useState, useEffect } from "react";
import input from "./Questions/SportsQuizQuestions.json";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// ---------------- Quiz JSON Builder ----------------
function QuizJSONBuilder({ onClose }) {
  const [rounds, setRounds] = useState([]);

  const handleFileUpload = (e, roundIndex, qIndex, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateQuestionField(roundIndex, qIndex, field, url);
  };

  const addRound = () =>
    setRounds([...rounds, { name: "", timer: "", questions: [] }]);
  const removeRound = (index) => {
    const copy = [...rounds];
    copy.splice(index, 1);
    setRounds(copy);
  };
  const updateRoundName = (index, value) => {
    const copy = [...rounds];
    copy[index].name = value;
    setRounds(copy);
  };
  const updateRoundTimer = (index, value) => {
    const copy = [...rounds];
    copy[index].timer = value ? parseInt(value) : "";
    setRounds(copy);
  };
  const addQuestion = (roundIndex) => {
    const copy = [...rounds];
    copy[roundIndex].questions.push({
      question: "",
      type: "text",
      answerText: "",
      answer: 0,
      options: [],
      image: "",
      video: "",
      youtube: "",
      timer: "",
    });
    setRounds(copy);
  };
  const removeQuestion = (roundIndex, qIndex) => {
    const copy = [...rounds];
    copy[roundIndex].questions.splice(qIndex, 1);
    setRounds(copy);
  };
  const updateQuestionField = (roundIndex, qIndex, field, value) => {
    const copy = [...rounds];
    copy[roundIndex].questions[qIndex][field] = value;
    setRounds(copy);
  };
  const updateOption = (roundIndex, qIndex, optIndex, value) => {
    const copy = [...rounds];
    copy[roundIndex].questions[qIndex].options[optIndex] = value;
    setRounds(copy);
  };
  const addOption = (roundIndex, qIndex) => {
    const copy = [...rounds];
    if (!copy[roundIndex].questions[qIndex].options)
      copy[roundIndex].questions[qIndex].options = [];
    copy[roundIndex].questions[qIndex].options.push("");
    setRounds(copy);
  };
  const removeOption = (roundIndex, qIndex, optIndex) => {
    const copy = [...rounds];
    copy[roundIndex].questions[qIndex].options.splice(optIndex, 1);
    setRounds(copy);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const copy = [...rounds];
    if (result.type === "ROUND") {
      const [removed] = copy.splice(result.source.index, 1);
      copy.splice(result.destination.index, 0, removed);
      setRounds(copy);
    }
    if (result.type.startsWith("QUESTION")) {
      const roundIndex = parseInt(result.type.split("-")[1]);
      const questions = copy[roundIndex].questions;
      const [removed] = questions.splice(result.source.index, 1);
      questions.splice(result.destination.index, 0, removed);
      setRounds(copy);
    }
  };

  const downloadJSON = () => {
    const cleanRounds = rounds
      .filter((r) => r.name.trim() !== "")
      .map((r) => ({
        ...r,
        questions: r.questions.filter((q) => q.question.trim() !== ""),
      }));
    const fileData = JSON.stringify(cleanRounds, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "quiz.json";
    link.href = url;
    link.click();
  };

  return (
    <div className="p-8 min-h-screen w-full bg-gradient-to-b from-blue-900 to-black text-white">
      <button
        onClick={onClose}
        className="fixed top-4 left-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-xl z-50 shadow"
      >
        🏠 Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-center">Quiz JSON Builder</h1>

      <button
        onClick={addRound}
        className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded mb-4"
      >
        Add Round
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="rounds" type="ROUND">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {rounds.map((round, rIndex) => (
                <Draggable
                  key={rIndex}
                  draggableId={`round-${rIndex}`}
                  index={rIndex}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="border p-4 mb-4 bg-gray-800 rounded shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-move mr-2 text-yellow-400"
                        >
                          ☰
                        </div>
                        <input
                          type="text"
                          placeholder="Round Name"
                          value={round.name}
                          onChange={(e) =>
                            updateRoundName(rIndex, e.target.value)
                          }
                          className="border border-gray-600 bg-gray-900 text-white p-1 mr-2 rounded"
                        />
                        <input
                          type="number"
                          placeholder="Timer (optional)"
                          value={round.timer}
                          onChange={(e) =>
                            updateRoundTimer(rIndex, e.target.value)
                          }
                          className="border border-gray-600 bg-gray-900 text-white p-1 mr-2 w-32 rounded"
                        />
                        <button
                          onClick={() => removeRound(rIndex)}
                          className="bg-red-500 hover:bg-red-400 text-white py-1 px-2 rounded"
                        >
                          Remove Round
                        </button>
                      </div>

                      <button
                        onClick={() => addQuestion(rIndex)}
                        className="bg-green-500 hover:bg-green-400 text-white py-1 px-2 rounded mb-2"
                      >
                        Add Question
                      </button>

                      <Droppable
                        droppableId={`questions-${rIndex}`}
                        type={`QUESTION-${rIndex}`}
                      >
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {round.questions.map((q, qIndex) => (
                              <Draggable
                                key={qIndex}
                                draggableId={`q-${rIndex}-${qIndex}`}
                                index={qIndex}
                              >
                                {(provided) => (
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    className="border p-2 mb-2 rounded bg-gray-700"
                                  >
                                    <select
                                      value={q.type}
                                      onChange={(e) =>
                                        updateQuestionField(
                                          rIndex,
                                          qIndex,
                                          "type",
                                          e.target.value
                                        )
                                      }
                                      className="mb-2 bg-gray-900 text-white p-1 rounded border border-gray-600"
                                    >
                                      <option value="text">Open / Text</option>
                                      <option value="mcq">
                                        Multiple Choice
                                      </option>
                                    </select>

                                    <input
                                      type="text"
                                      placeholder="Question text"
                                      value={q.question}
                                      onChange={(e) =>
                                        updateQuestionField(
                                          rIndex,
                                          qIndex,
                                          "question",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-600 bg-gray-900 text-white p-1 mb-1 w-full rounded"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Answer text"
                                      value={q.answerText}
                                      onChange={(e) =>
                                        updateQuestionField(
                                          rIndex,
                                          qIndex,
                                          "answerText",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-600 bg-gray-900 text-white p-1 mb-1 w-full rounded"
                                    />

                                    {/* MCQ Options */}
                                    {q.type === "mcq" && (
                                      <div className="mb-2">
                                        <p className="font-semibold mb-1">
                                          Options:
                                        </p>
                                        {q.options.map((opt, optIndex) => (
                                          <div
                                            key={optIndex}
                                            className="flex gap-2 mb-1"
                                          >
                                            <input
                                              type="text"
                                              value={opt}
                                              onChange={(e) =>
                                                updateOption(
                                                  rIndex,
                                                  qIndex,
                                                  optIndex,
                                                  e.target.value
                                                )
                                              }
                                              className="border border-gray-600 bg-gray-900 text-white p-1 rounded w-full"
                                              placeholder={`Option ${
                                                optIndex + 1
                                              }`}
                                            />
                                            <button
                                              onClick={() =>
                                                removeOption(
                                                  rIndex,
                                                  qIndex,
                                                  optIndex
                                                )
                                              }
                                              className="bg-red-500 hover:bg-red-400 text-white px-2 rounded"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          onClick={() =>
                                            addOption(rIndex, qIndex)
                                          }
                                          className="bg-blue-500 hover:bg-blue-400 text-white py-1 px-2 rounded"
                                        >
                                          Add Option
                                        </button>
                                        <input
                                          type="number"
                                          placeholder="Correct Answer Index"
                                          value={q.answer}
                                          onChange={(e) =>
                                            updateQuestionField(
                                              rIndex,
                                              qIndex,
                                              "answer",
                                              parseInt(e.target.value)
                                            )
                                          }
                                          className="border border-gray-600 bg-gray-900 text-white p-1 rounded mt-1 w-40"
                                        />
                                      </div>
                                    )}

                                    <input
                                      type="text"
                                      placeholder="Image URL"
                                      value={q.image}
                                      onChange={(e) =>
                                        updateQuestionField(
                                          rIndex,
                                          qIndex,
                                          "image",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-600 bg-gray-900 text-white p-1 mb-1 w-full rounded"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleFileUpload(
                                          e,
                                          rIndex,
                                          qIndex,
                                          "image"
                                        )
                                      }
                                      className="mb-1"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Video URL"
                                      value={q.video}
                                      onChange={(e) =>
                                        updateQuestionField(
                                          rIndex,
                                          qIndex,
                                          "video",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-600 bg-gray-900 text-white p-1 mb-1 w-full rounded"
                                    />
                                    <input
                                      type="file"
                                      accept="video/*,audio/*"
                                      onChange={(e) =>
                                        handleFileUpload(
                                          e,
                                          rIndex,
                                          qIndex,
                                          "video"
                                        )
                                      }
                                      className="mb-1"
                                    />
                                    <input
                                      type="text"
                                      placeholder="YouTube URL"
                                      value={q.youtube}
                                      onChange={(e) =>
                                        updateQuestionField(
                                          rIndex,
                                          qIndex,
                                          "youtube",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-600 bg-gray-900 text-white p-1 mb-1 w-full rounded"
                                    />
                                    <input
                                      type="number"
                                      placeholder="Timer (optional)"
                                      value={q.timer}
                                      onChange={(e) =>
                                        updateQuestionField(
                                          rIndex,
                                          qIndex,
                                          "timer",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-600 bg-gray-900 text-white p-1 mb-1 w-32 rounded"
                                    />
                                    <button
                                      onClick={() =>
                                        removeQuestion(rIndex, qIndex)
                                      }
                                      className="bg-red-500 hover:bg-red-400 text-white py-1 px-2 rounded"
                                    >
                                      Remove Question
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={downloadJSON}
        className="bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded mt-4"
      >
        Export JSON
      </button>

      <h2 className="text-xl font-bold mt-6 mb-2 text-center">JSON Preview</h2>
      <pre className="bg-gray-800 text-white p-4 rounded max-h-96 overflow-auto">
        {JSON.stringify(rounds, null, 2)}
      </pre>
    </div>
  );
}

// ---------------- Main Quiz App ----------------
export default function App() {
  const [selectedRound, setSelectedRound] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [homeView, setHomeView] = useState("main");
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [homeClickCount, setHomeClickCount] = useState(0);

  const rounds = input;
  const round = selectedRound !== null ? rounds[selectedRound] : null;
  const currentQuestion = round ? round.questions[currentQ] : null;

  const handleAnswer = (index) => {
    if (locked || reviewMode) return;
    setSelected(index);
    setLocked(true);
    if (currentQuestion.type === "mcq") {
      if (index === currentQuestion.answer) setScore(score + 1);
    } else {
      // open/text question: could implement text comparison here
    }
  };

  const nextQuestion = () => {
    if (!round) return;
    if (currentQ + 1 < round.questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setLocked(false);
      setTimerActive(false);
    } else goHome();
  };

  const prevQuestion = () => {
    if (!round || currentQ === 0) return;
    setCurrentQ(currentQ - 1);
    setSelected(null);
    setLocked(false);
    setTimerActive(false);
  };

  const goHome = () => {
    setSelectedRound(null);
    setCurrentQ(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setReviewMode(false);
    setHomeView("main");
    setTimeLeft(null);
    setTimerActive(false);
    setHomeClickCount((prev) => prev + 1); // Count presses
  };
  

  useEffect(() => {
    if (!round || reviewMode) return;
    const timerDuration = currentQuestion?.timer ?? round?.timer ?? null;
    if (timerDuration) {
      setTimeLeft(timerDuration);
      setTimerActive(true);
    } else {
      setTimeLeft(null);
      setTimerActive(false);
    }
  }, [currentQ, selectedRound, reviewMode]);

  useEffect(() => {
    if (!timerActive || timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setLocked(true);
      return;
    }
    const interval = setInterval(
      () => setTimeLeft((t) => (t > 0 ? t - 1 : 0)),
      1000
    );
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  if (showQuizBuilder)
    return <QuizJSONBuilder onClose={() => setShowQuizBuilder(false)} />;

  if (selectedRound === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-blue-900 to-black text-white text-center p-8">
        <button
          onClick={goHome}
          className="fixed top-4 left-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-xl shadow-lg text-lg z-50"
        >
          🏠 Home
        </button>

        <h1 className="text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
          Question Of Sport?
        </h1>
        {homeView === "main" && (
          <>
            <p className="text-2xl mb-10">Select a Round to Begin</p>
            <div className="flex flex-col gap-4 mb-8">
              {rounds.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedRound(i)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl text-2xl"
                >
                  {r.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setHomeView("reviewMenu")}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-xl text-2xl mb-4"
            >
              Review Rounds
            </button>
            {homeClickCount >= 6 && (
              <button
                onClick={() => setShowQuizBuilder(true)}
                className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 px-8 rounded-xl text-2xl"
              >
                🧠 Create Quiz
              </button>
            )}
          </>
        )}
        {homeView === "reviewMenu" && (
          <>
            <p className="text-2xl mb-10">Select a Round to Review</p>
            <div className="flex flex-col gap-4 mb-8">
              {rounds.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedRound(i);
                    setReviewMode(true);
                  }}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-xl text-2xl"
                >
                  Review {r.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setHomeView("main")}
              className="bg-gray-500 hover:bg-gray-400 text-black font-bold py-3 px-8 rounded-xl text-2xl"
            >
              Back
            </button>
          </>
        )}
      </div>
    );
  }

  if (!round || !currentQuestion) return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-blue-900 to-black text-white p-8">
      <button
        onClick={goHome}
        className="fixed top-4 left-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-xl shadow-lg text-lg z-50"
      >
        🏠 Home
      </button>
      <h1 className="text-4xl font-bold mb-4 text-center">{round.name}</h1>
      <p className="text-xl mb-2">
        Question {currentQ + 1} of {round.questions.length}
      </p>
      {timeLeft !== null && (
        <div
          className={`text-3xl font-bold mb-6 transition-all duration-500 ${
            timeLeft <= 5
              ? "text-red-500 animate-pulse-fast"
              : "text-yellow-400"
          }`}
        >
          ⏱️ {timeLeft}s
        </div>
      )}

      <div className="max-w-4xl w-full bg-gray-800 p-10 rounded-2xl shadow-2xl overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {currentQuestion.question}
        </h2>

        {/* --- Image Logic (supports reviewImage) --- */}
        {(() => {
          const imageSource =
            reviewMode && currentQuestion.reviewImage
              ? currentQuestion.reviewImage
              : currentQuestion.image;

          if (!imageSource || currentQuestion.video || currentQuestion.youtube)
            return null;

          return (
            <img
              src={imageSource}
              alt="Question"
              className="mb-6 w-full max-h-96 object-contain rounded-xl max-w-full"
            />
          );
        })()}

        {currentQuestion.youtube && (
          <div className="mb-6 w-full aspect-video max-w-full">
            <iframe
              className="w-full h-full rounded-xl"
              src={currentQuestion.youtube}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {/* --- Video / Audio Logic (supports reviewVideo) --- */}
        {(() => {
          const videoSource =
            reviewMode && currentQuestion.reviewVideo
              ? currentQuestion.reviewVideo
              : currentQuestion.video;

          if (!videoSource) return null;

          if (videoSource.endsWith(".mp3")) {
            return (
              <audio key={videoSource} controls className="mb-6 w-full">
                <source
                  src={`${videoSource}?q=${currentQ}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            );
          } else {
            return (
              <video
                key={videoSource}
                controls
                className="mb-6 w-full max-h-96 rounded-xl"
              >
                <source src={`${videoSource}?q=${currentQ}`} type="video/mp4" />
                Your browser does not support the video element.
              </video>
            );
          }
        })()}

        {/* Multiple Choice Buttons */}
        {currentQuestion.type === "mcq" && (
          <div className="flex flex-col gap-4 mt-4">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`py-3 px-6 rounded-xl text-lg font-bold ${
                  selected === idx
                    ? idx === currentQuestion.answer
                      ? "bg-green-500 text-black"
                      : "bg-red-500 text-black"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
                disabled={locked || reviewMode}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {reviewMode && currentQuestion.answerText && (
          <p className="text-green-400 text-2xl font-bold mb-6 text-center">
            ✅ Correct Answer: {currentQuestion.answerText}
          </p>
        )}

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={prevQuestion}
            disabled={currentQ === 0}
            className="bg-gray-500 hover:bg-gray-400 disabled:opacity-50 text-black font-bold py-3 px-6 rounded-xl text-lg"
          >
            ← Back
          </button>
          <button
            onClick={nextQuestion}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl text-lg"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
