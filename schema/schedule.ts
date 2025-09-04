import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { timeToFloat } from "@/lib/utils";
import { z }  from "zod";

export const scheduleFormSchema = z.object({

    timezone: z.string().min(1, "Required"),

    availabilities: z.array(
        z.object({
            dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
            startTime: z.string()
                .regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in the format HH:MM"),
            endTime: z.string()
                .regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in the format HH:MM"),
        })
    )
    .superRefine((availabilities, ctx) => {
        availabilities.forEach((availability, index) => {
            const overlaps = availabilities.some((otherAvailability, otherIndex) => {
                return (
                    index !== otherIndex &&
                    availability.dayOfWeek === otherAvailability.dayOfWeek &&
                    timeToFloat(availability.startTime) < timeToFloat(otherAvailability.endTime) &&
                    timeToFloat(availability.endTime) > timeToFloat(otherAvailability.startTime)
                )
            })

            if (overlaps) {
                ctx.addIssue({
                    code: "custom",
                    message: "Availability overlaps with another",
                    path: [index, "startTime"], // point to the startTime field of the overlapping availability
                });
            }

            if (timeToFloat(availability.endTime) <= timeToFloat(availability.startTime)) {
                ctx.addIssue({
                    code: "custom",
                    message: "End time must be after start time",
                    path: [index, "endTime"], // point to the endTime field
                });
            }
        })
    })
});