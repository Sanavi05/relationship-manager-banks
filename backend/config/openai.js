require('dotenv').config();

let openaiClient = null;

// Try to initialize OpenAI if API key exists
if (process.env.OPENAI_API_KEY) {
    try {
        const OpenAI = require('openai');
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    } catch (err) {
        console.warn('OpenAI module not available, using mock responses');
    }
}

// Mock response generator for fallback
const generateMockOutreach = (customer, action) => {
    const greetings = [
        `Hello ${customer.name},`,
        `Hi ${customer.name},`,
        `Dear ${customer.name},`,
    ];

    const mainMessages = {
        'Call + Special Offer': `We've noticed you're a valued member of our banking family. To thank you for your continued trust, we'd like to offer you an exclusive 0.5% interest rate boost on your savings account for the next 6 months. Our relationship manager would love to discuss this with you personally. Could we schedule a quick call this week?`,
        'Email + Incentive': `As an appreciated customer, we want to ensure your banking experience is exceptional. We have a special offer available for you: a waived monthly fee on checking accounts for 3 months, plus exclusive access to our premium features. Let us know if you'd like to learn more!`,
        'Monitor': `We're here to support your financial goals. If you need any assistance with your accounts or have questions about our services, please don't hesitate to reach out. Our team is always ready to help.`,
    };

    const closings = [
        'Best regards,\nThe Relationship Manager Team',
        'Warm regards,\nYour Banking Partner',
        'Sincerely,\nOur Customer Care Team',
    ];

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const message = mainMessages[action] || mainMessages['Monitor'];
    const closing = closings[Math.floor(Math.random() * closings.length)];

    return `${greeting}\n\n${message}\n\n${closing}`;
};

// Public function to generate outreach
const generateOutreach = async (customer, risks, recommendedAction) => {
    if (!openaiClient) {
        // Use mock response
        return generateMockOutreach(customer, recommendedAction);
    }

    try {
        const prompt = `
You are a professional banking relationship manager. Generate a personalized, warm outreach message to the following customer based on their profile and identified risks.

Customer: ${customer.name}
Account Balance: $${customer.account_balance}
Identified Risks: ${risks.join(', ')}
Recommended Action: ${recommendedAction}

Requirements:
- Be warm and professional
- Reference their specific situation
- Offer relevant solutions or support
- Keep it concise (3-4 sentences)
- Use a banking-appropriate tone

Generate the message now:
`;

        const response = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error('OpenAI API error:', err.message);
        // Fallback to mock on error
        return generateMockOutreach(customer, recommendedAction);
    }
};

module.exports = {
    generateOutreach,
    hasOpenAI: () => openaiClient !== null,
};
