export interface DailyQuote {
  text: string;
  author: string;
  source?: string;
  highlight: string;
}

export const quotes: DailyQuote[] = [
  // ── A.P.J. Abdul Kalam ──────────────────────────────────────
  { text: "You have to dream before your dreams can come true.", author: "A.P.J. Abdul Kalam", highlight: "dream before your dreams" },
  { text: "If you want to shine like a sun, first burn like a sun.", author: "A.P.J. Abdul Kalam", highlight: "first burn like a sun" },
  { text: "Man needs his difficulties because they are necessary to enjoy success.", author: "A.P.J. Abdul Kalam", highlight: "difficulties" },
  { text: "Great dreams of great dreamers are always transcended.", author: "A.P.J. Abdul Kalam", highlight: "always transcended" },
  { text: "Failure will never overtake me if my determination to succeed is strong enough.", author: "A.P.J. Abdul Kalam", highlight: "determination to succeed" },
  { text: "Let me define a leader. He must have vision and passion and not be afraid of any problem.", author: "A.P.J. Abdul Kalam", highlight: "vision and passion" },
  { text: "All of us do not have equal talent. But, all of us have an equal opportunity to develop our talents.", author: "A.P.J. Abdul Kalam", highlight: "equal opportunity to develop" },
  { text: "The best brains of the nation may be found on the last benches of the classroom.", author: "A.P.J. Abdul Kalam", highlight: "last benches of the classroom" },
  { text: "Don't take rest after your first victory because if you fail in second, more lips are waiting to say that your first victory was just luck.", author: "A.P.J. Abdul Kalam", highlight: "first victory was just luck" },
  { text: "It is very easy to defeat someone, but it is very hard to win someone.", author: "A.P.J. Abdul Kalam", highlight: "win someone" },

  // ── Subhas Chandra Bose ─────────────────────────────────────
  { text: "Freedom is not given, it is taken.", author: "Subhas Chandra Bose", highlight: "taken" },
  { text: "No real change in history has ever been achieved by discussions.", author: "Subhas Chandra Bose", highlight: "No real change" },
  { text: "Give me blood, and I shall give you freedom!", author: "Subhas Chandra Bose", highlight: "Give me blood" },
  { text: "One individual may die for an idea, but that idea will incarnate itself in a thousand lives.", author: "Subhas Chandra Bose", highlight: "incarnate itself in a thousand lives" },
  { text: "Life loses half its interest if there is no struggle.", author: "Subhas Chandra Bose", highlight: "no struggle" },
  { text: "Forget not that the greatest crime is to compromise with injustice.", author: "Subhas Chandra Bose", highlight: "compromise with injustice" },
  { text: "Until you have suffered much in life, your eyes do not open to reality.", author: "Subhas Chandra Bose", highlight: "eyes do not open" },
  { text: "Suffering and evil are necessary preconditions for goodness.", author: "Subhas Chandra Bose", highlight: "Suffering and evil" },

  // ── Bhagavad Gita ────────────────────────────────────────────
  { text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.", author: "Bhagavad Gita", source: "2.47", highlight: "not entitled to the fruits" },
  { text: "The soul is neither born, and nor does it die.", author: "Bhagavad Gita", source: "2.20", highlight: "neither born, and nor does it die" },
  { text: "Set thy heart upon thy work but never its reward.", author: "Bhagavad Gita", source: "2.47", highlight: "never its reward" },
  { text: "Man is made by his belief. As he believes, so he is.", author: "Bhagavad Gita", source: "17.3", highlight: "As he believes, so he is" },
  { text: "A person can rise through the efforts of his own mind, or draw himself down, in the same manner.", author: "Bhagavad Gita", source: "6.5", highlight: "efforts of his own mind" },
  { text: "It is better to live your own destiny imperfectly than to live an imitation of somebody else's life.", author: "Bhagavad Gita", source: "3.35", highlight: "live your own destiny" },
  { text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.", author: "Bhagavad Gita", source: "6.19", highlight: "flame of a lamp in a windless place" },
  { text: "Neither in this world nor elsewhere is there any happiness in store for him who always doubts.", author: "Bhagavad Gita", source: "4.40", highlight: "him who always doubts" },
  { text: "Hell has three gates: lust, anger, and greed.", author: "Bhagavad Gita", source: "16.21", highlight: "lust, anger, and greed" },
  { text: "Reshape yourself through the power of your will.", author: "Bhagavad Gita", source: "6.5", highlight: "power of your will" },
  { text: "A gift is pure when it is given from the heart to the right person at the right time.", author: "Bhagavad Gita", source: "17.20", highlight: "given from the heart" },
  { text: "Calmness, gentleness, silence, self-restraint, and purity: these are the disciplines of the mind.", author: "Bhagavad Gita", source: "17.16", highlight: "disciplines of the mind" },
  { text: "The wise see knowledge and action as one.", author: "Bhagavad Gita", source: "5.4", highlight: "knowledge and action as one" },
  { text: "For those who wish to climb the mountain of spiritual awareness, the path is selfless work.", author: "Bhagavad Gita", source: "6.3", highlight: "selfless work" },
  { text: "The power of God is with you at all times, constantly doing all the work using you as a mere instrument.", author: "Bhagavad Gita", source: "13.23", highlight: "you as a mere instrument" },

  // ── Swami Vivekananda ───────────────────────────────────────
  { text: "Arise, awake, and stop not till the goal is achieved.", author: "Swami Vivekananda", highlight: "stop not till the goal is achieved" },
  { text: "The greatest sin is to think yourself weak.", author: "Swami Vivekananda", highlight: "think yourself weak" },
  { text: "Take up one idea. Make that one idea your life.", author: "Swami Vivekananda", highlight: "Make that one idea your life" },
  { text: "Strength is life, weakness is death.", author: "Swami Vivekananda", highlight: "Strength is life" },
  { text: "Conquer yourself and the whole universe is yours.", author: "Swami Vivekananda", highlight: "Conquer yourself" },
  { text: "All the powers in the universe are already ours. It is we who have put our hands before our eyes.", author: "Swami Vivekananda", highlight: "powers in the universe are already ours" },
  { text: "We are what our thoughts have made us; so take care about what you think.", author: "Swami Vivekananda", highlight: "what our thoughts have made us" },
  { text: "The world is the great gymnasium where we come to make ourselves strong.", author: "Swami Vivekananda", highlight: "make ourselves strong" },
  { text: "Be not afraid of anything. You will do marvelous work.", author: "Swami Vivekananda", highlight: "You will do marvelous work" },
  { text: "Stand up, be bold, be strong. Take the whole responsibility on your own shoulders.", author: "Swami Vivekananda", highlight: "Stand up, be bold, be strong" },
  { text: "Fill the brain with high thoughts, highest ideals, place them day and night before you, and out of that will come great work.", author: "Swami Vivekananda", highlight: "highest ideals" },
  { text: "In a conflict between the heart and the brain, follow your heart.", author: "Swami Vivekananda", highlight: "follow your heart" },
  { text: "All love is expansion, all selfishness is contraction.", author: "Swami Vivekananda", highlight: "all selfishness is contraction" },
  { text: "You have to grow from the inside out. None can teach you, none can make you spiritual.", author: "Swami Vivekananda", highlight: "grow from the inside out" },
  { text: "Talk to yourself once in a day; otherwise you may miss meeting an excellent person in this world.", author: "Swami Vivekananda", highlight: "Talk to yourself" },

  // ── Chanakya ────────────────────────────────────────────────
  { text: "A person should not be too honest. Straight trees are cut first and honest people are screwed first.", author: "Chanakya", highlight: "Straight trees are cut first" },
  { text: "The biggest guru-mantra is: never share your secrets with anybody. It will destroy you.", author: "Chanakya", highlight: "never share your secrets" },
  { text: "A man is great by deeds, not by birth.", author: "Chanakya", highlight: "by deeds, not by birth" },
  { text: "Once you start working on something, don't be afraid of failure and don't abandon it.", author: "Chanakya", highlight: "don't abandon it" },
  { text: "As soon as the fear approaches near, attack and destroy it.", author: "Chanakya", highlight: "attack and destroy it" },
  { text: "Education is the best friend. An educated person is respected everywhere.", author: "Chanakya", highlight: "Education is the best friend" },
  { text: "Books are as useful to a stupid person as a mirror is useful to a blind person.", author: "Chanakya", highlight: "mirror is useful to a blind person" },
  { text: "Test a servant while in the discharge of his duty, a relative in difficulty, a friend in adversity, and a wife in misfortune.", author: "Chanakya", highlight: "a friend in adversity" },
  { text: "Before you start some work, always ask yourself three questions: Why am I doing it, What the results might be and Will I be successful.", author: "Chanakya", highlight: "three questions" },
  { text: "He who is overly attached to his family members experiences fear and sorrow.", author: "Chanakya", highlight: "experiences fear and sorrow" },
  { text: "A cobra is venomous, but a vile man is more venomous than the cobra.", author: "Chanakya", highlight: "more venomous than the cobra" },
  { text: "The fragrance of flowers spreads only in the direction of the wind. But the goodness of a person spreads in all directions.", author: "Chanakya", highlight: "spreads in all directions" },
  { text: "Never make friends with people who are above or below you in status.", author: "Chanakya", highlight: "above or below you in status" },
  { text: "The wise man should restrain his senses and accomplish his purpose with due knowledge of his place, time and ability.", author: "Chanakya", highlight: "restrain his senses" },
  { text: "He who befriends a man whose conduct is vicious, whose vision impure, and who is notoriously crooked, is rapidly ruined.", author: "Chanakya", highlight: "is rapidly ruined" },

  // ── Bruce Lee ───────────────────────────────────────────────
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee", highlight: "strength to endure a difficult one" },
  { text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", author: "Bruce Lee", highlight: "one kick 10,000 times" },
  { text: "Absorb what is useful, discard what is not, add what is uniquely your own.", author: "Bruce Lee", highlight: "add what is uniquely your own" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee", highlight: "laser-like focus" },
  { text: "Empty your mind, be formless, shapeless, like water.", author: "Bruce Lee", highlight: "be formless, shapeless, like water" },
  { text: "Knowing is not enough, we must apply. Willing is not enough, we must do.", author: "Bruce Lee", highlight: "we must do" },
  { text: "If you spend too much time thinking about a thing, you'll never get it done.", author: "Bruce Lee", highlight: "you'll never get it done" },
  { text: "The key to immortality is first living a life worth remembering.", author: "Bruce Lee", highlight: "a life worth remembering" },
  { text: "Always be yourself, express yourself, have faith in yourself.", author: "Bruce Lee", highlight: "have faith in yourself" },
  { text: "Mistakes are always forgivable, if one has the courage to admit them.", author: "Bruce Lee", highlight: "courage to admit them" },
  { text: "A goal is not always meant to be reached, it often serves simply as something to aim at.", author: "Bruce Lee", highlight: "something to aim at" },
  { text: "The more we value things, the less we value ourselves.", author: "Bruce Lee", highlight: "the less we value ourselves" },
  { text: "In order to taste my cup of water you must first empty your cup.", author: "Bruce Lee", highlight: "first empty your cup" },
  { text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.", author: "Bruce Lee", highlight: "foolish question" },
  { text: "Life's battles don't always go to the stronger or faster man. Sooner or later the man who wins is the man who thinks he can.", author: "Bruce Lee", highlight: "the man who thinks he can" },

  // ── Marcus Aurelius ─────────────────────────────────────────
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", highlight: "power over your mind" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius", highlight: "What stands in the way becomes the way" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", highlight: "Be one" },
  { text: "The best revenge is to be unlike your enemy.", author: "Marcus Aurelius", highlight: "be unlike your enemy" },
  { text: "If it is not right, do not do it; if it is not true, do not say it.", author: "Marcus Aurelius", highlight: "if it is not true, do not say it" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius", highlight: "all within yourself" },
  { text: "Never esteem anything as of advantage to you that will make you break your word or lose your self-respect.", author: "Marcus Aurelius", highlight: "lose your self-respect" },
  { text: "It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.", author: "Marcus Aurelius", highlight: "care more about their opinion" },
  { text: "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane.", author: "Marcus Aurelius", highlight: "ranks of the insane" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Marcus Aurelius", highlight: "each separate day as a separate life" },
  { text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", author: "Marcus Aurelius", highlight: "a perspective, not the truth" },
  { text: "Loss is nothing else but change, and change is Nature's delight.", author: "Marcus Aurelius", highlight: "change is Nature's delight" },
  { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius", highlight: "love the people with whom fate brings you" },
  { text: "When you wake up in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love.", author: "Marcus Aurelius", highlight: "precious privilege it is to be alive" },
  { text: "How much time he gains who does not look to see what his neighbour says or does or thinks.", author: "Marcus Aurelius", highlight: "does not look to see what his neighbour" },

  // ── Muhammad Ali ────────────────────────────────────────────
  { text: "I am the greatest, I said that even before I knew I was.", author: "Muhammad Ali", highlight: "I am the greatest" },
  { text: "Float like a butterfly, sting like a bee. The hands can't hit what the eyes can't see.", author: "Muhammad Ali", highlight: "Float like a butterfly, sting like a bee" },
  { text: "I hated every minute of training, but I said: Don't quit. Suffer now and live the rest of your life as a champion.", author: "Muhammad Ali", highlight: "live the rest of your life as a champion" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali", highlight: "make the days count" },
  { text: "Impossible is not a fact. It's an opinion. Impossible is not a declaration. It's a dare.", author: "Muhammad Ali", highlight: "It's a dare" },
  { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali", highlight: "take risks" },
  { text: "A man who views the world the same at fifty as he did at twenty has wasted thirty years of his life.", author: "Muhammad Ali", highlight: "wasted thirty years of his life" },
  { text: "The man who has no imagination has no wings.", author: "Muhammad Ali", highlight: "no wings" },
  { text: "It's not bragging if you can back it up.", author: "Muhammad Ali", highlight: "back it up" },
  { text: "Service to others is the rent you pay for your room here on earth.", author: "Muhammad Ali", highlight: "rent you pay for your room" },

  // ── Arnold Schwarzenegger ───────────────────────────────────
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger", highlight: "Your struggles develop your strengths" },
  { text: "The mind is the limit. As long as the mind can envision the fact that you can do something, you can do it.", author: "Arnold Schwarzenegger", highlight: "The mind is the limit" },
  { text: "You can have results or excuses. Not both.", author: "Arnold Schwarzenegger", highlight: "results or excuses. Not both" },
  { text: "Just remember, you can't climb the ladder of success with your hands in your pockets.", author: "Arnold Schwarzenegger", highlight: "hands in your pockets" },
  { text: "The worst thing I can be is the same as everybody else.", author: "Arnold Schwarzenegger", highlight: "same as everybody else" },
  { text: "For me, life is continuously being hungry. The meaning of life is not simply to exist, to survive, but to move ahead, to go up, to achieve, to conquer.", author: "Arnold Schwarzenegger", highlight: "conquer" },
  { text: "Failure is not an option. Everyone has to succeed.", author: "Arnold Schwarzenegger", highlight: "Failure is not an option" },
  { text: "What we face may look insurmountable. But I learned something from all those sets and reps — there is always a way.", author: "Arnold Schwarzenegger", highlight: "there is always a way" },

  // ── Winston Churchill ────────────────────────────────────────
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", highlight: "courage to continue" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill", highlight: "keep going" },
  { text: "Never, never, never give up.", author: "Winston Churchill", highlight: "Never, never, never give up" },
  { text: "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets; we shall never surrender.", author: "Winston Churchill", highlight: "we shall never surrender" },
  { text: "Continuous effort — not strength or intelligence — is the key to unlocking our potential.", author: "Winston Churchill", highlight: "Continuous effort" },
  { text: "A pessimist sees the difficulty in every opportunity; an optimist sees the opportunity in every difficulty.", author: "Winston Churchill", highlight: "opportunity in every difficulty" },
  { text: "Success consists of going from failure to failure without loss of enthusiasm.", author: "Winston Churchill", highlight: "without loss of enthusiasm" },
  { text: "To improve is to change; to be perfect is to change often.", author: "Winston Churchill", highlight: "to be perfect is to change often" },
  { text: "I never worry about action, but only about inaction.", author: "Winston Churchill", highlight: "only about inaction" },
  { text: "The price of greatness is responsibility.", author: "Winston Churchill", highlight: "price of greatness" },

  // ── Abraham Lincoln ─────────────────────────────────────────
  { text: "I will prepare and someday my chance will come.", author: "Abraham Lincoln", highlight: "I will prepare" },
  { text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "Abraham Lincoln", highlight: "sharpening the axe" },
  { text: "Always bear in mind that your own resolution to succeed is more important than any one thing.", author: "Abraham Lincoln", highlight: "resolution to succeed" },
  { text: "Most folks are about as happy as they make up their minds to be.", author: "Abraham Lincoln", highlight: "make up their minds to be" },
  { text: "That some achieve great success, is proof to all that others can achieve it as well.", author: "Abraham Lincoln", highlight: "others can achieve it as well" },
  { text: "Things may come to those who wait, but only the things left by those who hustle.", author: "Abraham Lincoln", highlight: "those who hustle" },
  { text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.", author: "Abraham Lincoln", highlight: "remove all doubt" },
  { text: "No man has a good enough memory to be a successful liar.", author: "Abraham Lincoln", highlight: "successful liar" },

  // ── Theodore Roosevelt ──────────────────────────────────────
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", highlight: "Believe you can" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", highlight: "where you are" },
  { text: "It is not the critic who counts; not the man who points out how the strong man stumbles.", author: "Theodore Roosevelt", highlight: "It is not the critic who counts" },
  { text: "The only man who never makes a mistake is the man who never does anything.", author: "Theodore Roosevelt", highlight: "the man who never does anything" },
  { text: "Speak softly and carry a big stick; you will go far.", author: "Theodore Roosevelt", highlight: "carry a big stick" },
  { text: "Far and away the best prize that life offers is the chance to work hard at work worth doing.", author: "Theodore Roosevelt", highlight: "work worth doing" },
  { text: "It is hard to fail, but it is worse never to have tried to succeed.", author: "Theodore Roosevelt", highlight: "worse never to have tried" },
  { text: "Keep your eyes on the stars, and your feet on the ground.", author: "Theodore Roosevelt", highlight: "eyes on the stars" },
  { text: "In any moment of decision, the best thing you can do is the right thing.", author: "Theodore Roosevelt", highlight: "the right thing" },
  { text: "Comparison is the thief of joy.", author: "Theodore Roosevelt", highlight: "Comparison is the thief of joy" },

  // ── David Goggins ────────────────────────────────────────────
  { text: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.", author: "David Goggins", highlight: "die without ever realizing your true potential" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins", highlight: "Stop when you're done" },
  { text: "The most important conversation is the one you have with yourself.", author: "David Goggins", highlight: "you have with yourself" },
  { text: "Suffering is the true test of life.", author: "David Goggins", highlight: "Suffering is the true test" },
  { text: "You have to build calluses on your brain just like how you build calluses on your hands.", author: "David Goggins", highlight: "calluses on your brain" },
  { text: "No one is going to come help you. No one's coming to save you.", author: "David Goggins", highlight: "No one's coming to save you" },
  { text: "Be uncommon amongst uncommon people.", author: "David Goggins", highlight: "uncommon amongst uncommon people" },
  { text: "We all have the ability to come from nothing to something. But it takes everything.", author: "David Goggins", highlight: "it takes everything" },
  { text: "The only way that you will ever awaken to your true potential is if you start demanding more of yourself.", author: "David Goggins", highlight: "demanding more of yourself" },
  { text: "It's a lot more than mind over matter. It takes relentless self-discipline, scheduling the time to do the uncomfortable.", author: "David Goggins", highlight: "relentless self-discipline" },

  // ── Kobe Bryant ─────────────────────────────────────────────
  { text: "The moment you give up is the moment you let someone else win.", author: "Kobe Bryant", highlight: "you let someone else win" },
  { text: "Great things come from hard work and perseverance. No excuses.", author: "Kobe Bryant", highlight: "No excuses" },
  { text: "I can't relate to lazy people. We don't speak the same language.", author: "Kobe Bryant", highlight: "We don't speak the same language" },
  { text: "Heroes come and go, but legends are forever.", author: "Kobe Bryant", highlight: "legends are forever" },
  { text: "Everything negative — pressure, challenges — is all an opportunity for me to rise.", author: "Kobe Bryant", highlight: "opportunity for me to rise" },
  { text: "If you're afraid to fail, then you're probably going to fail.", author: "Kobe Bryant", highlight: "you're probably going to fail" },
  { text: "The most important thing is to try and inspire people so that they can be great in whatever they want to do.", author: "Kobe Bryant", highlight: "inspire people" },
  { text: "I have nothing in common with lazy people who blame others for their lack of success.", author: "Kobe Bryant", highlight: "blame others for their lack of success" },

  // ── Michael Jordan ───────────────────────────────────────────
  { text: "I can accept failure, everyone fails at something. But I can't accept not trying.", author: "Michael Jordan", highlight: "I can't accept not trying" },
  { text: "Obstacles don't have to stop you. If you run into a wall, don't turn around and give up. Figure out how to climb it, go through it, or work around it.", author: "Michael Jordan", highlight: "Figure out how to climb it" },
  { text: "I've missed more than 9,000 shots in my career. I've lost almost 300 games. 26 times I've been trusted to take the game-winning shot and missed. And that is why I succeed.", author: "Michael Jordan", highlight: "that is why I succeed" },
  { text: "Talent wins games, but teamwork and intelligence wins championships.", author: "Michael Jordan", highlight: "intelligence wins championships" },
  { text: "Always turn a negative situation into a positive situation.", author: "Michael Jordan", highlight: "positive situation" },
  { text: "My attitude is that if you push me towards something that you think is a weakness, then I will turn that perceived weakness into a strength.", author: "Michael Jordan", highlight: "turn that perceived weakness into a strength" },
  { text: "I've always believed that if you put in the work, the results will come.", author: "Michael Jordan", highlight: "the results will come" },
  { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan", highlight: "others make it happen" },

  // ── Sun Tzu ──────────────────────────────────────────────────
  { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu", source: "The Art of War", highlight: "win first and then go to war" },
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu", source: "The Art of War", highlight: "there is also opportunity" },
  { text: "Appear weak when you are strong, and strong when you are weak.", author: "Sun Tzu", source: "The Art of War", highlight: "strong when you are weak" },
  { text: "Know yourself and you will win all battles.", author: "Sun Tzu", source: "The Art of War", highlight: "Know yourself" },
  { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu", source: "The Art of War", highlight: "subdue the enemy without fighting" },
  { text: "All warfare is based on deception.", author: "Sun Tzu", source: "The Art of War", highlight: "based on deception" },
  { text: "Opportunities multiply as they are seized.", author: "Sun Tzu", source: "The Art of War", highlight: "multiply as they are seized" },
  { text: "He will win who knows when to fight and when not to fight.", author: "Sun Tzu", source: "The Art of War", highlight: "when not to fight" },
  { text: "Attack is the secret of defense; defense is the planning of an attack.", author: "Sun Tzu", source: "The Art of War", highlight: "defense is the planning of an attack" },
  { text: "Who wishes to fight must first count the cost.", author: "Sun Tzu", source: "The Art of War", highlight: "first count the cost" },

  // ── Friedrich Nietzsche ─────────────────────────────────────
  { text: "That which does not kill us, makes us stronger.", author: "Friedrich Nietzsche", highlight: "makes us stronger" },
  { text: "And those who were seen dancing were thought to be insane by those who could not hear the music.", author: "Friedrich Nietzsche", highlight: "could not hear the music" },
  { text: "One must still have chaos in oneself to be able to give birth to a dancing star.", author: "Friedrich Nietzsche", highlight: "give birth to a dancing star" },
  { text: "The higher we soar, the smaller we appear to those who cannot fly.", author: "Friedrich Nietzsche", highlight: "those who cannot fly" },
  { text: "Man must be surpassed.", author: "Friedrich Nietzsche", highlight: "Man must be surpassed" },
  { text: "The secret for harvesting from existence the greatest fruitfulness is to live dangerously.", author: "Friedrich Nietzsche", highlight: "live dangerously" },
  { text: "To live is to suffer, to survive is to find some meaning in the suffering.", author: "Friedrich Nietzsche", highlight: "find some meaning in the suffering" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", highlight: "bear almost any how" },
  { text: "In individuals, insanity is rare; but in groups, parties, nations and epochs, it is the rule.", author: "Friedrich Nietzsche", highlight: "it is the rule" },
  { text: "You must have chaos within you to give birth to a dancing star.", author: "Friedrich Nietzsche", highlight: "chaos within you" },

  // ── Napoleon Bonaparte ──────────────────────────────────────
  { text: "Impossible is a word found only in the dictionary of fools.", author: "Napoleon Bonaparte", highlight: "dictionary of fools" },
  { text: "Victory belongs to the most persevering.", author: "Napoleon Bonaparte", highlight: "most persevering" },
  { text: "Never interrupt your enemy when he is making a mistake.", author: "Napoleon Bonaparte", highlight: "making a mistake" },
  { text: "Death is nothing, but to live defeated and inglorious is to die daily.", author: "Napoleon Bonaparte", highlight: "to die daily" },
  { text: "Ability is nothing without opportunity.", author: "Napoleon Bonaparte", highlight: "nothing without opportunity" },
  { text: "A leader is a dealer in hope.", author: "Napoleon Bonaparte", highlight: "dealer in hope" },
  { text: "The battlefield is a scene of constant chaos. The winner will be the one who controls that chaos.", author: "Napoleon Bonaparte", highlight: "controls that chaos" },
  { text: "Take time to deliberate, but when the time for action has come, stop thinking and go in.", author: "Napoleon Bonaparte", highlight: "stop thinking and go in" },

  // ── Steve Jobs ───────────────────────────────────────────────
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", highlight: "Stay hungry, stay foolish" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", highlight: "living someone else's life" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", highlight: "love what you do" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", highlight: "a leader and a follower" },
  { text: "You can't connect the dots looking forward; you can only connect them looking backward.", author: "Steve Jobs", highlight: "connect them looking backward" },
  { text: "I'm convinced that about half of what separates successful entrepreneurs from non-successful ones is pure perseverance.", author: "Steve Jobs", highlight: "pure perseverance" },
  { text: "Be a yardstick of quality. Some people aren't used to an environment where excellence is expected.", author: "Steve Jobs", highlight: "excellence is expected" },
  { text: "I want to put a ding in the universe.", author: "Steve Jobs", highlight: "ding in the universe" },

  // ── Marcus Epictetus ────────────────────────────────────────
  { text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus", highlight: "how you react" },
  { text: "Seek not the good in external things; seek it in yourself.", author: "Epictetus", highlight: "seek it in yourself" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", highlight: "do what you have to do" },
  { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus", highlight: "what is in your power" },
  { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus", highlight: "rejoices for those which he has" },

  // ── Aristotle ────────────────────────────────────────────────
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", highlight: "Excellence is not an act, but a habit" },
  { text: "It is the mark of an educated mind to be able to entertain a thought without accepting it.", author: "Aristotle", highlight: "entertain a thought without accepting it" },
  { text: "You will never do anything in this world without courage.", author: "Aristotle", highlight: "without courage" },
  { text: "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.", author: "Aristotle", highlight: "high intention, sincere effort" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", highlight: "beginning of all wisdom" },

  // ── Nikola Tesla ─────────────────────────────────────────────
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla", highlight: "the future is mine" },
  { text: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", author: "Nikola Tesla", highlight: "energy, frequency and vibration" },
  { text: "I don't care that they stole my idea. I care that they don't have any of their own.", author: "Nikola Tesla", highlight: "they don't have any of their own" },
  { text: "Be alone, that is the secret of invention; be alone, that is when ideas are born.", author: "Nikola Tesla", highlight: "Be alone" },
  { text: "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries.", author: "Nikola Tesla", highlight: "non-physical phenomena" },

  // ── Jocko Willink ────────────────────────────────────────────
  { text: "Discipline equals freedom.", author: "Jocko Willink", highlight: "Discipline equals freedom" },
  { text: "Don't expect to be motivated every day. Don't count on motivation. Count on discipline.", author: "Jocko Willink", highlight: "Count on discipline" },
  { text: "There are no bad teams, only bad leaders.", author: "Jocko Willink", highlight: "only bad leaders" },
  { text: "Default: aggressive.", author: "Jocko Willink", highlight: "Default: aggressive" },
  { text: "Prioritize and execute. When overwhelmed, don't try to do everything at once.", author: "Jocko Willink", highlight: "Prioritize and execute" },

  // ── Mike Tyson ───────────────────────────────────────────────
  { text: "Everyone has a plan until they get punched in the mouth.", author: "Mike Tyson", highlight: "punched in the mouth" },
  { text: "Fear is your best friend or your worst enemy. If you can control it, it can cook for you; it can heat your house.", author: "Mike Tyson", highlight: "If you can control it" },
  { text: "As long as we persevere and endure, we can get anything we want.", author: "Mike Tyson", highlight: "persevere and endure" },
  { text: "I'm a dreamer. I have to dream and reach for the stars, and if I miss a star then I grab a handful of clouds.", author: "Mike Tyson", highlight: "grab a handful of clouds" },
  { text: "Discipline is doing what you hate to do, but nonetheless doing it like you love it.", author: "Mike Tyson", highlight: "doing it like you love it" },

  // ── Confucius ────────────────────────────────────────────────
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", highlight: "rising every time we fall" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", highlight: "as long as you do not stop" },
  { text: "The man who asks a question is a fool for a minute, the man who does not ask is a fool for life.", author: "Confucius", highlight: "a fool for life" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", highlight: "we insist on making it complicated" },
  { text: "Wherever you go, go with all your heart.", author: "Confucius", highlight: "go with all your heart" },

  // ── Jordan Peterson ──────────────────────────────────────────
  { text: "Compare yourself to who you were yesterday, not to who someone else is today.", author: "Jordan B. Peterson", highlight: "who you were yesterday" },
  { text: "To stand up straight with your shoulders back is to accept the terrible responsibility of life.", author: "Jordan B. Peterson", highlight: "terrible responsibility of life" },
  { text: "The purpose of life is finding the largest burden that you can bear and bearing it.", author: "Jordan B. Peterson", highlight: "largest burden that you can bear" },
  { text: "You must determine where you are going in your life, because you cannot get there unless you move in that direction.", author: "Jordan B. Peterson", highlight: "move in that direction" },
  { text: "If you cannot bring peace to your household, how dare you try to rule a city?", author: "Jordan B. Peterson", highlight: "try to rule a city" },

  // ── Julius Caesar ────────────────────────────────────────────
  { text: "I came, I saw, I conquered.", author: "Julius Caesar", highlight: "I conquered" },
  { text: "It is better to create than to learn. Creating is the essence of life.", author: "Julius Caesar", highlight: "Creating is the essence of life" },
  { text: "Men willingly believe what they wish.", author: "Julius Caesar", highlight: "Men willingly believe what they wish" },
  { text: "Experience is the teacher of all things.", author: "Julius Caesar", highlight: "Experience is the teacher" },

  // ── Albert Einstein ──────────────────────────────────────────
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein", highlight: "Imagination encircles the world" },
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein", highlight: "take you everywhere" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", highlight: "never tried anything new" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein", highlight: "the ability to change" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein", highlight: "you must keep moving" },
];

export function getDailyQuote(): DailyQuote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return quotes[dayOfYear % quotes.length];
}
