import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const FALLENANGELS_DOMAIN = "https://manga.fascans.com";

export const FallenAngelsInfo: SourceInfo = {
	version: "1.0.0",
	name: "FallenAngels",
	description: "Extension that pulls manga from manga.fascans.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: FALLENANGELS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
	],
};

export class FallenAngels extends Mmrcms {
	baseUrl: string = FALLENANGELS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.ENGLISH;
	sourceTraversalPathName: string = "manga";
}