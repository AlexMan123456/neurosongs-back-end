const { Visibility } = require("@prisma/client");

module.exports = [
    {
        user_id: "1",
        title: "Captain Kevin",
        reference: "captain-kevin.mp3",
        album_id: 1,
        index: 1,
        is_featured: true,
        description: "He's Captain Kevin, the best there is, he's been collecting treasure for the best of years!",
        created_at: new Date("2024-01-16T00:00:00Z"),
    },
    {
        user_id: "1",
        title: "Place In Society",
        reference: "place-in-society.mp3",
        album_id: 1,
        index: 2,
        created_at: new Date("2024-02-16T00:00:00Z")
    },
    {
        user_id: "1",
        title: "Domination",
        reference: "domination.mp3",
        album_id: 1,
        index: 3,
        created_at: new Date("2024-02-24T00:00:00Z")
    },
    {
        user_id: "1",
        title: "Burnout",
        reference: "burnout.mp3",
        album_id: 1,
        index: 4
    },
    {
        user_id: "1",
        title: "See The Light",
        reference: "see-the-light.mp3",
        album_id: 1,
        index: 5,
        created_at: new Date("2023-12-25T00:00:00Z")
    },
    {
        user_id: "1",
        title: "Fun Times",
        reference: "fun-times.mp3",
        album_id: 2,
        index: 0,
        created_at: new Date("2024-06-25T00:00:00Z")
    },
    {
        user_id: "1",
        title: "Crazy Lab",
        reference: "crazy-lab.mp3",
        album_id: 2,
        index: 0,
        is_featured: true,
        created_at: new Date("2024-06-26T00:00:00Z")
    },
    {
        user_id: "1",
        title: "Thunder Road",
        reference: "thunder-road.mp3",
        index: 0,
        album_id: 2,
        created_at: new Date("2024-06-27T00:00:00Z")
    },
    {
        user_id: "1",
        title: "New Opportunities",
        reference: "new-opportunities.mp3",
        index: 0,
        album_id: 2,
        created_at: new Date("2024-06-28T00:00:00Z")
    },
    {
        user_id: "1",
        title: "Show Them What You've Got",
        reference: "show-them-what-you've-got.mp3",
        album_id: 2,
        is_featured: true,
        index: 0,
        created_at: new Date("2023-10-25T00:00:00Z")
    },
    {
        user_id: "3",
        title: "Captain Kevin (Simulation Mix)",
        reference: "captain-kevin-simulation.mp3",
        album_id: 3,
        index: 1,
        created_at: new Date("2024-01-16T00:00:00Z"),
        visibility: Visibility.restricted
    },
    {
        user_id: "3",
        title: "The Pirate Who Wanted Treasure",
        reference: "the-pirate-who-wanted-treasure.mp3",
        album_id: 3,
        index: 2,
        description: "Heave ho! Heave ho!",
        is_featured: true
    },
    {
        user_id: "3",
        title: "Lockdown",
        reference: "lockdown.mp3",
        album_id: 4,
        index: 1,
        created_at: new Date("2021-12-15T00:00:00Z"),
        visibility: Visibility.unlisted
    },
    {
        user_id: "3",
        title: "Private song",
        reference: "private-song.mp3",
        album_id: 3,
        index: 3,
        description: "Hey! This is my treasure! This treasure can only belong to the one and only Captain Kevin!",
        visibility: Visibility.private
    },
    {
        user_id: "1",
        title: "Private song 1",
        reference: "private-song-1.mp3",
        album_id: 7,
        index: 1,
        description: "Nothing to see here!",
        visibility: Visibility.private
    },
    {
        user_id: "1",
        title: "Private song 2",
        reference: "private-song-2.mp3",
        album_id: 7,
        index: 2,
        description: "Seriously! There's nothing here.",
        visibility: Visibility.private
    },
    {
        user_id: "1",
        title: "Private song 3",
        reference: "private-song-3.mp3",
        album_id: 7,
        index: 3,
        description: "Ok, there are songs here but they're cringe and not worth sharing. Go away.",
        visibility: Visibility.private
    },
]