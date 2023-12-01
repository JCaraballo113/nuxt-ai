import { OpenAI } from 'langchain/llms/openai';

const buildLLM = (apiKey: string) => {
    return new OpenAI({
        openAIApiKey: apiKey,
    });
};

export default buildLLM;
