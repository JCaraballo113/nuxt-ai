import protectRoute from '~/server/protectRoute';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    await protectRoute(event);
    const { conversation } = getQuery(event);

    return prisma.message.findMany({
        where: {
            conversation: {
                id: conversation as string,
            },
        },
    });
});
