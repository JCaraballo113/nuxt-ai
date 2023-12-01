import { ChatMessageHistory, BufferMemory } from 'langchain/memory';
import {
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
} from 'langchain/schema';
import { PrismaClient, Message as PrismaMessage } from '@prisma/client';

const prisma = new PrismaClient();

class PrismaMessageHistory extends ChatMessageHistory {
    private conversation: string;
    constructor(conversationId: string, messages?: BaseMessage[]) {
        super(messages);
        this.conversation = conversationId;
    }

    serializePrismaMessage(message: PrismaMessage) {
        switch (message.role) {
            case 'human':
                return new HumanMessage(message.content);
            case 'system':
                return new SystemMessage(message.content);
            case 'ai':
                return new AIMessage(message.content);
            default:
                throw new Error(`Unknown message role: ${message.role}`);
        }
    }
    /**
     * Method to get all the messages stored in the ChatMessageHistory
     * instance.
     * @returns Array of stored BaseMessage instances.
     */
    async getMessages(): Promise<BaseMessage[]> {
        const messages: PrismaMessage[] = await prisma.message.findMany({
            where: {
                conversation: {
                    id: this.conversation,
                },
            },
        });

        const serializedMessages = messages.map((message) =>
            this.serializePrismaMessage(message)
        );
        return serializedMessages;
    }
    /**
     * Method to add a new message to the ChatMessageHistory instance.
     * @param message The BaseMessage instance to add.
     * @returns A promise that resolves when the message has been added.
     */
    async addMessage(message: BaseMessage): Promise<void> {
        if (message._getType() === 'ai') {
            await prisma.message.create({
                data: {
                    role: message._getType(),
                    content: message.content as string,
                    conversation: {
                        connect: {
                            id: this.conversation,
                        },
                    },
                },
            });
        }

        return;
    }
}

export default function buildMemory(conversationId: string) {
    return new BufferMemory({
        chatHistory: new PrismaMessageHistory(conversationId),
    });
}
