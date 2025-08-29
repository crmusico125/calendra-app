"use server"
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z, { success } from "zod";

 // Marks this file as a server action file - required for Next.js app

export async function createEvent(
    unsafeData: z.infer<typeof eventFormSchema>

): Promise<void> {
    try {
        const { userId } = await auth();
        const { success, data } = eventFormSchema.safeParse(unsafeData);

        if (!success || !userId) {
            throw new Error("Invalid event data or user not authenticated");
        }
    
        await db.insert(EventTable).values({...data, clerkUserId: userId}).returning();
    } catch (error: any) {
        throw new Error(`Failed to create event: ${error.message || error}`);
    } finally { 
        revalidatePath("/events");
    }
}

export async function updateEvent(
    id: string,
    unsafeData: z.infer<typeof eventFormSchema>
): Promise<void> {
    try {
        const { userId } = await auth();
        const { success, data } = eventFormSchema.safeParse(unsafeData);

        if (!success || !userId) {
            throw new Error("Invalid event data or user not authenticated");
        }
    
        const { rowCount } = await db
            .update(EventTable)
            .set({...data})
            .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

        if (rowCount === 0) {
            throw new Error("Event not found or user not authorized to update this event");
        }
    } catch (error: any) {
        throw new Error(`Failed to create event: ${error.message || error}`);
    } finally { 
        // Revalidate the /events path to reflect the new event
        revalidatePath("/events");
    }
}

export async function deleteEvent(
    id: string
): Promise<void> {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("User not authenticated");
        }
    
        const { rowCount } = await db
            .delete(EventTable)
            .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

        if (rowCount === 0) {
            throw new Error("Event not found or user not authorized to delete this event");
        }
    } catch (error: any) {
        throw new Error(`Failed to create event: ${error.message || error}`);
    } finally { 
        // Revalidate the /events path to reflect the new event
        revalidatePath("/events");
    }
}

// Infer the EventRow type from the EventTable schema 
type EventRow = typeof EventTable.$inferSelect;

export async function getEvents(clerkUserId: string): Promise<EventRow[]> {
    const events = await db.query.EventTable.findMany({
        where: ({clerkUserId: userIdCol }, { eq}) => eq(userIdCol, clerkUserId),

        orderBy: ({ name }, { asc, sql }) => [sql`lower(${name})`],
    });
    return events;
}