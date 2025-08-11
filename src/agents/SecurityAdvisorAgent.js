// Agent 2: Interactive Security Advisor
// Type: Reactive / Interactive
// Role: User guidance, security education, and real-time assistance

class SecurityAdvisorAgent {
  constructor() {
    this.name = "Security Advisor Agent";
    this.role = "Interactive Guidance & Education";
    this.capabilities = [
      "Real-time security explanations",
      "Best practices guidance",
      "User question answering",
      "Security education",
      "Interactive assistance"
    ];
    
    // Knowledge base for common security questions and explanations
    this.knowledgeBase = {
      passwordManagers: {
        question: "Is it safe to use a password manager?",
        answer: "Yes, password managers are generally safe and recommended by security experts. They use strong encryption to protect your data and help you create unique, strong passwords for each account. However, choose a reputable one with good security practices.",
        tips: [
          "Use a well-known, reputable password manager",
          "Enable two-factor authentication on your password manager",
          "Use a strong master password",
          "Keep your password manager updated"
        ]
      },
      passwordReuse: {
        question: "Why shouldn't I reuse passwords?",
        answer: "Password reuse is dangerous because if one account is compromised, attackers can access all your other accounts using the same password. Each account should have a unique, strong password.",
        tips: [
          "Use unique passwords for each account",
          "Consider using a password manager to generate and store them",
          "If you must reuse, only do so for low-risk accounts",
          "Change passwords immediately if any account is compromised"
        ]
      },
      twoFactor: {
        question: "What is two-factor authentication (2FA)?",
        answer: "Two-factor authentication adds an extra layer of security by requiring both your password and a second form of verification (like a code from your phone) to access your account.",
        tips: [
          "Enable 2FA on all important accounts",
          "Use authenticator apps instead of SMS when possible",
          "Keep backup codes in a safe place",
          "Don't share your 2FA codes with anyone"
        ]
      },
      passwordLength: {
        question: "How long should my password be?",
        answer: "Modern security recommendations suggest passwords should be at least 12 characters long, with 16+ characters being ideal. Longer passwords are exponentially harder to crack.",
        tips: [
          "Aim for at least 12 characters",
          "16+ characters is excellent for high-security accounts",
          "Length is more important than complexity",
          "Consider using passphrases (multiple words)"
        ]
      },
      specialCharacters: {
        question: "Do I really need special characters?",
        answer: "While special characters add complexity, length and uniqueness are more important. However, including them can help meet minimum requirements and increase entropy.",
        tips: [
          "Length and uniqueness matter more than special characters",
          "Use special characters when possible",
          "Avoid predictable substitutions (like @ for a)",
          "Mix different character types for better security"
        ]
      }
    };

    // Common security tips and best practices
    this.securityTips = [
      "🔐 Use unique passwords for each account",
      "📱 Enable two-factor authentication everywhere possible",
      "📧 Be cautious of phishing emails asking for passwords",
      "🔄 Change passwords regularly, especially for important accounts",
      "💻 Use a password manager to generate and store passwords",
      "🔒 Never share passwords via email, text, or social media",
      "📱 Use authenticator apps instead of SMS for 2FA",
      "🏠 Use different passwords for personal vs. work accounts",
      "📚 Regularly review and update your security practices",
      "🚨 Monitor accounts for suspicious activity"
    ];

    // Password strength explanations
    this.strengthExplanations = {
      "Very Weak": {
        explanation: "This password is extremely vulnerable to attacks. It can likely be cracked in seconds or minutes by automated tools.",
        risks: [
          "Can be cracked in seconds to minutes",
          "Vulnerable to dictionary attacks",
          "Easy to guess by humans",
          "Provides no security protection"
        ],
        immediate: "Change this password immediately for any important accounts."
      },
      "Weak": {
        explanation: "This password offers minimal protection and can be compromised relatively easily by attackers.",
        risks: [
          "Can be cracked in minutes to hours",
          "Vulnerable to brute force attacks",
          "May contain common patterns",
          "Limited character variety"
        ],
        immediate: "Improve this password before using it on important accounts."
      },
      "Fair": {
        explanation: "This password meets basic security requirements but could be significantly stronger.",
        risks: [
          "May be cracked in hours to days",
          "Some common patterns detected",
          "Limited entropy",
          "Could be improved"
        ],
        immediate: "Consider strengthening this password for better security."
      },
      "Strong": {
        explanation: "This is a good password that provides solid protection against most attack methods.",
        benefits: [
          "Resistant to brute force attacks",
          "Good character variety",
          "Reasonable entropy",
          "Suitable for most accounts"
        ],
        immediate: "This password is safe to use on most accounts."
      },
      "Very Strong": {
        explanation: "Excellent password strength that provides robust protection against sophisticated attacks.",
        benefits: [
          "Highly resistant to attacks",
          "Excellent entropy",
          "Strong character variety",
          "Suitable for high-security accounts"
        ],
        immediate: "This password provides excellent security for any account."
      },
      "Exceptional": {
        explanation: "Outstanding password strength that offers maximum security protection.",
        benefits: [
          "Maximum security protection",
          "Exceptional entropy",
          "Optimal character variety",
          "Ideal for critical accounts"
        ],
        immediate: "This password provides maximum security for critical accounts."
      }
    };
  }

