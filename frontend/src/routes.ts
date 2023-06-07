import FortunaGuessrViewVue from "./views/FortunaGuessrView.vue";

const defaultValues = {
	component: null as any,
	meta: {
		title: "Games | TC:F Wiki",
		metaTags: [
			//Basic
			{
				name: "title",
				content: "TC:F Wiki Games"
			},
			{
				name: "keywords",
				content: "the cycle frontier, tcf, the cycle, cycle game, cycle frontier, geography, the cycle frontier wiki, cycle wiki, the cycle wiki, the cycle: frontier, cycle: frontier, the cycle: frontier wiki, map, wiki, game, geography, geoguessr, free, map, loadout generator, tcf wiki, fortunaguessr"
			},
			{
				name: "image",
				content: "https://cdn.wikimg.net/en/tcfwiki/images/5/59/Site-wiki.png"
			},
			{
				name: "description",
				content: "Games related to the The Cycle Frontier | TC:F Wiki Games"
			},
			//Schema.org for Google
			{
				itemprop: "name",
				content: "TC:F Wiki Games"
			},
			{
				itemprop: "description",
				content: "Games related to the The Cycle Frontier | TC:F Wiki Games"
			},
			{
				itemprop: "image",
				content: "https://cdn.wikimg.net/en/tcfwiki/images/5/59/Site-wiki.png"
			},
			//Twitter
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "TC:F Wiki Games"
			},
			{
				name: "twitter:description",
				content: "Games related to the The Cycle Frontier | TC:F Wiki Games"
			},
			{
				name: "twitter:site",
				content: "@TCFWiki"
			},
			{
				name: "twitter:image:src",
				content: "https://cdn.wikimg.net/en/tcfwiki/images/5/59/Site-wiki.png"
			},
			//Open Graph general (Facebook, Pinterest & Google+)
			{
				name: "og:title",
				content: "TC:F Wiki Games"
			},
			{
				name: "og:description",
				content: "Games related to the The Cycle Frontier | TC:F Wiki Games"
			},
			{
				name: "og:image",
				content: "https://cdn.wikimg.net/en/tcfwiki/images/5/59/Site-wiki.png"
			},
			{
				name: "og:url",
				content: "https://games.thecyclefrontier.wiki"
			},
			{
				name: "og:site_name",
				content: "The Cycle Frontier Wiki"
			},
			{
				name: "og:type",
				content: "website"
			}
		]
	}
};

const routes = [
	{
		path: "/",
		name: "Home",
		file: "HomeView.vue",
		meta: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>`
		}
	},
	{
		path: "/fortunaguessr",
		name: "FortunaGuessr",
		file: "FortunaGuessrView.vue",
		meta: {
			title: "FortunaGuessr | TC:F Games",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40z"/></svg>`,
			file: "FortunaGuessrView.vue",
			metaTags: [
				//Basic
				{
					name: "title",
					content: "Fortunaguessr | TC:F Wiki Games"
				},
				{
					name: "description",
					content: "Fortunaguessr | Geoguessr game for The Cycle: Frontier | TC:F Wiki Games"
				},
				//Schema.org for Google
				{
					itemprop: "name",
					content: "Fortunaguessr | TC:F Wiki Games"
				},
				{
					itemprop: "description",
					content: "Fortunaguessr | Geoguessr game for The Cycle: Frontier | TC:F Wiki Games"
				},
				//Twitter
				{
					name: "twitter:title",
					content: "Fortunaguessr | TC:F Wiki Games"
				},
				{
					name: "twitter:description",
					content: "Fortunaguessr | Geoguessr game for The Cycle: Frontier | TC:F Wiki Games"
				},
				//Open Graph general (Facebook, Pinterest & Google+)
				{
					name: "og:title",
					content: "Fortunaguessr | TC:F Wiki Games"
				},
				{
					name: "og:description",
					content: "Fortunaguessr | Geoguessr game for The Cycle: Frontier | TC:F Wiki Games"
				}
			]
		}
	},
	{
		path: "/loadout",
		name: "Loadout Generator",
		file: "LoadoutView.vue",
		meta: {
			title: "Loadout Generator | TCF Games",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 0C129.1 0 0 129.1 0 288c0 158.9 129.1 288 288 288c158.9 0 288-129.1 288-288C576 129.1 446.9 0 288 0zM144 288c0-52.9 43.1-96 96-96s96 43.1 96 96s-43.1 96-96 96s-96-43.1-96-96zm288 0c0 52.9-43.1 96-96 96s-96-43.1-96-96s43.1-96 96-96s96 43.1 96 96zm-192 96c-70.7 0-128-57.3-128-128s57.3-128 128-128s128 57.3 128 128s-57.3 128-128 128z"/></svg>`,
			metaTags: [
				//Basic
				{
					name: "title",
					content: "Loadout Generator | TC:F Wiki Games"
				},
				{
					name: "description",
					content: "Loadout Generator | Random Loadout Generator for The Cycle: Frontier | TC:F Wiki Games"
				},
				//Schema.org for Google
				{
					itemprop: "name",
					content: "Loadout Generator | TC:F Wiki Games"
				},
				{
					itemprop: "description",
					content: "Loadout Generator | Random Loadout Generator for The Cycle: Frontier | TC:F Wiki Games"
				},
				//Twitter
				{
					name: "twitter:title",
					content: "Loadout Generator | TC:F Wiki Games"
				},
				{
					name: "twitter:description",
					content: "Loadout Generator | Random Loadout Generator for The Cycle: Frontier | TC:F Wiki Games"
				},
				//Open Graph general (Facebook, Pinterest & Google+)
				{
					name: "og:title",
					content: "Loadout Generator | TC:F Wiki Games"
				},
				{
					name: "og:description",
					content: "Loadout Generator | Random Loadout Generator for The Cycle: Frontier | TC:F Wiki Games"
				}
			]
		}
	}
];
export default routes.map((route) => {
	let object = {
		...defaultValues,
		...route
	};
	object.meta.metaTags = [...defaultValues.meta.metaTags];
	if (route.meta.metaTags) {
		for (let tag of route.meta.metaTags) {
			if (object.meta.metaTags.includes(tag)) {
				object.meta.metaTags.splice(object.meta.metaTags.indexOf(tag), 1);
			}
			object.meta.metaTags.push(tag);
		}
	}
	return object;
});

export const siteMapRoutes = routes.map((route) => ({
	path: route.path,
	name: route.name,
	props: true
}));
