import prisma from '../lib/prisma.js';

export async function enablePgvector() {
  try {
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`;
    console.log('pgvector extension enabled successfully.');

  } catch (error) {
    console.error('Error enabling pgvector extension:', error);
  }
}