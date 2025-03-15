/*
 * Copyright (C) 2023 Cobblemon Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.cobblemon.mod.common.pokemon

import com.cobblemon.mod.common.Cobblemon
import com.cobblemon.mod.common.CobblemonBuildDetails
import com.cobblemon.mod.common.CobblemonNetwork.sendPacketToPlayers
import com.cobblemon.mod.common.CobblemonSounds
import com.cobblemon.mod.common.api.abilities.Abilities
import com.cobblemon.mod.common.api.abilities.Ability
import com.cobblemon.mod.common.api.abilities.AbilityPool
import com.cobblemon.mod.common.api.battles.model.actor.BattleActor
import com.cobblemon.mod.common.api.battles.model.actor.EntityBackedBattleActor
import com.cobblemon.mod.common.api.data.ShowdownIdentifiable
import com.cobblemon.mod.common.api.entity.PokemonSender
import com.cobblemon.mod.common.api.events.CobblemonEvents
import com.cobblemon.mod.common.api.events.CobblemonEvents.FRIENDSHIP_UPDATED
import com.cobblemon.mod.common.api.events.CobblemonEvents.POKEMON_FAINTED
import com.cobblemon.mod.common.api.events.pokemon.*
import com.cobblemon.mod.common.api.events.pokemon.healing.PokemonHealedEvent
import com.cobblemon.mod.common.api.molang.MoLangFunctions.addPokemonFunctions
import com.cobblemon.mod.common.api.molang.ObjectValue
import com.cobblemon.mod.common.api.moves.BenchedMove
import com.cobblemon.mod.common.api.moves.BenchedMoves
import com.cobblemon.mod.common.api.moves.Move
import com.cobblemon.mod.common.api.moves.MoveSet
import com.cobblemon.mod.common.api.moves.MoveTemplate
import com.cobblemon.mod.common.api.moves.Moves
import com.cobblemon.mod.common.api.pokeball.PokeBalls
import com.cobblemon.mod.common.api.pokemon.Natures
import com.cobblemon.mod.common.api.pokemon.PokemonProperties
import com.cobblemon.mod.common.api.pokemon.PokemonPropertyExtractor
import com.cobblemon.mod.common.api.pokemon.PokemonSpecies
import com.cobblemon.mod.common.api.pokemon.aspect.AspectProvider
import com.cobblemon.mod.common.api.pokemon.evolution.Evolution
import com.cobblemon.mod.common.api.pokemon.evolution.EvolutionController
import com.cobblemon.mod.common.api.pokemon.evolution.EvolutionDisplay
import com.cobblemon.mod.common.api.pokemon.evolution.EvolutionProxy
import com.cobblemon.mod.common.api.pokemon.evolution.PreEvolution
import com.cobblemon.mod.common.api.pokemon.experience.ExperienceGroup
import com.cobblemon.mod.common.api.pokemon.experience.ExperienceSource
import com.cobblemon.mod.common.api.pokemon.feature.SpeciesFeature
import com.cobblemon.mod.common.api.pokemon.feature.SpeciesFeatures
import com.cobblemon.mod.common.api.pokemon.feature.SynchronizedSpeciesFeature
import com.cobblemon.mod.common.api.pokemon.feature.SynchronizedSpeciesFeatureProvider
import com.cobblemon.mod.common.api.pokemon.friendship.FriendshipMutationCalculator
import com.cobblemon.mod.common.api.pokemon.labels.CobblemonPokemonLabels
import com.cobblemon.mod.common.api.pokemon.moves.LearnsetQuery
import com.cobblemon.mod.common.api.pokemon.stats.Stat
import com.cobblemon.mod.common.api.pokemon.stats.Stats
import com.cobblemon.mod.common.api.properties.CustomPokemonProperty
import com.cobblemon.mod.common.api.reactive.Observable
import com.cobblemon.mod.common.api.reactive.SettableObservable
import com.cobblemon.mod.common.api.reactive.SimpleObservable
import com.cobblemon.mod.common.api.scheduling.afterOnServer
import com.cobblemon.mod.common.api.storage.InvalidSpeciesException
import com.cobblemon.mod.common.api.riding.RidingProperties
import com.cobblemon.mod.common.api.storage.StoreCoordinates
import com.cobblemon.mod.common.api.storage.party.NPCPartyStore
import com.cobblemon.mod.common.api.storage.party.PlayerPartyStore
import com.cobblemon.mod.common.api.storage.pc.PCStore
import com.cobblemon.mod.common.api.types.ElementalType
import com.cobblemon.mod.common.api.types.ElementalTypes
import com.cobblemon.mod.common.api.types.tera.TeraType
import com.cobblemon.mod.common.api.types.tera.TeraTypes
import com.cobblemon.mod.common.battles.ActiveBattlePokemon
import com.cobblemon.mod.common.battles.ShowdownInterpreter
import com.cobblemon.mod.common.config.CobblemonConfig
import com.cobblemon.mod.common.datafixer.CobblemonSchemas
import com.cobblemon.mod.common.datafixer.CobblemonTypeReferences
import com.cobblemon.mod.common.entity.PlatformType
import com.cobblemon.mod.common.entity.npc.NPCEntity
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity
import com.cobblemon.mod.common.entity.pokemon.effects.IllusionEffect
import com.cobblemon.mod.common.net.messages.client.PokemonUpdatePacket
import com.cobblemon.mod.common.net.messages.client.effect.SpawnSnowstormEntityParticlePacket
import com.cobblemon.mod.common.net.messages.client.pokemon.update.*
import com.cobblemon.mod.common.net.serverhandling.storage.SendOutPokemonHandler.SEND_OUT_DURATION
import com.cobblemon.mod.common.net.serverhandling.storage.SendOutPokemonHandler.THROW_DURATION
import com.cobblemon.mod.common.pokeball.PokeBall
import com.cobblemon.mod.common.pokemon.activestate.ActivePokemonState
import com.cobblemon.mod.common.pokemon.activestate.InactivePokemonState
import com.cobblemon.mod.common.pokemon.activestate.PokemonState
import com.cobblemon.mod.common.pokemon.activestate.SentOutState
import com.cobblemon.mod.common.pokemon.activestate.ShoulderedState
import com.cobblemon.mod.common.pokemon.evolution.CobblemonEvolutionProxy
import com.cobblemon.mod.common.pokemon.evolution.controller.ClientEvolutionController
import com.cobblemon.mod.common.pokemon.evolution.controller.ServerEvolutionController
import com.cobblemon.mod.common.pokemon.evolution.progress.DamageTakenEvolutionProgress
import com.cobblemon.mod.common.pokemon.evolution.progress.RecoilEvolutionProgress
import com.cobblemon.mod.common.pokemon.feature.SeasonFeatureHandler
import com.cobblemon.mod.common.pokemon.feature.StashHandler
import com.cobblemon.mod.common.pokemon.properties.BattleCloneProperty
import com.cobblemon.mod.common.pokemon.properties.UncatchableProperty
import com.cobblemon.mod.common.pokemon.status.PersistentStatus
import com.cobblemon.mod.common.pokemon.status.PersistentStatusContainer
import com.cobblemon.mod.common.util.cobblemonResource
import com.cobblemon.mod.common.util.codec.internal.ClientPokemonP1
import com.cobblemon.mod.common.util.codec.internal.ClientPokemonP2
import com.cobblemon.mod.common.util.codec.internal.ClientPokemonP3
import com.cobblemon.mod.common.util.codec.internal.PokemonP1
import com.cobblemon.mod.common.util.codec.internal.PokemonP2
import com.cobblemon.mod.common.util.codec.internal.PokemonP3
import com.cobblemon.mod.common.util.lang
import com.cobblemon.mod.common.util.playSoundServer
import com.cobblemon.mod.common.util.server
import com.cobblemon.mod.common.util.setPositionSafely
import com.cobblemon.mod.common.util.toBlockPos
import com.google.gson.JsonObject
import com.mojang.datafixers.util.Pair
import com.mojang.serialization.Codec
import com.mojang.serialization.DataResult
import com.mojang.serialization.DynamicOps
import com.mojang.serialization.JsonOps
import com.mojang.serialization.codecs.RecordCodecBuilder
import java.util.UUID
import java.util.concurrent.CompletableFuture
import kotlin.math.absoluteValue
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.random.Random
import net.minecraft.core.BlockPos
import net.minecraft.core.RegistryAccess
import net.minecraft.nbt.CompoundTag
import net.minecraft.nbt.NbtOps
import net.minecraft.network.RegistryFriendlyByteBuf
import net.minecraft.network.chat.MutableComponent
import net.minecraft.network.chat.contents.PlainTextContents
import net.minecraft.network.codec.ByteBufCodecs
import net.minecraft.network.codec.StreamCodec
import net.minecraft.server.level.ServerLevel
import net.minecraft.server.level.ServerPlayer
import net.minecraft.tags.FluidTags
import net.minecraft.util.Mth.ceil
import net.minecraft.util.Mth.clamp
import net.minecraft.util.StringRepresentable
import net.minecraft.world.InteractionHand
import net.minecraft.world.entity.LivingEntity
import net.minecraft.world.entity.player.Player
import net.minecraft.world.item.ItemStack
import net.minecraft.world.level.Level
import net.minecraft.world.level.block.CactusBlock
import net.minecraft.world.level.block.CampfireBlock
import net.minecraft.world.level.block.FireBlock
import net.minecraft.world.level.block.MagmaBlock
import net.minecraft.world.level.block.SweetBerryBushBlock
import net.minecraft.world.level.block.WitherRoseBlock
import net.minecraft.world.phys.Vec3
import kotlin.math.*

import net.minecraft.util.Mth

enum class OriginalTrainerType : StringRepresentable {
    NONE, PLAYER, NPC;

    override fun getSerializedName() = this.name
    companion object {
        @JvmStatic
        val CODEC: Codec<OriginalTrainerType> = StringRepresentable.fromEnum(OriginalTrainerType::values)
    }
}

open class Pokemon : ShowdownIdentifiable {
    var uuid = UUID.randomUUID()
    var species = PokemonSpecies.random()
        set(value) {
            val valName: Unit = initialValue
            if (PokemonSpecies.getByIdentifier(value.resourceIdentifier) == null) {
                throw IllegalArgumentException("Cannot set a species that isn't registered")
            }
            val quotient = clamp(currentHealth / maxHealth.toFloat(), 0F, 1F)
            val oldValue = field
            field = value
            if (!isClient) {
                val newFeatures = SpeciesFeatures.getFeaturesFor(species).mapNotNull { it.invoke(this) }
                features.clear()
                features.addAll(newFeatures)
                if (oldValue != value) {
                    evolutionProxy.current().clear()
                }
            }
            updateAspects()
            updateForm()
            checkGender()
            updateHP(quotient)
            this.attemptAbilityUpdate()
            _species.emit(value)
            
}
 
    var form = species.standardForm
        set(value) {
            // Species updates already update HP but just a form change may require it
            // Moved to before the field was set else it won't actually do the hp calc proper <3
            val quotient = clamp(currentHealth / maxHealth.toFloat(), 0F, 1F)
            field = value
            this.updateMovesOnFormChange(value)
            // Evo proxy is already cleared on species update but the form may be changed by itself, this is fine and no unnecessary packets will be sent out
            this.evolutionProxy.current().clear()
            checkGender()
            updateHP(quotient)
            this.attemptAbilityUpdate()
            _form.emit(value)
        }

    // Need to happen before currentHealth init due to the calc
    var ivs = IVs.createRandomIVs()
        internal set
    var evs = EVs.createEmpty()
        internal set

    fun setIV(stat : Stat, value : Int) {
        val quotient = clamp(currentHealth / maxHealth.toFloat(), 0F, 1F)
        ivs[stat] = value
        if(stat == Stats.HP) {
            updateHP(quotient)
        }
        _ivs.emit(ivs)
    }

    fun setEV(stat: Stat, value : Int) {
        val quotient = clamp(currentHealth / maxHealth.toFloat(), 0F, 1F)
        evs[stat] = value
        if(stat == Stats.HP) {
            updateHP(quotient)
        }
        _evs.emit(evs)
    }

    var nickname: MutableComponent? = null
        set(value) {
            field = value
            _nickname.emit(value)
        }

    fun getDisplayName(): MutableComponent = nickname?.copy()?.takeIf { it.contents != PlainTextContents.EMPTY } ?: species.translatedName.copy()

    var level = 1
        set(value) {
            val boundedValue = clamp(value, 1, Cobblemon.config.maxPokemonLevel)
            val hpRatio = (currentHealth / maxHealth.toFloat()).coerceIn(0F, 1F)
            /*
             * When people set the level programmatically the experience value will become incorrect.
             * Specifically check for when there's a mismatch and update the experience.
             */
            field = boundedValue
            if (experienceGroup.getLevel(experience) != boundedValue || value == Cobblemon.config.maxPokemonLevel) {
                experience = experienceGroup.getExperience(boundedValue)
            }
        //            _level.emit(value)

            currentHealth = ceil(hpRatio * maxHealth).coerceIn(0..maxHealth)
        }

    var currentHealth = this.maxHealth
        set(value) {
            if (value == field) {
                return
            }

            if (value <= 0) {
                entity?.health = 0F
                status = null
            }
            field = max(min(maxHealth, value), 0)
            _currentHealth.emit(field)

            // If the Pokémon is fainted, give it a timer for it to wake back up
            if (this.isFainted()) {
                decrementFriendship(1)
                val faintTime = Cobblemon.config.defaultFaintTimer
                POKEMON_FAINTED.post(PokemonFaintedEvent(this, faintTime)) {
                    this.faintedTimer = it.faintedTimer
                }
                // These are meant to reset on faint
                this.evolutionProxy.current().progress()
                    .filter { it is RecoilEvolutionProgress || it is DamageTakenEvolutionProgress }
                    .forEach { it.reset() }
            }
            this.healTimer = Cobblemon.config.healTimer
        }

    var gender = Gender.GENDERLESS
        set(value) {
            if (!isClient && value !in species.possibleGenders) {
                return
            }
            field = value
            updateAspects()
            _gender.emit(value)
        }

    var status: PersistentStatusContainer? = null
        set(value) {
            field = value
            this._status.emit(value?.status)
        }

    var experience = 0
        internal set(value) {
            field = value
            if (this.level == Cobblemon.config.maxPokemonLevel) {
                field = this.experienceGroup.getExperience(this.level)
            }
            _experience.emit(field)
        }

    /**
     * The friendship amount on this Pokémon.
     * Use [setFriendship], [incrementFriendship] and [decrementFriendship] for safe mutation with return feedback.
     * See this [page](https://bulbapedia.bulbagarden.net/wiki/Friendship) for more information.
     */
    var friendship = this.form.baseFriendship
        private set(value) {
            if (!this.isPossibleFriendship(value)) {
                return
            }
            FRIENDSHIP_UPDATED.post(FriendshipUpdatedEvent(this, value)) {
                field = it.newFriendship
                _friendship.emit(it.newFriendship)
            }
        }

    var state: PokemonState = InactivePokemonState()
        set(value) {
            if (field != value) {
                field = value
                _state.emit(value)
            }
        }

    val entity: PokemonEntity?
        get() = state.let { if (it is ActivePokemonState) it.entity else null }

    val primaryType: ElementalType
        get() = form.primaryType

    val secondaryType: ElementalType?
        get() = form.secondaryType

    val types: Iterable<ElementalType>
        get() = form.types

    var teraType: TeraType = TeraTypes.forElementalType(this.primaryType)
        set(value) {
            field = value
            _teraType.emit(value)
        }

    var dmaxLevel = 0
        set(value) {
            field = value.coerceIn(0, Cobblemon.config.maxDynamaxLevel)
            _dmaxLevel.emit(value)
        }

    /**
     * A Pokemon can have the G-Max factor if its species, or any of its evolutions' species, have a G-Max form.
     * This does not always indicate whether a Pokemon can G-Max (e.g. Charmander, Squirtle, Bulbasaur).
     */
    var gmaxFactor = false
        set(value) {
            val evolutions = species.standardForm.evolutions.mapNotNull { it.result.species }.mapNotNull { PokemonSpecies.getByName(it) }
            if (species.canGmax() || evolutions.find { it.canGmax() } != null) {
                field = value
                _gmaxFactor.emit(value)
            }
        }

    var shiny = false
        set(value) {
            field = value
            updateAspects()
            _shiny.emit(value)
        }

    var tradeable = true
        set(value) {
            field = value
            _tradeable.emit(value)
        }

    var nature = Natures.getRandomNature()
        set(value) { field = value ; _nature.emit(value) }
    var mintedNature: Nature? = null
        set(value) { field = value ; _mintedNature.emit(value) }
    val effectiveNature: Nature
        get() = mintedNature ?: nature

    val moveSet = MoveSet()

    val experienceGroup: ExperienceGroup
        get() = form.experienceGroup

    var faintedTimer: Int = -1
        set(value) {
            field = value
            anyChangeObservable.emit(this)
        }

    var healTimer: Int = -1
        set(value) {
            field = value
            anyChangeObservable.emit(this)
        }

    var tetheringId: UUID? = null
        set(value) {
            field = value
            _tetheringId.emit(value)
        }

    var originalTrainerType: OriginalTrainerType = OriginalTrainerType.NONE
        internal set

    /**
     * Either:
     * - The Minecraft UniqueID of a Player
     * - A display name for a Fake OT
     * - Null
     */
    var originalTrainer: String? = null
        internal set

    /**
     * The cached Display Name of the Original Trainer
     */
    var originalTrainerName: String? = null
        set(value) {
            field = value
            _originalTrainerName.emit(value)
        }


    /**
     * All moves that the Pokémon has, at some point, known. This is to allow players to
     * swap in moves they've used before at any time, while holding onto the remaining PP
     * that they had last.
     */
    var benchedMoves = BenchedMoves()
        internal set

    var ability: Ability = Abilities.DUMMY.create(false)
        // Keep internal for DTO & sync packet
        internal set(value) {
            if (field != value) {
                _ability.emit(value)
            }
            field = value
        }

    val maxHealth: Int
        get() = getStat(Stats.HP)
    @Deprecated("Use maxHealth instead", ReplaceWith("maxHealth"), level = DeprecationLevel.WARNING)
    val hp: Int
        get() = maxHealth
    val attack: Int
        get() = getStat(Stats.ATTACK)
    val defence: Int
        get() = getStat(Stats.DEFENCE)
    val specialAttack: Int
        get() = getStat(Stats.SPECIAL_ATTACK)
    val specialDefence: Int
        get() = getStat(Stats.SPECIAL_DEFENCE)
    val speed: Int
        get() = getStat(Stats.SPEED)

    var scaleModifier = 1F

    var caughtBall: PokeBall = PokeBalls.POKE_BALL
        set(value) { field = value ; _caughtBall.emit(caughtBall) }
    var features = mutableListOf<SpeciesFeature>()
    var cosmeticItem = ItemStack.EMPTY
        set(value) {
            field = value
            updateAspects()
            _cosmeticItem.emit(value)
        }

    fun asRenderablePokemon() = RenderablePokemon(species, aspects)

    /**
     * A set of aspects that were not calculated and must always be a part of the Pokémon's aspect list. This is the
     * appropriate way to force an aspect onto a Pokémon. Updating this set will recalculate [aspects] and sync these
     * to the client, as well as any form updates that may be necessary. The forced aspects are persisted to both JSON
     * and NBT.
     */
    var forcedAspects = setOf<String>()
        set(value) {
            field = value
            updateAspects()
        }

    /**
     * This is a list of simple flag-based discriminators that can contribute to making a Pokémon unique. This set
     * in particular is the master list of aspects for this [Pokemon], and is made up of both [forcedAspects] (a set
     * which is decisive and not the result of any calculations) and a collection of aspects that were calculated from
     * [AspectProvider]s.
     *
     * You should NOT be setting this directly because this property only exists to essentially cache the results of
     * [AspectProvider]s. If you want to force an aspect, update [forcedAspects].
     */
    var aspects = setOf<String>()
        private set(value) {
            if (field != value) {
                field = value
                if (!isClient) {
                    updateForm()
                }
                _aspects.emit(value)
            }
        }

    /** If you're not a Cobblemon dev you should probably leave this right alone. */
    internal var isClient = false
    val storeCoordinates = SettableObservable<StoreCoordinates<*>?>(null)

    // We want non-optional evolutions to trigger first to avoid unnecessary packets and any cost associate with an optional one that would just be lost
    val evolutions: Iterable<Evolution> get() = this.form.evolutions.sortedBy { evolution -> evolution.optional }
    val lockedEvolutions: Iterable<Evolution>
        get() = evolutions.filter { it !in evolutionProxy.current() }

    val preEvolution: PreEvolution? get() = this.form.preEvolution

    /**
     * Provides the sided [EvolutionController]s, these operations can be done safely with a simple side check.
     * This can be done beforehand or using [EvolutionProxy.isClient].
     */
    var evolutionProxy: EvolutionProxy<EvolutionDisplay, Evolution, ClientEvolutionController.Intermediate, ServerEvolutionController.Intermediate> = CobblemonEvolutionProxy(this.self())
        private set

    val customProperties = mutableListOf<CustomPokemonProperty>()

    /**
     * Arbitrary data compound. Be aware that updating this is not enough for a Pokémon to be recognized as dirty
     * and in need of saving. Emit to [anyChangeObservable] if you are making a change otherwise you'll see reversions.
     */
    var persistentData: CompoundTag =
        CompoundTag()
        internal set

    /**
     * The [ItemStack] this Pokémon is holding.
     */
    internal var heldItem: ItemStack = ItemStack.EMPTY

    /**
     * Whether this Pokémon's held item is visible or not
     */
    var heldItemVisible: Boolean = true

    val riding: RidingProperties
        get() = this.form.riding

    init {
        storeCoordinates.subscribe { if (it != null && it.store !is PCStore && this.tetheringId != null) afterOnServer(seconds = 0.05F) { this.tetheringId = null } }
        storeCoordinates.subscribe {
            it?.store?.getObservingPlayers()?.forEach {
                CobblemonEvents.POKEMON_GAINED.post(PokemonGainedEvent(it.uuid, this))
            }
        }
    }


    open fun getStat(stat: Stat) = Cobblemon.statProvider.getStatForPokemon(this, stat)

    /**
     * The literal Showdown ID of this Pokémon.
     * This will either use [Species.showdownId] or [FormData.showdownId] depending on if the [form] is the base one or not.
     * 
     * @return The literal Showdown ID of this Pokémon.
     */
    override fun showdownId(): String {
        if (this.form == this.species.standardForm) {
            return this.species.showdownId()
        }
        return this.form.showdownId()
    }

    fun sendOut(level: ServerLevel, position: Vec3, illusion: IllusionEffect?, mutation: (PokemonEntity) -> Unit = {}): PokemonEntity? {
        CobblemonEvents.POKEMON_SENT_PRE.postThen(PokemonSentPreEvent(this, level, position)) {
            SeasonFeatureHandler.updateSeason(this, level, position.toBlockPos())
            val entity = PokemonEntity(level, this)
            illusion?.start(entity)
            val adjustedPosition = entity.getAjustedSendoutPosition(position)
            val sentOut = entity.setPositionSafely(adjustedPosition)
            //If sendout failed, fall back
            if (!sentOut) {
                entity.setPos(adjustedPosition.x, adjustedPosition.y, adjustedPosition.z)
            }
            mutation(entity)
            level.addFreshEntity(entity)
            state = SentOutState(entity)
            return entity
        }
        return null
    }

    fun sendOutWithAnimation(
        source: LivingEntity,
        level: ServerLevel,
        position: Vec3,
        battleId: UUID? = null,
        doCry: Boolean = true,
        illusion: IllusionEffect? = null,
        mutation: (PokemonEntity) -> Unit = {},
    ): CompletableFuture<PokemonEntity> {


        // Handle special case of shouldered Cobblemon
        if (this.state is ShoulderedState) {
            return sendOutFromShoulder(source as ServerPlayer, level, position, battleId, doCry, illusion, mutation)
        }

        // Proceed as normal for non-shouldered Cobblemon
        val future = CompletableFuture<PokemonEntity>()
        val preamble = if (source is PokemonSender) {
            source.sendingOut(this)
        } else {
            CompletableFuture.completedFuture(Unit)
        }

        preamble.thenApply {
            sendOut(level, position, illusion) {
                val owner = getOwnerEntity()
                if (owner is LivingEntity) {
                    owner.swing(InteractionHand.MAIN_HAND, true)
                    val spawnDirection: Vec3
                    var spawnYaw: Double
                    if (battleId != null) {
                        // Look for an opposing opponent to face
                        val battle = Cobblemon.battleRegistry.getBattle(battleId)
                        val activeBattlePokemon = battle?.activePokemon?.firstOrNull { activePokemon -> activePokemon.battlePokemon?.originalPokemon?.uuid == it.pokemon.uuid }
                        val opposingActiveBattlePokemon = (activeBattlePokemon?.getOppositeOpponent() as ActiveBattlePokemon?)
                        var opposingEntityPos = opposingActiveBattlePokemon?.battlePokemon?.entity?.position()
                        if (opposingEntityPos == null) {
                            // Can't find the opposing pokemon, it probably doesn't exist yet. Try to calculate the opponent's sendout position
                            val opposingEntityBattleActor = battle?.actors?.first { battleActor ->
                                battleActor is EntityBackedBattleActor<*> && battleActor.entity != null && battleActor.entity?.uuid !== owner.uuid
                            } as EntityBackedBattleActor<*>
                            if (activeBattlePokemon != null) {
                                opposingEntityPos = ShowdownInterpreter.getSendoutPosition(battle, activeBattlePokemon, opposingEntityBattleActor as BattleActor)
                            }
                            if (opposingEntityPos == null) {
                                // Sendout calculation failed, fallback to using the opposing actor's position
                                opposingEntityPos = opposingEntityBattleActor.initialPos
                            }
                        }
                        spawnDirection = opposingEntityPos?.subtract(it.position()) ?: position.subtract(owner.position())
                        val battleYaw = (atan2(spawnDirection.z, spawnDirection.x) * 180.0 / PI) - 90.0
                        spawnYaw = battleYaw
                    } else {
                        // Non-battle send out, face the trainer
                        spawnDirection = position.subtract(owner.position())
                        spawnYaw = atan2(spawnDirection.z, spawnDirection.x) * 180.0 / PI + 102.5
                    }

                    // In some edge cases, I suspect we are producing NaN's here. This actually leads into a really big problem.
                    // Why? Because on tick, LivingEntity tries to bring rotations back within one loop around 0-360 using while loops.
                    // NaN resists arithmetic, so the while loops run forever and the server thread will hang trying to normalize
                    // this angle. Better to catch it here and correct it. Y'know. If this is actually the problem. I believe!
                    if (!spawnYaw.isFinite()) {
                        spawnYaw = 0.0
                    } 
                    it.entityData.set(PokemonEntity.SPAWN_DIRECTION, Mth.wrapDegrees(spawnYaw.toFloat()))
                }
                if (owner != null) {
                    level.playSoundServer(owner.position(), CobblemonSounds.POKE_BALL_THROW, volume = 0.6F)
                }
                it.ownerUUID = getOwnerUUID()
                it.phasingTargetId = source.id
                it.beamMode = 1
                it.battleId = battleId

                if (it.battleId == null) {
                   it.platform = PlatformType.NONE
                }

                it.after(seconds = THROW_DURATION) {
                    it.phasingTargetId = -1
                }

                it.after(seconds = SEND_OUT_DURATION) {

                    // Allow recall animation to override sendout animation
                    if(it.beamMode == 3) {
                        future.complete(it)
                        return@after
                    }

                    it.phasingTargetId = -1
                    it.beamMode = 0
                    future.complete(it)
                    CobblemonEvents.POKEMON_SENT_POST.post(PokemonSentPostEvent(this, it))
                    if (doCry) {
                        it.cry()
                    }

                    if (illusion != null) {
                        if (illusion.mock.shiny == true) SpawnSnowstormEntityParticlePacket(cobblemonResource("shiny_ring"), it.id, listOf("shiny_particles", "middle")).sendToPlayersAround(it.x, it.y, it.z, 64.0, it.level().dimension())
                    } else {
                        if (shiny) SpawnSnowstormEntityParticlePacket(cobblemonResource("shiny_ring"), it.id, listOf("shiny_particles", "middle")).sendToPlayersAround(it.x, it.y, it.z, 64.0, it.level().dimension())
                    }
                }

                mutation(it)
            }
        }

        return future
    }

    /**
     * Send out the Pokémon from the player's shoulder.
     */
    fun sendOutFromShoulder(
        player: ServerPlayer,
        level: ServerLevel,
        targetPosition: Vec3,
        battleId: UUID? = null,
        doCry: Boolean = true,
        illusion: IllusionEffect? = null,
        mutation: (PokemonEntity) -> Unit = {}
    ): CompletableFuture<PokemonEntity> {
        val future = CompletableFuture<PokemonEntity>()

        // get the current position of the cobblemon on the players shoulder
        val isLeftShoulder = (state as ShoulderedState).isLeftShoulder
        val arbitraryXOffset = player.bbWidth * 0.3 + this.form.hitbox.width * 0.3
        val shoulderHorizontalOffset = if (isLeftShoulder) arbitraryXOffset else -arbitraryXOffset
        val rotation = player.yRot
        val approxShoulderMonHight = player.bbHeight.toDouble() - this.form.hitbox.height * 0.4
        val rotatedOffset = Vec3(
            shoulderHorizontalOffset,
            approxShoulderMonHight,
            0.0
        ).yRot(-rotation * (Math.PI.toFloat() / 180f))
        val currentPosition = player.position().add(rotatedOffset)

        recall()
        sendOut(level, currentPosition, illusion) {
            // Play some sound indicating hopping off
            level.playSoundServer(currentPosition, CobblemonSounds.PC_DROP, volume = 0.6F)

            // Make the Cobblemon walk to the target Position with haste
            it.moveControl.setWantedPosition(targetPosition.x, targetPosition.y, targetPosition.z, 1.2)
            it.battleId = battleId

            afterOnServer(seconds = SEND_OUT_DURATION) {
                future.complete(it)
                CobblemonEvents.POKEMON_SENT_POST.post(PokemonSentPostEvent(this, it))
                if (doCry) {
                    it.cry()
                }
            }

            mutation(it)
        }
        return future
    }

    fun recall() {
        CobblemonEvents.POKEMON_RECALLED.post(PokemonRecalledEvent(this, this.entity))
        val state = this.state as? ActivePokemonState
        this.state = InactivePokemonState()
        state?.recall()
    }

    fun tryRecallWithAnimation() {
        if (this.entity != null) {
            this.entity?.recallWithAnimation()
            return
        }
        this.recall()
    }

    fun heal() {
        CobblemonEvents.POKEMON_HEALED.postThen(PokemonHealedEvent(this)) { event ->
            this.currentHealth = maxHealth
            this.moveSet.heal()
            this.status = null
            this.faintedTimer = -1
            this.healTimer = -1
            val entity = entity
            entity?.heal(entity.maxHealth - entity.health)
        }
    }

    fun isFullHealth() = this.currentHealth == this.maxHealth

    fun didSleep() {
        this.currentHealth = min((currentHealth + (maxHealth / 2)), maxHealth)
        this.status = null
        this.faintedTimer = -1
        this.healTimer = -1
        val entity = entity
        entity?.heal(entity.maxHealth - entity.health)
        this.moveSet.partialHeal()
    }

    /**
     * Check if this Pokémon can be healed.
     * This verifies if HP is not maxed, any status is present or any move is not full PP.
     *
     * @return If this Pokémon can be healed.
     */
    fun canBeHealed() = this.maxHealth != this.currentHealth || this.status != null || this.moveSet.any { move -> move.currentPp != move.maxPp }

    fun isFainted() = currentHealth <= 0

    private fun updateHP(quotient: Float) {
        currentHealth = (maxHealth * quotient).roundToInt()
    }

    fun applyStatus(status: PersistentStatus) {
        this.status = PersistentStatusContainer(status, status.statusPeriod().random())
        if (this.status != null) {
            this._status.emit(this.status!!.status)
        }
    }

    fun isFireImmune(): Boolean {
        return ElementalTypes.FIRE in types || !form.behaviour.moving.swim.hurtByLava
    }

    fun isPositionSafe(world: Level, pos: Vec3): Boolean {
        return isPositionSafe(world, pos.toBlockPos())
    }

    fun isPositionSafe(world: Level, pos1: BlockPos): Boolean {
        // To make sure a location is safe, both the block the Pokemon is standing ON,
        // and the block it's standing IN need to be safe. pos2 represents the other position in that set.
        val pos2: BlockPos = if (world.getBlockState(pos1).isSolid) {
            pos1.above()
        } else {
            pos1.below()
        }

        val positions = arrayOf(pos1, pos2)
        var isSafe = true

        for (pos in positions) {
            if (isSafe) {
                val block = world.getBlockState(pos).block

                if (block is SweetBerryBushBlock ||
                    block is CactusBlock ||
                    block is WitherRoseBlock
                ) {
                    isSafe = false
                }

                if (!this.isFireImmune()) {
                    if (block is FireBlock ||
                        block is MagmaBlock ||
                        block is CampfireBlock ||
                        world.getBlockState(pos).fluidState.`is`(FluidTags.LAVA)
                    ) {
                        isSafe = false
                    }
                }
            }
        }

        return isSafe
    }

    /**
     * A utility method that checks if this Pokémon species or form data contains the [CobblemonPokemonLabels.LEGENDARY] label.
     * This is used in Pokémon officially considered legendary.
     *
     * @return If the Pokémon is legendary.
     */
    fun isLegendary() = this.hasLabels(CobblemonPokemonLabels.LEGENDARY)

    /**
     * A utility method that checks if this Pokémon species or form data contains the [CobblemonPokemonLabels.MYTHICAL] label.
     * This is used in Pokémon officially considered mythical.
     *
     * @return If the Pokémon is mythical.
     */
    fun isMythical() = this.hasLabels(CobblemonPokemonLabels.MYTHICAL)

    /**
     * A utility method that checks if this Pokémon species or form data contains the [CobblemonPokemonLabels.ULTRA_BEAST] label.
     * This is used in Pokémon officially considered an ultra beast.
     *
     * @return If the Pokémon is an ultra beast.
     */
    fun isUltraBeast() = this.hasLabels(CobblemonPokemonLabels.ULTRA_BEAST)

    /**
     * Checks if a Pokémon has all the given labels.
     * Tags used by the mod can be found in [CobblemonPokemonLabels].
     *
     * @param labels The different tags being queried.
     * @return If the Pokémon has all the given labels.
     */
    fun hasLabels(vararg labels: String) = labels.all { label -> this.form.labels.any { it.equals(label, true) } }

    /**
     * A utility method that checks if this Pokémon has the [UncatchableProperty.uncatchable] property.
     *
     * @return If the Pokémon is uncatchable.
     */
    fun isUncatchable() = UncatchableProperty.uncatchable().matches(this)

    /**
     * A utility method that checks if this Pokémon has the [BattleCloneProperty.isBattleClone] property.
     *
     * @return If the Pokémon is a battle clone.
     */
    fun isBattleClone() = BattleCloneProperty.isBattleClone().matches(this)

    /**
     * Returns a copy of the held item.
     * In order to change the [ItemStack] use [swapHeldItem].
     *
     * @return A copy of the [ItemStack] held by this Pokémon.
     */
    fun heldItem(): ItemStack = this.heldItem.copy()


    /**
     * Returns the backing held item, this is intended to skip the unnecessary copy operation for our internal use.
     * No mutations should be done to it and expected to synchronize.
     * If you wish to do so remember to set it with [swapHeldItem].
     *
     * @return The [ItemStack] held by this Pokémon.
     */
    internal fun heldItemNoCopy(): ItemStack = this.heldItem

    /**
     * Swaps out the current [heldItem] for the given [stack].
     * The assigned [heldItem] will always have the [ItemStack.count] of 1.
     *
     * The behavior of this method may be modified by third party, please see the [HeldItemEvent].
     *
     * @param stack The new [ItemStack] being set as the held item.
     * @param decrement If the given [stack] should have [ItemStack.decrement] invoked with the parameter of 1. Default is true.
     * @return The existing [ItemStack] being held or the [stack] if [HeldItemEvent.Pre] is canceled.
     *
     * @see [HeldItemEvent]
     */
    fun swapHeldItem(stack: ItemStack, decrement: Boolean = true): ItemStack {
        val existing = this.heldItem()
        CobblemonEvents.HELD_ITEM_PRE.postThen(HeldItemEvent.Pre(this, stack, existing, decrement), ifSucceeded = { event ->
            val giving = event.receiving.copy().apply { count = 1 }
            if (event.decrement) {
                event.receiving.shrink(1)
            }
            this.heldItem = giving
            this._heldItem.emit(giving)
            CobblemonEvents.HELD_ITEM_POST.post(HeldItemEvent.Post(this, this.heldItem(), event.returning.copy(), event.decrement)) {
                StashHandler.giveHeldItem(it)
            }
            return event.returning
        })
        return stack
    }

    fun swapCosmeticItem(stack: ItemStack, decrement: Boolean = true): ItemStack {
        val existing = this.cosmeticItem.copy()
        CobblemonEvents.COSMETIC_ITEM_PRE.postThen(HeldItemEvent.Pre(this, stack, existing, decrement), ifSucceeded = { event ->
            val giving = event.receiving.copy().apply { count = 1 }
            if (event.decrement) {
                event.receiving.shrink(1)
            }
            this.cosmeticItem = giving
            CobblemonEvents.COSMETIC_ITEM_POST.post(HeldItemEvent.Post(this, this.cosmeticItem.copy(), event.returning.copy(), event.decrement))
            return event.returning
        })
        return stack
    }

    /**
     * Swaps out the current [heldItem] for an [ItemStack.EMPTY].
     *
     * @return The existing [ItemStack] being held.
     */
    fun removeHeldItem(): ItemStack = this.swapHeldItem(ItemStack.EMPTY)

    fun saveToNBT(registryAccess: RegistryAccess, nbt: CompoundTag = CompoundTag()): CompoundTag {
        return this.saveTo(registryAccess.createSerializationContext(NbtOps.INSTANCE), nbt).orThrow as CompoundTag
    }

    fun loadFromNBT(registryAccess: RegistryAccess, nbt: CompoundTag): Pokemon {
        this.loadFrom(registryAccess.createSerializationContext(NbtOps.INSTANCE), nbt)
        return this
    }

    fun saveToJSON(registryAccess: RegistryAccess, json: JsonObject = JsonObject()): JsonObject {
        val ops = registryAccess.createSerializationContext(JsonOps.INSTANCE)
        return this.saveTo(ops, json).orThrow as JsonObject
    }

    fun loadFromJSON(registryAccess: RegistryAccess, json: JsonObject): Pokemon {
        val ops = registryAccess.createSerializationContext(JsonOps.INSTANCE)
        this.loadFrom(ops, json)
        return this
    }

    open fun <T> saveTo(ops: DynamicOps<T>, prefix: T = ops.empty()): DataResult<T> {
        return CODEC.encode(this, ops, prefix)
    }

    open fun <T> loadFrom(ops: DynamicOps<T>, data: T): DataResult<Pair<Pokemon, T>> {
        return CODEC.decode(ops, data).ifSuccess { this.copyFrom(it.first) }
    }

    /**
     * Clones the provided pokemon into a completely new instance.
     *
     * @param registryAccess Registry Access used for serialization context. WILL BECOME REQUIRED IN 1.7, currently falls back to server registry access
     * @param newUUID Whether or not the pokemon should receive a new UUID or not, which will completely untie it from the original
     *
     * @return The cloned pokemon
     */
    fun clone(newUUID: Boolean = true, registryAccess: RegistryAccess? = null): Pokemon {
        // NBT is faster, ops type doesn't really matter
        var ops = (registryAccess ?: server()?.registryAccess() ?: throw IllegalStateException("No registry access for cloning available"))
            .createSerializationContext(NbtOps.INSTANCE)
        val encoded = CODEC.encodeStart(ops, this).orThrow
        val result = CODEC.decode(ops, encoded).orThrow.first
        result.isClient = this.isClient
        if (newUUID) {
            result.uuid = UUID.randomUUID()
            result.tetheringId = null
        }
        return result
    }

    open fun copyFrom(other: Pokemon): Pokemon {
        this.isClient = other.isClient
        this.uuid = other.uuid
        // This is done beforehand so the ability is legalized by species/form change
        this.ability = other.ability
        this.species = other.species
        this.form = other.form
        this.nickname = other.nickname
        this.level = other.level
        this.experience = other.experience
        this.setFriendship(other.friendship)
        // Applied before current health for calcs to take place
        other.ivs.doWithoutEmitting {
            this.ivs.forEach {
                other.ivs[it.key] = it.value
            }
        }
        other.evs.doWithoutEmitting {
            this.evs.forEach {
                other.evs[it.key] = it.value
            }
        }
        this.currentHealth = other.currentHealth
        this.gender = other.gender
        this.moveSet.copyFrom(other.moveSet)
        this.benchedMoves.copyFrom(other.benchedMoves)
        this.scaleModifier = other.scaleModifier
        this.shiny = other.shiny
        this.state = other.state
        this.status = other.status
        this.caughtBall = other.caughtBall
        this.faintedTimer = other.faintedTimer
        this.healTimer = other.healTimer
        (this.evolutionProxy as? CobblemonEvolutionProxy)?.overrideController(other.evolutionProxy.current().asIntermediate().create(this))
        this.customProperties.clear()
        this.customProperties += other.customProperties
        this.nature = other.nature
        this.mintedNature = other.mintedNature
        this.heldItem = other.heldItem
        this.persistentData = other.persistentData
        this.tetheringId = other.tetheringId
        this.teraType = other.teraType
        this.dmaxLevel = other.dmaxLevel
        this.gmaxFactor = other.gmaxFactor
        this.tradeable = other.tradeable
        this.originalTrainerType = other.originalTrainerType
        this.originalTrainer = other.originalTrainer
        this.forcedAspects = other.forcedAspects
        this.cosmeticItem = other.cosmeticItem
        this.refreshOriginalTrainer()
        this.initialize()
        return this
    }

    fun getOwnerEntity(): LivingEntity? {
        return storeCoordinates.get()?.let {
            if (isPlayerOwned()) {
                server()?.playerList?.getPlayer(it.store.uuid)
            } else if (isNPCOwned()) {
                (it.store as NPCPartyStore).npc
            } else {
                null
            }
        }
    }

    fun getOwnerPlayer(): ServerPlayer? {
        return getOwnerEntity() as? ServerPlayer
    }

    fun getOwnerNPC(): NPCEntity? {
        return getOwnerEntity() as? NPCEntity
    }

    fun getOwnerUUID(): UUID? {
        storeCoordinates.get()?.let {
            return when (it.store) {
                is PlayerPartyStore -> it.store.playerUUID
                is NPCPartyStore -> it.store.npc.uuid
                is PCStore -> it.store.uuid
                else -> null
            }
        }
        return null
    }

    fun belongsTo(player: Player) = storeCoordinates.get()?.let { it.store.uuid == player.uuid } == true
    fun isPlayerOwned() = storeCoordinates.get()?.let { it.store is PlayerPartyStore || it.store is PCStore } == true
    fun isNPCOwned() = storeCoordinates.get()?.let { it.store is NPCPartyStore } == true
    fun isWild() = storeCoordinates.get() == null

    /**
     * Set the [friendship] to the given value.
     * This has some restrictions on mutation, the value must never be outside the bounds of 0 to [CobblemonConfig.maxPokemonFriendship].
     * See this [page](https://bulbapedia.bulbagarden.net/wiki/Friendship) for more information.
     *
     * @param value The value to set, this value will forcefully be absolute.
     * @param coerceSafe Forcefully coerce the maximum possible value. Default is true.
     * @return True if mutation was successful
     */
    fun setFriendship(value: Int, coerceSafe: Boolean = true): Boolean {
        val sanitizedAmount = if (coerceSafe) value.absoluteValue.coerceAtMost(Cobblemon.config.maxPokemonFriendship) else value.absoluteValue
        if (!this.isPossibleFriendship(sanitizedAmount)) {
            return false
        }
        this.friendship = sanitizedAmount
        return true
    }

    /**
     * Increment the [friendship] with by the given amount.
     * This has some restrictions on mutation, the value must never be outside the bounds of 0 to [CobblemonConfig.maxPokemonFriendship].
     * See this [page](https://bulbapedia.bulbagarden.net/wiki/Friendship) for more information.
     *
     * @param amount The amount to increment, this value will forcefully be absolute.
     * @param coerceSafe Forcefully coerce the maximum possible value. Default is true.
     * @return True if mutation was successful
     */
    fun incrementFriendship(amount : Int, coerceSafe: Boolean = true): Boolean {
        val sanitizedAmount = if (coerceSafe) amount.absoluteValue.coerceAtMost(Cobblemon.config.maxPokemonFriendship - this.friendship) else amount.absoluteValue
        val newValue = this.friendship + sanitizedAmount
        if (this.isPossibleFriendship(newValue)) {
            this.friendship = newValue
        }
        return this.friendship == newValue
    }

    /**
     * Decrement the [friendship] with by the given amount.
     * This has some restrictions on mutation, the value must never be outside the bounds of 0 to [CobblemonConfig.maxPokemonFriendship].
     * See this [page](https://bulbapedia.bulbagarden.net/wiki/Friendship) for more information.
     *
     * @param amount The amount to decrement, this value will forcefully be absolute.
     * @param coerceSafe Forcefully coerce the maximum possible value. Default is true.
     * @return True if mutation was successful
     */
    fun decrementFriendship(amount : Int, coerceSafe: Boolean = true): Boolean {
        val sanitizedAmount = if (coerceSafe) amount.absoluteValue.coerceAtMost(this.friendship) else amount.absoluteValue
        val newValue = this.friendship - sanitizedAmount
        if (this.isPossibleFriendship(newValue)) {
            this.friendship = newValue
        }
        return this.friendship == newValue
    }

    /**
     * Checks if the given value is withing the legal bounds for friendship.
     *
     * @param value The value being queried
     * @return If the value is within legal bounds.
     */
    fun isPossibleFriendship(value: Int) = value >= 0 && value <= Cobblemon.config.maxPokemonFriendship

    /**
     * Sets the Pokémon's Original Trainer.
     *
     * @param playerUUID The Player's UniqueID, used to check for Username updates.
     */
    fun setOriginalTrainer(playerUUID: UUID) {
        originalTrainerType = OriginalTrainerType.PLAYER
        originalTrainer = playerUUID.toString()
    }

    /**
     * Sets the Pokémon's Original Trainer to be a Fake Trainer.
     * Fake Trainers skips checking for Username updates and use this value directly.
     *
     * @param fakeTrainerName The Fake Trainer's name that will be displayed.
     */
    fun setOriginalTrainer(fakeTrainerName: String) {
        originalTrainerType = OriginalTrainerType.NPC
        originalTrainer = fakeTrainerName
    }

    fun refreshOriginalTrainer()
    {
        when (originalTrainerType)
        {
            OriginalTrainerType.PLAYER -> {
                UUID.fromString(originalTrainer)?.let { uuid ->
                    server()?.profileCache?.get(uuid)?.orElse(null)?.name?.let {
                        originalTrainerName = it
                    }
                }
            }
            OriginalTrainerType.NPC -> {
                originalTrainerName = originalTrainer
            }
            OriginalTrainerType.NONE -> {
                originalTrainerName = null
            }
        }
    }

    fun removeOriginalTrainer()
    {
        originalTrainer = null
        originalTrainerType = OriginalTrainerType.NONE
        originalTrainerName = null
    }

    val allAccessibleMoves: Set<MoveTemplate>
        get() = form.moves.getLevelUpMovesUpTo(level) + benchedMoves.map { it.moveTemplate } + form.moves.evolutionMoves

    val relearnableMoves: Iterable<MoveTemplate>
        get() = allAccessibleMoves.filter { accessibleMove -> moveSet.none { it.template == accessibleMove } }

    fun updateAspects() {
        /*
         * We don't want to run this for client representations of Pokémon as they won't always have the same
         * aspect providers, and we want the server side to entirely manage them anyway.
         */
        if (!isClient) {
            val oldAspects = aspects
            aspects = AspectProvider.providers.flatMap { it.provide(this) }.toSet() + forcedAspects

            if (oldAspects != aspects && !isWild()) {
                CobblemonEvents.POKEMON_ASPECTS_CHANGED.post(PokemonAspectsChangedEvent(getOwnerUUID(), this))
            }
        } else {
            aspects = forcedAspects
        }
    }

    fun updateForm() {
        val newForm = species.getForm(aspects)
        if (form != newForm) {
            // Form updated!
            form = newForm
        }
    }

    fun initialize(): Pokemon {
        // Force the setter to initialize it
        species = species
        checkGender()
        if (moveSet.getMoves().isEmpty()) {
            initializeMoveset()
        }
        return this
    }

    // Last flower fed to a Mooshtank
    var lastFlowerFed: ItemStack = ItemStack.EMPTY

    fun checkGender() {
        var reassess = false
        if (form.maleRatio !in 0F..1F && gender != Gender.GENDERLESS) {
            reassess = true
        } else if (form.maleRatio == 0F && gender != Gender.FEMALE) {
            reassess = true
        } else if (form.maleRatio == 1F && gender != Gender.MALE) {
            reassess = true
        } else if (form.maleRatio in 0F..1F && gender == Gender.GENDERLESS) {
            reassess = true
        }

        if (reassess) {
            gender = if (form.maleRatio !in 0F..1F) {
                Gender.GENDERLESS
            } else if (form.maleRatio == 1F || Random.nextFloat() <= form.maleRatio) {
                Gender.MALE
            } else {
                Gender.FEMALE
            }
        }
    }

    /**
     * Rolls an ability for this [Pokemon] using [AbilityPool.select]. This will override any current [Ability.forced].
     *
     * This operation does nothing on the client side.
     *
     * @return The newly assigned [Ability] or the existing one if called on the client.
     */
    @Suppress("MemberVisibilityCanBePrivate")
    open fun rollAbility(): Ability {
        if (this.isClient) {
            return this.ability
        }
        val (ability, _) = this.form.abilities.select(this.species, this.aspects)
        return this.updateAbility(ability.template.create(false))
    }

    /**
     * Assigns the given [ability] to this Pokémon.
     * It will also handle all the coordinate storing for proper synchronization across evolutions or other [species]/[form] updates.
     * This coordinate storage is skipped for [Ability.forced].
     *
     * This operation does nothing on the client side.
     *
     * @param ability The ability getting assigned
     * @return The resulting [Ability].
     */
    open fun updateAbility(ability: Ability): Ability {
        if (this.isClient) {
            return this.ability
        }
        this.ability = if (ability.forced) ability else this.attachAbilityCoordinate(ability)
        return this.ability
    }

    /**
     * Tries to update the [ability] on [species]/[form] change.
     *
     * This operation does nothing on the client side or [Ability.forced] is true.
     *
     * If the ability is [Abilities.DUMMY] it invokes [rollAbility] instead.
     */
    protected open fun attemptAbilityUpdate() {
        if (this.isClient || this.ability.forced) {
            return
        }
        if (this.ability.template == Abilities.DUMMY) {
            this.rollAbility()
            return
        }
        val potentials = this.form.abilities.mapping[this.ability.priority]
        // Step 1 try to get the same exact index and priority
        var potential = potentials?.getOrNull(this.ability.index)
        // Step 2 Disclaimer I don't really know the best course of action here
        // For default assets this just means "pick the only other regular ability" and hidden abilities are always just 1 so...
        // Sorry 3rd party please don't make really weird stats :(
        if (potential == null && potentials != null) {
            for (i in this.ability.index.coerceAtLeast(0) downTo 0) {
                val indexed = potentials.getOrNull(i)
                if (indexed != null) {
                    potential = indexed
                    break
                }
            }
        }
        if (potential != null) {
            // Keep our known index and priority, this was the original valid state after all
            this.ability = potential.template.create(false).apply {
                this.index = this@Pokemon.ability.index
                this.priority = this@Pokemon.ability.priority
            }
            return
        }
        // End of the road kiddo it didn't have to go down like this...
        this.rollAbility()
    }

    /**
     * Finds the position of the current ability in the Pokémon data and attaches the coordinates.
     * This is done in an attempt to synchronize correctly between [species]/[form] changes.
     *
     * This operation does nothing on the client side, if [Ability.forced] is true or if the ability is [Abilities.DUMMY].
     *
     * @param ability The [Ability] being queried.
     * @return It can return [ability] with the [Ability.priority] & [Ability.index] mapped, the [Ability.forced] set to true if illegal or itself if no operation is performed.
     */
    protected open fun attachAbilityCoordinate(ability: Ability): Ability {
        if (this.isClient || ability.forced || ability.template == Abilities.DUMMY) {
            return ability
        }
        val found = this.form.abilities.firstOrNull { potential -> potential.template == ability.template && potential.priority == ability.priority }
            ?: return ability.apply { this.forced = true }
        val index = this.form.abilities.mapping[found.priority]
            ?.indexOf(found)
            ?.takeIf { it != -1 }
            ?: return ability.apply { this.forced = true }
        ability.priority = found.priority
        ability.index = index
        return ability
    }

    fun initializeMoveset(preferLatest: Boolean = true) {
        val possibleMoves = form.moves.getLevelUpMovesUpTo(level).toMutableList()
        moveSet.doWithoutEmitting {
            moveSet.clear()
            if (possibleMoves.isEmpty()) {
                moveSet.add(Moves.getExceptional().create())
                return@doWithoutEmitting
            }

            val selector: () -> MoveTemplate? = {
                if (preferLatest) {
                    possibleMoves.removeLastOrNull()
                } else {
                    val random = possibleMoves.randomOrNull()
                    if (random != null) {
                        possibleMoves.remove(random)
                    }
                    random
                }
            }

            for (i in 0 until 4) {
                val move = selector() ?: break
                moveSet.setMove(i, move.create())
            }
        }
        moveSet.update()
    }

    fun getExperienceToNextLevel() = getExperienceToLevel(level + 1)
    fun getExperienceToLevel(level: Int) = if (level <= this.level) 0 else experienceGroup.getExperience(level) - experience

    fun setExperienceAndUpdateLevel(xp: Int) {
        experience = xp
        val newLevel = experienceGroup.getLevel(xp)
        if (newLevel != level && newLevel <= Cobblemon.config.maxPokemonLevel) {
            level = newLevel
        }
    }

    fun addExperienceWithPlayer(player: ServerPlayer, source: ExperienceSource, xp: Int): AddExperienceResult {
        val result = addExperience(source, xp)
        if (result.experienceAdded <= 0) {
            return result
        }
        player.sendSystemMessage(lang("experience.gained", getDisplayName(), xp), true)
        if (result.oldLevel != result.newLevel) {
            player.sendSystemMessage(lang("experience.level_up", getDisplayName(), result.newLevel))
            val repeats = result.newLevel - result.oldLevel
            // Someone can technically trigger a "delevel"
            if (repeats >= 1) {
                repeat(repeats) {
                    this.incrementFriendship(LEVEL_UP_FRIENDSHIP_CALCULATOR.calculate(this))
                }
            }
            result.newMoves.forEach {
                player.sendSystemMessage(lang("experience.learned_move", getDisplayName(), it.displayName))
            }
        }
        return result
    }

    fun <T : SpeciesFeature> getFeature(name: String) = features.find { it.name == name } as? T

    /**
     * Copies the specified properties from this Pokémon into a new [PokemonProperties] instance.
     *
     * You can find a bunch of built-in extractors inside [PokemonPropertyExtractor] statically.
     */
    fun createPokemonProperties(vararg extractors: PokemonPropertyExtractor): PokemonProperties {
        val properties = PokemonProperties()
        extractors.forEach { it(this, properties) }
        return properties
    }

    /**
     * Copies the specified properties from this Pokémon into a new [PokemonProperties] instance. 
     *
     * You can find a bunch of built-in extractors inside [PokemonPropertyExtractor] statically.
     */
    fun createPokemonProperties(extractors: MutableList<PokemonPropertyExtractor>): PokemonProperties {
        return createPokemonProperties(*extractors.toTypedArray())
    }

    fun addExperience(source: ExperienceSource, xp: Int): AddExperienceResult {
        if (xp < 0 || !this.canLevelUpFurther()) {
            return AddExperienceResult(level, level, emptySet(), 0) // no negatives!
        }
        val oldLevel = level
        val previousLevelUpMoves = form.moves.getLevelUpMovesUpTo(oldLevel)
        var appliedXP = xp
        CobblemonEvents.EXPERIENCE_GAINED_EVENT_PRE.postThen(
            event = ExperienceGainedPreEvent(this, source, appliedXP),
            ifSucceeded = { appliedXP = it.experience},
            ifCanceled = {
                return AddExperienceResult(level, level, emptySet(), 0)
            }
        )

        experience += appliedXP
        // Bound is needed here as we can still be allowed to level up but go over the current cap
        var newLevel = experienceGroup.getLevel(experience).coerceAtMost(Cobblemon.config.maxPokemonLevel)
        if (newLevel != oldLevel) {
            CobblemonEvents.LEVEL_UP_EVENT.post(
                LevelUpEvent(this, oldLevel, newLevel),
                then = { newLevel = it.newLevel }
            )
            level = newLevel
        }

        val newLevelUpMoves = form.moves.getLevelUpMovesUpTo(newLevel)
        val differences = (newLevelUpMoves - previousLevelUpMoves).filter { this.moveSet.none { move -> move.template == it } }.toMutableSet()
        differences.forEach {
            if (moveSet.hasSpace()) {
                moveSet.add(it.create())
            }
        }

        CobblemonEvents.EXPERIENCE_GAINED_EVENT_POST.post(
            ExperienceGainedPostEvent(this, source, appliedXP, oldLevel, newLevel, differences),
            then = { return AddExperienceResult(oldLevel, newLevel, it.learnedMoves, appliedXP) }
        )

        // This probably will never run, Kotlin just doesn't realize the inline function always runs the `then` block
        return AddExperienceResult(oldLevel, newLevel, differences, appliedXP)
    }

    fun canLevelUpFurther() = this.level < Cobblemon.config.maxPokemonLevel

    fun levelUp(source: ExperienceSource) = addExperience(source, getExperienceToNextLevel())

    /**
     * Exchanges an existing move set move with an empty moveslot, benched or otherwise accessible move that is not in the move set.
     *
     * PP is transferred onto the new move using the % of PP that the original move had and applying it to the new one.
     * If the current moveslot is null, 0 PP is given to the new move.
     *
     * @return true if it succeeded, false if it failed to exchange the moves. Failure can occur if the oldMove is not
     * a move set move.
     */
    fun exchangeMove(oldMove: MoveTemplate?, newMove: MoveTemplate?): Boolean {
        if(oldMove == null && newMove == null) return false

        if (newMove == null) {
            // Forget a move
            if (moveSet.getMoves().size <= 1) return false
            val currentMove = moveSet.find { it.template == oldMove } ?: return false
            benchedMoves.add(BenchedMove(currentMove.template, currentMove.raisedPpStages))
            var index = moveSet.getMovesWithNulls().indexOf(currentMove)
            moveSet.setMove(index, null)
            // Push the remaining moves up so the nulls are at the end of the list
            while(index < 3 && moveSet[index + 1] != null) {
                moveSet.swapMove(index, index+1)
                index++
            }
        } else {
            val benchedNewMove = benchedMoves.find { it.moveTemplate == newMove } ?: BenchedMove(newMove, 0)
            if (oldMove == null) {
                // Placing a move into a empty move slot
                if (moveSet.hasSpace()) {
                    val move = benchedNewMove.moveTemplate.create()
                    move.raisedPpStages = benchedNewMove.ppRaisedStages
                    move.currentPp = 0 // Avoids allowing infinite power points by forgetting and then remembering a move
                    moveSet.add(move)
                    benchedMoves.remove(newMove)
                    return true
                }
            } else {
                // Exchanging one move for another
                val currentMove = moveSet.find { it.template == oldMove } ?: return false
                val currentPPRatio = currentMove.let { it.currentPp / it.maxPp.toFloat() }
                benchedMoves.doThenEmit {
                    benchedMoves.remove(newMove)
                    benchedMoves.add(BenchedMove(currentMove.template, currentMove.raisedPpStages))
                }
                val move = newMove.create()
                move.raisedPpStages = benchedNewMove.ppRaisedStages
                move.currentPp = (currentPPRatio * move.maxPp).toInt()
                moveSet.setMove(moveSet.indexOf(currentMove), move)
            }
        }
        return true
    }

    fun notify(packet: PokemonUpdatePacket<*>) {
        storeCoordinates.get()?.run { sendPacketToPlayers(store.getObservingPlayers(), packet) }
    }

    fun <T> registerObservable(observable: SimpleObservable<T>, notifyPacket: ((T) -> PokemonUpdatePacket<*>?)? = null): SimpleObservable<T> {
        observables.add(observable)
        observable.subscribe {
            if (notifyPacket != null && storeCoordinates.get() != null) {
                val packet = notifyPacket(it)
                if (packet != null) {
                    notify(packet)
                }
            }
            anyChangeObservable.emit(this)
        }
        return observable
    }

    private val observables = mutableListOf<Observable<*>>()
    val anyChangeObservable = SimpleObservable<Pokemon>()

    val struct = ObjectValue<Pokemon>(this)
        .addPokemonFunctions(this)

    fun markFeatureDirty(feature: SpeciesFeature) {
        _features.emit(feature)
    }

    fun getAllObservables() = observables.asIterable()
    /** Returns an [Observable] that emits Unit whenever any change is made to this Pokémon. The change itself is not included. */
    fun getChangeObservable(): Observable<Pokemon> = anyChangeObservable

    /**
     * Used for when 'this' would be called in leaking context.
     *
     * @return The current [Pokemon] instance.
     */
    open fun self(): Pokemon = this

    private fun updateMovesOnFormChange(newForm: FormData) {
        if (this.isClient) {

            return
        }
        for (i in 0 until MoveSet.MOVE_COUNT) {
            val move = this.moveSet[i]
            if (move != null && !LearnsetQuery.ANY.canLearn(move.template, newForm.moves)) {
                this.moveSet.setMove(i, null)
            }
        }
        val benchedIterator = this.benchedMoves.iterator()
        while (benchedIterator.hasNext()) {
            val benchedMove = benchedIterator.next()
            if (!LearnsetQuery.ANY.canLearn(benchedMove.moveTemplate, newForm.moves)) {
                benchedIterator.remove()
            }
        }
        // Add form change moves
        newForm.moves.formChangeMoves.forEach { move ->
            // Under the hood these check if the moves already exist
            this.benchedMoves.add(BenchedMove(move, 0))
        }
        // If moveset is empty try to find one valid move to fill it
        if (this.moveSet.filterNotNull().isEmpty()) {
            val benchedMove = this.benchedMoves.firstOrNull()
            // This shouldn't ever be null, but you never know with data driven
            if (benchedMove != null) {
                this.moveSet.setMove(0, Move(benchedMove.moveTemplate, benchedMove.ppRaisedStages))
            }
        }
    }

    private val _form = registerObservable(SimpleObservable<FormData>()) { FormUpdatePacket({ this }, it) }
    private val _species = registerObservable(SimpleObservable<Species>()) { SpeciesUpdatePacket({ this }, it) }
    private val _nickname = registerObservable(SimpleObservable<MutableComponent?>()) { NicknameUpdatePacket({ this }, it) }
    private val _experience = registerObservable(SimpleObservable<Int>()) { ExperienceUpdatePacket({ this }, it) }
    private val _friendship = registerObservable(SimpleObservable<Int>()) { FriendshipUpdatePacket({ this }, it) }
    private val _currentHealth = registerObservable(SimpleObservable<Int>()) { HealthUpdatePacket({ this }, it) }
    private val _shiny = registerObservable(SimpleObservable<Boolean>()) { ShinyUpdatePacket({ this }, it) }
    private val _tradeable = registerObservable(SimpleObservable<Boolean>()) { TradeableUpdatePacket({ this }, it) }
    private val _nature = registerObservable(SimpleObservable<Nature>()) { NatureUpdatePacket({ this }, it, false) }
    private val _mintedNature = registerObservable(SimpleObservable<Nature?>()) { NatureUpdatePacket({ this }, it, true) }
    private val _moveSet = registerObservable(moveSet.observable) { MoveSetUpdatePacket({ this }, it) }
    private val _state = registerObservable(SimpleObservable<PokemonState>()) { PokemonStateUpdatePacket({ this }, it) }
    private val _status = registerObservable(SimpleObservable<PersistentStatus?>()) { StatusUpdatePacket({ this }, it) }
    private val _caughtBall = registerObservable(SimpleObservable<PokeBall>()) { CaughtBallUpdatePacket({ this }, it) }
    private val _cosmeticItem = registerObservable(SimpleObservable<ItemStack>()) { CosmeticItemUpdatePacket({ this }, it) }
    private val _benchedMoves = registerObservable(benchedMoves.observable) { BenchedMovesUpdatePacket({ this }, BenchedMoves().also {copy -> copy.copyFrom(it)}) }
    private val _ivs = registerObservable(ivs.observable) { IVsUpdatePacket({ this }, it as IVs) }
    private val _evs = registerObservable(evs.observable) { EVsUpdatePacket({ this }, it as EVs) }
    private val _aspects = registerObservable(SimpleObservable<Set<String>>()) { AspectsUpdatePacket({ this }, it) }
    private val _gender = registerObservable(SimpleObservable<Gender>()) { GenderUpdatePacket({ this }, it) }
    private val _ability = registerObservable(SimpleObservable<Ability>()) { AbilityUpdatePacket({ this }, it.template) }
    private val _heldItem = registerObservable(SimpleObservable<ItemStack>()) { HeldItemUpdatePacket({ this }, it) }
    private val _tetheringId = registerObservable(SimpleObservable<UUID?>()) { TetheringUpdatePacket({ this }, it) }
    private val _teraType = registerObservable(SimpleObservable<TeraType>()) { TeraTypeUpdatePacket({ this }, it) }
    private val _dmaxLevel = registerObservable(SimpleObservable<Int>()) { DmaxLevelUpdatePacket({ this }, it) }
    private val _gmaxFactor = registerObservable(SimpleObservable<Boolean>()) { GmaxFactorUpdatePacket({ this }, it) }
    private val _originalTrainerName = registerObservable(SimpleObservable<String?>()) { OriginalTrainerUpdatePacket({ this }, it) }

    private val _features = registerObservable(SimpleObservable<SpeciesFeature>()) {
        val featureProvider = SpeciesFeatures.getFeature(it.name)
        if (it is SynchronizedSpeciesFeature && featureProvider is SynchronizedSpeciesFeatureProvider && featureProvider.visible) {
            SpeciesFeatureUpdatePacket({ this }, species.resourceIdentifier, it)
        } else {
            null
        }
    }

    companion object {
        /**
         * The [FriendshipMutationCalculator] used when a Pokémon levels up.
         */
        var LEVEL_UP_FRIENDSHIP_CALCULATOR = FriendshipMutationCalculator.SWORD_AND_SHIELD_LEVEL_UP
        internal val SHEDINJA = cobblemonResource("shedinja")

        fun loadFromNBT(registryAccess: RegistryAccess, compound: CompoundTag): Pokemon {
            return this.loadFrom(registryAccess.createSerializationContext(NbtOps.INSTANCE), compound).orThrow.first
        }

        fun loadFromJSON(registryAccess: RegistryAccess, json: JsonObject): Pokemon {
            return this.loadFrom(registryAccess.createSerializationContext(JsonOps.INSTANCE), json).orThrow.first
        }

        private fun <T> loadFrom(ops: DynamicOps<T>, data: T): DataResult<Pair<Pokemon, T>> {
            return CODEC.decode(ops, data)
        }

        private val ROOT_CODEC: Codec<Pokemon> = RecordCodecBuilder.create { instance ->
            instance.group(
                PokemonP1.CODEC.forGetter(PokemonP1::from),
                PokemonP2.CODEC.forGetter(PokemonP2::from),
                PokemonP3.CODEC.forGetter(PokemonP3::from)
            ).apply(instance) { p1, p2, p3->
                val pokemon = Pokemon()
                pokemon.isClient = false
                p1.into(pokemon)
                p2.into(pokemon)
                p3.into(pokemon)
                pokemon.initialize()
            }
        }

        /**
         * A [Codec] for [Pokemon] intended for server side use.
         */
        @JvmStatic
        val CODEC: Codec<Pokemon> = CobblemonSchemas.wrapCodec(ROOT_CODEC, CobblemonTypeReferences.POKEMON)

        /**
         * A [Codec] for [Pokemon] intended for client use.
         */
        @JvmStatic
        val CLIENT_CODEC: Codec<Pokemon> = RecordCodecBuilder.create { instance ->
  
            instance.group(
                ClientPokemonP1.CODEC.forGetter(ClientPokemonP1::from),
                ClientPokemonP2.CODEC.forGetter(ClientPokemonP2::from),
                ClientPokemonP3.CODEC.forGetter(ClientPokemonP3::from)
            ).apply(instance) { p1, p2, p3->
                val pokemon = Pokemon() 
                pokemon.isClient = true
                p1.into(pokemon)
                p2.into(pokemon)
                p3.into(pokemon)
                pokemon.initialize()
                val valName: Unit = initialValue
         
            }
        }

        /**
         * A [Codec] for [Pokemon] intended for S2C use.
         */
        @JvmStatic
        val S2C_CODEC: StreamCodec<RegistryFriendlyByteBuf, Pokemon> = ByteBufCodecs.fromCodecWithRegistries(CLIENT_CODEC)

    }
}
