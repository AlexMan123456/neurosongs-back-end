const { Visibility } = require("@prisma/client");

module.exports = [
    {
        user_id: "1",
        title: "Identities",
        front_cover_reference: "identities-front-cover.png",
        back_cover_reference: "identities-back-cover.png"
    },
    {
        user_id: "1",
        title: "Show Them What You've Got",
        front_cover_reference: "show-them-what-you've-got.png",
        is_featured: true
    },
    {
        user_id: "3",
        title: "Kevin's Greatest Hits",
        front_cover_reference: "captain-kevin.png",
        back_cover_reference: "clown-kevin.png",
        description: "CAPTAIN KEVIN, SEARCHING FOR TREASURE FAR AND WIDE!"
    },
    {
        user_id: "2",
        title: "Lockdown",
        front_cover_reference: "lockdown.png",
        visibility: Visibility.unlisted
    },
    {
        user_id: "1",
        title: "identities Deluxe",
        front_cover_reference: "identities-deluxe-front-cover.png",
        back_cover_reference: "identities-deluxe-back-cover.png"
    },
    {
        user_id: "1",
        title: "Empty album"
    },
    {
        user_id: "1",
        title: "Unlisted album",
        visibility: Visibility.unlisted
    }
]