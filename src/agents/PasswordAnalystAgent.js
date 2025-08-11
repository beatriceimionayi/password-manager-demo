// Agent 1: Password Analyst & Generator
// Type: Generative / Data-processing
// Role: Technical password analysis and generation

class PasswordAnalystAgent {
  constructor() {
    this.name = "Password Analyst Agent";
    this.role = "Technical Analysis & Generation";
    this.capabilities = [
      "Password strength evaluation",
      "Entropy calculation",
      "Pattern detection",
      "Secure password generation",
      "Technical recommendations"
    ];
  }

  // Advanced password strength analysis with entropy calculation
  analyzePassword(password) {
    if (!password || password.length === 0) {
      return {
        score: 0,
        strength: 'No Password',
        entropy: 0,
        feedback: [],
        technicalDetails: {},
        suggestions: []
      };
    }

    const analysis = {
      score: 0,
      strength: '',
      entropy: this.calculateEntropy(password),
      feedback: [],
      technicalDetails: {},
      suggestions: []
    };

    // Length analysis
    const lengthScore = this.analyzeLength(password);
    analysis.score += lengthScore.points;
    analysis.feedback.push(...lengthScore.feedback);

    // Character variety analysis
    const varietyScore = this.analyzeCharacterVariety(password);
    analysis.score += varietyScore.points;
    analysis.feedback.push(...varietyScore.feedback);

    // Pattern analysis
    const patternScore = this.analyzePatterns(password);
    analysis.score += patternScore.points;
    analysis.feedback.push(...patternScore.feedback);

    // Dictionary and common password analysis
    const dictScore = this.analyzeDictionary(password);
    analysis.score += dictScore.points;
    analysis.feedback.push(...dictScore.feedback);

    // Entropy-based scoring
    const entropyScore = this.scoreByEntropy(analysis.entropy);
    analysis.score += entropyScore.points;
    analysis.feedback.push(...entropyScore.feedback);

    // Determine strength level
    analysis.strength = this.determineStrength(analysis.score);
    
    // Generate technical details
    analysis.technicalDetails = this.generateTechnicalDetails(password, analysis);
    
    // Generate suggestions
    analysis.suggestions = this.generateSuggestions(analysis);

    return analysis;
  }

  calculateEntropy(password) {
    const charSet = new Set(password);
    const uniqueChars = charSet.size;
    const length = password.length;
    
    // Calculate entropy using Shannon's formula
    const entropy = Math.log2(Math.pow(uniqueChars, length));
    return Math.round(entropy * 100) / 100;
  }

  analyzeLength(password) {
    const length = password.length;
    let points = 0;
    const feedback = [];

    if (length >= 8) {
      points += 1;
      feedback.push('✅ Minimum length requirement met (8+ characters)');
    } else {
      feedback.push('❌ Password too short - minimum 8 characters recommended');
    }

    if (length >= 12) {
      points += 1;
      feedback.push('✅ Good length (12+ characters)');
    }

    if (length >= 16) {
      points += 1;
      feedback.push('✅ Excellent length (16+ characters)');
    }

    if (length >= 20) {
      points += 1;
      feedback.push('✅ Exceptional length (20+ characters)');
    }

    return { points, feedback };
  }

  analyzeCharacterVariety(password) {
    let points = 0;
    const feedback = [];
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (hasLower) {
      points += 1;
      feedback.push('✅ Contains lowercase letters');
    } else {
      feedback.push('❌ Missing lowercase letters (a-z)');
    }

    if (hasUpper) {
      points += 1;
      feedback.push('✅ Contains uppercase letters');
    } else {
      feedback.push('❌ Missing uppercase letters (A-Z)');
    }

    if (hasNumbers) {
      points += 1;
      feedback.push('✅ Contains numbers');
    } else {
      feedback.push('❌ Missing numbers (0-9)');
    }

    if (hasSpecial) {
      points += 1;
      feedback.push('✅ Contains special characters');
    } else {
      feedback.push('❌ Missing special characters (!@#$%^&*)');
    }

    // Bonus for mixed case
    if (hasLower && hasUpper) {
      points += 1;
      feedback.push('✅ Mixed case implementation');
    }

    return { points, feedback };
  }

  analyzePatterns(password) {
    let points = 0;
    const feedback = [];

    // Check for repeated characters
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('❌ Contains repeated characters (e.g., "aaa")');
    } else {
      points += 1;
      feedback.push('✅ No repeated character patterns');
    }

    // Check for sequential patterns
    if (/123|abc|qwe|asd|zxcv/i.test(password)) {
      feedback.push('❌ Contains sequential patterns (e.g., "123", "abc")');
    } else {
      points += 1;
      feedback.push('✅ No sequential patterns detected');
    }

    // Check for keyboard patterns
    if (/qwerty|asdfgh|zxcvbn/i.test(password)) {
      feedback.push('❌ Contains keyboard patterns (e.g., "qwerty")');
    } else {
      points += 1;
      feedback.push('✅ No keyboard patterns detected');
    }

    // Check for common substitutions
    if (/p@ssw0rd|p@55w0rd|p@ssw0rd123/i.test(password)) {
      feedback.push('❌ Contains common character substitutions');
    } else {
      points += 1;
      feedback.push('✅ No common substitutions detected');
    }

