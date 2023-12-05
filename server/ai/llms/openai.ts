import { OpenAI } from 'langchain/llms/openai';

const buildLLM = (openAIApiKey: string, streaming: boolean) => {
    return new OpenAI({
        openAIApiKey,
        streaming,
    });
};

export default buildLLM;
