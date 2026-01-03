import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    //Users Table
    users:defineTable({
        name: v.string(),
        tokenIdentifier: v.string(), //clerk id for verification
        email: v.string,
        imageUrl: v.optional(v.string()),

        //Onboarding
        hasCompletedOnboading: v.boolean(),

        //Location
        location: v.optional(
            v.object({
                city: v.string(),
                state: v.optional(v.string()),
                country: v.string(),
            })
        ),
        interests: v.optional(v.array(v.string())), // min 3 categories

        freeEventsCreated: v.number(),

        //Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_token",["tokenIdentifer"]),
})