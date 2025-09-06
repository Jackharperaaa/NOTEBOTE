const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const aiService = {
  async generateResponse(message: string): Promise<string> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://bolt-notes-extension.com',
          'X-Title': 'BOLT NOTES Extension',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3.1:free',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates organized checklists and step-by-step guides. Always respond with clear, actionable items that can be used as tasks. Format your response as a simple list with each item on a new line.'
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response:', data);
        throw new Error('Invalid response format from API');
      }

      return data.choices[0].message.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('AI service error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Network error: Please check your internet connection and try again.';
      }
      
      if (error instanceof Error && error.message.includes('401')) {
        return 'Authentication error: Please check the API key configuration.';
      }
      
      if (error instanceof Error && error.message.includes('429')) {
        return 'Rate limit exceeded: Please wait a moment and try again.';
      }
      
      return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }
  },

  async generateNoteFromPrompt(prompt: string): Promise<{ title: string; tasks: string[] }> {
    try {
      const response = await this.generateResponse(
        `Create a detailed checklist for: ${prompt}. 

Instructions:
1. First line should be a clear title (without "Title:" prefix)
2. Then list each step as a separate task
3. Each task should be actionable and specific
4. Use simple language
5. Maximum 10 tasks

Format:
Title Here
- Task 1
- Task 2
- Task 3`
      );

      const lines = response.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('Empty response from AI');
      }

      // First non-empty line is the title
      const title = this.extractTitle(prompt, lines[0]);
      
      // Remaining lines are tasks
      const tasks = lines
        .slice(1)
        .filter(line => line.trim())
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(task => task.length > 0 && task.length < 200); // Reasonable task length

      // If no tasks found, create a basic one
      if (tasks.length === 0) {
        tasks.push('Complete the task');
      }

      return { title, tasks };
    } catch (error) {
      console.error('Error generating note:', error);
      
      // Fallback response
      return {
        title: this.extractTitle(prompt, ''),
        tasks: ['Complete this task', 'Review and finalize']
      };
    }
  },

  extractTitle(prompt: string, firstLine: string): string {
    // Clean the first line if it exists
    if (firstLine && firstLine.trim()) {
      const cleanFirstLine = firstLine
        .replace(/^#+\s*/, '') // Remove markdown headers
        .replace(/^title:\s*/i, '') // Remove "Title:" prefix
        .replace(/^[-*•]\s*/, '') // Remove list markers
        .trim();
      
      if (cleanFirstLine.length > 0 && cleanFirstLine.length < 100) {
        return cleanFirstLine;
      }
    }
    
    // Extract from prompt as fallback
    const cleanPrompt = prompt
      .replace(/create|make|give me|help with|show me/gi, '')
      .replace(/checklist|steps|routine|guide|todo|tasks|plan/gi, '')
      .trim();
    
    if (cleanPrompt.length > 0 && cleanPrompt.length < 50) {
      return cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1);
    }
    
    // Final fallback
    return 'AI Generated Checklist';
  }
};