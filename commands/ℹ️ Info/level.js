const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const { MemberData, GuildSettings } = require('../../models/Level')
const { createCanvas, loadImage, registerFont } = require('canvas')
const sharp = require('sharp')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your level and XP.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to check.')
        ),
    async execute(interaction) {
        const targetUser =
            interaction.options.getUser('user') || interaction.user
        const memberData = await MemberData.findOne({
            guildId: interaction.guild.id,
            userId: targetUser.id,
        })
        const guildData = await GuildSettings.findOne({
            guildId: interaction.guild.id,
        })
        const statusTarget =
            interaction.options.getMember('user') || interaction.member

        if (!memberData) {
            return interaction.reply({
                content: `${targetUser.username} has no level data.`,
                ephemeral: true,
            })
        }

        const xpNeeded = this.calculateXpNeeded(memberData.level, guildData)
        const progress = memberData.xp / xpNeeded

        registerFont('./utils/Poppins-Regular.ttf', { family: 'Poppins' })

        const canvasWidth = 934
        const canvasHeight = 282
        const canvas = createCanvas(canvasWidth, canvasHeight)
        const ctx = canvas.getContext('2d')

        // Background
        ctx.fillStyle = '#1C1F26'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#2C2F33'
        ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40)

        const innerStrokeColor = 'rgba(255, 255, 255, 0.3)'
        ctx.strokeStyle = innerStrokeColor
        ctx.lineWidth = 15
        ctx.strokeRect(7.5, 7.5, canvas.width - 15, canvas.height - 15)

        // Avatar
        const avatarUrl = targetUser.displayAvatarURL({
            format: 'webp',
            size: 256,
        })
        try {
            const response = await fetch(avatarUrl)
            const buffer = await response.buffer()
            const pngBuffer = await sharp(buffer).png().toBuffer()
            const avatar = await loadImage(pngBuffer)
            const avatarSize = 200
            const avatarX = 30
            const avatarY = 42

            ctx.save()
            ctx.beginPath()
            ctx.arc(
                avatarX + avatarSize / 2,
                avatarY + avatarSize / 2,
                avatarSize / 2,
                0,
                Math.PI * 2
            )
            ctx.clip()
            ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize)
            ctx.restore()

            const statusColor = await this.getStatusColor(
                statusTarget.presence?.status
            )
            ctx.fillStyle = statusColor
            ctx.beginPath()
            ctx.arc(
                avatarX + avatarSize - 45,
                avatarY + avatarSize - 25,
                20,
                0,
                Math.PI * 2
            )
            ctx.fill()
        } catch (error) {
            console.error(
                `Failed to load or convert avatar image: ${error.message}`
            )
            return interaction.reply({
                content: `Could not load avatar image for ${targetUser.username}.`,
                ephemeral: true,
            })
        }

        // Text
        ctx.fillStyle = '#EAEAEA'
        ctx.font = 'bold 52px "Poppins"'
        ctx.fillText(`${targetUser.username}`, 245, 110)
        ctx.font = 'bold 30px "Poppins"'
        ctx.fillText(`XP: ${memberData.xp} / ${xpNeeded}`, 245, 151)

        const leaderboardRank = await this.getLeaderboardRank(
            interaction.guild.id,
            memberData.level,
            memberData.xp
        )
        ctx.fillStyle = '#5E81AC'
        ctx.font = 'bold 40px "Poppins"'

        const rankText = `Rank #${leaderboardRank}`
        const levelText = `Level ${memberData.level}`
        const rankTextWidth = ctx.measureText(rankText).width
        const levelTextWidth = ctx.measureText(levelText).width
        const maxX = canvasWidth - 20
        const levelX = maxX - levelTextWidth
        const rankX = levelX - rankTextWidth - 20

        ctx.fillText(rankText, rankX, 60)
        ctx.fillText(levelText, levelX, 60)

        // Progress Bar
        const progressBarWidth = 600
        const progressBarHeight = 65
        const progressBarX = 245
        const progressBarY = 160

        ctx.fillStyle = '#EAEAEA'
        this.roundRect(
            ctx,
            progressBarX,
            progressBarY,
            progressBarWidth,
            progressBarHeight,
            30
        )
        ctx.fill()

        if (progress > 0) {
            ctx.fillStyle = '#43B581'
            this.roundRect(
                ctx,
                progressBarX,
                progressBarY,
                progress * progressBarWidth,
                progressBarHeight,
                progress > 0 ? 30 : 0
            )
            ctx.fill()
        }

        ctx.fillStyle = '#EAEAEA'
        ctx.font = 'bold 36px "Poppins"'
        ctx.fillText(
            `${Math.floor(progress * 100)}%`,
            progressBarX + progressBarWidth / 2 - 30,
            progressBarY + 47
        )

        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
            name: 'level.png',
        })
        await interaction.reply({
            content: `${targetUser.username}'s Level Information:`,
            files: [attachment],
        })
    },
    calculateXpNeeded(level, guildData) {
        return level === 1
            ? guildData.startingXp
            : guildData.startingXp + (level - 1) * guildData.xpPerLevel
    },
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height
        )
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
        return ctx
    },
    getStatusColor(status) {
        switch (status) {
            case 'online':
                return '#43B581'
            case 'idle':
                return '#F9A825'
            case 'dnd':
                return '#E84118'
            case 'offline':
            default:
                return '#7E7B7A'
        }
    },
    async getLeaderboardRank(guildId, level, xp) {
        const leaderboard = await MemberData.find({ guildId: guildId })
            .sort({ level: -1, xp: -1 })
            .lean()
        const rank =
            leaderboard.findIndex(
                (user) =>
                    user.level === level &&
                    user.guildId === guildId &&
                    user.xp === xp
            ) + 1
        return rank > 0 ? rank : 'NA'
    },
}
