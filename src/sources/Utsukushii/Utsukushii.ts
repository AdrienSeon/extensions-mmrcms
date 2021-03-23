import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../..";
import { SourceCategory } from "../../models/SourceCategory/SourceCategory";

const UTSUKUSHII_DOMAIN = "https://manga.utsukushii-bg.com";

export const UtsukushiiInfo: SourceInfo = {
	version: "1.0.0",
	name: "Utsukushii",
	description: "Extension that pulls manga from manga.utsukushii-bg.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: UTSUKUSHII_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Russian",
			type: TagType.GREY,
		},
	],
};

export class Utsukushii extends Mmrcms {
	baseUrl: string = UTSUKUSHII_DOMAIN;
	languageCode: LanguageCode = LanguageCode.RUSSIAN;
	sourceTraversalPathName: string = "manga";
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Екшън" },
		{ id: "2", name: "Приключенски" },
		{ id: "3", name: "Комедия" },
		{ id: "4", name: "Драма" },
		{ id: "5", name: "Фентъзи" },
		{ id: "6", name: "Исторически" },
		{ id: "7", name: "Ужаси" },
		{ id: "8", name: "Джосей" },
		{ id: "9", name: "Бойни изкуства" },
		{ id: "10", name: "Меха" },
		{ id: "11", name: "Мистерия" },
		{ id: "12", name: "Самостоятелна/Пилотна глава" },
		{ id: "13", name: "Психологически" },
		{ id: "14", name: "Романтика" },
		{ id: "15", name: "Училищни" },
		{ id: "16", name: "Научна фантастика" },
		{ id: "17", name: "Сейнен" },
		{ id: "18", name: "Шоджо" },
		{ id: "19", name: "Реализъм" },
		{ id: "20", name: "Спорт" },
		{ id: "21", name: "Свръхестествено" },
		{ id: "22", name: "Трагедия" },
		{ id: "23", name: "Йокаи" },
		{ id: "24", name: "Паралелна вселена" },
		{ id: "25", name: "Супер сили" },
		{ id: "26", name: "Пародия" },
		{ id: "27", name: "Шонен" },
	];
}
