import protectRoute from '~/server/protectRoute';
import { PrismaClient } from '@prisma/client';
import { ConversationChain } from 'langchain/chains';
import buildLLM from '~/server/ai/llms/openai';
import buildMemory from '~/server/ai/memories/PrismaChatMemory';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    await protectRoute(event);
    const { content, conversation } = await readBody(event);
    const userMessage = await prisma.message.create({
        data: {
            role: 'human',
            content,
            conversation: {
                connect: {
                    id: conversation,
                },
            },
        },
    });

    const llm = buildLLM(true);
    const memory = buildMemory(conversation);
    console.log(await memory.chatHistory.getMessages());
    const conversationChain = new ConversationChain({
        llm,
        memory,
    });
    const result = await conversationChain.call({ input: content });
    console.log(result);

    return userMessage;
});