    return { points, feedback };
  }

  analyzeDictionary(password) {
    let points = 0;
    const feedback = [];

    const commonWords = [
      'password', 'admin', 'user', 'login', 'welcome', 'hello', 'test',
      'guest', 'demo', 'sample', 'default', 'root', 'master', 'super',
      'love', 'hate', 'good', 'bad', 'yes', 'no', 'ok', 'cool', 'nice'
    ];

    const commonSequences = [
      '123', '1234', '12345', '123456', '1234567', '12345678',
      'abc', 'abcd', 'abcde', 'abcdef', 'qwe', 'qwer', 'qwert'
    ];

    const lowerPassword = password.toLowerCase();
    
    // Check for common words
    const hasCommonWord = commonWords.some(word => 
      lowerPassword.includes(word)
    );
    
    if (hasCommonWord) {
      feedback.push('❌ Contains common dictionary words');
    } else {
      points += 1;
      feedback.push('✅ No common dictionary words detected');
    }

    // Check for common sequences
    const hasCommonSequence = commonSequences.some(seq => 
      lowerPassword.includes(seq)
    );
    
    if (hasCommonSequence) {
      feedback.push('❌ Contains common character sequences');
    } else {
      points += 1;
      feedback.push('✅ No common sequences detected');
    }

    return { points, feedback };
  }

  scoreByEntropy(entropy) {
    let points = 0;
    const feedback = [];

    if (entropy >= 64) {
      points += 2;
      feedback.push('✅ Exceptional entropy (64+ bits)');
    } else if (entropy >= 48) {
      points += 1;
      feedback.push('✅ High entropy (48+ bits)');
    } else if (entropy >= 32) {
      points += 1;
      feedback.push('✅ Good entropy (32+ bits)');
    } else if (entropy >= 16) {
      feedback.push('⚠️ Moderate entropy (16+ bits)');
    } else {
      feedback.push('❌ Low entropy (< 16 bits)');
    }

    return { points, feedback };
  }

  determineStrength(score) {
    if (score <= 3) return 'Very Weak';
    if (score <= 6) return 'Weak';
    if (score <= 9) return 'Fair';
    if (score <= 12) return 'Strong';
    if (score <= 15) return 'Very Strong';
    return 'Exceptional';
  }

  generateTechnicalDetails(password, analysis) {
    return {
      length: password.length,
      uniqueCharacters: new Set(password).size,
      characterTypes: {
        lowercase: (password.match(/[a-z]/g) || []).length,
        uppercase: (password.match(/[A-Z]/g) || []).length,
        numbers: (password.match(/[0-9]/g) || []).length,
        special: (password.match(/[^A-Za-z0-9]/g) || []).length
      },
      entropy: analysis.entropy,
      estimatedCrackTime: this.estimateCrackTime(analysis.entropy),
      complexity: this.calculateComplexity(password)
    };
  }

  estimateCrackTime(entropy) {
    // Rough estimation based on entropy
    const attemptsPerSecond = 1000000000; // 1 billion attempts per second
    const totalCombinations = Math.pow(2, entropy);
    const seconds = totalCombinations / attemptsPerSecond;
    
    if (seconds < 60) return 'Less than a minute';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return `${Math.round(seconds / 31536000)} years`;
  }

  calculateComplexity(password) {
    const length = password.length;
    const uniqueChars = new Set(password).size;
    const variety = 0 + 
      (/[a-z]/.test(password) ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
    
    return Math.round((length * uniqueChars * variety) / 10);
  }

  generateSuggestions(analysis) {
    const suggestions = [];

    if (analysis.score < 6) {
      suggestions.push('🔴 This password needs significant improvement');
      suggestions.push('💡 Consider using our password generator');
      suggestions.push('📚 Review our security tips below');
    } else if (analysis.score < 10) {
      suggestions.push('🟡 This password is acceptable but could be stronger');
      suggestions.push('💡 Consider adding more character variety');
    } else {
      suggestions.push('🟢 This is a strong password!');
      suggestions.push('💡 Consider using it for important accounts');
    }

    // Specific suggestions based on feedback
    if (analysis.feedback.some(f => f.includes('Missing lowercase'))) {
      suggestions.push('➕ Add lowercase letters (a-z)');
    }
    if (analysis.feedback.some(f => f.includes('Missing uppercase'))) {
      suggestions.push('➕ Add uppercase letters (A-Z)');
    }
    if (analysis.feedback.some(f => f.includes('Missing numbers'))) {
      suggestions.push('➕ Add numbers (0-9)');
    }
    if (analysis.feedback.some(f => f.includes('Missing special'))) {
      suggestions.push('➕ Add special characters (!@#$%^&*)');
    }
    if (analysis.feedback.some(f => f.includes('too short'))) {
      suggestions.push('📏 Increase password length to at least 12 characters');
    }

    return suggestions;
  }

  // Generate customizable strong passwords
  generatePassword(options = {}) {
    const {
      length = 16,
      includeLowercase = true,
      includeUppercase = true,
      includeNumbers = true,
      includeSpecial = true,
      excludeSimilar = true,
      excludeAmbiguous = true
    } = options;

    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Remove similar characters if requested
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

              // Remove ambiguous characters if requested
          if (excludeAmbiguous) {
            charset = charset.replace(/[{}[\]|\\:;"'<>,.?/]/g, '');
          }

    if (charset.length === 0) {
      throw new Error('No character types selected for password generation');
    }

    let password = '';
    
    // Ensure at least one character from each selected type
    if (includeLowercase) password += charset.charAt(Math.floor(Math.random() * 26));
    if (includeUppercase) password += charset.charAt(26 + Math.floor(Math.random() * 26));
    if (includeNumbers) password += charset.charAt(52 + Math.floor(Math.random() * 10));
    if (includeSpecial) password += charset.charAt(62 + Math.floor(Math.random() * 32));

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
  }

  // Get agent information
  getInfo() {
    return {
      name: this.name,
      role: this.role,
      capabilities: this.capabilities,
      type: 'Generative/Data Processing'
    };
  }
}

export default PasswordAnalystAgent;
