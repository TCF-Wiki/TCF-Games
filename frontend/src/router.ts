import {createRouter, createWebHistory} from "vue-router";
import HomeView from "./views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
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
			name: "test",
			component: () => import("./views/TestView.vue"),
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
	]
});

//Meta tags
router.beforeEach((to, from, next) => {
	// This goes through the matched routes from last to first, finding the closest route with a title.
	const nearestWithTitle = to.matched
		.slice()
		.reverse()
		.find((r) => r.meta && r.meta.title);

	// Find the nearest route element with meta tags.
	const nearestWithMeta = to.matched
		.slice()
		.reverse()
		.find((r) => r.meta && r.meta.metaTags);

	const previousNearestWithMeta = from.matched
		.slice()
		.reverse()
		.find((r) => r.meta && r.meta.metaTags);

	// If a route with a title was found, set the document (page) title to that value.
	if (nearestWithTitle) {
		document.title = nearestWithTitle.meta.title as string;
	} else if (previousNearestWithMeta) {
		document.title = previousNearestWithMeta.meta.title as string;
	}

	// Remove any stale meta tags from the document using the key attribute we set below.
	Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map((el) => el.parentNode?.removeChild(el));

	// Skip rendering meta tags if there are none.
	if (!nearestWithMeta) return next();

	// Turn the meta tag definitions into actual elements in the head.
	(nearestWithMeta.meta.metaTags as any)
		.map((tagDef: Object) => {
			const tag = document.createElement("meta");

			Object.keys(tagDef).forEach((key: string) => {
				/*@ts-ignore*/
				tag.setAttribute(key, tagDef[key]);
			});

			// We use this to track which meta tags we create so we don't interfere with other ones.
			tag.setAttribute("data-vue-router-controlled", "");

			return tag;
		})
		// Add the meta tags to the document head.
		.forEach((tag: any) => document.head.appendChild(tag));

	next();
});

export default router;
