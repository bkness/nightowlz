/**
 * Manually verify (or unverify) a bar so its owner can publish events.
 *
 * Usage:
 *   node scripts/verifyBar.js <barId>            # verify
 *   node scripts/verifyBar.js <barId> --off      # unverify
 *   node scripts/verifyBar.js --list             # list bars + verify status
 *
 * This is the admin "manual flag" for Phase 1 ownership trust. Replace with a
 * proper claim/verification flow later.
 */
const mongoose = require("mongoose");
const connectDB = require("../config/connection");
const Bar = require("../models/Bar");

async function main() {
    const args = process.argv.slice(2);
    await connectDB();

    if (args[0] === "--list") {
        const bars = await Bar.find().select("name location verified ownerId").lean();
        if (bars.length === 0) {
            console.log("No bars registered yet.");
        } else {
            for (const b of bars) {
                console.log(
                    `${b.verified ? "✓" : "·"}  ${b._id}  ${b.name} (${b.location})  owner=${b.ownerId}`,
                );
            }
        }
        await mongoose.disconnect();
        return;
    }

    const barId = args[0];
    const turnOff = args.includes("--off");

    if (!barId) {
        console.error("Usage: node scripts/verifyBar.js <barId> [--off] | --list");
        await mongoose.disconnect();
        process.exit(1);
    }

    const bar = await Bar.findById(barId);
    if (!bar) {
        console.error(`No bar found with id ${barId}`);
        await mongoose.disconnect();
        process.exit(1);
    }

    bar.verified = !turnOff;
    bar.verifiedAt = turnOff ? null : new Date();
    await bar.save();

    console.log(
        `${turnOff ? "Unverified" : "Verified"}: ${bar.name} (${bar._id})`,
    );
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("verifyBar failed:", err.message);
    process.exit(1);
});
