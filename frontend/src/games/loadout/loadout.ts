import {itemList, weaponData, shieldData, helmetData, backpackData, consumableData} from "./data";

//Other Array
let OtherItems = ["Mineral Scanner", "Heavy Mining Tool", "Data Drive Tier 1"];

export async function GetRarity(key: string | null, IGN?: string | null) {
	if (!IGN) {
		if (!key) return "None";
		return (await itemList())[key].rarity;
	} else {
		//Item List
		for (var item in await itemList()) {
			if ((await itemList())[item]["inGameName"] == IGN) {
				return (await itemList())[item]["rarity"];
			}
		}
		//Items
		if (IGN.includes("Mineral Scanner") || IGN.includes("Heavy Mining Tool") || IGN.includes("Data Drive Tier 1")) return "Common";

		//Medkit/Stim
		if (IGN.includes("Medkit") || IGN.includes("Stim")) {
			if (IGN.includes("Weak")) return "Common";
			if (IGN.includes("Strong")) return "Uncommon";
			if (IGN.includes("Combat")) return "Rare";
		}

		//Grenade
		if (IGN.includes("Grenade")) {
			if (IGN == "GrenadeSmoke") return "Common";
			if (IGN == "GrenadeSound" || IGN == "GrenadeGas" || IGN == "GrenadeLight") return "Uncommon";
			if (IGN == "GrenadeStandard") return "Rare";
			if (IGN == "GrenadeAssault") return "Exotic";
		}

		//Gear
		if (IGN.includes("Common")) return "Common";
		if (IGN.includes("Uncommon")) return "Uncommon";
		if (IGN.includes("Rare")) return "Rare";
		if (IGN.includes("Epic")) return "Epic";
		if (IGN.includes("Exotic")) return "Exotic";
		if (IGN.includes("Legendary")) return "Legendary";
		if (IGN.includes("Nightvision")) return "Legendary";

		//Ammo
		if (IGN.includes("Light") || IGN.includes("Medium")) return "Common";
		if (IGN.includes("Heavy") || IGN.includes("Shotgun")) return "Uncommon";
		if (IGN.includes("Special")) return "Rare";
	}

	//None found
	return "None";
}

