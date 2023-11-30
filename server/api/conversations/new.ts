import { serverSupabaseUser } from '#supabase/server';
import protectRoute from '~/server/protectRoute';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    await protectRoute(event);
    const {
        _user: { id: user_id },
    } = event.context;

    return prisma.conversation.create({
        data: {
            user_id,
        },
    });
});
