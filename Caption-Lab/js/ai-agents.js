// AIAgents - Simulates 3 AI agents with template-based generation
class AIAgents {
    constructor() {
        this.initializeTemplates();
        this.initializeTrendingAudio();
    }

    initializeTemplates() {
        // On-screen text templates by tone
        this.onScreenTemplates = {
            funny: [
                "POV: {context}",
                "Nobody:\nMaximo: {context}",
                "{context} energy",
                "When {context}:",
                "Why is he {context}?",
                "That one friend who {context}",
                "Me: *{context}*\nEveryone:",
                "{context} but make it ✨dramatic✨",
                "Sir this is a Wendys",
                "The audacity 😤",
                "He really said: {context}",
                "Not {context} again 💀"
            ],
            wholesome: [
                "Just {context} things 💕",
                "{context} and it shows",
                "Living his best life",
                "Pure {context} vibes",
                "This is the way 🐾",
                "Blessed mustache energy",
                "Happiness is {context}",
                "Precious moment captured"
            ],
            chaotic: [
                "CHAOS: {context}",
                "No thoughts, only {context}",
                "Unhinged {context} hours",
                "What is happening",
                "This feels illegal",
                "Absolute madness",
                "Zero chill detected",
                "Feral energy: maximum"
            ],
            sarcastic: [
                "Oh sure, {context}. Totally normal.",
                "Just casually {context}",
                "{context}. As one does.",
                "Nothing to see here",
                "Perfectly reasonable behavior",
                "This is fine 🔥",
                "Yeah that makes sense",
                "Classic {context}"
            ],
            inspirational: [
                "Believe in {context}",
                "Your daily reminder: {context}",
                "Be like Maximo. {context}.",
                "Dream big, {context} bigger",
                "The mustache chose greatness",
                "Never give up on {context}",
                "You got this 💪",
                "Manifest that {context}"
            ]
        };

        // Caption templates
        this.captionTemplates = {
            funny: [
                "Can we talk about {context}? 😹",
                "Nobody:\nAbsolutely nobody:\nMaximo: {context}",
                "He really just {context} and thought we wouldn't notice",
                "POV: You're witnessing peak {context}",
                "The way he {context} tho 💀",
                "I can't with this {context} energy",
                "Maximo said {context} and meant it",
                "Sir please explain the {context}"
            ],
            wholesome: [
                "Just Maximo {context} 💕\n\nNothing else matters.",
                "This is what {context} looks like ✨",
                "Pure, unfiltered {context}",
                "Living proof that {context} is everything",
                "When {context} is life 🐾",
                "Blessed with this {context} moment"
            ],
            chaotic: [
                "WHAT IS HAPPENING WITH {context}",
                "No context. Only {context}. No questions.",
                "The chaos of {context} is unmatched",
                "This {context} cannot be contained",
                "Absolute mayhem: {context} edition",
                "Feral {context} hours activated"
            ],
            sarcastic: [
                "Oh absolutely, {context} is completely normal 🙄",
                "Just another day of {context}. Nothing unusual here.",
                "Sure, {context}. Why not.",
                "This {context} makes total sense /s",
                "Classic {context} behavior. Of course."
            ],
            inspirational: [
                "Let Maximo's {context} inspire you today 💫",
                "This is your sign to embrace {context}",
                "Be the {context} you want to see in the world",
                "Never underestimate the power of {context}",
                "Today's mantra: {context}"
            ]
        };

        // Series formats
        this.seriesFormats = {
            SteveHarveyMustache: {
                onScreenVariants: [
                    "Day {day}: Still waiting...",
                    "Update: Steve hasn't responded (Day {day})",
                    "The mustache journey continues... Day {day}",
                    "Day {day} of the mustache saga",
                    "Steve Harvey where u at? (Day {day})"
                ],
                captionFormat: "Day {day} of asking Steve Harvey if I can borrow his mustache.\n\n{context}\n\nI think he's ignoring me at this point."
            },
            MrMonopoly: {
                onScreenVariants: [
                    "Rent is due 🎩",
                    "I own Boardwalk now",
                    "Capitalism but make it fluffy",
                    "That's $200 please",
                    "The 1% has whiskers"
                ],
                captionFormat: "Mr. Monopoly if he was a cat:\n{context}\n\n10/10 would still pay rent"
            },
            PokerFace: {
                onScreenVariants: [
                    "10/10 poker face",
                    "Unreadable",
                    "What is he thinking?",
                    "Zero thoughts detected",
                    "The mystery continues"
                ],
                captionFormat: "10/10 poker face.\n\n{context}\n\nWhat goes on in that little brain? Nobody knows."
            }
        };
    }

