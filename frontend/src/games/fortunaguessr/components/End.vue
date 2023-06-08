<template>
	<h1>End Results</h1>
	<div class="end-container">
		<div class="main-container">
			<Results :gameOptions="gameOptions" />
			<EndMap :gameOptions="gameOptions" />
		</div>
	</div>
	<Teleport to="body">
		<div class="modal__bg" v-if="showPopup" :class="{'hidden': shouldHaveHiddenClass}" @click="shouldHaveHiddenClass=true">
			<div class="modal-content">
				<p class="main-text">{{ getPopupText() }}</p>
				<p class="subtitle">
					{{ flairMessage }}
				</p>
			</div>
		</div>
	</Teleport>
</template>
<script lang="ts">
import {defineComponent, type PropType} from "vue";
import {emitter, toast} from "@/main";
import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

import EndMap from "./End/EndMap.vue";
import Results from "./End/Results.vue";
import {App} from "@/multiplayer";
import {GameApp} from "../multiplayer";

export default defineComponent({
	name: "End",
	props: {
		gameOptions: {
			type: Object as PropType<gameInfoType>,
			required: true
		}
	},
	data: () => ({
		showControls: App.host,
		flairMessage: "",
		showPopup: false,
		shouldHaveHiddenClass: false
	}),
	methods: {
		getPopupText() {
			const sortedPlayerList = App.playerList.map((a) => a).sort((a, b) => b.gameData.score - a.gameData.score);
			const winner = sortedPlayerList[0];
			const isSelfWinner = winner.socketId === App.myPlayerData.socketId;
			const selfPosition = sortedPlayerList.findIndex((a) => a.socketId == App.myPlayerData.socketId) + 1;

			const flairLists = {
				winner: [
					"Congratulations! You've conquered the game like a true champion!",
					"You're a gaming mastermind! Enjoy your well-deserved victory!",
					"Victory is yours! Embrace your triumph and bask in the glory of your success!",
					"Who's the boss? You! Congrats on owning this game like a pro!",
					"You've reached the pinnacle of gaming greatness. Celebrate your victory in style!",
					"Congratulations, you've annihilated the competition and made this game your playground!",
					"You've proven your skills and emerged as the victor. Enjoy the sweet taste of success!",
					"Congratulations on completing the game with flying colors! Your dedication has paid off.",
					"Game over? More like game obliterated! You've left a trail of defeated opponents in your wake. Bow down to the undisputed champion!",
					"You've emerged as the undisputed champion of this game. The gaming world bows before you."
				],
				top3: [
					"Congratulations on making it to the top 3! You've proven that you're a force to be reckoned with!",
					"Podium finish achieved! You've secured your place among the gaming elites.",
					"Bronze, silver, or gold? Regardless, you've made it to the top 3 and that's something to celebrate!",
					"Top 3 never looked so good! You've left your mark on this game and secured a spot on the podium.",
					"You've reached the pinnacle of success in this game, standing tall among the top 3.",
					"Medal-worthy performance! You've claimed a spot on the podium, showing Fortuna your gaming prowess.",
					"Top 3? That's just a fancy term for being one of the game's MVPs.",
					"You may only be in the top 3, but you're number one in the Striders' hearts!",
					"Your gaming skills have earned you a spot among the elite. Keep rocking those high rankings!",
					"The podium never looked so good, and neither have you! You've proven that you're a top contender in this game. Keep slaying!"
				],
				notlast: [
					"Close, but no cigar. Maybe next time you'll actually make a dent in the leaderboard.",
					"Not even close to the podium. Looks like your gaming skills need a serious upgrade.",
					"Just another mediocre performance. It's clear that winning isn't in your DNA.",
					"You didn't lose, but you didn't win either. Your presence in the game was forgettable at best.",
					"Congratulations on your lackluster performance. You've managed to achieve nothing of significance.",
					"You've proven once again that mediocrity is your comfort zone. Better luck never.",
					"Just another faceless player in a sea of losers. Your gameplay is as unremarkable as ever.",
					"Oh, look! Another subpar attempt at gaming. When will you realize you're simply not cut out for this?",
					"Not even worth mentioning. Your gaming skills are an absolute embarrassment.",
					"You managed to avoid defeat, but that's hardly an accomplishment. Step up your game or step aside."
				],
				last: [
					"Congratulations on securing your place as the ultimate loser. Your last place finish is truly impressive.",
					"Last place? You must have a special talent for underachievement. Keep up the good work.",
					"You've reached new depths of incompetence with your last place finish. Kudos for consistently disappointing.",
					"Looks like you've mastered the art of failure. Last place suits you perfectly.",
					"Dead last! Your gaming skills are a true inspiration to everyone else striving for inadequacy.",
					"Well, someone had to be the worst, and it seems you're a natural at it. Keep up the lackluster performance!",
					"Last place again? It's almost admirable how consistently you disappoint. Don't ever change.",
					"Your performance is like a black hole of talent, sucking in all hope of success. Congrats on last place!",
					"You've solidified your status as the resident loser. Don't worry, someone has to bring up the rear.",
					"Last place... but hey, at least you finished the race! Keep your chin up and keep striving for better next time."
				]
			};

			let list;
			if (selfPosition == 1) list = flairLists.winner;
			else if (selfPosition == sortedPlayerList.length) list = flairLists.last;
			else if (selfPosition <= 3) list = flairLists.top3;
			else list = flairLists.notlast;

			this.flairMessage = list[Math.floor(Math.random() * list.length)];
			return isSelfWinner ? "You won the game!" : winner.name + " won the game!";
		},
		closePopup(element: MouseEvent) {
			console.log("Closing popup");
			let target = element.target as HTMLElement;
			while (!target.classList.contains("modal__bg")) {
				target = target.parentElement as HTMLElement;
			}
			target.style.display = "none";
		}
	},
	mounted() {
		if (App.playerList.length != 1) this.showPopup = true;
		emitter.on("HostChanged", () => {
			if (GameApp.state != "End") return;
			this.showControls = App.host;
		});
	},
	components: {EndMap, Results}
});
</script>
<style scoped lang="less">
.modal__bg {
	animation: vanish 6s forwards;
	
	@media screen and (min-width: 901px) {
		translate: calc(2.8 * var(--padding-page)) 0;
	}

	&.hidden {
		scale: 0;
		display: none;
	}
}

@keyframes vanish {
	0% {
		scale: 0;
	}
	10% {
		scale: 1;
	}
	75% {
		opacity: 0.8;
	}
	100% {
		opacity: 0;
	}
}
.modal-content {
	text-align: center;
}

.modal-content .main-text {
	font-size: 10vw;
}

.modal-content .subtitle {
	font-size: 2vw;
	color: var(--color-base--subtle);
}

.end-container {
	max-width: 100%;
	margin: 0 2rem;

	@media screen and (max-width: 900px) {
		margin: 0 0.5rem;
	}
}

.main-container {
	max-width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: calc(2 * var(--space-xl));

	@media screen and (max-width: 1100px) {
		grid-template-columns: 1fr;
	}
}

h1 {
	text-align: center;
	width: 100%;
	margin-bottom: 2rem;
	font-size: 2.5rem;
}
</style>
