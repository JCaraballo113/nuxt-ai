import { OpenAI } from 'langchain/llms/openai';

const buildLLM = (streaming: boolean) => {
    return new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY as string,
        streaming,
    });
};

export default buildLLM;
