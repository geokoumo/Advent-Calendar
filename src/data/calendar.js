/* ============================================================================
 *  THE 25 DAYS — this is the only file you need to edit for daily content.
 *
 *  HOW TO PERSONALISE
 *  • Every text marked with ✎ in a comment, or containing "[PLACEHOLDER]",
 *    is meant to be replaced with your own words.
 *  • PHOTOS: drop files into /public/photos (e.g. public/photos/day-03.jpg)
 *    and set   src: '/photos/day-03.jpg'.  While `src` is null, an elegant
 *    placeholder frame is shown instead — nothing ever looks broken.
 *    Tip: export photos at ~1600px on the long edge, JPEG quality ~80.
 *  • VIDEOS: put an .mp4 in /public/videos and set  src: '/videos/day-11.mp4',
 *    or use a YouTube/Vimeo *embed* URL with  embed: 'https://www.youtube-nocookie.com/embed/ID'.
 *  • SONGS: paste a Spotify / Apple Music / YouTube link into `link`.
 *  • Unlock dates are computed automatically from `day` + CALENDAR_YEAR
 *    (see config.js). You never have to touch dates.
 *
 *  CONTENT TYPES (the `type` field)
 *    letter · photo · video · song · gift · coupon · date · game · secret
 *    dream · reasons · finale
 *  Each one is documented at its first use below.
 *
 *  OPTIONAL FIELDS on any day
 *    memory: false                 → don't show this day in "Our Memories"
 *    memory: { image, description } → override how it appears there
 *    special: true                 → gold "special" tile on the calendar
 * ========================================================================== */

const photo = (caption, opts = {}) => ({ src: null, alt: caption, caption, ...opts });