export async function GenerateRandomLoadout(minRarity: number, maxRarity: number, consumableAmount: number, alwaysGetWeapons: boolean, alwaysGetArmor: boolean) {
	let data = {
		weapons: [] as {img: string; ign: string; rarity: string}[],
		backpack: {} as {img: string; ign: string; rarity: string} | null,
		shield: {} as {img: string; ign: string; rarity: string} | null,
		helmet: {} as {img: string; ign: string; rarity: string} | null,
		items: [] as {img: string; amount: number; ign: string; rarity: string}[]
	};

	//Weapons
	let totalAmmo = [];
	let tempWeaponArr = Object.keys(await weaponData());
	for (let i = 0; i < 2; i++) {
		if (i == 1 && !alwaysGetWeapons) {
			if (getRandomRange(1, 100) <= 33) break;
		}
		let rarityNumber = -1;
		let weapon = "";
		//Find a weapon that is within the rarity range
		while (rarityNumber < minRarity || rarityNumber > maxRarity) {
			weapon = tempWeaponArr[Math.floor(Math.random() * tempWeaponArr.length)];
			rarityNumber = rarityToInt(await GetRarity(weapon));
			if (weapon.includes("_scrappy")) rarityNumber = -1;
		}
		//Remove the weapon from the array so it can't be picked again
		tempWeaponArr = tempWeaponArr.filter((w) => w != weapon);
		//Ammo...
		let Ammo = await getAmmoType(weapon);
		totalAmmo.push({type: Ammo, amount: getAmmoAmount(Ammo)});
		//Add the weapon to the data
		data.weapons.push({img: (await weaponData())[weapon].inGameName.replace(" - Prototype", "").replace(" - Mk.II", ""), ign: (await weaponData())[weapon].inGameName, rarity: await GetRarity(weapon)});
	}

	//Ammo
	let ammo = splitAmmo(totalAmmo);
	for (let a of ammo) {
		data.items.push({img: "Ammo/" + a.type, ign: a.type + " Ammo", amount: a.amount, rarity: await GetRarity(null, a.type)});
	}

	//Backpack
	let rarityNumber = -1;
	let backpack = "";
	//Find a backpack that is within the rarity range
	let tempBackpackArr = Object.keys(await backpackData());
	while (rarityNumber < minRarity || rarityNumber > maxRarity) {
		backpack = tempBackpackArr[Math.floor(Math.random() * tempBackpackArr.length)];
		rarityNumber = rarityToInt(await GetRarity(backpack));
		if (backpack.includes("_broken")) rarityNumber = -1;
	}
	//Add the backpack to the data
	let ign = (await backpackData())[backpack].inGameName;
	data.backpack = {img: ign, ign: ign, rarity: await GetRarity(backpack)};

	//Shield
	if (getRandomRange(1, 100) > 33 || alwaysGetArmor) {
		let rarityNumber = -1;
		let shield = "";
		//Find a shield that is within the rarity range
		let tempArr = Object.keys(await shieldData());
		while (rarityNumber < minRarity || rarityNumber > maxRarity) {
			shield = tempArr[Math.floor(Math.random() * tempArr.length)];
			rarityNumber = rarityToInt(await GetRarity(shield));
			if (shield.includes("Default")) rarityNumber = -1;
		}
		//Add the shield to the data
		let ign = (await shieldData())[shield].inGameName;
		data.shield = {img: ign.replaceAll(" ", "_"), ign: ign, rarity: await GetRarity(shield)};
	} else {
		//No shield
		data.shield = null;
	}

	//Helmet
	if (getRandomRange(1, 100) > 15 || alwaysGetArmor) {
		let rarityNumber = -1;
		let helmet = "";
		//Find a helmet that is within the rarity range
		let tempArr = Object.keys(await helmetData());
		while (rarityNumber < minRarity || rarityNumber > maxRarity) {
			helmet = tempArr[Math.floor(Math.random() * tempArr.length)];
			rarityNumber = rarityToInt(await GetRarity(helmet));
		}
		let ign = (await helmetData())[helmet].inGameName;
		data.helmet = {img: ign.replaceAll(" ", "_"), ign: ign, rarity: await GetRarity(helmet)};
	} else {
		//No helmet
		data.helmet = null;
	}

	//Consumables:
	let tempArr = Object.keys(await consumableData());
	for (let i = 1; i <= consumableAmount; i++) {
		let consumable;
		let rarityNumber = -1;
		//Find a consumable that is within the rarity range
		while (rarityNumber < (minRarity >= 3 ? 2 : minRarity) || rarityNumber > maxRarity) {
			let r = Math.floor(Math.random() * tempArr.length);
			consumable = tempArr[r];
			rarityNumber = rarityToInt(await GetRarity(consumable));
			tempArr.splice(r, 1);
		}
		if (consumable) {
			let ign = (await consumableData())[consumable].inGameName;
			if (ign.includes("Medkit")) {
				await addConsumable(consumable, Math.floor(Math.random() * 1) + 1);
			} else if (ign.includes("Stim")) {
				await addConsumable(consumable, Math.floor(Math.random() * 4) + 1);
				await addConsumable(consumable, Math.floor(Math.random() * 4) + 1);
			} else if (ign.includes("Grenade")) {
				await addConsumable(consumable, Math.floor(Math.random() * 3) + 1);
			}
		}
	}
	async function addConsumable(consumable: string, amount: number) {
		let ign = (await consumableData())[consumable].inGameName;
		data.items.push({img: "Consumables/" + ign, ign: ign, amount: amount, rarity: await GetRarity(consumable)});
	}

	//Other items:
	if (getRandomRange(1, 100) > 60) {
		//Find an item
		let item = OtherItems[Math.floor(Math.random() * OtherItems.length)];
		//Add the item to the data
		data.items.push({img: item, ign: item, amount: 1, rarity: await GetRarity(null, item)});
	}

	//Return the data
	return data;
}

async function getAmmoType(weapon: string): Promise<string> {
	return (await weaponData())[weapon].ammoType;
}
function getAmmoAmount(type: string): number {
	let total;
	if (type == "Light" || type == "Medium") {
		total = getRandomRange(150, 600);
	} else if (type == "Shotgun" || type == "Special") {
		total = getRandomRange(40, 150);
	} else if (type == "Heavy") {
		total = getRandomRange(30, 100);
	} else {
		total = 0;
	}
	return total;
}
function splitAmmo(ammo: {type: string; amount: number}[]): {type: string; amount: number}[] {
	//Combine ammo types
	ammo.forEach((a) => {
		ammo.forEach((b) => {
			if (a.type == b.type && a != b) {
				a.amount += b.amount;
				ammo.splice(ammo.indexOf(b), 1);
			}
		});
	});

	//Split into stacks
	let stacks = [] as {type: string; amount: number}[];
	ammo.forEach((a) => {
		let stackSize;
		if (a.type == "Light" || a.type == "Medium") {
			stackSize = 250;
		} else if (a.type == "Shotgun" || a.type == "Special" || a.type == "Heavy") {
			stackSize = 50;
		} else {
			return [];
		}
		for (let i = 0; i < Math.ceil(a.amount / stackSize); i++) {
			if (a.amount - (i + 1) * stackSize > 0) {
				stacks.push({type: a.type, amount: stackSize});
			} else {
				stacks.push({type: a.type, amount: a.amount - i * stackSize});
			}
		}
	});
	return stacks;
}
function getRandomRange(min: number, max: number): number {
	return Math.ceil(Math.random() * (max - min) + min);
}
function rarityToInt(rarity: string): number {
	if (rarity == "Common") return 0;
	if (rarity == "Uncommon") return 1;
	if (rarity == "Rare") return 2;
	if (rarity == "Epic") return 3;
	if (rarity == "Exotic") return 4;
	if (rarity == "Legendary") return 5;
	return 0;
}
