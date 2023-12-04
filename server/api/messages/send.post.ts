import protectRoute from '~/server/protectRoute';
import { PrismaClient } from '@prisma/client';
import { ConversationChain } from 'langchain/chains';
import buildLLM from '~/server/ai/llms/openai';
import buildMemory from '~/server/ai/memories/PrismaChatMemory';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    await protectRoute(event);
    const { content, conversation, apiKey } = await readBody(event);

    if (apiKey === '') {
        throw createError({
            statusCode: 401,
            message: 'You must provide your API key',
        });
    }
    await prisma.message.create({
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

    const { appSocket } = event.context;

    const llm = buildLLM(apiKey);
    const memory = buildMemory(conversation);

    const conversationChain = new ConversationChain({
        llm,
        memory,
    });
    const { response } = await conversationChain.call(
        { input: content },
        {
            callbacks: [
                {
                    handleLLMNewToken: (token) => {
                        appSocket.emit('conversation-stream', token);
                    },
                },
            ],
        }
    );

    return response;
});
