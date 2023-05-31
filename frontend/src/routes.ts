const defaultValues = {
	component: null as any,
	meta: {
		title: "TCF Games",
		metaTags: [
			{
				name: "description",
				content: "The Cycle Frontier Games"
			}
		]
	}
};

const routes = [
	{
		path: "/",
		name: "Home",
		file: "HomeView.vue"
	},
	{
		path: "/test",
		name: "Test",
		file: "TestView.vue",
		component: null as any,
		meta: {
			title: "Test | TCF Games",
			metaTags: [
				{
					name: "description",
					content: "The Test game of TCF Games."
				}
			]
		}
	},
	{
		path: "/fortunaguessr",
		name: "FortunaGuessr",
		file: "FortunaGuessrView.vue",
		component: null as any,
		meta: {
			title: "FortunaGuessr | TCF Games",
			metaTags: [
				{
					name: "description",
					content: "The FortunaGuessr game of TCF Games."
				}
			]
		}
	}
];

export default routes.map((route) => ({
	...defaultValues,
	...route
}));

export const siteMapRoutes = routes.map((route) => ({
	path: route.path,
	name: route.name,
	props: true
}));