  // Provide real-time guidance based on password analysis
  provideGuidance(analysis, userQuestion = null) {
    const guidance = {
      immediate: [],
      detailed: [],
      tips: [],
      questionAnswer: null
    };

    // Immediate guidance based on strength
    if (analysis.strength && this.strengthExplanations[analysis.strength]) {
      const strengthInfo = this.strengthExplanations[analysis.strength];
      guidance.immediate.push(strengthInfo.immediate);
      guidance.detailed.push(strengthInfo.explanation);
      
      if (analysis.strength === 'Very Weak' || analysis.strength === 'Weak') {
        guidance.immediate.push('🚨 Do not use this password for any important accounts!');
        guidance.tips.push('💡 Use our password generator to create a strong password');
      }
    }

    // Specific feedback guidance
    if (analysis.feedback) {
      analysis.feedback.forEach(feedback => {
        if (feedback.includes('❌')) {
          guidance.immediate.push(feedback);
        } else if (feedback.includes('⚠️')) {
          guidance.detailed.push(feedback);
        }
      });
    }

    // Suggestions guidance
    if (analysis.suggestions) {
      guidance.tips.push(...analysis.suggestions);
    }

    // Answer user question if provided
    if (userQuestion) {
      guidance.questionAnswer = this.answerQuestion(userQuestion);
    }

    // Add general security tips
    guidance.tips.push(...this.getRandomSecurityTips(3));

    return guidance;
  }

  // Answer common security questions
  answerQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Check knowledge base for matches
    for (const [key, info] of Object.entries(this.knowledgeBase)) {
      if (lowerQuestion.includes(key.replace(/([A-Z])/g, ' $1').toLowerCase()) ||
          lowerQuestion.includes(info.question.toLowerCase().split(' ').slice(0, 3).join(' '))) {
        return {
          question: info.question,
          answer: info.answer,
          tips: info.tips,
          source: 'Security Knowledge Base'
        };
      }
    }

    // Handle common question patterns
    if (lowerQuestion.includes('safe') || lowerQuestion.includes('secure')) {
      return {
        question: "Is this password safe?",
        answer: "Password safety depends on multiple factors including length, complexity, uniqueness, and the context in which it's used. Our analysis tool evaluates these factors to give you a comprehensive assessment.",
        tips: [
          "Use our strength checker to evaluate passwords",
          "Consider the account's importance when choosing password strength",
          "Regular security audits help maintain safety"
        ],
        source: 'Security Assessment'
      };
    }

    if (lowerQuestion.includes('hack') || lowerQuestion.includes('crack')) {
      return {
        question: "How long would it take to hack this password?",
        answer: "The time to crack a password depends on its complexity, length, and the attacker's resources. Our tool estimates this based on entropy calculations and current attack capabilities.",
        tips: [
          "Longer passwords take exponentially longer to crack",
          "Complexity adds significant time to cracking attempts",
          "Unique passwords prevent credential stuffing attacks"
        ],
        source: 'Security Analysis'
      };
    }

    if (lowerQuestion.includes('generate') || lowerQuestion.includes('create')) {
      return {
        question: "How do I create a strong password?",
        answer: "Strong passwords combine length, complexity, and uniqueness. Use our password generator or create memorable passphrases with mixed character types.",
        tips: [
          "Use our built-in password generator",
          "Create memorable passphrases",
          "Mix different character types",
          "Avoid personal information"
        ],
        source: 'Password Creation Guide'
      };
    }