    initializeTrendingAudio() {
        this.trendingAudio = [
            { title: "Oh No", artist: "Kreepa", platform: "tiktok", category: "funny", trendScore: 0.92 },
            { title: "Funny Song", artist: "Cavendish Music", platform: "tiktok", category: "funny", trendScore: 0.88 },
            { title: "original sound", artist: "catmemes", platform: "tiktok", category: "pets", trendScore: 0.85 },
            { title: "Monkeys Spinning Monkeys", artist: "Kevin MacLeod", platform: "tiktok", category: "funny", trendScore: 0.83 },
            { title: "Lazy Sunday", artist: "Official Sound Studio", platform: "instagram", category: "pets", trendScore: 0.89 },
            { title: "Quirky Dog", artist: "Biz Baz Studio", platform: "instagram", category: "funny", trendScore: 0.86 },
            { title: "original sound", artist: "petlovers", platform: "instagram", category: "pets", trendScore: 0.84 },
            { title: "Sneaky Snitch", artist: "Kevin MacLeod", platform: "tiktok", category: "funny", trendScore: 0.81 },
            { title: "Comedy Background", artist: "Bensound", platform: "facebook", category: "funny", trendScore: 0.78 },
            { title: "Happy Whistling", artist: "AudioCoffee", platform: "instagram", category: "wholesome", trendScore: 0.87 },
            { title: "Cute Cat", artist: "Royalty Free Music", platform: "tiktok", category: "pets", trendScore: 0.90 },
            { title: "Spongebob Tomfoolery", artist: "Dante9k", platform: "tiktok", category: "funny", trendScore: 0.94 }
        ];
    }

    async generate(inputs, mediaData) {
        // Simulate network delay
        await this.delay(1500);

        return {
            onScreenText: this.generateOnScreenText(inputs),
            captions: this.generateCaptions(inputs),
            hashtags: this.generateHashtags(inputs),
            trendingAudio: this.generateTrendingAudio(inputs)
        };
    }

    generateOnScreenText(inputs) {
        const results = [];
        const count = Utils.randomInt(8, 12);

        // If series with day number, add series-specific options first
        if (inputs.series && inputs.seriesDay && this.seriesFormats[inputs.series]) {
            const seriesData = this.seriesFormats[inputs.series];
            const numSeriesVariants = Math.min(3, seriesData.onScreenVariants.length);

            for (let i = 0; i < numSeriesVariants; i++) {
                const variant = seriesData.onScreenVariants[i];
                results.push({
                    text: variant.replace('{day}', inputs.seriesDay),
                    styleHint: "center, bold",
                    hookStrength: Utils.randomInt(4, 5)
                });
            }
        }

        // Generate rest from tone templates
        const primaryTone = inputs.tones[0] || 'funny';
        const templates = this.onScreenTemplates[primaryTone] || this.onScreenTemplates.funny;

        while (results.length < count) {
            const template = Utils.randomChoice(templates);
            const contextPhrase = this.extractContextPhrase(inputs.notes);

            results.push({
                text: template.replace('{context}', contextPhrase),
                styleHint: Utils.randomChoice(["top-left, small", "center, bold", "bottom, italic", "center, large"]),
                hookStrength: Utils.randomInt(2, 5)
            });
        }

        return results;
    }

    generateCaptions(inputs) {
        const results = [];
        const count = Utils.randomInt(6, 10);

        // If series format, add series caption first
        if (inputs.series && inputs.seriesDay && this.seriesFormats[inputs.series]) {
            const seriesData = this.seriesFormats[inputs.series];
            let caption = seriesData.captionFormat
                .replace('{day}', inputs.seriesDay)
                .replace('{context}', inputs.notes || "being iconic");

            caption = this.addCTA(caption, inputs.cta);

            results.push({
                caption: caption,
                tone: "series",
                ctaIncluded: !!inputs.cta
            });
        }

        // Generate captions for each selected tone
        inputs.tones.forEach(tone => {
            if (results.length >= count) return;

            const templates = this.captionTemplates[tone] || this.captionTemplates.funny;
            const template = Utils.randomChoice(templates);
            const contextPhrase = inputs.notes || "being absolutely iconic";

            let caption = template.replace('{context}', contextPhrase);
            caption = this.addCTA(caption, inputs.cta);

            results.push({
                caption: caption,
                tone: tone,
                ctaIncluded: !!inputs.cta
            });
        });

        // Fill remaining slots with varied captions
        while (results.length < count) {
            const tone = Utils.randomChoice(inputs.tones);
            const templates = this.captionTemplates[tone] || this.captionTemplates.funny;
            const template = Utils.randomChoice(templates);

            let caption = template.replace('{context}', inputs.notes || "vibing");
            caption = this.addCTA(caption, inputs.cta);

            results.push({
                caption: caption,
                tone: tone,
                ctaIncluded: !!inputs.cta
            });
        }

        return results.slice(0, count);
    }

