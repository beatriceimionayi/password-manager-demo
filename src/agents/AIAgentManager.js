// AI Agent Manager
// Coordinates both AI agents and provides unified interface

import PasswordAnalystAgent from './PasswordAnalystAgent';
import SecurityAdvisorAgent from './SecurityAdvisorAgent';

class AIAgentManager {
  constructor() {
    this.analystAgent = new PasswordAnalystAgent();
    this.advisorAgent = new SecurityAdvisorAgent();
    this.conversationHistory = [];
    this.isActive = true;
  }

  // Initialize the AI system
  initialize() {
    console.log('🤖 AI Agent System Initialized');
    console.log(`📊 ${this.analystAgent.name}: ${this.analystAgent.role}`);
    console.log(`💬 ${this.advisorAgent.name}: ${this.advisorAgent.role}`);
    
    return {
      analyst: this.analystAgent.getInfo(),
      advisor: this.advisorAgent.getInfo(),
      status: 'Active'
    };
  }

  // Get system status and agent information
  getSystemStatus() {
    return {
      status: this.isActive ? 'Active' : 'Inactive',
      agents: {
        analyst: this.analystAgent.getInfo(),
        advisor: this.advisorAgent.getInfo()
      },
      conversationHistory: this.conversationHistory.length,
      lastActivity: this.conversationHistory.length > 0 
        ? this.conversationHistory[this.conversationHistory.length - 1].timestamp 
        : null
    };
  }

  // Main password analysis workflow
  async analyzePassword(password, includeGuidance = true) {
    if (!this.isActive) {
      throw new Error('AI Agent System is currently inactive');
    }

    try {
      // Step 1: Technical Analysis (Analyst Agent)
      console.log('🔍 Analyst Agent: Starting password analysis...');
      const analysis = this.analystAgent.analyzePassword(password);
      
      // Step 2: Security Guidance (Advisor Agent)
      let guidance = null;
      if (includeGuidance) {
        console.log('💬 Advisor Agent: Generating security guidance...');
        guidance = this.advisorAgent.provideGuidance(analysis);
      }

      // Step 3: Contextual Advice
      const contextualAdvice = this.advisorAgent.getContextualAdvice(password, analysis);

      // Step 4: Log the interaction
      this.logInteraction('password_analysis', {
        password: password.substring(0, 3) + '***', // Log partial for security
        strength: analysis.strength,
        score: analysis.score,
        entropy: analysis.entropy,
        guidanceProvided: !!guidance
      });

      // Step 5: Return comprehensive results
      return {
        analysis,
        guidance,
        contextualAdvice,
        timestamp: new Date().toISOString(),
        agents: {
          analyst: this.analystAgent.getInfo(),
          advisor: this.advisorAgent.getInfo()
        }
      };

    } catch (error) {
      console.error('❌ AI Agent Error:', error);
      this.logInteraction('error', { error: error.message });
      throw error;
    }
  }

  // Generate password with AI assistance
  async generatePassword(options = {}, includeAnalysis = true) {
    if (!this.isActive) {
      throw new Error('AI Agent System is currently inactive');
    }

    try {
      // Step 1: Generate password (Analyst Agent)
      console.log('🔐 Analyst Agent: Generating secure password...');
      const generatedPassword = this.analystAgent.generatePassword(options);
      
      // Step 2: Analyze the generated password
      let analysis = null;
      if (includeAnalysis) {
        console.log('🔍 Analyst Agent: Analyzing generated password...');
        analysis = this.analystAgent.analyzePassword(generatedPassword);
      }

      // Step 3: Log the interaction
      this.logInteraction('password_generation', {
        options,
        generatedLength: generatedPassword.length,
        analyzed: !!analysis,
        strength: analysis?.strength || 'Not analyzed'
      });

      // Step 4: Return results
      return {
        password: generatedPassword,
        analysis,
        timestamp: new Date().toISOString(),
        agent: this.analystAgent.getInfo()
      };

    } catch (error) {
      console.error('❌ Password Generation Error:', error);
      this.logInteraction('error', { error: error.message });
      throw error;
    }
  }

  // Get security guidance and answer questions
  async getSecurityGuidance(question = null, context = null) {
    if (!this.isActive) {
      throw new Error('AI Agent System is currently inactive');
    }

    try {
      let guidance = null;
      let questionAnswer = null;

      if (question) {
        // Handle specific question
        console.log('💬 Advisor Agent: Processing user question...');
        questionAnswer = this.advisorAgent.answerQuestion(question);
      }

      if (context) {
        // Provide contextual guidance
        console.log('💬 Advisor Agent: Providing contextual guidance...');
        guidance = this.advisorAgent.provideGuidance(context, question);
      } else {
        // Provide general guidance
        guidance = this.advisorAgent.provideGuidance({}, question);
      }

      // Log the interaction
      this.logInteraction('security_guidance', {
        question: question?.substring(0, 50) || 'General guidance',
        contextProvided: !!context,
        guidanceProvided: !!guidance
      });

      return {
        guidance,
        questionAnswer,
        timestamp: new Date().toISOString(),
        agent: this.advisorAgent.getInfo()
      };

    } catch (error) {
      console.error('❌ Security Guidance Error:', error);
      this.logInteraction('error', { error: error.message });
      throw error;
    }
  }

