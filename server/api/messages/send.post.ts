import protectRoute from '~/server/protectRoute';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    await protectRoute(event);
    const { content, conversation } = await readBody(event);

    return prisma.message.create({
        data: {
            role: 'user',
            content,
            conversation: {
                connect: {
                    id: conversation,
                },
            },
        },
    });
});
