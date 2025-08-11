import React, { useState, useEffect } from 'react';
import './AIAgentInterface.css';

const AIAgentInterface = ({ aiManager, aiStatus }) => {
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [availableTopics, setAvailableTopics] = useState([]);
  const [educationalContent, setEducationalContent] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState(null);

  // Load available topics on component mount
  useEffect(() => {
    if (aiManager && aiStatus === 'Active') {
      loadAvailableTopics();
      loadSystemMetrics();
    }
  }, [aiManager, aiStatus]);

  const loadAvailableTopics = async () => {
    try {
      const result = await aiManager.getAvailableTopics();
      setAvailableTopics(result.topics);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      const metrics = aiManager.getPerformanceMetrics();
      setSystemMetrics(metrics);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim() || !aiManager || aiStatus !== 'Active') return;

    setIsLoading(true);
    const question = userQuestion.trim();
    
    try {
      // Add user question to conversation
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: question,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, userMessage]);

      // Get AI response
      const response = await aiManager.getSecurityGuidance(question);
      
      // Add AI response to conversation
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setUserQuestion('');
      
      // Refresh metrics
      loadSystemMetrics();
      
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date().toISOString()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    
    try {
      const content = await aiManager.getEducationalContent(topic);
      setEducationalContent(content);
    } catch (error) {
      console.error('Failed to load educational content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    setUserQuestion(question);
    // Auto-submit the question
    setTimeout(() => {
      const submitEvent = new Event('submit', { bubbles: true });
      document.querySelector('form')?.dispatchEvent(submitEvent);
    }, 100);
  };

  const clearConversation = () => {
    setConversation([]);
    setEducationalContent(null);
    setSelectedTopic('');
  };

  const getQuickQuestions = () => [
    "Is it safe to use a password manager?",
    "Why shouldn't I reuse passwords?",
    "What is two-factor authentication?",
    "How long should my password be?",
    "Do I really need special characters?"
  ];

  const renderAIResponse = (response) => {
    if (!response) return null;

    return (
      <div className="ai-response">
        {response.questionAnswer && (
          <div className="question-answer">
            <h4>❓ {response.questionAnswer.question}</h4>
            <p className="answer">{response.questionAnswer.answer}</p>
            {response.questionAnswer.tips && (
              <div className="tips">
                <h5>💡 Tips:</h5>
                <ul>
                  {response.questionAnswer.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            <small className="source">Source: {response.questionAnswer.source}</small>
          </div>
        )}

        {response.guidance && (
          <div className="guidance">
            {response.guidance.immediate && response.guidance.immediate.length > 0 && (
              <div className="immediate-guidance">
                <h5>🚨 Immediate Actions:</h5>
                <ul>
                  {response.guidance.immediate.map((item, index) => (
                    <li key={index} className="immediate">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.guidance.detailed && response.guidance.detailed.length > 0 && (
              <div className="detailed-guidance">
                <h5>📋 Detailed Analysis:</h5>
                <ul>
                  {response.guidance.detailed.map((item, index) => (
                    <li key={index} className="detailed">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.guidance.tips && response.guidance.tips.length > 0 && (
              <div className="security-tips">
                <h5>🔐 Security Tips:</h5>
                <ul>
                  {response.guidance.tips.map((tip, index) => (
                    <li key={index} className="tip">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderEducationalContent = () => {
    if (!educationalContent) return null;

    return (
      <div className="educational-content">
        <h3>📚 {educationalContent.title}</h3>
        {educationalContent.sections.map((section, index) => (
          <div key={index} className="content-section">
            <h4>{section.title}</h4>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    );
  };

  if (aiStatus !== 'Active') {
    return (
      <div className="card">
        <div className="ai-status-error">
          <h2>🤖 AI System Status</h2>
          <p>AI Agent System is currently {aiStatus.toLowerCase()}</p>
          <p>Please wait for the system to initialize or check for errors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-interface">
      {/* System Status and Metrics */}
      <div className="card system-status">
        <h3>🤖 AI System Status</h3>
        {systemMetrics && (
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Status:</span>
              <span className={`metric-value status-${systemMetrics.systemStatus.toLowerCase()}`}>
                {systemMetrics.systemStatus}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Uptime:</span>
              <span className="metric-value">{systemMetrics.uptime}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Interactions:</span>
              <span className="metric-value">{systemMetrics.totalInteractions}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">{systemMetrics.successRate}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="card quick-questions">
        <h3>💡 Quick Questions</h3>
        <p>Click on any question to get instant AI guidance:</p>
        <div className="question-buttons">
          {getQuickQuestions().map((question, index) => (
            <button
              key={index}
              className="question-btn"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Educational Topics */}
      <div className="card educational-topics">
        <h3>📚 Learn About Password Security</h3>
        <p>Select a topic to learn more:</p>
        <div className="topic-buttons">
          {['general', 'entropy', 'bestPractices'].map((topic) => (
            <button
              key={topic}
              className={`topic-btn ${selectedTopic === topic ? 'active' : ''}`}
              onClick={() => handleTopicSelect(topic)}
            >
              {topic === 'general' ? '🔐 Fundamentals' :
               topic === 'entropy' ? '📊 Entropy & Complexity' :
               '✅ Best Practices'}
            </button>
          ))}
        </div>
        {renderEducationalContent()}
      </div>

      {/* AI Conversation Interface */}
      <div className="card conversation-interface">
        <div className="conversation-header">
          <h3>💬 Ask Your Security Questions</h3>
          <button 
            className="clear-btn"
            onClick={clearConversation}
            disabled={conversation.length === 0}
          >
            🗑️ Clear Chat
          </button>
        </div>

        {/* Conversation Display */}
        <div className="conversation-display">
          {conversation.length === 0 ? (
            <div className="empty-conversation">
              <p>👋 Hello! I'm your AI Security Advisor. Ask me anything about password security!</p>
              <p>Try asking:</p>
              <ul>
                <li>"How can I create a strong password?"</li>
                <li>"Is it safe to use a password manager?"</li>
                <li>"What makes a password weak?"</li>
              </ul>
            </div>
          ) : (
            conversation.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-header">
                  <span className="message-type">
                    {message.type === 'user' ? '👤 You' : 
                     message.type === 'ai' ? '🤖 AI Advisor' : '❌ Error'}
                  </span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">
                  {message.type === 'user' ? (
                    <p>{message.content}</p>
                  ) : message.type === 'ai' ? (
                    renderAIResponse(message.content)
                  ) : (
                    <p className="error-message">{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="message ai loading">
              <div className="message-header">
                <span className="message-type">🤖 AI Advisor</span>
                <span className="message-time">Thinking...</span>
              </div>
              <div className="message-content">
                <div className="loading-indicator">
                  <span>🤔 Analyzing your question...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Question Input Form */}
        <form onSubmit={handleAskQuestion} className="question-form">
          <div className="input-group">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask me about password security, best practices, or any security concerns..."
              disabled={isLoading}
              className="question-input"
            />
            <button 
              type="submit" 
              disabled={!userQuestion.trim() || isLoading}
              className="ask-btn"
            >
              {isLoading ? '🤔 Thinking...' : '💬 Ask AI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAgentInterface;
