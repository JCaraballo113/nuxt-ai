import {
    BaseCallbackConfig,
    BaseCallbackHandler,
    NewTokenIndices,
} from 'langchain/callbacks';
import { ConversationChain } from 'langchain/chains';
import { HandleLLMNewTokenCallbackFields } from 'langchain/dist/callbacks/base';
import { ChainValues, LLMResult } from 'langchain/schema';

class Queue {
    items: any = [];

    constructor() {
        this.items = [];
    }

    add<T>(item: T) {
        this.items.push(item);
    }
    next() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
    peek() {
        return this.items[0];
    }
    peekLast() {
        return this.items[this.items.length - 1];
    }
}

class StreamHandler extends BaseCallbackHandler {
    name: string;
    private queue: Queue;

    constructor(queue: Queue) {
        super();
        this.name = 'StreamHandler';
        this.queue = queue;
    }

    handleLLMNewToken(
        token: string,
        idx: NewTokenIndices,
        runId: string,
        parentRunId?: string | undefined,
        tags?: string[] | undefined,
        fields?: HandleLLMNewTokenCallbackFields | undefined
    ) {
        this.queue.add(token);
    }

    handleLLMEnd(
        output: LLMResult,
        runId: string,
        parentRunId?: string | undefined,
        tags?: string[] | undefined
    ) {
        this.queue.add(null);
    }
}

class StreamableChain extends ConversationChain {
    override async *stream(
        input: ChainValues,
        options?: Partial<BaseCallbackConfig> | undefined
    ): any {
        const queue: Queue = new Queue();
        const handler = new StreamHandler(queue);

        await this.call(input, {
            callbacks: [handler],
        });

        while (true) {
            const next = queue.next();

            if (next === null) {
                break;
            }

            yield next;
        }
    }
}
