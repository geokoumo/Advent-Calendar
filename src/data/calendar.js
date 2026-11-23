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
 *  Each one is documented at its first use below (or in the README).
 *
 *  OPTIONAL FIELDS on any day
 *    gifts: [{ id, name, brand? }] → the gift(s) behind this door. This is the
 *                                    gift schedule. Ids are unique and stable.
 *                                    On a 'gift' day with 2+ entries, the
 *                                    unwrapped view lists every item inside.
 *    memory: false                 → don't show this day in "Our Memories"
 *    memory: { image, description } → override how it appears there
 *    special: true                 → gold "special" tile on the calendar
 *
 *  GIFT SCHEDULE (8 Sephora products, never on 3 consecutive days)
 *    1 intro letter          · 2 teddy keychain      · 3 Sephora #1
 *    4 printed photo         · 5 Christmas socks     · 6 satin scrunchies
 *    7 personal letter       · 8 Sephora #2          · 9 date coupon
 *   10 gingerbread           · 11 Sephora #3         · 12 hot chocolate
 *   13 Sol de Janeiro        · 14 Sephora #4 + candle · 15 silver bracelet
 *   16 body mist             · 17 Sephora #5 + plush teddy · 18 ornament
 *   19 our evening (date)    · 20 Sephora #6         · 21 personal surprise
 *   22 Sephora #7 + #8       · 23 love letter        · 24 Christmas Eve surprise
 *   25 smartwatch (finale)
 * ========================================================================== */

const photo = (caption, opts = {}) => ({ src: null, alt: caption, caption, ...opts });
const sephora = (n) => ({ id: `sephora-${n}`, name: `Sephora Gift #${n}`, brand: 'Sephora' });

