import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory } from "../..";

export const NikushimiInfo: SourceInfo = {
	version: "1.0.0",
	name: "Nikushimi",
	description: "Extension that pulls manga from azbivo.webd.pro",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://azbivo.webd.pro",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Polish",
			type: TagType.GREY,
		},
	],
};

export class Nikushimi extends Mmrcms {
    name: string = NikushimiInfo.name;
	baseUrl: string = NikushimiInfo.websiteBaseURL;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Action" },
		{ id: "2", name: "Adventure" },
		{ id: "3", name: "Comedy" },
		{ id: "4", name: "Doujinshi" },
		{ id: "5", name: "Drama" },
		{ id: "6", name: "Ecchi" },
		{ id: "7", name: "Fantasy" },
		{ id: "8", name: "Gender Bender" },
		{ id: "9", name: "Harem" },
		{ id: "10", name: "Historical" },
		{ id: "11", name: "Horror" },
		{ id: "12", name: "Josei" },
		{ id: "13", name: "Martial Arts" },
		{ id: "14", name: "Mature" },
		{ id: "15", name: "Mecha" },
		{ id: "16", name: "Mystery" },
		{ id: "17", name: "One Shot" },
		{ id: "18", name: "Psychological" },
		{ id: "19", name: "Romance" },
		{ id: "20", name: "School Life" },
		{ id: "21", name: "Sci-fi" },
		{ id: "22", name: "Seinen" },
		{ id: "23", name: "Shoujo" },
		{ id: "24", name: "Shounen" },
		{ id: "25", name: "Slice of Life" },
		{ id: "26", name: "Sports" },
		{ id: "27", name: "Supernatural" },
		{ id: "28", name: "Tragedy" },
		{ id: "29", name: "Isekai" },
	];
}
