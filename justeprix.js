const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'game2',
        description: 'Joue au jeu Juste Prix avec le bot',
    },
    async execute(interaction) {
        const { member, channel } = interaction;

        // Générer un nombre aléatoire entre 1 et 100
        const randomNumber = Math.floor(Math.random() * 100) + 1;

        let attempts = 0;
        let gameOver = false;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Juste Prix')
            .setDescription('Devinez le nombre entre 1 et 100 !');

        const gameMessage = await channel.send({ embeds: [embed] });

        while (!gameOver) {
            const filter = m => m.author.id === member.id;
            const userResponse = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const userMessage = userResponse.first();
            userMessage.delete();

            const userGuess = parseInt(userMessage.content);

            if (isNaN(userGuess)) {
                await channel.send('Veuillez entrer un nombre valide.');
                continue;
            }

            attempts++;

            if (userGuess === randomNumber) {
                embed.setDescription(`Bravo, vous avez deviné le nombre en ${attempts} tentatives !`);
                gameOver = true;
            } else if (userGuess < randomNumber) {
                embed.setDescription('Le nombre à deviner est plus grand.');
            } else {
                embed.setDescription('Le nombre à deviner est plus petit.');
            }

            await gameMessage.edit({ embeds: [embed] });
        }
    },
};