  // Get educational content
  async getEducationalContent(topic = 'general') {
    if (!this.isActive) {
      throw new Error('AI Agent System is currently inactive');
    }

    try {
      console.log('📚 Advisor Agent: Retrieving educational content...');
      const content = this.advisorAgent.getEducationalContent(topic);
      
      // Log the interaction
      this.logInteraction('educational_content', {
        topic,
        contentRetrieved: !!content
      });

      return {
        content,
        topic,
        timestamp: new Date().toISOString(),
        agent: this.advisorAgent.getInfo()
      };

    } catch (error) {
      console.error('❌ Educational Content Error:', error);
      this.logInteraction('error', { error: error.message });
      throw error;
    }
  }

  // Get available topics for questions
  async getAvailableTopics() {
    if (!this.isActive) {
      throw new Error('AI Agent System is currently inactive');
    }

    try {
      console.log('📋 Advisor Agent: Retrieving available topics...');
      const topics = this.advisorAgent.getAvailableTopics();
      
      return {
        topics,
        timestamp: new Date().toISOString(),
        agent: this.advisorAgent.getInfo()
      };

    } catch (error) {
      console.error('❌ Topics Retrieval Error:', error);
      throw error;
    }
  }

  // Interactive conversation mode
  async startConversation(initialQuestion = null) {
    if (!this.isActive) {
      throw new Error('AI Agent System is currently inactive');
    }

    try {
      console.log('💬 Starting AI conversation mode...');
      
      let response = null;
      if (initialQuestion) {
        response = await this.getSecurityGuidance(initialQuestion);
      } else {
        response = await this.getSecurityGuidance();
      }

      this.logInteraction('conversation_started', {
        initialQuestion: initialQuestion?.substring(0, 50) || 'General conversation',
        responseProvided: !!response
      });

      return {
        ...response,
        conversationId: Date.now(),
        mode: 'interactive'
      };

    } catch (error) {
      console.error('❌ Conversation Error:', error);
      this.logInteraction('error', { error: error.message });
      throw error;
    }
  }

  // Log all interactions for monitoring and improvement
  logInteraction(type, data) {
    const interaction = {
      id: Date.now(),
      type,
      timestamp: new Date().toISOString(),
      data,
      sessionId: this.getSessionId()
    };

    this.conversationHistory.push(interaction);
    
    // Keep only last 100 interactions to prevent memory issues
    if (this.conversationHistory.length > 100) {
      this.conversationHistory = this.conversationHistory.slice(-100);
    }

    // Log to console for development
    console.log(`📝 AI Interaction Logged: ${type}`, data);
  }

  // Get session ID for tracking
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return this.sessionId;
  }

  // Get conversation history
  getConversationHistory(limit = 20) {
    return this.conversationHistory
      .slice(-limit)
      .map(interaction => ({
        ...interaction,
        data: interaction.data // Be careful with sensitive data
      }));
  }

  // Clear conversation history
  clearConversationHistory() {
    this.conversationHistory = [];
    console.log('🗑️ Conversation history cleared');
  }

  // Toggle AI system on/off
  toggleSystem() {
    this.isActive = !this.isActive;
    console.log(`🤖 AI Agent System ${this.isActive ? 'activated' : 'deactivated'}`);
    
    this.logInteraction('system_toggle', {
      newStatus: this.isActive ? 'active' : 'inactive'
    });

    return { status: this.isActive ? 'Active' : 'Inactive' };
  }

  // Get system performance metrics
  getPerformanceMetrics() {
    const totalInteractions = this.conversationHistory.length;
    const errorCount = this.conversationHistory.filter(i => i.type === 'error').length;
    const successRate = totalInteractions > 0 ? ((totalInteractions - errorCount) / totalInteractions * 100).toFixed(2) : 100;

    return {
      totalInteractions,
      errorCount,
      successRate: `${successRate}%`,
      systemStatus: this.isActive ? 'Active' : 'Inactive',
      uptime: this.getUptime(),
      lastActivity: this.conversationHistory.length > 0 
        ? this.conversationHistory[this.conversationHistory.length - 1].timestamp 
        : null
    };
  }

  // Get system uptime
  getUptime() {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    
    const uptime = Date.now() - this.startTime;
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  // Reset the AI system
  reset() {
    this.conversationHistory = [];
    this.sessionId = null;
    this.startTime = Date.now();
    this.isActive = true;
    
    console.log('🔄 AI Agent System reset');
    this.logInteraction('system_reset', { timestamp: new Date().toISOString() });
    
    return { status: 'Reset Complete', timestamp: new Date().toISOString() };
  }
}

export default AIAgentManager;
