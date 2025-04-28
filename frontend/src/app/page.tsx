"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { marked } from "marked";
import { toast, Toaster } from "react-hot-toast";
import SummaryApi from "../../api/index";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chatHistory"));
    if (stored) {
      setHistory(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SummaryApi.Ask.url, {
        method: SummaryApi.Ask.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (res.ok) {
        setAnswer(data.answer);
        setHistory((prev) => [...prev, { question, answer: data.answer }]);
        setQuestion("");
      } else {
        setError(data.detail || "Something went wrong.");
        toast.error(data.detail || "Something went wrong.");
      }
    } catch (error) {
      setError("Server not reachable.");
      toast.error("Server not reachable.");
    }
    setLoading(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <div className="w-64 bg-white p-4 shadow-md flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">History</h2>
          <button
            onClick={handleClearHistory}
            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {history.length > 0 ? (
            <ul className="space-y-2">
              {[...history].reverse().map((item, index) => (
                <li
                  key={index}
                  className={`p-2 rounded cursor-pointer text-sm ${
                    activeIndex === index
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setAnswer(item.answer);
                    setQuestion(item.question);
                    setActiveIndex(index);
                  }}
                >
                  {item.question.slice(0, 30)}...
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No conversations yet.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Ancent Mbithi AI Assistant
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="Ask your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Ask"}
            </button>
          </form>

          {/* Answer Section */}
          {answer && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border">
              <h2 className="font-bold mb-2">Answer:</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(answer) }}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