    generateHashtags(inputs) {
        const results = [];

        const baseHashtags = [
            "#catsofinstagram", "#cat", "#cats", "#catlover", "#catstagram",
            "#catlife", "#catoftheday", "#tuxedocat", "#maximo", "#catsoftheworld"
        ];

        const platformHashtags = {
            instagram: [
                ...baseHashtags,
                "#instacat", "#catphotography", "#meow", "#catlovers",
                "#catloversclub", "#catsofinsta", "#kitty", "#catsagram",
                "#catmodel", "#mustache", "#tuxedocatsofinstagram", "#blackandwhitecat",
                "#dailycat", "#catcontent", "#catvibes"
            ],
            tiktok: [
                "#cat", "#catsoftiktok", "#fyp", "#foryou", "#foryoupage",
                "#cattok", "#catvideos", "#funnycat", "#catmemes", "#catlife",
                "#tuxedocat", "#maximo", "#catlover", "#viral"
            ],
            facebook: [
                ...baseHashtags,
                "#catlovers", "#catmom", "#catdad", "#catfamily",
                "#catcommunity", "#catpics", "#funnycats"
            ]
        };

        inputs.platforms.forEach(platform => {
            const availableHashtags = platformHashtags[platform] || baseHashtags;
            const count = platform === 'tiktok' ? Utils.randomInt(5, 8) :
                         platform === 'instagram' ? Utils.randomInt(15, 20) :
                         Utils.randomInt(10, 15);

            const hashtags = availableHashtags.slice(0, count);

            let copyBlock;
            if (inputs.constraints.includes('spacedHashtags')) {
                copyBlock = "\n\n" + hashtags.join(" ");
            } else {
                copyBlock = hashtags.join(" ");
            }

            results.push({
                platform: platform,
                hashtags: hashtags,
                copyBlock: copyBlock
            });
        });

        return results;
    }

    generateTrendingAudio(inputs) {
        // Filter by selected platforms
        let filtered = this.trendingAudio.filter(audio => {
            return inputs.platforms.includes(audio.platform);
        });

        // Sort by trend score
        filtered.sort((a, b) => b.trendScore - a.trendScore);

        // Take top 5-8
        const count = Utils.randomInt(5, 8);
        const selected = filtered.slice(0, count);

        // Add rationale for each
        return selected.map(audio => ({
            ...audio,
            whyItFits: this.generateAudioRationale(audio, inputs)
        }));
    }

    // Helper methods
    extractContextPhrase(notes) {
        if (!notes) return "being iconic";

        const words = notes.trim().split(/\s+/);
        if (words.length <= 3) return notes;

        return words.slice(0, 3).join(' ');
    }

    addCTA(caption, cta) {
        if (!cta) return caption;

        const ctas = {
            comment: "\n\nDrop a 😹 in the comments!",
            follow: "\n\nFollow for more Maximo content 🐾",
            rate: "\n\nRate his vibe 1-10 👇",
            share: "\n\nShare this with a cat lover! 💕"
        };

        return caption + (ctas[cta] || '');
    }

    generateAudioRationale(audio, inputs) {
        const primaryTone = inputs.tones[0] || 'funny';

        const rationales = [
            `Perfect ${primaryTone} vibe for this content`,
            `Trending in ${audio.platform} ${audio.category} category`,
            `Matches the ${primaryTone} energy perfectly`,
            `High engagement for cat content with this sound`,
            `Popular with similar creators right now`,
            `Great fit for ${inputs.postType} posts`,
            `Trending sound with ${Math.round(audio.trendScore * 100)}% virality score`,
            `Commonly used in ${audio.category} content`
        ];

        return Utils.randomChoice(rationales);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
