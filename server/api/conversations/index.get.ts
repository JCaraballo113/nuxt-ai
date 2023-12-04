import protectRoute from '~/server/protectRoute';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    await protectRoute(event);
    const {
        _user: { id: user_id },
    } = event.context;

    const conversations = await prisma.conversation.findMany({
        where: {
            user_id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return conversations;
});
