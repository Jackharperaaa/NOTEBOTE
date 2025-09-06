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
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('AI service error:', error);
      return 'Sorry, there was an error connecting to the AI service. Please try again later.';
    }
  },

  async generateNoteFromPrompt(prompt: string): Promise<{ title: string; tasks: string[] }> {
    const response = await this.generateResponse(
      `Create a detailed checklist for: ${prompt}. Provide a clear title and list each step as a separate task.`
    );

    const lines = response.split('\n').filter(line => line.trim());
    const title = this.extractTitle(prompt, lines[0]);
    const tasks = lines
      .slice(1)
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(task => task.length > 0);

    return { title, tasks };
  },

  extractTitle(prompt: string, firstLine: string): string {
    // Try to extract a clean title from the prompt or response
    const cleanPrompt = prompt.replace(/create|make|give me|help with/gi, '').trim();
    if (cleanPrompt.length > 0 && cleanPrompt.length < 50) {
      return cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1);
    }
    
    // Fallback to first line of response
    const cleanFirstLine = firstLine.replace(/^#+\s*/, '').trim();
    return cleanFirstLine || 'AI Generated Checklist';
  }
};