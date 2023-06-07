const githubURL = "https://raw.githubusercontent.com/TCF-Wiki/TCF-Information/main/min/";
//Item List
let localItemList: any;
export async function itemList(): Promise<any> {
	if (localItemList) return localItemList;
	else {
		localItemList = await fetch(githubURL + "items.json", {}).then((response) => response.json());
		return localItemList;
	}
}
//Weapon Data
let localWeaponData: any;
export async function weaponData(): Promise<any> {
	if (localWeaponData) return localWeaponData;
	else {
		localWeaponData = await fetch(githubURL + "weapons.json", {}).then((response) => response.json());
		return localWeaponData;
	}
}
//Shield Data
let localShieldData: any;
export async function shieldData(): Promise<any> {
	if (localShieldData) return localShieldData;
	else {
		localShieldData = await fetch(githubURL + "shields.json", {}).then((response) => response.json());
		return localShieldData;
	}
}
//Helmet Data
let localHelmetData: any;
export async function helmetData(): Promise<any> {
	if (localHelmetData) return localHelmetData;
	else {
		localHelmetData = await fetch(githubURL + "helmets.json", {}).then((response) => response.json());
		return localHelmetData;
	}
}
//Backpack Data
let localBackpackData: any;
export async function backpackData(): Promise<any> {
	if (localBackpackData) return localBackpackData;
	else {
		localBackpackData = await fetch(githubURL + "backpacks.json", {}).then((response) => response.json());
		return localBackpackData;
	}
}
//Consumable Data
let localConsumableData: any;
export async function consumableData(): Promise<any> {
	if (localConsumableData) return localConsumableData;
	else {
		localConsumableData = await fetch(githubURL + "consumables.json", {}).then((response) => response.json());
		return localConsumableData;
	}
}
