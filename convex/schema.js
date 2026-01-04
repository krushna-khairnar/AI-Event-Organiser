import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    //Users Table
    users:defineTable({
        name: v.string(),
        tokenIdentifier: v.string(), //clerk id for verification
        email: v.string(),
        imageUrl: v.optional(v.string()),

        //Onboarding
        hasCompletedOnboading: v.optional(v.boolean()),

        //Location
        location: v.optional(
            v.object({
                city: v.string(),
                state: v.optional(v.string()),
                country: v.string(),
            })
        ),
        interests: v.optional(v.array(v.string())), // min 3 categories

        // Free users can create 1 free event 
        freeEventsCreated: v.number(),

        //Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_token",["tokenIdentifier"]),


    // Events Table
    events: defineTable({
        title: v.string(),
        description: v.string(),
        slug: v.string(),

        // Organizer
        organizerId: v.id("users"), // foreign key to users table
        organizerName: v.string(),

        // Event Details
        category: v.string(),
        tags: v.array(v.string()),

        // Date and Time
        startDate: v.number(),
        endDate: v.number(),
        timezone: v.string(),

        // Location
        locationType: v.union(v.literal("physical"), v.literal("online")),
        venue: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.string(),
        state: v.optional(v.string()),

        // Capacity and Ticketing
        capacity: v.number(),
        ticketType: v.union(v.literal("free"), v.literal("paid")),
        ticketPrice: v.optional(v.number()),
        registrationCount: v.number(),

        // Customization
        coverImage: v.optional(v.string()),
        themeColor: v.optional(v.string()),

        //Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
    })
    .index("by_organizer", ["organizerId"])
    .index("by_category", ["category"])
    .index("by_start_date", ["startDate"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", { searchField: "title" }),

    // Registrations Table
    registrations: defineTable({
        eventId: v.id("events"), // foreign key to events table
        userId: v.id("users"),  // foreign key to users table

        // Attendee info
        attendeeName: v.string(),
        attendeeEmail: v.string(),

        // QR code for entry
        qrCode: v.string(), // unique id for QR

        // Check-in
        checkedIn: v.boolean(),
        checkedInAt: v.optional(v.number()),

        // Status
        status: v.union(v.literal("confirmed"), v.literal("cancelled")),

        registeredAt: v.number(),
    })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_qr_code", ["qrCode"]),
})