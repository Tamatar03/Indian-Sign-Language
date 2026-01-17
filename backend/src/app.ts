import fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const server = fastify({ logger: true });
const prisma = new PrismaClient();

server.register(cors, {
    origin: true
});

server.get('/', async (request, reply) => {
    return { status: 'OK', message: 'ISL API is running' };
});

const start = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server is running on http://localhost:3000');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