export const DAYS = [
  /* ---------------------------------------------------------------------- *
   * type: 'letter'
   * content: { greeting, body: [paragraphs], signature, dateLine?, variant? }
   * variant: 'letter' (default) | 'note' (small card) | 'comfort' | 'eve'
   * ---------------------------------------------------------------------- */
  {
    day: 1,
    title: 'A Little Hello',
    subtitle: 'Where it all begins',
    teaser: 'I have something to tell you…',
    type: 'letter',
    content: {
      greeting: 'My love,',
      body: [
        '[PLACEHOLDER] Welcome to the first day of December — and to something I’ve been quietly making for you for weeks.',
        'Every morning until Christmas, a little door will open here. Some days it’s a letter, some days a photo, some days something you can hold in your hands. A few of them are hiding things. You’ll see.',
        'None of it is very big. All of it is ours.',
        'So make a cup of something warm, and let’s begin.',
      ],
      signature: 'With all my love',
    },
  },
  {
    day: 2,
    title: 'One of My Favourite Things',
    subtitle: 'A small note',
    teaser: 'Just one thing. There are many more.',
    type: 'letter',
    content: {
      variant: 'note',
      greeting: 'One of my favourite things about you',
      body: [
        '[PLACEHOLDER] The way you laugh at your own joke before you’ve even finished telling it — and how I end up laughing too, without having heard the end.',
      ],
      signature: '— me',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'photo'
   * content: { intro?, photos: [{ src, alt, caption, date? }], story? }
   * One photo = big polaroid. Several = swipeable gallery.
   * ---------------------------------------------------------------------- */
  {
    day: 3,
    title: 'A Memory',
    subtitle: 'One of our favourite moments',
    teaser: 'Do you remember this one?',
    type: 'photo',
    content: {
      intro: 'Do you remember this day?',
      photos: [photo('[PLACEHOLDER] Us, that evening', { date: 'Summer 2025' })],
      story:
        '[PLACEHOLDER] Write a few lines about what happened that day — what you were wearing, what we were laughing about, the thing you said that I still think about.',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'song'
   * content: { song, artist, why, link?, linkLabel?, embed?, tracks?, playlistLink? }
   * `embed` (optional) is only loaded after she taps — nothing autoplays.
   * ---------------------------------------------------------------------- */
  {
    day: 4,
    title: 'Your Song',
    subtitle: 'Press play when you’re ready',
    teaser: 'Put your headphones on.',
    type: 'song',
    content: {
      song: '[PLACEHOLDER] Song Title',
      artist: 'Artist Name',
      why: [
        '[PLACEHOLDER] Tell her why this is her song. When did you first hear it and think of her? Which line is the one?',
        'Listen to it once all the way through, without doing anything else.',
      ],
      lyric: '“[PLACEHOLDER] The one line that is her.”',
      link: null, // e.g. 'https://open.spotify.com/track/…'
      linkLabel: 'Listen to our song',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'gift'  — a real-world present
   * content: { reveal: 'unwrap' | 'scratch' | 'findHeart', headline, message: [..],
   *            clue?, image?: photo(...) }
   * ---------------------------------------------------------------------- */
  {
    day: 5,
    title: 'A Little Sweetness',
    subtitle: 'Something to unwrap',
    teaser: 'Something sweet is nearby.',
    type: 'gift',
    content: {
      reveal: 'unwrap',
      headline: 'Something sweet for someone sweeter',
      message: ['[PLACEHOLDER] Because some days just need chocolate. Today is one of those days, and I decided it for you.'],
      clue: '[PLACEHOLDER] Look in the pocket of your winter coat.',
    },
  },
  {
    day: 6,
    title: 'Open When You Need a Hug',
    subtitle: 'For a difficult day',
    teaser: 'Keep this one close.',
    type: 'letter',
    content: {
      variant: 'comfort',
      greeting: 'Hey, you.',
      body: [
        '[PLACEHOLDER] If today was heavy, put it down for a minute. You don’t have to fix anything right now.',
        'Breathe in for four. Hold it. Let it go slowly. One more time.',
        'Whatever happened, it doesn’t change a single thing about how I see you. You are still the person I am proudest of.',
        'Now go text me. I mean it.',
      ],
      signature: 'Holding you from wherever I am',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'game'
   * content.game: 'quiz'      → { questions: [{ q, options:[..], answer: index, note? }], result, photo? }
   * content.game: 'challenge' → { intro, steps:[..], doneText }
   * ---------------------------------------------------------------------- */
  {
    day: 7,
    title: 'Our Firsts',
    subtitle: 'A little memory game',
    teaser: 'How well do you remember?',
    type: 'game',
    content: {
      game: 'quiz',
      intro: 'Three little questions about our firsts. No pressure — I already know you’ll win.',
      questions: [
        {
          q: '[PLACEHOLDER] Where did we have our first date?',
          options: ['The little café', 'The cinema', 'A walk by the sea'],
          answer: 0,
          note: 'You ordered the thing I would have ordered.',
        },
        {
          q: '[PLACEHOLDER] What was the first song we danced to?',
          options: ['Song A', 'Song B', 'We didn’t dance, we swayed'],
          answer: 2,
          note: 'Badly. Beautifully.',
        },
        {
          q: '[PLACEHOLDER] Who said “I love you” first?',
          options: ['You', 'Me', 'Both at once'],
          answer: 1,
          note: 'And I have meant it more every day since.',
        },
      ],
      result: 'Every first with you became a favourite.',
      photo: photo('[PLACEHOLDER] Our very first photo together', { date: 'The beginning' }),
    },
  },
  {
    day: 8,
    title: 'A Little Gift',
    subtitle: 'A small surprise',
    teaser: 'Small, but chosen carefully.',
    type: 'gift',
    content: {
      reveal: 'unwrap',
      headline: 'A little something',
      message: ['[PLACEHOLDER] I saw this and thought of you immediately. That happens a lot, actually.'],
      clue: '[PLACEHOLDER] It’s on the second shelf of the bookcase, behind the blue book.',
      image: photo('[PLACEHOLDER] A photo hint of the gift'),
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'coupon'
   * content: { intro, coupons: [{ id, title, description, terms?, expires? }] }
   * If content.choose is true, she picks ONE coupon from the list first.
   * `id` must be unique and should never change once she has the app.
   * ---------------------------------------------------------------------- */
  {
    day: 9,
    title: 'Love Coupon',
    subtitle: 'Redeemable whenever you like',
    teaser: 'Valid for one wonderful thing.',
    type: 'coupon',
    content: {
      intro: 'Keep this safe. When you’re ready to use it, tap redeem and show it to me.',
      coupons: [
        {
          id: 'breakfast-in-bed',
          title: 'Breakfast in Bed',
          description: '[PLACEHOLDER] Coffee exactly how you like it, something warm from the oven, and absolutely no getting up early.',
          terms: 'Valid any weekend morning. Pyjamas mandatory.',
          expires: 'Never',
        },
      ],
    },
  },
  {
    day: 10,
    title: 'Photo Challenge',
    subtitle: 'A new memory, together',
    teaser: 'Today we make a memory.',
    type: 'game',
    content: {
      game: 'challenge',
      intro: 'Today’s gift is something we make together. Complete the list before midnight — or before the weekend, I’m not strict.',
      steps: [
        '[PLACEHOLDER] A photo of us with something sparkly',
        'A selfie with a stranger’s dog (ask first)',
        'Our reflection in a shop window',
        'The best hot chocolate in town',
        'One photo where neither of us is looking at the camera',
      ],
      doneText: 'Challenge complete. Send them all to me — they’re going in the album.',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'video'
   * content: { intro, src?, embed?, poster?, caption, fallbackText: [..] }
   * Never autoplays. If no video is set, the fallback text is shown.
   * ---------------------------------------------------------------------- */
  {
    day: 11,
    title: 'A Few Words',
    subtitle: 'Said out loud',
    teaser: 'Some things are better said.',
    type: 'video',
    content: {
      intro: 'I wanted you to hear this one in my voice.',
      src: null, // e.g. '/videos/day-11.mp4'
      embed: null, // or e.g. 'https://www.youtube-nocookie.com/embed/VIDEO_ID'
      poster: null,
      caption: '[PLACEHOLDER] Recorded on a Tuesday night, three takes.',
      fallbackText: [
        '[PLACEHOLDER] (If you don’t record a video, these words are shown instead.)',
        'You make ordinary days feel like something worth writing down.',
      ],
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'date'  — an invitation
   * content: { invitation, when, where, wear?, bring?, note, rsvp }
   * ---------------------------------------------------------------------- */
  {
    day: 12,
    title: 'Movie Night',
    subtitle: 'You’re invited',
    teaser: 'Clear your evening.',
    type: 'date',
    content: {
      invitation: 'The pleasure of your company is requested for',
      event: 'A Christmas Movie Night',
      when: '[PLACEHOLDER] Saturday, 8 pm',
      where: 'Our sofa, under the big blanket',
      wear: 'Your softest socks',
      bring: 'Nothing. I’ve got popcorn, cocoa, and the good chocolate.',
      note: '[PLACEHOLDER] You choose the film. I promise not to fall asleep. (I will try very hard not to fall asleep.)',
      rsvp: 'I’ll be there',
    },
  },
  {
    day: 13,
    title: 'Somewhere We Went',
    subtitle: 'A little journey back',
    teaser: 'Pack your memories.',
    type: 'photo',
    content: {
      intro: '[PLACEHOLDER] Our trip to …',
      photos: [
        photo('[PLACEHOLDER] The view from the window', { date: 'Day one' }),
        photo('[PLACEHOLDER] That dinner', { date: 'Day two' }),
        photo('[PLACEHOLDER] You, not knowing I took this', { date: 'Day three' }),
      ],
      story: '[PLACEHOLDER] What you remember most about that trip. The wrong turn. The rain. The best meal.',
    },
  },
  {
    day: 14,
    title: 'Why You Are You',
    subtitle: 'A note about you',
    teaser: 'There’s only one of you.',
    type: 'letter',
    content: {
      variant: 'note',
      greeting: 'Why you are you',
      body: [
        '[PLACEHOLDER] You remember the names of everyone’s grandparents. You stop for every cat. You read the last page of a book first and refuse to apologise for it.',
        'Nobody else is like this. I checked.',
      ],
      signature: '— still checking',
    },
  },
  {
    day: 15,
    title: 'A Secret Present',
    subtitle: 'Scratch to find it',
    teaser: 'Something is hidden. Find it.',
    type: 'gift',
    content: {
      reveal: 'scratch',
      headline: 'You found it',
      message: ['[PLACEHOLDER] A secret present needs a secret hiding place.'],
      clue: '[PLACEHOLDER] Look under the second cushion of the sofa.',
    },
  },
  {
    day: 16,
    title: 'Our Playlist',
    subtitle: 'Songs that sound like us',
    teaser: 'Twelve songs, one story.',
    type: 'song',
    content: {
      song: 'Songs That Sound Like Us',
      artist: 'A playlist for you',
      why: ['[PLACEHOLDER] Every song here is attached to a moment. Some you’ll recognise immediately. One or two you’ll have to ask me about.'],
      tracks: [
        { title: '[PLACEHOLDER] First song', artist: 'Artist', note: 'The car, that night' },
        { title: 'Second song', artist: 'Artist', note: 'Your kitchen' },
        { title: 'Third song', artist: 'Artist', note: 'You know why' },
        { title: 'Fourth song', artist: 'Artist' },
        { title: 'Fifth song', artist: 'Artist' },
      ],
      link: null, // e.g. the Spotify playlist URL
      linkLabel: 'Open the playlist',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'dream'
   * content: { eyebrow, place, intro, details: [{ label, text }], closing }
   * ---------------------------------------------------------------------- */
  {
    day: 17,
    title: 'A Dream of Ours',
    subtitle: 'Something for later',
    teaser: 'Not now. But one day.',
    type: 'dream',
    content: {
      eyebrow: 'One day, you and I',
      place: '[PLACEHOLDER] Lisbon in the spring',
      intro: '[PLACEHOLDER] A small dream I have with you. Not a promise with a date — just a place I keep picturing us in.',
      image: photo('[PLACEHOLDER] A picture of the place'),
      details: [
        { label: 'Morning', text: 'Pastries still warm, a window table, nowhere to be.' },
        { label: 'Afternoon', text: 'Getting a little lost on purpose.' },
        { label: 'Evening', text: 'The yellow tram, and a sunset we don’t photograph.' },
      ],
      closing: 'Let’s keep this one somewhere safe.',
    },
  },
  {
    day: 18,
    title: 'Your Choice',
    subtitle: 'Pick our next date',
    teaser: 'You decide. Completely.',
    type: 'coupon',
    content: {
      choose: true,
      intro: 'Pick one. Whatever you choose, I’m in — no complaints, no negotiating.',
      coupons: [
        { id: 'choice-trip', title: 'A Spontaneous Day Trip', description: '[PLACEHOLDER] We pick a direction and go.' },
        { id: 'choice-dinner', title: 'Dinner, Made by Me', description: 'Three courses. Candles. I’ll even clean up.' },
        { id: 'choice-yes-day', title: 'A Day of Yes', description: 'You choose everything, and I say yes.' },
      ],
    },
  },
  {
    day: 19,
    title: 'Open When You Miss Me',
    subtitle: 'For the in-between days',
    teaser: 'For when I’m not right there.',
    type: 'letter',
    content: {
      variant: 'comfort',
      greeting: 'If you’re reading this, you miss me.',
      body: [
        '[PLACEHOLDER] Good. I miss you too. Probably right now, actually.',
        'Here is what I want you to do: put on the jumper I left at yours, play our song, and know that wherever I am, some part of my day is already turned towards you.',
        'Distance is just a number of hours until I see you again.',
      ],
      signature: 'Counting them',
    },
  },
  {
    day: 20,
    title: 'A Cozy Little Date',
    subtitle: 'A winter invitation',
    teaser: 'Wrap up warm.',
    type: 'date',
    content: {
      invitation: 'You are cordially invited to',
      event: 'Lights, Mulled Wine & a Long Walk',
      when: '[PLACEHOLDER] Sunday, just after sunset',
      where: 'The Christmas market, then wherever our feet go',
      wear: 'Your warmest coat and that scarf',
      bring: 'Cold hands. I’ll take care of them.',
      note: '[PLACEHOLDER] I’ll be the one with two cups and a very pleased expression.',
      rsvp: 'Count me in',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'reasons'  — expandable list
   * content: { intro, reasons: [{ title, text }], closing }
   * ---------------------------------------------------------------------- */
  {
    day: 21,
    title: 'Ten Things I Love',
    subtitle: 'Tap each one',
    teaser: 'Ten. For now.',
    type: 'reasons',
    content: {
      intro: 'Ten little things. Open them one at a time.',
      reasons: [
        { title: 'Your laugh', text: '[PLACEHOLDER] Especially the one you try to hold in.' },
        { title: 'Your hands', text: 'Always cold. Always reaching for mine.' },
        { title: 'Your stubbornness', text: 'It’s infuriating. I wouldn’t change it.' },
        { title: 'The way you say my name', text: 'Like it’s a whole sentence.' },
        { title: 'Your kindness', text: 'To waiters, to strangers, to me on bad days.' },
        { title: 'Your sleepy face', text: 'The 7am version of you is my favourite person.' },
        { title: 'Your music taste', text: 'Mostly. Let’s say 80%.' },
        { title: 'How brave you are', text: 'Even when you don’t feel it.' },
        { title: 'Your curiosity', text: 'You ask the question everyone else was thinking.' },
        { title: 'That you chose me', text: 'I still can’t quite believe it.' },
      ],
      closing: 'I could keep going. I will, all year.',
    },
  },
  {
    day: 22,
    title: 'Another Surprise',
    subtitle: 'Find the heart',
    teaser: 'Something is hiding among the ornaments.',
    type: 'gift',
    content: {
      reveal: 'findHeart',
      headline: 'A surprise experience',
      message: ['[PLACEHOLDER] Tomorrow afternoon is booked. Don’t make plans.', 'I’ll tell you nothing else — except to wear comfortable shoes.'],
      clue: 'Be ready at 2 pm.',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'secret'  — a password-protected message
   * content: { prompt, hint, answers: ['accepted', 'answers'], reveal: { title, body:[..] } }
   * Answers are compared case-insensitively, ignoring spaces & punctuation.
   * ---------------------------------------------------------------------- */
  {
    day: 23,
    title: 'Our Little World',
    subtitle: 'Only you know this one',
    teaser: 'You’ll need the password.',
    type: 'secret',
    content: {
      prompt: '[PLACEHOLDER] What do we call the neighbour’s cat?',
      hint: 'It rhymes with “noodle”.',
      answers: ['strudel', 'mr strudel'],
      reveal: {
        title: 'Of course you knew.',
        body: [
          '[PLACEHOLDER] Our little world is made of things nobody else would understand. The cat. The word we made up. The thing we say when the waiter leaves.',
          'I love that we have a language. I love that you’re the only other person who speaks it.',
        ],
      },
    },
  },
  {
    day: 24,
    title: 'Christmas Eve',
    subtitle: 'The night before',
    teaser: 'Read this one slowly.',
    type: 'letter',
    special: true,
    content: {
      variant: 'eve',
      greeting: 'My love,',
      dateLine: 'Christmas Eve',
      body: [
        '[PLACEHOLDER] It’s the night before Christmas, and I wanted to write you something long. Something you could come back to.',
        'When I started making this calendar, I thought it would be hard to find twenty-five things to give you. It turned out to be the opposite. The hard part was choosing.',
        'This year you made the ordinary days feel like occasions. You made my small apartment feel like a home and my long weeks feel shorter.',
        'I don’t know exactly what next year looks like. I know who I want to find out with.',
        'Sleep well tonight. Tomorrow there is one last door.',
      ],
      photos: [photo('[PLACEHOLDER] A Christmas photo of us', { date: 'December' })],
      signature: 'Yours, tonight and every night',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'finale'  — Christmas Day. A step-by-step sequence.
   * ---------------------------------------------------------------------- */
  {
    day: 25,
    title: 'Merry Christmas, My Love',
    subtitle: 'The final chapter',
    teaser: 'The last door. The best one.',
    type: 'finale',
    special: true,
    content: {
      greeting: 'Merry Christmas',
      subGreeting: 'my love',
      letter: {
        greeting: 'My love,',
        body: [
          '[PLACEHOLDER] Twenty-five days ago I asked you to make a cup of something warm and begin. Here we are.',
          'Thank you for opening every door, for laughing at the silly ones and for reading the long ones twice. (I know you did.)',
          'Write the main Christmas letter here. Take your time — this is the one she will reread.',
        ],
        signature: 'Forever yours',
      },
      photos: [
        photo('[PLACEHOLDER] A favourite photo from this year', { date: '2026' }),
        photo('[PLACEHOLDER] Another one', { date: '2026' }),
        photo('[PLACEHOLDER] And one more', { date: '2026' }),
      ],
      video: { src: null, embed: null, caption: '[PLACEHOLDER] A Christmas message' }, // optional — leave src/embed null to skip
      gift: {
        headline: 'Your Christmas gift',
        message: '[PLACEHOLDER] Describe the final gift here — or where to find it.',
        clue: 'Look under the tree. The small one, wrapped in burgundy.',
      },
      closing: [
        '25 little surprises were never enough to show you how much you mean to me.',
        'But I hope each one reminded you of something:',
        'You are loved.',
        'You are special.',
        'And every day with you is a gift I never take for granted.',
        'Merry Christmas, my love.',
        'And this is only the beginning of our story.',
      ],
    },
  },
];

export const TOTAL_DAYS = DAYS.length;

export const getDay = (n) => DAYS.find((d) => d.day === Number(n)) || null;
