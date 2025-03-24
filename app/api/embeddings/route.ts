import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, input, model = 'text-embedding-3-small' } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    if (!input) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.embeddings.create({
      model,
      input,
    });

    return NextResponse.json(response);
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate embeddings';
    console.error('OpenAI Embeddings API error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}