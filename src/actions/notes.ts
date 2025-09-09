"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import geminiModel from "@/gemini";
import { handleError } from "@/lib/utils";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");

    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to ask AI questions");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true }, // ⬅️ removed createdAt/updatedAt to avoid “time” in answers
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes.map((note) => `- ${note.text}`).join("\n");

  // 🔹 Build chat with history
  const chat = geminiModel.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `
You are a helpful assistant that answers questions about a user's notes.
- Only answer based on the notes provided.
- Be succinct, not verbose.
- Always respond with clean, valid HTML only (<p>, <strong>, <ul>, <li>, <h1>-<h6>, <br>).
- Do NOT add metadata like createdAt or updatedAt unless the note text itself mentions it.

Here are the user's notes:
${formattedNotes}
          `.trim(),
          },
        ],
      },
      ...newQuestions.map((q, i) => ({
        role: "user",
        parts: [{ text: q }],
      })),
      ...responses.map((r) => ({
        role: "model",
        parts: [{ text: r }],
      })),
    ],
  });

  // 🔹 Send latest question only (Gemini has full context in history)
  const lastQuestion = newQuestions[newQuestions.length - 1];
  const result = await chat.sendMessage(lastQuestion);

  return result.response.text() || "A problem has occurred";
};
