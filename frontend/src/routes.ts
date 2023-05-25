const routes = [
	{
		path: "/",
		name: "Home",
		file: "HomeView.vue",
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
	}
];

export default routes;

export const siteMapRoutes = routes.map((route) => ({
	path: route.path,
	name: route.name,
	props: true
}));
