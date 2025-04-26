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
  const [isOpen, setIsOpen] = useState(false);

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
        setHistory((prev) => [...prev, { 
          question, 
          answer: data.answer 
        }]); 
      } else {
        setError(data.detail || "Something went wrong.");
        toast.error(data.detail || "Something went wrong.");
      }
    } catch (err) {
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <Toaster position="top-right" />

      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg mb-4">
        <h1 className="text-2xl font-bold text-center mb-6">Ancent Mbithi AI Assistant </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Ask"}
          </button>
        </form>

        {/* Latest Answer */}
        {answer && (
          <div className="mt-6 p-4 bg-green-100 rounded-md">
            <h2 className="font-bold mb-2">Latest Answer:</h2>
            <div dangerouslySetInnerHTML={{ __html: marked(answer) }} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Chat history */}
      {history.length > 0 && (
        <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Past Conversations</h2>
            <button
              onClick={handleClearHistory}
              className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Clear History
            </button>
          </div>

        <ul className="space-y-4">
          {[...history].reverse().map((item, index) => {
            return (
              <li key={index} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Q: {item.question}</p>
                  <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="text-blue-500 text-3xl font-bold focus:outline-none"
                  >
                    {isOpen ? "-" : "+"}
                  </button>
                </div>

                {isOpen && (
                  <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: marked(item.answer) }} />
                )}
              </li>
            );
          })}
        </ul>


        </div>
      )}
    </div>
  );
}