export const DAYS = [
  /* ---------------------------------------------------------------------- *
   * type: 'letter'
   * content: { greeting, body: [paragraphs], signature, dateLine?, variant? }
   * variant: 'letter' (default) | 'note' (small card) | 'comfort' | 'eve'
   * ---------------------------------------------------------------------- */
  {
    day: 1,
    title: 'The Beginning',
    subtitle: 'Where it all begins',
    teaser: 'I have something to tell you…',
    type: 'letter',
    gifts: [], // introductory letter, no physical gift
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

  /* ---------------------------------------------------------------------- *
   * type: 'gift'  — a real-world present
   * content: { reveal: 'unwrap' | 'scratch' | 'findHeart', headline, message: [..],
   *            clue?, image?: photo(...) }
   * ---------------------------------------------------------------------- */
  {
    day: 2,
    title: 'A Little Hug',
    subtitle: 'Something to keep close',
    teaser: 'Something small to carry with you.',
    type: 'gift',
    gifts: [{ id: 'teddy-keychain', name: 'Teddy Bear Keychain' }],
    content: {
      reveal: 'unwrap',
      headline: 'A hug you can carry',
      message: [
        '[PLACEHOLDER] A little teddy bear for your keys — so whenever you leave the house, a small hug from me goes with you.',
      ],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 3,
    title: 'A Little Extra Shine',
    subtitle: 'A beauty surprise',
    teaser: 'Something to make you sparkle.',
    type: 'gift',
    gifts: [sephora(1)],
    content: {
      reveal: 'unwrap',
      headline: 'A little extra shine',
      message: ['[PLACEHOLDER] The first little beauty surprise. Not because you need it — because you deserve it.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'photo'
   * content: { intro?, photos: [{ src, alt, caption, date? }], story? }
   * One photo = big polaroid. Several = swipeable gallery.
   * ---------------------------------------------------------------------- */
  {
    day: 4,
    title: 'A Moment of Us',
    subtitle: 'One of our favourite moments',
    teaser: 'Do you remember this one?',
    type: 'photo',
    gifts: [{ id: 'printed-photo', name: 'Printed photo of us' }],
    content: {
      intro: 'Do you remember this day?',
      photos: [photo('[PLACEHOLDER] Us, that evening', { date: 'Summer 2025' })],
      story:
        '[PLACEHOLDER] Write a few lines about this moment. Then tell her where the printed copy is waiting — this one is for her wall, not just her phone.',
    },
  },
  {
    day: 5,
    title: 'Cozy Christmas',
    subtitle: 'Something warm',
    teaser: 'For cold toes and lazy mornings.',
    type: 'gift',
    gifts: [{ id: 'christmas-socks', name: 'Christmas socks' }],
    content: {
      reveal: 'unwrap',
      headline: 'Warm toes, cozy heart',
      message: ['[PLACEHOLDER] Christmas socks for slow mornings, movie nights and stealing the warm side of the sofa.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 6,
    title: 'Something for Your Hair',
    subtitle: 'A soft little gift',
    teaser: 'Soft, silky, and just for you.',
    type: 'gift',
    gifts: [{ id: 'satin-scrunchies', name: 'Satin Hair Scrunchies' }],
    content: {
      reveal: 'unwrap',
      headline: 'Something for your hair',
      message: ['[PLACEHOLDER] Satin scrunchies — gentle on your hair, and a little bit fancy. Like you.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 7,
    title: 'Something from My Heart',
    subtitle: 'A personal letter',
    teaser: 'Words I wanted you to keep.',
    type: 'letter',
    gifts: [{ id: 'personal-letter', name: 'Personal letter' }],
    content: {
      greeting: 'My love,',
      body: [
        '[PLACEHOLDER] Write a personal letter here — something you’ve wanted to tell her for a while.',
        'It doesn’t need to be long. It needs to be true.',
      ],
      signature: 'From my heart',
    },
  },
  {
    day: 8,
    title: 'Another Little Surprise',
    subtitle: 'Scratch to find it',
    teaser: 'Something is hidden. Find it.',
    type: 'gift',
    gifts: [sephora(2)],
    content: {
      reveal: 'scratch',
      headline: 'Another little surprise',
      message: ['[PLACEHOLDER] Beauty surprise number two. You’re starting to see a pattern, aren’t you?'],
      clue: '[PLACEHOLDER] Where to find it.',
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
    title: 'A Date Just for Us',
    subtitle: 'Redeemable whenever you like',
    teaser: 'Valid for one wonderful evening.',
    type: 'coupon',
    gifts: [{ id: 'date-coupon', name: 'Romantic date coupon' }],
    content: {
      intro: 'Keep this safe. When you’re ready to use it, tap redeem and show it to me.',
      coupons: [
        {
          id: 'date-just-for-us',
          title: 'A Date Just for Us',
          description: '[PLACEHOLDER] One romantic date, planned entirely by me. Dress up, switch off, and let me take care of everything.',
          terms: 'Valid any evening you choose. Phones stay in pockets.',
          expires: 'Never',
        },
      ],
    },
  },
  {
    day: 10,
    title: 'Something Sweet',
    subtitle: 'A little treat',
    teaser: 'Something sweet is nearby.',
    type: 'gift',
    gifts: [{ id: 'gingerbread', name: 'Gingerbread' }],
    content: {
      reveal: 'unwrap',
      headline: 'Something sweet for someone sweeter',
      message: ['[PLACEHOLDER] Gingerbread — because December should taste like December.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 11,
    title: 'A Little Treat',
    subtitle: 'A beauty surprise',
    teaser: 'Just a little treat for you.',
    type: 'gift',
    gifts: [sephora(3)],
    content: {
      reveal: 'unwrap',
      headline: 'A little treat',
      message: ['[PLACEHOLDER] Beauty surprise number three. Take five minutes today just for yourself.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 12,
    title: 'A Cozy Moment',
    subtitle: 'Something warm',
    teaser: 'Grab a blanket.',
    type: 'gift',
    gifts: [{ id: 'hot-chocolate', name: 'Hot chocolate' }],
    content: {
      reveal: 'unwrap',
      headline: 'A cozy moment',
      message: ['[PLACEHOLDER] Hot chocolate for a cold evening. Blanket, mug, and me — that’s the plan.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 13,
    title: 'Your Favorite Scent',
    subtitle: 'Scratch to find it',
    teaser: 'Something that smells like you.',
    type: 'gift',
    gifts: [{ id: 'sol-de-janeiro', name: 'Sol de Janeiro gift', brand: 'Sol de Janeiro' }],
    content: {
      reveal: 'scratch',
      headline: 'Your favourite scent',
      message: ['[PLACEHOLDER] A little Sol de Janeiro — summer in a bottle, right in the middle of December.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 14,
    title: 'A Little Glow',
    subtitle: 'Two gifts in one',
    teaser: 'Something to glow, something to glow by.',
    type: 'gift',
    gifts: [sephora(4), { id: 'candle', name: 'Candle' }], // combined gift
    content: {
      reveal: 'unwrap',
      headline: 'A little glow',
      message: [
        '[PLACEHOLDER] Today there are two: a beauty surprise for your glow, and a candle for the room around you.',
        'Light it tonight. I’ll be thinking of you.',
      ],
      clue: '[PLACEHOLDER] Where to find them.',
    },
  },
  {
    day: 15,
    title: 'Something to Keep',
    subtitle: 'Find the heart',
    teaser: 'Something meant to stay.',
    type: 'gift',
    gifts: [{ id: 'silver-bracelet', name: 'Silver bracelet' }],
    content: {
      reveal: 'findHeart',
      headline: 'Something to keep',
      message: ['[PLACEHOLDER] A silver bracelet — something to wear long after December is over. Like us.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 16,
    title: 'A Scent to Remember',
    subtitle: 'A little mist',
    teaser: 'A scent for every day.',
    type: 'gift',
    gifts: [{ id: 'body-mist', name: 'Body mist' }],
    content: {
      reveal: 'unwrap',
      headline: 'A scent to remember',
      message: ['[PLACEHOLDER] A body mist — so every time you wear it, you’ll remember this December.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },
  {
    day: 17,
    title: 'Another Hug',
    subtitle: 'Find the heart',
    teaser: 'Two surprises are hiding today.',
    type: 'gift',
    gifts: [sephora(5), { id: 'plush-teddy', name: 'Plush Teddy Bear' }], // combined gift
    content: {
      reveal: 'findHeart',
      headline: 'Another hug',
      message: [
        '[PLACEHOLDER] Two today: a beauty surprise, and a big soft teddy bear for the nights I can’t be there to hug you myself.',
      ],
      clue: '[PLACEHOLDER] Where to find them.',
    },
  },
  {
    day: 18,
    title: 'A Piece of Christmas',
    subtitle: 'For our tree',
    teaser: 'Something for the tree.',
    type: 'gift',
    gifts: [{ id: 'christmas-ornament', name: 'Christmas ornament' }],
    content: {
      reveal: 'unwrap',
      headline: 'A piece of Christmas',
      message: ['[PLACEHOLDER] An ornament for our tree — this year, and every Christmas after.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'date'  — an invitation
   * content: { invitation, event, when, where, wear?, bring?, note, rsvp }
   * ---------------------------------------------------------------------- */
  {
    day: 19,
    title: 'Our Evening',
    subtitle: 'You’re invited',
    teaser: 'Clear your evening.',
    type: 'date',
    gifts: [{ id: 'our-evening', name: 'Romantic date / activity' }],
    content: {
      invitation: 'The pleasure of your company is requested for',
      event: 'An Evening, Just Us',
      when: '[PLACEHOLDER] Day, time',
      where: '[PLACEHOLDER] Where we’re going',
      wear: '[PLACEHOLDER] Something you feel beautiful in',
      bring: 'Nothing but you.',
      note: '[PLACEHOLDER] Describe the evening — or keep it a mystery.',
      rsvp: 'I’ll be there',
    },
  },
  {
    day: 20,
    title: 'A Beauty Surprise',
    subtitle: 'Scratch to find it',
    teaser: 'Something lovely is hiding.',
    type: 'gift',
    gifts: [sephora(6)],
    content: {
      reveal: 'scratch',
      headline: 'A beauty surprise',
      message: ['[PLACEHOLDER] Beauty surprise number six. Almost Christmas — time to shine.'],
      clue: '[PLACEHOLDER] Where to find it.',
    },
  },

  /* ---------------------------------------------------------------------- *
   * type: 'reasons'  — expandable list
   * content: { intro, reasons: [{ title, text }], closing }
   * ---------------------------------------------------------------------- */
  {
    day: 21,
    title: 'A Little Personal Surprise',
    subtitle: 'Tap each one',
    teaser: 'Ten. For now.',
    type: 'reasons',
    gifts: [], // personal surprise, intentionally no physical gift (and no Sephora)
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
    title: 'Today I Spoil You',
    subtitle: 'Two beauty surprises',
    teaser: 'Today is all about you.',
    type: 'gift',
    gifts: [sephora(7), sephora(8)], // one combined beauty surprise, exactly 2 Sephora products
    content: {
      reveal: 'unwrap',
      headline: 'Today I spoil you',
      message: [
        '[PLACEHOLDER] Not one, but two beauty surprises — one big Sephora moment, all for you.',
        'No reason needed. Today you just get spoiled.',
      ],
      clue: '[PLACEHOLDER] Where to find them.',
    },
  },
  {
    day: 23,
    title: 'From My Heart',
    subtitle: 'A love letter',
    teaser: 'Read this one slowly.',
    type: 'letter',
    gifts: [{ id: 'love-letter', name: 'Personal love letter' }],
    content: {
      greeting: 'My love,',
      body: [
        '[PLACEHOLDER] Write your love letter here — the one you’d want her to keep in a drawer for years.',
        'Tell her what this year meant. Tell her what you see when you look at her.',
      ],
      signature: 'All my love, always',
    },
  },
  {
    day: 24,
    title: 'Christmas Eve',
    subtitle: 'The night before',
    teaser: 'A cozy surprise for tonight.',
    type: 'letter',
    special: true,
    gifts: [{ id: 'christmas-eve-surprise', name: 'Christmas Eve surprise' }],
    content: {
      variant: 'eve',
      greeting: 'My love,',
      dateLine: 'Christmas Eve',
      body: [
        '[PLACEHOLDER] It’s the night before Christmas, and I wanted to write you something long. Something you could come back to.',
        'When I started making this calendar, I thought it would be hard to find twenty-five things to give you. It turned out to be the opposite. The hard part was choosing.',
        'This year you made the ordinary days feel like occasions. You made my small apartment feel like a home and my long weeks feel shorter.',
        '[PLACEHOLDER] Tonight’s surprise: describe the cozy Christmas Eve plan — lights, something warm to drink, and the two of us.',
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
    title: 'Our Christmas',
    subtitle: 'The final chapter',
    teaser: 'The last door. The best one.',
    type: 'finale',
    special: true,
    gifts: [{ id: 'smartwatch', name: 'Smartwatch' }],
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
        message: '[PLACEHOLDER] A smartwatch — so every moment of next year, you’ll have a little reminder of me on your wrist.',
        clue: '[PLACEHOLDER] Look under the tree. The small one, wrapped in burgundy.',
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