    // Default response for unrecognized questions
    return {
      question: question,
      answer: "I'm here to help with password security questions! Try asking about password managers, two-factor authentication, password strength, or general security best practices.",
      tips: [
        "Ask about specific security topics",
        "Use our password strength checker",
        "Review our security tips",
        "Check our knowledge base"
      ],
      source: 'Security Advisor'
    };
  }

  // Get random security tips
  getRandomSecurityTips(count = 3) {
    const shuffled = [...this.securityTips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Provide contextual advice based on password characteristics
  getContextualAdvice(password, analysis) {
    const advice = [];

    // Length-based advice
    if (password.length < 8) {
      advice.push({
        type: 'critical',
        message: '🚨 This password is too short for any account',
        explanation: 'Passwords under 8 characters can be cracked almost instantly'
      });
    } else if (password.length < 12) {
      advice.push({
        type: 'warning',
        message: '⚠️ Consider increasing length for better security',
        explanation: '12+ characters provide significantly better protection'
      });
    }

    // Character variety advice
    const charTypes = 0 + 
      (/[a-z]/.test(password) ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

    if (charTypes < 3) {
      advice.push({
        type: 'warning',
        message: '💡 Adding more character types improves security',
        explanation: 'Mix letters, numbers, and symbols for better protection'
      });
    }

    // Pattern-based advice
    if (/(.)\1{2,}/.test(password)) {
      advice.push({
        type: 'warning',
        message: '🔄 Avoid repeated characters',
        explanation: 'Patterns like "aaa" make passwords easier to guess'
      });
    }

    if (/123|abc|qwe/i.test(password)) {
      advice.push({
        type: 'critical',
        message: '🚨 Common sequences detected',
        explanation: 'Sequential patterns are among the first things attackers try'
      });
    }

    return advice;
  }

  // Provide educational content about password security
  getEducationalContent(topic = 'general') {
    const content = {
      general: {
        title: "Password Security Fundamentals",
        sections: [
          {
            title: "Why Password Security Matters",
            content: "Passwords are your first line of defense against unauthorized access to your accounts. Weak passwords can lead to identity theft, financial loss, and privacy breaches."
          },
          {
            title: "Common Attack Methods",
            content: "Attackers use various methods including brute force attacks, dictionary attacks, social engineering, and credential stuffing to compromise weak passwords."
          },
          {
            title: "Password Strength Factors",
            content: "Password strength depends on length, complexity, uniqueness, and resistance to common patterns and dictionary words."
          }
        ]
      },
      entropy: {
        title: "Understanding Password Entropy",
        sections: [
          {
            title: "What is Entropy?",
            content: "Entropy measures the randomness and unpredictability of a password. Higher entropy means the password is harder to guess or crack."
          },
          {
            title: "How Entropy is Calculated",
            content: "We calculate entropy using Shannon's formula, considering the character set size and password length to determine the number of possible combinations."
          },
          {
            title: "Entropy vs. Security",
            content: "While entropy is important, it's just one factor. A password with high entropy but predictable patterns may still be vulnerable."
          }
        ]
      },
      bestPractices: {
        title: "Password Security Best Practices",
        sections: [
          {
            title: "Create Strong Passwords",
            content: "Use at least 12 characters, mix character types, avoid common patterns, and make each password unique."
          },
          {
            title: "Store Passwords Securely",
            content: "Use a reputable password manager with strong encryption and two-factor authentication enabled."
          },
          {
            title: "Regular Maintenance",
            content: "Change passwords regularly, especially after security incidents, and monitor accounts for suspicious activity."
          }
        ]
      }
    };

    return content[topic] || content.general;
  }

  // Get agent information
  getInfo() {
    return {
      name: this.name,
      role: this.role,
      capabilities: this.capabilities,
      type: 'Reactive/Interactive'
    };
  }

  // Get available topics for questions
  getAvailableTopics() {
    return Object.keys(this.knowledgeBase).map(key => ({
      topic: key,
      question: this.knowledgeBase[key].question
    }));
  }
}

export default SecurityAdvisorAgent;
